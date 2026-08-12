'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { name: 'Analytics & Trends', href: '/dashboard', icon: (
      <svg className="w-5 h-5 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
    )},
    { name: 'Numbers', href: '/dashboard/numbers', icon: (
      <svg className="w-5 h-5 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
    )},
    { name: 'Vastu Leads', href: '/dashboard/leads', icon: (
      <svg className="w-5 h-5 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
    )},
  ];

  const handleLogout = async () => {
    // Basic frontend logout (clear cookie client side or call an API if we had one)
    document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push('/');
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-gray-900 selection:bg-indigo-500/30">
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 ${isCollapsed ? 'w-20' : 'w-72'} bg-[#0f172a] border-r border-slate-800 transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-20 px-6 border-b border-slate-800 relative bg-[#0f172a]">
          <div className="flex items-center gap-3 w-full">
            <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 shrink-0 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <svg className="w-5 h-5 text-white shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 2.19.71 4.22 1.91 5.86L2.6 21.4l3.65-1.28A9.957 9.957 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm5.1 14.1c-.24.68-1.39 1.25-1.95 1.32-.52.06-1.19.16-3.41-.76-2.67-1.11-4.38-3.83-4.51-4.01-.13-.18-1.07-1.43-1.07-2.73 0-1.3.68-1.94.93-2.22.25-.28.55-.35.73-.35.18 0 .37 0 .52.01.17.01.39-.06.61.47.23.55.78 1.9.85 2.04.07.14.12.3.03.48-.09.18-.14.3-.28.46-.14.16-.3.35-.43.48-.15.15-.31.32-.14.61.17.3 1.3 2.14 2.97 3.63.81.72 1.55 1.05 1.85 1.19.3.15.48.12.66-.08.18-.2.78-.91.99-1.22.21-.31.41-.26.69-.15.28.1 1.76.83 2.06.98.3.15.5.22.58.35.07.13.07.76-.17 1.44z"/></svg>
              </div>
              {!isCollapsed && <span className="font-bold text-lg text-white tracking-tight whitespace-nowrap">WhatsApp CRM</span>}
            </Link>
            {!isCollapsed && (
              <button onClick={() => setIsCollapsed(true)} className="ml-auto hidden lg:flex items-center justify-center w-7 h-7 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
              </button>
            )}
            {isCollapsed && (
              <button onClick={() => setIsCollapsed(false)} className="absolute -right-3.5 top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center w-7 h-7 bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-full shadow-lg hover:shadow-emerald-500/20 hover:border-emerald-500/50 transition-all z-10">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
              </button>
            )}
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <nav className={`flex-1 ${isCollapsed ? 'px-3' : 'px-4'} py-6 space-y-2 overflow-y-auto bg-[#0f172a]`}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard');
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-4'} py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'}`}
                title={isCollapsed ? item.name : undefined}
              >
                <div className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors`}>
                  {item.icon}
                </div>
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-[#0f172a]">
          <button 
            onClick={handleLogout}
            className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-4'} w-full py-3.5 text-sm font-medium text-slate-400 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-colors group`}
            title={isCollapsed ? "Sign Out" : undefined}
          >
            <svg className={`w-5 h-5 shrink-0 ${!isCollapsed ? 'mr-3' : ''} text-slate-500 group-hover:text-red-400 transition-colors`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50">
        
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between h-16 px-4 border-b border-gray-200 bg-white/80 backdrop-blur-md">
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-600 hover:text-gray-900">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <span className="font-bold text-gray-900">WhatsApp CRM</span>
          <div className="w-6"></div> {/* Spacer for centering */}
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
