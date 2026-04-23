import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatUSD } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/dates";
import { Button } from "@/components/ui/button";
import { DeleteExpenseButton } from "@/components/expenses/delete-expense-button";
import { Receipt, Plus, AlertTriangle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Expenses" };

const categoryColors: Record<string, string> = {
  mortgage: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  insurance: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  taxes: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  maintenance: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  repairs: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  utilities: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  management: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  advertising: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  legal: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  other: "bg-muted text-muted-foreground",
};

export default async function ExpensesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const currentYear = new Date().getFullYear();

  const { data: expenses } = await supabase
    .from("expenses")
    .select("id, category, amount, expense_date, vendor_name, description, is_tax_deductible, tax_year, properties(name)")
    .eq("landlord_id", user!.id)
    .order("expense_date", { ascending: false });

  // 1099 flagging: vendors with > $600 total in current tax year
  const vendorTotals: Record<string, number> = {};
  (expenses ?? []).forEach((e) => {
    if (e.vendor_name && e.tax_year === currentYear) {
      vendorTotals[e.vendor_name] = (vendorTotals[e.vendor_name] ?? 0) + Number(e.amount);
    }
  });
  const flagged1099 = Object.entries(vendorTotals)
    .filter(([, total]) => total >= 600)
    .map(([name]) => name);

  const totalThisYear = (expenses ?? [])
    .filter((e) => e.tax_year === currentYear)
    .reduce((s, e) => s + Number(e.amount), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Expenses</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {formatUSD(totalThisYear)} logged in {currentYear}
          </p>
        </div>
        <Button asChild>
          <Link href="/expenses/new">
            <Plus className="h-4 w-4" /> Add Expense
          </Link>
        </Button>
      </div>

      {/* 1099 Warning Banner */}
      {flagged1099.length > 0 && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700 px-4 py-3 flex gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
              1099-NEC Required for {flagged1099.length} vendor{flagged1099.length > 1 ? "s" : ""}
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-400 mt-0.5">
              {flagged1099.join(", ")} — paid $600+ in {currentYear}. You may need to file a 1099-NEC.
            </p>
          </div>
        </div>
      )}

      {(!expenses || expenses.length === 0) ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center space-y-3">
          <Receipt className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium">No expenses logged yet</p>
          <p className="text-sm text-muted-foreground">Track repairs, insurance, utilities, and more.</p>
          <Button asChild size="sm"><Link href="/expenses/new">Add Expense</Link></Button>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                {["Date", "Category", "Description", "Vendor", "Property", "Amount", "Tax Ded.", ""].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left font-medium text-muted-foreground text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {expenses.map((e) => {
                const prop = e.properties as { name: string } | null;
                const needs1099 = e.vendor_name && flagged1099.includes(e.vendor_name);
                return (
                  <tr key={e.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{formatDate(e.expense_date)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${categoryColors[e.category]}`}>
                        {e.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-[200px] truncate">{e.description}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1">
                        {e.vendor_name ?? "—"}
                        {needs1099 && (
                          <span title="1099-NEC may be required">
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{prop?.name ?? "—"}</td>
                    <td className="px-4 py-3 font-medium">{formatUSD(Number(e.amount))}</td>
                    <td className="px-4 py-3 text-center">{e.is_tax_deductible ? "✓" : "—"}</td>
                    <td className="px-4 py-3">
                      <DeleteExpenseButton id={e.id} />
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
