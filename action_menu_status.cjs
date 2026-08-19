const fs = require('fs');
const path = require('path');

const pagePath = path.join('C:', 'xampp', 'htdocs', 'ai-employee-app', 'src', 'app', 'dashboard', 'numbers', 'page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

const targetStr = `<div className="absolute right-6 top-10 mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1 overflow-hidden opacity-0 invisible group-hover/action:opacity-100 group-hover/action:visible transition-all">`;

const replacement = `<div className="absolute right-6 top-10 mt-1 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1 overflow-hidden opacity-0 invisible group-hover/action:opacity-100 group-hover/action:visible transition-all">
                              <div className="px-3 py-2 border-b border-gray-100 bg-gray-50/50">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Change Status</span>
                                <div className="grid grid-cols-2 gap-1.5">
                                  <button onClick={(e) => { e.stopPropagation(); handleQuickStatusChange(sub.chat_id, 'new', sub.crmData); }} className={\`text-[10px] px-2 py-1.5 rounded font-medium transition-colors \${(sub.crmData?.data?.conversion_status || 'new') === 'new' ? 'bg-slate-200 text-slate-800' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}\`}>New Lead</button>
                                  <button onClick={(e) => { e.stopPropagation(); handleQuickStatusChange(sub.chat_id, 'followup', sub.crmData); }} className={\`text-[10px] px-2 py-1.5 rounded font-medium transition-colors \${sub.crmData?.data?.conversion_status === 'followup' ? 'bg-amber-200 text-amber-800' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'}\`}>Follow-up</button>
                                  <button onClick={(e) => { e.stopPropagation(); handleQuickStatusChange(sub.chat_id, 'converted', sub.crmData); }} className={\`text-[10px] px-2 py-1.5 rounded font-medium transition-colors \${sub.crmData?.data?.conversion_status === 'converted' ? 'bg-emerald-200 text-emerald-800' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}\`}>Converted</button>
                                  <button onClick={(e) => { e.stopPropagation(); handleQuickStatusChange(sub.chat_id, 'lost', sub.crmData); }} className={\`text-[10px] px-2 py-1.5 rounded font-medium transition-colors \${sub.crmData?.data?.conversion_status === 'lost' ? 'bg-red-200 text-red-800' : 'bg-red-50 text-red-600 hover:bg-red-100'}\`}>Lost</button>
                                </div>
                              </div>`;

content = content.replace(targetStr, replacement);
fs.writeFileSync(pagePath, content);
console.log('Added conversion status to action menu.');
