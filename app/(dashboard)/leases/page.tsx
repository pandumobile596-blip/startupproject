import type { Metadata } from "next";

export const metadata: Metadata = { title: "Leases" };

export default function LeasesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Leases</h1>
      <p className="text-muted-foreground text-sm">Coming in Phase 2.</p>
    </div>
  );
}
