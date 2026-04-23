import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PaymentForm } from "@/components/payments/payment-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Log Payment" };

export default async function NewPaymentPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: leases } = await supabase
    .from("leases")
    .select(`
      id, rent_amount,
      tenants(first_name, last_name),
      units(unit_number, properties(name))
    `)
    .eq("landlord_id", user.id)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Log Payment</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Record a payment received from a tenant.</p>
      </div>
      <PaymentForm leases={leases ?? []} />
    </div>
  );
}
