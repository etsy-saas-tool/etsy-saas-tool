import { NextResponse } from "next/server";
import crypto from "crypto";
import { applyPlan } from "@/lib/plans";

// Lemon Squeezy calls this URL after a checkout or subscription event.
// In your Lemon Squeezy dashboard, set the webhook URL to:
//   https://YOUR-DOMAIN/api/webhooks/lemonsqueezy
// and set the signing secret to the same value as
// LEMONSQUEEZY_WEBHOOK_SECRET in .env.local.
export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-signature") || "";
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

    if (!secret) {
      console.log("LEMONSQUEEZY WEBHOOK: missing LEMONSQUEEZY_WEBHOOK_SECRET");
      return NextResponse.json({ error: "Not configured" }, { status: 500 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    const isValid =
      signature.length === expectedSignature.length &&
      crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );

    if (!isValid) {
      console.log("LEMONSQUEEZY WEBHOOK: invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    const eventName = event?.meta?.event_name;
    const customData = event?.meta?.custom_data;

    const userId = customData?.user_id;
    const plan = customData?.plan;

    const grantEvents = [
      "order_created",
      "subscription_created",
      "subscription_updated",
      "subscription_resumed",
    ];

    const revokeEvents = ["subscription_cancelled", "subscription_expired"];

    if (grantEvents.includes(eventName) && userId && plan) {
      await applyPlan(userId, plan);
      console.log(`LEMONSQUEEZY WEBHOOK: applied plan "${plan}" to user ${userId}`);
    } else if (revokeEvents.includes(eventName) && userId) {
      await applyPlan(userId, "free");
      console.log(`LEMONSQUEEZY WEBHOOK: reverted user ${userId} to free`);
    } else {
      console.log(`LEMONSQUEEZY WEBHOOK: ignored event "${eventName}"`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.log("LEMONSQUEEZY WEBHOOK ERROR:", error);

    return NextResponse.json(
      { error: error.message || "Webhook failed" },
      { status: 500 }
    );
  }
}
