"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ExportButton({ type, label }: { type: "rent-roll" | "expenses"; label: string }) {
  function handleExport() {
    window.open(`/api/export?type=${type}`, "_blank");
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport}>
      <Download className="h-4 w-4" />
      {label}
    </Button>
  );
}
