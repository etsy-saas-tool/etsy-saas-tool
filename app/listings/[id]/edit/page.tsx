"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import { toast } from "@/components/Toaster";


export default function EditListing(){

const params = useParams();
const router = useRouter();

const id = params.id as string;


const [loading,setLoading] = useState(true);
const [saving,setSaving] = useState(false);


const [title,setTitle] = useState("");
const [tags,setTags] = useState("");
const [description,setDescription] = useState("");
const [userId,setUserId] = useState("");





async function getListing(){

try{


const {
data:userData
}= await supabase.auth.getUser();



const user = userData.user;


if(!user){

toast("Please login first", "error");
return;

}


setUserId(user.id);



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





console.log(
"LISTING DATA:",
data
);





setTitle(
data?.title || ""
);



setTags(
data?.tags || ""
);



setDescription(
data?.description || ""
);



}

catch(error:any){


console.log(error);

toast(error.message, "error");


}

finally{


setLoading(false);


}


}









async function updateListing(){


try{


setSaving(true);


if(!userId){

toast("Please login first", "error");
return;

}


const {
error

}= await supabase

.from("listings")

.update({

title:title,

tags:tags,

description:description

})

.eq(
"id",
id
)

.eq(
"user_id",
userId
);





if(error){

throw error;

}



toast("Listing Updated Successfully ✅", "success");



router.push(
`/listings/${id}`
);



}


catch(error:any){


toast(error.message, "error");


}


finally{


setSaving(false);


}



}







useEffect(()=>{


if(id){

getListing();

}


},[id]);









if(loading){

return (

<div className="
min-h-screen
bg-[#070711]
text-white
flex
items-center
justify-center
">

Loading...

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
max-w-4xl
mx-auto
">



<h1 className="
text-4xl
font-bold
">

✏️ Edit Listing

</h1>



<p className="
text-gray-400
mt-2
">

Update your Etsy SEO listing details.

</p>






<div className="
mt-10
bg-[#151522]
border
border-white/10
rounded-3xl
p-8
space-y-6
">





<div>

<label className="
text-purple-400
font-bold
">

SEO Title

</label>


<input

value={title}

onChange={(e)=>setTitle(e.target.value)}

className="
mt-2
w-full
bg-black/30
border
border-white/10
rounded-xl
p-4
"

/>

</div>








<div>

<label className="
text-purple-400
font-bold
">

Tags

</label>


<textarea

value={tags}

onChange={(e)=>setTags(e.target.value)}

className="
mt-2
w-full
h-32
bg-black/30
border
border-white/10
rounded-xl
p-4
"

/>

</div>







<div>

<label className="
text-purple-400
font-bold
">

Description

</label>


<textarea

value={description}

onChange={(e)=>setDescription(e.target.value)}

className="
mt-2
w-full
h-80
bg-black/30
border
border-white/10
rounded-xl
p-4
"

/>

</div>







<button

onClick={updateListing}

disabled={saving}

className="
bg-purple-600
hover:bg-purple-700
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

"💾 Save Changes"

}


</button>





</div>


</div>


</main>

);



}