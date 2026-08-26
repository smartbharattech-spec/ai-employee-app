import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const userEmail = request.headers.get('x-user-email') || '';
  const userRole = request.headers.get('x-user-role') || 'agent';

  return NextResponse.json({
    success: true,
    email: userEmail,
    role: userRole
  });
}
