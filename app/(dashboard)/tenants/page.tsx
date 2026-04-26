import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Users, Plus } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Tenants" };

export default async function TenantsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: tenants } = await supabase
    .from("tenants")
    .select("id, first_name, last_name, email, phone")
    .eq("landlord_id", user!.id)
    .order("last_name");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Tenants</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {tenants?.length ?? 0} tenant{tenants?.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button asChild>
          <Link href="/tenants/new">
            <Plus className="h-4 w-4" /> Add Tenant
          </Link>
        </Button>
      </div>

      {(!tenants || tenants.length === 0) ? (
        <EmptyState
          icon={Users}
          title="No tenants yet"
          description="Add your tenants here to track their contact info, lease history, and notes."
          tip="Once you add a tenant, you can link them to a unit and create a lease — which enables payment tracking and reports."
          ctaLabel="Add Your First Tenant"
          ctaHref="/tenants/new"
        />
      ) : (
        <div className="rounded-xl border border-border overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[500px] text-sm">
            <thead className="bg-muted/50">
              <tr>
                {["Name", "Email", "Phone"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left font-medium text-muted-foreground text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tenants.map((t) => (
                <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/tenants/${t.id}`} className="font-medium hover:underline">
                      {t.first_name} {t.last_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{t.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.phone ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
