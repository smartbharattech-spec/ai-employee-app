import { NextResponse } from 'next/server';

export async function GET() {
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
      return NextResponse.json({ 
        success: true, 
        subscribers: data.message || [] 
      });
    } else {
      return NextResponse.json({ success: false, message: 'Invalid API Response' });
    }
  } catch (error: any) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
