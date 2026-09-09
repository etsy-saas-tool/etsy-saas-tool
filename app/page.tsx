export default function Home() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">

        <div className="text-2xl font-bold">
          Etsy<span className="text-purple-400">AI</span>
        </div>

        <div className="hidden md:flex gap-8 text-gray-300">
          <a>Features</a>
          <a>Pricing</a>
          <a>Blog</a>
        </div>

        <div className="flex gap-4">
          <a className="text-gray-300 px-4 py-2">
            Login
          </a>

          <button className="bg-purple-600 px-5 py-2 rounded-lg">
            Get Started
          </button>
        </div>

      </nav>


      {/* Hero */}
      <section className="max-w-7xl mx-auto px-8 pt-20 text-center">

        <div className="inline-block bg-purple-500/20 px-5 py-2 rounded-full text-purple-300 mb-8">
          ✨ AI Powered Etsy SEO Assistant
        </div>


        <h1 className="text-5xl md:text-7xl font-bold leading-tight">

          Create Etsy Listings
          <br />

          That <span className="text-purple-400">
          Rank & Sell
          </span>

        </h1>


        <p className="max-w-3xl mx-auto mt-8 text-xl text-gray-300">

          Generate SEO optimized Etsy titles,
          buyer-focused tags and high converting
          descriptions using AI.

        </p>


        <div className="flex justify-center gap-5 mt-10">

          <button className="bg-purple-600 px-8 py-4 rounded-xl text-lg font-semibold">
            Start Free
          </button>


          <button className="border border-gray-600 px-8 py-4 rounded-xl text-lg">
            Watch Demo
          </button>

        </div>

      </section>



      {/* Features */}

      <section className="max-w-7xl mx-auto px-8 mt-32">

        <h2 className="text-4xl font-bold text-center mb-12">
          Everything Etsy Sellers Need
        </h2>


        <div className="grid md:grid-cols-4 gap-6">


          {[
            {
              title:"SEO Titles",
              text:"Create Etsy optimized titles that improve visibility."
            },
            {
              title:"Keyword Research",
              text:"Find buyer focused keywords for your products."
            },
            {
              title:"Conversion Copy",
              text:"Generate descriptions designed to sell."
            },
            {
              title:"Listing Insights",
              text:"Improve your listings with AI recommendations."
            }

          ].map((item)=>(
            <div
            key={item.title}
            className="bg-white/5 border border-white/10 rounded-2xl p-6"
            >

              <h3 className="text-xl font-bold mb-3">
                {item.title}
              </h3>

              <p className="text-gray-400">
                {item.text}
              </p>

            </div>
          ))}


        </div>

      </section>



      {/* How it works */}

      <section className="max-w-5xl mx-auto px-8 mt-32 text-center">

        <h2 className="text-4xl font-bold">
          How It Works
        </h2>


        <div className="grid md:grid-cols-3 gap-8 mt-12">


          <div>
            <div className="text-4xl">1️⃣</div>
            <h3 className="font-bold mt-4">
              Add Product
            </h3>
            <p className="text-gray-400">
              Enter your Etsy product details.
            </p>
          </div>


          <div>
            <div className="text-4xl">2️⃣</div>
            <h3 className="font-bold mt-4">
              Generate SEO
            </h3>
            <p className="text-gray-400">
              AI creates optimized listing content.
            </p>
          </div>


          <div>
            <div className="text-4xl">3️⃣</div>
            <h3 className="font-bold mt-4">
              Publish & Sell
            </h3>
            <p className="text-gray-400">
              Improve ranking and conversions.
            </p>
          </div>


        </div>


      </section>




      {/* CTA */}

      <section className="max-w-5xl mx-auto px-8 mt-32 mb-20">

        <div className="bg-purple-600 rounded-3xl p-12 text-center">

          <h2 className="text-4xl font-bold">
            Ready to grow your Etsy shop?
          </h2>


          <p className="mt-4 text-purple-100">
            Start creating better listings today.
          </p>


          <button className="mt-8 bg-white text-black px-8 py-3 rounded-xl font-bold">
            Create Free Account
          </button>

        </div>

      </section>


    </main>
  );
}