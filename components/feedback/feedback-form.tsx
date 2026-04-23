"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2 } from "lucide-react";

export function FeedbackForm() {
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value.trim(),
      email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value.trim(),
    };

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Something went wrong.");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send. Please try again.");
    } finally {
      setPending(false);
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center text-center space-y-3 py-12">
        <CheckCircle2 className="h-10 w-10 text-green-500" />
        <h2 className="text-lg font-semibold">Thank you for your feedback!</h2>
        <p className="text-sm text-muted-foreground">Your message has been sent. We really appreciate it.</p>
        <Button variant="ghost" onClick={() => setSent(false)}>Send another message</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <p className="text-sm text-destructive rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2">
          {error}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name <span className="text-muted-foreground font-normal">(optional)</span></Label>
          <Input id="name" name="name" placeholder="Jane Smith" autoComplete="name" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email <span className="text-muted-foreground font-normal">(optional)</span></Label>
          <Input id="email" name="email" type="email" placeholder="jane@example.com" autoComplete="email" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Message <span className="text-destructive">*</span></Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Share your thoughts, suggestions, or anything you'd like us to know…"
          rows={6}
          required
        />
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Sending…" : "Send Feedback"}
      </Button>
    </form>
  );
}
