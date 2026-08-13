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
  
  // Notes State
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [editingNoteFor, setEditingNoteFor] = useState<string | null>(null);
  const [editNoteText, setEditNoteText] = useState('');
  
  // Mobile Responsiveness State
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Chat History State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const [loadingChat, setLoadingChat] = useState(false);
  const [loadingMoreChat, setLoadingMoreChat] = useState(false);
  const [chatOffset, setChatOffset] = useState(1);
  const [chatSearchTerm, setChatSearchTerm] = useState('');
  const [hasMoreChat, setHasMoreChat] = useState(true);

  const renderMessageText = (text: string) => {
    if (!text) return null;

    const trimmed = text.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const parsed = JSON.parse(trimmed);
        
        // 1. WhatsApp Image Object
        if (parsed.type === 'image' || parsed.image) {
          const imgUrl = parsed.image?.link || parsed.image?.url;
          const caption = parsed.image?.caption;
          if (imgUrl) {
            return (
              <div className="space-y-1 my-1">
                <img 
                  src={imgUrl} 
                  alt="WhatsApp Media" 
                  className="rounded-lg max-h-64 max-w-full object-cover border border-black/10 cursor-pointer hover:opacity-95 transition-opacity"
                  onClick={() => window.open(imgUrl, '_blank')}
                />
                {caption && <p className="text-xs text-gray-700 mt-1">{caption}</p>}
              </div>
            );
          }
        }

        // 2. WhatsApp Document Object
        if (parsed.type === 'document' || parsed.document) {
          const docUrl = parsed.document?.link || parsed.document?.url;
          const filename = parsed.document?.filename || 'Document';
          return (
            <a href={docUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 bg-black/5 rounded-lg text-blue-600 hover:underline text-xs my-1">
              📄 {filename}
            </a>
          );
        }

        // 3. WhatsApp Text Object
        if (parsed.text?.body) {
          return renderPlainText(parsed.text.body);
        }
      } catch (e) {
        // Fallback to normal text
      }
    }

    // Direct Image URL detection
    if (/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(trimmed)) {
      return (
        <img 
          src={trimmed} 
          alt="Media" 
          className="rounded-lg max-h-64 max-w-full object-cover border border-black/10 cursor-pointer hover:opacity-95 transition-opacity my-1"
          onClick={() => window.open(trimmed, '_blank')}
        />
      );
    }

    return renderPlainText(text);
  };

  const renderPlainText = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all font-medium">
            {part}
          </a>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  useEffect(() => {
    checkLiveStatus();
    fetchNotes();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (chatHistory.length > 0 && chatOffset === 1) {
      scrollToBottom();
    }
  }, [chatHistory, chatOffset]);

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
        // Append older messages to the end of the array (which flex-col-reverse pushes to the top visually)
        setChatHistory(prev => [...prev, ...data.messages.reverse()]);
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

  const wipeMemory = async (phone: string, type: 'chat' | 'ai' | 'all' = 'all') => {
    let confirmMsg = 'Are you sure you want to wipe memory for +' + phone + '?';
    if (type === 'chat') confirmMsg = 'Are you sure you want to delete WhatsApp chat history for +' + phone + '?';
    if (type === 'ai') confirmMsg = 'Are you sure you want to clear AI Gatekeeper memory for +' + phone + '?';
    
    if (!confirm(confirmMsg)) return;
    try {
      const res = await fetch('/api/clear-memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, type })
      });
      const data = await res.json();
      if (data.success) {
        alert('Memory wiped successfully for +' + phone);
      } else {
        alert('Failed to wipe memory: ' + data.message);
      }
    } catch (err) {
      alert('Error wiping memory');
    }
  };

  const filteredSubscribers = liveStatus.subscribers.filter((sub: any) => 
    (sub.first_name && sub.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (sub.chat_id && sub.chat_id.includes(searchTerm))
  );

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
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Contacts & Numbers</h1>
          <p className="mt-2 text-gray-500">View and manage all your active WhatsApp leads and conversations.</p>
        </div>
        
        {/* Status Badge */}
        <div>
          {liveStatus.loading ? (
            <span className="flex items-center text-gray-500 text-sm bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Syncing Data...
            </span>
          ) : liveStatus.connected ? (
            <span className="flex items-center px-4 py-2 rounded-xl bg-green-50 text-green-700 text-sm font-medium border border-green-200 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
              Live Connection Active
            </span>
          ) : (
            <span className="flex items-center px-4 py-2 rounded-xl bg-red-50 text-red-700 text-sm font-medium border border-red-200 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
              Disconnected
            </span>
          )}
        </div>
      </div>

      <div className={`transition-all duration-300 ${isChatOpen ? 'md:pr-[400px]' : ''}`}>
        {/* Main Content Area */}
        <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm flex flex-col">
          
          {/* Toolbar */}
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-wrap items-center justify-between gap-4">
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
                className="w-full bg-white border border-gray-300 rounded-xl pl-12 pr-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all shadow-sm"
              />
            </div>
            <div className="flex items-center gap-4 text-gray-600 text-sm font-medium">
              <label>Rows per page: </label>
              <select 
                className="bg-white border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:border-indigo-500 text-gray-700 shadow-sm"
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
              <span className="hidden sm:block pl-2 border-l border-gray-200">{filteredSubscribers.length} Total Contacts</span>
            </div>
          </div>

          {/* Data List */}
          <div className="flex-1 overflow-x-auto min-h-[400px]">
            {liveStatus.loading ? (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <svg className="animate-spin h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              </div>
            ) : !liveStatus.connected ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500 p-6 text-center">
                <svg className="w-12 h-12 text-gray-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="text-lg">{liveStatus.message}</p>
                <p className="text-sm mt-1">Go to the Settings page to configure your API keys.</p>
              </div>
            ) : currentItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500 p-6 text-center">
                <svg className="w-12 h-12 text-gray-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                <p className="text-lg">No contacts found.</p>
                <p className="text-sm mt-1">Your search did not match any active subscribers.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                    <th className="px-6 py-4 hidden md:table-cell">Contact</th>
                    <th className="px-6 py-4">Phone Number</th>
                    <th className="px-6 py-4 hidden md:table-cell">Notes</th>
                    <th className="px-6 py-4 hidden md:table-cell">Messages</th>
                    <th className="px-6 py-4 text-right hidden md:table-cell">Actions</th>
                    <th className="px-6 py-4 text-right md:hidden"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentItems.map((sub: any, idx: number) => {
                    const isTestNumber = sub.chat_id === '918707526283' || sub.chat_id === '917597571515' || sub.chat_id === '916200718713';
                    return (
                      <React.Fragment key={idx}>
                        <tr className={`transition-colors ${isTestNumber ? 'bg-yellow-50 hover:bg-yellow-100' : 'hover:bg-gray-50'}`}>
                          <td className="px-6 py-4 hidden md:table-cell">
                            <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-50 flex flex-shrink-0 items-center justify-center text-indigo-600 border border-indigo-100">
                              {sub.first_name ? sub.first_name.charAt(0).toUpperCase() : '?'}
                            </div>
                            <div className="font-medium text-gray-900">{sub.first_name || 'Unknown User'}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-gray-600">
                          +{sub.chat_id}
                        </td>
                        <td className="px-6 py-4 max-w-[200px] md:max-w-xs hidden md:table-cell">
                          {editingNoteFor === sub.chat_id ? (
                            <div className="flex items-center gap-2">
                                <input 
                                  type="text"
                                  value={editNoteText}
                                  onChange={(e) => setEditNoteText(e.target.value)}
                                  className="w-full bg-white border border-indigo-500 rounded-md px-2 py-1 text-sm text-gray-900 focus:outline-none shadow-sm focus:ring-1 focus:ring-indigo-500"
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
                              className="text-gray-600 text-sm truncate cursor-pointer hover:text-indigo-600 transition-colors flex items-center gap-2 group"
                              onClick={() => {
                                setEditingNoteFor(sub.chat_id);
                                setEditNoteText(notes[sub.chat_id] || '');
                              }}
                            >
                              <span>{notes[sub.chat_id] || <em className="text-gray-600">Add note...</em>}</span>
                              <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          {sub.unseen_count > 0 ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
                              {sub.unseen_count} New
                            </span>
                          ) : (
                            <span className="text-gray-500 text-sm">None</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right hidden md:table-cell">
                          <div className="flex items-center justify-end space-x-2">
                            <button 
                              onClick={() => wipeMemory(sub.chat_id, 'all')}
                              className="text-red-600 hover:text-red-700 transition-colors text-xs font-medium px-2 py-1.5 rounded-lg hover:bg-red-50 whitespace-nowrap border border-red-200"
                              title="Reset AI memory and start fresh with this user"
                            >
                              Restart AI Chat
                            </button>
                            <button 
                              onClick={() => openChat(sub)}
                              className="text-indigo-600 hover:text-indigo-700 transition-colors text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-50 whitespace-nowrap border border-indigo-200"
                            >
                              View Chat
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right md:hidden">
                          <button 
                            onClick={() => setExpandedRowId(expandedRowId === sub.chat_id ? null : sub.chat_id)}
                            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                          </button>
                        </td>
                      </tr>
                      
                      {/* Mobile Expanded Row */}
                      {expandedRowId === sub.chat_id && (
                        <tr className="md:hidden bg-gray-50/50">
                          <td colSpan={2} className="px-6 py-4 border-b border-gray-100">
                            <div className="flex flex-col gap-4">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Contact</span>
                                <div className="font-medium text-gray-900 flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-indigo-50 flex flex-shrink-0 items-center justify-center text-indigo-600 border border-indigo-100 text-xs">
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
                                      className="flex-1 bg-white border border-indigo-500 rounded-md px-2 py-1 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm"
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
                                    className="text-gray-600 text-sm cursor-pointer hover:text-indigo-600 transition-colors flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-200 shadow-sm"
                                    onClick={() => {
                                      setEditingNoteFor(sub.chat_id);
                                      setEditNoteText(notes[sub.chat_id] || '');
                                    }}
                                  >
                                    <span className="flex-1">{notes[sub.chat_id] || <em className="text-gray-400">Tap to add a note...</em>}</span>
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Status:</span>
                                  {sub.unseen_count > 0 ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">
                                      {sub.unseen_count} New
                                    </span>
                                  ) : (
                                    <span className="text-gray-400 text-xs">Read</span>
                                  )}
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <button 
                                    onClick={() => wipeMemory(sub.chat_id, 'all')}
                                    className="text-red-600 bg-red-50 hover:bg-red-100 transition-colors text-[10px] font-medium px-2 py-1.5 rounded border border-red-200"
                                  >
                                    Restart AI
                                  </button>
                                  <button 
                                    onClick={() => openChat(sub)}
                                    className="text-white bg-indigo-600 hover:bg-indigo-700 transition-colors text-xs font-medium px-3 py-1.5 rounded shadow-lg shadow-indigo-500/30"
                                  >
                                    Open
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
            <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                Previous
              </button>
              <div className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </div>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chat History Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full md:w-[400px] bg-white border-l border-gray-200 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isChatOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {selectedContact && (
          <div className="flex flex-col h-full">
            {/* Drawer Header */}
            <div className="p-4 border-b border-gray-100 bg-gray-50/80 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
                    {selectedContact.first_name ? selectedContact.first_name.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedContact.first_name || 'Unknown'}</h3>
                    <p className="text-xs text-gray-500">+{selectedContact.chat_id}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={closeChat}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors flex items-center justify-center"
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
                  className="w-full bg-white border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                />
              </div>
            </div>
            
            {/* Drawer Body (Chat Messages) */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#efeae2] flex flex-col-reverse gap-4">
              {loadingChat ? (
                <div className="flex items-center justify-center h-full text-gray-500 flex-col gap-3">
                  <svg className="animate-spin h-8 w-8 text-[#00a884]" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span>Loading history...</span>
                </div>
              ) : chatHistory.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p className="bg-white/80 px-4 py-2 rounded-lg text-sm shadow-sm">No messages found.</p>
                </div>
              ) : (
                <>
                  {chatHistory.filter(m => !chatSearchTerm || m.text?.toLowerCase().includes(chatSearchTerm.toLowerCase())).map((msg: any) => {
                    const isUser = msg.sender === 'user';
                    const isSystem = msg.sender === 'system';
                    
                    if (isSystem) {
                      return (
                        <div key={msg.id} className="flex justify-center my-4">
                          <span className="bg-[#ffeaa7] text-gray-700 px-3 py-1 rounded-lg text-xs shadow-sm">{msg.text}</span>
                        </div>
                      );
                    }

                    return (
                      <div key={msg.id} className={`flex ${!isUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-lg px-2.5 py-1.5 shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] relative ${
                          !isUser 
                            ? 'bg-[#d9fdd3] text-gray-900 rounded-tr-none' 
                            : 'bg-white text-gray-900 rounded-tl-none'
                        }`}>
                          {!isUser && (
                            <svg viewBox="0 0 8 13" width="8" height="13" className="absolute top-0 -right-[7px] text-[#d9fdd3]">
                              <path opacity="1" fill="currentColor" d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z"></path>
                            </svg>
                          )}
                          {isUser && (
                            <svg viewBox="0 0 8 13" width="8" height="13" className="absolute top-0 -left-[7px] text-white">
                              <path opacity="1" fill="currentColor" d="M1.533 3.568L8 12.193V1H2.812C1.042 1 .474 2.156 1.533 3.568z"></path>
                            </svg>
                          )}
                          <p className="text-[14.5px] leading-relaxed whitespace-pre-wrap break-words pr-12">{renderMessageText(msg.text)}</p>
                          {msg.time && (
                            <p className="text-[10.5px] text-gray-500 absolute bottom-1 right-2">
                              {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  
                  {hasMoreChat && !chatSearchTerm && (
                    <div className="flex justify-center my-4">
                      <button 
                        onClick={loadMoreChat}
                        disabled={loadingMoreChat}
                        className="px-4 py-1.5 bg-white shadow-sm border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-medium rounded-full transition-colors disabled:opacity-50"
                      >
                        {loadingMoreChat ? 'Loading...' : 'Load older messages'}
                      </button>
                    </div>
                  )}
                  
                  {chatHistory.filter(m => !chatSearchTerm || m.text?.toLowerCase().includes(chatSearchTerm.toLowerCase())).length === 0 && (
                    <div className="flex items-center justify-center py-8 text-gray-500">
                      <p className="bg-white/80 px-4 py-2 rounded-lg text-sm shadow-sm">No matching messages found.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
