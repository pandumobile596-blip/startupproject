"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const ExpenseSchema = z.object({
  property_id: z.string().uuid().optional().nullable(),
  category: z.enum([
    "mortgage", "insurance", "taxes", "maintenance", "repairs",
    "utilities", "management", "advertising", "legal", "other",
  ]),
  amount: z.coerce.number().positive("Amount must be positive"),
  expense_date: z.string().min(1, "Date is required"),
  vendor_name: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  is_tax_deductible: z.coerce.boolean().default(true),
});

export async function createExpense(_prevState: unknown, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const raw = Object.fromEntries(formData);
  // Checkbox sends "on" when checked, absent when unchecked
  raw.is_tax_deductible = formData.get("is_tax_deductible") === "on" ? "true" : "false";

  const parsed = ExpenseSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { error } = await supabase.from("expenses").insert({
    ...parsed.data,
    landlord_id: user.id,
    property_id: parsed.data.property_id || null,
    vendor_name: parsed.data.vendor_name || null,
  });

  if (error) return { error: error.message };

  revalidatePath("/expenses");
  revalidatePath("/reports");
  redirect("/expenses");
}

export async function deleteExpense(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("expenses")
    .delete()
    .eq("id", id)
    .eq("landlord_id", user.id);

  revalidatePath("/expenses");
  revalidatePath("/reports");
}
