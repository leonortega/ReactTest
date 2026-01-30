import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const country = request.geo?.country ?? 'US';

  if (pathname.startsWith('/app')) {
    const session = request.cookies.get('session');
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  const response = NextResponse.next();
  response.cookies.set('mp-region', country, { path: '/' });
  if (country === 'US') {
    response.cookies.set('mp-beta', 'true', { path: '/' });
  }
  return response;
}

export const config = {
  matcher: ['/app/:path*'],
};
