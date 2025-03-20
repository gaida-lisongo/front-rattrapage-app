import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token');

  // Protéger les routes /question et /game
  if (request.nextUrl.pathname.startsWith('/question') || 
      request.nextUrl.pathname.startsWith('/game')) {
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/question/:path*', '/game/:path*']
}