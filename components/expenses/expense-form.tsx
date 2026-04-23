"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createExpense } from "@/lib/actions/expenses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const CATEGORIES = [
  { value: "mortgage", label: "Mortgage" },
  { value: "insurance", label: "Insurance" },
  { value: "taxes", label: "Property Taxes" },
  { value: "maintenance", label: "Maintenance" },
  { value: "repairs", label: "Repairs" },
  { value: "utilities", label: "Utilities" },
  { value: "management", label: "Property Management" },
  { value: "advertising", label: "Advertising" },
  { value: "legal", label: "Legal / Professional" },
  { value: "other", label: "Other" },
];

type Property = { id: string; name: string };

export function ExpenseForm({ properties }: { properties: Property[] }) {
  const [state, action, pending] = useActionState(createExpense, undefined);

  const today = new Date().toISOString().split("T")[0];

  return (
    <form action={action} className="space-y-5">
      {state?.error && (
        <p className="text-sm text-destructive rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2">
          {state.error}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="category">Category</Label>
          <Select id="category" name="category" required>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="expense_date">Date</Label>
          <Input id="expense_date" name="expense_date" type="date" defaultValue={today} required />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="amount">Amount ($)</Label>
        <Input id="amount" name="amount" type="number" step="0.01" placeholder="0.00" required />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" placeholder="e.g. Annual roof inspection" required rows={2} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="vendor_name">Vendor / Payee (optional)</Label>
        <Input id="vendor_name" name="vendor_name" placeholder="e.g. ABC Plumbing Co." />
        <p className="text-xs text-muted-foreground">Vendors paid $600+ per year will be flagged for 1099-NEC.</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="property_id">Property (optional)</Label>
        <Select id="property_id" name="property_id">
          <option value="">— Not property-specific —</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </Select>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <input
          id="is_tax_deductible"
          name="is_tax_deductible"
          type="checkbox"
          defaultChecked
          className="h-4 w-4 rounded border-border"
        />
        <Label htmlFor="is_tax_deductible" className="font-normal cursor-pointer">
          Tax deductible expense
        </Label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={pending}>{pending ? "Saving…" : "Add Expense"}</Button>
        <Button variant="ghost" asChild><Link href="/expenses">Cancel</Link></Button>
      </div>
    </form>
  );
}
