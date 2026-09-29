import { NextResponse } from "next/server";
import { sendEmail, welcomeEmailHtml } from "@/lib/email";

// Called once, right after a successful signup (see app/signup/page.tsx).
// No auth check on purpose - it only ever sends one fixed welcome email
// to the address that was just created, and a failure here must never
// block or fail the signup flow itself, which is why the caller doesn't
// await this seriously either (fire-and-forget).
export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "email required" }, { status: 400 });
    }

    await sendEmail({
      to: email,
      subject: "Welcome to EtsyAI 🎉",
      html: welcomeEmailHtml(),
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.log("WELCOME EMAIL ROUTE ERROR:", error);
    // Still 200 - this is a best-effort side-effect, not something the
    // signup page should treat as a real failure.
    return NextResponse.json({ ok: false });
  }
}
