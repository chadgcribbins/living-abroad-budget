import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public directory
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|fonts).*)',
  ],
};

export function middleware(request: NextRequest) {
  // For now, we're not implementing actual authentication, so just pass through all requests
  // In the future, this will check for authentication tokens and redirect appropriately
  
  // Example if we had authentication:
  // const isAuthenticated = request.cookies.has('auth-token');
  // const { pathname } = request.nextUrl;
  // const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');
  // 
  // if (!isAuthenticated && !isAuthRoute && !pathname.startsWith('/api/auth')) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }
  // 
  // if (isAuthenticated && isAuthRoute) {
  //   return NextResponse.redirect(new URL('/', request.url));
  // }

  return NextResponse.next();
} 