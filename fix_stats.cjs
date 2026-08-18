const fs = require('fs');
const path = require('path');

const pagePath = path.join('C:', 'xampp', 'htdocs', 'ai-employee-app', 'src', 'app', 'dashboard', 'numbers', 'page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

const statsStart = content.indexOf('// Calculate Stats');
const statsEnd = content.indexOf('// Pagination Logic');

if (statsStart !== -1 && statsEnd !== -1) {
    const beforeStats = content.substring(0, statsStart);
    const afterStats = content.substring(statsEnd);
    
    const newStats = `// Calculate Stats
  const serviceFilterFn = (s:any, category: string) => {
      const data = s.crmData?.data || {};
      const sType = (data.service_type || '').toString().toLowerCase();
      const pType = (data.planning_type || '').toString().toLowerCase();
      const pref = (data.consultant_pref || '').toString().toLowerCase();
      
      if (category === 'consultation') return sType.includes('consultation') || sType === '1' || pref.includes('consultation') || pref.includes('nikhil');
      if (category === 'new_house') return sType.includes('house') || sType === '2' || pType.includes('house') || pType.includes('interior');
      if (category === 'architecture') return sType.includes('architecture') || sType === '3' || sType.includes('partner');
      return false;
  };

  const qualS = ['Hot', 'Qualified', 'Meeting', 'Won'];
  const stats = {
      total: filteredSubscribers.length,
      pending: filteredSubscribers.filter((s:any) => !(s.crmData?.data?.calls || []).length).length,
      followups: filteredSubscribers.filter((s:any) => s.crmData?.data?.conversion_status === 'followup').length,
      converted: filteredSubscribers.filter((s:any) => s.crmData?.data?.conversion_status === 'converted').length,
      lost: filteredSubscribers.filter((s:any) => s.crmData?.data?.conversion_status === 'lost').length,
      
      consultation: liveStatus.subscribers.filter((s:any) => serviceFilterFn(s, 'consultation')).length,
      new_house: liveStatus.subscribers.filter((s:any) => serviceFilterFn(s, 'new_house')).length,
      architecture: liveStatus.subscribers.filter((s:any) => serviceFilterFn(s, 'architecture')).length,
  };

  `;
    content = beforeStats + newStats + afterStats;
}

fs.writeFileSync(pagePath, content);
console.log('Stats updated successfully.');
