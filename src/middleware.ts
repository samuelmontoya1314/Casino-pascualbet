
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { i18n } from '../next.config';

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('secure-access-session');
  const { pathname } = request.nextUrl;

  // Skip i18n for public files, static assets, and images
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }
  
  // Handle i18n
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = i18n.defaultLocale;
    request.nextUrl.pathname = `/${locale}${pathname}`;
    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(request.nextUrl);
  }

  const localePath = `/${pathname.split('/')[1]}`;
  const isAuthPath = `${localePath}/login` === pathname || `${localePath}/manual` === pathname;
  
  // Auth redirects
  if (!sessionCookie && !isAuthPath && pathname !== '/login' && pathname !== '/manual') {
      const loginUrl = new URL(pathname.startsWith('/en') ? '/en/login' : '/login', request.url)
      return NextResponse.redirect(loginUrl);
  }

  if (sessionCookie && (pathname === '/login' || pathname === '/en/login')) {
      const homeUrl = new URL(pathname.startsWith('/en') ? '/en' : '/', request.url)
      return NextResponse.redirect(homeUrl)
  }

  return NextResponse.next();
}

export const config = {
  // Match all routes except for API routes, static files, and images
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|flags).*)'],
}
