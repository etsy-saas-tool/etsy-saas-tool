import { NextResponse } from "next/server";
import crypto from "crypto";
import { applyPlan } from "@/lib/plans";

// Paddle calls this URL whenever a checkout/subscription event happens.
// In your Paddle dashboard, go to Developer Tools -> Notifications,
// create a destination, set its URL to:
//   https://YOUR-DOMAIN/api/webhooks/paddle
// and copy the secret key it gives you into PADDLE_WEBHOOK_SECRET in
// .env.local.

// Map Paddle price IDs -> plan names. This is the ONLY thing we trust to
// decide which plan someone actually paid for. The event also carries a
// customData.plan field that the checkout page itself sent to Paddle,
// but that's just data the browser attached before paying - nothing
// stops someone from tampering with it and asking to be granted "pro"
// while actually paying for "starter". The price ID Paddle bills is set
// by us in the checkout call and confirmed by Paddle's own systems, so
// it can't be tampered with client-side - that's what we derive the
// plan from instead of ever trusting customData.plan directly.
const PRICE_ID_TO_PLAN: Record<string, string> = {};

if (process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_STARTER) {
  PRICE_ID_TO_PLAN[process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_STARTER] = "starter";
}

if (process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_PRO) {
  PRICE_ID_TO_PLAN[process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_PRO] = "pro";
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signatureHeader = req.headers.get("paddle-signature") || "";
    const secret = process.env.PADDLE_WEBHOOK_SECRET;

    if (!secret) {
      console.log("PADDLE WEBHOOK: missing PADDLE_WEBHOOK_SECRET");
      return NextResponse.json({ error: "Not configured" }, { status: 500 });
    }

    // Paddle sends this header as: ts=1234567890;h1=abcdef...
    const parts: Record<string, string> = {};
    for (const part of signatureHeader.split(";")) {
      const [key, value] = part.split("=");
      if (key && value) {
        parts[key] = value;
      }
    }

    const timestamp = parts.ts;
    const receivedSignature = parts.h1 || "";

    if (!timestamp || !receivedSignature) {
      console.log("PADDLE WEBHOOK: malformed signature header");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const signedPayload = `${timestamp}:${rawBody}`;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(signedPayload)
      .digest("hex");

    const isValid =
      receivedSignature.length === expectedSignature.length &&
      crypto.timingSafeEqual(
        Buffer.from(receivedSignature),
        Buffer.from(expectedSignature)
      );

    if (!isValid) {
      console.log("PADDLE WEBHOOK: invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    const eventType = event?.event_type;
    const data = event?.data;
    const customData = data?.custom_data;
    const status = data?.status;

    const userId = customData?.user_id;

    // Derive the plan from the price Paddle actually billed - see the
    // comment on PRICE_ID_TO_PLAN above for why we never use
    // customData.plan directly to decide what to grant.
    const priceId = data?.items?.[0]?.price?.id;
    const plan = priceId ? PRICE_ID_TO_PLAN[priceId] : undefined;

    // These events mean the subscription is active (or should stay
    // active) - grant the plan the customer paid for.
    const grantEvents = [
      "subscription.created",
      "subscription.activated",
      "subscription.updated",
      "subscription.resumed",
    ];

    // These events mean the subscription stopped - revert to free.
    const revokeEvents = ["subscription.canceled", "subscription.paused"];

    if (
      grantEvents.includes(eventType) &&
      userId &&
      (status === "active" || status === "trialing" || !status)
    ) {
      if (plan) {
        await applyPlan(userId, plan);
        console.log(
          `PADDLE WEBHOOK: applied plan "${plan}" to user ${userId} (price ${priceId})`
        );
      } else {
        // Safe default: if the price ID doesn't match a known plan, do
        // NOT grant anything automatically - just log it so it can be
        // checked by hand. Silently trusting an unrecognized price (or
        // falling back to customData.plan here) is exactly the gap that
        // would let someone claim a plan they didn't pay for.
        console.log(
          `PADDLE WEBHOOK: could not match price "${priceId}" to a known plan for user ${userId} - no plan change applied`
        );
      }
    } else if (revokeEvents.includes(eventType) && userId) {
      await applyPlan(userId, "free");
      console.log(`PADDLE WEBHOOK: reverted user ${userId} to free`);
    } else {
      console.log(`PADDLE WEBHOOK: ignored event "${eventType}"`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.log("PADDLE WEBHOOK ERROR:", error);

    return NextResponse.json(
      { error: error.message || "Webhook failed" },
      { status: 500 }
    );
  }
}
