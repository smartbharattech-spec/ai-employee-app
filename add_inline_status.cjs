const fs = require('fs');
const path = require('path');

const pagePath = path.join('C:', 'xampp', 'htdocs', 'ai-employee-app', 'src', 'app', 'dashboard', 'numbers', 'page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

// 1. Add Status Column Header
content = content.replace(
  /<th className="px-6 py-4 hidden md:table-cell">Notes<\/th>/,
  `<th className="px-6 py-4 hidden md:table-cell">Status</th>\n                    <th className="px-6 py-4 hidden md:table-cell">Notes</th>`
);

// 2. We need a function to quickly save CRM conversion status
if (!content.includes('const handleQuickStatusChange')) {
  content = content.replace(
    /const handleSaveCRM = async \(\) => \{/,
    `const handleQuickStatusChange = async (chat_id: string, newStatus: string, existingCrmData: any) => {
    try {
      const updatedData = { ...(existingCrmData?.data || {}), conversion_status: newStatus };
      const res = await fetch('/api/crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: chat_id, data: updatedData })
      });
      const data = await res.json();
      if (data.success) {
        // Update local state without refreshing
        setLiveStatus(prev => ({
          ...prev,
          subscribers: prev.subscribers.map(s => {
            if (s.chat_id === chat_id) {
              return { ...s, crmData: { ...s.crmData, data: updatedData } };
            }
            return s;
          })
        }));
      } else {
        alert('Failed to update status: ' + data.message);
      }
    } catch (err) {
      alert('Error updating status');
    }
  };

  const handleSaveCRM = async () => {`
  );
}

// 3. Add Status Column Cell in the row loop
// The row loop starts with `<tr key={sub.chat_id}` ... `<td ...> Contact </td> <td ...> Phone </td> <td ...> Notes </td>`
// I need to insert it before the Notes <td>. Let's search for `<td className="px-6 py-4 max-w-[200px] md:max-w-xs hidden md:table-cell">` which is Notes.
const notesTdRegex = /(<td className="px-6 py-4 max-w-\[200px\] md:max-w-xs hidden md:table-cell">[\s\S]*?\{\/\* View Details Modal \*\/\})/;
// Actually, it's better to just search for `+{sub.chat_id}` which is the phone number cell, and insert the Status cell right after it.
content = content.replace(
  /(<td className="px-6 py-4 font-mono text-gray-700">\s*\+\{sub\.chat_id\}\s*<\/td>)/,
  `$1
                        <td className="px-6 py-4 hidden md:table-cell">
                          <div className="relative group/status w-full">
                            {(() => {
                              const curr = sub.crmData?.data?.conversion_status || 'new';
                              let badgeClass = "bg-slate-100 text-slate-600 border-slate-200";
                              let label = "New Lead";
                              if (curr === 'followup') { badgeClass = "bg-amber-50 text-amber-600 border-amber-200"; label = "Follow-up 🔄"; }
                              else if (curr === 'converted') { badgeClass = "bg-emerald-50 text-emerald-600 border-emerald-200"; label = "Converted ✅"; }
                              else if (curr === 'lost') { badgeClass = "bg-red-50 text-red-600 border-red-200"; label = "Lost ❌"; }
                              
                              return (
                                <div className={\`inline-flex items-center justify-between w-32 px-3 py-1.5 rounded-lg border text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-colors \${badgeClass}\`}>
                                  {label}
                                  <svg className="w-3 h-3 opacity-0 group-hover/status:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                              );
                            })()}
                            
                            {/* Dropdown Menu on Hover */}
                            <div className="absolute left-0 top-full mt-1 w-36 bg-white border border-gray-100 rounded-xl shadow-lg opacity-0 invisible group-hover/status:opacity-100 group-hover/status:visible transition-all z-20 overflow-hidden flex flex-col p-1">
                              {[
                                { value: 'new', label: 'New Lead' },
                                { value: 'followup', label: 'Follow-up 🔄' },
                                { value: 'converted', label: 'Converted ✅' },
                                { value: 'lost', label: 'Lost ❌' }
                              ].map(opt => (
                                <button
                                  key={opt.value}
                                  onClick={(e) => { e.stopPropagation(); handleQuickStatusChange(sub.chat_id, opt.value, sub.crmData); }}
                                  className={\`text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-colors \${(sub.crmData?.data?.conversion_status || 'new') === opt.value ? 'bg-slate-50 text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}\`}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </td>`
);

fs.writeFileSync(pagePath, content);
console.log('Added inline status editing feature.');
