import { NextResponse, NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const enableAuth = process.env.ENABLE_AUTH !== 'false';
  const { pathname } = req.nextUrl;

  const isProtected = pathname.startsWith('/dashboard') || pathname.startsWith('/(protected)');
  if (!enableAuth) {
    return NextResponse.next();
  }
  if (isProtected) {
    // Rely on NextAuth middleware-like session cookie; SSR pages will check auth again
    const sessionToken = req.cookies.get('next-auth.session-token') || req.cookies.get('__Secure-next-auth.session-token');
    if (!sessionToken) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/(protected)/:path*']
};