"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { toast } from "@/components/Toaster";


export default function Pricing(){


  const router = useRouter();

  const [loading,setLoading] = useState("");
  const [currentPlan,setCurrentPlan] = useState("free");
  const [checkingPlan,setCheckingPlan] = useState(true);
  const [paddleReady, setPaddleReady] = useState(false);




  const plans = [

    {
      name:"Free",
      id:"free",
      price:"$0",
      credits:"5 AI Credits",
      features:[
        "5 Etsy AI generations",
        "Save listings",
        "Basic SEO titles",
        "Basic tags generation"
      ],
    },


    {
      name:"Starter",
      id:"starter",
      price:"$9/month",
      credits:"100 AI Credits",
      features:[
        "100 Etsy AI generations",
        "Unlimited saved listings",
        "Advanced SEO titles",
        "13 optimized Etsy tags",
        "Priority AI generation"
      ],
    },


    {
      name:"Pro",
      id:"pro",
      price:"$29/month",
      credits:"500 AI Credits",
      features:[
        "500 Etsy AI generations",
        "Keyword research tools",
        "Advanced Etsy SEO",
        "Priority support"
      ],
    }

  ];




  async function loadCurrentPlan(){

    try{

      const { data:userData } = await supabase.auth.getUser();

      const user = userData.user;

      if(!user){
        setCheckingPlan(false);
        return;
      }

      const { data:profile } = await supabase
        .from("user_profiles")
        .select("plan")
        .eq("id", user.id)
        .single();

      setCurrentPlan(profile?.plan || "free");

    }catch(error){

      console.log(error);

    }finally{

      setCheckingPlan(false);

    }

  }


  useEffect(()=>{

    loadCurrentPlan();

  },[]);



  // Called once Paddle's script has finished loading in the browser.
  // This sets up Paddle with your public client token so the checkout
  // overlay can be opened. The client token is safe to expose - it is
  // not a secret (unlike an API key).
  function initPaddle(){

    const w = window as any;

    if(!w.Paddle){
      return;
    }

    const environment =
      process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === "production"
        ? "production"
        : "sandbox";

    w.Paddle.Environment.set(environment);

    w.Paddle.Initialize({
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || "",
      eventCallback: function (data: any) {

        if(data?.name === "checkout.completed"){

          toast("Payment received! Your plan will update in a few seconds.", "success");

          setTimeout(()=>{
            loadCurrentPlan();
          }, 4000);

        }

        if(data?.name === "checkout.closed"){

          setLoading("");

        }

      },
    });

    setPaddleReady(true);

  }




  async function upgrade(planId:string){


    try{


      setLoading(planId);



      const {
        data:userData
      }= await supabase.auth.getUser();



      const user = userData.user;



      if(!user){

        toast("Please login first", "error");

        router.push("/login");

        return;

      }



      const w = window as any;

      if(!w.Paddle || !paddleReady){

        toast("Payments are still loading, please try again in a moment.", "error");

        return;

      }



      const PRICE_IDS: Record<string, string | undefined> = {
        starter: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_STARTER,
        pro: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_PRO,
      };

      const priceId = PRICE_IDS[planId];



      if(!priceId){

        toast(
          "Payments are not set up yet. Please contact support to upgrade your plan manually.",
          "error"
        );

        return;

      }



      // Opens Paddle's secure checkout overlay right on this page.
      // custom_data carries the Supabase user id + plan so the webhook
      // (app/api/webhooks/paddle/route.ts) knows whose plan to update
      // once payment actually succeeds. This route never grants a plan
      // by itself - only the webhook does, after Paddle confirms payment.
      w.Paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        customer: { email: user.email },
        customData: {
          user_id: user.id,
          plan: planId,
        },
      });



    }catch(error:any){


      toast(error.message, "error");


    }


  }




  return (

    <main className="min-h-screen bg-[#070711] text-white p-10">


      <Script
        src="https://cdn.paddle.com/paddle/v2/paddle.js"
        strategy="afterInteractive"
        onLoad={initPaddle}
      />


      <div className="max-w-6xl mx-auto">



        <h1 className="text-5xl font-bold text-center">

          Choose Your Plan

        </h1>



        <p className="text-gray-400 text-center mt-4 text-lg">

          Grow your Etsy shop with AI powered SEO tools.

        </p>





        <div className="grid md:grid-cols-3 gap-8 mt-12">


          {

            plans.map((plan,index)=>{

              const isCurrent = !checkingPlan && currentPlan === plan.id;

              return (

              <div

              key={plan.name}

              className={`bg-[#151522] border rounded-3xl p-8 ${
                index===2
                ?
                "border-purple-500"
                :
                "border-white/10"
              }`}

              >


                <h2 className="text-2xl font-bold">

                  {plan.name}

                </h2>




                <p className="text-4xl font-bold mt-5">

                  {plan.price}

                </p>




                <p className="text-purple-400 mt-3 font-semibold">

                  {plan.credits}

                </p>





                <ul className="mt-8 space-y-3">


                  {

                    plan.features.map((feature)=>(


                      <li

                      key={feature}

                      className="text-gray-300"

                      >

                        ✓ {feature}

                      </li>


                    ))

                  }


                </ul>




                <button


                disabled={
                  plan.id==="free" ||
                  isCurrent ||
                  loading===plan.id
                }



                onClick={()=>upgrade(plan.id)}



                className={`mt-8 w-full py-3 rounded-xl font-bold disabled:opacity-50 ${
                  index===2
                  ?
                  "bg-purple-600 hover:bg-purple-700"
                  :
                  "bg-white/10 hover:bg-white/20"
                }`}



                >


                  {

                    isCurrent

                    ?

                    "Current Plan"

                    :

                    loading===plan.id

                    ?

                    "Opening checkout..."

                    :

                    plan.id === "free"

                    ?

                    "Free Plan"

                    :

                    "Upgrade"

                  }


                </button>




              </div>

              )

            })


          }



        </div>




        <Link

        href="/dashboard"

        className="block text-center mt-12 text-purple-400"

        >

          ← Back to Dashboard

        </Link>




      </div>


    </main>

  );


}
