
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('secure-access-session');
  const { pathname } = request.nextUrl;

  const isPublicPath = pathname === '/login' || pathname === '/manual';

  // If not logged in and trying to access a protected route, redirect to login
  if (!sessionCookie && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If logged in and trying to access login page, redirect to home
  if (sessionCookie && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Match all routes except for API routes, static files, and images
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|flags).*)'],
}
