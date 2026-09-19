import { NextResponse } from "next/server";


export async function POST(req:Request){

try{


const body = await req.json();


const {
product,
category,
style,
audience
}=body;



const result = {

title:
`${product} | Handmade ${style} Etsy Product for ${audience}`,

tags:[
"etsy gift",
"handmade",
"unique decor",
"custom gift",
"etsy shop",
"creative product",
"small business"
],

description:

`Beautiful ${product} designed for ${audience}.
Perfect for Etsy shoppers looking for handmade ${category}.
This ${style} product makes a thoughtful gift and unique addition.`

};



return NextResponse.json(result);



}

catch(error){

return NextResponse.json(
{
error:"Generation failed"
},
{
status:500
}
)

}


}