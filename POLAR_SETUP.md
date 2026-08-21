# Polar setup — lamborghini.lol

Production integration for org **lambo-inc** (`60155e08-cc44-4cf6-883a-46be0fb13159`).
⚠️ This runs against the **live production environment** — checkouts charge real money.

## Files created / changed

- `lib/polar.ts` — single `@polar-sh/sdk` client (env from `POLAR_SERVER`)
- `app/checkout/route.ts` — `GET /checkout?products=<id>` → creates a Polar checkout, 302-redirects to it
- `app/api/webhook/polar/route.ts` — verifies signatures (`validateEvent`), handles `order.paid` (records the bid in Turso, revalidates `/`) and `customer.state_changed` (syncs sponsor name/email)
- `lib/db.ts` — Turso (libSQL) client + `bids` table schema
- `lib/board.ts` — leaderboard aggregation (falls back to demo data while `bids` is empty)
- `lib/bids.ts` — pool economics ($200k cap, $1k min) + bid-tier product IDs
- `app/page.tsx`, `app/layout.tsx`, `app/globals.css`, `components/site/*` — the site
- `.env` — created (already gitignored via `.env*`)

## Env keys (names only)

`POLAR_ACCESS_TOKEN`, `POLAR_WEBHOOK_SECRET`, `POLAR_SERVER=production`,
`TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`

## Polar objects

| Object | ID |
| --- | --- |
| Test Product ($10 one-time) | `c971a580-ba4b-4cef-89a7-fb010c9c9938` |
| Bid — $1,000 | `dbd6e547-f32c-4a69-8f7b-23ec555789a6` |
| Bid — $5,000 | `da2e1ced-b82a-49aa-9b02-4870ed5b2db0` |
| Bid — $10,000 | `de216199-c3ca-4c38-9a7d-1f36ba4f9a6d` |
| Bid — $25,000 | `86a5e8f3-1366-4478-b78f-e8375c6176e7` |
| Bid — $50,000 | `3177a63f-5890-45b2-b9f6-aba190823abb` |
| Webhook endpoint → `https://lamborghini.lol/api/webhook/polar` | `3c76eb7a-865d-4792-a0ce-8346aed75a5b` |
| Discount `LAMBOTEST100` (100% off, once, max 5) | `ab22b2cb-f7ae-4e9c-8c32-1ce0a34d4bba` |

## Verify before merging

- [ ] **Rotate both secrets that were pasted into the Claude chat**: the Polar access token
      (create a new one at https://polar.sh/dashboard/lambo-inc/settings, put it in `.env`)
      and the Turso auth token.
- [ ] `bun run build` passes (it does at time of writing).
- [ ] `GET /checkout?products=dbd6e547-f32c-4a69-8f7b-23ec555789a6` 302s to `polar.sh/checkout/…` (verified locally).
- [ ] Test checkout end-to-end with code `LAMBOTEST100` (100% off — no charge). A $0 test
      order inserts a `$0` row in `bids`, which never inflates the board (shares use amount paid).
- [ ] After deploy, confirm webhook deliveries succeed in the Polar dashboard (endpoint above).
- [ ] Archive the `Test Product` and delete `LAMBOTEST100` before going loud.

## How a paid bid becomes a leaderboard row

1. Visitor hits `/checkout?products=<tier id>` and pays on Polar's hosted checkout.
2. Polar sends `order.paid` to `/api/webhook/polar` (signature-verified).
3. The handler inserts a row into `bids` — name and email from the Polar customer,
   plus a `domain` derived from the email (free-mail domains like gmail.com are
   skipped, so no bogus logos).
4. `revalidatePath("/")` refreshes the board; the page is also ISR at 120s.
5. The row renders with the company's favicon via
   `https://www.google.com/s2/favicons?domain=<domain>` and links to their site.

Shares come from the amount **actually charged**, so a 100%-discounted test order
records $0 and never moves the board.

## Seeded sponsor

`Comp AI` — $25,000 (12.5% of the car), domain `trycomp.ai`, no payment taken.
It's a plain row in `bids` with `order_id = 'seed-comp-ai'`; delete that row to
remove it. Everything else stays open for paid bids.

## Vercel

Project `comp-ai-poc/lamborghini`, domain `lamborghini.lol`.
All five env keys are set for Production + Preview.

⚠️ The site 404'd on every path after the first deploys because the project's
**Framework Preset was "Other"** — Vercel ran the build but served it as a static
site with no Next.js routing. Fixed by setting `framework: "nextjs"` on the
project. If you ever recreate the project, set the preset to Next.js.

## Notes

- Customer portal: **no app code needed** — Polar hosts it and emails customers the link.
- The webhook secret was written into `.env` directly from the API response (never printed).
- Sponsors are identified by their checkout email — no login required. If you later
  add auth, pass `externalCustomerId` at checkout and resolve it in the webhook.
