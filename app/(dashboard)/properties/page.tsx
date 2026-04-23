import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatUSD } from "@/lib/utils/currency";
import { Button } from "@/components/ui/button";
import { Building2, Plus } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Properties" };

export default async function PropertiesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: properties } = await supabase
    .from("properties")
    .select("id, name, address_line1, city, state, zip, property_type, mortgage_balance")
    .eq("landlord_id", user!.id)
    .order("created_at", { ascending: false });

  // Count units per property
  const propertyIds = (properties ?? []).map((p) => p.id);
  const { data: units } = propertyIds.length > 0
    ? await supabase.from("units").select("property_id, status").in("property_id", propertyIds)
    : { data: [] };

  const unitMap = (units ?? []).reduce<Record<string, { total: number; vacant: number }>>(
    (acc, u) => {
      if (!acc[u.property_id]) acc[u.property_id] = { total: 0, vacant: 0 };
      acc[u.property_id].total++;
      if (u.status === "vacant") acc[u.property_id].vacant++;
      return acc;
    },
    {}
  );

  const typeLabels: Record<string, string> = {
    single_family: "Single Family",
    multi_family: "Multi-Family",
    condo: "Condo",
    commercial: "Commercial",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Properties</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {properties?.length ?? 0} propert{properties?.length === 1 ? "y" : "ies"}
          </p>
        </div>
        <Button asChild>
          <Link href="/properties/new">
            <Plus className="h-4 w-4" />
            Add Property
          </Link>
        </Button>
      </div>

      {(!properties || properties.length === 0) ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center space-y-3">
          <Building2 className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium">No properties yet</p>
          <p className="text-sm text-muted-foreground">Add your first property to get started.</p>
          <Button asChild size="sm">
            <Link href="/properties/new">Add Property</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => {
            const counts = unitMap[p.id] ?? { total: 0, vacant: 0 };
            return (
              <Link
                key={p.id}
                href={`/properties/${p.id}`}
                className="rounded-xl border border-border bg-card p-5 space-y-3 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-semibold text-base leading-tight">{p.name}</h2>
                  <span className="shrink-0 text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                    {typeLabels[p.property_type]}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-snug">
                  {p.address_line1}<br />{p.city}, {p.state} {p.zip}
                </p>
                <div className="flex items-center gap-4 text-sm pt-1 border-t border-border">
                  <span>{counts.total} unit{counts.total !== 1 ? "s" : ""}</span>
                  {counts.vacant > 0 && (
                    <span className="text-amber-600 dark:text-amber-400">
                      {counts.vacant} vacant
                    </span>
                  )}
                  {p.mortgage_balance && (
                    <span className="ml-auto text-muted-foreground">
                      {formatUSD(p.mortgage_balance)} balance
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
