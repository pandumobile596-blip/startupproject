import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LeaseForm } from "@/components/leases/lease-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "New Lease" };

export default async function NewLeasePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  const [{ data: tenants }, { data: properties }] = await Promise.all([
    supabase.from("tenants").select("id, first_name, last_name").eq("landlord_id", user.id).order("last_name"),
    supabase.from("properties").select("id, name, units(id, unit_number, status)").eq("landlord_id", user.id).order("name"),
  ]);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">New Lease</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Link a unit and tenant with rent terms.</p>
      </div>
      <LeaseForm tenants={tenants ?? []} properties={properties ?? []} />
    </div>
  );
}
