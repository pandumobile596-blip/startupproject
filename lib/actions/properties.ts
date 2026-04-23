"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const PropertySchema = z.object({
  name: z.string().min(1, "Name is required"),
  address_line1: z.string().min(1, "Address is required"),
  address_line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().length(2, "Use 2-letter state code"),
  zip: z.string().min(5, "ZIP code is required"),
  property_type: z.enum(["single_family", "multi_family", "condo", "commercial"]),
  purchase_price: z.coerce.number().positive().optional().nullable(),
  purchase_date: z.string().optional().nullable(),
  mortgage_balance: z.coerce.number().positive().optional().nullable(),
});

export async function createProperty(_prevState: unknown, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = PropertySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { error } = await supabase.from("properties").insert({
    ...parsed.data,
    landlord_id: user.id,
    purchase_price: parsed.data.purchase_price ?? null,
    purchase_date: parsed.data.purchase_date || null,
    mortgage_balance: parsed.data.mortgage_balance ?? null,
  });

  if (error) return { error: error.message };

  revalidatePath("/properties");
  redirect("/properties");
}

export async function updateProperty(id: string, _prevState: unknown, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = PropertySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { error } = await supabase
    .from("properties")
    .update({
      ...parsed.data,
      purchase_price: parsed.data.purchase_price ?? null,
      purchase_date: parsed.data.purchase_date || null,
      mortgage_balance: parsed.data.mortgage_balance ?? null,
    })
    .eq("id", id)
    .eq("landlord_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/properties");
  revalidatePath(`/properties/${id}`);
  redirect(`/properties/${id}`);
}

export async function deleteProperty(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("properties")
    .delete()
    .eq("id", id)
    .eq("landlord_id", user.id);

  revalidatePath("/properties");
  redirect("/properties");
}

const UnitSchema = z.object({
  unit_number: z.string().min(1, "Unit number is required"),
  bedrooms: z.coerce.number().int().min(0),
  bathrooms: z.coerce.number().min(0),
  square_feet: z.coerce.number().int().positive().optional().nullable(),
  status: z.enum(["vacant", "occupied", "maintenance"]),
  market_rent: z.coerce.number().positive().optional().nullable(),
});

export async function createUnit(propertyId: string, _prevState: unknown, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = UnitSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { error } = await supabase.from("units").insert({
    ...parsed.data,
    property_id: propertyId,
    square_feet: parsed.data.square_feet ?? null,
    market_rent: parsed.data.market_rent ?? null,
  });

  if (error) return { error: error.message };

  revalidatePath(`/properties/${propertyId}`);
  redirect(`/properties/${propertyId}`);
}
