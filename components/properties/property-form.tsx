"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createProperty } from "@/lib/actions/properties";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

export function PropertyForm() {
  const [state, action, pending] = useActionState(createProperty, undefined);

  return (
    <form action={action} className="space-y-5">
      {state?.error && (
        <p className="text-sm text-destructive rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2">
          {state.error}
        </p>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="name">Property name</Label>
        <Input id="name" name="name" placeholder="Oak Street Duplex" required />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="property_type">Property type</Label>
        <Select id="property_type" name="property_type" required>
          <option value="single_family">Single Family</option>
          <option value="multi_family">Multi-Family</option>
          <option value="condo">Condo</option>
          <option value="commercial">Commercial</option>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="address_line1">Street address</Label>
        <Input id="address_line1" name="address_line1" placeholder="123 Oak Street" required />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="address_line2">Apt / Suite (optional)</Label>
        <Input id="address_line2" name="address_line2" placeholder="Unit 4B" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" placeholder="Austin" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="state">State</Label>
          <Select id="state" name="state" required>
            <option value="">—</option>
            {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="zip">ZIP code</Label>
        <Input id="zip" name="zip" placeholder="78701" required />
      </div>

      <div className="border-t border-border pt-5 space-y-4">
        <p className="text-sm font-medium text-muted-foreground">Financial details (optional)</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="purchase_price">Purchase price ($)</Label>
            <Input id="purchase_price" name="purchase_price" type="number" step="0.01" placeholder="450000" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="purchase_date">Purchase date</Label>
            <Input id="purchase_date" name="purchase_date" type="date" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="mortgage_balance">Current mortgage balance ($)</Label>
          <Input id="mortgage_balance" name="mortgage_balance" type="number" step="0.01" placeholder="320000" />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Add Property"}
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/properties">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
