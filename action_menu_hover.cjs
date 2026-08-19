const fs = require('fs');
const path = require('path');

const pagePath = path.join('C:', 'xampp', 'htdocs', 'ai-employee-app', 'src', 'app', 'dashboard', 'numbers', 'page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

// Replace the action menu logic with hover-based CSS classes
const targetBlockRegex = /<td className="px-6 py-4 text-right hidden md:table-cell relative">[\s\S]*?<td className="px-6 py-4 text-right md:hidden">/;

const newBlock = `<td className="px-6 py-4 text-right hidden md:table-cell relative group/action">
                          <button 
                            className="p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                          </button>
                          
                          <div className="absolute right-6 top-10 mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1 overflow-hidden opacity-0 invisible group-hover/action:opacity-100 group-hover/action:visible transition-all">
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
                        </td>
                        <td className="px-6 py-4 text-right md:hidden">`;

content = content.replace(targetBlockRegex, newBlock);

fs.writeFileSync(pagePath, content);
console.log('Action menu updated to open on hover.');
