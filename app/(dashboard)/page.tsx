import { createClient } from "@/lib/supabase/server";
import { formatUSD } from "@/lib/utils/currency";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

async function getDashboardStats(landlordId: string) {
  const supabase = await createClient();

  const currentYear = new Date().getFullYear();
  const yearStart = `${currentYear}-01-01`;

  // Fetch property IDs first so we can scope unit query without a subquery.
  const { data: propertyRows } = await supabase
    .from("properties")
    .select("id")
    .eq("landlord_id", landlordId);

  const propertyIds = (propertyRows ?? []).map((p) => p.id);

  const [paymentsResult, expensesResult, unitsResult] = await Promise.all([
    supabase
      .from("payments")
      .select("amount")
      .eq("landlord_id", landlordId)
      .eq("status", "completed")
      .eq("payment_type", "rent")
      .gte("payment_date", yearStart),
    supabase
      .from("expenses")
      .select("amount")
      .eq("landlord_id", landlordId)
      .gte("expense_date", yearStart),
    propertyIds.length > 0
      ? supabase.from("units").select("status").in("property_id", propertyIds)
      : Promise.resolve({ data: [] }),
  ]);

  const grossRent = (paymentsResult.data ?? []).reduce(
    (sum, p) => sum + Number(p.amount),
    0
  );
  const totalExpenses = (expensesResult.data ?? []).reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );
  const units = unitsResult.data ?? [];
  const totalUnits = units.length;
  const vacantUnits = units.filter((u) => u.status === "vacant").length;

  return {
    grossRent,
    totalExpenses,
    noi: grossRent - totalExpenses,
    totalUnits,
    vacantUnits,
    occupancyRate: totalUnits > 0 ? ((totalUnits - vacantUnits) / totalUnits) * 100 : 0,
  };
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const stats = await getDashboardStats(user!.id);
  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Year-to-date performance for {currentYear}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        <StatCard title="Gross Rent Collected" value={formatUSD(stats.grossRent)} />
        <StatCard title="Total Expenses" value={formatUSD(stats.totalExpenses)} />
        <StatCard
          title="Net Operating Income"
          value={formatUSD(stats.noi)}
          highlight={stats.noi >= 0 ? "positive" : "negative"}
        />
        <StatCard title="Total Units" value={String(stats.totalUnits)} />
        <StatCard title="Vacant Units" value={String(stats.vacantUnits)} />
        <StatCard
          title="Occupancy Rate"
          value={`${stats.occupancyRate.toFixed(1)}%`}
          highlight={stats.occupancyRate >= 90 ? "positive" : "neutral"}
        />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  highlight,
}: {
  title: string;
  value: string;
  highlight?: "positive" | "negative" | "neutral";
}) {
  const valueColor =
    highlight === "positive"
      ? "text-green-600 dark:text-green-400"
      : highlight === "negative"
        ? "text-destructive"
        : "text-foreground";

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-2xl font-semibold ${valueColor}`}>{value}</p>
      </CardContent>
    </Card>
  );
}
