const fs = require('fs');
const path = 'src/app/dashboard/numbers/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const statsTarget = `// Calculate Stats
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
  };`;

const statsReplacement = `// Calculate Stats
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

  const qualS = ['Hot', 'Qualified', 'Meeting', 'Won'];
  const stats = {
      total: filteredSubscribers.length,
      pending: filteredSubscribers.filter((s:any) => !(s.crmData?.data?.calls || []).length).length,
      followups: filteredSubscribers.filter((s:any) => s.crmData?.data?.conversion_status === 'followup').length,
      converted: filteredSubscribers.filter((s:any) => s.crmData?.data?.conversion_status === 'converted').length,
      lost: filteredSubscribers.filter((s:any) => s.crmData?.data?.conversion_status === 'lost').length,
      
      consultation: liveStatus.subscribers.filter((s:any) => serviceFilterFn(s, 'consultation')).length,
      team_consultation: liveStatus.subscribers.filter((s:any) => serviceFilterFn(s, 'team_consultation')).length,
      nikhil_consultation: liveStatus.subscribers.filter((s:any) => serviceFilterFn(s, 'nikhil_consultation')).length,
      new_house: liveStatus.subscribers.filter((s:any) => serviceFilterFn(s, 'new_house')).length,
      new_house_planning: liveStatus.subscribers.filter((s:any) => serviceFilterFn(s, 'new_house_planning')).length,
      interior_planning: liveStatus.subscribers.filter((s:any) => serviceFilterFn(s, 'interior_planning')).length,
      architecture: liveStatus.subscribers.filter((s:any) => serviceFilterFn(s, 'architecture')).length,
  };`;

// UI change logic
const uiTargetStr = `{/* Service Grouping Cards */}
      <h3 className="text-[14px] font-extrabold text-slate-800 uppercase tracking-wider mb-3 ml-2">Services Filter</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className={\`p-5 rounded-3xl transition-all border shadow-[0_4px_20px_rgba(0,0,0,0.03)] \${['consultation', 'team_consultation', 'nikhil_consultation'].includes(serviceFilter) ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-transparent'}\`}>
          <button onClick={() => setServiceFilter(serviceFilter === 'consultation' ? 'all' : 'consultation')} className="w-full text-left flex justify-between items-center mb-3 group">
            <h4 className={\`font-black text-lg transition-colors group-hover:text-indigo-600 \${['consultation', 'team_consultation', 'nikhil_consultation'].includes(serviceFilter) ? 'text-indigo-700' : 'text-slate-800'}\`}>Consultation</h4>
            <span className={\`text-xs font-bold px-3 py-1 rounded-full \${['consultation', 'team_consultation', 'nikhil_consultation'].includes(serviceFilter) ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'}\`}>{stats.consultation}</span>
          </button>
          <div className="flex flex-wrap gap-2">
            <button onClick={(e) => { e.stopPropagation(); setServiceFilter(serviceFilter === 'team_consultation' ? 'all' : 'team_consultation'); }} className={\`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors \${serviceFilter === 'team_consultation' ? 'bg-indigo-600 text-white shadow-md' : 'bg-indigo-100/50 text-indigo-600 hover:bg-indigo-100'}\`}>Team Consultation</button>
            <button onClick={(e) => { e.stopPropagation(); setServiceFilter(serviceFilter === 'nikhil_consultation' ? 'all' : 'nikhil_consultation'); }} className={\`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors \${serviceFilter === 'nikhil_consultation' ? 'bg-indigo-600 text-white shadow-md' : 'bg-indigo-100/50 text-indigo-600 hover:bg-indigo-100'}\`}>Nikhil Sir</button>
          </div>
        </div>

        <div className={\`p-5 rounded-3xl transition-all border shadow-[0_4px_20px_rgba(0,0,0,0.03)] \${['new_house', 'new_house_planning', 'interior_planning'].includes(serviceFilter) ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-transparent'}\`}>
          <button onClick={() => setServiceFilter(serviceFilter === 'new_house' ? 'all' : 'new_house')} className="w-full text-left flex justify-between items-center mb-3 group">
            <h4 className={\`font-black text-lg transition-colors group-hover:text-emerald-600 \${['new_house', 'new_house_planning', 'interior_planning'].includes(serviceFilter) ? 'text-emerald-700' : 'text-slate-800'}\`}>New House Planning</h4>
            <span className={\`text-xs font-bold px-3 py-1 rounded-full \${['new_house', 'new_house_planning', 'interior_planning'].includes(serviceFilter) ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-600'}\`}>{stats.new_house}</span>
          </button>
          <div className="flex flex-wrap gap-2">
            <button onClick={(e) => { e.stopPropagation(); setServiceFilter(serviceFilter === 'new_house_planning' ? 'all' : 'new_house_planning'); }} className={\`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors \${serviceFilter === 'new_house_planning' ? 'bg-emerald-600 text-white shadow-md' : 'bg-emerald-100/50 text-emerald-600 hover:bg-emerald-100'}\`}>New house</button>
            <button onClick={(e) => { e.stopPropagation(); setServiceFilter(serviceFilter === 'interior_planning' ? 'all' : 'interior_planning'); }} className={\`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors \${serviceFilter === 'interior_planning' ? 'bg-emerald-600 text-white shadow-md' : 'bg-emerald-100/50 text-emerald-600 hover:bg-emerald-100'}\`}>Interior planning</button>
          </div>
        </div>

        <div className={\`p-5 rounded-3xl transition-all border shadow-[0_4px_20px_rgba(0,0,0,0.03)] \${serviceFilter === 'architecture' ? 'bg-rose-50 border-rose-200' : 'bg-white border-transparent'}\`}>
          <button onClick={() => setServiceFilter(serviceFilter === 'architecture' ? 'all' : 'architecture')} className="w-full text-left flex justify-between items-center mb-3 group">
            <h4 className={\`font-black text-lg transition-colors group-hover:text-rose-600 \${serviceFilter === 'architecture' ? 'text-rose-700' : 'text-slate-800'}\`}>Architecture</h4>
            <span className={\`text-xs font-bold px-3 py-1 rounded-full \${serviceFilter === 'architecture' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-600'}\`}>{stats.architecture}</span>
          </button>
          <div className="flex flex-wrap gap-2">
            <button onClick={(e) => { e.stopPropagation(); setServiceFilter(serviceFilter === 'architecture' ? 'all' : 'architecture'); }} className={\`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors \${serviceFilter === 'architecture' ? 'bg-rose-600 text-white shadow-md' : 'bg-rose-100/50 text-rose-600 hover:bg-rose-100'}\`}>Partner program</button>
          </div>
        </div>
      </div>`;

const uiReplacement = `{/* Service Grouping Cards */}
      <h3 className="text-[14px] font-extrabold text-slate-800 uppercase tracking-wider mb-3 ml-2">Services Filter</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className={\`p-5 rounded-3xl transition-all border shadow-[0_4px_20px_rgba(0,0,0,0.03)] \${['consultation', 'team_consultation', 'nikhil_consultation'].includes(serviceFilter) ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-transparent'}\`}>
          <button onClick={() => setServiceFilter(serviceFilter === 'consultation' ? 'all' : 'consultation')} className="w-full text-left flex justify-between items-center mb-3 group">
            <h4 className={\`font-black text-lg transition-colors group-hover:text-indigo-600 \${['consultation', 'team_consultation', 'nikhil_consultation'].includes(serviceFilter) ? 'text-indigo-700' : 'text-slate-800'}\`}>Consultation</h4>
          </button>
          <div className="flex flex-wrap gap-2">
            <button onClick={(e) => { e.stopPropagation(); setServiceFilter(serviceFilter === 'team_consultation' ? 'all' : 'team_consultation'); }} className={\`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors \${serviceFilter === 'team_consultation' ? 'bg-indigo-600 text-white shadow-md' : 'bg-indigo-100/50 text-indigo-600 hover:bg-indigo-100'}\`}>Team Consultation ({stats.team_consultation})</button>
            <button onClick={(e) => { e.stopPropagation(); setServiceFilter(serviceFilter === 'nikhil_consultation' ? 'all' : 'nikhil_consultation'); }} className={\`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors \${serviceFilter === 'nikhil_consultation' ? 'bg-indigo-600 text-white shadow-md' : 'bg-indigo-100/50 text-indigo-600 hover:bg-indigo-100'}\`}>Nikhil Sir ({stats.nikhil_consultation})</button>
          </div>
        </div>

        <div className={\`p-5 rounded-3xl transition-all border shadow-[0_4px_20px_rgba(0,0,0,0.03)] \${['new_house', 'new_house_planning', 'interior_planning'].includes(serviceFilter) ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-transparent'}\`}>
          <button onClick={() => setServiceFilter(serviceFilter === 'new_house' ? 'all' : 'new_house')} className="w-full text-left flex justify-between items-center mb-3 group">
            <h4 className={\`font-black text-lg transition-colors group-hover:text-emerald-600 \${['new_house', 'new_house_planning', 'interior_planning'].includes(serviceFilter) ? 'text-emerald-700' : 'text-slate-800'}\`}>New House Planning</h4>
          </button>
          <div className="flex flex-wrap gap-2">
            <button onClick={(e) => { e.stopPropagation(); setServiceFilter(serviceFilter === 'new_house_planning' ? 'all' : 'new_house_planning'); }} className={\`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors \${serviceFilter === 'new_house_planning' ? 'bg-emerald-600 text-white shadow-md' : 'bg-emerald-100/50 text-emerald-600 hover:bg-emerald-100'}\`}>New house ({stats.new_house_planning})</button>
            <button onClick={(e) => { e.stopPropagation(); setServiceFilter(serviceFilter === 'interior_planning' ? 'all' : 'interior_planning'); }} className={\`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors \${serviceFilter === 'interior_planning' ? 'bg-emerald-600 text-white shadow-md' : 'bg-emerald-100/50 text-emerald-600 hover:bg-emerald-100'}\`}>Interior planning ({stats.interior_planning})</button>
          </div>
        </div>

        <div className={\`p-5 rounded-3xl transition-all border shadow-[0_4px_20px_rgba(0,0,0,0.03)] \${serviceFilter === 'architecture' ? 'bg-rose-50 border-rose-200' : 'bg-white border-transparent'}\`}>
          <button onClick={() => setServiceFilter(serviceFilter === 'architecture' ? 'all' : 'architecture')} className="w-full text-left flex justify-between items-center mb-3 group">
            <h4 className={\`font-black text-lg transition-colors group-hover:text-rose-600 \${serviceFilter === 'architecture' ? 'text-rose-700' : 'text-slate-800'}\`}>Architecture</h4>
          </button>
          <div className="flex flex-wrap gap-2">
            <button onClick={(e) => { e.stopPropagation(); setServiceFilter(serviceFilter === 'architecture' ? 'all' : 'architecture'); }} className={\`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors \${serviceFilter === 'architecture' ? 'bg-rose-600 text-white shadow-md' : 'bg-rose-100/50 text-rose-600 hover:bg-rose-100'}\`}>Partner program ({stats.architecture})</button>
          </div>
        </div>
      </div>`;

content = content.replace(statsTarget, statsReplacement);
content = content.replace(uiTargetStr, uiReplacement);
fs.writeFileSync(path, content);
console.log('UI and Stats Logic Updated successfully');
