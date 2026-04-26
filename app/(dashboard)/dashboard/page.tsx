import { createClient } from "@/lib/supabase/server";
import { formatUSD } from "@/lib/utils/currency";
import { Button } from "@/components/ui/button";
import { getRentStatus, getDetailedRentStatus, calcLateFee } from "@/lib/dashboard/rent-status";
import { OnboardingWidget } from "@/components/onboarding/onboarding-widget";
import { RentStatusTable, type RentStatusRow } from "@/components/dashboard/rent-status-table";
import Link from "next/link";
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

async function getMonthlyRentSnapshot(landlordId: string) {
  const supabase = await createClient();
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const monthStartIso = monthStart.toISOString().slice(0, 10);
  const nextMonthStartIso = nextMonthStart.toISOString().slice(0, 10);

  const [{ data: leaseRows }, { data: paymentRows }] = await Promise.all([
    supabase
      .from("leases")
      .select("id, rent_amount, payment_due_day, status")
      .eq("landlord_id", landlordId)
      .in("status", ["active", "pending"]),
    // Pull real completed rent payments for this month when available.
    supabase
      .from("payments")
      .select("amount, lease_id")
      .eq("landlord_id", landlordId)
      .eq("payment_type", "rent")
      .eq("status", "completed")
      .gte("payment_date", monthStartIso)
      .lt("payment_date", nextMonthStartIso),
  ]);

  const activeLeases = leaseRows ?? [];
  const monthPayments = paymentRows ?? [];

  const expectedRent = activeLeases.reduce(
    (sum, lease) => sum + Number(lease.rent_amount),
    0
  );
  const collectedRent = monthPayments.reduce(
    (sum, payment) => sum + Number(payment.amount),
    0
  );
  const outstandingRent = Math.max(expectedRent - collectedRent, 0);

  const paidLeaseIds = new Set(monthPayments.map((p) => p.lease_id));
  const statusRollup = activeLeases.reduce(
    (acc, lease) => {
      const status = getRentStatus({
        dueDay: lease.payment_due_day,
        currentDate: now,
        paid: paidLeaseIds.has(lease.id),
      });
      acc.total += 1;
      if (status === "late") acc.late += 1;
      if (status === "due_soon") acc.dueSoon += 1;
      if (!paidLeaseIds.has(lease.id)) acc.unpaid += 1;
      return acc;
    },
    { total: 0, late: 0, dueSoon: 0, unpaid: 0 }
  );

  return {
    expectedRent,
    collectedRent,
    outstandingRent,
    ...statusRollup,
  };
}

async function getRentStatusRows(landlordId: string): Promise<RentStatusRow[]> {
  const supabase = await createClient();
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .slice(0, 10);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    .toISOString()
    .slice(0, 10);

  const [{ data: leases }, { data: payments }] = await Promise.all([
    supabase
      .from("leases")
      .select(
        `id, rent_amount, payment_due_day, grace_period_days,
         late_fee_amount, late_fee_type,
         tenants(first_name, last_name),
         units(unit_number, properties(name))`
      )
      .eq("landlord_id", landlordId)
      .eq("status", "active"),
    supabase
      .from("payments")
      .select("lease_id")
      .eq("landlord_id", landlordId)
      .eq("payment_type", "rent")
      .eq("status", "completed")
      .gte("payment_date", monthStart)
      .lt("payment_date", nextMonthStart),
  ]);

  const paidLeaseIds = new Set((payments ?? []).map((p: { lease_id: string }) => p.lease_id));

  const rows: RentStatusRow[] = (leases ?? []).map((lease: {
    id: string;
    rent_amount: number;
    payment_due_day: number;
    grace_period_days: number;
    late_fee_amount: number | null;
    late_fee_type: string | null;
    tenants: unknown;
    units: unknown;
  }) => {
    const paid = paidLeaseIds.has(lease.id);
    const status = getDetailedRentStatus({
      dueDay: lease.payment_due_day,
      gracePeriodDays: lease.grace_period_days,
      currentDate: now,
      paid,
    });

    const lateFee =
      status === "overdue"
        ? calcLateFee(
            Number(lease.rent_amount),
            lease.late_fee_amount ? Number(lease.late_fee_amount) : null,
            lease.late_fee_type as "flat" | "percentage" | null
          )
        : 0;

    const tenant = lease.tenants as { first_name: string; last_name: string } | null;
    const unit = lease.units as {
      unit_number: string;
      properties: { name: string } | null;
    } | null;

    return {
      leaseId: lease.id,
      tenantName: tenant ? `${tenant.first_name} ${tenant.last_name}` : "Unknown",
      unit: unit
        ? `${unit.properties?.name ?? ""}${unit.properties?.name ? " — " : ""}${unit.unit_number}`
        : "—",
      rentAmount: Number(lease.rent_amount),
      dueDay: lease.payment_due_day,
      status,
      lateFee,
    };
  });

  // Sort: overdue → unpaid → paid
  const order: Record<RentStatusRow["status"], number> = { overdue: 0, due: 1, paid: 2 };
  return rows.sort((a, b) => order[a.status] - order[b.status]);
}

