import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isPublicRoute = pathname.startsWith('/welcome') || pathname.startsWith('/api/auth') || pathname.startsWith('/auth');

    const hasSessionToken = request.cookies.get("better-auth.session_token") || request.cookies.get("__Secure-better-auth.session_token");

    if (!isPublicRoute && !hasSessionToken) {
        return NextResponse.redirect(new URL('/welcome', request.url));
    }
    
    // If user is on /welcome or /auth but has a session, redirect to home
    if ((pathname.startsWith('/welcome') || pathname.startsWith('/auth')) && hasSessionToken) {
        return NextResponse.redirect(new URL('/', request.url));
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.png|icon.png).*)'],
};
