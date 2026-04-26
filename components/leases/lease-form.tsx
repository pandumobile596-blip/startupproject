"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createLease } from "@/lib/actions/leases";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Tenant = { id: string; first_name: string; last_name: string };
type Unit = { id: string; unit_number: string; status: string };
type Property = { id: string; name: string; units: Unit[] };

export function LeaseForm({
  tenants,
  properties,
  defaultUnitId,
}: {
  tenants: Tenant[];
  properties: Property[];
  defaultUnitId?: string;
}) {
  const [state, action, pending] = useActionState(createLease, undefined);

  return (
    <form action={action} className="space-y-5">
      {state?.error && (
        <p className="text-sm text-destructive rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2">
          {state.error}
        </p>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="tenant_id">Tenant</Label>
        <Select id="tenant_id" name="tenant_id" required>
          <option value="">Select a tenant…</option>
          {tenants.map((t) => (
            <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>
          ))}
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="unit_id">Unit</Label>
        <Select id="unit_id" name="unit_id" required defaultValue={defaultUnitId ?? ""}>
          <option value="">Select a unit…</option>
          {properties.map((p) =>
            p.units.map((u) => (
              <option key={u.id} value={u.id}>
                {p.name} — {u.unit_number} ({u.status})
              </option>
            ))
          )}
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="start_date">Start date</Label>
          <Input id="start_date" name="start_date" type="date" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="end_date">End date (blank = month-to-month)</Label>
          <Input id="end_date" name="end_date" type="date" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="rent_amount">Monthly rent ($)</Label>
          <Input id="rent_amount" name="rent_amount" type="number" step="0.01" placeholder="1500" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="security_deposit">Security deposit ($)</Label>
          <Input id="security_deposit" name="security_deposit" type="number" step="0.01" defaultValue="0" required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="payment_due_day">Payment due day (1–28)</Label>
          <Input id="payment_due_day" name="payment_due_day" type="number" min="1" max="28" defaultValue="1" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="grace_period_days">Grace period (days)</Label>
          <Input id="grace_period_days" name="grace_period_days" type="number" min="0" defaultValue="5" required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="late_fee_amount">Late fee amount (optional)</Label>
          <Input id="late_fee_amount" name="late_fee_amount" type="number" step="0.01" placeholder="50" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="late_fee_type">Late fee type</Label>
          <Select id="late_fee_type" name="late_fee_type">
            <option value="">None</option>
            <option value="flat">Flat ($)</option>
            <option value="percentage">Percentage (%)</option>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea id="notes" name="notes" placeholder="Any special terms or notes…" rows={3} />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={pending}>{pending ? "Saving…" : "Create Lease"}</Button>
        <Button variant="ghost" asChild><Link href="/leases">Cancel</Link></Button>
      </div>
    </form>
  );
}
