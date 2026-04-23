import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatUSD } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/dates";
import { Button } from "@/components/ui/button";
import { AddUnitForm } from "@/components/properties/add-unit-form";
import { DeletePropertyButton } from "@/components/properties/delete-property-button";
import { ArrowLeft, Plus } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Property Detail" };

const statusColors: Record<string, string> = {
  occupied: "text-green-600 dark:text-green-400",
  vacant: "text-amber-600 dark:text-amber-400",
  maintenance: "text-red-600 dark:text-red-400",
};

const typeLabels: Record<string, string> = {
  single_family: "Single Family", multi_family: "Multi-Family",
  condo: "Condo", commercial: "Commercial",
};

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: property } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .eq("landlord_id", user!.id)
    .single();

  if (!property) notFound();

  const { data: units } = await supabase
    .from("units")
    .select("*")
    .eq("property_id", id)
    .order("unit_number");

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <Link href="/properties" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Properties
          </Link>
          <h1 className="text-2xl font-semibold">{property.name}</h1>
          <p className="text-sm text-muted-foreground">
            {property.address_line1}{property.address_line2 ? `, ${property.address_line2}` : ""}, {property.city}, {property.state} {property.zip}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <DeletePropertyButton id={property.id} />
        </div>
      </div>

      {/* Property Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Type", value: typeLabels[property.property_type] },
          { label: "Purchase Price", value: property.purchase_price ? formatUSD(property.purchase_price) : "—" },
          { label: "Purchase Date", value: property.purchase_date ? formatDate(property.purchase_date) : "—" },
          { label: "Mortgage Balance", value: property.mortgage_balance ? formatUSD(property.mortgage_balance) : "—" },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-lg border border-border bg-card p-4 space-y-1">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm font-medium">{value}</p>
          </div>
        ))}
      </div>

      {/* Units */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Units ({units?.length ?? 0})</h2>
        </div>

        {units && units.length > 0 && (
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  {["Unit", "Beds", "Baths", "Sq Ft", "Market Rent", "Status"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left font-medium text-muted-foreground text-xs">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {units.map((unit) => (
                  <tr key={unit.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium">{unit.unit_number}</td>
                    <td className="px-4 py-3">{unit.bedrooms}</td>
                    <td className="px-4 py-3">{unit.bathrooms}</td>
                    <td className="px-4 py-3">{unit.square_feet ?? "—"}</td>
                    <td className="px-4 py-3">{unit.market_rent ? formatUSD(unit.market_rent) : "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`capitalize font-medium ${statusColors[unit.status]}`}>
                        {unit.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <AddUnitForm propertyId={id} />
      </div>
    </div>
  );
}
