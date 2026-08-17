import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/settings', '/dashboard', '/numbers', '/api/config', '/api/whatsapp'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtected) {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const payload = JSON.parse(atob(token));
      if (!payload.email) throw new Error('Invalid payload');
      
      // Pass user info to headers so API routes can access it
      const response = NextResponse.next();
      response.headers.set('x-user-email', payload.email);
      response.headers.set('x-user-role', payload.role || 'agent');
      return response;
    } catch (error) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/settings', '/dashboard', '/numbers', '/api/config', '/api/whatsapp/:path*'],
};
