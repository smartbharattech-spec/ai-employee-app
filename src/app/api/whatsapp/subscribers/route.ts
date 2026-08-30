import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const CACHE_FILE = path.join(process.cwd(), 'data-cache.json');
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

// Prevent multiple simultaneous background fetches
let isFetching = false;

async function fetchAllData() {
    if (isFetching) return null;
    isFetching = true;
    try {
        let allSubscribers: any[] = [];
        
        // Fetch first page
        const params = new URLSearchParams({
          apiToken: "22279|1Khrs6pJRdeatneNI2PVvZqjL8FjZwyqcyMUroyzb93231a3",
          phone_number_id: "938657545999837",
          limit: '100',
          offset: '1',
          orderBy: '1'
        });

        const response = await fetch('https://app.whatsmarketing.in/api/v1/whatsapp/subscriber/list', {
          method: 'POST',
          body: params
        });

        const textData = await response.text();
        let data;
        try {
            data = textData ? JSON.parse(textData) : {};
        } catch (e) {
            console.error("Failed to parse JSON from WhatsMarketing API. Response was:", textData);
            isFetching = false;
            return null;
        }

        if (data.status === "1" && data.message && data.message.length > 0) {
            allSubscribers = allSubscribers.concat(data.message);
            
            // Parallel fetch remaining pages in batches of 10
            let currentOffset = 2;
            let hasMore = data.message.length === 100;
            
            while (hasMore) {
                const batchPromises = [];
                for (let i = 0; i < 10; i++) {
                    const p = new URLSearchParams({
                      apiToken: "22279|1Khrs6pJRdeatneNI2PVvZqjL8FjZwyqcyMUroyzb93231a3",
                      phone_number_id: "938657545999837",
                      limit: '100',
                      offset: (currentOffset + i).toString(),
                      orderBy: '1'
                    });
                    
                    batchPromises.push(
                        fetch('https://app.whatsmarketing.in/api/v1/whatsapp/subscriber/list', { method: 'POST', body: p })
                        .then(r => r.text())
                        .then(text => {
                            try { return text ? JSON.parse(text) : {}; }
                            catch(e) { return {}; }
                        })
                    );
                }
                
                const batchResults = await Promise.all(batchPromises);
                
                let batchHadLess = false;
                for (const resData of batchResults) {
                    if (resData.status === "1" && resData.message && resData.message.length > 0) {
                        allSubscribers = allSubscribers.concat(resData.message);
                        if (resData.message.length < 100) {
                            batchHadLess = true;
                        }
                    } else {
                        batchHadLess = true;
                    }
                }
                
                if (batchHadLess || allSubscribers.length >= 100000) {
                    hasMore = false;
                } else {
                    currentOffset += 10;
                }
            }
        }
        
        if (allSubscribers.length > 0) {
            // Fetch CRM data
            let crmData: any = {};
            try {
              const BRIDGE_URL = "https://myvastutool.com/database_bridge.php";
              const BRIDGE_KEY = "kraya_bridge_key_2026";
              const resCrm = await fetch(`${BRIDGE_URL}?action=get_crm&key=${BRIDGE_KEY}`, {
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                  'Accept': 'application/json'
                }
              });
              const textCrm = await resCrm.text();
              const crmDataJson = textCrm ? JSON.parse(textCrm) : {};
              crmData = crmDataJson.data || {};
            } catch (err) {
              console.error("Failed to fetch CRM data for subscribers:", err);
            }
    
            const subscribers = allSubscribers.map((sub: any) => {
              return { ...sub, crmData: crmData[sub.chat_id] || null };
            });
            
            // Remove duplicates
            const uniqueSubscribers = Array.from(new Map(subscribers.map(item => [item.chat_id, item])).values());
            
            const cacheData = {
                data: uniqueSubscribers,
                lastFetch: Date.now()
            };
            
            await fs.writeFile(CACHE_FILE, JSON.stringify(cacheData), 'utf-8');
            return cacheData;
        }
    } catch(e) {
        console.error("Error in fetchAllData:", e);
    } finally {
        isFetching = false;
    }
    return null;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const timeFilter = url.searchParams.get('timeFilter') || 'all';
    const statusFilter = url.searchParams.get('statusFilter') || 'all';
    const callFilter = url.searchParams.get('callFilter') || 'all';
    const conversionFilter = url.searchParams.get('conversionFilter') || 'all';
    const serviceFilter = url.searchParams.get('serviceFilter') || 'all';
    const topFilter = url.searchParams.get('topFilter') || 'all';
    const refresh = url.searchParams.get('refresh') === 'true';
    
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    
    let cached = { data: [] as any[], lastFetch: 0 };
    try {
        const fileContent = await fs.readFile(CACHE_FILE, 'utf-8');
        cached = JSON.parse(fileContent);
    } catch(e) {
        // File doesn't exist or is invalid
    }

    const now = Date.now();
    const isStale = (now - cached.lastFetch) > CACHE_DURATION_MS;

    if (refresh || cached.data.length === 0) {
        // Must wait for fresh data
        const freshData = await fetchAllData();
        if (freshData) {
            cached = freshData;
        } else if (cached.data.length === 0) {
            return NextResponse.json({ success: false, message: 'Failed to fetch data' }, { status: 500 });
        }
    } else if (isStale) {
        // Stale-While-Revalidate: Return immediately, fetch in background
        fetchAllData().catch(console.error);
    }

    let subscribers = cached.data;
    
    // Filtering logic
    const filteredSubscribers = subscribers.filter((sub: any) => {
      // Search Term
      if (search) {
        const term = search.toLowerCase();
        if (!(sub.first_name && sub.first_name.toLowerCase().includes(term)) && !(sub.chat_id && sub.chat_id.includes(term))) {
          return false;
        }
      }
      
      // Time Filter
      if (timeFilter !== 'all' && sub.last_updated) {
          const nowD = new Date();
          const updated = new Date(sub.last_updated.replace(' ', 'T'));
          if (!isNaN(updated.getTime())) {
              const diffDays = Math.ceil(Math.abs(nowD.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24));
              if (timeFilter === 'daily' && diffDays > 1) return false;
              if (timeFilter === 'weekly' && diffDays > 7) return false;
              if (timeFilter === 'monthly' && diffDays > 30) return false;
          }
      }
      
      // Status Filter
      const qualS = ['Hot', 'Qualified', 'Meeting', 'Won'];
      const status = sub.crmData?.status || 'Cold';
      if (statusFilter !== 'all') {
          if (statusFilter === 'qualified' && !qualS.includes(status)) return false;
          if (statusFilter === 'not_qualified' && qualS.includes(status)) return false;
      }
      
      // Call Filter
      const calls = sub.crmData?.data?.calls || [];
      if (callFilter !== 'all') {
          if (callFilter === 'called' && calls.length === 0) return false;
          if (callFilter === 'not_called' && calls.length > 0) return false;
      }
      // Conversion Filter
      const conversion = sub.crmData?.data?.conversion_status || 'new';
      if (conversionFilter !== 'all' && conversionFilter !== conversion) return false;

      // Top Filter logic
      if (topFilter !== 'all') {
          if (topFilter === 'pending' && calls.length > 0) return false;
          if (topFilter === 'followups' && conversion !== 'followup') return false;
          if (topFilter === 'converted' && conversion !== 'converted') return false;
          if (topFilter === 'lost' && conversion !== 'lost') return false;
      }

      // Service Filter logic
      if (serviceFilter !== 'all') {
        const data = sub.crmData?.data || {};
        const sType = (data.service_type || '').toString().toLowerCase();
        const pType = (data.planning_type || '').toString().toLowerCase();
        const pref = (data.consultant_pref || '').toString().toLowerCase();

        let match = false;
        if (serviceFilter === 'consultation') match = sType.includes('consultation') || sType === '1' || pref.includes('consultation') || pref.includes('nikhil');
        else if (serviceFilter === 'team_consultation') match = (sType.includes('consultation') || sType === '1') && !pref.includes('nikhil');
        else if (serviceFilter === 'nikhil_consultation') match = pref.includes('nikhil');
        else if (serviceFilter === 'new_house') match = sType.includes('house') || sType === '2' || pType.includes('house') || pType.includes('interior');
        else if (serviceFilter === 'new_house_planning') match = pType.includes('house') || sType.includes('house') || sType === '2';
        else if (serviceFilter === 'interior_planning') match = pType.includes('interior');
        else if (serviceFilter === 'architecture') match = sType.includes('architecture') || sType === '3' || sType.includes('partner');
        
        if (!match) return false;
      }

      return true;
    });

    // Calculate Stats
    const serviceFilterFn = (s:any, category: string) => {
        const data = s.crmData?.data || {};
        const sType = (data.service_type || '').toString().toLowerCase();
        const pType = (data.planning_type || '').toString().toLowerCase();
        const pref = (data.consultant_pref || '').toString().toLowerCase();
        
        if (category === 'consultation') return sType.includes('consultation') || sType === '1' || pref.includes('consultation') || pref.includes('nikhil');
        if (category === 'team_consultation') return (sType.includes('consultation') || sType === '1') && !pref.includes('nikhil');
        if (category === 'nikhil_consultation') return pref.includes('nikhil');
        if (category === 'new_house') return sType.includes('house') || sType === '2' || pType.includes('house') || pType.includes('interior');
        if (category === 'new_house_planning') return pType.includes('house') || sType.includes('house') || sType === '2';
        if (category === 'interior_planning') return pType.includes('interior');
        if (category === 'architecture') return sType.includes('architecture') || sType === '3' || sType.includes('partner');
        return false;
    };

    const stats = {
        total: filteredSubscribers.length,
        pending: filteredSubscribers.filter((s:any) => !(s.crmData?.data?.calls || []).length).length,
        followups: filteredSubscribers.filter((s:any) => s.crmData?.data?.conversion_status === 'followup').length,
        converted: filteredSubscribers.filter((s:any) => s.crmData?.data?.conversion_status === 'converted').length,
        totalCollection: filteredSubscribers.filter((s:any) => s.crmData?.data?.conversion_status === 'converted').reduce((sum: number, s: any) => sum + (parseFloat(s.crmData?.data?.payment_amount) || 0), 0),
        lost: filteredSubscribers.filter((s:any) => s.crmData?.data?.conversion_status === 'lost').length,
        
        consultation: subscribers.filter((s:any) => serviceFilterFn(s, 'consultation')).length,
        team_consultation: subscribers.filter((s:any) => serviceFilterFn(s, 'team_consultation')).length,
        nikhil_consultation: subscribers.filter((s:any) => serviceFilterFn(s, 'nikhil_consultation')).length,
        new_house: subscribers.filter((s:any) => serviceFilterFn(s, 'new_house')).length,
        new_house_planning: subscribers.filter((s:any) => serviceFilterFn(s, 'new_house_planning')).length,
        interior_planning: subscribers.filter((s:any) => serviceFilterFn(s, 'interior_planning')).length,
        architecture: subscribers.filter((s:any) => serviceFilterFn(s, 'architecture')).length,
    };

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedSubscribers = filteredSubscribers.slice(startIndex, endIndex);

    return NextResponse.json({ 
      success: true, 
      subscribers: paginatedSubscribers,
      stats: stats,
      totalContacts: filteredSubscribers.length
    });
    
  } catch (error: any) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
