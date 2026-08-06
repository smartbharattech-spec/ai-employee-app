import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6 selection:bg-indigo-500/30">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none" />
      
      <main className="max-w-2xl w-full flex flex-col items-center text-center space-y-12 z-10">
        <div className="space-y-4">
          <div className="inline-block p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-4">
            <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            AI Sales Employee
          </h1>
          <p className="text-xl text-gray-400 max-w-lg mx-auto">
            Automate your WhatsApp sales pipeline with advanced AI. Login to manage your configuration.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-8">
          <Link 
            href="/login" 
            className="flex-1 sm:flex-none items-center justify-center px-8 py-4 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-indigo-500/25 transition-all duration-200 ease-in-out"
          >
            Sign In to Dashboard
          </Link>
          <Link 
            href="/register" 
            className="flex-1 sm:flex-none items-center justify-center px-8 py-4 text-base font-medium text-gray-300 bg-gray-900 border border-gray-700 rounded-xl hover:text-white hover:bg-gray-800 transition-all duration-200 ease-in-out"
          >
            Create Account
          </Link>
        </div>

        <div className="pt-16 border-t border-gray-800 w-full">
          <p className="text-sm text-gray-500">Secure access restricted to authorized personnel only.</p>
        </div>
      </main>
    </div>
  );
}
