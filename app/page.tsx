import Link from "next/link";

export default function Home() {

  return (

    <main className="min-h-screen bg-[#050816] text-white">


      {/* Navbar */}

      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">


        <div className="text-3xl font-bold">

          Etsy
          <span className="text-purple-500">
            AI
          </span>

        </div>



        <div className="hidden md:flex gap-8 text-gray-300">

          <a href="#features">
            Features
          </a>

          <Link href="/pricing">
            Pricing
          </Link>

          <a href="#faq">
            FAQ
          </a>

        </div>



        <div className="flex items-center gap-5">

          <Link
            href="/login"
            className="text-gray-300 hover:text-white"
          >
            Login
          </Link>

          <Link

          href="/generator"

          className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-semibold"

          >

            Get Started

          </Link>

        </div>



      </nav>









      {/* Hero Section */}


      <section className="max-w-7xl mx-auto px-8 pt-20 grid md:grid-cols-2 gap-12 items-center">



        <div>



          <div className="inline-block bg-purple-500/20 px-5 py-2 rounded-full text-purple-300">

            ✨ AI Powered Etsy SEO Assistant

          </div>





          <h1 className="text-6xl font-bold mt-8 leading-tight">


            Create Etsy Listings


            <br />


            That Get Found


            <br />


            <span className="text-purple-500">

              & Sell Faster

            </span>


          </h1>






          <p className="text-gray-300 text-xl mt-6 leading-8">


            Generate SEO optimized Etsy titles, tags and descriptions with AI.
            Save hours of research and create better listings in seconds.


          </p>







          <div className="flex gap-4 mt-10">


            <Link

            href="/generator"

            className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-xl font-bold"

            >

              Start Creating Free

            </Link>




            <a

            href="#demo"

            className="border border-white/20 px-8 py-4 rounded-xl"

            >

              See Demo

            </a>



          </div>



        </div>









        {/* Demo Card */}


        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">


          <p className="text-gray-400">
            Product
          </p>



          <h3 className="text-2xl font-bold mt-3">

            Crochet Christmas Ornament

          </h3>






          <div className="mt-8 bg-black/30 rounded-xl p-5">


            <p className="text-purple-400 font-bold">

              AI Generated Title

            </p>


            <p className="mt-3">

              Handmade Crochet Christmas Ornament Holiday Gift Decoration

            </p>


          </div>







          <div className="mt-5 bg-black/30 rounded-xl p-5">


            <p className="text-purple-400 font-bold">

              SEO Tags

            </p>


            <div className="flex flex-wrap gap-2 mt-3">


              <span className="bg-purple-500/20 px-3 py-1 rounded-full text-sm">

                crochet gift

              </span>


              <span className="bg-purple-500/20 px-3 py-1 rounded-full text-sm">

                christmas decor

              </span>


              <span className="bg-purple-500/20 px-3 py-1 rounded-full text-sm">

                handmade ornament

              </span>


            </div>


          </div>



        </div>



      </section>









      {/* Trust Section - real Etsy facts, not made-up numbers */}


      <section className="max-w-5xl mx-auto mt-32 px-8 grid md:grid-cols-3 gap-8 text-center">



        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">


          <h2 className="text-4xl font-bold text-purple-400">

            13

          </h2>


          <p className="text-gray-400 mt-2">

            Etsy tags generated per listing

          </p>


        </div>





        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">


          <h2 className="text-4xl font-bold text-purple-400">

            140

          </h2>


          <p className="text-gray-400 mt-2">

            Character title limit, handled for you

          </p>


        </div>





        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">


          <h2 className="text-4xl font-bold text-purple-400">

            Seconds

          </h2>


          <p className="text-gray-400 mt-2">

            To go from idea to full listing

          </p>


        </div>



      </section>









      {/* Problem Section */}


      <section className="max-w-6xl mx-auto mt-32 px-8">


        <h2 className="text-4xl font-bold text-center">

          Stop Spending Hours Creating Etsy Listings

        </h2>



        <p className="text-gray-400 text-center mt-4">

          Let AI handle the difficult parts of listing creation.

        </p>





        <div className="grid md:grid-cols-3 gap-8 mt-12">



          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">

            <h3 className="text-xl font-bold">
              Slow Research
            </h3>

            <p className="text-gray-400 mt-3">
              Finding keywords and writing listings manually takes hours.
            </p>

          </div>





          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">

            <h3 className="text-xl font-bold">
              Wrong Keywords
            </h3>

            <p className="text-gray-400 mt-3">
              Poor titles and tags reduce product visibility.
            </p>

          </div>





          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">

            <h3 className="text-xl font-bold">
              Lost Time
            </h3>

            <p className="text-gray-400 mt-3">
              Spend more time creating products instead of writing listings.
            </p>

          </div>



        </div>



      </section>
            {/* Features Section */}


      <section
      id="features"
      className="max-w-6xl mx-auto mt-32 px-8"
      >


        <h2 className="text-4xl font-bold text-center">

          Everything You Need To Create Better Etsy Listings

        </h2>



        <p className="text-gray-400 text-center mt-4">

          Powerful AI features built for Etsy sellers.

        </p>






        <div className="grid md:grid-cols-3 gap-8 mt-12">



          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">

            <h3 className="text-xl font-bold">
              AI SEO Titles
            </h3>

            <p className="text-gray-400 mt-3">
              Generate optimized titles with buyer-focused keywords.
            </p>

          </div>





          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">

            <h3 className="text-xl font-bold">
              Smart Etsy Tags
            </h3>

            <p className="text-gray-400 mt-3">
              Create relevant tags to improve product discovery.
            </p>

          </div>





          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">

            <h3 className="text-xl font-bold">
              AI Descriptions
            </h3>

            <p className="text-gray-400 mt-3">
              Write engaging descriptions that help convert buyers.
            </p>

          </div>





          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">

            <h3 className="text-xl font-bold">
              Save Listings
            </h3>

            <p className="text-gray-400 mt-3">
              Store and manage your generated listings.
            </p>

          </div>





          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">

            <h3 className="text-xl font-bold">
              Fast Generation
            </h3>

            <p className="text-gray-400 mt-3">
              Create complete Etsy listings in seconds.
            </p>

          </div>





          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">

            <h3 className="text-xl font-bold">
              Seller Dashboard
            </h3>

            <p className="text-gray-400 mt-3">
              Manage your AI generated content easily.
            </p>

          </div>



        </div>


      </section>









      {/* How It Works */}


      <section className="max-w-6xl mx-auto mt-32 px-8">


        <h2 className="text-4xl font-bold text-center">

          Create Your Listing In 3 Simple Steps

        </h2>





        <div className="grid md:grid-cols-3 gap-8 mt-12">



          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">


            <div className="text-5xl text-purple-500 font-bold">
              1
            </div>


            <h3 className="text-xl font-bold mt-5">

              Add Product Details

            </h3>


            <p className="text-gray-400 mt-3">

              Enter your product information and style.

            </p>


          </div>







          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">


            <div className="text-5xl text-purple-500 font-bold">
              2
            </div>


            <h3 className="text-xl font-bold mt-5">

              Generate With AI

            </h3>


            <p className="text-gray-400 mt-3">

              AI creates your SEO title, tags and description.

            </p>


          </div>







          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">


            <div className="text-5xl text-purple-500 font-bold">
              3
            </div>


            <h3 className="text-xl font-bold mt-5">

              Publish Faster

            </h3>


            <p className="text-gray-400 mt-3">

              Copy your listing and publish it on Etsy.

            </p>


          </div>



        </div>



      </section>









      {/* Demo Section */}


      <section
      id="demo"
      className="max-w-6xl mx-auto mt-32 px-8"
      >


        <h2 className="text-4xl font-bold text-center">

          See AI Create A Listing

        </h2>





        <div className="mt-12 bg-white/5 border border-white/10 rounded-3xl p-10">


          <p className="text-gray-400">
            Product
          </p>


          <h3 className="text-2xl font-bold mt-3">

            Crochet Christmas Ornament

          </h3>





          <div className="mt-8">


            <p className="text-purple-400 font-bold">

              Generated Title

            </p>


            <p className="mt-3">

              Handmade Crochet Christmas Ornament Holiday Gift Decoration

            </p>


          </div>





          <div className="mt-8">


            <p className="text-purple-400 font-bold">

              Generated Tags

            </p>


            <p className="text-gray-300 mt-3">

              crochet gift, christmas decor, handmade ornament, holiday gift

            </p>


          </div>



        </div>



      </section>









      {/* Comparison Section */}


      <section className="max-w-6xl mx-auto mt-32 px-8">


        <h2 className="text-4xl font-bold text-center">

          Manual Work vs EtsyAI

        </h2>





        <div className="grid md:grid-cols-2 gap-8 mt-12">



          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">


            <h3 className="text-2xl font-bold">

              Without AI

            </h3>



            <ul className="mt-5 space-y-3 text-gray-400">

              <li>
                ❌ Hours of keyword research
              </li>

              <li>
                ❌ Manual title writing
              </li>

              <li>
                ❌ Guessing tags
              </li>

              <li>
                ❌ Repeating the same process
              </li>


            </ul>


          </div>







          <div className="bg-purple-600 rounded-2xl p-8">


            <h3 className="text-2xl font-bold">

              With EtsyAI

            </h3>



            <ul className="mt-5 space-y-3">


              <li>
                ✅ Instant SEO titles
              </li>


              <li>
                ✅ Optimized Etsy tags
              </li>


              <li>
                ✅ Ready descriptions
              </li>


              <li>
                ✅ Saved listings
              </li>


            </ul>


          </div>



        </div>


      </section>
            {/* Pricing CTA */}

      <section id="pricing-summary" className="max-w-5xl mx-auto mt-32 px-8 text-center">

        <h2 className="text-4xl font-bold">
          Start Creating Better Etsy Listings Today
        </h2>

        <p className="text-gray-400 mt-5">
          Free plan includes 5 AI credits, no card required. Upgrade any time for more credits and advanced features.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-8">

          <Link
            href="/generator"
            className="inline-block bg-purple-600 hover:bg-purple-700 px-10 py-4 rounded-xl font-bold"
          >
            Start Free
          </Link>

          <Link
            href="/pricing"
            className="inline-block border border-white/20 px-10 py-4 rounded-xl font-bold"
          >
            See Pricing
          </Link>

        </div>

      </section>





      {/* FAQ */}

      <section
      id="faq"
      className="max-w-4xl mx-auto mt-32 px-8 pb-20"
      >

        <h2 className="text-4xl font-bold text-center">
          Frequently Asked Questions
        </h2>


        <div className="mt-10 space-y-6">


          <div className="bg-white/5 p-6 rounded-xl">

            <h3 className="font-bold">
              What is EtsyAI?
            </h3>

            <p className="text-gray-400 mt-3">
              EtsyAI helps sellers create optimized Etsy titles, tags and descriptions using AI, following Etsy&apos;s own listing rules (140 character titles, 13 tags).
            </p>

          </div>




          <div className="bg-white/5 p-6 rounded-xl">

            <h3 className="font-bold">
              Can beginners use it?
            </h3>

            <p className="text-gray-400 mt-3">
              Yes. Enter a few details about your product and AI writes a ready-to-edit listing for you.
            </p>

          </div>




          <div className="bg-white/5 p-6 rounded-xl">

            <h3 className="font-bold">
              Will this guarantee more sales?
            </h3>

            <p className="text-gray-400 mt-3">
              No tool can promise sales. EtsyAI saves you research time and helps you write clearer, keyword-focused listings — results still depend on your product, photos, pricing and shop.
            </p>

          </div>




          <div className="bg-white/5 p-6 rounded-xl">

            <h3 className="font-bold">
              Is EtsyAI connected to Etsy?
            </h3>

            <p className="text-gray-400 mt-3">
              No. EtsyAI is an independent tool and is not affiliated with Etsy, Inc. You copy your generated listing and publish it on Etsy yourself.
            </p>

          </div>


        </div>


      </section>






      {/* Footer */}

      <footer className="border-t border-white/10 py-8 px-8 text-center text-gray-400">

        <p>
          EtsyAI © 2026
          <br />
          Built for Etsy sellers
        </p>

        <p className="mt-3 text-sm text-gray-500">
          EtsyAI is an independent tool and is not affiliated with, endorsed by, or sponsored by Etsy, Inc.
        </p>

      </footer>


    </main>

  );

}
