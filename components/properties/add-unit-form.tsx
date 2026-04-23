"use client";

import { useState, useActionState } from "react";
import { createUnit } from "@/lib/actions/properties";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Plus } from "lucide-react";

export function AddUnitForm({ propertyId }: { propertyId: string }) {
  const [open, setOpen] = useState(false);
  const action = createUnit.bind(null, propertyId);
  const [state, formAction, pending] = useActionState(action, undefined);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-sm text-primary hover:underline"
      >
        <Plus className="h-4 w-4" /> Add Unit
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <h3 className="font-medium">Add Unit</h3>
      <form action={formAction} className="space-y-4">
        {state?.error && (
          <p className="text-sm text-destructive">{state.error}</p>
        )}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="unit_number">Unit number</Label>
            <Input id="unit_number" name="unit_number" placeholder="1A" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="status">Status</Label>
            <Select id="status" name="status">
              <option value="vacant">Vacant</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="bedrooms">Beds</Label>
            <Input id="bedrooms" name="bedrooms" type="number" min="0" defaultValue="1" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bathrooms">Baths</Label>
            <Input id="bathrooms" name="bathrooms" type="number" min="0" step="0.5" defaultValue="1" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="square_feet">Sq Ft</Label>
            <Input id="square_feet" name="square_feet" type="number" min="0" placeholder="850" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="market_rent">Market rent ($/mo)</Label>
          <Input id="market_rent" name="market_rent" type="number" step="0.01" placeholder="1500" />
        </div>
        <div className="flex gap-3">
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? "Saving…" : "Add Unit"}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
