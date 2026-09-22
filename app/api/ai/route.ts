import { NextResponse } from "next/server";

// RETIRED - this was an early, unauthenticated leftover version of the
// listing generator (it didn't even call the real AI model, and anyone
// could call it with no login at all). The real, secured generator is
// app/api/generate/route.ts. This file is kept only as an inert stub so
// the route does nothing - safe to delete this whole "ai" folder
// whenever convenient.
export async function POST() {
  return NextResponse.json(
    { error: "This endpoint has been retired." },
    { status: 410 }
  );
}
