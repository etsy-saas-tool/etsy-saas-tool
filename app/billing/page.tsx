"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";


export default function BillingPage(){


  const [loading,setLoading] = useState(true);

  const [email,setEmail] = useState("");
  const [plan,setPlan] = useState("free");
  const [credits,setCredits] = useState(0);



  const PLAN_LIMITS: Record<string, number> = {
    free: 5,
    starter: 100,
    pro: 500,
  };



  async function loadBilling(){

    try{

      setLoading(true);

      const { data:userData } = await supabase.auth.getUser();

      const user = userData.user;

      if(!user){
        return;
      }

      setEmail(user.email || "");

      const { data:profile, error:profileError } = await supabase
        .from("user_profiles")
        .select("plan, credits")
        .eq("id", user.id)
        .single();

      if(profileError){

        console.log("BILLING PROFILE ERROR:", profileError);

        // Profile row missing for this account - create it now with
        // the free plan's default credits instead of silently
        // showing 0.
        if(profileError.code === "PGRST116"){

          const { error:createError } = await supabase
            .from("user_profiles")
            .insert({
              id: user.id,
              email: user.email,
              plan: "free",
              credits: 5
            });

          if(!createError){
            setPlan("free");
            setCredits(5);
          }else{
            console.log("BILLING PROFILE SELF-HEAL ERROR:", createError);
          }

        }

      }else{

        setPlan(profile?.plan || "free");
        setCredits(profile?.credits ?? 0);

      }

    }catch(error){

      console.log(error);

    }finally{

      setLoading(false);

    }

  }


  useEffect(()=>{

    loadBilling();

  },[]);



  const totalCredits = PLAN_LIMITS[plan] ?? 0;

  const usedPercent = totalCredits > 0
    ? Math.min(Math.round(((totalCredits - credits) / totalCredits) * 100), 100)
    : 0;



  return (

    <main className="min-h-screen bg-[#070711] text-white p-10">

      <div className="max-w-4xl mx-auto">


        <h1 className="text-4xl font-bold">

          Billing 💳

        </h1>


        <p className="text-gray-400 mt-3">

          Your current plan and AI credit usage.

        </p>



        {

          loading ? (

            <p className="text-gray-400 mt-10">Loading...</p>

          ) : (

            <>

              <div className="mt-10 grid md:grid-cols-2 gap-6">

                <div className="bg-[#151522] border border-white/10 rounded-3xl p-8">

                  <p className="text-gray-400">Current Plan</p>

                  <h2 className="text-4xl font-bold mt-3 capitalize text-purple-400">

                    {plan}

                  </h2>

                  <p className="text-gray-500 text-sm mt-3">{email}</p>

                </div>


                <div className="bg-[#151522] border border-white/10 rounded-3xl p-8">

                  <p className="text-gray-400">AI Credits Remaining</p>

                  <h2 className="text-4xl font-bold mt-3">

                    {credits} <span className="text-gray-500 text-lg">/ {totalCredits}</span>

                  </h2>

                  <div className="w-full bg-black/30 rounded-full h-3 mt-4">

                    <div
                      className="bg-purple-600 h-3 rounded-full"
                      style={{ width: `${usedPercent}%` }}
                    />

                  </div>

                  <p className="text-gray-500 text-sm mt-3">

                    Credits reset when you upgrade or renew your plan.

                  </p>

                </div>

              </div>



              <div className="mt-8 bg-[#151522] border border-white/10 rounded-3xl p-8">

                <h3 className="text-xl font-bold">Need more credits?</h3>

                <p className="text-gray-400 mt-2">

                  Upgrade any time to unlock more AI generations and features.

                </p>

                <Link

                href="/pricing"

                className="inline-block mt-5 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-bold"

                >

                  View Plans

                </Link>

              </div>



              {

                plan !== "free" && (

                  <p className="text-gray-500 text-sm mt-6">

                    To update your payment method or cancel your subscription, use the
                    &quot;Manage Subscription&quot; link in your checkout receipt email.

                  </p>

                )

              }

            </>

          )

        }


      </div>

    </main>

  );

}
