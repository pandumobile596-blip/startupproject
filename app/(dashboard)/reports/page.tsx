import { createClient } from "@/lib/supabase/server";
import { formatUSD } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/dates";
import { AlertTriangle } from "lucide-react";
import { ExportButton } from "@/components/reports/export-button";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Reports" };

const categoryLabel: Record<string, string> = {
  mortgage: "Mortgage", insurance: "Insurance", taxes: "Property Taxes",
  maintenance: "Maintenance", repairs: "Repairs", utilities: "Utilities",
  management: "Management", advertising: "Advertising", legal: "Legal", other: "Other",
};

const leaseStatusStyle: Record<string, string> = {
  active: "text-green-600 dark:text-green-400",
  pending: "text-amber-600 dark:text-amber-400",
  expired: "text-muted-foreground",
  terminated: "text-destructive",
};

export default async function ReportsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const currentYear = new Date().getFullYear();

  // Fetch all data in parallel
  const [
    { data: properties },
    { data: payments },
    { data: expenses },
    { data: leases },
  ] = await Promise.all([
    supabase.from("properties").select("id, name").eq("landlord_id", user!.id),
    supabase.from("payments")
      .select("amount, payment_date, payment_type, lease_id, leases(unit_id, units(property_id))")
      .eq("landlord_id", user!.id)
      .eq("status", "completed")
      .gte("payment_date", `${currentYear}-01-01`),
    supabase.from("expenses")
      .select("id, category, amount, expense_date, vendor_name, property_id, is_tax_deductible, tax_year")
      .eq("landlord_id", user!.id)
      .eq("tax_year", currentYear),
    supabase.from("leases")
      .select(`
        id, rent_amount, status, start_date, end_date, payment_due_day,
        tenants(first_name, last_name),
        units(unit_number, properties(name))
      `)
      .eq("landlord_id", user!.id)
      .order("status"),
  ]);

  // ── NOI per property ─────────────────────────────────────────────────────
  const rentByProperty: Record<string, number> = {};
  (payments ?? []).forEach((p) => {
    if (p.payment_type !== "rent") return;
    const lease = p.leases as { unit_id: string; units: { property_id: string } | null } | null;
    const propId = lease?.units?.property_id;
    if (propId) rentByProperty[propId] = (rentByProperty[propId] ?? 0) + Number(p.amount);
  });

  const expenseByProperty: Record<string, number> = {};
  const expenseByCategory: Record<string, number> = {};
  let totalExpenses = 0;
  (expenses ?? []).forEach((e) => {
    totalExpenses += Number(e.amount);
    if (e.property_id) expenseByProperty[e.property_id] = (expenseByProperty[e.property_id] ?? 0) + Number(e.amount);
    expenseByCategory[e.category] = (expenseByCategory[e.category] ?? 0) + Number(e.amount);
  });

  const totalRent = Object.values(rentByProperty).reduce((s, v) => s + v, 0);
  const totalNOI = totalRent - totalExpenses;

  // ── 1099 vendors ─────────────────────────────────────────────────────────
  const vendorTotals: Record<string, number> = {};
  (expenses ?? []).forEach((e) => {
    if (e.vendor_name) vendorTotals[e.vendor_name] = (vendorTotals[e.vendor_name] ?? 0) + Number(e.amount);
  });
  const vendors1099 = Object.entries(vendorTotals)
    .filter(([, t]) => t >= 600)
    .sort(([, a], [, b]) => b - a);

  return (
    <div className="space-y-10 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Reports</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Year-to-date — {currentYear}</p>
        </div>
        <div className="flex gap-2">
          <ExportButton type="rent-roll" label="Export Rent Roll" />
          <ExportButton type="expenses" label="Export Expenses" />
        </div>
      </div>

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Gross Rent Collected", value: formatUSD(totalRent), color: "text-green-600 dark:text-green-400" },
          { label: "Total Expenses", value: formatUSD(totalExpenses), color: "text-destructive" },
          { label: "Net Operating Income", value: formatUSD(totalNOI), color: totalNOI >= 0 ? "text-green-600 dark:text-green-400" : "text-destructive" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-5 space-y-1">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className={`text-2xl font-semibold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* ── NOI per Property ── */}
      {(properties ?? []).length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">NOI by Property</h2>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  {["Property", "Rent Collected", "Expenses", "NOI"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left font-medium text-muted-foreground text-xs">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(properties ?? []).map((p) => {
                  const rent = rentByProperty[p.id] ?? 0;
                  const exp = expenseByProperty[p.id] ?? 0;
                  const noi = rent - exp;
                  return (
                    <tr key={p.id}>
                      <td className="px-4 py-3 font-medium">{p.name}</td>
                      <td className="px-4 py-3">{formatUSD(rent)}</td>
                      <td className="px-4 py-3">{formatUSD(exp)}</td>
                      <td className={`px-4 py-3 font-medium ${noi >= 0 ? "text-green-600 dark:text-green-400" : "text-destructive"}`}>
                        {formatUSD(noi)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ── Expense Breakdown by Category ── */}
      {Object.keys(expenseByCategory).length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Expenses by Category</h2>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  {["Category", "Total", "% of Expenses"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left font-medium text-muted-foreground text-xs">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {Object.entries(expenseByCategory)
                  .sort(([, a], [, b]) => b - a)
                  .map(([cat, amt]) => (
                    <tr key={cat}>
                      <td className="px-4 py-3 capitalize">{categoryLabel[cat] ?? cat}</td>
                      <td className="px-4 py-3">{formatUSD(amt)}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {totalExpenses > 0 ? ((amt / totalExpenses) * 100).toFixed(1) : 0}%
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ── 1099-NEC Vendor Flags ── */}
      {vendors1099.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">1099-NEC Vendor Flags</h2>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-sm text-muted-foreground">
            These vendors were paid $600 or more in {currentYear}. You may be required to file a 1099-NEC with the IRS.
          </p>
          <div className="rounded-xl border border-amber-200 dark:border-amber-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-amber-50 dark:bg-amber-900/20">
                <tr>
                  {["Vendor / Payee", `Total Paid (${currentYear})`, "Action Required"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left font-medium text-amber-800 dark:text-amber-300 text-xs">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100 dark:divide-amber-900">
                {vendors1099.map(([name, total]) => (
                  <tr key={name}>
                    <td className="px-4 py-3 font-medium">{name}</td>
                    <td className="px-4 py-3">{formatUSD(total)}</td>
                    <td className="px-4 py-3 text-amber-700 dark:text-amber-400 text-xs font-medium">File 1099-NEC by Jan 31</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ── Rent Roll ── */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Rent Roll</h2>
        {(!leases || leases.length === 0) ? (
          <p className="text-sm text-muted-foreground">No leases on record yet.</p>
        ) : (
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  {["Tenant", "Property / Unit", "Rent/mo", "Due Day", "Start", "End", "Status"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left font-medium text-muted-foreground text-xs">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {leases.map((l) => {
                  const tenant = l.tenants as { first_name: string; last_name: string } | null;
                  const unit = l.units as { unit_number: string; properties: { name: string } | null } | null;
                  return (
                    <tr key={l.id}>
                      <td className="px-4 py-3 font-medium">{tenant ? `${tenant.first_name} ${tenant.last_name}` : "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {unit ? `${unit.properties?.name} — ${unit.unit_number}` : "—"}
                      </td>
                      <td className="px-4 py-3">{formatUSD(l.rent_amount)}</td>
                      <td className="px-4 py-3">{l.payment_due_day}</td>
                      <td className="px-4 py-3">{formatDate(l.start_date)}</td>
                      <td className="px-4 py-3">{l.end_date ? formatDate(l.end_date) : "Month-to-month"}</td>
                      <td className={`px-4 py-3 capitalize font-medium ${leaseStatusStyle[l.status]}`}>{l.status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
