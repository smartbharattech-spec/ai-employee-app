'use client';

import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

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
      className={`bg-gray-800 border border-gray-700 p-4 rounded-xl mb-3 shadow-lg cursor-grab active:cursor-grabbing hover:border-indigo-500/50 transition-colors ${
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
      <h3 className="font-bold text-white text-sm">{lead.data.name || 'Unknown Lead'}</h3>
      <p className="text-gray-400 text-xs mt-1 font-mono">+{lead.phone}</p>
      
      {(lead.data.service_type || lead.data.city) && (
        <div className="mt-3 text-xs text-gray-500 space-y-1">
          {lead.data.service_type && <p><span className="text-gray-400">Service:</span> {lead.data.service_type}</p>}
          {lead.data.city && <p><span className="text-gray-400">City:</span> {lead.data.city}</p>}
        </div>
      )}
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
      className={`flex-shrink-0 w-72 bg-gray-900/50 rounded-2xl p-4 border ${
        isOver ? 'border-indigo-500 bg-gray-800/50' : 'border-gray-800'
      } transition-colors`}
    >
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="font-semibold text-gray-300">{title}</h2>
        <span className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded-md">{leads.length}</span>
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
    // Optimistic update
    setLeads(prev => prev.map(l => l.phone === phone ? { ...l, status: newStatus } : l));
    
    try {
      await fetch('/api/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_status', phone_number: phone, status: newStatus })
      });
    } catch (err) {
      console.error('Failed to update status', err);
      fetchLeads(); // Revert on failure
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
        fetchLeads(); // Refresh leads to show Handoff tag
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
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Visual Pipeline</h1>
            <p className="mt-2 text-gray-400">Drag and drop leads to manage your sales stages.</p>
          </div>
          <button 
            onClick={fetchLeads}
            className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors border border-gray-700"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Refresh
          </button>
        </div>

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

        {/* Modal for Quick Reply & Handoff */}
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl max-w-lg w-full shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Reply to {selectedLead.data.name || selectedLead.phone}</h2>
                <button onClick={() => setSelectedLead(null)} className="text-gray-400 hover:text-white">
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
                className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 mb-4 resize-none"
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
