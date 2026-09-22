"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";
import Link from "next/link";



export default function ListingDetail(){



const params = useParams();

const id = params.id as string;



const [listing,setListing] = useState<any>(null);

const [loading,setLoading] = useState(true);







async function fetchListing(){


try{


setLoading(true);



const {
  data: userData
} = await supabase.auth.getUser();

const user = userData.user;

if(!user){

  setListing(null);

  return;

}



const {

data,

error

}= await supabase


.from("listings")

.select("*")

.eq(
"id",
id
)

.eq(
"user_id",
user.id
)

.single();






if(error){


throw error;


}





setListing(data);





}

catch(error:any){


console.log(
"LISTING DETAIL ERROR:",
error
);



}

finally{


setLoading(false);


}



}







useEffect(()=>{


if(id){

fetchListing();

}


},[id]);









if(loading){


return (

<div className="
min-h-screen
bg-[#070711]
text-white
p-10
">

Loading listing...

</div>

);


}







if(!listing){


return (

<div className="
min-h-screen
bg-[#070711]
text-white
p-10
">


<h1 className="
text-3xl
font-bold
">

Listing Not Found

</h1>


<Link

href="/my-listings"

className="
text-purple-400
mt-5
inline-block
"

>

← Back to Listings

</Link>



</div>

);


}








return (

<main className="
min-h-screen
bg-[#070711]
text-white
p-10
">



<div className="
max-w-5xl
mx-auto
">





<Link

href="/my-listings"

className="
text-purple-400
"

>

← Back to My Listings

</Link>






<div className="
mt-8
bg-[#151522]
border
border-white/10
rounded-3xl
p-8
">





<h1 className="
text-4xl
font-bold
">

{listing.product_name}

</h1>





<p className="
text-gray-400
mt-3
">

Complete AI Etsy Listing Report

</p>





</div>
{/* SEO SCORE */}


<div className="
mt-8
grid
md:grid-cols-3
gap-6
">



<div className="
bg-[#151522]
border
border-white/10
rounded-2xl
p-6
">


<p className="
text-gray-400
">

SEO Score

</p>



<h2 className="
text-5xl
font-bold
text-purple-400
mt-3
">

{listing.score || 0}

</h2>



<p className="
text-gray-500
mt-2
">

Out of 100

</p>



</div>







<div className="
bg-[#151522]
border
border-white/10
rounded-2xl
p-6
">


<p className="
text-gray-400
">

Category

</p>



<h2 className="
text-xl
font-bold
mt-3
">

{listing.category || "N/A"}

</h2>



</div>







<div className="
bg-[#151522]
border
border-white/10
rounded-2xl
p-6
">


<p className="
text-gray-400
">

Style

</p>



<h2 className="
text-xl
font-bold
mt-3
">

{listing.style || "N/A"}

</h2>



</div>



</div>









{/* TITLE */}



<div className="
mt-8
bg-[#151522]
border
border-white/10
rounded-3xl
p-8
">


<h2 className="
text-2xl
font-bold
text-purple-400
">

SEO Title

</h2>



<p className="
mt-5
text-gray-300
leading-8
">

{listing.title}

</p>



</div>









{/* TAGS */}



<div className="
mt-8
bg-[#151522]
border
border-white/10
rounded-3xl
p-8
">


<h2 className="
text-2xl
font-bold
text-purple-400
">

Etsy SEO Tags

</h2>




<div className="
flex
flex-wrap
gap-3
mt-5
">


{

listing.tags?.split(",").map(

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

{tag.trim()}

</span>


)


)


}



</div>


</div>









{/* DESCRIPTION */}



<div className="
mt-8
bg-[#151522]
border
border-white/10
rounded-3xl
p-8
">


<h2 className="
text-2xl
font-bold
text-purple-400
">

Product Description

</h2>




<p className="
mt-5
text-gray-300
leading-8
whitespace-pre-line
">

{listing.description}

</p>



</div>









{/* MATERIALS */}



{

listing.materials && (


<div className="
mt-8
bg-[#151522]
border
border-white/10
rounded-3xl
p-8
">


<h2 className="
text-2xl
font-bold
text-purple-400
">

Materials

</h2>



<p className="
mt-5
text-gray-300
">

{

Array.isArray(listing.materials)

?

listing.materials.join(", ")

:

listing.materials

}

</p>



</div>


)

}









{/* PRICING */}



{

listing.pricing && (


<div className="
mt-8
bg-[#151522]
border
border-white/10
rounded-3xl
p-8
">


<h2 className="
text-2xl
font-bold
text-purple-400
">

Pricing Recommendation

</h2>



<h3 className="
text-3xl
font-bold
text-green-400
mt-5
">

{listing.pricing?.estimated_price}

</h3>



<p className="
text-gray-300
mt-4
leading-7
">

{listing.pricing?.reason}

</p>



</div>


)

}









{/* BUYER PERSONA */}



{

listing.buyer_persona && (


<div className="
mt-8
bg-[#151522]
border
border-white/10
rounded-3xl
p-8
">


<h2 className="
text-2xl
font-bold
text-purple-400
">

Ideal Buyer

</h2>



<p className="
mt-5
text-gray-300
leading-8
">

{listing.buyer_persona}

</p>



</div>


)

}









{/* IMAGE PROMPTS */}



{

listing.image_prompts && (


<div className="
mt-8
bg-[#151522]
border
border-white/10
rounded-3xl
p-8
">


<h2 className="
text-2xl
font-bold
text-purple-400
">

AI Image Prompts

</h2>



<div className="
mt-5
space-y-4
">


{

Array.isArray(listing.image_prompts) &&

listing.image_prompts.map(

(prompt:string,index:number)=>(


<div

key={index}

className="
bg-black/20
rounded-xl
p-4
text-gray-300
"

>

{index+1}. {prompt}

</div>


)


)


}



</div>



</div>


)

}









</div>

</main>

);

}