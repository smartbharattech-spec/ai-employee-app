import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password are required' }, { status: 400 });
    }

    // Fetch real users from backend
    const usersRes = await fetch('https://thesanatangurukul.com/database_bridge.php?action=get_users&key=kraya_bridge_key_2026');
    const usersData = await usersRes.json();
    const users = usersData.data || [];

    const user = users.find((u: any) => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    // Create Base64 payload instead of generic fake token
    const payload = { email: user.email, role: user.role, name: user.name };
    const token = btoa(JSON.stringify(payload));

    // Set HTTP-only cookie
    const response = NextResponse.json({ success: true, message: 'Logged in successfully', user: payload });
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
