'use client';

import { useState } from 'react';

interface OutputData {
  title: string;
  tags: string[];
  description: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  buyerIntent: string;
  seoScore: number;
  improvementSuggestions: string[];
}

export default function Home() {

  const [title, setTitle] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('Friendly and Engaging');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [output, setOutput] = useState<OutputData | null>(null);

  const [copiedField, setCopiedField] = useState('');



  const handleGenerate = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!title.trim()) {
      setError('Please enter product name.');
      return;
    }

    setLoading(true);
    setError('');
    setOutput(null);


    try {

      const res = await fetch('/api/generate', {

        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({

          productTitle: title,
          keywords,
          tone,

        }),

      });


      const data = await res.json();


      if (!res.ok) {

        throw new Error(data.error || 'Generation failed');

      }


      setOutput(data);


    } catch (err:any) {

      setError(err.message);

    } finally {

      setLoading(false);

    }

  };



  const copyText = (text:string, field:string)=>{

    navigator.clipboard.writeText(text);

    setCopiedField(field);


    setTimeout(()=>{

      setCopiedField('');

    },2000);

  };



  const generateAnother = () => {

    setOutput(null);
    setTitle('');
    setKeywords('');
    setError('');

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  };



  const copyCompleteListing = () => {

    if (!output) return;


    const completeText = `

TITLE:
${output.title}


TAGS:
${output.tags.join(', ')}


DESCRIPTION:
${output.description}


PRIMARY KEYWORD:
${output.primaryKeyword}


SECONDARY KEYWORDS:
${output.secondaryKeywords.join(', ')}


BUYER INTENT:
${output.buyerIntent}


SEO SCORE:
${output.seoScore}/100

`;


    navigator.clipboard.writeText(completeText);

    setCopiedField('complete');


    setTimeout(()=>{

      setCopiedField('');

    },2000);


  };



  return (

    <main className="min-h-screen bg-[#050816] text-white px-4 py-12 relative overflow-hidden">


      <div className="absolute inset-0 pointer-events-none overflow-hidden">


        <div className="absolute top-10 left-10 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]"></div>


        <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-[120px]"></div>


        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
            "radial-gradient(white 1px, transparent 1px)",
            backgroundSize:"45px 45px"
          }}
        ></div>


      </div>



      <div className="max-w-5xl mx-auto space-y-10 relative z-10">


        <div className="text-center space-y-4">


          <div className="inline-flex px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm text-pink-300">

            ✨ AI POWERED ETSY SEO ASSISTANT

          </div>



          <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">

            Create Etsy Listings That Rank & Convert

          </h1>



          <p className="text-slate-300 text-lg max-w-3xl mx-auto">

            AI-powered SEO titles, buyer-focused tags, and conversion descriptions built for Etsy sellers.

          </p>


        </div>
                {/* Feature Cards */}


<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">


  <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:bg-white/20 transition">

    <div className="text-3xl mb-3">
      🚀
    </div>

    <h3 className="font-bold text-lg text-white">
      SEO Titles
    </h3>

    <p className="text-sm text-slate-300 mt-2">
      Create Etsy optimized titles that improve search visibility.
    </p>

  </div>




  <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:bg-white/20 transition">

    <div className="text-3xl mb-3">
      🔍
    </div>

    <h3 className="font-bold text-lg text-white">
      Keyword Intelligence
    </h3>

    <p className="text-sm text-slate-300 mt-2">
      Discover buyer-focused keywords for your products.
    </p>

  </div>




  <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:bg-white/20 transition">

    <div className="text-3xl mb-3">
      ✍️
    </div>

    <h3 className="font-bold text-lg text-white">
      Conversion Copy
    </h3>

    <p className="text-sm text-slate-300 mt-2">
      Generate descriptions designed to increase sales.
    </p>

  </div>




  <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:-translate-y-2 hover:border-purple-400/50 hover:shadow-[0_20px_40px_rgba(168,85,247,0.25)] transition-all duration-300">

    <div className="text-3xl mb-3">
      📈
    </div>

    <h3 className="font-bold text-lg text-white">
      Listing Insights
    </h3>

    <p className="text-sm text-slate-300 mt-2">
      Get AI recommendations to improve your Etsy listings.
    </p>

  </div>


</div>





{/* Generator Form */}


<div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">


<div className="mb-8">

<h2 className="text-3xl font-bold text-white">
✨ Generate Your Etsy Listing
</h2>


<p className="text-slate-300 mt-2">
Turn your product idea into an SEO optimized Etsy listing in seconds.
</p>


</div>



<form onSubmit={handleGenerate} className="space-y-6">



<div>

<label className="block mb-2 text-slate-200 font-medium">

🧶 Product Name / Topic

</label>


<input

value={title}

onChange={(e)=>setTitle(e.target.value)}

placeholder="Example: Crochet Bunny Pattern PDF"

className="w-full p-4 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 outline-none transition-all duration-300"

/>

</div>




<div>

<label className="block mb-2 text-slate-200 font-medium">

🔍 Target Keywords

</label>


<input

value={keywords}

onChange={(e)=>setKeywords(e.target.value)}

placeholder="crochet bunny, amigurumi rabbit, Easter pattern"

className="w-full p-4 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 outline-none transition-all duration-300"

/>

</div>




<div>

<label className="block mb-2 text-slate-200 font-medium">

✨ Tone / Style

</label>


<select

value={tone}

onChange={(e)=>setTone(e.target.value)}

className="w-full p-4 rounded-xl bg-white/5 border border-white/20 text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 outline-none transition-all duration-300"

>


<option className="text-black">
Friendly and Engaging
</option>


