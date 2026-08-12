'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Numbers', href: '/dashboard/numbers', icon: (
      <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
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
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-xl border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 2.19.71 4.22 1.91 5.86L2.6 21.4l3.65-1.28A9.957 9.957 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm5.1 14.1c-.24.68-1.39 1.25-1.95 1.32-.52.06-1.19.16-3.41-.76-2.67-1.11-4.38-3.83-4.51-4.01-.13-.18-1.07-1.43-1.07-2.73 0-1.3.68-1.94.93-2.22.25-.28.55-.35.73-.35.18 0 .37 0 .52.01.17.01.39-.06.61.47.23.55.78 1.9.85 2.04.07.14.12.3.03.48-.09.18-.14.3-.28.46-.14.16-.3.35-.43.48-.15.15-.31.32-.14.61.17.3 1.3 2.14 2.97 3.63.81.72 1.55 1.05 1.85 1.19.3.15.48.12.66-.08.18-.2.78-.91.99-1.22.21-.31.41-.26.69-.15.28.1 1.76.83 2.06.98.3.15.5.22.58.35.07.13.07.76-.17 1.44z"/></svg>
            </div>
            <span className="font-bold text-lg text-gray-900 tracking-tight">WhatsApp CRM</span>
          </Link>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-900">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard');
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-green-50 text-green-700 shadow-[inset_4px_0_0_0_#16a34a]' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sign Out
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
