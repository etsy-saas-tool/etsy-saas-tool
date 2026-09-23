"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/Toaster";


export default function Generator(){


const [loading,setLoading] = useState(false);

const [saving,setSaving] = useState(false);


const [product,setProduct] = useState("");

const [category,setCategory] = useState("");

const [style,setStyle] = useState("");

const [audience,setAudience] = useState("");

const [result,setResult] = useState<any>(null);

const [credits,setCredits] = useState(0);

const [cooldown,setCooldown] = useState(0);





async function getCredits(){


const {data:userData}=await supabase.auth.getUser();


const user=userData.user;


if(!user) return;



const {data,error}=await supabase

.from("user_profiles")

.select("credits")

.eq("id",user.id)

.single();



if(error){

console.log("GET CREDITS ERROR:", error);

// Profile row missing for this account (e.g. the signup/login
// self-heal never ran yet) - create it now with the free plan's
// default credits instead of silently showing 0 forever.
if(error.code === "PGRST116"){

const {error:createError} = await supabase
.from("user_profiles")
.insert({
id: user.id,
email: user.email,
plan: "free",
credits: 5
});

if(!createError){
setCredits(5);
}else{
console.log("GET CREDITS SELF-HEAL ERROR:", createError);
}

}

return;

}


setCredits(data?.credits ?? 0);


}







useEffect(()=>{

getCredits();

},[]);




// Counts a short cooldown back down to 0 once it's set (see generate()).
// While it's above 0, both generate buttons stay disabled - this stops
// a quick burst of clicks from eating through the AI provider's
// short-term free-plan request limit, which is shared across every
// user of the site, not just this one.
useEffect(()=>{

if(cooldown<=0) return;

const timer = setInterval(()=>{

setCooldown(prev => prev>0 ? prev-1 : 0);

},1000);

return ()=>clearInterval(timer);

},[cooldown]);









async function generate(){


if(!product){

toast("Please enter product name", "error");

return;

}



if(credits <= 0){

toast("No AI credits remaining", "error");

return;

}



try{


setLoading(true);

setResult(null);



const response = await fetch("/api/generate",{


method:"POST",

headers:{

"Content-Type":"application/json"

},


body:JSON.stringify({

product,

category,

style,

audience

})


});




const data = await response.json();



if(!response.ok){

throw new Error(
data.error || "Generation failed"
);

}



setResult(data);


setCredits(prev=>Math.max(prev-1,0));



}

catch(error:any){

toast(error.message, "error");

}

finally{

setLoading(false);

setCooldown(8);

}



}









async function saveListing(){


if(!result) return;


try{


setSaving(true);



const {data:userData}=await supabase.auth.getUser();


const user=userData.user;



if(!user){

toast("Please login first", "error");

return;

}




const {error}=await supabase

.from("listings")

.insert({

user_id:user.id,

product_name:product,

category,

style,

audience,

title:result.title,

tags:result.tags?.join(", "),

description:result.description,

materials:result.materials,

pricing:result.pricing,

buyer_persona:result.buyer_persona,

image_prompts:result.image_prompts,

score:result.score || 75,

analysis:result.analysis || {}

});




if(error){

throw error;

}



toast("Listing Saved Successfully ✅", "success");



setResult(null);

setProduct("");

setCategory("");

setStyle("");

setAudience("");



}

catch(error:any){

toast(error.message, "error");

}

finally{

setSaving(false);

}



}







function copyText(text:string){


navigator.clipboard.writeText(text);

toast("Copied ✅", "success");


}







return (

<main className="
min-h-screen
bg-[#050510]
text-white
p-8
">


<div className="
max-w-6xl
mx-auto
">

{/* HEADER */}


<div className="
flex
justify-between
items-start
">


<div>


<div className="
inline-flex
bg-purple-500/20
text-purple-300
px-4
py-2
rounded-full
">

✨ AI Listing Studio

</div>



<h1 className="
text-5xl
font-bold
mt-6
">

Create Etsy Listings That Sell 🚀

</h1>



<p className="
text-gray-400
text-lg
mt-3
">

Generate SEO titles, tags and descriptions with AI.

</p>


</div>





<div className="
bg-[#151522]
border
border-white/10
rounded-2xl
px-6
py-5
">


<p className="
text-gray-400
text-sm
">

AI Credits

</p>



<h2 className="
text-3xl
font-bold
text-purple-400
">

{credits}

</h2>



<p className="
text-xs
text-gray-500
">

Remaining

</p>


</div>


</div>









{/* PRODUCT FORM */}


<div className="
mt-12
bg-[#151522]
border
border-white/10
rounded-3xl
p-8
">


<h2 className="
text-2xl
font-bold
">

Product Details

</h2>



<p className="
text-gray-400
mt-2
">

Tell AI about your Etsy product.

</p>




<div className="
grid
md:grid-cols-2
gap-5
mt-8
">



<input

placeholder="Product Name"

value={product}

onChange={(e)=>setProduct(e.target.value)}

onKeyDown={(e)=>{ if(e.key==="Enter") generate(); }}

className="
bg-black/30
border
border-white/10
rounded-xl
p-4
"

/>





<input

placeholder="Category"

value={category}

onChange={(e)=>setCategory(e.target.value)}

onKeyDown={(e)=>{ if(e.key==="Enter") generate(); }}

className="
bg-black/30
border
border-white/10
rounded-xl
p-4
"

/>





<input

placeholder="Style"

value={style}

onChange={(e)=>setStyle(e.target.value)}

onKeyDown={(e)=>{ if(e.key==="Enter") generate(); }}

className="
bg-black/30
border
border-white/10
rounded-xl
p-4
"

/>





<input

placeholder="Target Audience"

value={audience}

onChange={(e)=>setAudience(e.target.value)}

onKeyDown={(e)=>{ if(e.key==="Enter") generate(); }}

className="
bg-black/30
border
border-white/10
rounded-xl
p-4
"

/>



</div>






<button

onClick={generate}

disabled={loading || cooldown>0}

className="
mt-8
bg-purple-600
hover:bg-purple-700
disabled:opacity-50
px-10
py-4
rounded-xl
font-bold
"

>


{

loading

?

"✨ Creating Listing..."

:

cooldown>0

?

`Please wait ${cooldown}s`

:

"✨ Generate My Etsy Listing"

}


</button>



</div>









{result && (


<div className="
mt-12
space-y-6
">







{/* SEO SCORE */}


<div className="
bg-[#151522]
border
border-purple-500/30
rounded-3xl
p-8
">


<h2 className="
text-2xl
font-bold
text-purple-400
">

AI SEO Score

</h2>





<div className="
flex
items-center
gap-8
mt-6
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
">


<span className="
text-4xl
font-bold
">

{result.score || 0}

</span>


</div>





<div>


<h3 className="
text-xl
font-bold
">

Listing Optimization

</h3>



<p className="
text-gray-400
mt-2
">

AI analyzed your title, keywords and description quality.

</p>



</div>



</div>



</div>









{/* AI ANALYSIS */}



<div className="
bg-[#151522]
border
border-white/10
rounded-3xl
p-8
">


<h2 className="
text-xl
font-bold
text-purple-400
">

AI SEO Analysis

</h2>




<div className="
mt-6
space-y-4
text-gray-300
">


<p>

<b className="text-white">
Title:
</b>

{" "}

{result.analysis?.title_score}

</p>




<p>

<b className="text-white">
Keywords:
</b>

{" "}

{result.analysis?.keyword_score}

</p>




<p>

<b className="text-white">
Description:
</b>

{" "}

{result.analysis?.description_score}

</p>


</div>






<h3 className="
mt-8
font-bold
">

Recommendations

</h3>





<ul className="
mt-3
list-disc
ml-5
text-gray-300
">


{

result.analysis?.recommendations?.map(

(item:string,index:number)=>(


<li key={index}>

{item}

</li>


)

)


}


</ul>



</div>
{/* MATERIALS */}


<div className="
bg-[#151522]
border
border-white/10
rounded-3xl
p-8
">


<h2 className="
text-xl
font-bold
text-purple-400
">

🧵 Materials Used

</h2>




<div className="
mt-5
space-y-3
text-gray-300
">


{

result.materials?.map(

(item:string,index:number)=>(


<p key={index}>

✓ {item}

</p>


)

)

}


</div>



</div>









{/* PRICING */}



<div className="
bg-[#151522]
border
border-white/10
rounded-3xl
p-8
">


<h2 className="
text-xl
font-bold
text-purple-400
">

💰 Pricing Recommendation

</h2>




<h3 className="
text-3xl
font-bold
mt-5
">

{result.pricing?.estimated_price}

</h3>




<p className="
text-gray-300
mt-4
leading-7
">

{result.pricing?.reason}

</p>



</div>









{/* BUYER PERSONA */}



<div className="
bg-[#151522]
border
border-white/10
rounded-3xl
p-8
">


<h2 className="
text-xl
font-bold
text-purple-400
">

👤 Ideal Buyer Persona

</h2>




<p className="
mt-5
text-gray-300
leading-8
">

{result.buyer_persona}

</p>


</div>









{/* IMAGE PROMPTS */}



<div className="
bg-[#151522]
border
border-white/10
rounded-3xl
p-8
">


<h2 className="
text-xl
font-bold
text-purple-400
">

📸 Etsy Photo Prompts

</h2>





<div className="
mt-5
space-y-5
">



{

result.image_prompts?.map(

(prompt:string,index:number)=>(


<div

key={index}

className="
bg-black/20
border
border-white/10
rounded-xl
p-5
"

>


<p className="
text-gray-300
leading-7
">

{index+1}. {prompt}

</p>




<button

onClick={()=>copyText(prompt)}

className="
mt-3
text-purple-400
text-sm
"

>

Copy Prompt

</button>



</div>


)

)


}



</div>



</div>









{/* ACTION BUTTONS */}



<div className="
flex
gap-4
">


<button

onClick={saveListing}

disabled={saving}

className="
bg-green-600
hover:bg-green-700
px-8
py-4
rounded-xl
font-bold
"

>


{

saving

?

"Saving..."

:

"💾 Save Listing"

}


</button>







<button

onClick={generate}

disabled={loading || cooldown>0}

className="
bg-white/10
border
border-white/10
disabled:opacity-50
px-8
py-4
rounded-xl
font-bold
"

>

{

loading

?

"✨ Creating Listing..."

:

cooldown>0

?

`Please wait ${cooldown}s`

:

"🔄 Generate Again"

}

</button>



</div>









{/* SEO TITLE */}



<div className="
bg-[#151522]
border
border-white/10
rounded-3xl
p-8
">


<div className="
flex
justify-between
items-center
">


<h2 className="
text-xl
font-bold
text-purple-400
">

SEO Title

</h2>



<button

onClick={()=>copyText(result.title)}

className="
text-gray-400
"

>

Copy

</button>


</div>





<p className="
mt-5
text-lg
leading-8
">

{result.title}

</p>



</div>









{/* TAGS */}



<div className="
bg-[#151522]
border
border-white/10
rounded-3xl
p-8
">


<div className="
flex
justify-between
items-center
">


<h2 className="
text-xl
font-bold
text-purple-400
">

Etsy SEO Tags

</h2>




<button

onClick={()=>copyText(result.tags.join(", "))}

className="
text-gray-400
"

>

Copy All

</button>


</div>






<div className="
flex
flex-wrap
gap-3
mt-6
">


{

result.tags?.map(

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
text-sm
"

>

{tag}

</span>


)

)


}


</div>



</div>









{/* DESCRIPTION */}



<div className="
bg-[#151522]
border
border-white/10
rounded-3xl
p-8
">


<div className="
flex
justify-between
items-center
">


<h2 className="
text-xl
font-bold
text-purple-400
">

Sales Description

</h2>



<button

onClick={()=>copyText(result.description)}

className="
text-gray-400
"

>

Copy

</button>


</div>





<p className="
mt-6
text-gray-200
leading-8
whitespace-pre-line
">

{result.description}

</p>



</div>









{/* FINAL MESSAGE */}



<div className="
bg-purple-600/10
border
border-purple-500/30
rounded-2xl
p-6
">


<h3 className="
font-bold
text-purple-300
">

🎉 Your Etsy Listing Is Ready

</h3>




<p className="
text-gray-400
mt-2
">

Your AI optimized listing is ready to publish on Etsy.

</p>


</div>





</div>


)


}



</div>


</main>


);


}