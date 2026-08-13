'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'planning' | 'issue' | 'astrology' | 'learn'>('planning');

  const demoChats = {
    planning: [
      { sender: 'bot', text: 'Hello ji! 👋 Kriti here, from Vastu With Nikhil! ✨\nAapko kis cheez me interest hai?\n1. Ghar/Office Vastu Issue\n2. Naya ghar bana raha hoon — planning chahiye\n3. Astrology / Numerology\n4. Vastu seekhna chahta hoon' },
      { sender: 'user', text: '2. Naya ghar bana raha hoon' },
      { sender: 'bot', text: 'Got it! ✨ Plot/ghar ka size kitna hai (sq. ft. mein)?' },
      { sender: 'user', text: '1800 sq ft' },
      { sender: 'bot', text: 'Noted! Ghar mein kitne floors honge? (1. Ground, 2. G+1, 3. G+2, 4. More)' },
      { sender: 'user', text: '2. G+1' },
      { sender: 'bot', text: 'Awesome! Construction kab se start karwana hai?\n1. Immediately (1-2 weeks)\n2. 1-2 months\n3. Sirf planning chal rahi hai' },
      { sender: 'user', text: '1. Immediately' },
      { sender: 'bot', text: 'Zaroor! Aapke plot ke according best customized Vastu layout & consultation book karne ke liye yahan click karein: 🚀\n👉 thesanatangurukul.com/team-consultation' }
    ],
    issue: [
      { sender: 'bot', text: 'Hello ji! 👋 Ghar/Office ka Vastu issue solve karwana hai ya new property check karni hai?' },
      { sender: 'user', text: 'Ghar me kitchen North-East me hai, bahut health issues ho rahe hain.' },
      { sender: 'bot', text: 'Samajh sakti hoon! North-East (Ishanya) me kitchen hone se Agni aur Jal tatva me imbalance aa jata hai. Kya aapke paas ghar ka 2D Floor Plan ready hai?' },
      { sender: 'user', text: 'Haan ready hai.' },
      { sender: 'bot', text: 'Perfect! Hamare Senior Vastu Expert se 1-on-1 energy balancing session book karne ke liye slot choose karein:\n👉 calendly.com/vwnmanagement/30min' }
    ],
    astrology: [
      { sender: 'bot', text: 'Namaste! Astrology ya Kundali matching se related konsa consultation chahiye aapko?' },
      { sender: 'user', text: 'Career growth aur Mahadasha check karwani hai.' },
      { sender: 'bot', text: 'Got it! Aapka Date of Birth, Birth Time aur Birth City share kar dijiye, team aapka personalized chart analyze karegi. ✨' }
    ],
    learn: [
      { sender: 'bot', text: 'Great! Kya aap Professional Vedic Vastu course seekhna chahte hain ya Basic Foundations?' },
      { sender: 'user', text: 'Complete Professional Master Course.' },
      { sender: 'bot', text: 'Superb choice! Hamara upcoming Masterclass batch next Sunday start ho raha hai. Syllabus aur free demo class link yahan se dekhiye: 🎓\n👉 thesanatangurukul.com/vastu-course' }
    ]
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      
      {/* Background Decorative Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-emerald-500/15 via-teal-500/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-1/3 -left-48 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed top-2/3 -right-48 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* 1. Header / Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#090d16]/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all duration-300">
              <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 2.19.71 4.22 1.91 5.86L2.6 21.4l3.65-1.28A9.957 9.957 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm5.1 14.1c-.24.68-1.39 1.25-1.95 1.32-.52.06-1.19.16-3.41-.76-2.67-1.11-4.38-3.83-4.51-4.01-.13-.18-1.07-1.43-1.07-2.73 0-1.3.68-1.94.93-2.22.25-.28.55-.35.73-.35.18 0 .37 0 .52.01.17.01.39-.06.61.47.23.55.78 1.9.85 2.04.07.14.12.3.03.48-.09.18-.14.3-.28.46-.14.16-.3.35-.43.48-.15.15-.31.32-.14.61.17.3 1.3 2.14 2.97 3.63.81.72 1.55 1.05 1.85 1.19.3.15.48.12.66-.08.18-.2.78-.91.99-1.22.21-.31.41-.26.69-.15.28.1 1.76.83 2.06.98.3.15.5.22.58.35.07.13.07.76-.17 1.44z"/>
                </svg>
              </div>
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight block">Vastu AI CRM</span>
              <span className="text-[11px] text-emerald-400 font-medium tracking-wide uppercase block -mt-1">By Vastu With Nikhil</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
            <a href="#demo" className="hover:text-emerald-400 transition-colors">Live Simulation</a>
            <a href="#stats" className="hover:text-emerald-400 transition-colors">Performance</a>
            <a href="#faq" className="hover:text-emerald-400 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2 transition-colors hidden sm:block"
            >
              Sign In
            </Link>
            <Link 
              href="/dashboard/leads" 
              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-semibold rounded-xl group bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all active:scale-95"
            >
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-[#090d16] rounded-[10px] group-hover:bg-opacity-0 flex items-center gap-2">
                <span>Open CRM</span>
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              24/7 Autonomous WhatsApp AI Employee
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              Convert WhatsApp Chats into <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
                High-Ticket Vastu Clients
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-400 font-normal leading-relaxed">
              Never lose a high-value lead again. Your intelligent AI agent qualifies buyers, collects plot size & floor plans, answers doubts in natural Hinglish, and books consultations 24/7 on autopilot.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link 
                href="/dashboard/leads" 
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold text-base shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>Launch CRM Dashboard</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a 
                href="#demo" 
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-semibold text-base backdrop-blur-md hover:border-emerald-500/40 transition-all flex items-center justify-center gap-2"
              >
                <span>Try Live AI Simulation</span>
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </a>
            </div>

            {/* Quick Metrics */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                <span>Zero Latency Responses (&lt; 2s)</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                <span>Direct WhatsApp Cloud Sync</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                <span>Floor Plan & Size Extractor</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Stats Section */}
      <section id="stats" className="py-12 border-y border-slate-800/80 bg-slate-950/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">10,000+</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">WhatsApp Chats Handled</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">3.8x</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">Qualified Lead Growth</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-amber-300">24/7/365</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">Always-On Instant Gatekeeper</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-300">100%</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">Automated CRM Capture</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Interactive Simulation Demo Section */}
      <section id="demo" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            See Kriti (AI Gatekeeper) in Action
          </h2>
          <p className="text-slate-400">
            Select a conversation scenario to see how seamlessly the AI understands intent, asks qualifying questions, and collects client data without sounding like a robot.
          </p>

          {/* Scenario Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            <button 
              onClick={() => setActiveTab('planning')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${activeTab === 'planning' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' : 'bg-slate-800/80 text-slate-400 hover:text-white'}`}
            >
              🏡 New House Planning
            </button>
            <button 
              onClick={() => setActiveTab('issue')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${activeTab === 'issue' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' : 'bg-slate-800/80 text-slate-400 hover:text-white'}`}
            >
              ⚠️ Vastu Defect / Issue
            </button>
            <button 
              onClick={() => setActiveTab('astrology')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${activeTab === 'astrology' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' : 'bg-slate-800/80 text-slate-400 hover:text-white'}`}
            >
              🔮 Astrology / Kundali
            </button>
            <button 
              onClick={() => setActiveTab('learn')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${activeTab === 'learn' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' : 'bg-slate-800/80 text-slate-400 hover:text-white'}`}
            >
              📚 Learn Vastu Course
            </button>
          </div>
        </div>

        {/* WhatsApp Chat Box Mockup */}
        <div className="max-w-xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-slate-700/80 bg-[#efeae2] text-gray-900">
          
          {/* Header */}
          <div className="bg-[#005e54] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-400 flex items-center justify-center font-bold text-gray-900">
                K
              </div>
              <div>
                <h4 className="font-semibold text-sm leading-none">Kriti (AI Assistant)</h4>
                <span className="text-[11px] text-emerald-200">Online • Vastu With Nikhil</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-emerald-200 text-sm">
              <span className="bg-emerald-700/60 px-2.5 py-1 rounded-full text-xs font-mono">⚡ 0.8s</span>
            </div>
          </div>

          {/* Messages Area */}
          <div className="p-4 space-y-3 max-h-[460px] overflow-y-auto font-sans text-sm">
            {demoChats[activeTab].map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm whitespace-pre-wrap leading-relaxed ${
                    msg.sender === 'bot' 
                      ? 'bg-white text-gray-800 rounded-tl-none border border-gray-200' 
                      : 'bg-[#d9fdd3] text-gray-900 rounded-tr-none'
                  }`}
                >
                  <p className="text-[13.5px]">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Footer Mock */}
          <div className="p-3 bg-[#f0f2f5] border-t border-gray-200 flex items-center gap-2">
            <div className="flex-1 bg-white rounded-full px-4 py-2 text-xs text-gray-400 border border-gray-300 flex items-center justify-between">
              <span>Customer types response...</span>
              <span className="text-gray-400">📎</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#00a884] text-white flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Features Grid (Bento Grid) */}
      <section id="features" className="py-20 bg-slate-950/60 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Engineered Exclusively for Vastu & Real Estate
            </h2>
            <p className="text-slate-400">
              Generic chatbots fail because they can't ask the right questions. Our AI handles floor plan verification, plot dimensions, and instant consultation bookings effortlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Smart Lead Gatekeeper</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Filters genuine clients with high intent from window-shoppers. Asks their city, property type, and timeline automatically.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Floor Plan & Media Capture</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Prompts users to upload floor plans, house photos, or site videos. Automatically parses and presents images inside your CRM.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Hands-Free Consultation Booking</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Connects directly to your Calendly or consultation checkout pages. Delivers relevant video guides & WhatsApp VIP community links.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">WhatsApp-Style CRM Dashboard</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                View conversations with rich WhatsApp look & feel, clickable links, user notes, and instant memory reset options.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Natural Gen-Z Hinglish AI</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Speaks like a warm, polite female executive ("Got it! ✨", "Noted!", "Zaroor!"). Never repeats robotic phrases or confuses the lead.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Live Lead Intelligence</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Filter by service (Planning, Defect, Astrology), search by customer phone or city, and export data with a single click.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. CTA Banner */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-tr from-emerald-950 via-slate-900 to-slate-950 border border-emerald-500/30 text-center space-y-6 shadow-2xl shadow-emerald-500/10">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Ready to Put Your Vastu Consultations on Autopilot?
            </h2>
            <p className="text-slate-300 max-w-xl mx-auto text-base sm:text-lg">
              Log in to your dashboard to view new leads, review floor plans, and monitor live AI conversations.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/dashboard/leads" 
                className="w-full sm:w-auto px-10 py-4 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-gray-950 font-bold text-base shadow-xl shadow-emerald-400/25 hover:shadow-emerald-400/40 hover:scale-105 active:scale-95 transition-all"
              >
                Access CRM Dashboard Now 🚀
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="py-12 border-t border-slate-800/80 bg-slate-950 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Vastu AI CRM</span>
            <span>•</span>
            <span>© {new Date().getFullYear()} Vastu With Nikhil. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-emerald-400 transition-colors">Sign In</Link>
            <Link href="/dashboard/leads" className="hover:text-emerald-400 transition-colors">Leads</Link>
            <Link href="/dashboard/numbers" className="hover:text-emerald-400 transition-colors">Numbers</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
