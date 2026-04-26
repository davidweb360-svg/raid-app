import { NextRequest, NextResponse } from 'next/server';

const ADMIN_COOKIE = 'raid_admin_auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const isLogged = request.cookies.get(ADMIN_COOKIE)?.value === 'true';

  if (isLogged) {
    return NextResponse.next();
  }

  const loginUrl = new URL('/login-admin', request.url);
  loginUrl.searchParams.set('next', pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin/:path*'],
};