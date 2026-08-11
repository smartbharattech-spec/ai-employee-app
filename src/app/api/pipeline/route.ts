import { NextResponse } from 'next/server';

const BRIDGE_URL = "https://myvastutool.com/database_bridge.php";
const BRIDGE_KEY = "kraya_bridge_key_2026";

export async function GET() {
  try {
    const res = await fetch(`${BRIDGE_URL}?action=get_crm&key=${BRIDGE_KEY}`);
    const data = await res.json();
    const crmData = data.data || {};

    // We need to check handoff for each lead, but to avoid N requests, 
    // let's just assume handoff is checked per lead when clicking in a real app, 
    // or we fetch handoffs in bulk (not implemented in bridge yet).
    // For simplicity, we just mark is_handoff=false in the list view, 
    // or we can fetch them if needed. 
    // Let's modify bridge later if we need bulk handoffs, but for now we map it.

    const leads = Object.entries(crmData).map(([phone, leadData]: [string, any]) => {
      return {
        phone,
        ...leadData,
        status: leadData.status || 'Cold',
        is_handoff: false // Optimization: fetch specific handoff when clicking, or assume false in overview
      };
    });

    return NextResponse.json({ success: true, leads });
  } catch (error) {
    console.error("Error fetching pipeline from Bridge:", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, phone_number, status, message } = body;

    // Fetch latest CRM data
    const resCrm = await fetch(`${BRIDGE_URL}?action=get_crm&key=${BRIDGE_KEY}`);
    const { data: crmData } = await resCrm.json();

    if (!crmData[phone_number]) {
      return NextResponse.json({ success: false, message: 'Lead not found' }, { status: 404 });
    }

    if (action === 'update_status') {
      crmData[phone_number].status = status;
      await fetch(BRIDGE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_crm', key: BRIDGE_KEY, data: crmData })
      });
      return NextResponse.json({ success: true, message: 'Status updated' });
    }
    
    if (action === 'send_message') {
      // Send via WhatsApp API
      const wm_apiToken = "22279|1Khrs6pJRdeatneNI2PVvZqjL8FjZwyqcyMUroyzb93231a3";
      const wm_phone_number_id = "938657545999837";
      const wm_send_url = "https://app.whatsmarketing.in/api/v1/whatsapp/send";
      
      const formData = new URLSearchParams();
      formData.append('apiToken', wm_apiToken);
      formData.append('phone_number_id', wm_phone_number_id);
      formData.append('phone_number', phone_number);
      formData.append('message', message);

      await fetch(wm_send_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
      });

      // Activate Handoff via Bridge
      await fetch(BRIDGE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'set_handoff', key: BRIDGE_KEY, phone: phone_number, reason: 'Human takeover from Next.js CRM Dashboard' })
      });

      // Update CRM timestamp via Bridge
      crmData[phone_number].last_updated = new Date().toISOString().replace('T', ' ').substring(0, 19);
      await fetch(BRIDGE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_crm', key: BRIDGE_KEY, data: crmData })
      });

      return NextResponse.json({ success: true, message: 'Message sent and AI paused.' });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error("Error updating pipeline via Bridge:", error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
