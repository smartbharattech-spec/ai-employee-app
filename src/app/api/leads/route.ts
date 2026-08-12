import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read the leads file directly from the other project folder in xampp
    const leadsFilePath = 'C:\\xampp\\htdocs\\myvastutool\\crm_leads.json';
    
    if (!fs.existsSync(leadsFilePath)) {
      return NextResponse.json({ success: true, leads: [] });
    }

    const fileContent = fs.readFileSync(leadsFilePath, 'utf-8');
    const data = JSON.parse(fileContent);
    
    // Transform object into array of leads
    const leadsList = Object.entries(data).map(([phoneNumber, leadInfo]: [string, any]) => {
      return {
        phone_number: phoneNumber,
        ...leadInfo
      };
    });

    // Sort by last_updated descending
    leadsList.sort((a, b) => {
      const dateA = new Date(a.last_updated || '2000-01-01').getTime();
      const dateB = new Date(b.last_updated || '2000-01-01').getTime();
      return dateB - dateA;
    });

    return NextResponse.json({ 
      success: true, 
      leads: leadsList
    });
  } catch (error: any) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
