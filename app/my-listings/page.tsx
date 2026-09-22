"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { toast } from "@/components/Toaster";


export default function MyListings(){


const [listings,setListings] = useState<any[]>([]);
const [loading,setLoading] = useState(true);
const [search,setSearch] = useState("");

const [selectedListing,setSelectedListing] = useState<any>(null);
const [showModal,setShowModal] = useState(false);





async function fetchListings(){

try{


setLoading(true);



const {
data:userData
}=await supabase.auth.getUser();



const user=userData.user;



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
"created_at",
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

toast(error.message, "error");

}

finally{

setLoading(false);

}


}









async function deleteListing(id:string){


const confirmDelete = window.confirm(
"Delete this listing?"
);



if(!confirmDelete) return;



const {
data:userData
}=await supabase.auth.getUser();

const user=userData.user;

if(!user){

toast("Please login first", "error");

return;

}




const {
error

}=await supabase

.from("listings")

.delete()

.eq(
"id",
id
)

.eq(
"user_id",
user.id
);





if(error){

toast(error.message, "error");

return;

}



fetchListings();


}










function copyText(text:string){


navigator.clipboard.writeText(text);

toast("Copied ✅", "success");


}








function openListing(item:any){

setSelectedListing(item);

setShowModal(true);

}








function closeModal(){

setSelectedListing(null);

setShowModal(false);

}









useEffect(()=>{

fetchListings();

},[]);










const filteredListings=listings.filter((item)=>{


return item.product_name

?.toLowerCase()

.includes(

search.toLowerCase()

);


});









const totalListings=listings.length;







const averageScore=listings.length

?

Math.round(

listings.reduce(

(sum,item)=>

sum+(item.score || 0),

0

)

/ listings.length

)

:

0;








const premiumListings=listings.filter(

(item)=>

(item.score || 0)>=90

).length;








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


<div className="
flex
justify-between
items-center
mb-10
">


<div>


<h1 className="
text-4xl
font-bold
">

My Listings 🚀

</h1>



<p className="
text-gray-400
mt-2
">

Manage your saved AI generated Etsy listings.

</p>


</div>





<Link

href="/generator"

className="
bg-purple-600
hover:bg-purple-700
px-6
py-3
rounded-xl
font-bold
"

>

+ Create Listing

</Link>




</div>
{/* STATS */}


<div className="
grid
md:grid-cols-3
gap-6
mb-10
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

Total Listings

</p>


<h2 className="
text-4xl
font-bold
mt-3
text-purple-400
">

{totalListings}

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

Average SEO Score

</p>


<h2 className="
text-4xl
font-bold
mt-3
text-green-400
">

{averageScore}

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

Premium Listings

</p>


<h2 className="
text-4xl
font-bold
mt-3
text-yellow-400
">

{premiumListings}

</h2>


</div>



</div>









{/* SEARCH */}


<input


placeholder="Search your listings..."


value={search}


onChange={(e)=>setSearch(e.target.value)}


className="
w-full
bg-[#151522]
border
border-white/10
rounded-xl
p-4
mb-10
outline-none
"

/>









{/* LOADING */}



{

loading && (


<p className="
text-gray-400
text-center
py-10
">

Loading listings...

</p>


)

}









{/* EMPTY */}



{

!loading && filteredListings.length===0 && (


<div className="
bg-[#151522]
border
border-white/10
rounded-2xl
p-10
text-center
">


<h2 className="
text-xl
font-bold
">

No Listings Found

</h2>


<p className="
text-gray-400
mt-3
">

Create your first AI Etsy listing.

</p>



</div>


)

}









{/* LISTINGS */}



{

!loading && filteredListings.length>0 && (


<div className="
grid
md:grid-cols-2
gap-6
">





{

filteredListings.map((item)=>(



<div

key={item.id}

className="
bg-[#151522]
border
border-white/10
rounded-3xl
p-6
hover:border-purple-500/40
transition
"

>




<div className="
flex
justify-between
items-start
">



<div>


<h2 className="
text-xl
font-bold
">

{item.product_name}

</h2>



<p className="
text-gray-500
text-sm
mt-2
">

{

new Date(
item.created_at
).toLocaleDateString()

}

</p>



</div>







<div className="
flex
gap-3
items-center
">


<button

onClick={()=>openListing(item)}

className="
bg-purple-600
hover:bg-purple-700
px-4
py-2
rounded-lg
text-sm
font-bold
"

>

👁 View

</button>




<Link

href={`/listings/${item.id}/edit`}

className="
bg-blue-600
hover:bg-blue-700
px-4
py-2
rounded-lg
text-sm
font-bold
"

>

✏️ Edit

</Link>





<button

onClick={()=>deleteListing(item.id)}

className="
text-red-400
hover:text-red-300
"

>

Delete

</button>



</div>



</div>
{/* SCORE */}


<div className="
mt-6
flex
justify-between
items-center
bg-black/20
rounded-xl
p-4
">


<span className="
text-gray-400
">

SEO Score

</span>


<span className="
text-2xl
font-bold
text-purple-400
">

{item.score || 0}/100

</span>


</div>







{/* TITLE */}


<div className="
mt-6
">


<h3 className="
text-purple-400
font-bold
">

SEO Title

</h3>



<p className="
text-gray-300
mt-2
line-clamp-3
">

{item.title}

</p>



<button

onClick={()=>copyText(item.title)}

className="
mt-3
text-sm
text-gray-400
"

>

Copy Title

</button>


</div>









{/* TAGS */}



<div className="
mt-6
">


<h3 className="
text-purple-400
font-bold
">

Tags

</h3>



<div className="
flex
flex-wrap
gap-2
mt-3
">


{

item.tags?.split(",").map(

(tag:string,index:number)=>(


<span

key={index}

className="
bg-purple-600/20
border
border-purple-500/30
px-3
py-1
rounded-full
text-xs
"

>

{tag.trim()}

</span>


)


)


}


</div>




<button

onClick={()=>copyText(item.tags)}

className="
mt-4
text-sm
text-gray-400
"

>

Copy Tags

</button>


</div>









{/* DESCRIPTION */}



<div className="
mt-6
">


<h3 className="
text-purple-400
font-bold
">

Description

</h3>



<p className="
text-gray-300
mt-2
line-clamp-5
">

{item.description}

</p>




<button

onClick={()=>copyText(item.description)}

className="
mt-3
text-sm
text-gray-400
"

>

Copy Description

</button>


</div>









{/* PRICE */}



{

item.pricing && (


<div className="
mt-6
bg-black/20
rounded-xl
p-4
">


<h3 className="
text-purple-400
font-bold
">

Recommended Price

</h3>



<p className="
text-green-400
font-bold
text-xl
mt-2
">

{item.pricing?.estimated_price}

</p>



<p className="
text-gray-400
mt-2
">

{item.pricing?.reason}

</p>



</div>


)

}









{/* MATERIALS */}



{

item.materials && (


<div className="
mt-6
">


<h3 className="
text-purple-400
font-bold
">

Materials

</h3>



<p className="
text-gray-300
mt-2
">

{

Array.isArray(item.materials)

?

item.materials.join(", ")

:

item.materials

}

</p>



</div>


)

}





</div>


))

}


</div>


)

}







{/* MODAL */}



{

showModal && selectedListing && (


<div className="
fixed
inset-0
bg-black/70
flex
items-center
justify-center
p-6
z-50
">


<div className="
bg-[#151522]
rounded-3xl
max-w-4xl
w-full
p-8
max-h-[90vh]
overflow-y-auto
">



<div className="
flex
justify-between
items-center
">


<h2 className="
text-3xl
font-bold
text-purple-400
">

Full Listing Report

</h2>



<button

onClick={closeModal}

className="
text-gray-400
text-2xl
"

>

✕

</button>



</div>






<div className="
mt-8
space-y-6
">



<div>

<h3 className="
text-purple-400
font-bold
">

Product

</h3>


<p className="
text-gray-300
mt-2
">

{selectedListing.product_name}

</p>

</div>







<div>

<h3 className="
text-purple-400
font-bold
">

SEO Title

</h3>


<p className="
text-gray-300
mt-2
">

{selectedListing.title}

</p>

</div>







<div>

<h3 className="
text-purple-400
font-bold
">

Description

</h3>


<p className="
text-gray-300
mt-2
whitespace-pre-line
">

{selectedListing.description}

</p>

</div>







<div>

<h3 className="
text-purple-400
font-bold
">

Tags

</h3>


<p className="
text-gray-300
mt-2
">

{selectedListing.tags}

</p>

</div>







<div>

<h3 className="
text-purple-400
font-bold
">

Buyer Persona

</h3>


<p className="
text-gray-300
mt-2
">

{selectedListing.buyer_persona || "Not available"}

</p>

</div>





</div>




</div>


</div>


)

}







</div>


</main>


);

}