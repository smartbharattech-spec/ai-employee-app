import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const [rows]: any = await pool.query('SELECT phone_number, note FROM contact_notes');
    const notesMap: Record<string, string> = {};
    if (Array.isArray(rows)) {
      rows.forEach((row: any) => {
        notesMap[row.phone_number] = row.note;
      });
    }

    return NextResponse.json({ success: true, notes: notesMap });
  } catch (error: any) {
    console.error('Error fetching notes:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch notes.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone_number, note } = body;

    if (!phone_number) {
      return NextResponse.json({ success: false, message: 'Phone number is required.' }, { status: 400 });
    }

    // Insert or update note
    const query = `
      INSERT INTO contact_notes (phone_number, note) 
      VALUES (?, ?) 
      ON DUPLICATE KEY UPDATE note = VALUES(note)
    `;
    await pool.query(query, [phone_number, note || '']);

    return NextResponse.json({ success: true, message: 'Note saved successfully.' });
  } catch (error: any) {
    console.error('Error saving note:', error);
    return NextResponse.json({ success: false, message: 'Failed to save note.' }, { status: 500 });
  }
}
