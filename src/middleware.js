import { NextResponse } from "next/server";

export default function middleware(req){
    let verify = req.cookies.get("access_token");
    let url = req.url
    
    if(!verify && url.includes('/dashboard')){
        return NextResponse.redirect("http://proskill-academy.com");
    }

    if(verify && url.includes('/register')){
        return NextResponse.redirect("http://proskill-academy.com/dashboard");
    }
}