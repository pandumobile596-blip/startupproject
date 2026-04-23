import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatUSD } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/dates";
import { Button } from "@/components/ui/button";
import { DollarSign, Plus } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Payments" };

const statusStyle: Record<string, string> = {
  completed: "text-green-600 dark:text-green-400",
  pending: "text-amber-600 dark:text-amber-400",
  failed: "text-destructive",
  refunded: "text-muted-foreground",
};

const methodLabel: Record<string, string> = {
  ach: "ACH", check: "Check", cash: "Cash", other: "Other",
};

export default async function PaymentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: payments } = await supabase
    .from("payments")
    .select(`
      id, amount, payment_date, due_date, payment_method, payment_type, status,
      tenants(first_name, last_name),
      leases(units(unit_number, properties(name)))
    `)
    .eq("landlord_id", user!.id)
    .order("payment_date", { ascending: false });

  const total = (payments ?? []).reduce((s, p) => s + (p.status === "completed" ? p.amount : 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Payments</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {payments?.length ?? 0} records · {formatUSD(total)} collected
          </p>
        </div>
        <Button asChild>
          <Link href="/payments/new">
            <Plus className="h-4 w-4" /> Log Payment
          </Link>
        </Button>
      </div>

      {(!payments || payments.length === 0) ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center space-y-3">
          <DollarSign className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium">No payments logged yet</p>
          <p className="text-sm text-muted-foreground">Record a payment received from a tenant.</p>
          <Button asChild size="sm"><Link href="/payments/new">Log Payment</Link></Button>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                {["Tenant", "Unit", "Type", "Method", "Amount", "Due", "Received", "Status"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left font-medium text-muted-foreground text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {payments.map((p) => {
                const tenant = p.tenants as { first_name: string; last_name: string } | null;
                const leaseData = p.leases as { units: { unit_number: string; properties: { name: string } | null } | null } | null;
                const unit = leaseData?.units;
                return (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium">{tenant ? `${tenant.first_name} ${tenant.last_name}` : "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {unit ? `${unit.properties?.name} — ${unit.unit_number}` : "—"}
                    </td>
                    <td className="px-4 py-3 capitalize">{p.payment_type.replace("_", " ")}</td>
                    <td className="px-4 py-3">{methodLabel[p.payment_method]}</td>
                    <td className="px-4 py-3 font-medium">{formatUSD(p.amount)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(p.due_date)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(p.payment_date)}</td>
                    <td className={`px-4 py-3 capitalize font-medium ${statusStyle[p.status]}`}>{p.status}</td>
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
