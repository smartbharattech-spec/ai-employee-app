import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const params = new URLSearchParams({
      apiToken: "22279|1Khrs6pJRdeatneNI2PVvZqjL8FjZwyqcyMUroyzb93231a3",
      phone_number_id: "938657545999837",
      limit: '50',
      offset: '1',
      orderBy: '1'
    });

    const response = await fetch('https://app.whatsmarketing.in/api/v1/whatsapp/subscriber/list', {
      method: 'POST',
      body: params
    });

    const data = await response.json();

    if (data.status === "1") {
      let subscribers = data.message || [];
      
      const userRole = request.headers.get('x-user-role') || 'agent';
      const userEmail = request.headers.get('x-user-email') || '';

      if (userRole !== 'admin') {
        const BRIDGE_URL = "https://thesanatangurukul.com/database_bridge.php";
        const BRIDGE_KEY = "kraya_bridge_key_2026";
        const resCrm = await fetch(`${BRIDGE_URL}?action=get_crm&key=${BRIDGE_KEY}`);
        const crmDataJson = await resCrm.json();
        const crmData = crmDataJson.data || {};

        subscribers = subscribers.filter((sub: any) => {
          const crmLead = crmData[sub.chat_id];
          return crmLead && crmLead.assigned_to === userEmail;
        });
      }

      return NextResponse.json({ 
        success: true, 
        subscribers 
      });
    } else {
      return NextResponse.json({ success: false, message: 'Invalid API Response' });
    }
  } catch (error: any) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
