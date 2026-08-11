import { NextResponse } from 'next/server';

// KRAYA AI FEATURE: Auto Follow-up (Bump-up Logic) API via Bridge
const BRIDGE_URL = "https://myvastutool.com/database_bridge.php";
const BRIDGE_KEY = "kraya_bridge_key_2026";

export async function GET() {
  try {
    const resCrm = await fetch(`${BRIDGE_URL}?action=get_crm&key=${BRIDGE_KEY}`);
    const { data: crmData } = await resCrm.json();

    if (!crmData || Object.keys(crmData).length === 0) {
      return NextResponse.json({ success: false, message: 'No CRM leads found.' });
    }

    let updated = false;
    const now = Date.now();

    const wm_apiToken = "22279|1Khrs6pJRdeatneNI2PVvZqjL8FjZwyqcyMUroyzb93231a3";
    const wm_phone_number_id = "938657545999837";
    const wm_send_url = "https://app.whatsmarketing.in/api/v1/whatsapp/send";

    for (const number in crmData) {
      const lead = crmData[number];

      // RESTRICTION: Only work for test numbers
      if (!number.includes('8707526283') && !number.includes('7597571515')) {
        continue;
      }

      // Skip if closed or lost
      const status = (lead.status || '').toLowerCase();
      if (['won', 'lost', 'closed'].includes(status)) {
        continue;
      }

      // Skip if human agent has taken over (Handoff mode)
      const resHandoff = await fetch(`${BRIDGE_URL}?action=get_handoff&key=${BRIDGE_KEY}&phone=${number}`);
      const handoffData = await resHandoff.json();
      if (handoffData.is_handoff) {
        continue;
      }

      const lastUpdated = new Date(lead.last_updated).getTime();
      const hoursPassed = (now - lastUpdated) / 3600000;

      // Bump up if between 24 and 48 hours
      if (hoursPassed >= 24 && hoursPassed < 48) {
        const bump_msg = "नमस्ते! 🙏 \nक्या आप अभी भी Vastu Services के बारे में जानकारी चाहते हैं? अगर आपके कोई सवाल हैं, तो बेझिझक पूछें।";

        const formData = new URLSearchParams();
        formData.append('apiToken', wm_apiToken);
        formData.append('phone_number_id', wm_phone_number_id);
        formData.append('phone_number', number);
        formData.append('message', bump_msg);

        await fetch(wm_send_url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString()
        });

        // Update timestamp
        lead.last_updated = new Date().toISOString().replace('T', ' ').substring(0, 19);
        lead.status = 'Followed Up';
        updated = true;
      }
    }

    if (updated) {
      await fetch(BRIDGE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_crm', key: BRIDGE_KEY, data: crmData })
      });
    }

    return NextResponse.json({ success: true, message: 'Follow-up check complete.' });

  } catch (error) {
    console.error("Error in followup cron:", error);
    return NextResponse.json({ success: false, error: 'Failed to run followup via Bridge' }, { status: 500 });
  }
}
