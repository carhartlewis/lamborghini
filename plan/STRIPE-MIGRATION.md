# Polar → Stripe migration

Status: **code complete, build green.** Waiting on API keys + webhook endpoint
before it can take a real payment. Planner guide `iguide_61VG62DV5YZ9DFkK041RfnoZWjw7G`,
Stripe account **Lambo Site** (`acct_1U6hzFRfnoZWjw7G`, live mode).

## Decisions

| Question | Decision |
| --- | --- |
| Connect | **Skipped.** Single seller, no third-party payouts. Revisit only if other car owners ever sell their own billboard time. |
| Checkout | **Stripe-hosted Checkout**, `mode: "payment"`. The planner's decision tree landed on `out_of_box_hosted` (`checkout_type: hosted`, `origin_context: web`). |
| Payment methods | Not hardcoded. Dynamic payment methods from the Dashboard, so enabling **US bank account (ACH)** is a Dashboard toggle, not a deploy. |
| Invoicing | `invoice_creation: { enabled: true }` on the Session — B2B buyers get a real PDF invoice without building an AR pipeline. |
| Tax | `automatic_tax: { enabled: true }`, `billing_address_collection: "required"`, `customer_creation: "always"`. |
| Tax code | `txcd_20060002` "Advertising Services" — **needs Lewis's sign-off** (see below). |
| Amounts | Five fixed tiers, validated server-side against `ALLOWED_BID_AMOUNTS`. |

## The ACH correctness rule (most important thing here)

ACH Direct Debit is a **delayed notification** payment method: funds take ~4
business days. `checkout.session.completed` fires when the buyer *authorizes*
the debit, **not** when it settles — `payment_status` is still `unpaid` and the
PaymentIntent is `processing`.

So the webhook does this:

| Event | Action |
| --- | --- |
| `checkout.session.completed` | `payment_status === "paid"` (card) → record **paid**. Otherwise (ACH) → record **pending**. |
| `checkout.session.async_payment_succeeded` | The debit cleared → flip to **paid**. |
| `checkout.session.async_payment_failed` | Flip to **failed**. TODO: email the buyer. |
| `charge.refunded` | Flip to **refunded** (matched via `payment_intent`). |

`lib/board.ts` counts only `status = 'paid'`, so pending ACH, failed, and
refunded bids never inflate anyone's share of the car. This also makes the
**mass-refund path** work for free: if the $200k never fills and every buyer is
refunded, each `charge.refunded` removes that bid and the pool total falls back
on its own.

ACH's default per-transaction limit is **$1,000,000**, so the $50,000 tier is
fine. Cards are the risk at that size — individual issuers often decline
$25k–$50k, which is exactly why ACH matters here.

## Files

| File | State |
| --- | --- |
| `lib/stripe.ts` | **New.** Lazily-constructed client (so builds don't need the key) + the tax code constant. |
| `app/checkout/route.ts` | **Rewritten.** `GET /checkout?amount=<tier>` → Checkout Session → 302. |
| `app/api/webhook/stripe/route.ts` | **New.** `constructEvent` on the raw body, four events above. |
| `app/api/webhook/polar/route.ts`, `lib/polar.ts` | **Deleted.** `@polar-sh/sdk` uninstalled. |
| `lib/bids.ts` | Polar product UUIDs gone; tiers are plain amounts. `checkoutUrl(amount)`. |
| `lib/db.ts` | `bids` gains `status` and `payment_intent`, applied as idempotent `ALTER TABLE`s. |
| `lib/board.ts` | Now filters `WHERE status = 'paid'`. |
| `app/page.tsx`, `components/site/share-calculator.tsx` | Links use amounts. |

### Why no Stripe product catalog

Line items are built with inline `price_data` + `product_data` (carrying the
tax code). A bid is just an amount, so there's no catalog to drift out of sync
with the tiers, and supporting arbitrary custom amounts later is a one-line
change to the validation. The trade-off: bids don't roll up under a named
Product in Dashboard reporting.

**Security note:** because the amount comes from the URL, `/checkout` rejects
anything not in `ALLOWED_BID_AMOUNTS` and refuses to sell past the $200k cap.

## Remaining steps (need Lewis)

1. **Add `STRIPE_SECRET_KEY`** (live, `sk_live_…`) to `.env` — the keys are
   already stubbed there. Add it to Vercel too (Production + Preview).
2. **Confirm the tax code.** Stripe's docs are explicit that an agent must not
   make the legal tax classification. Verified candidates from the Tax Codes API:
   - `txcd_20060002` **Advertising Services** — "services rendered for
     advertising which do not include the exchange of tangible personal
     property." ← what the code currently uses.
   - `txcd_10701000` **Website Advertising** — online advertising specifically.
     Almost certainly *not* right: the billboard is physical.
   Full list: https://docs.stripe.com/tax/tax-codes
3. **Stripe Tax registrations.** Tax only calculates where you have an active
   registration; with none, it returns zero tax. Dashboard → Tax → Registrations.
4. **Enable US bank account (ACH)** in Dashboard → Payment methods, or the $50k
   tier will be card-only.
5. **Create the webhook endpoint** at `https://lamborghini.lol/api/webhook/stripe`
   subscribed to the four events above, and put its signing secret in `.env`
   as `STRIPE_WEBHOOK_SECRET` (and in Vercel).
6. Local testing: `stripe listen --forward-to localhost:3000/api/webhook/stripe`
   prints its own signing secret — use that one locally, not the Dashboard's.

## Polar teardown (only after Stripe is verified in production)

Products (5 tiers + Test Product), webhook endpoint
`3c76eb7a-865d-4792-a0ce-8346aed75a5b`, discount `LAMBOTEST100`. The seeded
Comp AI row in Turso is independent of both processors and survived the
migration (`status = 'paid'`).
