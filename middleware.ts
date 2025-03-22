import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/signup');
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/posts/new') || 
                          request.nextUrl.pathname.includes('/edit');

  // Check token in localStorage (client-side only)
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');

    if (isProtectedRoute && !token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (isAuthPage && token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/signup', '/posts/new', '/posts/:id/edit'],
};