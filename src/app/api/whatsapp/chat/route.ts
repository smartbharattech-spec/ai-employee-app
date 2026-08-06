import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const phoneNumber = searchParams.get('phone');
  const offset = searchParams.get('offset') || '1';

  if (!phoneNumber) {
    return NextResponse.json({ success: false, message: 'Phone number is required.' }, { status: 400 });
  }

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

    // 2. Fetch live data from WhatsMarketing API (Limit 50)
    const params = new URLSearchParams({
      apiToken: apiToken,
      phone_number_id: phoneNumberId,
      phone_number: phoneNumber,
      limit: '50',
      offset: offset
    });

    const res = await fetch('https://app.whatsmarketing.in/api/v1/whatsapp/get/conversation', {
      method: 'POST',
      body: params
    });

    const data = await res.json();

    if (data.status === "1") {
      // 3. Clean up the response
      // WhatsMarketing API sometimes returns 'message' as a JSON string instead of object
      let messagesData = data.message;
      if (typeof messagesData === 'string') {
        try {
          messagesData = JSON.parse(messagesData);
        } catch (e) {
          messagesData = [];
        }
      }

      // Convert object to array if it is an object
      const messagesArray = messagesData ? (Array.isArray(messagesData) ? messagesData : Object.values(messagesData)) : [];
      
      // Parse nested JSON strings in message_content
      const parsedMessages = messagesArray.map((msg: any) => {
        let content = msg.message_content;
        let isJson = false;
        if (typeof content === 'string' && content.startsWith('{')) {
          try {
            content = JSON.parse(content);
            isJson = true;
          } catch (e) {}
        }
        
        let textBody = '';
        if (isJson && content.text && content.text.body) {
          // Outgoing message to user
          textBody = content.text.body;
        } else if (isJson && content.template) {
          // Outgoing template
          textBody = `[Template Message: ${content.template.name}]`;
        } else if (isJson && content.entry && content.entry[0]?.changes[0]?.value?.messages?.[0]) {
          // Incoming webhook from user
          const incomingMsg = content.entry[0].changes[0].value.messages[0];
          if (incomingMsg.type === 'text') {
            textBody = incomingMsg.text.body;
          } else if (incomingMsg.type === 'button') {
            textBody = incomingMsg.button.text;
          } else if (incomingMsg.type === 'interactive') {
            textBody = incomingMsg.interactive.button_reply ? incomingMsg.interactive.button_reply.title : (incomingMsg.interactive.list_reply ? incomingMsg.interactive.list_reply.title : `[Interactive Message]`);
          } else {
            textBody = `[${incomingMsg.type} Message]`;
          }
        } else {
          textBody = typeof content === 'string' ? content : JSON.stringify(content);
        }

        return {
          id: msg.id || msg.wa_message_id,
          sender: msg.sender, // 'user' or 'bot' or 'agent'
          text: textBody,
          time: msg.conversation_time || msg.read_time || null
        };
      });

      // Sort by time ascending (oldest first for chat UI) if needed
      // Actually let's just return it as is, frontend can reverse it if needed.
      // Usually API returns latest first.

      return NextResponse.json({
        success: true,
        messages: parsedMessages
      });
    } else {
      return NextResponse.json({
        success: false,
        message: data.message || 'Failed to fetch conversation.'
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Error fetching WhatsApp conversation:', error);
    return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
  }
}
