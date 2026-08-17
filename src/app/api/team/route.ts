import { NextResponse } from 'next/server';

const API_KEY = 'kraya_bridge_key_2026';
const BRIDGE_URL = 'https://thesanatangurukul.com/database_bridge.php';

export async function GET(request: Request) {
  try {
    const resUsers = await fetch(`${BRIDGE_URL}?action=get_users&key=${API_KEY}`);
    const dataUsers = await resUsers.json();
    
    const resSettings = await fetch(`${BRIDGE_URL}?action=get_settings&key=${API_KEY}`);
    const dataSettings = await resSettings.json();

    const userEmail = request.headers.get('x-user-email') || '';

    return NextResponse.json({
      success: true,
      users: dataUsers.data || [],
      default_receiver: dataSettings.data?.default_receiver || '',
      currentUserEmail: userEmail
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { action, users, default_receiver } = await request.json();

    if (action === 'save_users') {
      await fetch(`${BRIDGE_URL}?action=save_users&key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: users })
      });
      return NextResponse.json({ success: true });
    }

    if (action === 'save_settings') {
      const userEmail = request.headers.get('x-user-email') || '';
      // TODO: Change this to the exact vastuwithnikhil email once provided by user
      const SUPER_ADMIN_EMAIL = 'vastuwithnikhil@gmail.com'; 
      const FALLBACK_ADMIN = 'nikhil@gmail.com';

      if (userEmail !== SUPER_ADMIN_EMAIL && userEmail !== FALLBACK_ADMIN) {
        return NextResponse.json({ success: false, message: 'Super Admin access required to change assignment rules.' }, { status: 403 });
      }

      const resSettings = await fetch(`${BRIDGE_URL}?action=get_settings&key=${API_KEY}`);
      const dataSettings = await resSettings.json();
      const currentSettings = dataSettings.data || {};
      
      currentSettings.default_receiver = default_receiver;

      await fetch(`${BRIDGE_URL}?action=save_settings&key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: currentSettings })
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
