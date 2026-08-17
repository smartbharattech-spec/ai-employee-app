'use client';

import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const [config, setConfig] = useState({
    wm_api_token: '',
    wm_phone_number_id: '',
    gemini_api_key: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setConfig(prev => ({ ...prev, ...data.data }));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', msg: 'Configuration saved successfully!' });
      } else {
        setStatus({ type: 'error', msg: data.message || 'Failed to save configuration.' });
      }
    } catch (error) {
      setStatus({ type: 'error', msg: 'Network error occurred.' });
    }
    setSaving(false);
    
    // Auto clear status
    setTimeout(() => setStatus(null), 4000);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">System Configuration</h1>
        <p className="mt-2 text-gray-500">Manage your WhatsApp API and AI Model credentials securely.</p>
      </div>

      {/* Status Message */}
      {status && (
        <div className={`p-4 rounded-xl backdrop-blur-md border ${status.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          <div className="flex items-center">
            {status.type === 'success' ? (
              <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )}
            {status.msg}
          </div>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
        <form onSubmit={handleSave} className="space-y-8">
          
          <div className="space-y-5">
            <h3 className="text-xl font-medium text-gray-900 border-b border-gray-200 pb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              WhatsMarketing Setup
            </h3>
            
            <div className="group">
              <label className="block text-sm font-medium text-gray-400 mb-2 group-focus-within:text-indigo-400 transition-colors">API Token</label>
              <input 
                type="text" 
                name="wm_api_token"
                value={config.wm_api_token}
                onChange={handleChange}
                placeholder="Enter WhatsMarketing API Token"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder-gray-400"
              />
            </div>
            
            <div className="group">
              <label className="block text-sm font-medium text-gray-600 mb-2 group-focus-within:text-indigo-600 transition-colors">Phone Number ID</label>
              <input 
                type="text" 
                name="wm_phone_number_id"
                value={config.wm_phone_number_id}
                onChange={handleChange}
                placeholder="Enter Phone Number ID"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder-gray-400"
              />
            </div>
          </div>

          <div className="space-y-5 pt-2">
            <h3 className="text-xl font-medium text-gray-900 border-b border-gray-200 pb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              Google Gemini AI
            </h3>
            
            <div className="group">
              <label className="block text-sm font-medium text-gray-600 mb-2 group-focus-within:text-indigo-600 transition-colors">Gemini API Key</label>
              <input 
                type="password" 
                name="gemini_api_key"
                value={config.gemini_api_key}
                onChange={handleChange}
                placeholder="Enter your Gemini API key"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder-gray-400"
              />
            </div>
          </div>

          <div className="pt-8 flex items-center justify-end">
            <button 
              type="submit" 
              disabled={saving}
              className="relative inline-flex items-center justify-center px-10 py-4 overflow-hidden font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)]"
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Configuration'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
