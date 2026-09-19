"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";


export default function Sidebar(){


const pathname = usePathname();



const links=[

{
name:"Dashboard",
path:"/dashboard"
},

{
name:"AI Generator",
path:"/generator"
},

{
name:"My Listings",
path:"/my-listings"
},

{
name:"Keyword Research",
path:"/keyword-research"
},

{
name:"Analytics",
path:"/analytics"
},

{
name:"Billing",
path:"/billing"
},

{
name:"Settings",
path:"/settings"
}


];





return (

<aside className="fixed left-0 top-0 h-screen w-64 bg-[#11111d] border-r border-white/10 p-6 text-white">


<h1 className="text-2xl font-bold mb-10">
Etsy<span className="text-purple-500">AI</span>
</h1>



<nav className="space-y-3">


{

links.map((link)=>(


<Link

key={link.path}

href={link.path}

className={`block px-4 py-3 rounded-xl transition ${
pathname.startsWith(link.path)
?
"bg-purple-600 text-white"
:
"text-gray-400 hover:text-white hover:bg-white/5"
}`}

>

{link.name}

</Link>


))


}



</nav>



</aside>


)


}