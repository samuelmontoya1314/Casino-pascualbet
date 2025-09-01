
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('secure-access-session');
  const { pathname } = request.nextUrl

  // Allow access to login and manual pages without a session
  if (!sessionCookie && pathname !== '/login' && pathname !== '/manual') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If the user is logged in and tries to access the login page
  if (sessionCookie && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
