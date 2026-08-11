import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password are required' }, { status: 400 });
    }

    // HARDCODED VERCEL LOGIN (No DB Required)
    if (email !== 'nikhil@gmail.com' || password !== 'nikhil123') {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    // Fake token bypass
    const token = 'fake_nikhil_token_12345';

    // Set HTTP-only cookie
    const response = NextResponse.json({ success: true, message: 'Logged in successfully' });
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error: ' + (error.message || String(error)) }, { status: 500 });
  }
}
