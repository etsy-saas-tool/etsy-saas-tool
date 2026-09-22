import { NextResponse } from "next/server";

// RETIRED - this started a Lemon Squeezy checkout, from an earlier
// payment provider that was never actually set up (no keys were ever
// configured) and has since been replaced by Paddle. Kept only as an
// inert stub so the route does nothing - safe to delete this whole
// "checkout" folder whenever convenient.
export async function POST() {
  return NextResponse.json(
    { error: "This endpoint has been retired." },
    { status: 410 }
  );
}
