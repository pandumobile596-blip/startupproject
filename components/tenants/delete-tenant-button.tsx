"use client";

import { useTransition } from "react";
import { deleteTenant } from "@/lib/actions/tenants";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function DeleteTenantButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Delete this tenant? This cannot be undone.")) return;
    startTransition(async () => { await deleteTenant(id); });
  }

  return (
    <Button variant="outline" size="sm" onClick={handleDelete} disabled={pending}>
      <Trash2 className="h-4 w-4" />
      {pending ? "Deleting…" : "Delete"}
    </Button>
  );
}
