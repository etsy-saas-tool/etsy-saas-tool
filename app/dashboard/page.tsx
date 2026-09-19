"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

import {
  Search,
  BarChart3,
  Tags,
  TrendingUp
} from "lucide-react";



export default function Dashboard(){



const [loading,setLoading] = useState(true);


const [email,setEmail] = useState("");

const [credits,setCredits] = useState(0);

const [plan,setPlan] = useState("Free");



const [keywords,setKeywords] = useState<any[]>([]);

const [listings,setListings] = useState<any[]>([]);



const [avgScore,setAvgScore] = useState(0);

const [totalTags,setTotalTags] = useState(0);

const [totalLongTail,setTotalLongTail] = useState(0);






async function fetchDashboardData(){


try{


setLoading(true);



const {
data:userData,
error:userError

}=await supabase.auth.getUser();




if(userError || !userData.user){


console.log(
"USER ERROR",
userError
);


setLoading(false);

return;

}



const user = userData.user;




setEmail(
user.email || ""
);







// PROFILE

const {
data:profile

}=await supabase

.from("user_profiles")

.select("*")

.eq(
"id",
user.id
)

.single();





setCredits(
profile?.credits ?? 0
);



setPlan(
profile?.plan ?? "Free"
);









// LISTINGS


const {
data:listingsData

}=await supabase

.from("listings")

.select("*")

.eq(
"user_id",
user.id
)

.order(
"created_at",
{
ascending:false
}
);





setListings(
listingsData || []
);









// KEYWORD HISTORY


const {
data:keywordData

}=await supabase

.from("keyword_searches")

.select("*")

.eq(
"user_id",
user.id
)

.order(
"created_at",
{
ascending:false
}
);





setKeywords(
keywordData || []
);






if(keywordData?.length){



const score =

keywordData.reduce(

(sum,item)=>

sum + (item.seo_score || 0),

0

)

/

keywordData.length;



setAvgScore(
Math.round(score)
);





let tags = 0;

let longTail = 0;



keywordData.forEach(
(item)=>{


tags += item.best_tags?.length || 0;


longTail += item.long_tail_keywords?.length || 0;


}

);



setTotalTags(tags);

setTotalLongTail(longTail);



}



}


catch(error){


console.log(
"DASHBOARD ERROR",
error
);


}


finally{


setLoading(false);


}



}







useEffect(()=>{


fetchDashboardData();


},[]);
return (

<main className="
min-h-screen
bg-[#070711]
text-white
">


<Sidebar />

<Navbar />



<div className="
ml-64
pt-24
p-8
">







<div className="
flex
justify-between
items-center
mb-10
">



<div>


<p className="
text-purple-400
text-sm
mb-2
">

AI SEO Dashboard

</p>


<h1 className="
text-4xl
font-bold
">

Welcome back 👋

</h1>


<p className="
text-gray-400
mt-3
">

Track your Etsy keyword research and listing growth.

</p>


<p className="
text-gray-500
text-sm
mt-2
">

{email}

</p>


</div>





<Link

href="/generator"

className="
bg-purple-600
hover:bg-purple-700
px-7
py-4
rounded-xl
font-bold
"

>

+ Create Listing

</Link>



</div>









{/* ANALYTICS CARDS */}



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


<div className="
flex
justify-between
">


<p className="
text-gray-400
">

Keyword Searches

</p>


<Search className="text-purple-400"/>


</div>



<h2 className="
text-5xl
font-bold
mt-5
">

{keywords.length}

</h2>


<p className="
text-gray-500
text-sm
mt-3
">

Total analyzed keywords

</p>


</div>








<div className="
bg-[#151522]
border
border-white/10
rounded-3xl
p-7
">


<div className="
flex
justify-between
">


<p className="
text-gray-400
">

Average SEO Score

</p>


<BarChart3 className="text-purple-400"/>


</div>



<h2 className="
text-5xl
font-bold
text-purple-400
mt-5
">

{avgScore}

</h2>


<p className="
text-gray-500
text-sm
mt-3
">

Keyword quality

</p>


</div>








<div className="
bg-[#151522]
border
border-white/10
rounded-3xl
p-7
">


<div className="
flex
justify-between
">


<p className="
text-gray-400
">

Generated Tags

</p>


<Tags className="text-purple-400"/>


</div>



<h2 className="
text-5xl
font-bold
mt-5
">

{totalTags}

</h2>


<p className="
text-gray-500
text-sm
mt-3
">

SEO tags created

</p>


</div>








<div className="
bg-[#151522]
border
border-white/10
rounded-3xl
p-7
">


<div className="
flex
justify-between
">


<p className="
text-gray-400
">

Long Tail Keywords

</p>


<TrendingUp className="text-purple-400"/>


</div>



<h2 className="
text-5xl
font-bold
mt-5
">

{totalLongTail}

</h2>


<p className="
text-gray-500
text-sm
mt-3
">

Buyer intent keywords

</p>


</div>






</div>









{/* RECENT KEYWORD RESEARCH */}



<div className="
mt-14
">



<div className="
flex
justify-between
items-center
mb-6
">


<h2 className="
text-3xl
font-bold
">

Recent Keyword Research

</h2>



<Link

href="/keyword-history"

className="
text-purple-400
hover:text-purple-300
"

>

View All →

</Link>



</div>








{

keywords.length === 0 ? (



<div className="
bg-[#151522]
border
border-white/10
rounded-3xl
p-8
">

No keyword research yet.

</div>



)



:

(



<div className="
grid
md:grid-cols-2
gap-6
">





{

keywords.slice(0,4).map((item)=>(


<div

key={item.id}

className="
bg-[#151522]
border
border-white/10
rounded-3xl
p-6
"

>



<div className="
flex
justify-between
items-start
">


<div>


<h3 className="
text-xl
font-bold
text-purple-400
">

{item.keyword}

</h3>


<p className="
text-gray-400
mt-3
">

SEO Score: {item.seo_score}

</p>


</div>





<span className="
bg-purple-600/20
px-3
py-2
rounded-full
text-sm
">

{item.search_intent}

</span>



</div>







<div className="
flex
justify-between
items-center
mt-6
">



<p className="
text-gray-500
text-sm
">

Difficulty {item.difficulty}/100

</p>




<Link

href={`/keyword-history/${item.id}`}

className="
bg-purple-600
hover:bg-purple-700
px-4
py-2
rounded-xl
text-sm
"

>

View Analysis →

</Link>



</div>




</div>



))


}





</div>


)

}



</div>
{/* ACCOUNT STATS */}


<div className="
grid
md:grid-cols-3
gap-6
mt-10
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

AI Credits

</p>


<h2 className="
text-5xl
font-bold
mt-4
">

{credits}

</h2>


<p className="
text-gray-500
text-sm
mt-3
">

Credits remaining

</p>


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

Current Plan

</p>


<h2 className="
text-4xl
font-bold
mt-4
capitalize
">

{plan}

</h2>


<p className="
text-gray-500
text-sm
mt-3
">

Subscription status

</p>


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

Saved Listings

</p>


<h2 className="
text-5xl
font-bold
mt-4
">

{listings.length}

</h2>


<p className="
text-gray-500
text-sm
mt-3
">

AI generated listings

</p>


</div>





</div>









{/* SAVED LISTINGS */}



<div className="
mt-14
">


<h2 className="
text-3xl
font-bold
mb-6
">

My Saved Listings

</h2>







{

loading ? (


<p className="
text-gray-400
">

Loading...

</p>


)



:


listings.length === 0 ? (


<div className="
bg-[#151522]
border
border-white/10
rounded-3xl
p-10
">


<h3 className="
text-2xl
font-bold
">

No listings yet

</h3>


<p className="
text-gray-400
mt-3
">

Create your first AI listing.

</p>


</div>


)



:


(


<div className="
grid
md:grid-cols-2
gap-6
">





{

listings.map((item)=>(


<div

key={item.id}

className="
bg-[#151522]
border
border-white/10
rounded-3xl
p-7
"

>



<h3 className="
text-xl
font-bold
">

{item.product_name}

</h3>




<p className="
text-purple-400
mt-3
">

{item.title}

</p>







<div className="
mt-5
">


<p className="
text-gray-400
text-sm
">

Tags

</p>



<p className="
mt-2
">

{item.tags}

</p>


</div>









<p className="
text-gray-300
mt-5
line-clamp-4
">

{item.description}

</p>









<div className="
flex
justify-between
items-center
mt-6
">



<p className="
text-gray-500
text-sm
">

{

new Date(
item.created_at
).toLocaleDateString()

}

</p>






<button

onClick={()=>


navigator.clipboard.writeText(

`${item.title}

${item.tags}

${item.description}`

)

}


className="
bg-purple-600/20
hover:bg-purple-600
px-4
py-2
rounded-xl
text-sm
"

>

Copy Listing

</button>






</div>





</div>



))


}




</div>



)


}




</div>







</div>


</main>


);


}