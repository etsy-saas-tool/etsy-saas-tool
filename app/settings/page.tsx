"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { toast } from "@/components/Toaster";

export default function SettingsPage(){

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updating, setUpdating] = useState(false);

  async function loadUser(){
    try{
      const { data:userData } = await supabase.auth.getUser();
      const user = userData.user;
      if(user?.email){
        setEmail(user.email);
      }
    }catch(error){
      console.log(error);
    }finally{
      setLoading(false);
    }
  }

  useEffect(()=>{
    loadUser();
  },[]);

  async function updatePassword(){
    if(newPassword.length < 6){
      toast("Password must be at least 6 characters", "error");
      return;
    }
    if(newPassword !== confirmPassword){
      toast("Passwords do not match", "error");
      return;
    }
    try{
      setUpdating(true);
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if(error){
        toast(error.message, "error");
        return;
      }
      toast("Password updated successfully", "success");
      setNewPassword("");
      setConfirmPassword("");
    }catch(error:any){
      toast(error.message, "error");
    }finally{
      setUpdating(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#070711] text-white p-10">
      <div className="max-w-2xl mx-auto">

        <h1 className="text-4xl font-bold">Settings ⚙️</h1>
        <p className="text-gray-400 mt-3">Manage your account settings.</p>

        <div className="mt-10 bg-[#151522] border border-white/10 rounded-3xl p-8">
          <h2 className="text-xl font-bold">Account Email</h2>
          <p className="text-gray-400 mt-3">
            {loading ? "Loading..." : email}
          </p>
        </div>

        <div className="mt-8 bg-[#151522] border border-white/10 rounded-3xl p-8">
          <h2 className="text-xl font-bold">Change Password</h2>

          <div className="mt-5 space-y-4">
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e)=>setNewPassword(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
            />

            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e)=>setConfirmPassword(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
            />

            <button
              onClick={updatePassword}
              disabled={updating}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-bold disabled:opacity-50"
            >
              {updating ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>

        <Link href="/dashboard" className="block text-center mt-12 text-purple-400">
          ← Back to Dashboard
        </Link>

      </div>
    </main>
  );
}
