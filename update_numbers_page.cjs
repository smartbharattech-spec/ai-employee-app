const fs = require('fs');
const path = require('path');

const pagePath = path.join('C:', 'xampp', 'htdocs', 'ai-employee-app', 'src', 'app', 'dashboard', 'numbers', 'page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

// Update Status/Metrics calculation logic
content = content.replace(
  /const qualS = \['Hot', 'Qualified', 'Meeting', 'Won'\];\n  const stats = \{\n      total: filteredSubscribers.length,\n      qualified: filteredSubscribers.filter\(\(s:any\) => qualS.includes\(s.crmData\?.status \|\| 'Cold'\)\).length,\n      called: filteredSubscribers.filter\(\(s:any\) => \(s.crmData\?.data\?.calls \|\| \[\]\).length > 0\).length,\n      paid: filteredSubscribers.filter\(\(s:any\) => \(s.crmData\?.data\?.payment_status\) === 'paid'\).length,\n      converted: filteredSubscribers.filter\(\(s:any\) => \(s.crmData\?.data\?.conversion_status\) === 'converted'\).length,\n  \};/,
  `// Categorization logic
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
      
      consultation: liveStatus.subscribers.filter(s => serviceFilterFn(s, 'consultation')).length,
      new_house: liveStatus.subscribers.filter(s => serviceFilterFn(s, 'new_house')).length,
      architecture: liveStatus.subscribers.filter(s => serviceFilterFn(s, 'architecture')).length,
  };`
);

// Add service filter state
if(!content.includes('const [serviceFilter, setServiceFilter] = useState(\'all\');')) {
    content = content.replace(
        /const \[conversionFilter, setConversionFilter\] = useState\('all'\);/,
        `const [conversionFilter, setConversionFilter] = useState('all');\n  const [serviceFilter, setServiceFilter] = useState('all');`
    );
}

// Update filter function to include service filter
content = content.replace(
    /if \(conversionFilter !== 'all' && conversionFilter !== conversion\) return false;\n\n    return true;/,
    `if (conversionFilter !== 'all' && conversionFilter !== conversion) return false;\n\n    if (serviceFilter !== 'all' && !serviceFilterFn(sub, serviceFilter)) return false;\n\n    return true;`
);

// Replace header and stats UI
content = content.replace(
  /\{\/\* Header \*\/\}\s*<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">[\s\S]*?\{\/\* Filters \*\/\}/,
  `{/* Header Section Removed as per request */}
      
      <div className="flex justify-end mb-2">
        {/* Status Badge */}
        {liveStatus.loading ? (
          <span className="flex items-center text-slate-400 text-sm bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Syncing Data...
          </span>
        ) : liveStatus.connected ? (
          <span className="flex items-center px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 text-[13px] font-bold border border-emerald-100 shadow-[0_4px_12px_rgba(16,185,129,0.1)]">
            <span className="relative flex h-2.5 w-2.5 mr-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            Live Connection Active
          </span>
        ) : null}
      </div>

      <div className={\`transition-all duration-300 \${isChatOpen ? 'md:pr-[400px]' : ''}\`}>
      
      {/* Top Cards: 1 line metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-none p-5 rounded-3xl flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center font-bold">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              </div>
              <div><p className="text-[12px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">Pending Calls</p><p className="text-2xl font-black text-slate-800 leading-none">{stats.pending}</p></div>
          </div>
          <div className="bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-none p-5 rounded-3xl flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center font-bold">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div><p className="text-[12px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">Followups</p><p className="text-2xl font-black text-slate-800 leading-none">{stats.followups}</p></div>
          </div>
          <div className="bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-none p-5 rounded-3xl flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center font-bold">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div><p className="text-[12px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">Converted</p><p className="text-2xl font-black text-slate-800 leading-none">{stats.converted}</p></div>
          </div>
          <div className="bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-none p-5 rounded-3xl flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center font-bold">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div><p className="text-[12px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">Lost</p><p className="text-2xl font-black text-slate-800 leading-none">{stats.lost}</p></div>
          </div>
      </div>

      {/* Service Grouping Cards */}
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
      </div>

      {/* Filters */}`
);

// Update Modal Conversion Section (Replace Payment Status radio with Amount, add follow-up details)
content = content.replace(
  /\{\/\* Payment & Conversion Status \*\/\s*\n\s*<div className="bg-white rounded-2xl shadow-\[0_4px_20px_rgba\(0,0,0,0\.04\)\] p-6">[\s\S]*?<\/div>\s*<\/div>/,
  `{/* Conversion & Followup Status */}
              <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-6">
                <h4 className="text-[13px] font-extrabold text-slate-600 mb-6 uppercase tracking-wider">Conversion & Follow-up</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                  <div>
                    <h5 className="text-[13px] font-extrabold text-slate-600 mb-4 tracking-wider">Conversion Status</h5>
                    <div className="flex flex-col gap-4">
                      {[
                        { value: 'new', label: 'New Lead' },
                        { value: 'followup', label: 'Follow-up 🔄' },
                        { value: 'converted', label: 'Converted ✅' },
                        { value: 'lost', label: 'Lost ❌' }
                      ].map(opt => (
                        <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative flex items-center justify-center">
                            <input type="radio" name="conversion_status" className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-full checked:border-orange-500 transition-colors cursor-pointer" checked={(editFormData.conversion_status || 'new') === opt.value} onChange={() => setEditFormData({...editFormData, conversion_status: opt.value})} />
                            <div className="absolute w-2.5 h-2.5 bg-orange-500 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
                          </div>
                          <span className="text-[14px] font-semibold text-slate-900 group-hover:text-orange-500 transition-colors">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-[13px] font-extrabold text-slate-600 mb-4 tracking-wider">Amount Details (if converted)</h5>
                    <div className="relative">
                       <span className="absolute left-4 top-2.5 text-slate-400 font-bold">₹</span>
                       <input type="number" placeholder="Enter Amount" value={editFormData.payment_amount || ''} onChange={(e) => setEditFormData({...editFormData, payment_amount: e.target.value})} className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm w-full focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-700" />
                    </div>
                  </div>
                </div>

                {editFormData.conversion_status === 'followup' && (
                  <div className="mt-6 border-t border-slate-100 pt-6 animate-in fade-in slide-in-from-top-2">
                     <h5 className="text-[13px] font-extrabold text-slate-600 mb-4 tracking-wider text-orange-500 flex items-center gap-2">
                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                       Schedule Next Follow-up
                     </h5>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                       <div className="flex flex-col gap-1.5">
                         <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Date</label>
                         <input type="date" value={editFormData.next_followup_date || ''} onChange={(e) => setEditFormData({...editFormData, next_followup_date: e.target.value})} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 focus:bg-white font-semibold text-slate-700" />
                       </div>
                       <div className="flex flex-col gap-1.5">
                         <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Time</label>
                         <input type="time" value={editFormData.next_followup_time || ''} onChange={(e) => setEditFormData({...editFormData, next_followup_time: e.target.value})} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 focus:bg-white font-semibold text-slate-700" />
                       </div>
                     </div>
                     <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Topic / Notes (Kya baat karni hai?)</label>
                        <textarea placeholder="Write exactly what needs to be discussed..." value={editFormData.next_followup_note || ''} onChange={(e) => setEditFormData({...editFormData, next_followup_note: e.target.value})} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm w-full focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-medium text-slate-700" rows={2} />
                     </div>
                  </div>
                )}
                
                {editFormData.conversion_status !== 'followup' && (
                  <div className="mt-4">
                    <textarea placeholder="General Notes" value={editFormData.notes || ''} onChange={(e) => setEditFormData({...editFormData, notes: e.target.value})} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm w-full focus:outline-none focus:border-blue-500 focus:bg-white" rows={2} />
                  </div>
                )}
              </div>

            </div>`
);

// We need to completely remove the old Filters block because we replaced it.
// The code ` {/* Filters */}` was left above. Let's find and remove it.
content = content.replace(
    /\{\/\* Filters \*\/\}\s*<div className="bg-white border border-gray-200 p-4 rounded-2xl mb-6 flex flex-wrap gap-4 items-center shadow-sm">[\s\S]*?<\/div>/,
    ''
);


fs.writeFileSync(pagePath, content);
console.log('Numbers page updated.');
