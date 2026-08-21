// Bidding economics for lamborghini.lol.
// The car's screen time is a fixed pie: share of voice = total paid / POOL_CAP.

export const POOL_CAP = 200_000;
export const MIN_BID = 1_000;
export const DRIVE_HOURS_PER_DAY = 4;

// Polar products (production, org lambo-inc). One-time prices, USD.
export const BID_TIERS = [
  {
    amount: 1_000,
    productId: "dbd6e547-f32c-4a69-8f7b-23ec555789a6",
    label: "Get on the car",
  },
  {
    amount: 5_000,
    productId: "da2e1ced-b82a-49aa-9b02-4870ed5b2db0",
    label: "Be seen",
  },
  {
    amount: 10_000,
    productId: "de216199-c3ca-4c38-9a7d-1f36ba4f9a6d",
    label: "Be unmissable",
  },
  {
    amount: 25_000,
    productId: "86a5e8f3-1366-4478-b78f-e8375c6176e7",
    label: "Dominate",
  },
  {
    amount: 50_000,
    productId: "3177a63f-5890-45b2-b9f6-aba190823abb",
    label: "Own a quarter of the car",
  },
] as const;

export function checkoutUrl(productId: string) {
  return `/checkout?products=${productId}`;
}

export function shareOfPool(amount: number) {
  return amount / POOL_CAP;
}

export function formatUsd(amount: number) {
  return `$${amount.toLocaleString("en-US")}`;
}

export function formatShare(amount: number) {
  const pct = shareOfPool(amount) * 100;
  return `${pct % 1 === 0 ? pct : pct.toFixed(pct < 1 ? 2 : 1)}%`;
}

// Minutes of billboard time per hour of driving.
export function minutesPerHour(amount: number) {
  return shareOfPool(amount) * 60;
}

// Demo board until the leaderboard is fed by paid Polar orders (order.paid
// webhook -> database). Fictional companies — replace at launch.
export type Sponsor = {
  rank: number;
  name: string;
  tagline: string;
  amount: number;
  claimedAgo: string;
};

export const DEMO_SPONSORS: Sponsor[] = [
  {
    rank: 1,
    name: "Chargeblade",
    tagline: "Usage-based billing that doesn't bill you for using it",
    amount: 50_000,
    claimedAgo: "2 days ago",
  },
  {
    rank: 2,
    name: "Kubernaut",
    tagline: "Kubernetes, but you keep your weekends",
    amount: 25_000,
    claimedAgo: "5 days ago",
  },
  {
    rank: 3,
    name: "InvoiceGoblin",
    tagline: "Chases your unpaid invoices so you don't have to",
    amount: 10_000,
    claimedAgo: "1 week ago",
  },
  {
    rank: 4,
    name: "MeetingSlayer",
    tagline: "Declines meetings on your behalf. Politely. Usually.",
    amount: 5_000,
    claimedAgo: "1 week ago",
  },
  {
    rank: 5,
    name: "PagerDucky",
    tagline: "Incident response for teams that panic quietly",
    amount: 1_000,
    claimedAgo: "2 weeks ago",
  },
];

