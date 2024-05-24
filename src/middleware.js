import { NextResponse } from "next/server";

export default function middleware(req){
    let verify = req.cookies.get("access_token");
    let url = req.url
    
    if(!verify && url.includes('/dashboard')){
        return NextResponse.redirect("http://localhost:3000");
    }

    if(verify && url.includes('/register')){
        return NextResponse.redirect("http://localhost:3000/dashboard");
    }
}