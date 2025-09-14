
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
  
  // 2. Handle i18n redirection.
  const { locales, defaultLocale } = nextConfig.i18n!;
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const newUrl = new URL(`/${defaultLocale}${pathname}`, request.url);
    return NextResponse.redirect(newUrl);
  }

  // 3. Handle authentication routing
  const locale = pathname.split('/')[1] || defaultLocale;
  const publicPaths = ['/login', '/manual'];
  // Check if the path without the locale is a public path
  const isPublicPath = publicPaths.some(path => pathname === `/${locale}${path}` || pathname === path);
  
  const homeUrl = new URL(`/${locale}`, request.url);
  const loginUrl = new URL(`/${locale}/login`, request.url);

  // If not logged in and trying to access a protected route, redirect to login
  if (!sessionCookie && !isPublicPath) {
    return NextResponse.redirect(loginUrl);
  }

  // If logged in and trying to access login page, redirect to home
  if (sessionCookie && (pathname === `/${locale}/login` || pathname === '/login')) {
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Match all routes except for API routes, static files, and images
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|flags).*)'],
}
