import { NextResponse } from "next/server";

// DISABLED 2026-09-21: this endpoint used to set a user's plan/credits
// directly from an unauthenticated request body ({ userId, plan }), with
// no signature check and no proof that a payment ever happened. Anyone
// who found the URL could grant themselves (or anyone) the Pro plan for
// free, or reset another user's credits. It was not called from any page
// in this app, so nothing here depends on it.
//
// Plans are now only ever granted by app/api/webhooks/paddle/route.ts,
// after Paddle verifies the payment and signs the notification. Do not
// resurrect this route without that same verification.
export async function POST() {
  return NextResponse.json(
    { error: "This endpoint has been disabled. Plan upgrades are handled by the Paddle webhook." },
    { status: 410 }
  );
}
