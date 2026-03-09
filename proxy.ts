import { NextRequest, NextResponse } from 'next/server';

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === '/favicon.ico') {
    return new NextResponse(null, { status: 404 });
  }

  // Protect admin dashboard routes (not the login page itself)
  if (pathname.startsWith('/x-admin-portal/dashboard')) {
    const adminSession = req.cookies.get('admin_session')?.value;
    const adminSecret = process.env.ADMIN_SECRET_TOKEN || 'changeme_in_production';

    if (!adminSession || adminSession !== adminSecret) {
      return NextResponse.redirect(new URL('/x-admin-portal', req.url));
    }
  }

  // Root redirect to /en
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/en', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - images (public files)
     */
    '/((?!api|_next/static|_next/image|images).*)',
  ],
};
