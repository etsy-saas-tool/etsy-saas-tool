"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "@/components/Toaster";

// A short blocklist of common disposable/temp-mail domains. This is a
// speed bump, not a wall - it stops the casual "grab another 5 free
// credits" case (typing a throwaway address into the form) without
// needing any new service or account. Someone determined can still
// get around it; that's an acceptable tradeoff for a free tier this
// small.
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "10minutemail.com",
  "10minutemail.net",
  "tempmail.com",
  "temp-mail.org",
  "throwawaymail.com",
  "yopmail.com",
  "trashmail.com",
  "getnada.com",
  "fakeinbox.com",
  "sharklasers.com",
  "dispostable.com",
  "maildrop.cc",
  "mintemail.com",
  "mailnesia.com",
  "emailondeck.com",
  "moakt.com",
]);

function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase().trim();
  return !!domain && DISPOSABLE_EMAIL_DOMAINS.has(domain);
}


export default function SignupPage() {


  const router = useRouter();


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);



  async function signup() {


    const cleanEmail = email.trim();


    if (!cleanEmail) {

      toast("Please enter your email", "error");
      return;

    }


    if (password.length < 6) {

      toast("Password must be at least 6 characters", "error");
      return;

    }


    if (isDisposableEmail(cleanEmail)) {

      toast("Please use a permanent email address to sign up", "error");
      return;

    }


    try {


      setLoading(true);



      // Create Auth User

      const { data, error } = await supabase.auth.signUp({

        email: cleanEmail,

        password: password.trim()

      });



      if(error){

        toast(error.message, "error");
        return;

      }




      if(data.user){



        // Create User Profile.
        // NOTE: if this Supabase project requires email confirmation,
        // there is no active session yet at this point, so this insert
        // can fail depending on RLS policies (a brand new, unconfirmed
        // user has no way to prove who they are yet). We don't want to
        // block/fail the whole signup just because of that - login()
        // double-checks for a missing profile and creates it the moment
        // this same user actually has a session (right after they
        // confirm their email and log in for the first time).
        const { error:profileError } = await supabase
        .from("user_profiles")
        .insert({

          id: data.user.id,

          email: data.user.email,

          plan: "free",

          credits: 5

        });



        if(profileError){

          console.log("SIGNUP PROFILE ERROR:", profileError);

        }


        // Best-effort welcome email - fire and forget. This must never
        // block or fail the signup flow itself, so we deliberately
        // don't await/throw on it.
        fetch("/api/send-welcome-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.user.email }),
        }).catch(() => {});




        if(data.session){

          // Email confirmation is off for this project, so Supabase
          // already logged them in - take them straight to the app.
          toast("Account created successfully! Logging you in...", "success");

          router.push("/dashboard");

        }else{

          // Email confirmation is required before they can log in.
          toast(
            "Account created! Please check your email to confirm, then log in.",
            "success"
          );

          router.push("/login");

        }


      }




    }catch(error:any){


      toast(
        error.message || "Signup failed",
        "error"
      );


    }finally{


      setLoading(false);


    }



  }







  return (

<main className="min-h-screen bg-[#070711] text-white flex items-center justify-center">


<div className="w-full max-w-md bg-[#151522] border border-white/10 rounded-2xl p-8">


<h1 className="text-3xl font-bold">
Create Account
</h1>


<p className="text-gray-400 mt-2">
Start creating AI Etsy listings
</p>





<input

type="email"

placeholder="Email address"

value={email}

onChange={(e)=>setEmail(e.target.value)}

onKeyDown={(e)=>{ if(e.key==="Enter") signup(); }}

className="w-full mt-8 p-4 rounded-xl bg-black/30 border border-white/10 outline-none"

/>





<input

type="password"

placeholder="Password (minimum 6 characters)"

value={password}

onChange={(e)=>setPassword(e.target.value)}

onKeyDown={(e)=>{ if(e.key==="Enter") signup(); }}

className="w-full mt-4 p-4 rounded-xl bg-black/30 border border-white/10 outline-none"

/>






<button

onClick={signup}

disabled={loading}

className="mt-6 w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 p-4 rounded-xl font-bold"

>

{

loading

?

"Creating Account..."

:

"Create Account"

}


</button>





<p className="text-gray-400 text-sm mt-5 text-center">


Already have an account?


<button

onClick={()=>router.push("/login")}

className="text-purple-400 ml-2"

>

Login

</button>



</p>




</div>


</main>


  );


}