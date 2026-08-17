'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'planning' | 'issue' | 'astrology' | 'learn'>('planning');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/20 blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-amber-500/10 blur-[150px] mix-blend-screen animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-teal-800/20 blur-[150px] mix-blend-screen animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      {/* 1. Header / Navbar - Glassmorphism */}
      <header className="fixed top-0 inset-x-0 z-50 transition-all duration-300 bg-[#020617]/50 backdrop-blur-2xl border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-amber-400 rounded-xl blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-amber-400 p-[1px] shadow-2xl">
                <div className="w-full h-full bg-[#020617] rounded-[10px] flex items-center justify-center">
                  <svg className="w-5 h-5 text-transparent bg-clip-text bg-gradient-to-tr from-emerald-400 to-amber-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 2.19.71 4.22 1.91 5.86L2.6 21.4l3.65-1.28A9.957 9.957 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm5.1 14.1c-.24.68-1.39 1.25-1.95 1.32-.52.06-1.19.16-3.41-.76-2.67-1.11-4.38-3.83-4.51-4.01-.13-.18-1.07-1.43-1.07-2.73 0-1.3.68-1.94.93-2.22.25-.28.55-.35.73-.35.18 0 .37 0 .52.01.17.01.39-.06.61.47.23.55.78 1.9.85 2.04.07.14.12.3.03.48-.09.18-.14.3-.28.46-.14.16-.3.35-.43.48-.15.15-.31.32-.14.61.17.3 1.3 2.14 2.97 3.63.81.72 1.55 1.05 1.85 1.19.3.15.48.12.66-.08.18-.2.78-.91.99-1.22.21-.31.41-.26.69-.15.28.1 1.76.83 2.06.98.3.15.5.22.58.35.07.13.07.76-.17 1.44z"/>
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <span className="font-bold text-xl text-white tracking-tight block">Vastu AI</span>
              <span className="text-[10px] text-amber-400 font-bold tracking-[0.2em] uppercase block mt-0.5">By Vastu With Nikhil</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-slate-300/80">
            <a href="#features" className="hover:text-emerald-400 transition-colors">Capabilities</a>
            <a href="#demo" className="hover:text-emerald-400 transition-colors">Simulation</a>
            <a href="#stats" className="hover:text-emerald-400 transition-colors">Analytics</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2 transition-colors hidden sm:block"
            >
              Log In
            </Link>
            <Link 
              href="/dashboard/leads" 
              className="relative inline-flex items-center justify-center p-[1px] overflow-hidden rounded-xl group transition-all"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-xl opacity-80 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-xy"></span>
              <span className="relative px-6 py-2.5 bg-[#020617] rounded-xl flex items-center gap-2 group-hover:bg-opacity-0 transition-all duration-300">
                <span className="font-semibold text-white group-hover:text-gray-900 transition-colors duration-300">Open CRM</span>
                <svg className="w-4 h-4 text-emerald-400 group-hover:text-gray-900 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section - Ultra Premium */}
      <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            
            {/* Animated Pill Badge */}
            <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.05] backdrop-blur-xl shadow-2xl transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </div>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-slate-300 text-xs font-bold uppercase tracking-widest">
                Introducing Autonomous Vastu AI
              </span>
            </div>

            {/* Main Headline */}
            <h1 className={`text-5xl sm:text-7xl md:text-[5.5rem] font-black tracking-tight text-white leading-[1.05] transition-all duration-1000 delay-100 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              Convert WhatsApp Chats into <br className="hidden sm:block" />
              <span className="relative inline-block mt-2">
                <span className="absolute -inset-2 bg-gradient-to-r from-emerald-500/20 to-amber-500/20 blur-2xl rounded-full"></span>
                <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 animate-gradient-x">
                  High-Ticket Clients
                </span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className={`text-lg sm:text-2xl text-slate-400/90 font-medium leading-relaxed max-w-2xl mx-auto transition-all duration-1000 delay-200 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              Your 24/7 intelligent agent qualifies buyers, extracts floor plans, and books consultations on autopilot in natural Hinglish.
            </p>

            {/* Action Buttons */}
            <div className={`flex flex-col sm:flex-row items-center justify-center gap-5 pt-6 transition-all duration-1000 delay-300 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <Link 
                href="/dashboard/leads" 
                className="group relative w-full sm:w-auto px-8 py-4 bg-emerald-500 text-white rounded-2xl font-bold text-lg shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-10px_rgba(16,185,129,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3"
              >
                Launch Dashboard
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a 
                href="#demo" 
                className="group w-full sm:w-auto px-8 py-4 bg-white/[0.03] border border-white/[0.1] hover:border-emerald-500/50 text-white rounded-2xl font-bold text-lg backdrop-blur-xl hover:bg-white/[0.05] transition-all duration-300 flex items-center justify-center gap-3"
              >
                Watch Simulation
                <svg className="w-5 h-5 text-emerald-400 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Decorative Bottom Gradient Line */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
      </section>

      {/* 3. Interactive Simulation Demo Section - Glassmorphism UI */}
      <section id="demo" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-full bg-gradient-to-b from-emerald-900/20 to-transparent blur-3xl -z-10 rounded-full"></div>
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            Experience the <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300">AI Magic</span>
          </h2>
          <p className="text-lg text-slate-400">
            Interact with Kriti, our hyper-realistic Vastu Assistant. Select a scenario below.
          </p>

          {/* Scenario Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            {[
              { id: 'planning', icon: '🏡', label: 'New Planning' },
              { id: 'issue', icon: '⚠️', label: 'Vastu Defect' },
              { id: 'astrology', icon: '🔮', label: 'Astrology' },
              { id: 'learn', icon: '📚', label: 'Learn Vastu' }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 border ${
                  activeTab === tab.id 
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.2)] scale-105' 
                    : 'bg-white/[0.02] border-white/[0.05] text-slate-400 hover:bg-white/[0.05] hover:text-white'
                }`}
              >
                <span className="mr-2">{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* WhatsApp Chat Box Mockup - Premium */}
        <div className="max-w-md mx-auto relative group">
          {/* Outer Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          
          <div className="relative rounded-[2rem] overflow-hidden border border-white/[0.1] bg-[#efeae2] text-gray-900 shadow-2xl flex flex-col h-[600px]">
            
            {/* Header */}
            <div className="bg-[#005c4b] text-white p-4 flex items-center justify-between shadow-md z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-200 flex items-center justify-center font-bold text-gray-900 text-lg shadow-inner">
                    K
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#005c4b] rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-bold text-[15px] leading-tight">Kriti (AI Agent)</h4>
                  <span className="text-[11px] text-emerald-100/80 font-medium">Online • Vastu With Nikhil</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-emerald-200 text-sm">
                <span className="bg-black/20 px-3 py-1 rounded-full text-xs font-mono font-medium flex items-center gap-1 backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> 0.8s
                </span>
              </div>
            </div>

            {/* Messages Area */}
            <div className="p-4 flex-1 overflow-y-auto space-y-4 font-sans text-[14px] bg-[url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')] bg-cover bg-center bg-fixed bg-blend-soft-light bg-black/5">
              {demoChats[activeTab].map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-4 duration-500`}
                  style={{ animationFillMode: 'both', animationDelay: `${index * 150}ms` }}
                >
                  <div 
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm whitespace-pre-wrap leading-relaxed relative ${
                      msg.sender === 'bot' 
                        ? 'bg-white text-[#111b21] rounded-tl-sm' 
                        : 'bg-[#d9fdd3] text-[#111b21] rounded-tr-sm'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="text-[10px] text-gray-400 float-right mt-1 ml-2">12:00 PM</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Footer Mock */}
            <div className="p-3 bg-[#f0f2f5] flex items-center gap-2 z-10">
              <div className="flex-1 bg-white rounded-full px-5 py-3 text-[14px] text-gray-400 border border-gray-200 flex items-center justify-between shadow-sm">
                <span>Type a message...</span>
                <span className="text-gray-400 cursor-not-allowed">📎</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#00a884] text-white flex items-center justify-center shadow-md hover:bg-[#008f6f] transition-colors cursor-not-allowed">
                <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Features Bento Grid - Glassmorphism */}
      <section id="features" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
              Unfair Advantage for <br className="hidden sm:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300">Vastu Experts</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="col-span-1 md:col-span-2 p-8 sm:p-10 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-emerald-500/30 transition-all duration-500 group backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -mr-32 -mt-32 transition-transform group-hover:scale-150 duration-700"></div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white mb-8 shadow-lg shadow-emerald-500/25">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Smart Lead Gatekeeper</h3>
              <p className="text-slate-400 leading-relaxed text-lg max-w-lg">
                Filters genuine clients from window-shoppers. Automatically asks for their city, property type, and timeline before passing the lead to you.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="col-span-1 p-8 sm:p-10 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-amber-500/30 transition-all duration-500 group backdrop-blur-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] -mr-32 -mt-32 transition-transform group-hover:scale-150 duration-700"></div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white mb-8 shadow-lg shadow-amber-500/25">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Floor Plan Parser</h3>
              <p className="text-slate-400 leading-relaxed text-base">
                Prompts users to upload floor plans and property photos, organizing them neatly in your CRM.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="col-span-1 p-8 sm:p-10 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-blue-500/30 transition-all duration-500 group backdrop-blur-xl relative overflow-hidden">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white mb-8 shadow-lg shadow-blue-500/25">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Auto-Booking</h3>
              <p className="text-slate-400 leading-relaxed text-base">
                Connects directly to Calendly. Books consultations 24/7 without human intervention.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="col-span-1 md:col-span-2 p-8 sm:p-10 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-teal-500/30 transition-all duration-500 group backdrop-blur-xl relative overflow-hidden">
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px] -ml-32 -mb-32 transition-transform group-hover:scale-150 duration-700"></div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white mb-8 shadow-lg shadow-teal-500/25">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Gen-Z Hinglish Personality</h3>
              <p className="text-slate-400 leading-relaxed text-lg max-w-lg">
                Speaks like a warm, polite human assistant. Uses emojis naturally ("Got it! ✨", "Zaroor!"). Never sounds like a cold robot.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. CTA Banner - Glow effect */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[3rem] p-12 sm:p-20 bg-[#020617] border border-emerald-500/20 text-center space-y-8 shadow-[0_0_100px_-20px_rgba(16,185,129,0.3)] overflow-hidden">
            {/* Background Glows inside CTA */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-emerald-500/10 to-transparent blur-3xl pointer-events-none"></div>
            
            <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight relative z-10">
              Ready to Put Consultations on <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300">Autopilot?</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg sm:text-xl relative z-10">
              Log in to your dashboard to view new leads, review floor plans, and monitor live AI conversations.
            </p>
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
              <Link 
                href="/dashboard/leads" 
                className="w-full sm:w-auto px-12 py-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-amber-500 text-gray-950 font-black text-lg shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all"
              >
                Access CRM Now 🚀
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="py-12 border-t border-white/[0.05] bg-[#020617] text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-amber-400 p-[1px]">
                <div className="w-full h-full bg-[#020617] rounded-[7px] flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 2.19.71 4.22 1.91 5.86L2.6 21.4l3.65-1.28A9.957 9.957 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm5.1 14.1c-.24.68-1.39 1.25-1.95 1.32-.52.06-1.19.16-3.41-.76-2.67-1.11-4.38-3.83-4.51-4.01-.13-.18-1.07-1.43-1.07-2.73 0-1.3.68-1.94.93-2.22.25-.28.55-.35.73-.35.18 0 .37 0 .52.01.17.01.39-.06.61.47.23.55.78 1.9.85 2.04.07.14.12.3.03.48-.09.18-.14.3-.28.46-.14.16-.3.35-.43.48-.15.15-.31.32-.14.61.17.3 1.3 2.14 2.97 3.63.81.72 1.55 1.05 1.85 1.19.3.15.48.12.66-.08.18-.2.78-.91.99-1.22.21-.31.41-.26.69-.15.28.1 1.76.83 2.06.98.3.15.5.22.58.35.07.13.07.76-.17 1.44z"/>
                  </svg>
                </div>
              </div>
            <span className="font-bold text-slate-300">Vastu AI</span>
            <span className="hidden sm:inline">•</span>
            <span>© {new Date().getFullYear()} Vastu With Nikhil.</span>
          </div>
          <div className="flex items-center gap-8 font-medium">
            <Link href="/login" className="hover:text-emerald-400 transition-colors">Login</Link>
            <Link href="/dashboard/leads" className="hover:text-emerald-400 transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
