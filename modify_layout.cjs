const fs = require('fs');
const path = require('path');

const layoutPath = path.join('C:', 'xampp', 'htdocs', 'ai-employee-app', 'src', 'app', 'dashboard', 'layout.tsx');
let content = fs.readFileSync(layoutPath, 'utf8');

// Replace state block
content = content.replace(
  /const \[isMobileMenuOpen, setIsMobileMenuOpen\] = useState\(false\);/,
  `const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(true);`
);

// Add toggle logic and design to sidebar
content = content.replace(
  /<aside className=\{\`fixed inset-y-0 left-0 z-50 w-64[\s\S]*?<\/aside>/,
  `<aside className={\`fixed inset-y-0 left-0 z-50 \${isDesktopMenuOpen ? 'w-64' : 'w-20'} bg-white shadow-[4px_0_24px_rgba(0,0,0,0.02)] border-r border-slate-100 transition-all duration-300 ease-in-out flex flex-col \${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}\`}>
        <div className="flex items-center justify-between h-20 px-6 border-b border-slate-100 bg-white">
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 flex-shrink-0 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            {isDesktopMenuOpen && <span className="font-extrabold text-lg text-slate-800 tracking-tight whitespace-nowrap">Kriti AI</span>}
          </Link>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-slate-400 hover:text-slate-700">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto hide-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard');
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={\`flex items-center \${isDesktopMenuOpen ? 'px-4' : 'justify-center'} py-3.5 rounded-2xl text-[14px] font-bold transition-all duration-200 group \${isActive ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'}\`}
                title={!isDesktopMenuOpen ? item.name : ''}
              >
                <div className={\`\${isDesktopMenuOpen ? 'mr-3' : ''} transition-transform group-hover:scale-110\`}>
                  {item.icon}
                </div>
                {isDesktopMenuOpen && <span className="whitespace-nowrap">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 flex flex-col gap-2 bg-slate-50/50">
          <div className={\`flex items-center \${isDesktopMenuOpen ? 'px-4' : 'justify-center'} py-3 rounded-2xl bg-white border border-slate-100 shadow-sm\`}>
             <div className="relative flex items-center justify-center">
               <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
               <div className="absolute w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
             </div>
             {isDesktopMenuOpen && <span className="ml-3 text-[12px] font-extrabold text-slate-600 tracking-wide uppercase whitespace-nowrap">Live Connected</span>}
          </div>
          
          <button 
            onClick={handleLogout}
            className={\`flex items-center \${isDesktopMenuOpen ? 'px-4' : 'justify-center'} py-3.5 text-[14px] font-bold text-slate-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-colors group\`}
            title={!isDesktopMenuOpen ? 'Sign Out' : ''}
          >
            <svg className={\`w-5 h-5 \${isDesktopMenuOpen ? 'mr-3' : ''} transition-transform group-hover:-translate-x-1\`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            {isDesktopMenuOpen && <span className="whitespace-nowrap">Sign Out</span>}
          </button>
        </div>

        {/* Desktop Toggle Button */}
        <button 
          onClick={() => setIsDesktopMenuOpen(!isDesktopMenuOpen)}
          className="hidden lg:flex absolute -right-3.5 top-24 w-7 h-7 bg-white border border-slate-200 rounded-full items-center justify-center text-slate-400 hover:text-emerald-500 hover:border-emerald-200 shadow-sm transition-colors z-50"
        >
          <svg className={\`w-4 h-4 transition-transform duration-300 \${isDesktopMenuOpen ? '' : 'rotate-180'}\`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
        </button>
      </aside>`
);

content = content.replace(/bg-\[#f0f2f5\]/g, 'bg-slate-50/50');

fs.writeFileSync(layoutPath, content);
console.log('Sidebar layout updated.');
