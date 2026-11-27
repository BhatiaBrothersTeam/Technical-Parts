import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { CATALOGUE_TAG } from "@/lib/woocommerce";

function signatureMatches(body: string, signature: string, secret: string): boolean {
  const expected = createHmac("sha256", secret).update(body).digest();
  let provided: Buffer;
  try {
    provided = Buffer.from(signature, "base64");
  } catch {
    return false;
  }
  return provided.length === expected.length && timingSafeEqual(provided, expected);
}

/**
 * WooCommerce webhook target (product created/updated/deleted). Refreshes the
 * cached catalogue immediately instead of waiting for the 30-second cache.
 * Verifies WooCommerce's X-WC-Webhook-Signature (HMAC-SHA256, base64).
 */
export async function POST(req: NextRequest) {
  const secret = process.env.WOOCOMMERCE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook is not configured" }, { status: 503 });
  }

  const signature = req.headers.get("x-wc-webhook-signature");
  const body = await req.text();
  if (!signature || !signatureMatches(body, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  revalidateTag(CATALOGUE_TAG, { expire: 0 });
  return NextResponse.json({ revalidated: true });
}
