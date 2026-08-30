const fs = require('fs');
const file = 'c:/xampp/htdocs/myvastutool/ai salesman employee/src/app/dashboard/client-followup/page.tsx';

let content = fs.readFileSync(file, 'utf8');

// The block to replace starts at `return (` around line 569/570
// and ends at `                      {/* Mobile Expanded Row */}`

const startMarker = '{currentItems.map((sub: any, idx: number) => {';
const endMarker = '{/* Mobile Expanded Row */}';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    const replacement = `{currentItems.map((sub: any, idx: number) => {
                    const isTestNumber = sub.chat_id === '918707526283' || sub.chat_id === '917597571515';
                    return (
                      <React.Fragment key={idx}>
                        <tr className={\`transition-colors \${isTestNumber ? 'bg-yellow-50 hover:bg-yellow-100' : 'hover:bg-gray-50'}\`}>
                          <td className="px-6 py-4 hidden md:table-cell">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 flex flex-shrink-0 items-center justify-center text-emerald-600 border border-emerald-100">
                              {sub.first_name ? sub.first_name.charAt(0).toUpperCase() : '?'}
                            </div>
                            <div className="font-medium text-gray-900">{sub.first_name || 'Unknown User'}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-gray-700">
                          +{sub.chat_id}
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <div className="relative group/status w-full">
                            {(() => {
                              const curr = sub.crmData?.data?.conversion_status || 'new';
                              let badgeClass = "bg-slate-100 text-slate-600 border-slate-200";
                              let label = "New Lead";
                              if (curr === 'followup') { badgeClass = "bg-amber-50 text-amber-600 border-amber-200"; label = "Follow-up"; const fd = sub.crmData?.data?.next_followup_date; if (fd) { const d = new Date(fd); label = \`Follow-up \${d.toLocaleDateString('en-IN', {day:'numeric',month:'short'})}\`; } }
                              else if (curr === 'converted') { badgeClass = "bg-emerald-50 text-emerald-600 border-emerald-200"; label = "Converted"; const amt = sub.crmData?.data?.payment_amount; if (amt) label = \`Converted ₹\${parseFloat(amt).toLocaleString('en-IN')}\`; }
                              else if (curr === 'lost') { badgeClass = "bg-red-50 text-red-600 border-red-200"; label = "Lost"; }
                              
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
                                { value: 'followup', label: 'Follow-up' },
                                { value: 'converted', label: 'Converted' },
                                { value: 'lost', label: 'Lost' }
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
                        </td>

                        {/* Delivery Flow Column */}
                        {topFilter === 'converted' && (
                          <td className="px-6 py-4 hidden md:table-cell">
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Category</span>
                              <span className="text-sm font-bold text-slate-700">
                                {sub.crmData?.data?.service_category ? (
                                  sub.crmData?.data?.service_category === 'architecture' ? 'Architecture' :
                                  sub.crmData?.data?.service_category === 'new_house' ? 'New House Planning' :
                                  sub.crmData?.data?.service_category === 'new_house_planning' ? 'New House Planning' :
                                  sub.crmData?.data?.service_category === 'interior_planning' ? 'Interior Planning' :
                                  sub.crmData?.data?.service_category === 'team_consultation' ? 'Team Consultation' :
                                  sub.crmData?.data?.service_category === 'nikhil_consultation' ? 'Nikhil Consultation' :
                                  sub.crmData?.data?.service_category === 'consultation' ? 'Consultation' :
                                  'Assigned'
                                ) : 'Not Assigned'}
                              </span>
                              {sub.crmData?.data?.service_step !== undefined && (
                                <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded border border-emerald-100 w-max font-bold mt-0.5">
                                  Step {sub.crmData.data.service_step + 1}
                                </span>
                              )}
                            </div>
                          </td>
                        )}

                        <td className="px-6 py-4 max-w-[200px] md:max-w-xs hidden md:table-cell">
                          {editingNoteFor === sub.chat_id ? (
                            <div className="flex items-center gap-2">
                              <input 
                                type="text"
                                value={editNoteText}
                                onChange={(e) => setEditNoteText(e.target.value)}
                                className="w-full bg-white border border-emerald-300 rounded-md px-2 py-1 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                placeholder="Type note..."
                                autoFocus
                              />
                              <button onClick={() => saveNote(sub.chat_id)} className="text-green-400 hover:text-green-300">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                              </button>
                              <button onClick={() => setEditingNoteFor(null)} className="text-red-400 hover:text-red-300">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                              </button>
                            </div>
                          ) : (
                            <div 
                              className="text-gray-600 text-sm truncate cursor-pointer hover:text-emerald-600 transition-colors flex items-center gap-2 group"
                              onClick={() => {
                                setEditingNoteFor(sub.chat_id);
                                setEditNoteText(notes[sub.chat_id] || '');
                              }}
                            >
                              <span>{notes[sub.chat_id] || <em className="text-gray-400">Add note...</em>}</span>
                              <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </div>
                          )}
                        </td>

                        <td className={\`px-6 py-4 text-right hidden md:table-cell relative action-menu-container \${openDropdownId === sub.chat_id ? 'z-30' : 'hover:z-30'}\`}>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              const newId = openDropdownId === sub.chat_id ? null : sub.chat_id;
                              setOpenDropdownId(newId);
                              setOpenStatusMenuId(newId); // Make Change Status open by default
                            }}
                            className="p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                          </button>
                          
                          <div className={\`absolute right-6 top-full pt-2 w-56 z-20 transition-all \${openDropdownId === sub.chat_id ? 'opacity-100 visible' : 'opacity-0 invisible'}\`}>
                            <div className="bg-white border border-gray-200 rounded-xl shadow-lg py-1 overflow-hidden">
                              <div className="border-b border-gray-100">
                                <div 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenStatusMenuId(openStatusMenuId === sub.chat_id ? null : sub.chat_id);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors flex items-center cursor-pointer justify-between"
                                >
                                  <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                                    Change Status
                                  </div>
                                  <svg className={\`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 \${openStatusMenuId === sub.chat_id ? 'rotate-180' : ''}\`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                                <div className={\`flex-col gap-1 px-3 pb-2 bg-white \${openStatusMenuId === sub.chat_id ? 'flex' : 'hidden'}\`}>
                                  <button onClick={(e) => { e.stopPropagation(); handleQuickStatusChange(sub.chat_id, 'new', sub.crmData); setOpenDropdownId(null); setOpenStatusMenuId(null); }} className={\`w-full text-left text-[11px] px-3 py-2 rounded-md font-medium flex items-center justify-between transition-colors \${(sub.crmData?.data?.conversion_status || 'new') === 'new' ? 'bg-slate-200 text-slate-800' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}\`}>New Lead</button>
                                  <button onClick={(e) => { e.stopPropagation(); handleQuickStatusChange(sub.chat_id, 'followup', sub.crmData); setOpenDropdownId(null); setOpenStatusMenuId(null); }} className={\`w-full text-left text-[11px] px-3 py-2 rounded-md font-medium flex items-center justify-between transition-colors \${sub.crmData?.data?.conversion_status === 'followup' ? 'bg-amber-200 text-amber-800' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'}\`}>Follow-up</button>
                                  <button onClick={(e) => { e.stopPropagation(); handleQuickStatusChange(sub.chat_id, 'converted', sub.crmData); setOpenDropdownId(null); setOpenStatusMenuId(null); }} className={\`w-full text-left text-[11px] px-3 py-2 rounded-md font-medium flex items-center justify-between transition-colors \${sub.crmData?.data?.conversion_status === 'converted' ? 'bg-emerald-200 text-emerald-800' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}\`}>Converted</button>
                                  <button onClick={(e) => { e.stopPropagation(); handleQuickStatusChange(sub.chat_id, 'lost', sub.crmData); setOpenDropdownId(null); setOpenStatusMenuId(null); }} className={\`w-full text-left text-[11px] px-3 py-2 rounded-md font-medium flex items-center justify-between transition-colors \${sub.crmData?.data?.conversion_status === 'lost' ? 'bg-red-200 text-red-800' : 'bg-red-50 text-red-600 hover:bg-red-100'}\`}>Lost</button>
                                </div>
                              </div>
                              <button 
                                onClick={() => { 
                                  setSelectedDetails(sub); 
                                  setDetailsModalOpen(true); 
                                  setOpenDropdownId(null);
                                  setIsEditingModal(false);
                                  setEditFormData(sub.crmData?.data || {});
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors flex items-center"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                View Details
                              </button>
                              <button 
                                onClick={() => { openChat(sub); setOpenDropdownId(null); }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors flex items-center"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                View Chat
                              </button>
                              <button 
                                onClick={() => { wipeMemory(sub.chat_id); setOpenDropdownId(null); }}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                Clear Memory
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right md:hidden">
                          <button 
                            onClick={() => setExpandedRowId(expandedRowId === sub.chat_id ? null : sub.chat_id)}
                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                          </button>
                        </td>
                      </tr>
                      
                      \n`;
    
    content = content.substring(0, startIndex) + replacement + content.substring(endIndex);
    fs.writeFileSync(file, content, 'utf8');
    console.log("Successfully fixed the table body layout.");
} else {
    console.log("Could not find start or end marker.");
}
