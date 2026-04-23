import { createClient } from "@/lib/supabase/server";
import { ExpenseForm } from "@/components/expenses/expense-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Add Expense" };

export default async function NewExpensePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: properties } = await supabase
    .from("properties")
    .select("id, name")
    .eq("landlord_id", user!.id)
    .order("name");

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Add Expense</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Log a business expense for tax and NOI tracking.</p>
      </div>
      <ExpenseForm properties={properties ?? []} />
    </div>
  );
}
