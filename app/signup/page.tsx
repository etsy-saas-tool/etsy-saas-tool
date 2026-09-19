"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "@/components/Toaster";


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



        // Create User Profile
        // Note: the database now enforces plan="free" and credits=5
        // for every new signup, regardless of what is sent here.

        const { error:profileError } = await supabase
        .from("user_profiles")
        .insert({

          id: data.user.id,

          email: data.user.email,

          plan: "free",

          credits: 5

        });



        if(profileError){

          toast("Profile error: " + profileError.message, "error");
          return;

        }




        toast("Account created successfully!", "success");



        router.push("/login");


      }




    }catch(error:any){


      toast(error.message || "Signup failed", "error");


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

className="w-full mt-8 p-4 rounded-xl bg-black/30 border border-white/10 outline-none"

/>





<input

type="password"

placeholder="Password (minimum 6 characters)"

value={password}

onChange={(e)=>setPassword(e.target.value)}

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