async function getOnboardingStatus(landlordId: string) {
  const supabase = await createClient();

  const [{ data: properties }, { data: tenants }, { data: leases }, { data: payments }] =
    await Promise.all([
      supabase.from("properties").select("id").eq("landlord_id", landlordId).limit(1),
      supabase.from("tenants").select("id").eq("landlord_id", landlordId).limit(1),
      supabase.from("leases").select("id").eq("landlord_id", landlordId).limit(1),
      supabase.from("payments").select("id").eq("landlord_id", landlordId).limit(1),
    ]);

  const propertyIds = (properties ?? []).map((p: { id: string }) => p.id);
  const { data: units } =
    propertyIds.length > 0
      ? await supabase.from("units").select("id").in("property_id", propertyIds).limit(1)
      : { data: [] };

  return {
    hasProperty: (properties?.length ?? 0) > 0,
    hasUnit: (units?.length ?? 0) > 0,
    hasTenant: (tenants?.length ?? 0) > 0,
    hasLease: (leases?.length ?? 0) > 0,
    hasPayment: (payments?.length ?? 0) > 0,
  };
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [stats, monthly, onboarding, rentRows] = await Promise.all([
    getDashboardStats(user!.id),
    getMonthlyRentSnapshot(user!.id),
    getOnboardingStatus(user!.id),
    getRentStatusRows(user!.id),
  ]);
  const overdueCount = rentRows.filter((r) => r.status === "overdue").length;
  const currentYear = new Date().getFullYear();
  const missingPercent =
    monthly.expectedRent > 0
      ? (monthly.outstandingRent / monthly.expectedRent) * 100
      : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Year-to-date performance for {currentYear}
        </p>
      </div>

      {/* Onboarding: welcome modal + checklist — client component, hides itself when done */}
      <OnboardingWidget userId={user!.id} stepStatus={onboarding} />

      {monthly.outstandingRent > 0 && (
        <Card className="border-amber-200 bg-amber-50/40 dark:border-amber-800 dark:bg-amber-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Action Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-medium">
              You are missing {formatUSD(monthly.outstandingRent)} this month.
            </p>
            <p className="text-muted-foreground">
              {overdueCount > 0 && (
                <span className="text-destructive font-medium">
                  {overdueCount} overdue
                  {overdueCount !== 1 ? " units" : " unit"},{" "}
                </span>
              )}
              {monthly.dueSoon} due soon, and {monthly.unpaid} still unpaid.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <StatCard title="Expected Rent (This Month)" value={formatUSD(monthly.expectedRent)} />
        <StatCard title="Collected Rent (This Month)" value={formatUSD(monthly.collectedRent)} />
        <StatCard
          title="Missing Rent (This Month)"
          value={formatUSD(monthly.outstandingRent)}
          highlight={monthly.outstandingRent > 0 ? "negative" : "positive"}
        />
      </div>

      <RentStatusTable rows={rentRows} />

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild variant="default" size="sm">
            <Link href="/properties/new">Add Property</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/payments/new">Add Payment</Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            type="button"
            title="Placeholder: reminder delivery integration comes next"
          >
            Send Reminder
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Rent Insight</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p className="font-medium">
            You are missing {missingPercent.toFixed(1)}% of rent this month.
          </p>
          <p className="text-muted-foreground">
            Collecting remaining rent adds {formatUSD(monthly.outstandingRent)}.
          </p>
        </CardContent>
      </Card>

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
