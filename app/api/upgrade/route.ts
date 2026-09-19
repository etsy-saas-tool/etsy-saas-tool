import { NextResponse } from "next/server";
import { applyPlan } from "@/lib/plans";

// This endpoint is called by the Lemon Squeezy webhook (see
// app/api/webhooks/lemonsqueezy/route.ts) after a real payment is
// confirmed. It is NOT reachable from the browser - a caller needs
// the internal secret below, which only server-to-server code knows.
//
// Do not wire a client "Upgrade" button directly to this route again.
// That is what previously let anyone grant themselves a paid plan
// for free by calling this endpoint with any user id and plan name.
export async function POST(req: Request) {
  try {
    const secret = req.headers.get("x-internal-secret");

    if (!secret || secret !== process.env.INTERNAL_API_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { userId, plan } = body;

    if (!userId || !["free", "starter", "pro"].includes(plan)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const result = await applyPlan(userId, plan);

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.log("UPGRADE ERROR:", error);

    return NextResponse.json(
      { error: error.message || "Upgrade failed" },
      { status: 500 }
    );
  }
}
