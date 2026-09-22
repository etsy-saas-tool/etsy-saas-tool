"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "@/components/Toaster";


export default function SettingsPage(){


const router = useRouter();


const [loading,setLoading] = useState(true);

const [email,setEmail] = useState("");
const [plan,setPlan] = useState("free");
const [credits,setCredits] = useState(0);


const [newPassword,setNewPassword] = useState("");
const [confirmPassword,setConfirmPassword] = useState("");
const [savingPassword,setSavingPassword] = useState(false);


const [loggingOut,setLoggingOut] = useState(false);




async function loadAccount(){

try{

setLoading(true);

const {
data:userData
}= await supabase.auth.getUser();

const user = userData.user;

if(!user){

router.push("/login");
return;

}

setEmail(user.email || "");

const {
data:profile
}= await supabase

.from("user_profiles")

.select("plan, credits")

.eq("id", user.id)

.single();

setPlan(profile?.plan || "free");

setCredits(profile?.credits ?? 0);

}

catch(error){

console.log("SETTINGS LOAD ERROR:", error);

}

finally{

setLoading(false);

}

}




useEffect(()=>{

loadAccount();

},[]);




async function updatePassword(){

if(!newPassword || !confirmPassword){

toast("Please fill in both password fields", "error");
return;

}

if(newPassword.length < 6){

toast("Password must be at least 6 characters", "error");
return;

}

if(newPassword !== confirmPassword){

toast("Passwords do not match", "error");
return;

}

try{

setSavingPassword(true);

const {
error
}= await supabase.auth.updateUser({
password: newPassword
});

if(error){

throw error;

}

toast("Password updated successfully ✅", "success");

setNewPassword("");
setConfirmPassword("");

}

catch(error:any){

toast(error.message || "Could not update password", "error");

}

finally{

setSavingPassword(false);

}

}




async function handleLogout(){

try{

setLoggingOut(true);

await supabase.auth.signOut();

router.push("/login");

}

catch(error:any){

toast(error.message || "Could not log out", "error");

setLoggingOut(false);

}

}




if(loading){

return (

<main className="min-h-screen bg-[#070711] text-white p-10">

Loading settings...

</main>

);

}




return (

<main className="min-h-screen bg-[#070711] text-white p-10">

<div className="max-w-4xl mx-auto">


<h1 className="text-4xl font-bold">

Settings ⚙️

</h1>


<p className="text-gray-400 mt-3">

Manage your account details and preferences.

</p>



{/* ACCOUNT */}

<div className="mt-10 bg-[#151522] border border-white/10 rounded-3xl p-8">

<h2 className="text-2xl font-bold text-purple-400">

Account

</h2>

<p className="text-gray-400 mt-4">Email</p>

<p className="text-lg mt-1">{email}</p>

<div className="mt-6 grid md:grid-cols-2 gap-6">

<div className="bg-black/20 rounded-2xl p-5">

<p className="text-gray-400">Current Plan</p>

<h3 className="text-2xl font-bold mt-2 capitalize text-purple-400">{plan}</h3>

</div>

<div className="bg-black/20 rounded-2xl p-5">

<p className="text-gray-400">AI Credits Remaining</p>

<h3 className="text-2xl font-bold mt-2">{credits}</h3>

</div>

</div>

<Link href="/billing" className="inline-block mt-6 text-purple-400 hover:text-purple-300 text-sm">

Manage billing &amp; plan →

</Link>

</div>



{/* PASSWORD */}

<div className="mt-8 bg-[#151522] border border-white/10 rounded-3xl p-8">

<h2 className="text-2xl font-bold text-purple-400">

Change Password

</h2>

<p className="text-gray-400 mt-2">

Update the password you use to log in.

</p>

<div className="mt-6 space-y-4 max-w-md">

<div>

<label className="text-sm text-gray-400">New Password</label>

<input
type="password"
value={newPassword}
onChange={(e)=>setNewPassword(e.target.value)}
className="mt-2 w-full bg-black/30 border border-white/10 rounded-xl p-4"
placeholder="At least 6 characters"
/>

</div>

<div>

<label className="text-sm text-gray-400">Confirm New Password</label>

<input
type="password"
value={confirmPassword}
onChange={(e)=>setConfirmPassword(e.target.value)}
className="mt-2 w-full bg-black/30 border border-white/10 rounded-xl p-4"
/>

</div>

<button
onClick={updatePassword}
disabled={savingPassword}
className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-bold"
>

{savingPassword ? "Saving..." : "Update Password"}

</button>

</div>

</div>



{/* LOGOUT */}

<div className="mt-8 bg-[#151522] border border-white/10 rounded-3xl p-8">

<h2 className="text-2xl font-bold text-red-400">

Log Out

</h2>

<p className="text-gray-400 mt-2">

Sign out of EtsyAI on this device.

</p>

<button
onClick={handleLogout}
disabled={loggingOut}
className="mt-5 bg-red-600/20 border border-red-500/30 hover:bg-red-600/30 text-red-300 px-6 py-3 rounded-xl font-bold"
>

{loggingOut ? "Logging out..." : "Log Out"}

</button>

</div>


</div>

</main>

);

}
