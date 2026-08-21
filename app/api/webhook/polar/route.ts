import { revalidatePath } from "next/cache";
import {
  validateEvent,
  WebhookVerificationError,
} from "@polar-sh/sdk/webhooks";

import { ensureSchema, getDb } from "@/lib/db";

export async function POST(request: Request) {
  // validateEvent needs the raw body — do not parse JSON first.
  const body = await request.text();

  let event: ReturnType<typeof validateEvent>;
  try {
    event = validateEvent(
      body,
      {
        "webhook-id": request.headers.get("webhook-id") ?? "",
        "webhook-timestamp": request.headers.get("webhook-timestamp") ?? "",
        "webhook-signature": request.headers.get("webhook-signature") ?? "",
      },
      process.env.POLAR_WEBHOOK_SECRET ?? "",
    );
  } catch (error) {
    if (error instanceof WebhookVerificationError) {
      return Response.json({ received: false }, { status: 403 });
    }
    throw error;
  }

  switch (event.type) {
    case "order.paid": {
      const order = event.data;
      await ensureSchema();
      // totalAmount is what was actually charged (cents) — a 100%-discounted
      // test order records $0 and never inflates the board.
      await getDb().execute({
        sql: `INSERT INTO bids (order_id, customer_id, name, email, amount_cents)
              VALUES (?, ?, ?, ?, ?)
              ON CONFLICT(order_id) DO NOTHING`,
        args: [
          order.id,
          order.customerId,
          order.customer.name ?? order.customer.email ?? "Anonymous sponsor",
          order.customer.email ?? null,
          order.totalAmount,
        ],
      });
      revalidatePath("/");
      break;
    }
    case "customer.state_changed": {
      const customer = event.data;
      await ensureSchema();
      await getDb().execute({
        sql: `UPDATE bids SET name = ?, email = ? WHERE customer_id = ?`,
        args: [
          customer.name ?? customer.email ?? "Anonymous sponsor",
          customer.email ?? null,
          customer.id,
        ],
      });
      revalidatePath("/");
      break;
    }
  }

  return Response.json({ received: true });
}
