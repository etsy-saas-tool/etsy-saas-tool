"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "@/components/Toaster";


export default function LoginPage() {


const router = useRouter();


const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [loading,setLoading] = useState(false);



async function login(){


if(!email || !password){

toast("Please enter email and password", "error");
return;

}



try{


setLoading(true);



const { data, error } = await supabase.auth.signInWithPassword({

email,
password

});



if(error){

toast(error.message, "error");
return;

}




if(data.user){


// Self-healing: if the profile insert during signup couldn't run
// (e.g. this project requires email confirmation, so there was no
// session yet at signup time), make sure a working profile exists
// now that we know for sure who this user is and they have a real
// session. Without this, a confirmed user could be stuck with no
// user_profiles row and no credits/plan at all.
const { data:existingProfile } = await supabase

.from("user_profiles")

.select("id")

.eq("id", data.user.id)

.single();

if(!existingProfile){

const { error:createError } = await supabase

.from("user_profiles")

.insert({

id: data.user.id,

email: data.user.email,

plan: "free",

credits: 5

});

if(createError){

console.log("LOGIN PROFILE SELF-HEAL ERROR:", createError);

}

}


toast("Login successful ✅", "success");


router.push("/dashboard");


}



}
catch(err:any){

toast(err.message, "error");

}
finally{

setLoading(false);

}


}




return (


<main className="min-h-screen bg-[#070711] text-white flex items-center justify-center">


<div className="w-full max-w-md bg-[#151522] border border-white/10 rounded-2xl p-8">



<h1 className="text-4xl font-bold">
Login
</h1>



<p className="text-gray-400 mt-2">
Welcome back to EtsyAI
</p>




<input

className="w-full mt-8 p-4 rounded-xl bg-black/30 border border-white/10"

placeholder="Email address"

type="email"

value={email}

onChange={(e)=>setEmail(e.target.value)}

/>





<input

className="w-full mt-4 p-4 rounded-xl bg-black/30 border border-white/10"

placeholder="Password"

type="password"

value={password}

onChange={(e)=>setPassword(e.target.value)}

/>



<div className="flex justify-end mt-3">

<a

href="/forgot-password"

className="text-sm text-purple-400 hover:text-purple-300"

>

Forgot password?

</a>

</div>



<button

onClick={login}

disabled={loading}

className="mt-6 w-full bg-purple-600 hover:bg-purple-700 p-4 rounded-xl font-bold"

>

{

loading
?
"Logging in..."
:
"Login"

}


</button>




<p className="text-gray-400 mt-6 text-center">

Don't have an account?

<a

href="/signup"

className="text-purple-400 ml-2"

>

Create Account

</a>


</p>




</div>


</main>


)


}