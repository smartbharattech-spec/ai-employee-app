import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password are required' }, { status: 400 });
    }

    // Check if user exists
    const [existing]: any = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing && existing.length > 0) {
      return NextResponse.json({ success: false, message: 'User already exists' }, { status: 400 });
    }

    // Hash password and insert
    const hash = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hash]);

    return NextResponse.json({ success: true, message: 'Registration successful. You can now login.' });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
