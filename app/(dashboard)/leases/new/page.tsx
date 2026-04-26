import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LeaseForm } from "@/components/leases/lease-form";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "New Lease" };

export default async function NewLeasePage({
  searchParams,
}: {
  searchParams: Promise<{ unit_id?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  const { unit_id: defaultUnitId } = await searchParams;

  const [{ data: tenants }, { data: properties }] = await Promise.all([
    supabase
      .from("tenants")
      .select("id, first_name, last_name")
      .eq("landlord_id", user.id)
      .order("last_name"),
    supabase
      .from("properties")
      .select("id, name, units(id, unit_number, status)")
      .eq("landlord_id", user.id)
      .order("name"),
  ]);

  return (
    <div className="max-w-2xl space-y-6">
      <Breadcrumb
        items={[
          { label: "Leases", href: "/leases" },
          { label: "New Lease" },
        ]}
      />
      <div>
        <h1 className="text-2xl font-semibold">New Lease</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Link a unit and tenant with rent terms.
        </p>
      </div>
      {defaultUnitId && (
        <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 px-4 py-3 text-sm text-blue-700 dark:text-blue-300">
          Unit pre-selected from your property. Review the details below and choose a tenant to complete the lease.
        </div>
      )}
      <LeaseForm
        tenants={tenants ?? []}
        properties={properties ?? []}
        defaultUnitId={defaultUnitId}
      />
    </div>
  );
}
