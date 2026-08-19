const fs = require('fs');
const path = require('path');

const pagePath = path.join('C:', 'xampp', 'htdocs', 'ai-employee-app', 'src', 'app', 'dashboard', 'numbers', 'page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

const targetRegex = /<details className="group\/details border-b border-gray-100 bg-gray-50\/50 px-3 py-2">[\s\S]*?<summary className="text-\[11px\] font-bold text-gray-500 uppercase tracking-wider cursor-pointer flex items-center justify-between list-none hover:text-gray-700 \[\&::-webkit-details-marker\]:hidden">[\s\S]*?<span>Change Status<\/span>[\s\S]*?<svg[\s\S]*?<\/svg>[\s\S]*?<\/summary>[\s\S]*?<div className="flex flex-col gap-1 mt-2">([\s\S]*?)<\/div>\s*<\/details>/;

const replacement = `<div className="group/status border-b border-gray-100">
                                <div className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors flex items-center cursor-pointer justify-between">
                                  <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                                    Change Status
                                  </div>
                                  <svg className="w-3.5 h-3.5 text-gray-400 group-hover/status:rotate-180 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                                <div className="hidden group-hover/status:flex flex-col gap-1 px-3 pb-2 bg-white">
                                  $1
                                </div>
                              </div>`;

content = content.replace(targetRegex, replacement);

fs.writeFileSync(pagePath, content);
console.log('Updated Change Status to match other tabs and open on hover');
