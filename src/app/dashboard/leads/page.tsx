'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterService, setFilterService] = useState('Ghar/Office ka Vastu issue solve karwana hai');
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

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

  const filteredLeads = leads.filter(lead => {
    if (filterService === 'All') return true;
    if (!lead.data?.service_type) return false;

    const serviceStr = lead.data.service_type.toLowerCase();
    
    if (filterService.includes('issue') && (serviceStr.includes('issue') || serviceStr === '1' || serviceStr.includes('1.'))) return true;
    if (filterService.includes('planning') && (serviceStr.includes('planning') || serviceStr === '2' || serviceStr.includes('2.'))) return true;
    if (filterService.includes('Astrology') && (serviceStr.includes('astrology') || serviceStr.includes('numerology') || serviceStr === '3' || serviceStr.includes('3.'))) return true;
    if (filterService.includes('seekhna') && (serviceStr.includes('seekhna') || serviceStr === '4' || serviceStr.includes('4.'))) return true;
    if (filterService.includes('tool') && (serviceStr.includes('tool') || serviceStr.includes('app') || serviceStr === '5' || serviceStr.includes('5.'))) return true;

    // Fallback exact match
    return serviceStr.includes(filterService.toLowerCase());
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Vastu Leads CRM</h1>
          <p className="text-gray-500 mt-2">Manage and view all your qualified leads and their information.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
          <span className="text-sm text-gray-500 font-medium pl-2">Filter:</span>
          <select 
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
            className="text-sm bg-gray-50 border border-gray-200 text-gray-700 py-1.5 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
          >
            <option value="All">All Leads</option>
            <option value="Ghar/Office ka Vastu issue solve karwana hai">Vastu Issue (Ghar/Office)</option>
            <option value="Naya ghar bana raha/rahi hoon — planning chahiye">New House Planning</option>
            <option value="Astrology ya Numerology se related sawal hai">Astrology / Numerology</option>
            <option value="Vastu khud seekhna chahta/chahti hoon">Learn Vastu</option>
            <option value="Vastu check karne wala tool/app chahiye">Vastu Tool/App</option>
          </select>
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
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No leads found for this filter.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead, idx) => (
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
