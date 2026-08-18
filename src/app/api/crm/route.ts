import { NextResponse } from 'next/server';

const BRIDGE_URL = "https://myvastutool.com/database_bridge.php";
const BRIDGE_KEY = "kraya_bridge_key_2026";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { phone_number, data } = payload;

    if (!phone_number || !data) {
      return NextResponse.json({ success: false, message: 'Missing phone_number or data' }, { status: 400 });
    }

    const bridgePayload = {
      action: 'save_crm',
      key: BRIDGE_KEY,
      data: {
        [phone_number.replace('+', '')]: data
      }
    };

    const res = await fetch(BRIDGE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bridgePayload)
    });

    const bridgeResponse = await res.json();

    if (bridgeResponse.success) {
      return NextResponse.json({ success: true, message: 'CRM data updated' });
    } else {
      return NextResponse.json({ success: false, message: bridgeResponse.error || 'Failed to update CRM data' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error saving CRM data:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
