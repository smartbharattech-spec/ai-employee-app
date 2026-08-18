'use client';

import React, { useState, useEffect } from 'react';

export default function NumbersPage() {
  const [liveStatus, setLiveStatus] = useState<{ connected: boolean; subscribers: any[]; loading: boolean; message: string }>({
    connected: false,
    subscribers: [],
    loading: true,
    message: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [callFilter, setCallFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [conversionFilter, setConversionFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [topFilter, setTopFilter] = useState('all');
  
  // Notes State
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [editingNoteFor, setEditingNoteFor] = useState<string | null>(null);
  const [editNoteText, setEditNoteText] = useState('');
  
  // Mobile Responsiveness State
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState<any>(null);
  const [isEditingModal, setIsEditingModal] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});
  const [isSavingCRM, setIsSavingCRM] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Chat History State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [loadingMoreChat, setLoadingMoreChat] = useState(false);
  const [chatOffset, setChatOffset] = useState(1);
  const [chatSearchTerm, setChatSearchTerm] = useState('');
  const [hasMoreChat, setHasMoreChat] = useState(true);

  useEffect(() => {
    checkLiveStatus();
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/notes');
      const data = await res.json();
      if (data.success) {
        setNotes(data.notes);
      }
    } catch (err) {
      console.error('Error fetching notes', err);
    }
  };

  const saveNote = async (phone_number: string) => {
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number, note: editNoteText })
      });
      if (res.ok) {
        setNotes(prev => ({ ...prev, [phone_number]: editNoteText }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEditingNoteFor(null);
    }
  };

  const checkLiveStatus = async () => {
    setLiveStatus(prev => ({ ...prev, loading: true }));
    try {
      const res = await fetch('/api/whatsapp/subscribers');
      const data = await res.json();
      if (data.success) {
        setLiveStatus({
          connected: true,
          subscribers: data.subscribers || [],
          loading: false,
          message: 'Connected to WhatsMarketing API'
        });
      } else {
        setLiveStatus({
          connected: false,
          subscribers: [],
          loading: false,
          message: data.message || 'Error fetching data'
        });
      }
    } catch (err) {
      setLiveStatus({
        connected: false,
        subscribers: [],
        loading: false,
        message: 'Network error checking status'
      });
    }
  };

  const openChat = async (contact: any) => {
    setSelectedContact(contact);
    setIsChatOpen(true);
    setLoadingChat(true);
    setChatHistory([]);
    setChatOffset(1);
    setChatSearchTerm('');
    setHasMoreChat(true);

    try {
      const res = await fetch(`/api/whatsapp/chat?phone=${contact.chat_id}&offset=1`);
      const data = await res.json();
      if (data.success) {
        if (data.messages.length < 50) setHasMoreChat(false);
        setChatHistory(data.messages.reverse());
      } else {
        setChatHistory([{ id: 0, sender: 'system', text: 'Error loading chat history.' }]);
      }
    } catch (err) {
      setChatHistory([{ id: 0, sender: 'system', text: 'Network error.' }]);
    } finally {
      setLoadingChat(false);
    }
  };

  const loadMoreChat = async () => {
    if (!selectedContact || !hasMoreChat || loadingMoreChat) return;
    setLoadingMoreChat(true);
    const nextOffset = chatOffset + 50;
    
    try {
      const res = await fetch(`/api/whatsapp/chat?phone=${selectedContact.chat_id}&offset=${nextOffset}`);
      const data = await res.json();
      if (data.success) {
        if (data.messages.length < 50) setHasMoreChat(false);
        setChatOffset(nextOffset);
        // Prepend old messages (since reverse means oldest are at top)
        setChatHistory(prev => [...data.messages.reverse(), ...prev]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMoreChat(false);
    }
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setSelectedContact(null);
    setChatHistory([]);
  };

  const wipeMemory = async (phone: string) => {
    if (!confirm('Are you sure you want to wipe memory for +' + phone + '?')) return;
    try {
      const res = await fetch('/api/clear-memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const data = await res.json();
      if (data.success) {
        alert('Memory wiped successfully for +' + phone);
        setDetailsModalOpen(false);
      } else {
        alert('Failed to wipe memory: ' + data.message);
      }
    } catch (err) {
      alert('Error wiping memory');
    }
  };

  const handleQuickStatusChange = async (chat_id: string, newStatus: string, existingCrmData: any) => {
    try {
      const updatedData = { ...(existingCrmData?.data || {}), conversion_status: newStatus };
      const res = await fetch('/api/crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: chat_id, data: updatedData })
      });
      const data = await res.json();
      if (data.success) {
        // Update local state without refreshing
        setLiveStatus(prev => ({
          ...prev,
          subscribers: prev.subscribers.map(s => {
            if (s.chat_id === chat_id) {
              return { ...s, crmData: { ...s.crmData, data: updatedData } };
            }
            return s;
          })
        }));
      } else {
        alert('Failed to update status: ' + data.message);
      }
    } catch (err) {
      alert('Error updating status');
    }
  };

  const handleSaveCRM = async () => {
    if (!selectedDetails) return;
    setIsSavingCRM(true);
    try {
      const res = await fetch('/api/crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: selectedDetails.chat_id, data: editFormData })
      });
      const data = await res.json();
      if (data.success) {
        alert('CRM data saved successfully.');
        setSelectedDetails({ ...selectedDetails, crmData: { ...selectedDetails.crmData, data: editFormData } });
        setIsEditingModal(false);
      } else {
        alert('Failed to save CRM data: ' + data.message);
      }
    } catch (err) {
      alert('Error saving CRM data');
    } finally {
      setIsSavingCRM(false);
    }
  };

  
  const filteredSubscribers = liveStatus.subscribers.filter((sub: any) => {
    // Search Term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (!(sub.first_name && sub.first_name.toLowerCase().includes(term)) && !(sub.chat_id && sub.chat_id.includes(term))) {
        return false;
      }
    }
    
    // Time Filter (assuming sub.last_updated exists, fallback to true if not)
    if (timeFilter !== 'all' && sub.last_updated) {
        const now = new Date();
        const updated = new Date(sub.last_updated.replace(' ', 'T'));
        if (!isNaN(updated.getTime())) {
            const diffDays = Math.ceil(Math.abs(now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24));
            if (timeFilter === 'daily' && diffDays > 1) return false;
            if (timeFilter === 'weekly' && diffDays > 7) return false;
            if (timeFilter === 'monthly' && diffDays > 30) return false;
        }
    }
    
    // Status Filter
    const qualS = ['Hot', 'Qualified', 'Meeting', 'Won'];
    const status = sub.crmData?.status || 'Cold';
    if (statusFilter !== 'all') {
        if (statusFilter === 'qualified' && !qualS.includes(status)) return false;
        if (statusFilter === 'not_qualified' && qualS.includes(status)) return false;
    }
    
    // Call Filter
    const calls = sub.crmData?.data?.calls || [];
    if (callFilter !== 'all') {
        if (callFilter === 'called' && calls.length === 0) return false;
        if (callFilter === 'not_called' && calls.length > 0) return false;
    }
    
    // Payment Filter
    const payment = sub.crmData?.data?.payment_status || 'not_paid';
    if (paymentFilter !== 'all' && paymentFilter !== payment) return false;
    
    // Conversion Filter
    const conversion = sub.crmData?.data?.conversion_status || 'new';
    if (conversionFilter !== 'all' && conversionFilter !== conversion) return false;

    // Top Filter logic
    if (topFilter !== 'all') {
        if (topFilter === 'pending' && calls.length > 0) return false;
        if (topFilter === 'followups' && conversion !== 'followup') return false;
        if (topFilter === 'converted' && conversion !== 'converted') return false;
        if (topFilter === 'lost' && conversion !== 'lost') return false;
    }

    return true;
  });

  // Calculate Stats
  const serviceFilterFn = (s:any, category: string) => {
      const data = s.crmData?.data || {};
      const sType = (data.service_type || '').toString().toLowerCase();
      const pType = (data.planning_type || '').toString().toLowerCase();
      const pref = (data.consultant_pref || '').toString().toLowerCase();
      
      if (category === 'consultation') return sType.includes('consultation') || sType === '1' || pref.includes('consultation') || pref.includes('nikhil');
      if (category === 'new_house') return sType.includes('house') || sType === '2' || pType.includes('house') || pType.includes('interior');
      if (category === 'architecture') return sType.includes('architecture') || sType === '3' || sType.includes('partner');
      return false;
  };

  const qualS = ['Hot', 'Qualified', 'Meeting', 'Won'];
  const stats = {
      total: filteredSubscribers.length,
      pending: filteredSubscribers.filter((s:any) => !(s.crmData?.data?.calls || []).length).length,
      followups: filteredSubscribers.filter((s:any) => s.crmData?.data?.conversion_status === 'followup').length,
      converted: filteredSubscribers.filter((s:any) => s.crmData?.data?.conversion_status === 'converted').length,
      lost: filteredSubscribers.filter((s:any) => s.crmData?.data?.conversion_status === 'lost').length,
      
      consultation: liveStatus.subscribers.filter((s:any) => serviceFilterFn(s, 'consultation')).length,
      new_house: liveStatus.subscribers.filter((s:any) => serviceFilterFn(s, 'new_house')).length,
      architecture: liveStatus.subscribers.filter((s:any) => serviceFilterFn(s, 'architecture')).length,
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSubscribers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSubscribers.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      
      <div className="flex justify-end mb-2"></div>

      <div className={`transition-all duration-300 ${isChatOpen ? 'md:pr-[400px]' : ''}`}>
      
      {/* Top Cards: 1 line metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

          <button onClick={() => setTopFilter(topFilter === 'pending' ? 'all' : 'pending')} className={`shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-none p-5 rounded-3xl flex items-center gap-4 text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${topFilter === 'pending' ? 'bg-blue-600 text-white shadow-[0_8px_30px_rgba(37,99,235,0.3)]' : 'bg-white'}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${topFilter === 'pending' ? 'bg-blue-500/30 text-white' : 'bg-blue-50 text-blue-500'}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              </div>
              <div><p className={`text-[12px] font-extrabold uppercase tracking-wider mb-0.5 ${topFilter === 'pending' ? 'text-blue-200' : 'text-slate-400'}`}>Pending Calls</p><p className={`text-2xl font-black leading-none ${topFilter === 'pending' ? 'text-white' : 'text-slate-800'}`}>{stats.pending}</p></div>
          </button>
          
          <button onClick={() => setTopFilter(topFilter === 'followups' ? 'all' : 'followups')} className={`shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-none p-5 rounded-3xl flex items-center gap-4 text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${topFilter === 'followups' ? 'bg-amber-500 text-white shadow-[0_8px_30px_rgba(245,158,11,0.3)]' : 'bg-white'}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${topFilter === 'followups' ? 'bg-amber-400/30 text-white' : 'bg-amber-50 text-amber-500'}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div><p className={`text-[12px] font-extrabold uppercase tracking-wider mb-0.5 ${topFilter === 'followups' ? 'text-amber-100' : 'text-slate-400'}`}>Followups</p><p className={`text-2xl font-black leading-none ${topFilter === 'followups' ? 'text-white' : 'text-slate-800'}`}>{stats.followups}</p></div>
          </button>
          
          <button onClick={() => setTopFilter(topFilter === 'converted' ? 'all' : 'converted')} className={`shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-none p-5 rounded-3xl flex items-center gap-4 text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${topFilter === 'converted' ? 'bg-emerald-500 text-white shadow-[0_8px_30px_rgba(16,185,129,0.3)]' : 'bg-white'}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${topFilter === 'converted' ? 'bg-emerald-400/30 text-white' : 'bg-emerald-50 text-emerald-500'}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div><p className={`text-[12px] font-extrabold uppercase tracking-wider mb-0.5 ${topFilter === 'converted' ? 'text-emerald-100' : 'text-slate-400'}`}>Converted</p><p className={`text-2xl font-black leading-none ${topFilter === 'converted' ? 'text-white' : 'text-slate-800'}`}>{stats.converted}</p></div>
          </button>
          
          <button onClick={() => setTopFilter(topFilter === 'lost' ? 'all' : 'lost')} className={`shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-none p-5 rounded-3xl flex items-center gap-4 text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${topFilter === 'lost' ? 'bg-red-500 text-white shadow-[0_8px_30px_rgba(239,68,68,0.3)]' : 'bg-white'}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${topFilter === 'lost' ? 'bg-red-400/30 text-white' : 'bg-red-50 text-red-500'}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div><p className={`text-[12px] font-extrabold uppercase tracking-wider mb-0.5 ${topFilter === 'lost' ? 'text-red-100' : 'text-slate-400'}`}>Lost</p><p className={`text-2xl font-black leading-none ${topFilter === 'lost' ? 'text-white' : 'text-slate-800'}`}>{stats.lost}</p></div>
          </button>
      </div>

      {/* Service Grouping Cards */}
      <h3 className="text-[14px] font-extrabold text-slate-800 uppercase tracking-wider mb-3 ml-2">Services Filter</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button onClick={() => setServiceFilter(serviceFilter === 'consultation' ? 'all' : 'consultation')} className={`text-left p-5 rounded-3xl transition-all border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] ${serviceFilter === 'consultation' ? 'bg-indigo-600 text-white shadow-[0_8px_30px_rgba(79,70,229,0.3)] transform scale-[1.02]' : 'bg-white hover:bg-slate-50'}`}>
          <div className="flex justify-between items-center mb-2">
            <h4 className={`font-black text-lg ${serviceFilter === 'consultation' ? 'text-white' : 'text-slate-800'}`}>Consultation</h4>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${serviceFilter === 'consultation' ? 'bg-indigo-500/30 text-white' : 'bg-indigo-50 text-indigo-600'}`}>{stats.consultation}</span>
          </div>
          <p className={`text-xs font-semibold ${serviceFilter === 'consultation' ? 'text-indigo-200' : 'text-slate-400'}`}>Team consultation, Nikhil sir consultation</p>
        </button>

        <button onClick={() => setServiceFilter(serviceFilter === 'new_house' ? 'all' : 'new_house')} className={`text-left p-5 rounded-3xl transition-all border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] ${serviceFilter === 'new_house' ? 'bg-emerald-600 text-white shadow-[0_8px_30px_rgba(5,150,105,0.3)] transform scale-[1.02]' : 'bg-white hover:bg-slate-50'}`}>
          <div className="flex justify-between items-center mb-2">
            <h4 className={`font-black text-lg ${serviceFilter === 'new_house' ? 'text-white' : 'text-slate-800'}`}>New House Planning</h4>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${serviceFilter === 'new_house' ? 'bg-emerald-500/30 text-white' : 'bg-emerald-50 text-emerald-600'}`}>{stats.new_house}</span>
          </div>
          <p className={`text-xs font-semibold ${serviceFilter === 'new_house' ? 'text-emerald-200' : 'text-slate-400'}`}>New house planning, interior planning</p>
        </button>

        <button onClick={() => setServiceFilter(serviceFilter === 'architecture' ? 'all' : 'architecture')} className={`text-left p-5 rounded-3xl transition-all border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] ${serviceFilter === 'architecture' ? 'bg-rose-500 text-white shadow-[0_8px_30px_rgba(244,63,94,0.3)] transform scale-[1.02]' : 'bg-white hover:bg-slate-50'}`}>
          <div className="flex justify-between items-center mb-2">
            <h4 className={`font-black text-lg ${serviceFilter === 'architecture' ? 'text-white' : 'text-slate-800'}`}>Architecture</h4>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${serviceFilter === 'architecture' ? 'bg-rose-500/30 text-white' : 'bg-rose-50 text-rose-600'}`}>{stats.architecture}</span>
          </div>
          <p className={`text-xs font-semibold ${serviceFilter === 'architecture' ? 'text-rose-200' : 'text-slate-400'}`}>Partner program</p>
        </button>
      </div>

      {/* Main Content Area */}
        <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-3xl overflow-hidden shadow-lg flex flex-col">
          
          {/* Toolbar */}
          <div className="p-6 border-b border-gray-100 bg-white flex flex-wrap items-center justify-between gap-4">
            <div className="relative w-full max-w-md">
              <svg className="absolute left-4 top-3 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input 
                type="text" 
                placeholder="Search by name or number..." 
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              />
            </div>
            <div className="flex items-center gap-4 text-gray-600 text-sm font-medium">
              <label>Rows per page: </label>
              <select 
                className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-emerald-500"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="hidden sm:block pl-2 border-l border-gray-300">{filteredSubscribers.length} Total Contacts</span>
            </div>
          </div>

          {/* Data List */}
          <div className="flex-1 overflow-x-auto min-h-[400px]">
            {liveStatus.loading ? (
              <div className="p-6 space-y-4 animate-pulse w-full">
                <div className="h-10 bg-gray-200 rounded w-full"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            ) : !liveStatus.connected ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500 p-6 text-center">
                <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="text-lg text-gray-900">{liveStatus.message}</p>
                <p className="text-sm mt-1">Go to the Settings page to configure your API keys.</p>
              </div>
            ) : currentItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500 p-6 text-center">
                <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                <p className="text-lg text-gray-900">No contacts found.</p>
                <p className="text-sm mt-1">Your search did not match any active subscribers.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse bg-white border-y border-gray-200">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                    <th className="px-6 py-4 hidden md:table-cell">Contact</th>
                    <th className="px-6 py-4">Phone Number</th>
                    <th className="px-6 py-4 hidden md:table-cell">Status</th>
                    <th className="px-6 py-4 hidden md:table-cell">Notes</th>

                    <th className="px-6 py-4 text-right hidden md:table-cell">Actions</th>
                    <th className="px-6 py-4 text-right md:hidden"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentItems.map((sub: any, idx: number) => {
                    const isTestNumber = sub.chat_id === '918707526283' || sub.chat_id === '917597571515';
                    return (
                      <React.Fragment key={idx}>
                        <tr className={`transition-colors ${isTestNumber ? 'bg-yellow-50 hover:bg-yellow-100' : 'hover:bg-gray-50'}`}>
                          <td className="px-6 py-4 hidden md:table-cell">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 flex flex-shrink-0 items-center justify-center text-emerald-600 border border-emerald-100">
                              {sub.first_name ? sub.first_name.charAt(0).toUpperCase() : '?'}
                            </div>
                            <div className="font-medium text-gray-900">{sub.first_name || 'Unknown User'}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-gray-700">
                          +{sub.chat_id}
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <div className="relative group/status w-full">
                            {(() => {
                              const curr = sub.crmData?.data?.conversion_status || 'new';
                              let badgeClass = "bg-slate-100 text-slate-600 border-slate-200";
                              let label = "New Lead";
                              if (curr === 'followup') { badgeClass = "bg-amber-50 text-amber-600 border-amber-200"; label = "Follow-up 🔄"; }
                              else if (curr === 'converted') { badgeClass = "bg-emerald-50 text-emerald-600 border-emerald-200"; label = "Converted ✅"; }
                              else if (curr === 'lost') { badgeClass = "bg-red-50 text-red-600 border-red-200"; label = "Lost ❌"; }
                              
                              return (
                                <div className={`inline-flex items-center justify-between w-32 px-3 py-1.5 rounded-lg border text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-colors ${badgeClass}`}>
                                  {label}
                                  <svg className="w-3 h-3 opacity-0 group-hover/status:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                              );
                            })()}
                            
                            {/* Dropdown Menu on Hover */}
                            <div className="absolute left-0 top-full mt-1 w-36 bg-white border border-gray-100 rounded-xl shadow-lg opacity-0 invisible group-hover/status:opacity-100 group-hover/status:visible transition-all z-20 overflow-hidden flex flex-col p-1">
                              {[
                                { value: 'new', label: 'New Lead' },
                                { value: 'followup', label: 'Follow-up 🔄' },
                                { value: 'converted', label: 'Converted ✅' },
                                { value: 'lost', label: 'Lost ❌' }
                              ].map(opt => (
                                <button
                                  key={opt.value}
                                  onClick={(e) => { e.stopPropagation(); handleQuickStatusChange(sub.chat_id, opt.value, sub.crmData); }}
                                  className={`text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-colors ${(sub.crmData?.data?.conversion_status || 'new') === opt.value ? 'bg-slate-50 text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 max-w-[200px] md:max-w-xs hidden md:table-cell">
                          {editingNoteFor === sub.chat_id ? (
                            <div className="flex items-center gap-2">
                              <input 
                                type="text"
                                value={editNoteText}
                                onChange={(e) => setEditNoteText(e.target.value)}
                                className="w-full bg-white border border-emerald-300 rounded-md px-2 py-1 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                placeholder="Type note..."
                                autoFocus
                              />
                              <button onClick={() => saveNote(sub.chat_id)} className="text-green-400 hover:text-green-300">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                              </button>
                              <button onClick={() => setEditingNoteFor(null)} className="text-red-400 hover:text-red-300">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                              </button>
                            </div>
                          ) : (
                            <div 
                              className="text-gray-600 text-sm truncate cursor-pointer hover:text-emerald-600 transition-colors flex items-center gap-2 group"
                              onClick={() => {
                                setEditingNoteFor(sub.chat_id);
                                setEditNoteText(notes[sub.chat_id] || '');
                              }}
                            >
                              <span>{notes[sub.chat_id] || <em className="text-gray-400">Add note...</em>}</span>
                              <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-4 text-right hidden md:table-cell relative">
                          <button 
                            onClick={() => setOpenDropdownId(openDropdownId === sub.chat_id ? null : sub.chat_id)}
                            className="p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                          </button>
                          
                          {openDropdownId === sub.chat_id && (
                            <div className="absolute right-6 top-14 mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-10 py-1 overflow-hidden">
                              <button 
                                onClick={() => { 
                                  setSelectedDetails(sub); 
                                  setDetailsModalOpen(true); 
                                  setOpenDropdownId(null);
                                  setIsEditingModal(false);
                                  setEditFormData(sub.crmData?.data || {});
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors flex items-center"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                View Details
                              </button>
                              <button 
                                onClick={() => { openChat(sub); setOpenDropdownId(null); }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors flex items-center"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                View Chat
                              </button>
                              <button 
                                onClick={() => { wipeMemory(sub.chat_id); setOpenDropdownId(null); }}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                Clear Memory
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right md:hidden">
                          <button 
                            onClick={() => setExpandedRowId(expandedRowId === sub.chat_id ? null : sub.chat_id)}
                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                          </button>
                        </td>
                      </tr>
                      
                      {/* Mobile Expanded Row */}
                      {expandedRowId === sub.chat_id && (
                        <tr className="md:hidden bg-gray-900/30">
                          <td colSpan={2} className="px-6 py-4 border-b border-gray-800">
                            <div className="flex flex-col gap-4">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Contact</span>
                                <div className="font-medium text-white flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex flex-shrink-0 items-center justify-center text-emerald-400 border border-emerald-500/20 text-xs">
                                    {sub.first_name ? sub.first_name.charAt(0).toUpperCase() : '?'}
                                  </div>
                                  {sub.first_name || 'Unknown User'}
                                </div>
                              </div>
                              
                              <div className="flex flex-col gap-2">
                                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Notes</span>
                                {editingNoteFor === sub.chat_id ? (
                                  <div className="flex items-center gap-2 w-full">
                                    <input 
                                      type="text"
                                      value={editNoteText}
                                      onChange={(e) => setEditNoteText(e.target.value)}
                                      className="flex-1 bg-gray-950 border border-emerald-500 rounded-md px-2 py-1 text-sm text-white focus:outline-none"
                                      placeholder="Type note..."
                                      autoFocus
                                    />
                                    <button onClick={() => saveNote(sub.chat_id)} className="text-green-400 hover:text-green-300">
                                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    </button>
                                    <button onClick={() => setEditingNoteFor(null)} className="text-red-400 hover:text-red-300">
                                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                  </div>
                                ) : (
                                  <div 
                                    className="text-gray-400 text-sm cursor-pointer hover:text-emerald-400 transition-colors flex items-center gap-2 bg-gray-950/50 p-3 rounded-lg border border-gray-800"
                                    onClick={() => {
                                      setEditingNoteFor(sub.chat_id);
                                      setEditNoteText(notes[sub.chat_id] || '');
                                    }}
                                  >
                                    <span className="flex-1">{notes[sub.chat_id] || <em className="text-gray-600">Tap to add a note...</em>}</span>
                                    <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                                <div className="flex items-center gap-2">
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <button 
                                    onClick={() => wipeMemory(sub.chat_id)}
                                    className="text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors text-sm font-medium px-3 py-2 rounded-lg border border-red-500/20"
                                  >
                                    Clear Memory
                                  </button>
                                  <button 
                                    onClick={() => openChat(sub)}
                                    className="text-white bg-emerald-600 hover:bg-emerald-700 transition-colors text-sm font-medium px-4 py-2 rounded-lg shadow-lg shadow-emerald-500/30"
                                  >
                                    Open Chat
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
                </tbody>
              </table>
            )}
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-800 bg-gray-900/30 flex items-center justify-between">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <div className="text-sm text-gray-400">
                Page {currentPage} of {totalPages}
              </div>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chat History Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full md:w-[400px] bg-gray-950 border-l border-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isChatOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {selectedContact && (
          <div className="flex flex-col h-full">
            {/* Drawer Header */}
            <div className="p-4 border-b border-gray-800 bg-gray-900/50 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold border border-emerald-500/30">
                    {selectedContact.first_name ? selectedContact.first_name.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{selectedContact.first_name || 'Unknown'}</h3>
                    <p className="text-xs text-gray-400">+{selectedContact.chat_id}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => wipeMemory(selectedContact.chat_id)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors flex items-center justify-center border border-red-500/20"
                    title="Delete Chat History"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                  <button 
                    onClick={closeChat}
                    className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors flex items-center justify-center"
                    title="Close Chat"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>

              {/* Chat Search Bar */}
              <div className="relative">
                <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input 
                  type="text" 
                  placeholder="Search in conversation..." 
                  value={chatSearchTerm}
                  onChange={(e) => setChatSearchTerm(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
            
            {/* Drawer Body (Chat Messages) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0B1015]">
              {loadingChat ? (
                <div className="flex items-center justify-center h-full text-gray-500 flex-col gap-3">
                  <svg className="animate-spin h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span>Loading history...</span>
                </div>
              ) : chatHistory.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>No messages found.</p>
                </div>
              ) : (
                <>
                  {hasMoreChat && !chatSearchTerm && (
                    <div className="flex justify-center my-4">
                      <button 
                        onClick={loadMoreChat}
                        disabled={loadingMoreChat}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium rounded-full transition-colors disabled:opacity-50"
                      >
                        {loadingMoreChat ? 'Loading...' : 'Load older messages'}
                      </button>
                    </div>
                  )}

                  {chatHistory.filter(m => !chatSearchTerm || m.text?.toLowerCase().includes(chatSearchTerm.toLowerCase())).map((msg: any) => {
                    const isUser = msg.sender === 'user';
                    const isSystem = msg.sender === 'system';
                    
                    if (isSystem) {
                      return (
                        <div key={msg.id} className="flex justify-center my-4">
                          <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-lg text-xs border border-red-500/20">{msg.text}</span>
                        </div>
                      );
                    }

                    return (
                      <div key={msg.id} className={`flex ${!isUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-2 shadow-sm ${
                          !isUser 
                            ? 'bg-emerald-600 text-white rounded-br-sm' 
                            : 'bg-gray-800 text-gray-100 rounded-bl-sm border border-gray-700'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                          {msg.time && (
                            <p className={`text-[10px] mt-1 text-right ${!isUser ? 'text-emerald-200' : 'text-gray-500'}`}>
                              {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  
                  {chatHistory.filter(m => !chatSearchTerm || m.text?.toLowerCase().includes(chatSearchTerm.toLowerCase())).length === 0 && (
                    <div className="flex items-center justify-center py-8 text-gray-500">
                      <p>No matching messages found.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      
      {/* View Details Modal */}
      {detailsModalOpen && selectedDetails && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] w-full max-w-4xl overflow-hidden flex flex-col">
            
            {/* Modal Body */}
            <div className="p-8 overflow-y-auto max-h-[85vh] space-y-6">
              
              {/* Lead Information */}
              <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-6">
                <h4 className="text-[13px] font-extrabold text-slate-600 mb-6 uppercase tracking-wider">Lead Information</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Name</p>
                    <p className="font-semibold text-slate-900">{selectedDetails.first_name || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Phone</p>
                    <p className="font-semibold text-blue-500">+{selectedDetails.chat_id}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">City</p>
                    <p className="font-semibold text-slate-900">{selectedDetails.crmData?.data?.city || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Details</p>
                    <p className="font-semibold text-slate-900">{selectedDetails.crmData?.data?.service_type || selectedDetails.crmData?.data?.property_type || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Qualified On</p>
                    <p className="font-semibold text-slate-900">{new Date(selectedDetails.last_msg_time || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Status</p>
                    <p className="font-semibold text-slate-900">{selectedDetails.crmData?.status || 'New'}</p>
                  </div>
                </div>
              </div>

              {/* Call Management */}
              <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-6">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-[13px] font-extrabold text-slate-600 uppercase tracking-wider">Call Management</h4>
                  <button onClick={() => {
                      const newCalls = [...(editFormData.calls || [])];
                      newCalls.push({ id: Date.now(), date: new Date().toISOString().split('T')[0], intent: '', status: 'not_connected', response: '' });
                      setEditFormData({...editFormData, calls: newCalls});
                  }} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg> Add Call
                  </button>
                </div>
                
                {(editFormData.calls || []).map((call:any, index:number) => (
                  <div key={call.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 relative group">
                    <button onClick={() => {
                        const newCalls = [...editFormData.calls];
                        newCalls.splice(index, 1);
                        setEditFormData({...editFormData, calls: newCalls});
                    }} className="absolute right-4 top-4 text-red-400 hover:text-red-600 bg-red-50 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4"/></svg>
                    </button>
                    <p className="text-[11px] font-bold text-slate-400 mb-3 uppercase tracking-wider">Call #{index + 1} &mdash; {call.date}</p>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <input type="text" placeholder="Intent" value={call.intent} onChange={(e) => {
                          const newCalls = [...editFormData.calls]; newCalls[index].intent = e.target.value; setEditFormData({...editFormData, calls: newCalls});
                      }} className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 w-full" />
                      <select value={call.status} onChange={(e) => {
                          const newCalls = [...editFormData.calls]; newCalls[index].status = e.target.value; setEditFormData({...editFormData, calls: newCalls});
                      }} className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 w-full">
                          <option value="connected">Connected ✅</option><option value="not_connected">Not Connected ❌</option><option value="busy">Busy 🔴</option><option value="no_answer">No Answer 📵</option><option value="switched_off">Switched Off ⚫</option>
                      </select>
                    </div>
                    <textarea placeholder="Response / Baat kya hui" value={call.response} onChange={(e) => {
                        const newCalls = [...editFormData.calls]; newCalls[index].response = e.target.value; setEditFormData({...editFormData, calls: newCalls});
                    }} className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 w-full" rows={2} />
                  </div>
                ))}
                {(editFormData.calls || []).length === 0 && (
                  <p className="text-[13px] text-slate-400 text-center py-6">No calls recorded. Click "Add Call" to log one.</p>
                )}
              </div>

              {/* Payment & Conversion Status */}
              <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-6">
                <h4 className="text-[13px] font-extrabold text-slate-600 mb-6 uppercase tracking-wider">Payment & Conversion Status</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h5 className="text-[13px] font-extrabold text-slate-600 mb-4 tracking-wider">Payment Status</h5>
                    <div className="flex flex-col gap-4">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                          <input type="radio" name="payment_status" className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-full checked:border-orange-500 transition-colors cursor-pointer" checked={editFormData.payment_status === 'paid'} onChange={() => setEditFormData({...editFormData, payment_status: 'paid'})} />
                          <div className="absolute w-2.5 h-2.5 bg-orange-500 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
                        </div>
                        <span className="text-[14px] font-semibold text-slate-900 group-hover:text-orange-500 transition-colors">Paid ✅</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                          <input type="radio" name="payment_status" className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-full checked:border-orange-500 transition-colors cursor-pointer" checked={editFormData.payment_status !== 'paid'} onChange={() => setEditFormData({...editFormData, payment_status: 'not_paid'})} />
                          <div className="absolute w-2.5 h-2.5 bg-orange-500 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
                        </div>
                        <span className="text-[14px] font-semibold text-slate-900 group-hover:text-orange-500 transition-colors">Not Paid</span>
                      </label>
                    </div>
                    {editFormData.payment_status === 'paid' && (
                        <input type="number" placeholder="Amount (₹)" value={editFormData.payment_amount || ''} onChange={(e) => setEditFormData({...editFormData, payment_amount: e.target.value})} className="border border-slate-200 rounded-xl px-4 py-2 text-sm mt-4 w-full focus:outline-none focus:border-blue-500" />
                    )}
                  </div>
                  <div>
                    <h5 className="text-[13px] font-extrabold text-slate-600 mb-4 tracking-wider">Conversion Status</h5>
                    <div className="flex flex-col gap-4">
                      {[
                        { value: 'new', label: 'New Lead' },
                        { value: 'followup', label: 'Follow-up 🔄' },
                        { value: 'converted', label: 'Converted ✅' },
                        { value: 'lost', label: 'Lost ❌' }
                      ].map(opt => (
                        <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative flex items-center justify-center">
                            <input type="radio" name="conversion_status" className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-full checked:border-orange-500 transition-colors cursor-pointer" checked={(editFormData.conversion_status || 'new') === opt.value} onChange={() => setEditFormData({...editFormData, conversion_status: opt.value})} />
                            <div className="absolute w-2.5 h-2.5 bg-orange-500 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
                          </div>
                          <span className="text-[14px] font-semibold text-slate-900 group-hover:text-orange-500 transition-colors">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <textarea placeholder="Notes" value={editFormData.notes || ''} onChange={(e) => setEditFormData({...editFormData, notes: e.target.value})} className="border border-slate-200 rounded-xl px-4 py-3 text-sm mt-8 w-full focus:outline-none focus:border-blue-500" rows={3} />
              </div>

            </div>
            
            {/* Modal Footer */}
            <div className="p-6 pt-4 flex justify-end gap-4 border-t-0">
              <button 
                onClick={() => setDetailsModalOpen(false)}
                className="px-6 py-2 bg-transparent text-[14px] font-bold text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveCRM} disabled={isSavingCRM}
                className="px-8 py-2.5 bg-emerald-500 text-white rounded-xl text-[14px] font-bold hover:bg-emerald-600 transition-colors shadow-[0_4px_14px_rgba(16,185,129,0.3)] disabled:opacity-50"
              >
                {isSavingCRM ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}