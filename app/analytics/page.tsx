"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";


export default function AnalyticsPage() {


const [listings,setListings] = useState<any[]>([]);
const [loading,setLoading] = useState(true);



async function fetchAnalytics(){


try{


setLoading(true);



const {
data:userData
}=await supabase.auth.getUser();



const user = userData.user;



if(!user){

setListings([]);

return;

}



const {
data,
error

}=await supabase

.from("listings")

.select("*")

.eq(
"user_id",
user.id
)

.order(
"score",
{
ascending:false
}
);



if(error){

throw error;

}



setListings(data || []);



}

catch(error:any){

console.log(error);

alert(error.message);


}

finally{

setLoading(false);

}


}





useEffect(()=>{


fetchAnalytics();


},[]);







// SMART ANALYTICS


const totalListings = listings.length;



const averageScore = listings.length

?

Math.round(

listings.reduce(

(sum,item)=>

sum + Number(item.score || 0),

0

)

/ listings.length

)

:

0;






// SCORE CATEGORIES


const winningProducts = listings.filter(

(item)=>

Number(item.score || 0) >= 90

).length;




const strongProducts = listings.filter(

(item)=>

Number(item.score || 0) >= 75 && Number(item.score || 0) < 90

).length;





const improveProducts = listings.filter(

(item)=>

Number(item.score || 0) < 75

).length;







// SORT PRODUCTS


const rankedListings = [...listings].sort(

(a,b)=>

Number(b.score || 0) -

Number(a.score || 0)

);






// REVENUE ESTIMATE


const revenuePotential = listings.reduce(

(total,item)=>{


const score = Number(item.score || 0);


if(score >= 90){

return total + 399;

}


if(score >= 75){

return total + 199;

}


return total + 49;


},

0

);






// MONTHLY GOAL


const growthProgress = Math.min(

Math.round(

(revenuePotential / 5000) * 100

),

100

);






// AI RECOMMENDATIONS


let aiRecommendation = "";


if(winningProducts > 0){


aiRecommendation =
"🔥 Your winning products are ready. Create variations and seasonal versions to increase sales opportunities.";


}

else if(strongProducts > 0){


aiRecommendation =
"⭐ Your listings have good potential. Improve keywords and images to push them into winning range.";


}

else{


aiRecommendation =
"🚀 Create more optimized listings and focus on high buyer intent Etsy keywords.";


}





if(loading){


return(

<div className="
min-h-screen
bg-[#070711]
text-white
flex
items-center
justify-center
text-xl
">

Loading Analytics...

</div>

)

}
return (

<main className="
min-h-screen
bg-[#070711]
text-white
p-10
">


<div className="
max-w-7xl
mx-auto
">



{/* HEADER */}

<div className="
mb-10
">


<h1 className="
text-5xl
font-bold
">

Seller Analytics 🚀

</h1>


<p className="
text-gray-400
mt-3
text-lg
">

AI powered Etsy growth intelligence dashboard

</p>


</div>





{/* MAIN STATS */}


<div className="
grid
md:grid-cols-4
gap-6
">



<div className="
bg-[#151522]
border
border-white/10
rounded-3xl
p-7
">


<p className="
text-gray-400
">

Total Listings

</p>


<h2 className="
text-5xl
font-bold
text-purple-400
mt-4
">

{totalListings}

</h2>


</div>





<div className="
bg-[#151522]
border
border-white/10
rounded-3xl
p-7
">


<p className="
text-gray-400
">

Average SEO Score

</p>


<h2 className="
text-5xl
font-bold
text-green-400
mt-4
">

{averageScore}/100

</h2>


</div>






<div className="
bg-[#151522]
border
border-white/10
rounded-3xl
p-7
">


<p className="
text-gray-400
">

Winning Products

</p>


<h2 className="
text-5xl
font-bold
text-yellow-400
mt-4
">

{winningProducts}

</h2>


</div>







<div className="
bg-[#151522]
border
border-white/10
rounded-3xl
p-7
">


<p className="
text-gray-400
">

Revenue Potential

</p>


<h2 className="
text-5xl
font-bold
text-blue-400
mt-4
">

${revenuePotential}

</h2>


</div>





</div>









{/* PRODUCT PERFORMANCE */}



<div className="
mt-10
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
mb-8
">


<h2 className="
text-3xl
font-bold
">

Product Performance 📈

</h2>


<div className="
text-sm
text-gray-400
">

Top ranking products

</div>


</div>






<div className="
space-y-5
">



{

rankedListings.length === 0 && (


<p className="
text-gray-400
">

No listings available yet.

</p>


)

}






{

rankedListings.slice(0,10).map(

(item,index)=>(


<div

key={item.id || index}

className="
bg-black/20
border
border-white/5
rounded-2xl
p-6
flex
justify-between
items-center
"

>


<div>


<div className="
flex
items-center
gap-3
">


<h3 className="
text-xl
font-bold
">

{item.product_name || "Untitled Product"}

</h3>



{

index < 3 && (


<span className="
text-yellow-400
">

🏆

</span>


)


}


</div>




<p className="
text-gray-400
mt-2
">

SEO Score: {item.score || 0}/100

</p>


</div>







<div>


<span

className={`

px-5
py-2
rounded-full
font-bold

${
Number(item.score || 0)>=90

?

"bg-green-500/20 text-green-400"

:

Number(item.score || 0)>=75

?

"bg-yellow-500/20 text-yellow-400"

:

"bg-red-500/20 text-red-400"

}

`}


>


{

Number(item.score || 0)>=90

?

"🔥 Winner"

:

Number(item.score || 0)>=75

?

"⭐ Strong"

:

"⚠ Improve"

}



</span>



</div>





</div>


)

)



}





</div>





</div>
{/* INSIGHTS SECTION */}



<div className="
mt-10
grid
md:grid-cols-2
gap-6
">





{/* KEYWORD OPPORTUNITIES */}



<div className="
bg-[#151522]
border
border-white/10
rounded-3xl
p-8
">


<h2 className="
text-2xl
font-bold
mb-6
">

Keyword Opportunities 🔍

</h2>




<div className="
space-y-4
">



<div className="
bg-black/20
rounded-xl
p-5
">


<p className="
font-bold
">

Improve Long Tail Keywords

</p>


<p className="
text-gray-400
mt-2
text-sm
">

Add specific buyer keywords to increase Etsy search visibility.

</p>


</div>






<div className="
bg-black/20
rounded-xl
p-5
">


<p className="
font-bold
">

Create Product Variations

</p>


<p className="
text-gray-400
mt-2
text-sm
">

Turn your top scoring products into seasonal and niche variations.

</p>


</div>






<div className="
bg-black/20
rounded-xl
p-5
">


<p className="
font-bold
">

Optimize Weak Listings

</p>


<p className="
text-gray-400
mt-2
text-sm
">

Improve titles, tags and descriptions for lower score products.

</p>


</div>




</div>


</div>









{/* AI RECOMMENDATION */}



<div className="
bg-[#151522]
border
border-white/10
rounded-3xl
p-8
">


<h2 className="
text-2xl
font-bold
mb-6
">

AI Growth Recommendations 🤖

</h2>




<div className="
bg-purple-600/10
border
border-purple-500/20
rounded-xl
p-5
">


<p className="
text-gray-300
leading-7
">

{aiRecommendation}

</p>


</div>




<div className="
mt-5
bg-purple-600/10
border
border-purple-500/20
rounded-xl
p-5
">


<p className="
text-gray-300
leading-7
">

You currently have {strongProducts} strong potential listings and {improveProducts} listings that need optimization.

</p>


</div>



</div>





</div>









{/* MONTHLY GOAL TRACKER */}



<div className="
mt-10
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
mb-5
">


<h2 className="
text-2xl
font-bold
">

Monthly Growth Goal 🚀

</h2>



<span className="
text-purple-400
font-bold
">

$5000/month

</span>



</div>






<div className="
w-full
bg-black/30
rounded-full
h-5
">


<div

className="
bg-purple-600
h-5
rounded-full
"

style={{

width:`${growthProgress}%`

}}

>

</div>


</div>







<div className="
flex
justify-between
mt-4
text-gray-400
">


<span>

Current Potential

</span>


<span>

${revenuePotential}

</span>


</div>





<p className="
text-gray-400
mt-4
">

Progress towards $5000/month goal: {growthProgress}%

</p>



</div>







</div>

</main>


);

}