"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createPayment } from "@/lib/actions/payments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type LeaseOption = {
  id: string;
  rent_amount: number;
  tenants: { first_name: string; last_name: string } | null;
  units: { unit_number: string; properties: { name: string } | null } | null;
};

export function PaymentForm({ leases }: { leases: LeaseOption[] }) {
  const [state, action, pending] = useActionState(createPayment, undefined);

  const today = new Date().toISOString().split("T")[0];

  return (
    <form action={action} className="space-y-5">
      {state?.error && (
        <p className="text-sm text-destructive rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2">
          {state.error}
        </p>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="lease_id">Lease (active)</Label>
        <Select id="lease_id" name="lease_id" required>
          <option value="">Select a lease…</option>
          {leases.map((l) => {
            const name = l.tenants ? `${l.tenants.first_name} ${l.tenants.last_name}` : "Unknown";
            const location = l.units ? `${l.units.properties?.name} — ${l.units.unit_number}` : "";
            return (
              <option key={l.id} value={l.id}>
                {name} · {location} · ${l.rent_amount}/mo
              </option>
            );
          })}
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="payment_type">Payment type</Label>
          <Select id="payment_type" name="payment_type" required>
            <option value="rent">Rent</option>
            <option value="security_deposit">Security Deposit</option>
            <option value="late_fee">Late Fee</option>
            <option value="other">Other</option>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="payment_method">Method</Label>
          <Select id="payment_method" name="payment_method" required>
            <option value="check">Check</option>
            <option value="cash">Cash</option>
            <option value="ach">ACH / Bank Transfer</option>
            <option value="other">Other</option>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="amount">Amount ($)</Label>
        <Input id="amount" name="amount" type="number" step="0.01" placeholder="1500.00" required />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="payment_date">Date received</Label>
          <Input id="payment_date" name="payment_date" type="date" defaultValue={today} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="due_date">Due date</Label>
          <Input id="due_date" name="due_date" type="date" defaultValue={today} required />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea id="notes" name="notes" placeholder="e.g. Check #1042" rows={2} />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={pending}>{pending ? "Saving…" : "Log Payment"}</Button>
        <Button variant="ghost" asChild><Link href="/payments">Cancel</Link></Button>
      </div>
    </form>
  );
}
