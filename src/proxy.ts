import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Expose the request pathname to server components/layouts that are not
 * dynamic routes, so they can generate per-route metadata (e.g. case studies).
 */
export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ['/case-study/:path*'],
};
