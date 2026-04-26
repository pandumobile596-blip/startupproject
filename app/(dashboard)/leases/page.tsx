import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatUSD } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/dates";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { FileText, Plus } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Leases" };

const statusStyle: Record<string, string> = {
  active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  expired: "bg-muted text-muted-foreground",
  terminated: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default async function LeasesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: leases } = await supabase
    .from("leases")
    .select(`
      id, start_date, end_date, rent_amount, status, payment_due_day,
      tenants(first_name, last_name),
      units(unit_number, properties(name))
    `)
    .eq("landlord_id", user!.id)
    .order("start_date", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Leases</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {leases?.length ?? 0} lease{leases?.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button asChild>
          <Link href="/leases/new">
            <Plus className="h-4 w-4" /> New Lease
          </Link>
        </Button>
      </div>

      {(!leases || leases.length === 0) ? (
        <EmptyState
          icon={FileText}
          title="No leases yet"
          description="Create a lease to link a tenant to a unit and set the rent amount, due date, and term."
          tip="Leases are the foundation of payment tracking. Once a lease is active, Landlord Ledger can tell you exactly who has paid and who hasn't — each month."
          ctaLabel="Create Your First Lease"
          ctaHref="/leases/new"
        />
      ) : (
        <div className="rounded-xl border border-border overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
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
                  <tr key={l.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium">
                      {tenant ? `${tenant.first_name} ${tenant.last_name}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {unit ? `${unit.properties?.name} — ${unit.unit_number}` : "—"}
                    </td>
                    <td className="px-4 py-3">{formatUSD(l.rent_amount)}</td>
                    <td className="px-4 py-3">{l.payment_due_day}</td>
                    <td className="px-4 py-3">{formatDate(l.start_date)}</td>
                    <td className="px-4 py-3">{l.end_date ? formatDate(l.end_date) : "Month-to-month"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusStyle[l.status]}`}>
                        {l.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
