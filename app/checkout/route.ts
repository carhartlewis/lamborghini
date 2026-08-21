import type { NextRequest } from "next/server";

import { ALLOWED_BID_AMOUNTS, POOL_CAP, formatUsd } from "@/lib/bids";
import { getBoard } from "@/lib/board";
import { ADVERTISING_TAX_CODE, getStripe } from "@/lib/stripe";

export async function GET(request: NextRequest) {
  const requested = Number(request.nextUrl.searchParams.get("amount"));

  // Never trust an amount from the URL — it must be one of our tiers.
  if (!ALLOWED_BID_AMOUNTS.includes(requested)) {
    return Response.json({ error: "Invalid bid amount" }, { status: 400 });
  }

  // Don't sell more of the car than exists.
  const { claimed } = await getBoard();
  if (claimed + requested > POOL_CAP) {
    return Response.json(
      { error: `Only ${formatUsd(POOL_CAP - claimed)} of the car is left` },
      { status: 409 },
    );
  }

  const origin = request.nextUrl.origin;

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      // Cards only — this pins the payment methods regardless of what's
      // enabled in the Dashboard, so no delayed-notification method (ACH and
      // friends) can reach checkout. Heads up: some issuers decline single
      // card charges at the $25k–$50k tiers.
      payment_method_types: ["card"],
      // Prices are built inline so a bid is just an amount — no Stripe
      // catalog to keep in sync with the tiers.
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: requested * 100,
            product_data: {
              name: `Lamborghini billboard — ${formatUsd(requested)}`,
              description: `A permanent ${((requested / POOL_CAP) * 100).toFixed(2)}% share of the car's digital billboard, for the lifetime of the car.`,
              tax_code: ADVERTISING_TAX_CODE,
            },
          },
        },
      ],
      // Stripe Tax is off: live mode requires a head office address, and we
      // don't want it. The tax_code above stays as the correct classification
      // for whenever automatic_tax gets turned on.
      billing_address_collection: "required",
      customer_creation: "always",
      // B2B buyers need a real PDF invoice for procurement.
      invoice_creation: { enabled: true },
      metadata: { bidAmountUsd: String(requested) },
      success_url: `${origin}/?bid=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?bid=cancelled`,
    });

    if (!session.url) {
      return new Response(null, { status: 500 });
    }
    return Response.redirect(session.url, 302);
  } catch (error) {
    console.error("Failed to create Stripe Checkout Session", error);
    return new Response(null, { status: 500 });
  }
}
