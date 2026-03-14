import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { routing, locales } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const localeSet = new Set<string>(locales);

/** Legacy URL patterns from previous WordPress/WooCommerce installation. */
const LEGACY_PATTERNS = [
  /^\/products\//,
  /^\/abby\.php/,
  /^\/report\.php/,
  /^\/wp-content\//,
  /^\/wp-admin\//,
  /^\/wp-includes\//,
  /^\/wp-json\//,
  /^\/wp-login/,
  /^\/xmlrpc\.php/,
  /^\/feed\//,
];

/**
 * Wraps next-intl middleware with an explicit fallback.
 * If the library middleware fails to produce a rewrite/redirect for
 * non-locale-prefixed paths, we manually rewrite to /en/… so that
 * the [locale] route segment always receives a valid locale.
 */
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Return 410 Gone for legacy WordPress/WooCommerce URLs to stop
  // Googlebot from wasting crawl budget on non-existent pages.
  if (LEGACY_PATTERNS.some((p) => p.test(pathname))) {
    return new NextResponse(null, { status: 410, statusText: 'Gone' });
  }

  try {
    const response = intlMiddleware(request);
    if (response) return response;
  } catch {
    // fall through to manual rewrite
  }

  // Manual fallback: add default locale prefix when missing
  const firstSegment = pathname.split('/')[1] ?? '';
  if (!localeSet.has(firstSegment)) {
    const url = request.nextUrl.clone();
    url.pathname = `/en${pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/((?!api|_next|_vercel|.*\.(?!php).*).*)'
  ],
};
