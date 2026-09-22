import { NextResponse } from "next/server";

// RETIRED - this was the webhook for the old, never-configured Lemon
// Squeezy integration (replaced by Paddle - see
// app/api/webhooks/paddle/route.ts, which is the real, live one). Kept
// only as an inert stub so the route does nothing - safe to delete this
// whole "lemonsqueezy" folder whenever convenient. Do NOT delete the
// sibling "paddle" folder - that one is live.
export async function POST() {
  return NextResponse.json(
    { error: "This endpoint has been retired." },
    { status: 410 }
  );
}
