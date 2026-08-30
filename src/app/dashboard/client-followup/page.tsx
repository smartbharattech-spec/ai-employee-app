'use client';

import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';

export default function ClientFollowupsPage() {
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
  const [conversionFilter, setConversionFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [topFilter, setTopFilter] = useState('converted');
  
  // Notes State
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [editingNoteFor, setEditingNoteFor] = useState<string | null>(null);
  const [editNoteText, setEditNoteText] = useState('');
  
  // Mobile Responsiveness State
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [openStepDropdownId, setOpenStepDropdownId] = useState<string | null>(null);
  const [serviceCategories, setServiceCategories] = useState<any[]>([]);
  
  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.service_categories) {
          try {
            setServiceCategories(JSON.parse(data.data.service_categories));
          } catch(e) {}
        }
      })
      .catch(() => {});
  }, []);

  const handleStepChange = async (chat_id: string, stepLabel: string, existingCrmData: any) => {
    setIsSavingCRM(true);
    try {
        let updatedData = { ...(existingCrmData?.data || {}), service_step_name: stepLabel };
        const fullPayload = { ...(existingCrmData || {}), data: updatedData };
        
        const res = await fetch('/api/crm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone_number: chat_id, data: fullPayload })
        });
        if (res.ok) {
            fetchSubscribers();
        }
    } catch (err) {
        console.error(err);
    } finally {
        setIsSavingCRM(false);
        setOpenStepDropdownId(null);
    }
  };
  const [openStatusMenuId, setOpenStatusMenuId] = useState<string | null>(null);
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

  // Amount Modal State
  const [amountModalOpen, setAmountModalOpen] = useState(false);
  const [amountModalValue, setAmountModalValue] = useState('');
  const [amountModalPending, setAmountModalPending] = useState<{chat_id: string; existingCrmData: any} | null>(null);

  // Followup Modal State
  const [followupModalOpen, setFollowupModalOpen] = useState(false);
  const [followupDate, setFollowupDate] = useState('');

  const [followupTime, setFollowupTime] = useState('');
  const [followupNote, setFollowupNote] = useState('');
  const [followupCurrentNote, setFollowupCurrentNote] = useState('');
  const [followupType, setFollowupType] = useState('call');
  const [followupPending, setFollowupPending] = useState<{chat_id: string; existingCrmData: any} | null>(null);

  const [stats, setStats] = useState<any>({
    total: 0, pending: 0, followups: 0, converted: 0, totalCollection: 0, lost: 0,
    consultation: 0, team_consultation: 0, nikhil_consultation: 0, new_house: 0, new_house_planning: 0, interior_planning: 0, architecture: 0
  });
  const [totalContacts, setTotalContacts] = useState(0);

  useEffect(() => {
    checkLiveStatus();
  }, [currentPage, itemsPerPage, searchTerm, timeFilter, statusFilter, callFilter, conversionFilter, serviceFilter, topFilter]);

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.action-menu-container')) {
        setOpenDropdownId(null);
        setOpenStatusMenuId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/notes');
      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        console.error('Invalid JSON from /api/notes:', text);
        return;
      }
      
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
      const text = await res.text();
      if (res.ok) {
        setNotes(prev => ({ ...prev, [phone_number]: editNoteText }));
      } else {
        console.error('Failed to save note:', text);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEditingNoteFor(null);
    }
  };

  const handleQuickStatusChange = async (chat_id: string, newStatus: string, existingCrmData: any) => {
    if (newStatus === 'converted') {
        setAmountModalPending({ chat_id, existingCrmData });
        setAmountModalOpen(true);
        return;
    }
    if (newStatus === 'followup') {
        setFollowupPending({ chat_id, existingCrmData });
        setFollowupModalOpen(true);
        return;
    }
    
    setIsSavingCRM(true);
    try {
        let updatedData = { ...(existingCrmData?.data || {}), conversion_status: newStatus };
        const fullPayload = { ...(existingCrmData || {}), data: updatedData };
        
        const res = await fetch('/api/crm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone_number: chat_id, data: fullPayload })
        });
        
        const data = await res.json();
        if (data.success) {
            toast.success(`Status updated to ${newStatus}`);
            checkLiveStatus();
        } else {
            toast.error(data.message || 'Failed to update status');
        }
    } catch(err) {
        toast.error('Network error');
    } finally {
        setIsSavingCRM(false);
    }
  };

  const handleAmountModalConfirm = async () => {
    if (!amountModalPending) return;
    
    setIsSavingCRM(true);
    try {
        let updatedData = { 
            ...(amountModalPending.existingCrmData?.data || {}), 
            conversion_status: 'converted',
            payment_amount: amountModalValue || ''
        };
        const fullPayload = { ...(amountModalPending.existingCrmData || {}), data: updatedData };
        
        const res = await fetch('/api/crm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone_number: amountModalPending.chat_id, data: fullPayload })
        });
        
        const data = await res.json();
        if (data.success) {
            toast.success(`Marked as Converted`);
            setAmountModalOpen(false);
            setAmountModalPending(null);
            setAmountModalValue('');
            checkLiveStatus();
        } else {
            toast.error(data.message || 'Failed to update status');
        }
    } catch(err) {
        toast.error('Network error');
    } finally {
        setIsSavingCRM(false);
    }
  };

  const handleFollowupModalConfirm = async () => {
    if (!followupPending) return;
    
    setIsSavingCRM(true);
    try {
        let updatedData = { ...(followupPending.existingCrmData?.data || {}) };
        const history = updatedData.followup_history || [];
        
        history.push({
            date: followupDate,
            time: followupTime,
            note: followupCurrentNote,
            next_note: followupNote,
            type: followupType,
            id: Date.now()
        });
        
        updatedData = { 
            ...updatedData, 
            conversion_status: 'followup',
            followup_history: history
        };
        const fullPayload = { ...(followupPending.existingCrmData || {}), data: updatedData };
        
        const res = await fetch('/api/crm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone_number: followupPending.chat_id, data: fullPayload })
        });
        
        const data = await res.json();
        if (data.success) {
            toast.success(`Follow-up Scheduled`);
            setFollowupModalOpen(false);
            setFollowupPending(null);
            setFollowupDate('');
            setFollowupTime('');
            setFollowupCurrentNote('');
            setFollowupNote('');
            checkLiveStatus();
        } else {
            toast.error(data.message || 'Failed to update status');
        }
    } catch(err) {
        toast.error('Network error');
    } finally {
        setIsSavingCRM(false);
    }
  };

  const handleSaveCRM = async () => {
    if (!editFormData || !selectedContact) return;
    setIsSavingCRM(true);
    try {
        const fullPayload = { ...(selectedContact.crmData || {}), data: editFormData };
        
        const res = await fetch('/api/crm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone_number: selectedContact.chat_id, data: fullPayload })
        });
        
        const data = await res.json();
        if (data.success) {
            toast.success(`Details Updated`);
            setIsEditingModal(false);
            checkLiveStatus();
        } else {
            toast.error(data.message || 'Failed to update details');
        }
    } catch(err) {
        toast.error('Network error');
    } finally {
        setIsSavingCRM(false);
    }
  };

  const checkLiveStatus = async () => {
    setLiveStatus(prev => ({ ...prev, loading: true }));
    try {
      const query = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: searchTerm,
        timeFilter,
        statusFilter,
        callFilter,
        conversionFilter,
        serviceFilter,
        topFilter
      }).toString();
      const res = await fetch('/api/whatsapp/subscribers?' + query);
      const textRes = await res.text();
      let data;
      try {
        data = textRes ? JSON.parse(textRes) : {};
      } catch (e) {
        console.error("Invalid JSON from internal API:", textRes);
        setLiveStatus({
          connected: false,
          subscribers: [],
          loading: false,
          message: 'Error fetching data: Invalid server response'
        });
        return;
      }
      
      if (data.success) {
        setLiveStatus({
          connected: true,
          subscribers: data.subscribers || [],
          loading: false,
          message: 'Connected to WhatsMarketing API'
        });
        setStats(data.stats || {});
        setTotalContacts(data.totalContacts || 0);
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


  const handleCategoryChange = async (chat_id: string, categoryId: string, existingCrmData: any) => {
    try {
      const updatedData = { ...(existingCrmData?.data || {}), service_category: categoryId, service_step: 0 };
      const fullPayload = { ...(existingCrmData || {}), data: updatedData };
      const res = await fetch('/api/crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: chat_id, data: fullPayload })
      });
      if ((await res.json()).success) {
        toast.success('Category updated');
        checkLiveStatus();
      }
    } catch(e) { toast.error('Failed to update category'); }
  };


  const currentItems = liveStatus.subscribers;
  const totalPages = Math.ceil(totalContacts / itemsPerPage) || 1;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="flex justify-end mb-2"></div>
      <div className={`transition-all duration-300 ${isChatOpen ? 'md:pr-[400px]' : ''}`}>
      
      {/* Premium Converted Leads Banner */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgba(16,185,129,0.3)] text-white flex flex-col md:flex-row items-start md:items-center justify-between relative overflow-hidden">
          
          {/* Decorative background circles */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-20 -mb-8 w-24 h-24 bg-teal-300 opacity-20 rounded-full blur-xl pointer-events-none"></div>
          
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-inner border border-white/20">
              <svg className="w-8 h-8 text-white drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div>
              <h2 className="text-4xl font-black tracking-tight drop-shadow-sm">{stats.converted || 0}</h2>
              <p className="text-emerald-50 font-bold tracking-widest uppercase text-xs mt-1 opacity-90">Converted Leads</p>
            </div>
          </div>
          
          <div className="mt-6 md:mt-0 md:text-right px-6 py-4 bg-black/10 rounded-2xl backdrop-blur-md border border-white/10 relative z-10 shadow-inner">
            <p className="text-emerald-100 text-[10px] font-extrabold uppercase tracking-widest mb-1 opacity-80">Total Collection</p>
            <p className="text-2xl font-black drop-shadow-sm">₹{(stats.totalCollection || 0).toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-3xl overflow-hidden shadow-lg flex flex-col">
          
          {/* Toolbar */}
          <div className="p-6 border-b border-gray-100 bg-white flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-4 w-full max-w-2xl">
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
              {(serviceFilter !== 'all' || topFilter !== 'converted' || searchTerm !== '' || timeFilter !== 'all' || statusFilter !== 'all' || callFilter !== 'all' || conversionFilter !== 'all') && (
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setServiceFilter('all');
                    setTopFilter('converted');
                    setTimeFilter('all');
                    setStatusFilter('all');
                    setCallFilter('all');
                    setConversionFilter('all');
                    setCurrentPage(1);
                  }}
                  className="text-sm font-bold text-rose-500 hover:text-rose-600 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors whitespace-nowrap flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  Clear Filters
                </button>
              )}
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
              <span className="hidden sm:block pl-2 border-l border-gray-300">{totalContacts} Total Contacts</span>
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
                    {topFilter === 'converted' && <th className="px-6 py-4 hidden md:table-cell">Delivery Step</th>}
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
                              if (curr === 'followup') { badgeClass = "bg-amber-50 text-amber-600 border-amber-200"; label = "Follow-up"; const fd = sub.crmData?.data?.next_followup_date; if (fd) { const d = new Date(fd); label = `Follow-up ${d.toLocaleDateString('en-IN', {day:'numeric',month:'short'})}`; } }
                              else if (curr === 'converted') { badgeClass = "bg-emerald-50 text-emerald-600 border-emerald-200"; label = "Converted"; const amt = sub.crmData?.data?.payment_amount; if (amt) label = `Converted ₹${parseFloat(amt).toLocaleString('en-IN')}`; }
                              else if (curr === 'lost') { badgeClass = "bg-red-50 text-red-600 border-red-200"; label = "Lost"; }
                              
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
                                { value: 'followup', label: 'Follow-up' },
                                { value: 'converted', label: 'Converted' },
                                { value: 'lost', label: 'Lost' }
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

                        {/* Delivery Step Column */}
                        {topFilter === 'converted' && (
                          <td className="px-6 py-4 hidden md:table-cell">
                            <div className="relative action-menu-container">
                                <div 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenStepDropdownId(openStepDropdownId === sub.chat_id ? null : sub.chat_id);
                                    }}
                                    className="inline-flex items-center justify-between w-32 px-3 py-1.5 rounded-lg border text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-colors bg-teal-50 text-teal-600 border-teal-200 hover:bg-teal-100"
                                >
                                    <span className="truncate">{sub.crmData?.data?.service_step_name || 'Select Step'}</span>
                                    <svg className="w-3 h-3 ml-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                                
                                <div className={`absolute left-0 top-full mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-lg transition-all z-20 overflow-hidden flex flex-col p-1 ${openStepDropdownId === sub.chat_id ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                                    <div className="max-h-48 overflow-y-auto">
                                      {(() => {
                                        const leadService = sub.crmData?.data?.service_type || sub.crmData?.data?.service_category || 'consultation';
                                        const cat = serviceCategories.find(c => c.name.toLowerCase() === leadService.toLowerCase() || c.id === leadService) || serviceCategories[0];
                                        const stepsToRender = cat?.steps || ['Step 1', 'Step 2', 'Step 3'];
                                        
                                        return stepsToRender.map((step: string, i: number) => (
                                          <button
                                              key={i}
                                              onClick={(e) => { e.stopPropagation(); handleStepChange(sub.chat_id, step, sub.crmData); }}
                                              className={`w-full text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-colors ${sub.crmData?.data?.service_step_name === step ? 'bg-teal-50 text-teal-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                                          >
                                              {step}
                                          </button>
                                        ));
                                      })()}
                                    </div>
                                    
                                </div>
                            </div>
                          </td>
                        )}

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

                        <td className={`px-6 py-4 text-right hidden md:table-cell relative action-menu-container ${openDropdownId === sub.chat_id ? 'z-30' : 'hover:z-30'}`}>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              const newId = openDropdownId === sub.chat_id ? null : sub.chat_id;
                              setOpenDropdownId(newId);
                              setOpenStatusMenuId(newId); // Make Change Status open by default
                            }}
                            className="p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                          </button>
                          
                          <div className={`absolute right-6 top-full pt-2 w-56 z-20 transition-all ${openDropdownId === sub.chat_id ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                            <div className="bg-white border border-gray-200 rounded-xl shadow-lg py-1 overflow-hidden">
                              <div className="border-b border-gray-100">
                                <div 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenStatusMenuId(openStatusMenuId === sub.chat_id ? null : sub.chat_id);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors flex items-center cursor-pointer justify-between"
                                >
                                  <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                                    Change Status
                                  </div>
                                  <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${openStatusMenuId === sub.chat_id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                                <div className={`flex-col gap-1 px-3 pb-2 bg-white ${openStatusMenuId === sub.chat_id ? 'flex' : 'hidden'}`}>
                                  <button onClick={(e) => { e.stopPropagation(); handleQuickStatusChange(sub.chat_id, 'new', sub.crmData); setOpenDropdownId(null); setOpenStatusMenuId(null); }} className={`w-full text-left text-[11px] px-3 py-2 rounded-md font-medium flex items-center justify-between transition-colors ${(sub.crmData?.data?.conversion_status || 'new') === 'new' ? 'bg-slate-200 text-slate-800' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>New Lead</button>
                                  <button onClick={(e) => { e.stopPropagation(); handleQuickStatusChange(sub.chat_id, 'followup', sub.crmData); setOpenDropdownId(null); setOpenStatusMenuId(null); }} className={`w-full text-left text-[11px] px-3 py-2 rounded-md font-medium flex items-center justify-between transition-colors ${sub.crmData?.data?.conversion_status === 'followup' ? 'bg-amber-200 text-amber-800' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'}`}>Follow-up</button>
                                  <button onClick={(e) => { e.stopPropagation(); handleQuickStatusChange(sub.chat_id, 'converted', sub.crmData); setOpenDropdownId(null); setOpenStatusMenuId(null); }} className={`w-full text-left text-[11px] px-3 py-2 rounded-md font-medium flex items-center justify-between transition-colors ${sub.crmData?.data?.conversion_status === 'converted' ? 'bg-emerald-200 text-emerald-800' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}>Converted</button>
                                  <button onClick={(e) => { e.stopPropagation(); handleQuickStatusChange(sub.chat_id, 'lost', sub.crmData); setOpenDropdownId(null); setOpenStatusMenuId(null); }} className={`w-full text-left text-[11px] px-3 py-2 rounded-md font-medium flex items-center justify-between transition-colors ${sub.crmData?.data?.conversion_status === 'lost' ? 'bg-red-200 text-red-800' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}>Lost</button>
                                </div>
                              </div>
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
                          </div>
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
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between rounded-b-2xl">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <div className="text-sm font-medium text-gray-500">
                Page {currentPage} of {totalPages}
              </div>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop Overlay for Chat Drawer */}
      {isChatOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] transition-opacity duration-300"
          onClick={closeChat}
        />
      )}

      {/* Chat History Drawer - WhatsApp Style */}
      <div 
        className={`fixed top-0 right-0 h-screen w-full md:w-[420px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isChatOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ borderLeft: '1px solid #e5e7eb', position: 'fixed', overflow: 'hidden' }}
      >
        {selectedContact && (
          <div className="flex flex-col h-full">
            {/* WhatsApp Header */}
            <div className="bg-[#075E54] px-4 py-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={closeChat}
                    className="p-1 text-white/80 hover:text-white transition-colors md:hidden"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <div className="w-10 h-10 rounded-full bg-[#DFE5E7] flex items-center justify-center text-[#075E54] font-bold text-lg">
                    {selectedContact.first_name ? selectedContact.first_name.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-[15px]">{selectedContact.first_name || 'Unknown'}</h3>
                    <p className="text-xs text-white/70">+{selectedContact.chat_id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => wipeMemory(selectedContact.chat_id)}
                    className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    title="Delete Chat History"
                  >
                    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                  <button 
                    onClick={closeChat}
                    className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors hidden md:flex"
                    title="Close Chat"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <svg className="absolute left-3 top-2.5 w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input 
                  type="text" 
                  placeholder="Search in conversation..." 
                  value={chatSearchTerm}
                  onChange={(e) => setChatSearchTerm(e.target.value)}
                  className="w-full bg-[#064E46] border-none rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-white/30"
                />
              </div>
            </div>
            
            {/* Chat Messages Body - WhatsApp wallpaper style */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-2" style={{ backgroundColor: '#ECE5DD', backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'200\' height=\'200\' viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23d5cec5\' fill-opacity=\'0.4\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3Ccircle cx=\'90\' cy=\'60\' r=\'1.5\'/%3E%3Ccircle cx=\'150\' cy=\'20\' r=\'1\'/%3E%3Ccircle cx=\'60\' cy=\'120\' r=\'2\'/%3E%3Ccircle cx=\'170\' cy=\'100\' r=\'1.5\'/%3E%3Ccircle cx=\'20\' cy=\'180\' r=\'1\'/%3E%3Ccircle cx=\'130\' cy=\'160\' r=\'2\'/%3E%3Ccircle cx=\'80\' cy=\'190\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E")'  }}>
              {loadingChat ? (
                <div className="flex items-center justify-center h-full flex-col gap-3">
                  <svg className="animate-spin h-8 w-8 text-[#075E54]" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span className="text-[#075E54]/60 text-sm">Loading history...</span>
                </div>
              ) : chatHistory.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm">
                    <p className="text-gray-500 text-sm">No messages found.</p>
                  </div>
                </div>
              ) : (
                <>
                  {hasMoreChat && !chatSearchTerm && (
                    <div className="flex justify-center my-3">
                      <button 
                        onClick={loadMoreChat}
                        disabled={loadingMoreChat}
                        className="px-4 py-1.5 bg-white/90 hover:bg-white text-[#075E54] text-xs font-medium rounded-full transition-colors disabled:opacity-50 shadow-sm"
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
                        <div key={msg.id} className="flex justify-center my-2">
                          <span className="bg-[#FCF4CB] text-[#54656F] px-3 py-1 rounded-lg text-[11px] shadow-sm">{msg.text}</span>
                        </div>
                      );
                    }

                    return (
                      <div key={msg.id} className={`flex ${!isUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] px-3 py-1.5 shadow-sm relative overflow-hidden ${
                          !isUser 
                            ? 'bg-[#DCF8C6] text-gray-800 rounded-lg rounded-tr-none' 
                            : 'bg-white text-gray-800 rounded-lg rounded-tl-none'
                        }`} style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                          <p className="text-[13px] whitespace-pre-wrap leading-relaxed" style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}>{msg.text}</p>
                          {msg.time && (
                            <p className="text-[10px] mt-0.5 text-right text-gray-500 float-right ml-2 -mb-0.5 relative top-1">
                              {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          )}
                          <div className="clear-both"></div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {chatHistory.filter(m => !chatSearchTerm || m.text?.toLowerCase().includes(chatSearchTerm.toLowerCase())).length === 0 && (
                    <div className="flex items-center justify-center py-8">
                      <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm">
                        <p className="text-gray-500 text-sm">No matching messages found.</p>
                      </div>
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
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-[13px] font-extrabold text-slate-600 uppercase tracking-wider">Lead Information</h4>
                  <button 
                    onClick={() => setIsEditingModal(!isEditingModal)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all ${isEditingModal ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-[#075E54]/10 text-[#075E54] hover:bg-[#075E54]/20'}`}
                  >
                    {isEditingModal ? (
                      <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> Cancel Edit</>
                    ) : (
                      <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg> Edit</>
                    )}
                  </button>
                </div>
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

              {/* Editable Lead Fields */}
              {isEditingModal && (
                <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  <h4 className="text-[13px] font-extrabold text-slate-600 mb-5 uppercase tracking-wider">Edit Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Name</label>
                      <input type="text" value={editFormData.name || selectedDetails.first_name || ''} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} className="w-full bg-gray-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#075E54] focus:ring-2 focus:ring-[#075E54]/10" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">City</label>
                      <input type="text" value={editFormData.city || ''} onChange={(e) => setEditFormData({...editFormData, city: e.target.value})} className="w-full bg-gray-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#075E54] focus:ring-2 focus:ring-[#075E54]/10" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Service Type</label>
                      <input type="text" value={editFormData.service_type || ''} onChange={(e) => setEditFormData({...editFormData, service_type: e.target.value})} className="w-full bg-gray-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#075E54] focus:ring-2 focus:ring-[#075E54]/10" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Consultant Pref</label>
                      <input type="text" value={editFormData.consultant_pref || ''} onChange={(e) => setEditFormData({...editFormData, consultant_pref: e.target.value})} className="w-full bg-gray-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#075E54] focus:ring-2 focus:ring-[#075E54]/10" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Planning Type</label>
                      <input type="text" value={editFormData.planning_type || ''} onChange={(e) => setEditFormData({...editFormData, planning_type: e.target.value})} className="w-full bg-gray-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#075E54] focus:ring-2 focus:ring-[#075E54]/10" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Budget</label>
                      <input type="text" value={editFormData.budget || ''} onChange={(e) => setEditFormData({...editFormData, budget: e.target.value})} className="w-full bg-gray-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#075E54] focus:ring-2 focus:ring-[#075E54]/10" />
                    </div>
                  </div>
                </div>
              )}

            </div>
            
            {/* Modal Footer */}
            <div className="p-6 pt-4 flex justify-end gap-4 border-t-0">
              <button 
                onClick={() => { setDetailsModalOpen(false); setIsEditingModal(false); }}
                className="px-6 py-2 bg-transparent text-[14px] font-bold text-slate-600 hover:text-slate-800 transition-colors"
              >
                Close
              </button>
              {isEditingModal && (
                <button 
                  onClick={() => { handleSaveCRM(); setIsEditingModal(false); }} disabled={isSavingCRM}
                  className="px-8 py-2.5 bg-[#075E54] text-white rounded-xl text-[14px] font-bold hover:bg-[#064E46] transition-colors shadow-md disabled:opacity-50"
                >
                  {isSavingCRM ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Amount Input Modal - Simplified */}
      {amountModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-800 text-lg">Converted Amount</h3>
              <button onClick={() => { setAmountModalOpen(false); setAmountModalPending(null); }} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-6">
              <label className="block text-sm font-semibold text-gray-600 mb-2">Deal Amount (₹)</label>
              <input 
                type="number" 
                value={amountModalValue}
                onChange={(e) => setAmountModalValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAmountModalConfirm(); }}
                placeholder="Enter amount..."
                autoFocus
                className="w-full px-4 py-3 text-lg font-semibold text-gray-800 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-[#075E54] focus:ring-2 focus:ring-[#075E54]/20 transition-all"
              />
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button 
                onClick={() => { setAmountModalOpen(false); setAmountModalPending(null); }}
                className="px-5 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAmountModalConfirm}
                className="px-5 py-2 bg-[#075E54] text-white rounded-lg text-sm font-semibold hover:bg-[#064E46] transition-colors shadow-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Followup Modal - WhatsApp Style */}
      {followupModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#ECE5DD] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] w-full max-w-md max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            {/* WhatsApp Header */}
            <div className="bg-[#075E54] px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#25D366]/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#25D366]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-[16px]">Schedule Follow-up</h3>
                    <p className="text-[#8ABEB7] text-[12px]">Set next date & add notes</p>
                  </div>
                </div>
                <button onClick={() => { setFollowupModalOpen(false); setFollowupPending(null); }} className="p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
            
            {/* Body - Chat bubble style */}
            <div className="p-4 space-y-3 overflow-y-auto flex-1" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'200\' height=\'200\' viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23d5cec5\' fill-opacity=\'0.4\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3Ccircle cx=\'90\' cy=\'60\' r=\'1.5\'/%3E%3Ccircle cx=\'150\' cy=\'20\' r=\'1\'/%3E%3Ccircle cx=\'60\' cy=\'120\' r=\'2\'/%3E%3Ccircle cx=\'170\' cy=\'100\' r=\'1.5\'/%3E%3C/g%3E%3C/svg%3E")' }}>

              {/* Follow-up Type */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-[11px] font-bold text-[#075E54] uppercase tracking-wider mb-3">Follow-up Type</p>
                <div className="flex gap-2">
                  {[
                    { value: 'call', label: 'Call', icon: '<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>', color: 'bg-blue-50 text-blue-600 border-blue-200' },
                    { value: 'whatsapp', label: 'WhatsApp', icon: '<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>', color: 'bg-green-50 text-green-600 border-green-200' },
                    { value: 'meeting', label: 'Meeting', icon: '<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>', color: 'bg-purple-50 text-purple-600 border-purple-200' },
                    { value: 'visit', label: 'Visit', icon: '<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>', color: 'bg-orange-50 text-orange-600 border-orange-200' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setFollowupType(opt.value)}
                      className={`flex-1 text-[11px] font-bold py-2.5 px-1 rounded-lg border transition-all flex flex-col items-center gap-1 ${followupType === opt.value ? opt.color + ' shadow-sm scale-105' : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100'}`}
                    >
                      <span dangerouslySetInnerHTML={{ __html: opt.icon }} />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Followup Note - what happened */}
              <div className="bg-[#DCF8C6] rounded-xl rounded-tr-none p-4 shadow-sm relative">
                <p className="text-[11px] font-bold text-[#075E54] uppercase tracking-wider mb-2">Current Follow-up Note</p>
                <textarea 
                  value={followupCurrentNote}
                  onChange={(e) => setFollowupCurrentNote(e.target.value)}
                  placeholder="Aaj baat kya hui? e.g. Client ne price pucha, interested hai..."
                  rows={2}
                  autoFocus
                  className="w-full px-0 py-0 text-[13px] text-gray-800 bg-transparent border-none focus:outline-none resize-none placeholder-[#075E54]/30"
                />
                <p className="text-[10px] text-[#075E54]/40 text-right mt-1">{new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</p>
              </div>

              {/* Next Follow-up Date & Time */}
              <div className="bg-white rounded-xl rounded-tl-none p-4 shadow-sm">
                <p className="text-[11px] font-bold text-[#075E54] uppercase tracking-wider mb-3">Next Follow-up Schedule</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-400 mb-1">Date</label>
                    <input 
                      type="date" 
                      value={followupDate}
                      onChange={(e) => setFollowupDate(e.target.value)}
                      className="w-full px-3 py-2.5 text-[13px] font-semibold text-slate-800 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#075E54] focus:ring-2 focus:ring-[#075E54]/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-400 mb-1">Time</label>
                    <input 
                      type="time" 
                      value={followupTime}
                      onChange={(e) => setFollowupTime(e.target.value)}
                      className="w-full px-3 py-2.5 text-[13px] font-semibold text-slate-800 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#075E54] focus:ring-2 focus:ring-[#075E54]/10 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Next Followup Note */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-[11px] font-bold text-[#075E54] uppercase tracking-wider mb-2">Next Follow-up Note</p>
                <textarea 
                  value={followupNote}
                  onChange={(e) => setFollowupNote(e.target.value)}
                  placeholder="Kal kya karna hai? e.g. Price quotation bhejna hai, meeting fix karni hai..."
                  rows={2}
                  className="w-full px-0 py-0 text-[13px] text-gray-800 bg-transparent border-none focus:outline-none resize-none placeholder-gray-300"
                />
              </div>

              {/* Follow-up History */}
              {(() => {
                const history = followupPending?.existingCrmData?.data?.followup_history || [];
                if (history.length === 0) return null;
                return (
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-[11px] font-bold text-[#075E54] uppercase tracking-wider mb-3">Follow-up History ({history.length})</p>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      {history.map((item: any, idx: number) => {
                        const typeIcon = item.type === 'call' 
                          ? <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                          : item.type === 'whatsapp'
                          ? <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                          : item.type === 'meeting'
                          ? <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                          : <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>;
                        return (
                          <div key={item.id || idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-gray-50 group hover:bg-red-50/50 transition-colors">
                            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-100 mt-0.5">{typeIcon}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-[11px] font-bold text-slate-700">
                                  {item.date ? new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                                  {item.time && <span className="text-gray-400 font-normal"> &middot; {item.time}</span>}
                                </p>
                              </div>
                              {item.note && <p className="text-[12px] text-gray-600 mt-0.5 truncate">{item.note}</p>}
                              {item.next_note && <p className="text-[11px] text-[#075E54]/60 mt-0.5 truncate italic">Next: {item.next_note}</p>}
                            </div>
                            <button
                              onClick={() => {
                                if (!followupPending) return;
                                const updated = history.filter((_: any, i: number) => i !== idx);
                                setFollowupPending({
                                  ...followupPending,
                                  existingCrmData: {
                                    ...followupPending.existingCrmData,
                                    data: { ...followupPending.existingCrmData?.data, followup_history: updated }
                                  }
                                });
                              }}
                              className="p-1 rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                              title="Delete"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

            </div>

            {/* Footer - WhatsApp style */}
            <div className="bg-[#F0F2F5] px-4 py-3 flex gap-3">
              <button 
                onClick={() => { setFollowupModalOpen(false); setFollowupPending(null); }}
                className="flex-1 px-4 py-2.5 bg-white text-gray-600 rounded-full text-[13px] font-bold hover:bg-gray-100 transition-colors border border-gray-200"
              >
                Cancel
              </button>
              <button 
                onClick={handleFollowupModalConfirm}
                className="flex-1 px-4 py-2.5 bg-[#075E54] text-white rounded-full text-[13px] font-bold hover:bg-[#064E46] transition-colors shadow-md"
              >
                ✓ Schedule
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}