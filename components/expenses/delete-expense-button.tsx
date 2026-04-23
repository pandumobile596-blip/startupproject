"use client";

import { useTransition } from "react";
import { deleteExpense } from "@/lib/actions/expenses";
import { Trash2 } from "lucide-react";

export function DeleteExpenseButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Delete this expense? This cannot be undone.")) return;
    startTransition(async () => { await deleteExpense(id); });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
      title="Delete expense"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
