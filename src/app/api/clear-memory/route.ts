import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ success: false, message: 'Phone number is required' }, { status: 400 });
    }

    const response = await fetch(`https://myvastutool.com/api_wipe.php?phone=${phone}`);
    const data = await response.json();

    if (data.success) {
      return NextResponse.json({ success: true, message: data.message });
    } else {
      return NextResponse.json({ success: false, message: data.message || 'Failed to wipe memory' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Error clearing memory:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
