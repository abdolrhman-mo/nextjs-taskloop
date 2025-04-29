import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // If the user is not logged in and trying to access a protected route
  if (!token && pathname.startsWith('/(protected)')) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // If the user is logged in and trying to access auth pages
  if (token && (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register'))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 