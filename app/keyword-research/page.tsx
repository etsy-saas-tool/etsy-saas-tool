"use client";

import { useState, useEffect } from "react";
import { toast } from "@/components/Toaster";


export default function KeywordResearch(){


const [keyword,setKeyword] = useState("");

const [loading,setLoading] = useState(false);

const [result,setResult] = useState<any>(null);

const [cooldown,setCooldown] = useState(0);




// Counts a short cooldown back down to 0 once it's set (see
// analyzeKeyword()). While it's above 0, the button stays disabled -
// this stops a quick burst of clicks from eating through the AI
// provider's short-term free-plan request limit, which is shared
// across every user of the site, not just this one.
useEffect(()=>{

if(cooldown<=0) return;

const timer = setInterval(()=>{

setCooldown(prev => prev>0 ? prev-1 : 0);

},1000);

return ()=>clearInterval(timer);

},[cooldown]);





async function analyzeKeyword(){


if(!keyword){

toast("Enter keyword", "error");

return;

}



try{


setLoading(true);

setResult(null);



const response = await fetch(

"/api/keyword-research",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

keyword

})

}

);





const data = await response.json();




if(!response.ok){

throw new Error(
data.error || "Failed"
);

}




setResult(data);



}catch(error:any){


toast(error.message, "error");



}finally{


setLoading(false);

setCooldown(8);


}


}





return (

<main className="min-h-screen bg-[#050510] text-white p-8">


<div className="max-w-6xl mx-auto">



<div className="mb-10">


<div className="inline-flex bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full">

🔍 Etsy Keyword Research

</div>



<h1 className="text-5xl font-bold mt-6">

Find Keywords That Can Sell 🚀

</h1>


<p className="text-gray-400 mt-3 text-lg">

Analyze Etsy keywords with AI SEO intelligence.

</p>



</div>






<div className="bg-[#151522] border border-white/10 rounded-3xl p-8">



<h2 className="text-2xl font-bold">

Enter Etsy Keyword

</h2>



<div className="flex gap-4 mt-6">


<input

value={keyword}

onChange={(e)=>setKeyword(e.target.value)}

onKeyDown={(e)=>{ if(e.key==="Enter") analyzeKeyword(); }}

placeholder="Example: crochet christmas ornament"

className="
flex-1
bg-black/30
border
border-white/10
rounded-xl
p-4
"

/>



<button

onClick={analyzeKeyword}

disabled={loading || cooldown>0}

className="
bg-purple-600
hover:bg-purple-700
disabled:opacity-50
px-8
rounded-xl
font-bold
"

>

{

loading

?

"Analyzing..."

:

cooldown>0

?

`Please wait ${cooldown}s`

:

"Analyze Keyword"

}


</button>



</div>



</div>









{
result && (

<div className="mt-10 space-y-6">







<div className="
bg-[#151522]
border
border-purple-500/30
rounded-3xl
p-8
flex
items-center
gap-8
">


<div className="
w-32
h-32
rounded-full
border-8
border-purple-500
flex
items-center
justify-center
text-4xl
font-bold
">


{result.seo_score}


</div>



<div>


<h2 className="text-3xl font-bold">

AI SEO Score

</h2>


<p className="text-gray-400 mt-2">

Keyword optimization score

</p>


</div>


</div>










<div className="grid md:grid-cols-3 gap-6">



<div className="
bg-[#151522]
border
border-white/10
rounded-2xl
p-6
">

<p className="text-gray-400">

Search Intent

</p>

<h3 className="text-xl font-bold mt-3">

{result.search_intent}

</h3>


</div>






<div className="
bg-[#151522]
border
border-white/10
rounded-2xl
p-6
">


<p className="text-gray-400">

Competition

</p>


<h3 className="text-xl font-bold mt-3">

{result.competition}

</h3>


</div>







<div className="
bg-[#151522]
border
border-white/10
rounded-2xl
p-6
">


<p className="text-gray-400">

Difficulty

</p>


<h3 className="text-xl font-bold mt-3">

{result.difficulty}/100

</h3>


</div>



</div>









<div className="
bg-[#151522]
border
border-white/10
rounded-3xl
p-8
">


<h2 className="text-2xl font-bold text-purple-400">

Best Etsy Tags

</h2>



<div className="flex flex-wrap gap-3 mt-6">


{

result.best_tags?.map(

(tag:string,index:number)=>(


<span

key={index}

className="
bg-purple-600/20
border
border-purple-500/30
px-4
py-2
rounded-full
"

>

{tag}

</span>


)

)

}



</div>



</div>









<div className="
bg-[#151522]
border
border-white/10
rounded-3xl
p-8
">


<h2 className="text-2xl font-bold text-purple-400">

Long Tail Keywords

</h2>



<ul className="mt-5 space-y-3 text-gray-300">


{

result.long_tail_keywords?.map(

(item:string,index:number)=>(


<li key={index}>

✓ {item}

</li>


)

)

}


</ul>


</div>









<div className="
bg-purple-600/10
border
border-purple-500/30
rounded-3xl
p-8
">


<h2 className="text-2xl font-bold text-purple-300">

Recommendations

</h2>



<ul className="mt-5 space-y-3">


{

result.recommendations?.map(

(item:string,index:number)=>(


<li key={index}>

• {item}

</li>


)

)

}


</ul>


</div>







</div>


)

}




</div>


</main>


);


}