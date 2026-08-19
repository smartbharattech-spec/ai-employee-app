'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, Brain, Handshake } from 'lucide-react';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(-1);
  const [openFaq, setOpenFaq] = useState(-1);

  useEffect(() => {
    setMounted(true);
  }, []);

  const faqs = [
    { q: "How long does it take to set up Kriti AI?", a: "Setup takes less than 5 minutes. You just connect your WhatsApp Business number, define your business rules, and Kriti handles the rest." },
    { q: "Can Kriti handle complex questions?", a: "Yes! Kriti uses advanced LLMs trained on your specific business data and FAQs to answer complex queries naturally." },
    { q: "What happens if Kriti doesn't know the answer?", a: "If a user asks something completely out of scope or requests human assistance, Kriti seamlessly passes the chat to your human agents (Handoff Mode)." },
    { q: "Does it sync with my CRM?", a: "Absolutely. Every lead qualified by Kriti is instantly pushed to your built-in CRM dashboard or your external tools." }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-indigo-500/20 overflow-x-hidden relative">
      
      {/* 1. Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all">
        <div className="pt-4 pb-4 px-6 lg:px-12 max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <img src="/kriti-logo.png" alt="Kriti AI Logo" className="w-10 h-10 rounded-full object-cover shadow-md transform group-hover:scale-105 transition-all" />
            <span className="font-bold text-2xl tracking-tight text-gray-900">Kriti AI</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 font-medium text-gray-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How It Works</a>
            <a href="#demo" className="hover:text-indigo-600 transition-colors">Demo</a>
            <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="font-medium text-gray-600 hover:text-indigo-600 transition-colors hidden sm:block">Login</Link>
            <Link href="/dashboard/numbers" className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-20">
        
        {/* 2. Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-32 px-6 lg:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-indigo-100 to-purple-50 rounded-full blur-3xl opacity-50 -z-10"></div>
          
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
              <Link href="/dashboard/numbers" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:shadow-[0_0_40px_rgba(79,70,229,0.5)] transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                Hire Kriti Now
              </Link>
              <a href="#demo" className="px-8 py-4 bg-white border-2 border-gray-100 hover:border-gray-200 text-gray-700 font-bold rounded-xl transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                Watch Demo
              </a>
            </div>
          </div>

          <div className={`flex-1 relative perspective-1000 transition-all duration-1000 delay-300 ${mounted ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <div className="relative w-full max-w-md mx-auto aspect-[4/5] transform-style-3d animate-float">
              <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform rotate-y-[-10deg] rotate-x-[5deg] z-10 transition-transform duration-500 hover:rotate-y-0 hover:rotate-x-0">
                <div className="bg-gray-50 border-b border-gray-100 p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">K</div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Kriti AI</h3>
                    <p className="text-xs text-green-500 font-medium">Online</p>
                  </div>
                </div>
                <div className="p-4 space-y-4 bg-gray-50/50 h-full">
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm p-3 max-w-[85%]">
                      <p className="text-sm text-gray-700">Hi! Are you looking to book a consultation today?</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-indigo-600 text-white shadow-md rounded-2xl rounded-tr-sm p-3 max-w-[85%]">
                      <p className="text-sm">Yes, I need help with planning.</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm p-3 max-w-[85%]">
                      <p className="text-sm text-gray-700">Great! I've qualified your request and assigned an expert.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -right-12 top-20 w-48 bg-white p-4 rounded-xl shadow-xl border border-gray-100 transform translate-z-20 animate-float-delayed z-20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase">New Lead</span>
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                </div>
                <p className="font-bold text-gray-900 text-sm">+91 98765 43210</p>
                <p className="text-xs text-gray-500 mt-1">Status: <span className="text-indigo-600 font-bold">Qualified</span></p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Social Proof */}
        <section className="border-y border-gray-100 bg-gray-50 py-10">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">Trusted by 500+ Businesses Worldwide</p>
            <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale">
              {['Google', 'Microsoft', 'Amazon', 'Spotify', 'Stripe'].map((brand) => (
                <span key={brand} className="text-2xl font-black text-gray-900">{brand}</span>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Core Features */}
        <section id="features" className="py-24 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-gray-900">Outperform with Automation</h2>
            <p className="text-lg text-gray-500">Kriti doesn't just chat—she qualifies, organizes, and closes. Designed to replace an entire BDR team.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: '24/7 Omnichannel', desc: 'Instantly replies on WhatsApp, converting traffic into qualified prospects at any hour.', icon: <Zap className="w-8 h-8 text-indigo-500" /> },
              { title: 'Smart Qualification', desc: 'Gathers names, requirements, and intent, automatically updating your pipeline.', icon: <Brain className="w-8 h-8 text-indigo-500" /> },
              { title: 'Handoff Mode', desc: 'Seamlessly passes hot leads to a human expert without breaking the conversation flow.', icon: <Handshake className="w-8 h-8 text-indigo-500" /> }
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
        </section>

        {/* 5. How It Works */}
        <section id="how-it-works" className="py-24 bg-indigo-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-white mb-4">How Kriti Works</h2>
              <p className="text-indigo-200 text-lg">Four simple steps to automate your sales funnel.</p>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: '1', title: 'Connect', desc: 'Link your WhatsApp Business API in seconds.' },
                { step: '2', title: 'Train', desc: 'Provide your FAQs and business context.' },
                { step: '3', title: 'Engage', desc: 'Kriti starts chatting and qualifying leads 24/7.' },
                { step: '4', title: 'Close', desc: 'Hot leads are synced to your CRM for closing.' }
              ].map((item) => (
                <div key={item.step} className="relative text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-indigo-500 rounded-2xl flex items-center justify-center text-2xl font-bold border-4 border-indigo-800 shadow-xl">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-indigo-200 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Interactive Demo */}
        <section id="demo" className="py-24 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="bg-gray-50 rounded-[3rem] p-8 lg:p-16 border border-gray-200 flex flex-col lg:flex-row items-center gap-16 relative overflow-hidden">
            <div className="flex-1 space-y-6 relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">See Kriti in Action</h2>
              <p className="text-lg text-gray-500">Experience how naturally she converses with prospects. She understands intent, context, and edge cases.</p>
              <ul className="space-y-3 text-gray-600 font-medium">
                <li className="flex items-center gap-2">✓ Natural Language Processing</li>
                <li className="flex items-center gap-2">✓ Multi-lingual Support</li>
                <li className="flex items-center gap-2">✓ Intelligent Follow-ups</li>
              </ul>
            </div>
            <div className="flex-1 relative z-10 w-full">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-4 w-full max-w-md mx-auto h-[400px] flex flex-col">
                <div className="border-b border-gray-100 pb-3 mb-4 flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold text-gray-900 text-sm">Live Demo Simulation</span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl rounded-tl-sm p-3 text-sm max-w-[80%] text-gray-800">Hi, I want to buy a subscription.</div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-indigo-600 rounded-2xl rounded-tr-sm p-3 text-sm max-w-[80%] text-white">Awesome! To suggest the best plan, could you tell me how many users are in your team?</div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl rounded-tl-sm p-3 text-sm max-w-[80%] text-gray-800">We are a team of 15 people.</div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-indigo-600 rounded-2xl rounded-tr-sm p-3 text-sm max-w-[80%] text-white">Perfect. For a team of 15, our "Growth Plan" is ideal. Shall I arrange a quick demo call with our expert?</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Analytics/ROI */}
        <section className="py-20 border-y border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-black text-indigo-600 mb-2">98%</div>
              <div className="text-gray-500 font-medium text-sm uppercase tracking-wider">Open Rate</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black text-indigo-600 mb-2">24/7</div>
              <div className="text-gray-500 font-medium text-sm uppercase tracking-wider">Availability</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black text-indigo-600 mb-2">3x</div>
              <div className="text-gray-500 font-medium text-sm uppercase tracking-wider">Conversion Boost</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black text-indigo-600 mb-2">0s</div>
              <div className="text-gray-500 font-medium text-sm uppercase tracking-wider">Response Time</div>
            </div>
          </div>
        </section>

        {/* 8. Testimonials */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-12">Loved by Sales Teams</h2>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              {[
                { name: "Rahul S.", role: "CEO, TechCorp", text: "Kriti AI completely transformed our lead generation. We no longer lose leads over the weekend." },
                { name: "Priya M.", role: "Sales Head", text: "The CRM sync is flawless. My team only talks to highly qualified leads now, boosting our closing rate by 40%." },
                { name: "Amit K.", role: "Founder", text: "Setup was ridiculously easy. It felt like hiring a super-smart employee who never sleeps." }
              ].map((t, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex text-amber-400 mb-4">{'★'.repeat(5)}</div>
                  <p className="text-gray-600 italic mb-6">"{t.text}"</p>
                  <div>
                    <p className="font-bold text-gray-900">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. Integrations */}
        <section className="py-24 bg-white text-center">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Works with your Favorite Tools</h2>
            <p className="text-gray-500 mb-12">Kriti AI integrates seamlessly into your existing workflow.</p>
            <div className="flex flex-wrap justify-center gap-6">
              {['HubSpot', 'Salesforce', 'Zapier', 'WhatsApp', 'Stripe', 'Calendly'].map((tool) => (
                <div key={tool} className="px-6 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-700 shadow-sm">
                  {tool}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 10. Pricing */}
        <section id="pricing" className="py-24 bg-gray-50 border-y border-gray-100">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
              <p className="text-gray-500">Pay a fraction of what a human BDR costs.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Starter</h3>
                <div className="text-4xl font-black text-indigo-600 mb-6">$49<span className="text-lg text-gray-400 font-medium">/mo</span></div>
                <ul className="space-y-4 mb-8 text-gray-600">
                  <li>✓ 1,000 AI Conversations</li>
                  <li>✓ Standard CRM Sync</li>
                  <li>✓ Email Support</li>
                </ul>
                <button className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-xl transition-colors">Start Free Trial</button>
              </div>
              <div className="bg-indigo-900 p-8 rounded-3xl border border-indigo-700 shadow-2xl relative transform md:-translate-y-4">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-teal-400 to-emerald-400 text-indigo-900 font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full">Most Popular</div>
                <h3 className="text-xl font-bold text-white mb-2">Pro Business</h3>
                <div className="text-4xl font-black text-white mb-6">$149<span className="text-lg text-indigo-300 font-medium">/mo</span></div>
                <ul className="space-y-4 mb-8 text-indigo-100">
                  <li>✓ Unlimited AI Conversations</li>
                  <li>✓ Advanced Analytics Dashboard</li>
                  <li>✓ Custom API Integrations</li>
                  <li>✓ Priority 24/7 Support</li>
                </ul>
                <button className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl transition-colors">Get Pro</button>
              </div>
            </div>
          </div>
        </section>

        {/* 11. FAQ */}
        <section className="py-24 bg-white">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-gray-200 rounded-2xl overflow-hidden">
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                    className="w-full text-left px-6 py-4 bg-gray-50 hover:bg-gray-100 flex items-center justify-between font-bold text-gray-900 transition-colors"
                  >
                    {faq.q}
                    <span className="text-xl text-indigo-600">{openFaq === i ? '−' : '+'}</span>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 py-4 bg-white text-gray-600 leading-relaxed border-t border-gray-100 animate-in slide-in-from-top-2">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 12. Final CTA Banner */}
        <section className="py-24 bg-gradient-to-br from-indigo-600 to-purple-700 text-center px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-black text-white mb-6">Ready to Automate your Sales?</h2>
            <p className="text-xl text-indigo-100 mb-10">Join hundreds of modern businesses using Kriti AI to scale their revenue without scaling their headcount.</p>
            <Link href="/register" className="px-10 py-5 bg-white text-indigo-600 font-black rounded-2xl text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all inline-block">
              Get Started for Free
            </Link>
          </div>
        </section>
      </main>

      {/* 13. Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
            <img src="/kriti-logo.png" alt="Kriti AI Logo" className="w-8 h-8 rounded-full object-cover" />
              <span className="font-bold text-xl text-white">Kriti AI</span>
            </div>
            <p className="max-w-sm">The world's most advanced autonomous AI sales employee. Convert WhatsApp traffic into revenue effortlessly.</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm">
          <p>© 2026 Kriti AI by Vastu With Nikhil. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* Global Styles */}
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
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}} />
    </div>
  );
}
