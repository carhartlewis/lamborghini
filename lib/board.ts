import { DEMO_SPONSORS, type Sponsor } from "./bids";
import { ensureSchema, getDb } from "./db";

export type Board = {
  sponsors: Sponsor[];
  claimed: number;
  isDemo: boolean;
};

const DEMO_BOARD: Board = {
  sponsors: DEMO_SPONSORS,
  claimed: DEMO_SPONSORS.reduce((s, x) => s + x.amount, 0),
  isDemo: true,
};

// Real board from paid Polar orders; demo board until the first real bid.
export async function getBoard(): Promise<Board> {
  try {
    await ensureSchema();
    const res = await getDb().execute(
      `SELECT customer_id, name, SUM(amount_cents) AS total_cents, MAX(created_at) AS last_at
       FROM bids
       GROUP BY customer_id
       ORDER BY total_cents DESC, last_at ASC`,
    );
    if (res.rows.length === 0) return DEMO_BOARD;

    const sponsors: Sponsor[] = res.rows.map((row, i) => ({
      rank: i + 1,
      name: String(row.name),
      tagline: "",
      amount: Math.round(Number(row.total_cents) / 100),
      claimedAgo: timeAgo(String(row.last_at)),
    }));
    return {
      sponsors,
      claimed: sponsors.reduce((s, x) => s + x.amount, 0),
      isDemo: false,
    };
  } catch (error) {
    console.error("Failed to load board from Turso, using demo board", error);
    return DEMO_BOARD;
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
