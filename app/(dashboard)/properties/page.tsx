import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatUSD } from "@/lib/utils/currency";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Building2, Plus, TrendingUp } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Properties" };

const typeLabels: Record<string, string> = {
  single_family: "Single Family",
  multi_family: "Multi-Family",
  condo: "Condo",
  commercial: "Commercial",
};

export default async function PropertiesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: properties } = await supabase
    .from("properties")
    .select("id, name, address_line1, city, state, zip, property_type")
    .eq("landlord_id", user!.id)
    .order("created_at", { ascending: false });

  const propertyIds = (properties ?? []).map((p) => p.id);

  // Units and active leases fetched in parallel
  const [{ data: units }, { data: activeLeases }] = await Promise.all([
    propertyIds.length > 0
      ? supabase
          .from("units")
          .select("property_id, status")
          .in("property_id", propertyIds)
      : Promise.resolve({ data: [] }),
    propertyIds.length > 0
      ? supabase
          .from("leases")
          .select("rent_amount, units(property_id)")
          .eq("landlord_id", user!.id)
          .eq("status", "active")
      : Promise.resolve({ data: [] }),
  ]);

  // Unit stats per property
  const unitMap = (units ?? []).reduce<
    Record<string, { total: number; occupied: number }>
  >((acc, u) => {
    if (!acc[u.property_id]) acc[u.property_id] = { total: 0, occupied: 0 };
    acc[u.property_id].total++;
    if (u.status === "occupied") acc[u.property_id].occupied++;
    return acc;
  }, {});

  // Monthly income per property (from active leases)
  const incomeMap = (activeLeases ?? []).reduce<Record<string, number>>(
    (acc, l) => {
      const unit = l.units as { property_id: string } | null;
      if (unit?.property_id) {
        acc[unit.property_id] = (acc[unit.property_id] ?? 0) + Number(l.rent_amount);
      }
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Properties</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {properties?.length ?? 0}{" "}
            propert{properties?.length === 1 ? "y" : "ies"}
          </p>
        </div>
        <Button asChild>
          <Link href="/properties/new">
            <Plus className="h-4 w-4" />
            Add Property
          </Link>
        </Button>
      </div>

      {!properties || properties.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No properties yet"
          description="Add your first rental property to get started. You can add units, tenants, and leases after."
          tip="Each property can have multiple units. Start by adding the property address, then add units inside it."
          ctaLabel="Add Your First Property"
          ctaHref="/properties/new"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => {
            const counts = unitMap[p.id] ?? { total: 0, occupied: 0 };
            const vacant = counts.total - counts.occupied;
            const occupancyPct =
              counts.total > 0
                ? Math.round((counts.occupied / counts.total) * 100)
                : 0;
            const monthlyIncome = incomeMap[p.id] ?? 0;

            return (
              <Link
                key={p.id}
                href={`/properties/${p.id}`}
                className="group rounded-xl border border-border bg-card p-5 space-y-4 hover:border-primary/50 hover:shadow-md transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors">
                    {p.name}
                  </h2>
                  <span className="shrink-0 text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                    {typeLabels[p.property_type]}
                  </span>
                </div>

                {/* Address */}
                <p className="text-sm text-muted-foreground leading-snug">
                  {p.address_line1}
                  <br />
                  {p.city}, {p.state} {p.zip}
                </p>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-border text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Units</p>
                    <p className="text-sm font-semibold">{counts.total}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Occupancy</p>
                    <p
                      className={`text-sm font-semibold ${
                        occupancyPct === 100
                          ? "text-green-600 dark:text-green-400"
                          : vacant > 0
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-muted-foreground"
                      }`}
                    >
                      {counts.total === 0 ? "—" : `${occupancyPct}%`}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Mo. Income</p>
                    <p
                      className={`text-sm font-semibold ${
                        monthlyIncome > 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-muted-foreground"
                      }`}
                    >
                      {monthlyIncome > 0 ? formatUSD(monthlyIncome) : "—"}
                    </p>
                  </div>
                </div>

                {/* Vacant badge */}
                {vacant > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                    <TrendingUp className="h-3.5 w-3.5" />
                    {vacant} unit{vacant !== 1 ? "s" : ""} vacant
                    {counts.occupied > 0 && (
                      <> — potential {formatUSD((monthlyIncome / counts.occupied) * vacant)}/mo uncollected</>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
