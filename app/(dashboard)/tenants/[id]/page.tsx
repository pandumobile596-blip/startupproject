import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatUSD } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/dates";
import { DeleteTenantButton } from "@/components/tenants/delete-tenant-button";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Tenant Detail" };

const paymentStatusColors: Record<string, string> = {
  completed: "text-green-600 dark:text-green-400",
  pending: "text-amber-600 dark:text-amber-400",
  failed: "text-destructive",
  refunded: "text-muted-foreground",
};

export default async function TenantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: tenant } = await supabase
    .from("tenants")
    .select("*")
    .eq("id", id)
    .eq("landlord_id", user!.id)
    .single();

  if (!tenant) notFound();

  const { data: leases } = await supabase
    .from("leases")
    .select("id, start_date, end_date, rent_amount, status, units(unit_number, properties(name))")
    .eq("tenant_id", id)
    .eq("landlord_id", user!.id)
    .order("start_date", { ascending: false });

  const { data: payments } = await supabase
    .from("payments")
    .select("id, amount, payment_date, payment_type, status")
    .eq("tenant_id", id)
    .eq("landlord_id", user!.id)
    .order("payment_date", { ascending: false })
    .limit(10);

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <Link href="/tenants" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Tenants
          </Link>
          <h1 className="text-2xl font-semibold">{tenant.first_name} {tenant.last_name}</h1>
          <p className="text-sm text-muted-foreground">{tenant.email}</p>
        </div>
        <DeleteTenantButton id={tenant.id} />
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Phone", value: tenant.phone ?? "—" },
          { label: "Emergency Contact", value: tenant.emergency_contact_name ?? "—" },
          { label: "Emergency Phone", value: tenant.emergency_contact_phone ?? "—" },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-lg border border-border bg-card p-4 space-y-1">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm font-medium">{value}</p>
          </div>
        ))}
      </div>

      {/* Leases */}
      {leases && leases.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Leases</h2>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  {["Unit", "Start", "End", "Rent/mo", "Status"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left font-medium text-muted-foreground text-xs">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {leases.map((l) => {
                  const unit = l.units as { unit_number: string; properties: { name: string } | null } | null;
                  return (
                    <tr key={l.id}>
                      <td className="px-4 py-3">{unit ? `${unit.unit_number} — ${unit.properties?.name}` : "—"}</td>
                      <td className="px-4 py-3">{formatDate(l.start_date)}</td>
                      <td className="px-4 py-3">{l.end_date ? formatDate(l.end_date) : "Month-to-month"}</td>
                      <td className="px-4 py-3">{formatUSD(l.rent_amount)}</td>
                      <td className="px-4 py-3 capitalize">{l.status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Payments */}
      {payments && payments.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Recent Payments</h2>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  {["Date", "Type", "Amount", "Status"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left font-medium text-muted-foreground text-xs">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3">{formatDate(p.payment_date)}</td>
                    <td className="px-4 py-3 capitalize">{p.payment_type.replace("_", " ")}</td>
                    <td className="px-4 py-3">{formatUSD(p.amount)}</td>
                    <td className={`px-4 py-3 capitalize font-medium ${paymentStatusColors[p.status]}`}>{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
