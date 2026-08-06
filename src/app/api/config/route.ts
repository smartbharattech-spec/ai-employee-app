import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT config_key, config_value FROM api_config');
    const config: Record<string, string> = {};
    if (Array.isArray(rows)) {
      rows.forEach((row: any) => {
        config[row.config_key] = row.config_value;
      });
    }
    return NextResponse.json({ success: true, data: config });
  } catch (error: any) {
    console.error('Error fetching config:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // We expect body to be a key-value object of configs
    for (const [key, value] of Object.entries(body)) {
      await pool.query(
        'INSERT INTO api_config (config_key, config_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE config_value = ?',
        [key, value, value]
      );
    }
    
    return NextResponse.json({ success: true, message: 'Configuration saved successfully.' });
  } catch (error: any) {
    console.error('Error saving config:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
