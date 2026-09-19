import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

const VARIANT_IDS: Record<string, string | undefined> = {
  starter: process.env.LEMONSQUEEZY_VARIANT_ID_STARTER,
  pro: process.env.LEMONSQUEEZY_VARIANT_ID_PRO,
};

// Starts a real Lemon Squeezy checkout for the logged in user.
// The plan is only ever applied for real once the webhook confirms
// payment (see app/api/webhooks/lemonsqueezy/route.ts) - this route
// never grants a plan by itself.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { plan } = body;

    if (!plan || !["starter", "pro"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const supabase = await createClient();

    const {
      data: userData,
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      return NextResponse.json(
        { error: "Please login first" },
        { status: 401 }
      );
    }

    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    const storeId = process.env.LEMONSQUEEZY_STORE_ID;
    const variantId = VARIANT_IDS[plan];

    if (!apiKey || !storeId || !variantId) {
      return NextResponse.json(
        {
          error:
            "Payments are not set up yet. Please contact support to upgrade your plan manually.",
        },
        { status: 503 }
      );
    }

    const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            checkout_data: {
              email: userData.user.email,
              custom: {
                user_id: userData.user.id,
                plan,
              },
            },
          },
          relationships: {
            store: {
              data: { type: "stores", id: storeId },
            },
            variant: {
              data: { type: "variants", id: variantId },
            },
          },
        },
      }),
    });

    const json = await response.json();

    if (!response.ok) {
      console.log("LEMONSQUEEZY CHECKOUT ERROR:", json);

      return NextResponse.json(
        { error: "Could not start checkout. Please try again later." },
        { status: 500 }
      );
    }

    const checkoutUrl = json?.data?.attributes?.url;

    return NextResponse.json({ url: checkoutUrl });
  } catch (error: any) {
    console.log("CHECKOUT ERROR:", error);

    return NextResponse.json(
      { error: error.message || "Checkout failed" },
      { status: 500 }
    );
  }
}
