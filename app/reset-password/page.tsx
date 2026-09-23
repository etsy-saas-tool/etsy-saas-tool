"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "@/components/Toaster";

// This is the page the "Reset Password" email link points to
// (see redirectTo in app/forgot-password/page.tsx). Supabase reads the
// recovery token straight from the URL as soon as this page loads and
// fires a "PASSWORD_RECOVERY" event once a temporary session is ready -
// only then is it safe to show the "set new password" form.

export default function ResetPasswordPage() {


  const router = useRouter();


  const [ready, setReady] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);



  useEffect(() => {


    const { data: listener } = supabase.auth.onAuthStateChange((event) => {

      if (event === "PASSWORD_RECOVERY") {

        setReady(true);

      }

    });


    // Covers a page refresh after the recovery session is already active.
    supabase.auth.getSession().then(({ data }) => {

      if (data.session) {

        setReady(true);

      }

    });


    return () => {

      listener.subscription.unsubscribe();

    };


  }, []);



  async function updatePassword() {


    if (password.length < 6) {

      toast("Password must be at least 6 characters", "error");
      return;

    }


    if (password !== confirmPassword) {

      toast("Passwords do not match", "error");
      return;

    }



    try {


      setLoading(true);


      const { error } = await supabase.auth.updateUser({ password });


      if (error) {

        toast(error.message, "error");
        return;

      }


      toast("Password updated! Logging you in...", "success");

      router.push("/dashboard");


    } catch (error: any) {

      toast(error.message || "Failed to update password", "error");

    } finally {

      setLoading(false);

    }


  }




  return (


    <main className="min-h-screen bg-[#070711] text-white flex items-center justify-center">


      <div className="w-full max-w-md bg-[#151522] border border-white/10 rounded-2xl p-8">


        <h1 className="text-3xl font-bold">
          Set New Password
        </h1>


        <p className="text-gray-400 mt-2">

          {

            ready

            ?

            "Choose a new password for your account."

            :

            "Verifying your reset link..."

          }

        </p>



        {

          ready && (

            <>

              <input

              type="password"

              placeholder="New password (minimum 6 characters)"

              value={password}

              onChange={(e) => setPassword(e.target.value)}

              onKeyDown={(e) => { if(e.key === "Enter") updatePassword(); }}

              className="w-full mt-8 p-4 rounded-xl bg-black/30 border border-white/10 outline-none"

              />



              <input

              type="password"

              placeholder="Confirm new password"

              value={confirmPassword}

              onChange={(e) => setConfirmPassword(e.target.value)}

              onKeyDown={(e) => { if(e.key === "Enter") updatePassword(); }}

              className="w-full mt-4 p-4 rounded-xl bg-black/30 border border-white/10 outline-none"

              />



              <button

              onClick={updatePassword}

              disabled={loading}

              className="mt-6 w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 p-4 rounded-xl font-bold"

              >

                {

                  loading

                  ?

                  "Updating..."

                  :

                  "Update Password"

                }

              </button>

            </>

          )

        }


      </div>


    </main>


  );


}
