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
      (l.name || l.data?.name || '').toLowerCase().includes(lowerSearch) ||
      (l.service_type || l.data?.service_type || '').toLowerCase().includes(lowerSearch) ||
      (l.intent || '').toLowerCase().includes(lowerSearch)
    ).sort((a, b) => new Date(b.last_updated || 0).getTime() - new Date(a.last_updated || 0).getTime());
  }, [leads, searchTerm]);

  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

  if (loading) {
    return (
      <div className="p-6 md:p-10 space-y-6 w-full min-h-screen bg-gray-50 animate-pulse">
        <div className="h-10 bg-gray-200 rounded-lg w-1/4 mb-8"></div>
        <div className="h-32 bg-gray-200 rounded-2xl w-full"></div>
        <div className="h-64 bg-gray-200 rounded-2xl w-full"></div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6 md:p-10 max-w-full overflow-x-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 relative min-h-screen bg-gray-50">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Leads Dashboard</h1>
            <p className="mt-2 text-gray-500">Manage, track, and analyze your sales pipeline.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchLeads}
              className="flex items-center px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 rounded-lg transition-colors border border-gray-200 shadow-sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Refresh
            </button>
          </div>
        </div>

        <div className="space-y-8">


            {/* Table Section */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <h3 className="text-lg font-semibold text-gray-900">All Leads Data</h3>
                <div className="relative w-full sm:w-72">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search leads..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status & Intent</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service details</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentLeads.length > 0 ? currentLeads.map((lead) => (
                      <tr key={lead.phone} onClick={() => setSelectedLead(lead)} className="hover:bg-gray-50 transition-colors cursor-pointer">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-600 font-bold border border-indigo-500/30">
                              {(lead.name || lead.data?.name || '?').charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{lead.name || lead.data?.name || 'Unknown'}</div>
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
                          <div className="text-sm text-gray-800">{lead.service_type || lead.data?.service_type || '-'}</div>
                          <div className="text-xs text-gray-500 mt-1">{lead.city || lead.data?.city || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {formatDate(lead.last_updated)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <span className="text-indigo-600 hover:text-indigo-800 flex items-center justify-end w-full">
                            View Details &rarr;
                          </span>
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
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium text-gray-900">{indexOfFirstLead + 1}</span> to <span className="font-medium text-gray-900">{Math.min(indexOfLastLead, filteredLeads.length)}</span> of{' '}
                        <span className="font-medium text-gray-900">{filteredLeads.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                                currentPage === i + 1 
                                  ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' 
                                  : 'bg-white text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {i + 1}
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
        {/* Modal for Quick Reply & Handoff */}
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white border border-gray-200 p-6 rounded-2xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Lead Details</h2>
                <button onClick={() => setSelectedLead(null)} className="text-gray-400 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Lead Information */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Name</p>
                    <p className="text-gray-900 font-medium">{selectedLead.name || selectedLead.data?.name || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Phone</p>
                    <p className="text-gray-900 font-medium">+{selectedLead.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">City</p>
                    <p className="text-gray-900 font-medium">{selectedLead.city || selectedLead.data?.city || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Service Type</p>
                    <p className="text-gray-900 font-medium">{selectedLead.service_type || selectedLead.data?.service_type || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Status</p>
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">{selectedLead.status}</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Intent</p>
                    <p className="text-gray-900 font-medium">{selectedLead.intent || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </DndProvider>
  );
}
