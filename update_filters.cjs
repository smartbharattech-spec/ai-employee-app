const fs = require('fs');
const path = 'src/app/dashboard/numbers/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add serviceFilter logic in filteredSubscribers
const topFilterLogic = `// Top Filter logic
    if (topFilter !== 'all') {
        if (topFilter === 'pending' && calls.length > 0) return false;
        if (topFilter === 'followups' && conversion !== 'followup') return false;
        if (topFilter === 'converted' && conversion !== 'converted') return false;
        if (topFilter === 'lost' && conversion !== 'lost') return false;
    }`;

const newServiceFilterLogic = `${topFilterLogic}

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
    }`;

content = content.replace(topFilterLogic, newServiceFilterLogic);

// 2. Replace UI for Service Grouping Cards
const uiTargetStr = `{/* Service Grouping Cards */}
      <h3 className="text-[14px] font-extrabold text-slate-800 uppercase tracking-wider mb-3 ml-2">Services Filter</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button onClick={() => setServiceFilter(serviceFilter === 'consultation' ? 'all' : 'consultation')} className={\`text-left p-5 rounded-3xl transition-all border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] \${serviceFilter === 'consultation' ? 'bg-indigo-600 text-white shadow-[0_8px_30px_rgba(79,70,229,0.3)] transform scale-[1.02]' : 'bg-white hover:bg-slate-50'}\`}>
          <div className="flex justify-between items-center mb-2">
            <h4 className={\`font-black text-lg \${serviceFilter === 'consultation' ? 'text-white' : 'text-slate-800'}\`}>Consultation</h4>
            <span className={\`text-xs font-bold px-3 py-1 rounded-full \${serviceFilter === 'consultation' ? 'bg-indigo-500/30 text-white' : 'bg-indigo-50 text-indigo-600'}\`}>{stats.consultation}</span>
          </div>
          <p className={\`text-xs font-semibold \${serviceFilter === 'consultation' ? 'text-indigo-200' : 'text-slate-400'}\`}>Team consultation, Nikhil sir consultation</p>
        </button>

        <button onClick={() => setServiceFilter(serviceFilter === 'new_house' ? 'all' : 'new_house')} className={\`text-left p-5 rounded-3xl transition-all border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] \${serviceFilter === 'new_house' ? 'bg-emerald-600 text-white shadow-[0_8px_30px_rgba(5,150,105,0.3)] transform scale-[1.02]' : 'bg-white hover:bg-slate-50'}\`}>
          <div className="flex justify-between items-center mb-2">
            <h4 className={\`font-black text-lg \${serviceFilter === 'new_house' ? 'text-white' : 'text-slate-800'}\`}>New House Planning</h4>
            <span className={\`text-xs font-bold px-3 py-1 rounded-full \${serviceFilter === 'new_house' ? 'bg-emerald-500/30 text-white' : 'bg-emerald-50 text-emerald-600'}\`}>{stats.new_house}</span>
          </div>
          <p className={\`text-xs font-semibold \${serviceFilter === 'new_house' ? 'text-emerald-200' : 'text-slate-400'}\`}>New house planning, interior planning</p>
        </button>

        <button onClick={() => setServiceFilter(serviceFilter === 'architecture' ? 'all' : 'architecture')} className={\`text-left p-5 rounded-3xl transition-all border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] \${serviceFilter === 'architecture' ? 'bg-rose-500 text-white shadow-[0_8px_30px_rgba(244,63,94,0.3)] transform scale-[1.02]' : 'bg-white hover:bg-slate-50'}\`}>
          <div className="flex justify-between items-center mb-2">
            <h4 className={\`font-black text-lg \${serviceFilter === 'architecture' ? 'text-white' : 'text-slate-800'}\`}>Architecture</h4>
            <span className={\`text-xs font-bold px-3 py-1 rounded-full \${serviceFilter === 'architecture' ? 'bg-rose-500/30 text-white' : 'bg-rose-50 text-rose-600'}\`}>{stats.architecture}</span>
          </div>
          <p className={\`text-xs font-semibold \${serviceFilter === 'architecture' ? 'text-rose-200' : 'text-slate-400'}\`}>Partner program</p>
        </button>
      </div>`;

const uiReplacement = `{/* Service Grouping Cards */}
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

content = content.replace(uiTargetStr, uiReplacement);

fs.writeFileSync(path, content);
console.log('Filters updated');
