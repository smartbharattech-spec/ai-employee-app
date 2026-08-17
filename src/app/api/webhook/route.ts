import { NextResponse } from 'next/server';

// KRAYA AI FEATURE: Next.js Webhook via Bridge API
const BRIDGE_URL = "https://thesanatangurukul.com/database_bridge.php";
const BRIDGE_KEY = "kraya_bridge_key_2026";

export async function POST(request: Request) {
  try {
    const rawData = await request.text();
    const reqData = JSON.parse(rawData);

    // 1. Extract Sender Number
    let sender_number = '';
    if (reqData.chat_id) sender_number = reqData.chat_id;
    else if (reqData.phone_number) sender_number = reqData.phone_number;
    else if (reqData.data?.phone_number) sender_number = reqData.data.phone_number;
    else if (reqData.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from) {
      sender_number = reqData.entry[0].changes[0].value.messages[0].from;
    }

    if (!sender_number) {
      return NextResponse.json({ status: 'success', message: 'Waiting for phone_number.' });
    }

    // SECURITY RESTRICTION: Only test numbers allowed for now
    if (!sender_number.includes('8707526283') && !sender_number.includes('7597571515')) {
      return NextResponse.json({ status: 'success', message: 'Number not whitelisted.' });
    }

    // 2. Settings & API Keys
    const wm_apiToken = "22279|1Khrs6pJRdeatneNI2PVvZqjL8FjZwyqcyMUroyzb93231a3";
    const wm_phone_number_id = "938657545999837";
    const gemini_api_key = process.env.GEMINI_API_KEY || ("AQ.Ab8RN6LZS" + "JP2JZM_o00JK2CM9eTo1YYsHmT_M1aVFeAVpT4EPQ"); 
    const wm_send_url = "https://app.whatsmarketing.in/api/v1/whatsapp/send";

    // 3. Human Handoff Check via Bridge
    const resHandoff = await fetch(`${BRIDGE_URL}?action=get_handoff&key=${BRIDGE_KEY}&phone=${sender_number}`);
    const handoffData = await resHandoff.json();
    const is_handoff_mode = handoffData.is_handoff || false;

    // 4. Extract User Message
    let user_message_text = "Hi";
    if (reqData.user_message) user_message_text = reqData.user_message;
    else if (reqData.message) user_message_text = reqData.message;
    else if (reqData.data?.message) user_message_text = reqData.data.message;
    else if (reqData.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body) {
      user_message_text = reqData.entry[0].changes[0].value.messages[0].text.body;
    }

    if (is_handoff_mode) {
      user_message_text = `[System State: User is currently in the Human Handoff queue waiting for Nikhil Sir. Acknowledge this contextually, do not try to qualify them, just assure them the senior team is updated and will answer shortly. Set needs_human to true.]\n\nUser Message: ${user_message_text}`;
    }

    // 5. Deduplication & CRM via Bridge
    const resCrm = await fetch(`${BRIDGE_URL}?action=get_crm&key=${BRIDGE_KEY}`);
    const { data: crm_data_all = {} } = await resCrm.json();
    let current_state_data: any = {};

    if (crm_data_all[sender_number]) {
      const last_msg = crm_data_all[sender_number].last_message || '';
      const last_time = new Date(crm_data_all[sender_number].last_updated || '2000-01-01').getTime();
      
      if (user_message_text.trim() === last_msg.trim() && (Date.now() - last_time) < 60000) {
        return NextResponse.json({ status: 'success', message: 'Duplicate message ignored' });
      }
      current_state_data = crm_data_all[sender_number].data || {};
    }

    // 6. Memory Management via Bridge
    const resChat = await fetch(`${BRIDGE_URL}?action=get_chat&key=${BRIDGE_KEY}&phone=${sender_number}`);
    const chatData = await resChat.json();
    let history: any[] = chatData.history || [];
    
    if (history.length > 12) history = history.slice(-12);

    let system_prompt = "CORE RULES: You are an AI Assistant. In your first message, you MUST introduce yourself clearly as an AI Assistant (e.g. 'नमस्ते! मैं Vastu With Nikhil की AI Assistant हूँ।'). पहले समझें - सही सर्विस का सुझाव दें - कभी भी ज़बरदस्ती करने वाले न लगें - सिर्फ़ बिज़नेस से जुड़े सवालों के जवाब दें - लीड की जानकारी इकट्ठा करें - ज़रूरत पड़ने पर किसी इंसान को सौंप दें - सामने वाला व्यक्ति जिस भाषा (Language) में बात कर रहा है, हमेशा उसी भाषा में जवाब दें。\nConversation Principles: Understand first. Recommend second. Explain briefly. Handle objections. Collect lead. Human handoff when needed.";
    if (is_handoff_mode) {
      system_prompt += "\n\n[CRITICAL MODE: STANDBY/HANDOFF]\nThe user is currently waiting for a human representative. Be supportive and brief. You must call a function.";
    }

    history.push({ role: "user", parts: [{ text: user_message_text }] });

    // 7. Gemini API Call
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${gemini_api_key}`;
    
    const universal_params = {
      reply_text: { type: "STRING", description: "The message to send to the user." },
      intent: { type: "STRING", description: "Inquiry, Booking, Support, or Off-topic" },
      lead_status: { type: "STRING", description: "Cold, Warm, Hot" },
      needs_human: { type: "BOOLEAN", description: "Set true if user demands a real manager/expert right now OR wants consultation" },
      extracted_name: { type: "STRING", description: "User's true first and last name if provided, else null" },
      extracted_service_type: { type: "STRING", description: "The exact service name, else null" },
      wants_consultation: { type: "BOOLEAN", description: "Set true if user explicitly wants to talk to an expert or book a consultation" }
    };

    const payload = {
      system_instruction: { parts: { text: system_prompt } },
      contents: history,
      tools: [{
        function_declarations: [{
          name: "respond_and_extract_lead",
          description: "Always use this function to respond to the user and extract lead data.",
          parameters: {
            type: "OBJECT",
            properties: universal_params,
            required: ["reply_text"]
          }
        }]
      }],
      tool_config: { function_calling_config: { mode: "ANY" } }
    };

    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const geminiData = await geminiRes.json();
    let ai_response_text = "Hi";
    
    if (geminiData?.candidates?.[0]?.content?.parts?.[0]?.functionCall) {
      const funcCall = geminiData.candidates[0].content.parts[0].functionCall;
      const args = funcCall.args;
      ai_response_text = args.reply_text || "Hello";

      // Update CRM via Bridge
      crm_data_all[sender_number] = {
        last_updated: new Date().toISOString().replace('T', ' ').substring(0, 19),
        last_message: user_message_text,
        status: args.lead_status || crm_data_all[sender_number]?.status || 'Cold',
        intent: args.intent || crm_data_all[sender_number]?.intent || 'Inquiry',
        admin_alert_sent: crm_data_all[sender_number]?.admin_alert_sent || false,
        data: {
          ...current_state_data,
          name: args.extracted_name && args.extracted_name !== 'unknown' ? args.extracted_name : current_state_data.name,
          service_type: args.extracted_service_type && args.extracted_service_type !== 'unknown' ? args.extracted_service_type : current_state_data.service_type,
        }
      };
      
      await fetch(BRIDGE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_crm', key: BRIDGE_KEY, data: crm_data_all })
      });

      // Human handoff via Bridge
      if (args.needs_human) {
        await fetch(BRIDGE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'set_handoff', key: BRIDGE_KEY, phone: sender_number, reason: 'User requested human' })
        });
      }

      // AUTO-ASSIGN: When lead is Hot or wants consultation, assign to default team member
      const shouldAutoAssign = (args.lead_status === 'Hot' || args.needs_human || args.wants_consultation);
      const alreadyAssigned = crm_data_all[sender_number]?.auto_assigned;

      if (shouldAutoAssign && !alreadyAssigned) {
        try {
          const resSettings = await fetch(`${BRIDGE_URL}?action=get_settings&key=${BRIDGE_KEY}`);
          const settingsData = await resSettings.json();
          const defaultReceiver = settingsData.data?.default_receiver || 'nikhil@gmail.com';

          crm_data_all[sender_number].assigned_to = defaultReceiver;
          crm_data_all[sender_number].auto_assigned = true;

          await fetch(BRIDGE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'save_crm', key: BRIDGE_KEY, data: crm_data_all })
          });

          console.log(`[AutoAssign] Lead ${sender_number} assigned to ${defaultReceiver}`);
        } catch (assignErr) {
          console.error('[AutoAssign] Error:', assignErr);
        }
      }

      history.push({ role: "model", parts: [{ text: ai_response_text }] });
      await fetch(BRIDGE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_chat', key: BRIDGE_KEY, phone: sender_number, history })
      });
    }

    // 8. Send Final Response via WhatsMarketing
    const wmFormData = new URLSearchParams();
    wmFormData.append('apiToken', wm_apiToken);
    wmFormData.append('phone_number_id', wm_phone_number_id);
    wmFormData.append('phone_number', sender_number);
    wmFormData.append('message', ai_response_text);

    await fetch(wm_send_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: wmFormData.toString()
    });

    return NextResponse.json({ status: 'success', message: 'Replied' });

  } catch (error) {
    console.error("Webhook Error via Bridge:", error);
    return NextResponse.json({ status: 'error', message: 'Internal Server Error' }, { status: 500 });
  }
}
