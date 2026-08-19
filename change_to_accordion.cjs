const fs = require('fs');
const path = 'src/app/dashboard/numbers/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `<div className="px-3 py-2 border-b border-gray-100 bg-gray-50/50">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Change Status</span>
                                <div className="flex flex-col gap-1">`;

const replacement = `<details className="group/details border-b border-gray-100 bg-gray-50/50 px-3 py-2">
                                <summary className="text-[11px] font-bold text-gray-500 uppercase tracking-wider cursor-pointer flex items-center justify-between list-none hover:text-gray-700 transition-colors">
                                  <span>Change Status</span>
                                  <svg className="w-3.5 h-3.5 text-gray-400 group-open/details:rotate-180 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                                </summary>
                                <div className="flex flex-col gap-1 mt-2">`;

content = content.replace(targetStr, replacement);
content = content.replace(
  `                                </div>\n                              </div>`,
  `                                </div>\n                              </details>`
);

// We should also add some CSS for the summary list-none to remove the default arrow if Tailwind doesn't do it perfectly on all browsers
// Tailwind's list-none on summary usually hides the default marker in Chrome/Firefox. But for webkit we might need ::-webkit-details-marker { display: none; }

fs.writeFileSync(path, content);
console.log('Accordion added');
