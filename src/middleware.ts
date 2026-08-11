import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/settings', '/dashboard', '/numbers', '/api/config', '/api/whatsapp'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtected) {
    const token = request.cookies.get('auth_token')?.value;

    if (!token || token !== 'fake_nikhil_token_12345') {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/settings/:path*', '/dashboard/:path*', '/api/config', '/api/whatsapp/:path*'],
};
