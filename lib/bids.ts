// Bidding economics for lamborghini.lol.
// The car's screen time is a fixed pie: share of voice = total paid / POOL_CAP.

export const POOL_CAP = 200_000;
export const MIN_BID = 1_000;

// Purchasable amounts, in whole dollars. The checkout route validates the
// requested amount against this list — never trust an amount from the URL.
export const BID_TIERS = [
  { amount: 1_000, label: "Get on the car" },
  { amount: 5_000, label: "Be seen" },
  { amount: 10_000, label: "Be unmissable" },
  { amount: 25_000, label: "Dominate" },
  { amount: 50_000, label: "Own a quarter of the car" },
] as const;

export const ALLOWED_BID_AMOUNTS: readonly number[] = BID_TIERS.map(
  (t) => t.amount,
);

export function checkoutUrl(amount: number) {
  return `/checkout?amount=${amount}`;
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

// Company logo via Google's favicon service, when we know the domain.
export function logoUrl(domain: string) {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`;
}

// A row on the board: one sponsor, aggregated from their paid bids.
export type Sponsor = {
  rank: number;
  name: string;
  domain: string | null;
  amount: number;
  claimedAgo: string;
};
