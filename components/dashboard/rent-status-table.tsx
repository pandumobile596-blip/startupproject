import Link from "next/link";
import { formatUSD } from "@/lib/utils/currency";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import type { DetailedRentStatus } from "@/lib/dashboard/rent-status";

export type RentStatusRow = {
  leaseId: string;
  tenantName: string;
  unit: string;
  rentAmount: number;
  dueDay: number;
  status: DetailedRentStatus;
  lateFee: number;
};

function StatusPill({ status }: { status: DetailedRentStatus }) {
  if (status === "paid") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
        <CheckCircle2 className="h-3 w-3" />
        Paid
      </span>
    );
  }
  if (status === "overdue") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
        <AlertCircle className="h-3 w-3" />
        Overdue
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
      <Clock className="h-3 w-3" />
      Unpaid
    </span>
  );
}

export function RentStatusTable({ rows }: { rows: RentStatusRow[] }) {
  if (rows.length === 0) return null;

  const overdueCount = rows.filter((r) => r.status === "overdue").length;
  const unpaidCount = rows.filter((r) => r.status !== "paid").length;

  return (
    <Card>
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">This Month&apos;s Rent Status</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {unpaidCount === 0
                ? "All tenants have paid this month 🎉"
                : `${unpaidCount} of ${rows.length} tenant${rows.length !== 1 ? "s" : ""} still owe rent`}
            </p>
          </div>
          {overdueCount > 0 && (
            <div className="flex items-center gap-1.5 text-destructive text-sm font-semibold shrink-0">
              <AlertCircle className="h-4 w-4" />
              {overdueCount} overdue
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0 mt-4">
        {/* Mobile stacked view */}
        <div className="sm:hidden divide-y divide-border">
          {rows.map((row) => (
            <div key={row.leaseId} className="px-6 py-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-sm">{row.tenantName}</p>
                  <p className="text-xs text-muted-foreground">{row.unit}</p>
                </div>
                <StatusPill status={row.status} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium">{formatUSD(row.rentAmount)}</span>
                  <span className="text-xs text-muted-foreground ml-1">due day {row.dueDay}</span>
                  {row.status === "overdue" && row.lateFee > 0 && (
                    <span className="ml-2 text-xs text-destructive font-medium">
                      +{formatUSD(row.lateFee)} late fee
                    </span>
                  )}
                </div>
                {row.status !== "paid" && (
                  <Button asChild size="sm" variant="outline" className="h-7 text-xs">
                    <Link
                      href={`/payments/new?lease_id=${row.leaseId}&amount=${row.rentAmount}`}
                    >
                      Log Payment
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table view */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-b border-border bg-muted/30">
                <th className="px-6 py-2.5 text-left text-xs font-medium text-muted-foreground">
                  Tenant
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                  Unit
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                  Rent Due
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                  Late Fee
                </th>
                <th className="px-6 py-2.5 text-right text-xs font-medium text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row) => (
                <tr
                  key={row.leaseId}
                  className={`transition-colors hover:bg-muted/30 ${
                    row.status === "overdue" ? "bg-red-50/30 dark:bg-red-950/10" : ""
                  }`}
                >
                  <td className="px-6 py-3 font-medium">{row.tenantName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.unit}</td>
                  <td className="px-4 py-3 tabular-nums">
                    {formatUSD(row.rentAmount)}
                    <span className="ml-1.5 text-xs text-muted-foreground">
                      due {row.dueDay}th
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={row.status} />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {row.status === "overdue" && row.lateFee > 0 ? (
                      <span className="text-destructive font-medium tabular-nums">
                        +{formatUSD(row.lateFee)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-right">
                    {row.status !== "paid" ? (
                      <Button asChild size="sm" variant="outline">
                        <Link
                          href={`/payments/new?lease_id=${row.leaseId}&amount=${row.rentAmount}`}
                        >
                          Log Payment
                        </Link>
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
