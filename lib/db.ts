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

// One paid Polar order per row; a sponsor's share is the sum of their orders.
export function ensureSchema() {
  schemaReady ??= getDb().execute(
    `CREATE TABLE IF NOT EXISTS bids (
      order_id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT,
      amount_cents INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
  ).then(() => undefined);
  return schemaReady;
}
