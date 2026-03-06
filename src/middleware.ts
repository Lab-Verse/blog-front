import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { routing, locales } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const localeSet = new Set<string>(locales);

/**
 * Wraps next-intl middleware with an explicit fallback.
 * If the library middleware fails to produce a rewrite/redirect for
 * non-locale-prefixed paths, we manually rewrite to /en/… so that
 * the [locale] route segment always receives a valid locale.
 */
export default function middleware(request: NextRequest) {
  try {
    const response = intlMiddleware(request);
    if (response) return response;
  } catch {
    // fall through to manual rewrite
  }

  // Manual fallback: add default locale prefix when missing
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split('/')[1] ?? '';
  if (!localeSet.has(firstSegment)) {
    const url = request.nextUrl.clone();
    url.pathname = `/en${pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
