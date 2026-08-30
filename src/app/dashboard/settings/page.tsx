'use client';

import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const [config, setConfig] = useState({
    wm_api_token: '',
    wm_phone_number_id: '',
    gemini_api_key: '',
    service_categories: '[]'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const [categories, setCategories] = useState<{id:string, name:string, steps:string[]}[]>([]);
  
  useEffect(() => {
    try {
      if (config.service_categories && config.service_categories !== '[]' && config.service_categories.length > 5) {
        setCategories(JSON.parse(config.service_categories));
      } else {
        // Seed with default categories
        const defaultCats = [
          { id: 'cat_consultation', name: 'consultation', label: 'Ghar/Office ka Vastu issue', steps: ['Step 1', 'Step 2'] },
          { id: 'cat_new_house', name: 'new_house', label: 'Naya ghar bana raha/rahi hoon', steps: ['Step 1', 'Step 2'] },
          { id: 'cat_astrology', name: 'astrology', label: 'Astrology ya Numerology', steps: ['Step 1', 'Step 2'] },
          { id: 'cat_course', name: 'course', label: 'Vastu khud seekhna chahta/chahti hoon', steps: ['Step 1', 'Step 2'] },
          { id: 'cat_tool', name: 'tool', label: 'Vastu check karne wala tool/app', steps: ['Step 1', 'Step 2'] },
          { id: 'cat_team_consultation', name: 'team_consultation', label: 'Team Support', steps: ['Step 1', 'Step 2'] },
          { id: 'cat_architecture', name: 'architecture', label: 'Architecture', steps: ['Step 1', 'Step 2'] }
        ];
        setCategories(defaultCats);
        setConfig(prev => ({ ...prev, service_categories: JSON.stringify(defaultCats) }));
      }
    } catch(e) {}
  }, [config.service_categories]);

  const updateConfigCategories = (newCats: any) => {
    setCategories(newCats);
    setConfig(prev => ({ ...prev, service_categories: JSON.stringify(newCats) }));
  };

  const addCategory = () => {
    const newCats = [...categories, { id: 'cat_' + Date.now(), name: 'New Category', steps: ['Step 1'] }];
    updateConfigCategories(newCats);
  };

  const removeCategory = (id: string) => {
    const newCats = categories.filter(c => c.id !== id);
    updateConfigCategories(newCats);
  };

  const updateCategoryName = (id: string, name: string) => {
    const newCats = categories.map(c => c.id === id ? { ...c, name } : c);
    updateConfigCategories(newCats);
  };

  const addStep = (id: string) => {
    const newCats = categories.map(c => {
      if (c.id === id) return { ...c, steps: [...c.steps, 'New Step'] };
      return c;
    });
    updateConfigCategories(newCats);
  };

  const updateStep = (catId: string, stepIndex: number, val: string) => {
    const newCats = categories.map(c => {
      if (c.id === catId) {
        const newSteps = [...c.steps];
        newSteps[stepIndex] = val;
        return { ...c, steps: newSteps };
      }
      return c;
    });
    updateConfigCategories(newCats);
  };

  const removeStep = (catId: string, stepIndex: number) => {
    const newCats = categories.map(c => {
      if (c.id === catId) {
        const newSteps = c.steps.filter((_, i) => i !== stepIndex);
        return { ...c, steps: newSteps };
      }
      return c;
    });
    updateConfigCategories(newCats);
  };


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
      <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8 animate-pulse w-full">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
        <div className="space-y-6">
          <div className="h-64 bg-gray-200 rounded-2xl w-full"></div>
          <div className="h-64 bg-gray-200 rounded-2xl w-full"></div>
        </div>
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
              <svg className="w-5 h-5 mr-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              WhatsMarketing Setup
            </h3>
            
            <div className="group">
              <label className="block text-sm font-medium text-gray-400 mb-2 group-focus-within:text-emerald-400 transition-colors">API Token</label>
              <input 
                type="text" 
                name="wm_api_token"
                value={config.wm_api_token}
                onChange={handleChange}
                placeholder="Enter WhatsMarketing API Token"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder-gray-400"
              />
            </div>
            
            <div className="group">
              <label className="block text-sm font-medium text-gray-600 mb-2 group-focus-within:text-emerald-600 transition-colors">Phone Number ID</label>
              <input 
                type="text" 
                name="wm_phone_number_id"
                value={config.wm_phone_number_id}
                onChange={handleChange}
                placeholder="Enter Phone Number ID"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder-gray-400"
              />
            </div>
          </div>

          <div className="space-y-5 pt-2">
            <h3 className="text-xl font-medium text-gray-900 border-b border-gray-200 pb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              Google Gemini AI
            </h3>
            
            <div className="group">
              <label className="block text-sm font-medium text-gray-600 mb-2 group-focus-within:text-emerald-600 transition-colors">Gemini API Key</label>
              <input 
                type="password" 
                name="gemini_api_key"
                value={config.gemini_api_key}
                onChange={handleChange}
                placeholder="Enter your Gemini API key"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder-gray-400"
              />
            </div>
          </div>




          
          {/* Services & Steps Configuration */}
          <div className="space-y-5 pt-8">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <h3 className="text-xl font-medium text-gray-900 flex items-center">
                <svg className="w-5 h-5 mr-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                Services & Steps
                </h3>
                <button 
                  type="button"
                  onClick={addCategory}
                  className="px-3 py-1 bg-emerald-50 text-emerald-600 text-sm font-bold rounded-lg hover:bg-emerald-100 transition-colors"
                >
                  + Add Service
                </button>
            </div>
            
            <div className="space-y-4">
              {categories.map((cat) => (
                <div key={cat.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 relative group/cat">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex-1 flex gap-2">
                      <input 
                        type="text" 
                        value={(cat as any).label || cat.name}
                        onChange={(e) => {
                          const newCats = categories.map(c => c.id === cat.id ? { ...c, label: e.target.value, name: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '_') } : c);
                          updateConfigCategories(newCats);
                        }}
                        className="font-semibold text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-2 w-full md:w-2/3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        placeholder="Service Name (e.g., Team Support)"
                      />
                      <input 
                        type="text" 
                        value={cat.name}
                        readOnly
                        className="text-xs text-gray-400 bg-transparent border-none w-1/3 outline-none"
                        title="System ID (Auto-generated)"
                      />
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeCategory(cat.id)}
                      className="text-red-400 hover:text-red-600 px-2 py-1"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>

                  <div className="pl-0 md:pl-6 space-y-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Delivery Steps</p>
                    {cat.steps.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm w-6">{idx + 1}.</span>
                        <input 
                          type="text"
                          value={step}
                          onChange={(e) => updateStep(cat.id, idx, e.target.value)}
                          className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                        <button 
                          type="button"
                          onClick={() => removeStep(cat.id, idx)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                    <button 
                      type="button"
                      onClick={() => addStep(cat.id)}
                      className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center mt-2"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      Add Step
                    </button>
                  </div>
                </div>
              ))}
              {categories.length === 0 && <p className="text-sm text-gray-500 italic">No services configured. Click '+ Add Service' above.</p>}
            </div>
          </div>

          <div className="pt-8 flex items-center justify-end">
            <button 
              type="submit" 
              disabled={saving}
              className="relative inline-flex items-center justify-center px-10 py-4 overflow-hidden font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)]"
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
