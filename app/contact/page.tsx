import Link from "next/link";

export const metadata = {
  title: "Contact — EtsyAI",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#070711] text-white flex items-center justify-center p-10">

      <div className="max-w-lg w-full bg-[#151522] border border-white/10 rounded-3xl p-10 text-center">

        <h1 className="text-3xl font-bold">Contact Us</h1>

        <p className="text-gray-400 mt-4 leading-7">
          Questions about EtsyAI, your account, billing, or anything else? We&apos;re happy
          to help — email us and we&apos;ll get back to you as soon as we can.
        </p>

        <a
          href="mailto:umairmagsi16@gmail.com"
          className="inline-block mt-8 bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-xl font-bold"
        >
          umairmagsi16@gmail.com
        </a>

        <div className="mt-8">
          <Link href="/" className="text-purple-400 text-sm">
            ← Back to home
          </Link>
        </div>

      </div>

    </main>
  );
}
