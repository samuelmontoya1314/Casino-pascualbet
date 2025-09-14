
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import nextConfig from '../next.config';

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('secure-access-session');

  // 1. Skip middleware for static files, images, and API routes.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // 2. Handle internationalization routing.
  const pathnameIsMissingLocale = nextConfig.i18n!.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = nextConfig.i18n!.defaultLocale;
    const newUrl = new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url);
    return NextResponse.redirect(newUrl);
  }

  // 3. Handle authentication routing.
  const locale = pathname.split('/')[1];
  const publicPaths = ['/login', '/manual'];
  const isPublicPath = publicPaths.some(path => pathname === `/${locale}${path}` || pathname === path);
  
  // If not logged in and trying to access a protected route, redirect to login
  if (!sessionCookie && !isPublicPath) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If logged in and trying to access login page, redirect to home
  if (sessionCookie && pathname === `/${locale}/login`) {
    const homeUrl = new URL(`/${locale}`, request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Match all routes except for API routes, static files, and images
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|flags).*)'],
}
