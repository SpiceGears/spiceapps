import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { getBackendUrl } from './app/serveractions/backend-url';
import { UserInfo } from './models/User';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    let backend = await getBackendUrl();
    if (!backend) { console.log("backend url not set, skipping");return NextResponse.next();}
    backend = "http://spiceapi:8080"
    //console.log("Backend OK")
    const cookieStore = await cookies();
    let rt = cookieStore.get("refreshToken");
    if (!rt) return NextResponse.redirect((new URL('/login', request.url)));

    //console.log("RT found")
    
    let at = cookieStore.get("accessToken");
    if (at) {
        //console.log("AT FOUND")
        let res = await fetch(backend + "/api/user/getInfo", 
            {
                cache: 'no-store',
                method: 'GET',
                headers: 
                {
                    Authorization: at.value,
                }
            });
        if (res.status != 401)
        {
            const user: UserInfo = await res.json();
            if (user.isApproved === false) 
            {
                return NextResponse.redirect(new URL('/unapproved', request.url));
            }
            else return NextResponse.next(); 
        }
    }
    let res = await fetch(backend+"/api/auth/generateAccess", 
        {
            method: "POST",
            cache: 'no-store',
            headers: 
            {
                Authorization: rt.value
            }
        })

    if (res.status == 404) return NextResponse.redirect((new URL('/login', request.url)));
    else if (res.ok) 
    {
        let resp = NextResponse.next()
        resp.cookies.set("accessToken", await res.text());
        return resp;
    }
    return NextResponse.redirect(new URL('/maintanance?error=impossible', request.url))
}

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - /login (public login page)
     * - /api (optional: skip API routes)
     * - /maintanance - in case of API being disabled
     * - /register - registration page
     * - _next (Next.js internals like static files)
     */
    '/((?!login|api|maintanance|unapproved|register|_next|favicon.ico).*)',
  ],
};
