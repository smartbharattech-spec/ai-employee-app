import Link from 'next/link';

export default function DashboardHome() {
  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard Overview</h1>
        <p className="mt-2 text-gray-600">Welcome to your AI Sales Employee command center.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Links Card */}
        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:border-teal-300 transition-colors">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <svg className="w-6 h-6 mr-3 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              Manage Contacts
            </h2>
          </div>
          <p className="text-gray-400 mb-8">View all your WhatsApp leads, check active conversations, and manage unseen messages.</p>
          <div className="flex gap-4">
            <Link href="/dashboard/numbers" className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all shadow-[0_0_15px_rgba(79,70,229,0.2)]">
              Open Numbers
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
            <Link href="/dashboard/pipeline" className="inline-flex items-center px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl transition-all shadow-[0_0_15px_rgba(20,184,166,0.2)]">
              Visual Pipeline
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
