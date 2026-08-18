const fs = require('fs');
const path = require('path');

// 1. Update layout.tsx
const layoutPath = path.join('C:', 'xampp', 'htdocs', 'ai-employee-app', 'src', 'app', 'dashboard', 'layout.tsx');
let layoutContent = fs.readFileSync(layoutPath, 'utf8');

// Remove the Live Connected div from sidebar
layoutContent = layoutContent.replace(
  /<div className=\{\`flex items-center \$\{isDesktopMenuOpen \? 'px-4' : 'justify-center'\} py-3 rounded-2xl bg-white border border-slate-100 shadow-sm\`\}>[\s\S]*?<\/div>\s*<button/,
  `<button`
);
fs.writeFileSync(layoutPath, layoutContent);

// 2. Update page.tsx
const pagePath = path.join('C:', 'xampp', 'htdocs', 'ai-employee-app', 'src', 'app', 'dashboard', 'numbers', 'page.tsx');
let pageContent = fs.readFileSync(pagePath, 'utf8');

// Add state for top filter if it doesn't exist
if (!pageContent.includes('const [topFilter, setTopFilter] = useState(\'all\');')) {
    pageContent = pageContent.replace(
        /const \[serviceFilter, setServiceFilter\] = useState\('all'\);/,
        `const [serviceFilter, setServiceFilter] = useState('all');\n  const [topFilter, setTopFilter] = useState('all');`
    );
}

// Remove live connection indicator from page.tsx (Header area)
pageContent = pageContent.replace(
    /<div className="flex justify-end mb-2">[\s\S]*?<\/div>/,
    `<div className="flex justify-end mb-2"></div>`
);

// Update filter function to include top filter logic
if (!pageContent.includes('if (topFilter !== \'all\') {')) {
    pageContent = pageContent.replace(
        /if \(conversionFilter !== 'all' && conversionFilter !== conversion\) return false;/,
        `if (conversionFilter !== 'all' && conversionFilter !== conversion) return false;

    // Top Filter logic
    if (topFilter !== 'all') {
        if (topFilter === 'pending' && calls.length > 0) return false;
        if (topFilter === 'followups' && conversion !== 'followup') return false;
        if (topFilter === 'converted' && conversion !== 'converted') return false;
        if (topFilter === 'lost' && conversion !== 'lost') return false;
    }`
    );
}


// Make top cards clickable
pageContent = pageContent.replace(
  /<div className="bg-white shadow-\[0_4px_20px_rgba\(0,0,0,0\.03\)\] border-none p-5 rounded-3xl flex items-center gap-4">/g,
  `<button className="bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-none p-5 rounded-3xl flex items-center gap-4 text-left transition-all hover:scale-[1.02] active:scale-[0.98]">`
).replace(
  /<\/div>\s*<div><p className="text-\[12px\]/g,
  `</div>\n              <div><p className="text-[12px]`
).replace(
  /<\/p><\/div>\s*<\/div>/g,
  `</p></div>\n          </button>`
);

// Now specifically attach onClick events to the buttons
// We'll replace the generic buttons with specific onClick and dynamic styles

const topCardsBlockRegex = /\{\/\* Top Cards: 1 line metrics \*\/\}\s*<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">([\s\S]*?)\{\/\* Service Grouping Cards \*\/\}/;
const match = topCardsBlockRegex.exec(pageContent);

if (match) {
    const newTopCards = `
          <button onClick={() => setTopFilter(topFilter === 'pending' ? 'all' : 'pending')} className={\`shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-none p-5 rounded-3xl flex items-center gap-4 text-left transition-all hover:scale-[1.02] active:scale-[0.98] \${topFilter === 'pending' ? 'bg-blue-600 text-white shadow-[0_8px_30px_rgba(37,99,235,0.3)]' : 'bg-white'}\`}>
              <div className={\`w-12 h-12 rounded-2xl flex items-center justify-center font-bold \${topFilter === 'pending' ? 'bg-blue-500/30 text-white' : 'bg-blue-50 text-blue-500'}\`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              </div>
              <div><p className={\`text-[12px] font-extrabold uppercase tracking-wider mb-0.5 \${topFilter === 'pending' ? 'text-blue-200' : 'text-slate-400'}\`}>Pending Calls</p><p className={\`text-2xl font-black leading-none \${topFilter === 'pending' ? 'text-white' : 'text-slate-800'}\`}>{stats.pending}</p></div>
          </button>
          
          <button onClick={() => setTopFilter(topFilter === 'followups' ? 'all' : 'followups')} className={\`shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-none p-5 rounded-3xl flex items-center gap-4 text-left transition-all hover:scale-[1.02] active:scale-[0.98] \${topFilter === 'followups' ? 'bg-amber-500 text-white shadow-[0_8px_30px_rgba(245,158,11,0.3)]' : 'bg-white'}\`}>
              <div className={\`w-12 h-12 rounded-2xl flex items-center justify-center font-bold \${topFilter === 'followups' ? 'bg-amber-400/30 text-white' : 'bg-amber-50 text-amber-500'}\`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div><p className={\`text-[12px] font-extrabold uppercase tracking-wider mb-0.5 \${topFilter === 'followups' ? 'text-amber-100' : 'text-slate-400'}\`}>Followups</p><p className={\`text-2xl font-black leading-none \${topFilter === 'followups' ? 'text-white' : 'text-slate-800'}\`}>{stats.followups}</p></div>
          </button>
          
          <button onClick={() => setTopFilter(topFilter === 'converted' ? 'all' : 'converted')} className={\`shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-none p-5 rounded-3xl flex items-center gap-4 text-left transition-all hover:scale-[1.02] active:scale-[0.98] \${topFilter === 'converted' ? 'bg-emerald-500 text-white shadow-[0_8px_30px_rgba(16,185,129,0.3)]' : 'bg-white'}\`}>
              <div className={\`w-12 h-12 rounded-2xl flex items-center justify-center font-bold \${topFilter === 'converted' ? 'bg-emerald-400/30 text-white' : 'bg-emerald-50 text-emerald-500'}\`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div><p className={\`text-[12px] font-extrabold uppercase tracking-wider mb-0.5 \${topFilter === 'converted' ? 'text-emerald-100' : 'text-slate-400'}\`}>Converted</p><p className={\`text-2xl font-black leading-none \${topFilter === 'converted' ? 'text-white' : 'text-slate-800'}\`}>{stats.converted}</p></div>
          </button>
          
          <button onClick={() => setTopFilter(topFilter === 'lost' ? 'all' : 'lost')} className={\`shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-none p-5 rounded-3xl flex items-center gap-4 text-left transition-all hover:scale-[1.02] active:scale-[0.98] \${topFilter === 'lost' ? 'bg-red-500 text-white shadow-[0_8px_30px_rgba(239,68,68,0.3)]' : 'bg-white'}\`}>
              <div className={\`w-12 h-12 rounded-2xl flex items-center justify-center font-bold \${topFilter === 'lost' ? 'bg-red-400/30 text-white' : 'bg-red-50 text-red-500'}\`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div><p className={\`text-[12px] font-extrabold uppercase tracking-wider mb-0.5 \${topFilter === 'lost' ? 'text-red-100' : 'text-slate-400'}\`}>Lost</p><p className={\`text-2xl font-black leading-none \${topFilter === 'lost' ? 'text-white' : 'text-slate-800'}\`}>{stats.lost}</p></div>
          </button>
      </div>\n\n      `;
      
      pageContent = pageContent.replace(match[0], `{/* Top Cards: 1 line metrics */}\n      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">\n` + newTopCards + `{/* Service Grouping Cards */}`);
}

fs.writeFileSync(pagePath, pageContent);
console.log('UI tweaks successfully applied.');
