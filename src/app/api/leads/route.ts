import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET() {
  try {
    const response = await fetch('https://myvastutool.com/get_leads.php', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 } // Disable caching to always get fresh leads
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch leads: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Convert object of leads to an array
    const leadsArray = Object.keys(data.leads || {}).map((phone) => ({
      phone_number: phone,
      ...data.leads[phone]
    }));

    // Sort leads by last_updated descending
    leadsArray.sort((a, b) => {
      const dateA = new Date(a.last_updated || 0).getTime();
      const dateB = new Date(b.last_updated || 0).getTime();
      return dateB - dateA;
    });

    return NextResponse.json({ success: true, leads: leadsArray });
  } catch (error: any) {
    console.error('Error fetching leads API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to read CRM data.' },
      { status: 500 }
    );
  }
}