<option className="text-black">
Professional & Clear
</option>


<option className="text-black">
Aesthetic & Minimalist
</option>


<option className="text-black">
Persuasive & Sales-Oriented
</option>


</select>

</div>




<button

disabled={loading}

className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] active:scale-95 transition-all duration-300 font-bold text-lg text-white"

>


{loading ? '✨ AI is analyzing your Etsy listing...' : 'Generate Etsy Listing ✨'}


</button>


</form>


</div>





{error && (

<div className="bg-red-500/20 border border-red-500/30 p-4 rounded-xl">

{error}

</div>

)}
{output && (

<div className="space-y-8">


{/* GENERATE ANOTHER LISTING BUTTON */}

<div className="flex justify-end">

<button

onClick={generateAnother}

className="px-5 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold hover:scale-105 transition-all"

>

✨ Generate Another Listing

</button>

</div>



{/* COPY COMPLETE BUTTON */}

<div className="flex justify-end">

<button

onClick={copyCompleteListing}

className="px-5 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold hover:scale-105 transition-all"

>

{copiedField === 'complete'
? 'Copied ✓'
: '📋 Copy Complete Listing'}

</button>

</div>





{/* SEO ANALYSIS */}


<div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">


<h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">

Etsy SEO Analysis

</h2>



<div className="space-y-5">


<div className="bg-black/30 rounded-2xl p-6 border border-white/10">


<p className="text-slate-400 mb-2">
SEO Score
</p>


<div className="flex items-center gap-4">


<p className="text-5xl font-extrabold bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">

{output.seoScore}/100

</p>


<span className="px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-sm font-semibold shadow-lg">

Excellent

</span>


</div>


</div>





<div className="bg-black/30 rounded-2xl p-6 border border-white/10">


<h3 className="text-pink-300 font-bold text-lg">

Primary Keyword

</h3>


<div className="mt-3 inline-flex items-center px-4 py-2 rounded-xl bg-purple-500/20 border border-purple-400/30 text-purple-200 font-medium">

🔍 {output.primaryKeyword}

</div>


</div>





<div className="bg-black/30 rounded-2xl p-6 border border-white/10">


<h3 className="text-pink-300 font-bold text-lg mb-3">

Secondary Keywords

</h3>


<div className="flex flex-wrap gap-2">


{output.secondaryKeywords?.map((item,index)=>(

<span

key={index}

className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-400/20 text-purple-200 text-sm font-medium hover:bg-purple-500/20 transition-all duration-300"

>

{item}

</span>


))}


</div>


</div>





<div className="bg-black/30 rounded-2xl p-6 border border-white/10">


<h3 className="text-pink-300 font-bold text-lg">

Buyer Intent

</h3>


<div className="mt-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-400/20 text-emerald-100 leading-relaxed">

💰 {output.buyerIntent}

</div>


</div>





<div className="bg-black/30 rounded-2xl p-6 border border-white/10">


<h3 className="text-pink-300 font-bold text-lg">

Improvement Suggestions

</h3>


<div className="mt-4 space-y-3">


{output.improvementSuggestions?.map((item,index)=>(


<div

key={index}

className="p-4 rounded-xl bg-purple-500/10 border border-purple-400/20 text-slate-200 hover:bg-purple-500/20 transition-all duration-300"

>


<div className="flex gap-3 items-start">


<span className="text-xl">
💡
</span>


<p className="leading-relaxed">

{item}

</p>


</div>


</div>


))}


</div>


</div>


</div>


</div>





{/* TITLE */}


<div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">


<div className="flex justify-between items-center mb-5">


<h2 className="text-2xl font-bold text-pink-300">

Optimized Etsy Title

</h2>


<button

onClick={()=>copyText(output.title,'title')}

className="px-4 py-2 rounded-xl bg-purple-500/20 border border-purple-400/30 text-purple-200 hover:bg-purple-500/30 transition-all"

>

{copiedField === 'title' ? 'Copied ✓' : 'Copy'}

</button>


</div>


<div className="mt-3 p-5 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/20 text-slate-100 leading-relaxed text-lg">

✨ {output.title}

</div>


</div>





{/* TAGS */}


<div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">


<div className="flex justify-between items-center mb-5">


<h2 className="text-2xl font-bold text-pink-300">

13 Etsy SEO Tags

</h2>


<button

onClick={()=>copyText(output.tags.join(', '),'tags')}

className="px-4 py-2 rounded-xl bg-purple-500/20 border border-purple-400/30 text-purple-200 hover:bg-purple-500/30 transition-all"

>

{copiedField === 'tags' ? 'Copied ✓' : 'Copy'}

</button>


</div>


<div className="flex flex-wrap gap-3">


{output.tags.map((tag,index)=>(


<span

key={index}

className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-400/20 text-purple-200 text-sm font-medium hover:bg-purple-500/20 transition-all duration-300"

>

{tag}

</span>


))}


</div>


</div>
{/* DESCRIPTION */}


<div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">


<div className="flex justify-between items-center mb-5">


<h2 className="text-2xl font-bold text-pink-300">

Product Description

</h2>



<button

onClick={()=>copyText(output.description,'description')}

className="px-4 py-2 rounded-xl bg-purple-500/20 border border-purple-400/30 text-purple-200 hover:bg-purple-500/30 transition-all"

>


{copiedField === 'description'
? 'Copied ✓'
: 'Copy'}


</button>


</div>





<div className="mt-3 p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-indigo-500/10 border border-purple-400/20 text-slate-100 leading-relaxed whitespace-pre-wrap">


✨ {output.description}


</div>


</div>





</div>

)}





</div>


</main>


);

}