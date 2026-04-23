"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createTenant } from "@/lib/actions/tenants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function TenantForm() {
  const [state, action, pending] = useActionState(createTenant, undefined);

  return (
    <form action={action} className="space-y-5">
      {state?.error && (
        <p className="text-sm text-destructive rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2">
          {state.error}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="first_name">First name</Label>
          <Input id="first_name" name="first_name" placeholder="Jane" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="last_name">Last name</Label>
          <Input id="last_name" name="last_name" placeholder="Smith" required />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="jane@example.com" required />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input id="phone" name="phone" type="tel" placeholder="555-0100" />
      </div>

      <div className="border-t border-border pt-5 space-y-4">
        <p className="text-sm font-medium text-muted-foreground">Emergency contact (optional)</p>
        <div className="space-y-1.5">
          <Label htmlFor="emergency_contact_name">Name</Label>
          <Input id="emergency_contact_name" name="emergency_contact_name" placeholder="John Smith" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="emergency_contact_phone">Phone</Label>
          <Input id="emergency_contact_phone" name="emergency_contact_phone" placeholder="555-0199" />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={pending}>{pending ? "Saving…" : "Add Tenant"}</Button>
        <Button variant="ghost" asChild><Link href="/tenants">Cancel</Link></Button>
      </div>
    </form>
  );
}
