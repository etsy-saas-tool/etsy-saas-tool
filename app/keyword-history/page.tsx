"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";


export default function KeywordHistory(){

const [keywords,setKeywords] = useState<any[]>([]);
const [loading,setLoading] = useState(true);



async function getHistory(){

setLoading(true);


const {
data:userData
}=await supabase.auth.getUser();


const user = userData.user;



if(!user){

console.log("No user logged in");

setLoading(false);
return;

}




const {
data,
error
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





if(error){

console.log(
"History Error:",
error
);


}
else{


setKeywords(
data || []
);


}



setLoading(false);


}





useEffect(()=>{

getHistory();

},[]);







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



<h1 className="
text-4xl
font-bold
">

Keyword Research History 📊

</h1>



<p className="
text-gray-400
mt-3
">

Your previous Etsy keyword analysis

</p>









{
loading ? (


<p className="
mt-10
text-gray-400
">

Loading...

</p>



)

:

keywords.length === 0 ? (



<div className="
mt-10
bg-[#151522]
border
border-white/10
rounded-2xl
p-8
">

No keyword searches found.

</div>



)



:



(


<div className="
mt-10
space-y-5
">








{

keywords.map((item)=>(



<div

key={item.id}

className="
bg-[#151522]
border
border-white/10
rounded-2xl
p-6
"

>





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

{item.keyword}

</h2>



<span className="
bg-purple-600/20
px-4
py-2
rounded-full
">

Score {item.seo_score}

</span>



</div>









<div className="
grid
md:grid-cols-3
gap-5
mt-6
">





<div>

<p className="
text-gray-400
">

Competition

</p>

<p>

{item.competition}

</p>

</div>







<div>

<p className="
text-gray-400
">

Difficulty

</p>

<p>

{item.difficulty}/100

</p>

</div>








<div>

<p className="
text-gray-400
">

Intent

</p>

<p>

{item.search_intent}

</p>

</div>





</div>













<div className="
mt-6
">


<p className="
text-gray-400
mb-2
">

Best Tags

</p>


<div className="
flex
flex-wrap
gap-2
">


{
item.best_tags?.map(
(tag:string,index:number)=>(

<span

key={index}

className="
bg-purple-600/20
px-3
py-1
rounded-full
text-sm
">

{tag}

</span>

)

)

}



</div>


</div>












<div className="
mt-6
">


<p className="
text-gray-400
mb-2
">

Long Tail Keywords

</p>



<div className="
space-y-2
">


{
item.long_tail_keywords?.map(
(keyword:string,index:number)=>(


<p 
key={index}
className="
text-gray-200
">

✓ {keyword}

</p>


)

)

}



</div>



</div>








<p className="
text-sm
text-gray-500
mt-6
">

{
new Date(
item.created_at
).toLocaleDateString()
}

</p>







{/* VIEW ANALYSIS BUTTON */}

<div className="mt-6">


<a

href={`/keyword-history/${item.id}`}

className="
inline-block
bg-purple-600
hover:bg-purple-700
px-6
py-3
rounded-xl
font-semibold
transition
"

>

View Analysis →

</a>


</div>





</div>



))

}




</div>


)


}



</div>


</main>

);


}