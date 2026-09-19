"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";


export default function Navbar() {


  const router = useRouter();


  const [email, setEmail] = useState("");
  const [name, setName] = useState("User");
  const [plan, setPlan] = useState("Free");




  useEffect(() => {


    async function getUser(){


      const {
        data
      } = await supabase.auth.getUser();



      const user = data.user;




      if(user?.email){


        setEmail(user.email);


        setName(
          user.email
          .split("@")[0]
          .charAt(0)
          .toUpperCase()
        );



        const {
          data:profile
        } = await supabase

        .from("user_profiles")

        .select("plan")

        .eq("id", user.id)

        .single();





        if(profile?.plan){

          setPlan(
            profile.plan.charAt(0).toUpperCase() +
            profile.plan.slice(1)
          );

        }


      }


    }


    getUser();


  }, []);







  async function logout(){


    await supabase.auth.signOut();


    router.push("/login");


  }







  return (


<header className="fixed top-0 right-0 left-64 h-20 bg-[#070711] border-b border-white/10 flex items-center justify-between px-8 text-white">



<div>


<h2 className="text-xl font-semibold">

EtsyAI Dashboard

</h2>



<p className="text-sm text-gray-400">

AI powered Etsy growth assistant

</p>


</div>







<div className="flex items-center gap-5">





<button

onClick={()=>router.push("/pricing")}

className="bg-purple-600/20 border border-purple-500/30 px-4 py-2 rounded-xl hover:bg-purple-600/30 transition"

>


<span className="text-purple-400 font-semibold">

{plan} Plan

</span>


</button>








<div className="flex items-center gap-3">



<div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold">

{name}

</div>







<div>


<p className="font-semibold">

{email || "User"}

</p>


<p className="text-xs text-gray-400">

Seller Account

</p>


</div>







<button

onClick={logout}

className="ml-4 text-sm text-red-400 hover:text-red-300"

>

Logout

</button>





</div>





</div>





</header>


  );


}