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


toast("Login successful", "success");


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

Don&apos;t have an account?

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
