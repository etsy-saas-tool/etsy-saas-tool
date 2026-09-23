import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { generateWithRetry } from "@/lib/gemini-retry";


const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
);




export async function POST(req: Request){


try{


// Every generation costs real money (Gemini API usage), so this must
// be tied to a logged-in user with credits left - never trust the
// browser to enforce this on its own. We check who is logged in via
// the server-side Supabase client (reads the session cookie), then
// look up + update their credits with the admin client (bypasses RLS,
// safe here because we already know exactly who this request is for).
const supabase = await createClient();

const { data: authData } = await supabase.auth.getUser();
const user = authData.user;

if(!user){

return NextResponse.json(
  { error: "Please login first" },
  { status: 401 }
);

}

const { data: profile, error: profileError } = await supabaseAdmin
  .from("user_profiles")
  .select("credits")
  .eq("id", user.id)
  .single();

if(profileError || !profile){

return NextResponse.json(
  { error: "Could not verify your account" },
  { status: 500 }
);

}

if((profile.credits ?? 0) <= 0){

return NextResponse.json(
  { error: "No AI credits remaining. Please upgrade your plan." },
  { status: 403 }
);

}




const body = await req.json();


const {
product,
category,
style,
audience
}=body;






if(!product){


return NextResponse.json(

{
error:"Product name required"
},

{
status:400
}

);


}







const model = genAI.getGenerativeModel({

model:"gemini-3.6-flash"

});









const prompt = `

You are a senior Etsy SEO strategist and conversion copywriter.

Create a complete premium Etsy listing package.


Product:
${product}


Category:
${category}


Style:
${style}


Target Audience:
${audience}




Return ONLY valid JSON.

No markdown.
No explanation.



Format:



{

"title":"",


"tags":[
"",
"",
"",
"",
"",
"",
"",
"",
"",
"",
"",
"",
""
],



"description":"",



"materials":[
"",
"",
""
],




"pricing":{

"estimated_price":"",
"reason":""

},




"buyer_persona":"",




"image_prompts":[

"",
"",
""

],




"score":0,





"analysis":{

"title_score":0,

"keyword_score":0,

"description_score":0,

"recommendations":[
"",
""
]

}



}




RULES:



TITLE:

- Maximum 140 characters
- Put main buyer keyword near beginning
- Natural human wording
- Avoid keyword stuffing



TAGS:

- Exactly 13 Etsy tags
- Maximum 20 characters each
- Buyer intent keywords
- Avoid repeated words



DESCRIPTION:

Write a high converting Etsy description.

Include:

- Product benefits
- Emotional buying reasons
- Who it is perfect for
- Product details
- Handmade/value explanation



MATERIALS:

Give realistic materials used for this product.



PRICING:

Suggest realistic Etsy selling price.



BUYER PERSONA:

Explain ideal customer.



IMAGE PROMPTS:

Create 3 professional Etsy product photography prompts.

Include:

- lighting
- background
- composition
- lifestyle feeling



SEO SCORE:

Give realistic score 0-100.



SEO ANALYSIS:

Analyze:

- title strength
- keyword quality
- description conversion

Give 2 practical improvements.



`;







const result =
await generateWithRetry(model, prompt);





const text =
result.response.text();







const cleaned =
text
.replace(/```json/g,"")
.replace(/```/g,"")
.trim();






const data =
JSON.parse(cleaned);




// Spend one credit now that generation actually succeeded. If this
// update fails we still return the result (the Gemini cost already
// happened) but we log it so it can be investigated.
const { error: creditError } = await supabaseAdmin
  .from("user_profiles")
  .update({ credits: (profile.credits ?? 0) - 1 })
  .eq("id", user.id);

if(creditError){
  console.log("CREDIT DEDUCT ERROR:", creditError);
}




return NextResponse.json(data);







}catch(error:any){



console.log(
"GENERATOR ERROR:",
error
);





return NextResponse.json(

{
error:
error.message ||
"AI generation failed"
},

{
status:500
}

);



}



}