
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { i18n } from '@/lib/i18n';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('secure-access-session');
  const { pathname } = request.nextUrl;
  
  // Middleware para i18n
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = i18n.defaultLocale;
    return NextResponse.redirect(
      new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
    );
  }

  // Rutas públicas que no requieren autenticación
  const isPublicPath = (path: string) => {
    return path.endsWith('/login') || path.endsWith('/manual');
  }

  // Si no ha iniciado sesión e intenta acceder a una ruta protegida, redirigir a login
  if (!sessionCookie && !isPublicPath(pathname)) {
    const locale = pathname.split('/')[1] || i18n.defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  // Si ha iniciado sesión e intenta acceder a login, redirigir al dashboard
  if (sessionCookie && pathname.endsWith('/login')) {
     const locale = pathname.split('/')[1] || i18n.defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Matcher para excluir rutas de API, estáticos, imágenes, etc.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|flags).*)'],
}
