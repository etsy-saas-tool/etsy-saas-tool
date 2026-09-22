import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";


const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
);



export async function POST(req: Request) {


  try {


    // Keyword research is a Pro-only feature (see app/pricing/page.tsx),
    // so this must be checked here on the server - the page itself
    // doesn't gate access, and browser-side checks are never enough
    // because someone can just call this endpoint directly.
    const supabase = await createClient();

    const { data: authData, error: authError } = await supabase.auth.getUser();
    const user = authData.user;

    if(authError || !user){

      return NextResponse.json(
        { error: "Please login first" },
        { status: 401 }
      );

    }

    const { data: profile } = await supabaseAdmin
      .from("user_profiles")
      .select("plan")
      .eq("id", user.id)
      .single();

    if(profile?.plan !== "pro"){

      return NextResponse.json(
        { error: "Keyword research is a Pro feature. Upgrade your plan to use it." },
        { status: 403 }
      );

    }




    const body = await req.json();


    const {
      keyword
    } = body;



    if(!keyword){

      return NextResponse.json(
        {
          error:"Keyword required"
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

You are an expert Etsy SEO keyword researcher.

Analyze this Etsy keyword:

${keyword}


Return ONLY valid JSON.

No markdown.
No extra text.


Format:

{
"keyword":"",
"seo_score":0,
"search_intent":"",
"competition":"",
"difficulty":0,

"best_tags":["","","","",""],

"long_tail_keywords":["","","",""],

"recommendations":["",""]
}



Rules:

SEO Score:
Give score between 0-100.

Difficulty:
Give difficulty between 0-100.

Analyze:
- Buyer intent
- Etsy search demand
- Competition
- Keyword quality

Tags:
Give 5 buyer focused Etsy tags.

Long tail:
Give 4 long tail keywords.

Recommendations:
Give 2 practical improvements.

`;





    const result = await model.generateContent(prompt);



    const text = result.response.text();



    const cleaned = text
      .replace(/```json/g,"")
      .replace(/```/g,"")
      .trim();





    const data = JSON.parse(cleaned);






    // ==========================
    // SAVE KEYWORD SEARCH
    // ==========================
    // We already confirmed above that `user` is logged in and on the
    // Pro plan, so we can save straight away using that same user.

    const {
      error:saveError

    } = await supabase

    .from("keyword_searches")

    .insert({

      user_id:user.id,

      keyword:data.keyword || keyword,

      seo_score:data.seo_score || 0,

      search_intent:data.search_intent || "",

      competition:data.competition || "",

      difficulty:data.difficulty || 0,

      best_tags:data.best_tags || [],

      long_tail_keywords:data.long_tail_keywords || [],

      recommendations:data.recommendations || []

    });



    if(saveError){

      console.log(
        "DATABASE SAVE ERROR:",
        saveError
      );

    }






    return NextResponse.json(data);






  }catch(error:any){



    console.log(
      "KEYWORD ERROR:",
      error
    );



    return NextResponse.json(

      {
        error:
        error.message ||
        "Keyword analysis failed"
      },

      {
        status:500
      }

    );


  }


}