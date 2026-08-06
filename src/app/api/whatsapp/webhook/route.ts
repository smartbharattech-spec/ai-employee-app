import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import pool from '@/lib/db';

const DEFAULT_REPLY = "Hello! Yeh humara automated bot hai. Hume aapka message mil gaya hai, hum jaldi aapse sampark karenge.";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    // Quick validation to ensure it's a WhatsApp webhook payload
    if (payload.object === 'whatsapp_business_account') {
      const entry = payload.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const messages = value?.messages;

      // Only process if it's an incoming message (not a status update)
      if (messages && messages.length > 0) {
        const incomingMsg = messages[0];
        const fromNumber = incomingMsg.from;
        
        console.log(`[Webhook] Incoming message received from: ${fromNumber}`);

        // 1. Fetch DB Credentials
        const [rows]: any = await pool.query('SELECT config_key, config_value FROM api_config');
        const config: Record<string, string> = {};
        if (Array.isArray(rows)) {
          rows.forEach((row: any) => {
            config[row.config_key] = row.config_value;
          });
        }

        const apiToken = config['wm_api_token'];
        const phoneNumberId = config['wm_phone_number_id'];

        if (apiToken && phoneNumberId) {
          // 2. Send Auto-Reply
          const params = new URLSearchParams({
            apiToken: apiToken,
            phone_number_id: phoneNumberId,
            phone_number: fromNumber,
            message: DEFAULT_REPLY
          });

          // Note: In a production scenario with high traffic, 
          // you might want to track 'repliedMessageIds' in a DB table
          // so you don't spam users if webhooks are retried.
          
          await fetch('https://app.whatsmarketing.in/api/v1/whatsapp/send', {
            method: 'POST',
            body: params
          });
          
          console.log(`[Webhook] Auto-reply triggered for: ${fromNumber}`);
        }
      }
    }

    // Always return 200 OK to the webhook provider so they don't retry unnecessarily
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Webhook Error:', error);
    // Still return 200 to acknowledge receipt even if our internal logic fails
    return NextResponse.json({ success: false, error: 'Internal logic error' }, { status: 200 });
  }
}
