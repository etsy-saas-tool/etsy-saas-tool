"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "@/components/Toaster";


export default function ForgotPasswordPage() {


  const router = useRouter();


  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);



  async function sendResetLink() {


    const cleanEmail = email.trim();


    if (!cleanEmail) {

      toast("Please enter your email", "error");
      return;

    }



    try {


      setLoading(true);


      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {

        redirectTo: `${window.location.origin}/reset-password`,

      });


      if (error) {

        toast(error.message, "error");
        return;

      }


      // Always show the same "sent" message whether or not this email
      // actually has an account - this stops this form from being used
      // to check which emails are registered. Supabase behaves the same
      // way on its own.
      setSent(true);


    } catch (error: any) {

      toast(error.message || "Something went wrong", "error");

    } finally {

      setLoading(false);

    }


  }




  return (


    <main className="min-h-screen bg-[#070711] text-white flex items-center justify-center">


      <div className="w-full max-w-md bg-[#151522] border border-white/10 rounded-2xl p-8">


        <h1 className="text-3xl font-bold">
          Reset Password
        </h1>


        <p className="text-gray-400 mt-2">

          {

            sent

            ?

            "If an account exists for that email, a reset link is on its way. Check your inbox."

            :

            "Enter your email and we'll send you a link to reset your password."

          }

        </p>



        {

          !sent && (

            <>

              <input

              type="email"

              placeholder="Email address"

              value={email}

              onChange={(e) => setEmail(e.target.value)}

              onKeyDown={(e) => { if(e.key === "Enter") sendResetLink(); }}

              className="w-full mt-8 p-4 rounded-xl bg-black/30 border border-white/10 outline-none"

              />



              <button

              onClick={sendResetLink}

              disabled={loading}

              className="mt-6 w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 p-4 rounded-xl font-bold"

              >

                {

                  loading

                  ?

                  "Sending..."

                  :

                  "Send Reset Link"

                }

              </button>

            </>

          )

        }



        <p className="text-gray-400 text-sm mt-5 text-center">

          Remembered your password?

          <button

          onClick={() => router.push("/login")}

          className="text-purple-400 ml-2"

          >

            Login

          </button>

        </p>


      </div>


    </main>


  );


}
