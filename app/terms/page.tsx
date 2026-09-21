import Link from "next/link";

export const metadata = {
  title: "Terms of Service — EtsyAI",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#070711] text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">

        <Link href="/" className="text-purple-400 text-sm">
          ← Back to home
        </Link>

        <h1 className="text-4xl font-bold mt-6">Terms of Service</h1>
        <p className="text-gray-500 mt-2">Last updated: September 21, 2026</p>

        <div className="mt-10 space-y-8 text-gray-300 leading-7">

          <section>
            <h2 className="text-xl font-bold text-white">1. Agreement to Terms</h2>
            <p className="mt-3">
              These Terms of Service (&quot;Terms&quot;) govern your access to and use of EtsyAI
              (the &quot;Service&quot;), a tool that helps Etsy sellers generate AI-assisted product
              listings, keywords, and related content. By creating an account or using the
              Service, you agree to these Terms. If you do not agree, please do not use the
              Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">2. The Service</h2>
            <p className="mt-3">
              EtsyAI uses artificial intelligence to generate suggested titles, tags,
              descriptions, pricing guidance, and related content for products you provide
              information about. Generated content is a suggestion only — you are
              responsible for reviewing it and for how you use it on Etsy or any other
              platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">3. Accounts</h2>
            <p className="mt-3">
              You need an account to use the Service. You are responsible for keeping your
              login details secure and for all activity that happens under your account.
              Let us know right away if you believe your account has been accessed without
              your permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">4. Plans, Billing &amp; Credits</h2>
            <p className="mt-3">
              EtsyAI offers a free plan and paid subscription plans (Starter and Pro), each
              with a monthly allowance of AI generation credits. Paid subscriptions renew
              automatically each month until cancelled. You can cancel at any time from your
              billing page — you&apos;ll keep access until the end of the period you already
              paid for.
            </p>
            <p className="mt-3">
              Payments are processed for us by Paddle.com Market Limited, our reseller and
              merchant of record. Paddle handles your payment details and taxes; we never
              see or store your full card details. Your purchase is subject to{" "}
              <a
                href="https://www.paddle.com/legal/checkout-buyer-terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 underline"
              >
                Paddle&apos;s Buyer Terms
              </a>{" "}
              as well as these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">5. Acceptable Use</h2>
            <p className="mt-3">
              You agree not to misuse the Service — for example, by attempting to break or
              bypass it, reselling access without permission, or using it to generate
              content that is illegal, infringing, or deceptive.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">6. Your Content</h2>
            <p className="mt-3">
              You keep ownership of the product information you enter and the content
              EtsyAI generates for you. You&apos;re responsible for making sure anything you
              publish (on Etsy or elsewhere) complies with that platform&apos;s own rules.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">7. Cancellation &amp; Refunds</h2>
            <p className="mt-3">
              You may cancel your subscription at any time. See our{" "}
              <Link href="/refund-policy" className="text-purple-400 underline">
                Refund Policy
              </Link>{" "}
              for details on refunds.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">8. Disclaimer</h2>
            <p className="mt-3">
              The Service is provided &quot;as is.&quot; AI-generated content may sometimes be
              inaccurate or unsuitable — you&apos;re responsible for reviewing it before use.
              We don&apos;t guarantee any particular sales results, rankings, or outcomes on
              Etsy or any other marketplace.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">9. Limitation of Liability</h2>
            <p className="mt-3">
              To the fullest extent permitted by law, EtsyAI is not liable for indirect,
              incidental, or consequential damages arising from your use of the Service. Our
              total liability for any claim is limited to the amount you paid us in the 3
              months before the claim arose.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">10. Changes to These Terms</h2>
            <p className="mt-3">
              We may update these Terms from time to time. If we make material changes,
              we&apos;ll post the updated version here with a new &quot;Last updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">11. Contact</h2>
            <p className="mt-3">
              Questions about these Terms? Reach us at{" "}
              <a href="mailto:umairmagsi16@gmail.com" className="text-purple-400 underline">
                umairmagsi16@gmail.com
              </a>
              .
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
