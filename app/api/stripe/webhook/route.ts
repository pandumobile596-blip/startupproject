import { type NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { createClient } from "@/lib/supabase/server";
import type Stripe from "stripe";

export const runtime = "nodejs";

/**
 * Stripe webhook handler.
 * Registered events: payment_intent.succeeded, payment_intent.payment_failed
 *
 * Verify the Stripe-Signature header before processing any event.
 */
export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = await createClient();

  switch (event.type) {
    case "payment_intent.succeeded": {
      const intent = event.data.object as Stripe.PaymentIntent;
      await supabase
        .from("payments")
        .update({ status: "completed" as const })
        .eq("stripe_payment_intent_id", intent.id);
      break;
    }

    case "payment_intent.payment_failed": {
      const intent = event.data.object as Stripe.PaymentIntent;
      await supabase
        .from("payments")
        .update({ status: "failed" as const })
        .eq("stripe_payment_intent_id", intent.id);
      break;
    }

    default:
      // Unhandled event type — acknowledge receipt.
      break;
  }

  return NextResponse.json({ received: true });
}
