import { FeedbackForm } from "@/components/feedback/feedback-form";
import { MessageSquare } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Feedback" };

export default function FeedbackPage() {
  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-primary/10 p-2 mt-0.5">
          <MessageSquare className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Feedback</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Have a suggestion or found something that could be better? We&apos;d love to hear from you.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <FeedbackForm />
      </div>
    </div>
  );
}
