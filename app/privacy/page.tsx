import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — EtsyAI",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#070711] text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">

        <Link href="/" className="text-purple-400 text-sm">
          ← Back to home
        </Link>

        <h1 className="text-4xl font-bold mt-6">Privacy Policy</h1>
        <p className="text-gray-500 mt-2">Last updated: September 21, 2026</p>

        <div className="mt-10 space-y-8 text-gray-300 leading-7">

          <section>
            <p>
              This Privacy Policy explains what information EtsyAI (&quot;we&quot;, &quot;us&quot;) collects,
              how we use it, and the choices you have. By using EtsyAI, you agree to this
              Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">1. Information We Collect</h2>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li>Account information: your email address and login details.</li>
              <li>
                Content you provide: product details you enter to generate listings, and the
                listings you save.
              </li>
              <li>
                Billing information: your subscription plan and payment status. Full card
                details are collected and stored by Paddle, our payment processor — we never
                see or store them.
              </li>
              <li>Basic usage data, such as which features you use and how often.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">2. How We Use Information</h2>
            <p className="mt-3">
              We use this information to provide and improve the Service, generate the
              content you request, manage your account and subscription, respond to support
              requests, and keep the Service secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">3. Third-Party Services We Use</h2>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li>
                <span className="text-white">Supabase</span> — hosts our database and
                handles account login.
              </li>
              <li>
                <span className="text-white">Paddle</span> — processes payments and acts as
                merchant of record for subscriptions.
              </li>
              <li>
                <span className="text-white">Google (Gemini API)</span> — powers the AI that
                generates your listing content.
              </li>
            </ul>
            <p className="mt-3">
              Each of these providers only receives the information needed to do its job for
              us, and has its own privacy policy governing how it handles that data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">4. Cookies</h2>
            <p className="mt-3">
              We use essential cookies to keep you logged in and to remember basic
              preferences. We don&apos;t use cookies for third-party advertising.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">5. Data Retention</h2>
            <p className="mt-3">
              We keep your account information and saved listings for as long as your
              account is active. If you&apos;d like your account and data deleted, contact us
              and we&apos;ll remove it, except where we&apos;re required to keep certain billing
              records for legal or tax reasons.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">6. Your Rights</h2>
            <p className="mt-3">
              You can ask us to access, correct, or delete your personal information at any
              time by contacting us below.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">7. Security</h2>
            <p className="mt-3">
              We use industry-standard measures (including encrypted connections and access
              controls) to protect your information, though no online service can guarantee
              perfect security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">8. Children&apos;s Privacy</h2>
            <p className="mt-3">
              EtsyAI is intended for business users and is not directed at children. We do
              not knowingly collect information from anyone under 16.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">9. Changes to This Policy</h2>
            <p className="mt-3">
              We may update this Policy from time to time. Material changes will be posted
              here with a new &quot;Last updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">10. Contact</h2>
            <p className="mt-3">
              Questions about this Policy or your data? Email{" "}
              <a href="mailto:121472muhammadarslan@gmail.com" className="text-purple-400 underline">
                121472muhammadarslan@gmail.com
              </a>
              .
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
