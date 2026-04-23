"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const TenantSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
});

export async function createTenant(_prevState: unknown, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = TenantSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { error } = await supabase.from("tenants").insert({
    ...parsed.data,
    landlord_id: user.id,
    phone: parsed.data.phone || null,
    emergency_contact_name: parsed.data.emergency_contact_name || null,
    emergency_contact_phone: parsed.data.emergency_contact_phone || null,
  });

  if (error) return { error: error.message };

  revalidatePath("/tenants");
  redirect("/tenants");
}

export async function updateTenant(id: string, _prevState: unknown, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = TenantSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { error } = await supabase
    .from("tenants")
    .update({
      ...parsed.data,
      phone: parsed.data.phone || null,
      emergency_contact_name: parsed.data.emergency_contact_name || null,
      emergency_contact_phone: parsed.data.emergency_contact_phone || null,
    })
    .eq("id", id)
    .eq("landlord_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/tenants");
  revalidatePath(`/tenants/${id}`);
  redirect(`/tenants/${id}`);
}

export async function deleteTenant(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("tenants")
    .delete()
    .eq("id", id)
    .eq("landlord_id", user.id);

  revalidatePath("/tenants");
  redirect("/tenants");
}
