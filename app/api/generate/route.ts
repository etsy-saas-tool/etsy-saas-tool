import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || ''
);

export async function POST(req: Request) {

  try {

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key missing" },
        { status: 500 }
      );
    }


    const { productTitle, keywords, tone } = await req.json();


    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
    });


    const prompt = `
You are a professional Etsy SEO strategist.

Create a complete optimized Etsy listing.

Product Name:
${productTitle}

Keywords:
${keywords}

Tone:
${tone}


Return ONLY valid JSON.

Format:

{
"title":"",
"tags":[],
"description":"",
"primaryKeyword":"",
"secondaryKeywords":[],
"buyerIntent":"",
"seoScore":0,
"improvementSuggestions":[]
}


Rules:

Title:
- Maximum 140 characters
- Buyer focused
- Natural Etsy keywords
- High conversion intent

Tags:
- Exactly 13 tags
- Maximum 20 characters each
- Etsy buyer search phrases

Description:
- Conversion focused
- Mobile friendly
- Natural seller language
- Include benefits and buyer emotions


SEO Analysis:

Primary Keyword:
- Give the main Etsy search keyword.

Secondary Keywords:
- Give 5 to 8 related search phrases.

Buyer Intent:
- Explain what type of buyer is searching and why.

SEO Score:
- Give score between 0 and 100.

Improvement Suggestions:
- Give exactly 5 practical Etsy SEO improvements.
`;


    const response = await model.generateContent({
      contents:[
        {
          role:"user",
          parts:[
            {
              text:prompt
            }
          ]
        }
      ],

      generationConfig:{
        responseMimeType:"application/json",
        temperature:0.6
      }

    });


    const resultText = response.response.text();


    const result = JSON.parse(resultText);


    return NextResponse.json(result);


  } catch(error:any) {

    console.error(
      "Gemini Error:",
      error
    );


    return NextResponse.json(
      {
        error: error.message || String(error)
      },
      {
        status:500
      }
    );

  }

}