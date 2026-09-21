"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

// Paddle sends the buyer here (settings.successUrl in app/pricing/page.tsx)
// right after checkout completes. The webhook (app/api/webhooks/paddle/route.ts)
// is what actually grants the plan - it can take a few seconds to arrive, so
// this page polls the profile a few times instead of assuming it's done yet.

export default function WelcomePage() {

  const [plan, setPlan] = useState("free");
  const [credits, setCredits] = useState(0);
  const [ready, setReady] = useState(false);

  async function checkProfile() {

    try {

      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      if (!user) {
        return false;
      }

      const { data: profile } = await supabase
        .from("user_profiles")
        .select("plan, credits")
        .eq("id", user.id)
        .single();

      setPlan(profile?.plan || "free");
      setCredits(profile?.credits ?? 0);

      return (profile?.plan || "free") !== "free";

    } catch (error) {

      console.log(error);
      return false;

    }

  }

  useEffect(() => {

    let attempts = 0;

    async function poll() {

      const upgraded = await checkProfile();

      attempts += 1;

      if (!upgraded && attempts < 8) {
        setTimeout(poll, 2000);
      } else {
        setReady(true);
      }

    }

    poll();

  }, []);

  return (

    <main className="min-h-screen bg-[#070711] text-white p-10 flex items-center justify-center">

      <div className="max-w-lg w-full bg-[#151522] border border-white/10 rounded-3xl p-10 text-center">

        <div className="text-5xl">🎉</div>

        <h1 className="text-3xl font-bold mt-5">
          Thanks for upgrading!
        </h1>

        <p className="text-gray-400 mt-3">
          {ready ? (
            plan !== "free" ? (
              <>
                You&apos;re now on the <span className="text-purple-400 font-bold capitalize">{plan}</span> plan
                with <span className="text-white font-semibold">{credits}</span> AI credits.
              </>
            ) : (
              <>
                Payment received — your plan is still updating. This can take a minute; refresh
                your billing page shortly if it doesn&apos;t show up right away.
              </>
            )
          ) : (
            "Confirming your payment with Paddle..."
          )}
        </p>

        <Link
          href="/dashboard"
          className="inline-block mt-8 bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-xl font-bold"
        >
          Go to Dashboard →
        </Link>

      </div>

    </main>

  );

}
