'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Search, LayoutList, KanbanSquare, RefreshCw, MessageSquare, Phone } from 'lucide-react';

// Defining types for our data
type Lead = {
  phone: string;
  status: string;
  is_handoff: boolean;
  data: {
    name?: string;
    intent_category?: string;
    service_type?: string;
    city?: string;
  };
  intent?: string;
  last_updated?: string;
};

const STAGES = ['Cold', 'Warm', 'Hot', 'Followed Up', 'Meeting', 'Won', 'Lost'];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ffc658', '#d0ed57'];

const LeadProgressTracker = ({ lead }: { lead: any }) => {
  const steps = [
    { id: 1, label: 'Started', active: true },
    { id: 2, label: 'Info Collected', active: !!(lead.data?.name || lead.data?.city || lead.data?.service_type) },
    { id: 3, label: 'Qualified', active: ['Hot', 'Qualified', 'Meeting', 'Won'].includes(lead.status) },
    { id: 4, label: `Assigned${lead.assigned_to ? ' (' + (lead.assigned_to.split('@')[0]) + ')' : ''}`, active: !!lead.assigned_to || !!lead.auto_assigned },
    { id: 5, label: 'Meeting Done', active: ['Meeting', 'Won', 'Lost'].includes(lead.status) },
    { id: 6, label: 'Converted', active: ['Won', 'Lost', 'Followed Up'].includes(lead.status) }
  ];

  const currentStepIndex = steps.map(s => s.active).lastIndexOf(true);

  return (
    <div className="w-full mt-3 mb-1">
      <div className="flex justify-between relative">
        <div className="absolute top-1.5 left-0 w-full h-0.5 bg-gray-200 -z-10 rounded-full"></div>
        <div 
          className="absolute top-1.5 left-0 h-0.5 bg-teal-500 -z-10 rounded-full transition-all duration-500"
          style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
        ></div>
        
        {steps.map((step, idx) => (
          <div key={step.id} className="flex flex-col items-center group relative">
            <div className={`w-3 h-3 rounded-full border-2 transition-colors duration-300 ${step.active ? 'bg-teal-500 border-teal-500' : 'bg-white border-gray-300'}`} />
            
            {/* Tooltip on Hover */}
            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap pointer-events-none transition-opacity z-10">
              {step.label}
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-1 text-[10px] font-medium text-teal-600 truncate">
        {steps[currentStepIndex]?.label}
      </div>
    </div>
  );
};

const LeadCard = ({ lead, moveLead, onClick }: { lead: Lead, moveLead: any, onClick: any }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'LEAD',
    item: { phone: lead.phone },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag as any}
      onClick={() => onClick(lead)}
      className={`bg-white border border-gray-200 p-4 rounded-xl mb-3 shadow-sm cursor-grab active:cursor-grabbing hover:border-indigo-500 hover:shadow-md transition-all ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <div className="flex flex-wrap gap-2 mb-2">
        {lead.is_handoff && (
          <span className="text-[10px] font-bold bg-red-500/20 text-red-400 px-2 py-1 rounded-full border border-red-500/20">AI Paused</span>
        )}
        {lead.intent && (
          <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-full border border-indigo-500/20">{lead.intent}</span>
        )}
      </div>
      <h3 className="font-bold text-gray-900 text-sm">{lead.data?.name || 'Unknown Lead'}</h3>
      <p className="text-gray-500 text-xs mt-1 font-mono">+{lead.phone}</p>
      
      {(lead.data?.service_type || lead.data?.city) && (
        <div className="mt-2 text-xs text-gray-500 space-y-1">
          {lead.data.service_type && <p><span className="text-gray-400">Service:</span> {lead.data.service_type}</p>}
          {lead.data.city && <p><span className="text-gray-400">City:</span> {lead.data.city}</p>}
        </div>
      )}
      
      <LeadProgressTracker lead={lead} />
    </div>
  );
};

const PipelineColumn = ({ title, leads, moveLead, onCardClick }: { title: string, leads: Lead[], moveLead: any, onCardClick: any }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'LEAD',
    drop: (item: { phone: string }) => moveLead(item.phone, title),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop as any}
      className={`flex-shrink-0 w-72 bg-gray-50 rounded-2xl p-4 border ${
        isOver ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
      } transition-colors`}
    >
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="font-semibold text-gray-800">{title}</h2>
        <span className="bg-white border border-gray-200 text-gray-600 text-xs px-2 py-1 rounded-md shadow-sm">{leads.length}</span>
      </div>
      <div className="min-h-[200px]">
        {leads.map(lead => (
          <LeadCard key={lead.phone} lead={lead} moveLead={moveLead} onClick={onCardClick} />
        ))}
      </div>
    </div>
  );
};

export default function PipelinePage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  
  // Table state
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 10;

  // Modal State
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [customMsg, setCustomMsg] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pipeline');
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const moveLead = async (phone: string, newStatus: string) => {
    setLeads(prev => prev.map(l => l.phone === phone ? { ...l, status: newStatus } : l));
    try {
      await fetch('/api/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_status', phone_number: phone, status: newStatus })
      });
    } catch (err) {
      console.error('Failed to update status', err);
      fetchLeads();
    }
  };

  const sendMessage = async (message: string) => {
    if (!selectedLead || !message.trim()) return;
    setSending(true);
    try {
      const res = await fetch('/api/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send_message', phone_number: selectedLead.phone, message })
      });
      const data = await res.json();
      if (data.success) {
        alert('Message sent! AI is now paused (Handoff Mode) for this lead.');
        fetchLeads();
        setSelectedLead(null);
        setCustomMsg('');
      } else {
        alert('Failed to send message.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error.');
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-IN', { 
      day: 'numeric', month: 'short', year: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    }).format(date);
  };

  // Analytics Data Preparation
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach(l => {
      counts[l.status] = (counts[l.status] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({ name: key, count: counts[key] }));
  }, [leads]);

  const intentData = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach(l => {
      const intent = l.intent || 'Unknown';
      counts[intent] = (counts[intent] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, [leads]);

  // Filtering and Pagination
  const filteredLeads = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return leads.filter(l => 
      l.phone.includes(lowerSearch) || 
      (l.data?.name || '').toLowerCase().includes(lowerSearch) ||
      (l.data?.service_type || '').toLowerCase().includes(lowerSearch) ||
      (l.intent || '').toLowerCase().includes(lowerSearch)
    ).sort((a, b) => new Date(b.last_updated || 0).getTime() - new Date(a.last_updated || 0).getTime());
  }, [leads, searchTerm]);

  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-indigo-500">
        <svg className="animate-spin h-8 w-8" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6 md:p-10 max-w-full overflow-x-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 relative min-h-screen bg-[#0B1015]">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Leads Dashboard</h1>
            <p className="mt-2 text-gray-400">Manage, track, and analyze your sales pipeline.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-800">
              <button 
                onClick={() => setViewMode('kanban')}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'kanban' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
              >
                <KanbanSquare className="w-4 h-4 mr-2" /> Pipeline
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
              >
                <LayoutList className="w-4 h-4 mr-2" /> Analytics & List
              </button>
            </div>
            <button 
              onClick={fetchLeads}
              className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Refresh
            </button>
          </div>
        </div>

        {viewMode === 'kanban' ? (
          <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
            {STAGES.map(stage => (
              <div key={stage} className="snap-start">
                <PipelineColumn 
                  title={stage} 
                  leads={leads.filter(l => l.status === stage)} 
                  moveLead={moveLead}
                  onCardClick={setSelectedLead}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Leads by Status</h3>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statusData}>
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} />
                      <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Lead Intents</h3>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={intentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {intentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} />
                      <Legend wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <h3 className="text-lg font-semibold text-gray-900">All Leads Data</h3>
                <div className="relative w-full sm:w-72">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search leads..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg leading-5 bg-gray-950 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-800">
                  <thead className="bg-gray-900/80">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Contact</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status & Intent</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Service details</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Last Activity</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-900/30 divide-y divide-gray-800">
                    {currentLeads.length > 0 ? currentLeads.map((lead) => (
                      <tr key={lead.phone} className="hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/30">
                              {(lead.data?.name || '?').charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{lead.data?.name || 'Unknown'}</div>
                              <div className="text-sm text-gray-500 flex items-center mt-1">
                                <Phone className="w-3 h-3 mr-1" /> +{lead.phone}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-2 items-start w-48">
                            <div className="flex gap-2 items-center">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 border border-indigo-500/20">
                                {lead.status}
                              </span>
                              {lead.intent && (
                                <span className="text-[10px] text-gray-400 font-medium">{lead.intent}</span>
                              )}
                            </div>
                            <LeadProgressTracker lead={lead} />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">{lead.data?.service_type || '-'}</div>
                          <div className="text-xs text-gray-500 mt-1">{lead.data?.city || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {formatDate(lead.last_updated)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button onClick={() => setSelectedLead(lead)} className="text-indigo-400 hover:text-indigo-300 flex items-center justify-end w-full">
                            <MessageSquare className="w-4 h-4 mr-1" /> Reply
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                          No leads found matching your criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="bg-gray-900/80 px-4 py-3 flex items-center justify-between border-t border-gray-800 sm:px-6">
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-400">
                        Showing <span className="font-medium text-gray-900">{indexOfFirstLead + 1}</span> to <span className="font-medium text-gray-900">{Math.min(indexOfLastLead, filteredLeads.length)}</span> of{' '}
                        <span className="font-medium text-gray-900">{filteredLeads.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Previous</span>
                          &larr; Prev
                        </button>
                        {/* Simple page numbers */}
                        <div className="hidden md:flex">
                          {[...Array(totalPages)].map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setCurrentPage(i + 1)}
                              className={`relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium ${
                                currentPage === i + 1 
                                  ? 'z-10 bg-indigo-600 text-white border-indigo-500' 
                                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                              }`}
                            >
                              {i + 1}
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Next</span>
                          Next &rarr;
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal for Quick Reply & Handoff */}
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white border border-gray-200 p-6 rounded-2xl max-w-lg w-full shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Reply to {selectedLead.data?.name || selectedLead.phone}</h2>
                <button onClick={() => setSelectedLead(null)} className="text-gray-500 hover:text-gray-900">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-6 flex items-start">
                <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                Sending a message from here will instantly PAUSE the AI for this user (Handoff Mode).
              </div>

              <textarea 
                rows={4}
                value={customMsg}
                onChange={e => setCustomMsg(e.target.value)}
                placeholder="Type a custom message..."
                className="w-full bg-white border border-gray-300 rounded-xl p-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 mb-4 resize-none"
              />
              
              <button 
                onClick={() => sendMessage(customMsg)}
                disabled={sending || !customMsg.trim()}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium rounded-xl transition-colors mb-6 shadow-lg shadow-indigo-500/20"
              >
                {sending ? 'Sending...' : 'Send Custom Message'}
              </button>

              <div className="relative border-t border-gray-800 pt-6">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-900 px-2 text-xs text-gray-500 font-semibold uppercase tracking-wider">Quick Templates</span>
                
                <div className="grid grid-cols-1 gap-3">
                  <button onClick={() => sendMessage('Sir, please check our pricing here: https://thesanatangurukul.com/book/vastuwithnikhil')} className="py-2.5 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm text-left rounded-lg transition-colors border border-gray-700">
                    📄 Send Pricing Link
                  </button>
                  <button onClick={() => sendMessage('Thank you! Nikhil Sir will call you shortly on this number.')} className="py-2.5 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm text-left rounded-lg transition-colors border border-gray-700">
                    📞 Assure Call
                  </button>
                  <button onClick={() => sendMessage('Can you please share your floor plan PDF so we can review it?')} className="py-2.5 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm text-left rounded-lg transition-colors border border-gray-700">
                    📐 Ask for Floor Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </DndProvider>
  );
}
