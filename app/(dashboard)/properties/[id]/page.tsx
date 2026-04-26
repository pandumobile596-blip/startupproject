import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatUSD } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/dates";
import { Button } from "@/components/ui/button";
import { AddUnitForm } from "@/components/properties/add-unit-form";
import { DeletePropertyButton } from "@/components/properties/delete-property-button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  CreditCard,
  FileText,
  Edit,
  Home,
  Users,
} from "lucide-react";
import type { Metadata } from "next";

const typeLabels: Record<string, string> = {
  single_family: "Single Family",
  multi_family: "Multi-Family",
  condo: "Condo",
  commercial: "Commercial",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: property } = await supabase
    .from("properties")
    .select("name")
    .eq("id", id)
    .single();
  return { title: property?.name ?? "Property Detail" };
}

type ActiveLease = {
  id: string;
  rent_amount: number;
  end_date: string | null;
  status: string;
  tenant_id: string;
  tenants: { first_name: string; last_name: string } | null;
};

type UnitRow = {
  id: string;
  unit_number: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number | null;
  status: string;
  market_rent: number | null;
  activeLease: ActiveLease | null;
};

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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

  // Fetch units with their active leases and tenant info
  const { data: rawUnits } = await supabase
    .from("units")
    .select(
      `id, unit_number, bedrooms, bathrooms, square_feet, status, market_rent,
       leases(id, rent_amount, end_date, status, tenant_id,
         tenants(first_name, last_name)
       )`
    )
    .eq("property_id", id)
    .order("unit_number");

  // Attach only the most relevant active/pending lease per unit
  const units: UnitRow[] = (rawUnits ?? []).map((u) => {
    const allLeases = (u.leases ?? []) as ActiveLease[];
    const activeLease =
      allLeases.find((l) => l.status === "active") ??
      allLeases.find((l) => l.status === "pending") ??
      null;
    return {
      id: u.id,
      unit_number: u.unit_number,
      bedrooms: u.bedrooms,
      bathrooms: u.bathrooms,
      square_feet: u.square_feet,
      status: u.status,
      market_rent: u.market_rent,
      activeLease,
    };
  });

  const occupiedCount = units.filter((u) => u.status === "occupied").length;
  const vacantCount = units.filter((u) => u.status === "vacant").length;
  const monthlyIncome = units.reduce(
    (sum, u) => sum + (u.activeLease ? Number(u.activeLease.rent_amount) : 0),
    0
  );

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Properties", href: "/properties" },
          { label: property.name },
        ]}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">{property.name}</h1>
          <p className="text-sm text-muted-foreground">
            {property.address_line1}
            {property.address_line2 ? `, ${property.address_line2}` : ""},{" "}
            {property.city}, {property.state} {property.zip}
          </p>
        </div>
        <DeletePropertyButton id={property.id} />
      </div>

      {/* Property Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Type", value: typeLabels[property.property_type] },
          {
            label: "Occupancy",
            value:
              units.length > 0
                ? `${occupiedCount}/${units.length} units`
                : "No units yet",
            sub:
              units.length > 0
                ? `${Math.round((occupiedCount / units.length) * 100)}%`
                : undefined,
          },
          {
            label: "Monthly Income",
            value: monthlyIncome > 0 ? formatUSD(monthlyIncome) : "—",
          },
          {
            label: "Mortgage Balance",
            value: property.mortgage_balance
              ? formatUSD(property.mortgage_balance)
              : "—",
          },
        ].map(({ label, value, sub }) => (
          <div
            key={label}
            className="rounded-lg border border-border bg-card p-4 space-y-1"
          >
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm font-semibold">{value}</p>
            {sub && (
              <p className="text-xs text-muted-foreground">{sub} occupied</p>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href={`/leases/new`}>
            <FileText className="h-3.5 w-3.5" />
            New Lease
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/tenants/new">
            <Users className="h-3.5 w-3.5" />
            Add Tenant
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/payments/new">
            <CreditCard className="h-3.5 w-3.5" />
            Log Payment
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/reports">
            <Home className="h-3.5 w-3.5" />
            View Reports
          </Link>
        </Button>
      </div>

      {/* Units */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Units ({units.length})
            </h2>
            {units.length > 0 && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {occupiedCount} occupied · {vacantCount} vacant
                {monthlyIncome > 0 && ` · ${formatUSD(monthlyIncome)}/mo income`}
              </p>
            )}
          </div>
        </div>

        {units.length > 0 && (
          <div className="rounded-xl border border-border overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="bg-muted/40 border-b border-border">
                  {[
                    "Unit",
                    "Status",
                    "Tenant",
                    "Monthly Rent",
                    "Lease Ends",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2.5 text-left font-medium text-muted-foreground text-xs"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {units.map((unit) => {
                  const lease = unit.activeLease;
                  const tenant = lease?.tenants ?? null;
                  const isOccupied = unit.status === "occupied";
                  const isVacant = unit.status === "vacant";

                  return (
                    <tr
                      key={unit.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      {/* Unit number */}
                      <td className="px-4 py-3">
                        <span className="font-semibold">{unit.unit_number}</span>
                        {(unit.bedrooms > 0 || unit.bathrooms > 0) && (
                          <span className="ml-1.5 text-xs text-muted-foreground">
                            {unit.bedrooms}bd/{unit.bathrooms}ba
                          </span>
                        )}
                      </td>

                      {/* Status badge */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            isOccupied
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : unit.status === "maintenance"
                              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                          }`}
                        >
                          {isVacant
                            ? "Vacant"
                            : unit.status === "maintenance"
                            ? "Maintenance"
                            : "Occupied"}
                        </span>
                      </td>

                      {/* Tenant */}
                      <td className="px-4 py-3">
                        {tenant ? (
                          <span className="font-medium">
                            {tenant.first_name} {tenant.last_name}
                          </span>
                        ) : (
                          <span className="text-muted-foreground italic text-xs">
                            No tenant
                          </span>
                        )}
                      </td>

                      {/* Rent */}
                      <td className="px-4 py-3">
                        {lease ? (
                          <span className="font-medium tabular-nums">
                            {formatUSD(Number(lease.rent_amount))}
                          </span>
                        ) : unit.market_rent ? (
                          <span className="text-muted-foreground tabular-nums text-xs">
                            {formatUSD(unit.market_rent)} market
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>

                      {/* Lease end */}
                      <td className="px-4 py-3 text-muted-foreground">
                        {lease?.end_date
                          ? formatDate(lease.end_date)
                          : lease
                          ? "Month-to-month"
                          : "—"}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {isVacant || !lease ? (
                            <Button
                              asChild
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                            >
                              <Link
                                href={`/leases/new?unit_id=${unit.id}`}
                              >
                                <FileText className="h-3 w-3" />
                                Create Lease
                              </Link>
                            </Button>
                          ) : (
                            <Button
                              asChild
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                            >
                              <Link
                                href={`/payments/new?lease_id=${lease.id}&amount=${lease.rent_amount}`}
                              >
                                <CreditCard className="h-3 w-3" />
                                Log Payment
                              </Link>
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {units.length === 0 && (
          <div className="rounded-xl border border-dashed border-border py-10 text-center">
            <p className="text-sm text-muted-foreground">
              No units yet. Add a unit below to start tracking tenants and rent.
            </p>
          </div>
        )}

        {/* Add unit inline form */}
        <AddUnitForm propertyId={id} />
      </div>

      {/* Financial details (collapsed section) */}
      {(property.purchase_price || property.purchase_date) && (
        <div className="rounded-xl border border-border bg-card/50 p-5 space-y-3">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Edit className="h-3.5 w-3.5 text-muted-foreground" />
            Financial Details
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            {[
              {
                label: "Purchase Price",
                value: property.purchase_price
                  ? formatUSD(property.purchase_price)
                  : "—",
              },
              {
                label: "Purchase Date",
                value: property.purchase_date
                  ? formatDate(property.purchase_date)
                  : "—",
              },
              {
                label: "Mortgage Balance",
                value: property.mortgage_balance
                  ? formatUSD(property.mortgage_balance)
                  : "—",
              },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="font-medium mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
