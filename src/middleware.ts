import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Define the routes that need protection
const protectedRoutes = ['/settings', '/dashboard', '/numbers', '/api/config', '/api/whatsapp'];
const ADMIN_EMAIL = 'nikhil@gmail.com';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current route needs protection
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
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');
      const { payload } = await jwtVerify(token, secret);

      // Verify that the logged in user is the admin
      if (payload.email !== ADMIN_EMAIL) {
        if (pathname.startsWith('/api/')) {
          return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
        }
        // Redirect non-admin users away from settings
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      // Invalid token
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/settings', '/dashboard', '/numbers', '/api/config', '/api/whatsapp/:path*'],
};
