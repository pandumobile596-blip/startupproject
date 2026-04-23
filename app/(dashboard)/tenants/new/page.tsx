import { TenantForm } from "@/components/tenants/tenant-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Add Tenant" };

export default function NewTenantPage() {
  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Add Tenant</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Enter the tenant&apos;s contact information.</p>
      </div>
      <TenantForm />
    </div>
  );
}
