import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";


const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
);


export async function POST(req: Request){


try{


  // 1. Require a logged in user, identified from their session
  // cookie - never from anything the request body claims.
  const supabase = await createClient();

  const {
    data: userData,
    error: userError
  } = await supabase.auth.getUser();

  if(userError || !userData.user){

    return NextResponse.json(
      { error: "Please log in to generate a listing" },
      { status: 401 }
    );

  }

  const userId = userData.user.id;


  // 2. Check credits server-side. The page also checks this before
  // calling here, but that check alone can be skipped by calling
  // this endpoint directly, so the real check has to live here too.
  const { data: profile, error: profileError } = await supabaseAdmin
    .from("user_profiles")
    .select("credits")
    .eq("id", userId)
    .single();

  if(profileError || !profile){

    return NextResponse.json(
      { error: "Could not verify your account" },
      { status: 400 }
    );

  }

  if((profile.credits ?? 0) <= 0){

    return NextResponse.json(
      { error: "No AI credits remaining. Please upgrade your plan." },
      { status: 402 }
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
await model.generateContent(prompt);





const text =
result.response.text();








const cleaned =
text
.replace(/```json/g,"")
.replace(/```/g,"")
.trim();






const data =
JSON.parse(cleaned);


  // 3. Enforce Etsy's real limits ourselves - never trust the model
  // to have followed the prompt's rules exactly.
  if(typeof data.title === "string" && data.title.length > 140){

    data.title = data.title.slice(0,140).trim();

  }

  if(Array.isArray(data.tags)){

    data.tags = data.tags
      .filter((tag: unknown) => typeof tag === "string" && tag.trim().length > 0)
      .map((tag: string) => tag.trim().slice(0,20))
      .slice(0,13);

  }


  // 4. Only spend a credit once generation actually succeeded.
  const { error: creditError } = await supabaseAdmin
    .from("user_profiles")
    .update({ credits: (profile.credits ?? 0) - 1 })
    .eq("id", userId)
    .gt("credits", 0);

  if(creditError){

    console.log("CREDIT DEDUCTION ERROR:", creditError);

  }


return NextResponse.json(data);




}

catch(error:any){

return NextResponse.json(
{
error:
error.message ||
"AI generation failed"
},
{
status:500
}
)

}


}
