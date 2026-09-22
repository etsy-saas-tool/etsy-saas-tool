"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";
import jsPDF from "jspdf";


export default function KeywordDetail(){


const params = useParams();

const id = params.id as string;


const [keyword,setKeyword] = useState<any>(null);
const [loading,setLoading] = useState(true);

const [copied,setCopied] = useState("");





async function getKeyword(){


const {
data:userData
}= await supabase.auth.getUser();

const user = userData.user;

if(!user){

setLoading(false);
return;

}



const {
data,
error
}= await supabase

.from("keyword_searches")

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

console.log(
"DETAIL ERROR:",
error
);

}
else{

setKeyword(data);

}



setLoading(false);


}






useEffect(()=>{


if(id){

getKeyword();

}


},[id]);







function copyText(
text:string,
type:string
){


navigator.clipboard.writeText(text);


setCopied(type);


setTimeout(()=>{

setCopied("");

},2000);


}







function downloadPDF(){


const doc = new jsPDF();



doc.setFontSize(20);


doc.text(
"Etsy Keyword Analysis Report",
20,
20
);



doc.setFontSize(14);



doc.text(
`Keyword: ${keyword.keyword}`,
20,
40
);



doc.text(
`SEO Score: ${keyword.seo_score}/100`,
20,
55
);



doc.text(
`Competition: ${keyword.competition}`,
20,
70
);



doc.text(
`Difficulty: ${keyword.difficulty}/100`,
20,
85
);



doc.text(
`Search Intent: ${keyword.search_intent}`,
20,
100
);




doc.text(
"Best Etsy Tags:",
20,
120
);



keyword.best_tags?.forEach(
(tag:string,index:number)=>{


doc.text(
`• ${tag}`,
25,
135 + (index*10)
);


}

);




doc.text(
"Long Tail Keywords:",
20,
200
);



keyword.long_tail_keywords?.forEach(
(item:string,index:number)=>{


doc.text(
`• ${item}`,
25,
215 + (index*10)
);


}

);




doc.save(
`${keyword.keyword}-etsy-report.pdf`
);


}







if(loading){


return (

<div className="
min-h-screen
bg-[#050510]
text-white
p-10
">

Loading...

</div>

)

}






if(!keyword){


return (

<div className="
min-h-screen
bg-[#050510]
text-white
p-10
">

No analysis found.

</div>

)

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



<h1 className="
text-4xl
font-bold
text-purple-400
">

{keyword.keyword}

</h1>



<p className="
text-gray-400
mt-3
">

Complete Etsy Keyword Analysis

</p>


<button

onClick={downloadPDF}

className="
mt-6
bg-purple-600
px-6
py-3
rounded-xl
hover:bg-purple-700
transition
font-semibold
"

>

Download PDF Report 📄

</button>
<div className="
mt-10
grid
md:grid-cols-4
gap-5
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

<p className="
text-5xl
font-bold
text-purple-400
mt-3
">

{keyword.seo_score}

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

Competition

</p>

<p className="
text-xl
mt-3
">

{keyword.competition}

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

Difficulty

</p>

<p className="
text-xl
mt-3
">

{keyword.difficulty}/100

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

Search Intent

</p>

<p className="
text-xl
mt-3
">

{keyword.search_intent}

</p>

</div>




</div>









<div className="
mt-8
bg-[#151522]
border
border-white/10
rounded-2xl
p-6
">


<div className="
flex
justify-between
items-center
">


<h2 className="
text-2xl
font-bold
">

Best Etsy Tags

</h2>



<button

onClick={()=>copyText(
keyword.best_tags.join(", "),
"tags"
)}

className="
bg-purple-600
px-4
py-2
rounded-xl
hover:bg-purple-700
transition
"

>

{
copied==="tags"
?
"Copied ✓"
:
"Copy Tags"
}

</button>



</div>





<div className="
flex
flex-wrap
gap-3
mt-5
">


{

keyword.best_tags?.map(
(tag:string,index:number)=>(


<span

key={index}

className="
bg-purple-600/20
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
mt-8
bg-[#151522]
border
border-white/10
rounded-2xl
p-6
">



<div className="
flex
justify-between
items-center
">


<h2 className="
text-2xl
font-bold
">

Long Tail Keywords

</h2>



<button

onClick={()=>copyText(
keyword.long_tail_keywords.join("\n"),
"keywords"
)}

className="
bg-purple-600
px-4
py-2
rounded-xl
hover:bg-purple-700
transition
"

>

{
copied==="keywords"
?
"Copied ✓"
:
"Copy Keywords"
}

</button>


</div>







<div className="
mt-5
space-y-3
">


{

keyword.long_tail_keywords?.map(
(item:string,index:number)=>(


<p

key={index}

>

✓ {item}

</p>


)

)

}


</div>


</div>









<div className="
mt-8
bg-[#151522]
border
border-white/10
rounded-2xl
p-6
">


<h2 className="
text-2xl
font-bold
">

AI Recommendations

</h2>





<div className="
mt-5
space-y-3
">


{

keyword.recommendations?.map(
(item:string,index:number)=>(


<p

key={index}

>

💡 {item}

</p>


)

)

}


</div>



</div>







</div>


</main>

);


}