import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_PATHS = ['/receipt', '/preview', '/confirmation', '/api/send-receipt'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some(p => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const authCookie = request.cookies.get('akp_auth')?.value;
  const secret = process.env.APP_SECRET_PASSWORD;

  if (!secret || authCookie !== secret) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/receipt/:path*',
    '/preview/:path*',
    '/confirmation/:path*',
    '/api/send-receipt/:path*',
  ],
};
