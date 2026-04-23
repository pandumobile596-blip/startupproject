"use client";

import { useTransition } from "react";
import { deleteProperty } from "@/lib/actions/properties";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function DeletePropertyButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Delete this property? All units will also be deleted. This cannot be undone.")) return;
    startTransition(async () => { await deleteProperty(id); });
  }

  return (
    <Button variant="outline" size="sm" onClick={handleDelete} disabled={pending}>
      <Trash2 className="h-4 w-4" />
      {pending ? "Deleting…" : "Delete"}
    </Button>
  );
}
