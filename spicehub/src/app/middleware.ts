import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { getBackendUrl } from './serveractions/backend-url';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const backend = getBackendUrl();
    if (!backend) return NextResponse.next();
    console.log("Backend OK")
    const cookieStore = await cookies();
    let rt = cookieStore.get("refreshToken");
    if (!rt) return NextResponse.redirect("/login");

    console.log("RT found")
    
    let at = cookieStore.get("accessToken");
    if (at) {
        console.log("AT FOUND")
        let res = await fetch(backend + "/api/user/getInfo", 
            {
                cache: 'no-store',
                method: 'GET',
                headers: 
                {
                    Authorization: at.value,
                }
            });
        if (res.status != 401) return NextResponse.next();
    }
    let res = await fetch(backend+"/api/auth/generateAccess", 
        {
            method: "GET",
            cache: 'no-store',
            headers: 
            {
                Authorization: rt.value
            }
        })

    if (res.status == 404) return NextResponse.redirect("/login");
    else if (res.ok) 
    {
        let resp = NextResponse.next()
        resp.cookies.set("accessToken", await res.text());
    }
    return NextResponse.redirect(new URL('/maintanance?error=impossible'))
}