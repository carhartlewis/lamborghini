import { type Sponsor } from "./bids";
import { ensureSchema, getDb } from "./db";

export type Board = {
  sponsors: Sponsor[];
  claimed: number;
};

// The board is real data only: paid Polar orders plus seeded sponsors.
export async function getBoard(): Promise<Board> {
  try {
    await ensureSchema();
    // Only settled money buys screen time: pending ACH, failed, and refunded
    // bids are excluded from the board and the pool total.
    const res = await getDb().execute(
      `SELECT customer_id, name, domain, SUM(amount_cents) AS total_cents, MAX(created_at) AS last_at
       FROM bids
       WHERE status = 'paid'
       GROUP BY customer_id
       ORDER BY total_cents DESC, last_at ASC`,
    );
    const sponsors: Sponsor[] = res.rows.map((row, i) => ({
      rank: i + 1,
      name: String(row.name),
      domain: row.domain ? String(row.domain) : null,
      amount: Math.round(Number(row.total_cents) / 100),
      claimedAgo: timeAgo(String(row.last_at)),
    }));
    return {
      sponsors,
      claimed: sponsors.reduce((s, x) => s + x.amount, 0),
    };
  } catch (error) {
    console.error("Failed to load board from Turso", error);
    return { sponsors: [], claimed: 0 };
  }
}

function timeAgo(sqliteUtc: string) {
  const then = new Date(`${sqliteUtc.replace(" ", "T")}Z`).getTime();
  const mins = Math.max(0, Math.floor((Date.now() - then) / 60_000));
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
