import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    // 1. Fetch saved credentials from DB
    const [rows]: any = await pool.query('SELECT config_key, config_value FROM api_config');
    const config: Record<string, string> = {};
    if (Array.isArray(rows)) {
      rows.forEach((row: any) => {
        config[row.config_key] = row.config_value;
      });
    }

    const apiToken = config['wm_api_token'];
    const phoneNumberId = config['wm_phone_number_id'];

    if (!apiToken || !phoneNumberId) {
      return NextResponse.json({ success: false, message: 'WhatsApp API keys are missing in config.' }, { status: 400 });
    }

    // 2. Fetch live data from WhatsMarketing API
    const params = new URLSearchParams({
      apiToken: apiToken,
      phone_number_id: phoneNumberId,
      limit: '5',
      offset: '1',
      orderBy: '1' // Get the most recent
    });

    const res = await fetch('https://app.whatsmarketing.in/api/v1/whatsapp/subscriber/list', {
      method: 'POST',
      body: params
    });

    const data = await res.json();

    if (data.status === "1") {
      return NextResponse.json({
        success: true,
        connected: true,
        subscribers: data.message || []
      });
    } else {
      return NextResponse.json({
        success: false,
        connected: false,
        message: 'Invalid API Token or Phone Number ID.'
      }, { status: 401 });
    }
  } catch (error: any) {
    console.error('Error fetching WhatsApp status:', error);
    return NextResponse.json({ success: false, connected: false, message: 'Failed to connect to WhatsMarketing API.' }, { status: 500 });
  }
}
