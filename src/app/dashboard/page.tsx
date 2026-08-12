'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

export default function DashboardHome() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/leads');
      const data = await response.json();
      if (data.success) {
        setLeads(data.leads || []);
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper date calculations
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(now.getDate() - 7);

  const oneMonthAgo = new Date();
  oneMonthAgo.setDate(now.getDate() - 30);

  // Metrics
  const todayLeads = leads.filter(l => {
    if (!l.last_updated) return false;
    return l.last_updated.startsWith(todayStr);
  });

  const weeklyLeads = leads.filter(l => {
    if (!l.last_updated) return false;
    const date = new Date(l.last_updated);
    return date >= oneWeekAgo;
  });

  const monthlyLeads = leads.filter(l => {
    if (!l.last_updated) return false;
    const date = new Date(l.last_updated);
    return date >= oneMonthAgo;
  });

  // Daily Chart Data (Past 7 Days)
  const chartDays: { date: string; displayDate: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const displayStr = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const count = leads.filter(l => l.last_updated && l.last_updated.startsWith(dateStr)).length;
    chartDays.push({
      date: dateStr,
      displayDate: displayStr,
      count: count
    });
  }

  // Service Breakdown
  const serviceCounts: Record<string, number> = {
    'House Planning': 0,
    'Vastu Issue': 0,
    'Astrology': 0,
    'Learn Vastu': 0,
    'Vastu Tool': 0,
    'Other': 0
  };

  leads.forEach(l => {
    const s = (l.data?.service_type || '').toLowerCase();
    if (s.includes('planning') || s === '2' || s.includes('2.')) serviceCounts['House Planning']++;
    else if (s.includes('issue') || s === '1' || s.includes('1.')) serviceCounts['Vastu Issue']++;
    else if (s.includes('astrology') || s.includes('numerology') || s === '3' || s.includes('3.')) serviceCounts['Astrology']++;
    else if (s.includes('seekhna') || s === '4' || s.includes('4.')) serviceCounts['Learn Vastu']++;
    else if (s.includes('tool') || s.includes('app') || s === '5' || s.includes('5.')) serviceCounts['Vastu Tool']++;
    else serviceCounts['Other']++;
  });

  const pieData = [
    { name: 'House Planning', value: serviceCounts['House Planning'], color: '#10b981' },
    { name: 'Vastu Issue', value: serviceCounts['Vastu Issue'], color: '#f59e0b' },
    { name: 'Astrology', value: serviceCounts['Astrology'], color: '#6366f1' },
    { name: 'Learn Vastu', value: serviceCounts['Learn Vastu'], color: '#ec4899' },
    { name: 'Vastu Tool', value: serviceCounts['Vastu Tool'], color: '#06b6d4' },
  ].filter(item => item.value > 0);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Analytics & Conversion Trends</h1>
          <p className="mt-1 text-sm text-gray-500">Real-time performance metrics and lead acquisition trends from WhatsApp Gatekeeper.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link 
            href="/dashboard/leads" 
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2"
          >
            <span>View All Leads</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Leads */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Leads</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{loading ? '...' : leads.length}</span>
            <span className="text-xs text-emerald-600 font-medium">All Time</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Total qualified prospects captured</p>
        </div>

        {/* Today's Leads */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-teal-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Today's Leads</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{loading ? '...' : todayLeads.length}</span>
            <span className="text-xs text-teal-600 font-medium">Last 24 Hours</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Inbound chats today</p>
        </div>

        {/* Weekly Leads */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">This Week</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{loading ? '...' : weeklyLeads.length}</span>
            <span className="text-xs text-indigo-600 font-medium">Last 7 Days</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Weekly volume trajectory</p>
        </div>

        {/* Monthly Leads */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">This Month</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{loading ? '...' : monthlyLeads.length}</span>
            <span className="text-xs text-amber-600 font-medium">Last 30 Days</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Monthly pipeline throughput</p>
        </div>

      </div>

      {/* Graphs & Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Daily Leads Area Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-900">Daily Lead Acquisition (Last 7 Days)</h3>
              <p className="text-xs text-gray-400">Trend of incoming qualified leads processed by AI.</p>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-medium border border-emerald-100">
              Live Feed
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartDays} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="displayDate" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ color: '#34d399' }}
                />
                <Area type="monotone" dataKey="count" name="New Leads" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Pie Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900">Service Interest Breakdown</h3>
            <p className="text-xs text-gray-400">Distribution of client intents.</p>
          </div>

          <div className="h-60 w-full">
            {pieData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-gray-400">
                No categorical lead data available yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Primary Driver</span>
            <span className="font-semibold text-emerald-600">
              {pieData.length > 0 ? pieData.sort((a,b) => b.value - a.value)[0]?.name : 'N/A'}
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
