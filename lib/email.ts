// Thin wrapper around Resend's REST API using plain fetch - no SDK
// package to install, so this ships immediately with zero npm install.
//
// Safe by design: until RESEND_API_KEY is set, every call just logs
// and returns instead of throwing, so signup and listing generation
// keep working exactly as before while you finish the one-time setup.
//
// One-time setup (free):
//   1. Sign up at https://resend.com (free tier: 3,000 emails/month)
//   2. Skip domain verification for now and just use their shared
//      "onboarding@resend.dev" sender while testing (works immediately)
//   3. Dashboard -> API Keys -> Create API Key
//   4. Add to .env.local AND to Vercel's Project Settings -> Environment
//      Variables (both places, same as the other keys):
//        RESEND_API_KEY=re_xxxxxxxx
//        EMAIL_FROM=EtsyAI <onboarding@resend.dev>
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || "EtsyAI <onboarding@resend.dev>";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ skipped: boolean; ok?: boolean }> {
  if (!RESEND_API_KEY) {
    console.log(`EMAIL SKIPPED (RESEND_API_KEY not set yet) -> ${to}: ${subject}`);
    return { skipped: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: EMAIL_FROM, to, subject, html }),
    });

    if (!res.ok) {
      console.log("EMAIL SEND FAILED:", res.status, await res.text());
      return { skipped: false, ok: false };
    }

    return { skipped: false, ok: true };
  } catch (error) {
    // Emails are a nice-to-have - a network hiccup here must never
    // break signup or listing generation.
    console.log("EMAIL SEND ERROR:", error);
    return { skipped: false, ok: false };
  }
}

export function welcomeEmailHtml() {
  return `
    <div style="font-family: -apple-system, Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #111;">
      <h1 style="color:#9333ea;">Welcome to EtsyAI 🎉</h1>
      <p>You're all set with <strong>5 free AI credits</strong> to create optimized Etsy listings.</p>
      <p>Head to your dashboard to generate your first SEO-ready title, 13 tags, and description in seconds.</p>
      <p style="margin-top:24px;">
        <a href="https://etsy-saas-tool.vercel.app/generator" style="background:#9333ea;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">
          Create Your First Listing
        </a>
      </p>
      <p style="color:#888;font-size:13px;margin-top:32px;">Questions? Just reply to this email, or ask Lisa, our support assistant, right on the site.</p>
    </div>
  `;
}

export function lowCreditsEmailHtml() {
  return `
    <div style="font-family: -apple-system, Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #111;">
      <h1 style="color:#9333ea;">You're almost out of credits</h1>
      <p>You've got <strong>1 AI credit</strong> left on your EtsyAI plan.</p>
      <p>Upgrade to keep generating optimized Etsy listings without interruption.</p>
      <p style="margin-top:24px;">
        <a href="https://etsy-saas-tool.vercel.app/pricing" style="background:#9333ea;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">
          View Plans
        </a>
      </p>
    </div>
  `;
}
