import { revalidatePath } from "next/cache";
import type Stripe from "stripe";

import { ensureSchema, getDb } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

// Personal-mail domains say nothing about the company — no logo for those.
const FREE_MAIL = new Set([
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
  "yahoo.com",
  "icloud.com",
  "me.com",
  "proton.me",
  "protonmail.com",
  "pm.me",
  "aol.com",
  "hey.com",
  "fastmail.com",
  "gmx.com",
  "mail.com",
]);

function companyDomain(email: string | null | undefined) {
  const domain = email?.split("@")[1]?.toLowerCase().trim();
  if (!domain || FREE_MAIL.has(domain)) return null;
  return domain;
}

async function recordSession(session: Stripe.Checkout.Session, status: string) {
  await ensureSchema();
  const details = session.customer_details;
  const email = details?.email ?? null;

  await getDb().execute({
    sql: `INSERT INTO bids
            (order_id, customer_id, payment_intent, name, email, domain, amount_cents, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(order_id) DO UPDATE SET status = excluded.status`,
    args: [
      session.id,
      typeof session.customer === "string"
        ? session.customer
        : (session.customer?.id ?? session.id),
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : (session.payment_intent?.id ?? null),
      details?.name ?? email ?? "Anonymous sponsor",
      email,
      companyDomain(email),
      // What was actually charged, so a discounted bid never inflates a share.
      session.amount_total ?? 0,
      status,
    ],
  });
  revalidatePath("/");
}

export async function POST(request: Request) {
  // constructEvent needs the raw body — do not parse JSON first.
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return Response.json({ received: false }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error) {
    console.error("Stripe webhook signature verification failed", error);
    return Response.json({ received: false }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      // Card payments land here already paid. ACH only *authorizes* here —
      // payment_status stays 'unpaid' until the debit settles, so the bid is
      // held as pending and kept off the leaderboard until it clears.
      await recordSession(
        session,
        session.payment_status === "paid" ? "paid" : "pending",
      );
      break;
    }
    case "checkout.session.async_payment_succeeded": {
      // The ACH debit cleared — the bid now counts.
      await recordSession(event.data.object, "paid");
      break;
    }
    case "checkout.session.async_payment_failed": {
      // TODO: email the buyer and invite them to try the bid again.
      await recordSession(event.data.object, "failed");
      break;
    }
    case "charge.refunded": {
      // Refunds (including the mass refund if the pool never fills) take the
      // bid off the board.
      const charge = event.data.object;
      const paymentIntent =
        typeof charge.payment_intent === "string"
          ? charge.payment_intent
          : charge.payment_intent?.id;
      if (paymentIntent) {
        await ensureSchema();
        await getDb().execute({
          sql: `UPDATE bids SET status = 'refunded' WHERE payment_intent = ?`,
          args: [paymentIntent],
        });
        revalidatePath("/");
      }
      break;
    }
  }

  return Response.json({ received: true });
}
