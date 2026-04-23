"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const LeaseSchema = z.object({
  unit_id: z.string().uuid("Select a unit"),
  tenant_id: z.string().uuid("Select a tenant"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional(),
  rent_amount: z.coerce.number().positive("Rent amount must be positive"),
  security_deposit: z.coerce.number().min(0),
  payment_due_day: z.coerce.number().int().min(1).max(28),
  grace_period_days: z.coerce.number().int().min(0).default(5),
  late_fee_amount: z.coerce.number().positive().optional().nullable(),
  late_fee_type: z.enum(["flat", "percentage"]).optional().nullable(),
  notes: z.string().optional(),
});

export async function createLease(_prevState: unknown, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const raw = Object.fromEntries(formData);
  const parsed = LeaseSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { error } = await supabase.from("leases").insert({
    ...parsed.data,
    landlord_id: user.id,
    end_date: parsed.data.end_date || null,
    late_fee_amount: parsed.data.late_fee_amount ?? null,
    late_fee_type: parsed.data.late_fee_type ?? null,
    notes: parsed.data.notes || null,
    status: "active",
  });

  if (error) return { error: error.message };

  revalidatePath("/leases");
  redirect("/leases");
}

export async function updateLeaseStatus(
  id: string,
  status: "active" | "expired" | "terminated" | "pending"
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("leases")
    .update({ status })
    .eq("id", id)
    .eq("landlord_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/leases");
}
