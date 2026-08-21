import type { NextRequest } from "next/server";
import { polar } from "@/lib/polar";

export async function GET(request: NextRequest) {
  const products = request.nextUrl.searchParams.getAll("products");

  if (products.length === 0) {
    return Response.json(
      { error: "Missing products in query params" },
      { status: 400 },
    );
  }

  try {
    const checkout = await polar.checkouts.create({ products });
    return Response.redirect(checkout.url, 302);
  } catch (error) {
    console.error("Failed to create Polar checkout", error);
    return new Response(null, { status: 500 });
  }
}
