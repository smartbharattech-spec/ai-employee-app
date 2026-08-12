'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterService, setFilterService] = useState('All');
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  useEffect(() => {
    setCurrentPage(1);
  }, [filterService, searchQuery]);

  const filteredLeads = leads.filter(lead => {
    let serviceMatch = true;
    if (filterService !== 'All') {
      if (!lead.data?.service_type) serviceMatch = false;
      else {
        const serviceStr = lead.data.service_type.toLowerCase();
        serviceMatch = false;
        if (filterService.includes('issue') && (serviceStr.includes('issue') || serviceStr === '1' || serviceStr.includes('1.'))) serviceMatch = true;
        else if (filterService.includes('planning') && (serviceStr.includes('planning') || serviceStr === '2' || serviceStr.includes('2.'))) serviceMatch = true;
        else if (filterService.includes('Astrology') && (serviceStr.includes('astrology') || serviceStr.includes('numerology') || serviceStr === '3' || serviceStr.includes('3.'))) serviceMatch = true;
        else if (filterService.includes('seekhna') && (serviceStr.includes('seekhna') || serviceStr === '4' || serviceStr.includes('4.'))) serviceMatch = true;
        else if (filterService.includes('tool') && (serviceStr.includes('tool') || serviceStr.includes('app') || serviceStr === '5' || serviceStr.includes('5.'))) serviceMatch = true;
        else if (serviceStr.includes(filterService.toLowerCase())) serviceMatch = true;
      }
    }

    let searchMatch = true;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const nameMatch = lead.data?.name?.toLowerCase().includes(q);
      const phoneMatch = lead.phone_number?.includes(q);
      const cityMatch = lead.data?.city?.toLowerCase().includes(q);
      searchMatch = !!(nameMatch || phoneMatch || cityMatch);
    }

    return serviceMatch && searchMatch;
  });

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const currentLeads = filteredLeads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Vastu Leads CRM</h1>
          <p className="text-gray-500 mt-2">Manage and view all your qualified leads and their information.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <input 
              type="text" 
              placeholder="Search name, phone, city..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 w-full sm:w-64"
            />
            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          
          <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-100 w-full sm:w-auto">
            <span className="text-sm text-gray-500 font-medium pl-2 hidden sm:inline">Filter:</span>
            <select 
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
              className="text-sm bg-gray-50 border border-gray-200 text-gray-700 py-1.5 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 w-full sm:w-auto"
            >
              <option value="All">All Leads</option>
              <option value="Ghar/Office ka Vastu issue solve karwana hai">Vastu Issue</option>
              <option value="Naya ghar bana raha/rahi hoon — planning chahiye">New House Planning</option>
              <option value="Astrology ya Numerology se related sawal hai">Astrology / Numerology</option>
              <option value="Vastu khud seekhna chahta/chahti hoon">Learn Vastu</option>
              <option value="Vastu check karne wala tool/app chahiye">Vastu Tool/App</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Name</th>
                <th className="px-6 py-4 whitespace-nowrap">Phone Number</th>
                <th className="px-6 py-4 whitespace-nowrap">City</th>
                <th className="px-6 py-4 whitespace-nowrap">Property</th>
                <th className="px-6 py-4 whitespace-nowrap">Floor Plan</th>
                <th className="px-6 py-4 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="animate-pulse flex flex-col items-center">
                      <div className="h-6 w-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                      Loading leads...
                    </div>
                  </td>
                </tr>
              ) : currentLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No leads found for this filter or search.
                  </td>
                </tr>
              ) : (
                currentLeads.map((lead, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {lead.data?.name || <span className="text-gray-400 italic">Unknown</span>}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {lead.phone_number}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {lead.data?.city ? <span className="capitalize">{lead.data.city}</span> : '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {lead.data?.property_type ? <span className="capitalize">{lead.data.property_type}</span> : '-'}
                    </td>
                    <td className="px-6 py-4">
                      {lead.data?.has_floor_plan ? (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          lead.data.has_floor_plan.toLowerCase().includes('yes') || lead.data.has_floor_plan.toLowerCase().includes('haan')
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {lead.data.has_floor_plan}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedLead(lead)}
                        className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                      >
                        View Lead
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <span className="text-sm text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredLeads.length)} of {filteredLeads.length} leads
            </span>
            <div className="flex gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="px-3 py-1.5 text-sm bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Previous
              </button>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="px-3 py-1.5 text-sm bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900">Lead Details</h3>
              <button 
                onClick={() => setSelectedLead(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Contact Info</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="block text-sm text-gray-500">Phone Number</span>
                      <span className="block text-base font-medium text-gray-900">{selectedLead.phone_number}</span>
                    </div>
                    <div>
                      <span className="block text-sm text-gray-500">Name</span>
                      <span className="block text-base font-medium text-gray-900 capitalize">{selectedLead.data?.name || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="block text-sm text-gray-500">City</span>
                      <span className="block text-base font-medium text-gray-900 capitalize">{selectedLead.data?.city || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Extracted Details</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="block text-sm text-gray-500">Service Selected</span>
                      <span className="block text-base font-medium text-gray-900">{selectedLead.data?.service_type || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="block text-sm text-gray-500">Property Type</span>
                      <span className="block text-base font-medium text-gray-900 capitalize">{selectedLead.data?.property_type || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="block text-sm text-gray-500">Has Floor Plan</span>
                      <span className="block text-base font-medium text-gray-900">{selectedLead.data?.has_floor_plan || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedLead.data?.intent_category && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">AI Analysis</h4>
                  <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                    <span className="block text-sm text-blue-600 font-medium mb-1">Intent Category</span>
                    <span className="block text-base text-blue-900">{selectedLead.data.intent_category}</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button 
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
