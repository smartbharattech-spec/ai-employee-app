'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(-1);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-indigo-500/20 overflow-x-hidden relative">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-indigo-100 to-purple-50 rounded-full blur-3xl opacity-60 animate-pulse" style={{animationDuration: '10s'}}></div>
        <div className="absolute top-1/3 -left-20 w-[400px] h-[400px] bg-gradient-to-tr from-teal-50 to-blue-50 rounded-full blur-3xl opacity-60 animate-pulse" style={{animationDuration: '8s'}}></div>
      </div>

      {/* Navbar */}
      <header className="relative z-50 pt-6 px-6 lg:px-12 max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20 transform group-hover:scale-105 transition-all">
            {/* WhatsApp Icon */}
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </div>
          <span className="font-bold text-2xl tracking-tight text-gray-900">Kriti AI</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 font-medium text-gray-600">
          <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How It Works</a>
          <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="font-medium text-gray-600 hover:text-indigo-600 transition-colors hidden sm:block">Login</Link>
          <Link href="/dashboard/pipeline" className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
            Open Dashboard
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-24 pb-32 px-6 lg:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        {/* Text Content */}
        <div className={`flex-1 space-y-8 transition-all duration-1000 ${mounted ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-semibold text-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Meet Your New Top Performer
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Scale Sales with <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Kriti AI</span>
          </h1>
          
          <p className="text-xl text-gray-500 max-w-xl leading-relaxed">
            Your autonomous AI employee that engages leads on WhatsApp 24/7, qualifies prospects instantly, and books meetings while you sleep.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/dashboard/pipeline" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:shadow-[0_0_40px_rgba(79,70,229,0.5)] transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
              Hire Kriti Now
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <a href="#demo" className="px-8 py-4 bg-white border-2 border-gray-100 hover:border-gray-200 text-gray-700 font-bold rounded-xl transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch Demo
            </a>
          </div>
          
          <div className="pt-8 flex items-center gap-6 text-sm font-medium text-gray-400">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Zero Setup Time
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Seamless CRM Sync
            </div>
          </div>
        </div>

        {/* 3D Visual Element */}
        <div className={`flex-1 relative perspective-1000 transition-all duration-1000 delay-300 ${mounted ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
          <div className="relative w-full max-w-md mx-auto aspect-[4/5] transform-style-3d animate-float">
            
            {/* Main Phone/Chat Mockup */}
            <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform rotate-y-[-10deg] rotate-x-[5deg] z-10 transition-transform duration-500 hover:rotate-y-0 hover:rotate-x-0">
              {/* Header */}
              <div className="bg-gray-50 border-b border-gray-100 p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">K</div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Kriti AI</h3>
                  <p className="text-xs text-green-500 font-medium">Online</p>
                </div>
              </div>
              
              {/* Chat Body */}
              <div className="p-4 space-y-4 bg-gray-50/50 h-full">
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm p-3 max-w-[85%]">
                    <p className="text-sm text-gray-700">Hi! I saw you looking at our services. Are you looking to book a consultation? 👋</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-indigo-600 text-white shadow-md rounded-2xl rounded-tr-sm p-3 max-w-[85%]">
                    <p className="text-sm">Yes, I need help with my home planning.</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm p-3 max-w-[85%]">
                    <p className="text-sm text-gray-700">Great! What's the size of your property? I can get an expert assigned to you right away. ✨</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements (Background/Foreground) */}
            <div className="absolute -right-12 top-20 w-48 bg-white p-4 rounded-xl shadow-xl border border-gray-100 transform translate-z-20 animate-float-delayed z-20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-400 uppercase">New Lead</span>
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              </div>
              <p className="font-bold text-gray-900 text-sm">+91 98765 43210</p>
              <p className="text-xs text-gray-500 mt-1">Status: <span className="text-indigo-600 font-bold">Qualified</span></p>
            </div>

            <div className="absolute -left-10 bottom-24 w-56 bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-xl shadow-2xl transform -translate-z-10 animate-float z-20">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Meeting Booked</p>
                  <p className="text-indigo-100 text-xs">Today, 4:00 PM</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-gray-900">Outperform with Automation</h2>
            <p className="text-lg text-gray-500">Kriti doesn't just chat—she qualifies, organizes, and closes. Designed to replace an entire BDR team.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: '24/7 Omnichannel',
                desc: 'Never miss a lead. Kriti instantly replies on WhatsApp, converting traffic into qualified prospects at any hour.',
                icon: '⚡'
              },
              {
                title: 'Smart Qualification',
                desc: 'Through natural conversation, she gathers names, requirements, and intent, automatically updating your pipeline.',
                icon: '🧠'
              },
              {
                title: 'Handoff Mode',
                desc: 'The moment a lead is hot, Kriti seamlessly passes the conversation to a human expert without breaking flow.',
                icon: '🤝'
              }
            ].map((feat, idx) => (
              <div 
                key={idx}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(-1)}
                className={`bg-white p-8 rounded-3xl border transition-all duration-500 transform perspective-1000
                  ${hoveredCard === idx ? 'border-indigo-500 shadow-2xl scale-105 z-10 -rotate-y-2 rotate-x-2' : 'border-gray-100 shadow-sm'}
                `}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-6 transition-colors duration-500 ${hoveredCard === idx ? 'bg-indigo-50' : 'bg-gray-50'}`}>
                  {feat.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feat.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Styles for Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .rotate-y-\\[-10deg\\] { transform: rotateY(-10deg); }
        .rotate-x-\\[5deg\\] { transform: rotateX(5deg); }
        .translate-z-20 { transform: translateZ(40px); }
        .-translate-z-10 { transform: translateZ(-20px); }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) translateZ(40px); }
          50% { transform: translateY(-20px) translateZ(40px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 7s ease-in-out infinite alternate; }
      `}} />
    </div>
  );
}
