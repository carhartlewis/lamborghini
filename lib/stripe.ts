import Stripe from "stripe";

let client: Stripe | null = null;

// Constructed lazily: the key is only needed when a request actually hits
// Stripe, so builds and prerenders don't require it in the environment.
export function getStripe() {
  client ??= new Stripe(process.env.STRIPE_SECRET_KEY!);
  return client;
}

// Verified against the Tax Codes API: "Advertising Services" — services
// rendered for advertising which do not include the exchange of tangible
// personal property. Billboard space on the car is advertising, not a
// digital/online ad, so this is the fit rather than txcd_10701000
// (Website Advertising).
export const ADVERTISING_TAX_CODE = "txcd_20060002";
