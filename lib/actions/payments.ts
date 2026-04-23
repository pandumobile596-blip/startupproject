"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const PaymentSchema = z.object({
  lease_id: z.string().uuid("Select a lease"),
  amount: z.coerce.number().positive("Amount must be positive"),
  payment_date: z.string().min(1, "Payment date is required"),
  due_date: z.string().min(1, "Due date is required"),
  payment_method: z.enum(["ach", "check", "cash", "other"]),
  payment_type: z.enum(["rent", "security_deposit", "late_fee", "other"]),
  notes: z.string().optional(),
});

export async function createPayment(_prevState: unknown, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = PaymentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { data: lease, error: leaseError } = await supabase
    .from("leases")
    .select("tenant_id")
    .eq("id", parsed.data.lease_id)
    .eq("landlord_id", user.id)
    .single();

  if (leaseError || !lease) return { error: "Lease not found" };

  const { error } = await supabase.from("payments").insert({
    ...parsed.data,
    landlord_id: user.id,
    tenant_id: lease.tenant_id,
    status: "completed",
    notes: parsed.data.notes || null,
  });

  if (error) return { error: error.message };

  revalidatePath("/payments");
  redirect("/payments");
}

export async function deletePayment(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("payments")
    .delete()
    .eq("id", id)
    .eq("landlord_id", user.id);

  revalidatePath("/payments");
}
