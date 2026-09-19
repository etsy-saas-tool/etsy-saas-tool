import { NextResponse } from "next/server";
import crypto from "crypto";
import { applyPlan } from "@/lib/plans";

// Paddle calls this URL whenever a checkout/subscription event happens.
// In your Paddle dashboard, go to Developer Tools -> Notifications,
// create a destination, set its URL to:
//   https://YOUR-DOMAIN/api/webhooks/paddle
// and copy the secret key it gives you into PADDLE_WEBHOOK_SECRET in
// .env.local.
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
    const plan = customData?.plan;

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
      plan &&
      (status === "active" || status === "trialing" || !status)
    ) {
      await applyPlan(userId, plan);
      console.log(`PADDLE WEBHOOK: applied plan "${plan}" to user ${userId}`);
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
