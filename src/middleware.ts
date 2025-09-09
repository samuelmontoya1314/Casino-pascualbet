
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('secure-access-session');
  const { pathname } = request.nextUrl

  // If there's no session and the user is not on the login or manual page, redirect to login
  if (!sessionCookie && pathname !== '/login' && pathname !== '/manual') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If there is a session and the user tries to access the login page, redirect to home
  if (sessionCookie && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Otherwise, continue to the requested page
  return NextResponse.next()
}

export const config = {
  // Match all routes except for API routes, static files, and images
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
