# lamborghini.lol — Build Plan

## The idea

Take outbid.lol's viral leaderboard-auction mechanic and point it at a physical object:
a real Lamborghini with a digital billboard, driving around several hours per day.
SaaS companies bid for **share of screen time on the car, for the lifetime of the car**.

### The mechanics (from the brief)

- **Minimum bid: $1,000.** One-time payment, not a subscription.
- **Total pool cap: $200,000.** The car's screen time is a fixed pie.
- **Share of voice = your total bid ÷ $200k.** Bid $50k → your ad shows 1/4 of the
  time on the billboard. Bid $1k → 0.5% of drive time, forever.
- **Ads run for the lifetime of the car.** No renewals, no expiry.
- Companies can top up (bid again) to grow their slice until the pool is full.
- Once $200k is committed, the board is sold out — scarcity is the whole engine.

### What we borrow from outbid.lol

- A public, live **leaderboard** ranked by amount paid — the product IS the leaderboard.
- Aggressive FOMO copy, visitor/social-proof counters, "claim your slot" CTAs.
- Zero-friction flow: pick an amount → pay → you're on the board. No accounts required
  to browse; email captured at checkout.
- Playful `.lol` tone: irreverent, meme-adjacent, but the money is real.

### What we do differently

- The unit isn't a rank — it's a **% of a real car's screen**. Rank falls out of
  amount, but the headline number for each sponsor is their share of voice
  ("TryComp — 25% of the Lambo").
- A **pool progress bar** ($X of $200k claimed) replaces pagination — the board is
  small and exclusive by design (max 200 sponsors at $1k each, realistically far fewer).
- A live "what your money buys" calculator: slider from $1k–$200k → % of screen time,
  est. hours/day on the road, est. impressions.

## Stack

- **Next.js 16.3.1** (App Router, TS, Tailwind v4) — already scaffolded. NOTE: this
  Next version has breaking changes vs public docs; consult
  `node_modules/next/dist/docs/` before writing code (per AGENTS.md).
- **bun** (bun.lock present).
- **shadcn/ui** for components (buttons, cards, dialog, slider, progress, table, etc.).
- **Polar** (production, org `lambo-inc`) for payments: `@polar-sh/sdk` directly,
  `/checkout?products=<id>` redirect route + `/api/webhook/polar` verified webhook.
- Bids-as-products: Polar checkout with a custom/preset amount per bid. v1 keeps a
  simple product + checkout flow; webhook `order.paid` is where a paid bid would be
  recorded (stubbed with TODOs until a database is chosen).

## Site structure

```
app/
  layout.tsx          — fonts, metadata, dark aggressive theme
  page.tsx            — the whole show (landing = product)
    ├─ Hero           — the car, the pitch, live pool progress ($X / $200k)
    ├─ How it works   — 3 steps: pick amount → pay once → ride forever
    ├─ Share calc     — slider: $ → % of screen → est. exposure
    ├─ Leaderboard    — sponsors ranked by total paid, share-of-voice bars
    ├─ FAQ            — lifetime? what car? what if it crashes? (lean into the lol)
    └─ Final CTA      — "Put your logo on a Lamborghini"
  checkout/route.ts       — GET ?products=<id> → polar.checkouts.create → 302
  api/webhook/polar/route.ts — POST, validateEvent, order.paid + customer.state_changed stubs
lib/polar.ts          — single Polar SDK client (POLAR_SERVER-driven)
```

## Design direction ("absolutely fire")

- **Dark, automotive, expensive.** Near-black background, Lamborghini-yellow
  (#FFC800-ish) as the single loud accent, white/grey type. Think supercar launch
  page × degenerate auction site.
- Big condensed display type for numbers ($200,000 / 25% / #1), tight tracking,
  uppercase kickers. Tabular numerals on the leaderboard.
- Speed cues: skewed/italic accents, thin horizontal speed-lines, subtle gradient
  glows off the yellow. No cheesy stock car photos — abstract silhouette / CSS-drawn
  billboard mock instead.
- Leaderboard rows show a **share-of-voice bar** (their % of the car) — the board
  doubles as a data-viz of who owns the car.
- Motion: number count-ups, marquee of sponsor logos ("currently on the car"),
  progress bar shimmer. Restraint everywhere else.

## Execution order

1. ✅ Recon: outbid.lol flow, Polar skill docs, Next 16.3 local docs.
2. `plan/` (this file).
3. shadcn init + components.
4. Polar phases 1–6 per the setup spec (env/token → SDK → routes → provision →
   verify → POLAR_SETUP.md). Production env — real money; test with 100% discount code.
5. Build the page (hero, calculator, leaderboard, FAQ) with seeded example sponsors.
6. Wire "Bid" CTAs to `/checkout?products=<id>`; verify build; hand off.

## Later (not in v1)

- Database (bids table) + auth so the leaderboard is real, fed by `order.paid`.
- Custom bid amounts via Polar pay-what-you-want or per-amount checkout creation.
- Live pool math from Polar orders instead of seed data.
- Public car-cam / route map page; per-sponsor click tracking like outbid.lol.
