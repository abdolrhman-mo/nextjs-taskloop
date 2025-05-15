import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of paths that don't require authentication
const publicPaths = ['/auth/login', '/auth/register'];

export function middleware(request: NextRequest) {
  // Check for token in cookie
  const token = request.cookies.get('token')?.value;
  // Also check Authorization header as fallback
  const authHeader = request.headers.get('authorization');
  const hasToken = token || (authHeader && authHeader.startsWith('Bearer '));
  
  const { pathname } = request.nextUrl;

  // Allow access to public paths
  if (publicPaths.includes(pathname)) {
    // If user is already logged in and tries to access auth pages, redirect to home
    if (hasToken && pathname.startsWith('/auth/')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Redirect to login if no token is present
  if (!hasToken) {
    const loginUrl = new URL('/auth/login', request.url);
    // Add the current path as a redirect parameter
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}; 