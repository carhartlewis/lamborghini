import { createClient, type Client } from "@libsql/client";

let client: Client | null = null;
let schemaReady: Promise<void> | null = null;

export function getDb() {
  client ??= createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  return client;
}

// One row per Checkout Session. A sponsor's share is the sum of their PAID
// rows — ACH bids sit at 'pending' for ~4 business days before settling, and
// refunded bids stop counting, so status drives the leaderboard.
export function ensureSchema() {
  schemaReady ??= (async () => {
    const db = getDb();
    await db.execute(
      `CREATE TABLE IF NOT EXISTS bids (
        order_id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        payment_intent TEXT,
        name TEXT NOT NULL,
        email TEXT,
        domain TEXT,
        amount_cents INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'paid',
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )`,
    );
    // Columns added after the Polar→Stripe migration; ignore "duplicate column".
    for (const sql of [
      `ALTER TABLE bids ADD COLUMN status TEXT NOT NULL DEFAULT 'paid'`,
      `ALTER TABLE bids ADD COLUMN payment_intent TEXT`,
    ]) {
      try {
        await db.execute(sql);
      } catch {
        // column already exists
      }
    }
  })();
  return schemaReady;
}
