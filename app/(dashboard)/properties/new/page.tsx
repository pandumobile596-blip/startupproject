import { PropertyForm } from "@/components/properties/property-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Add Property" };

export default function NewPropertyPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Add Property</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Enter the details for your new rental property.</p>
      </div>
      <PropertyForm />
    </div>
  );
}
