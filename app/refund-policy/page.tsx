import Link from "next/link";

export const metadata = {
  title: "Refund Policy — EtsyAI",
};

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-[#070711] text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">

        <Link href="/" className="text-purple-400 text-sm">
          ← Back to home
        </Link>

        <h1 className="text-4xl font-bold mt-6">Refund Policy</h1>
        <p className="text-gray-500 mt-2">Last updated: September 21, 2026</p>

        <div className="mt-10 space-y-8 text-gray-300 leading-7">

          <section>
            <h2 className="text-xl font-bold text-white">Cancelling Your Subscription</h2>
            <p className="mt-3">
              You can cancel your Starter or Pro subscription at any time from your billing
              page inside EtsyAI. When you cancel, you keep access until the end of the
              period you&apos;ve already paid for, and you won&apos;t be charged again after
              that.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">7-Day Refund Guarantee</h2>
            <p className="mt-3">
              If you&apos;re a first-time subscriber and EtsyAI isn&apos;t right for you,
              contact us within 7 days of your first payment and we&apos;ll refund it in
              full — no questions asked.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">After 7 Days</h2>
            <p className="mt-3">
              Outside the 7-day window, payments are non-refundable, including for any
              unused AI credits remaining in your current billing period. This keeps things
              simple and fair for everyone. If you were charged in error (for example, a
              duplicate charge), contact us and we&apos;ll make it right.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">How Refunds Are Paid</h2>
            <p className="mt-3">
              Refunds are issued by Paddle, our payment processor, back to your original
              payment method, and typically appear within 5–10 business days depending on
              your bank or card provider.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">Requesting a Refund</h2>
            <p className="mt-3">
              Email{" "}
              <a href="mailto:121472muhammadarslan@gmail.com" className="text-purple-400 underline">
                121472muhammadarslan@gmail.com
              </a>{" "}
              with the email address on your account, and we&apos;ll take care of it.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
