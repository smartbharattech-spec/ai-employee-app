'use client';

import { useState, useEffect } from 'react';

export default function TeamSettingsPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [defaultReceiver, setDefaultReceiver] = useState('');
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  // New user form state
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'agent' });

  useEffect(() => {
    fetch('/api/team')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUsers(data.users || []);
          setDefaultReceiver(data.default_receiver || '');
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSaveUsers = async (updatedUsers: any[]) => {
    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_users', users: updatedUsers })
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', msg: 'Team updated successfully!' });
      } else {
        setStatus({ type: 'error', msg: data.message || 'Failed to update team.' });
      }
    } catch (error) {
      setStatus({ type: 'error', msg: 'Network error occurred.' });
    }
    setTimeout(() => setStatus(null), 4000);
  };

  const handleSaveReceiver = async () => {
    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_settings', default_receiver: defaultReceiver })
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', msg: 'Default receiver updated successfully!' });
      } else {
        setStatus({ type: 'error', msg: data.message || 'Failed to update receiver.' });
      }
    } catch (error) {
      setStatus({ type: 'error', msg: 'Network error occurred.' });
    }
    setTimeout(() => setStatus(null), 4000);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.email || !newUser.password || !newUser.name) return;
    const updated = [...users, { ...newUser }];
    setUsers(updated);
    handleSaveUsers(updated);
    setNewUser({ name: '', email: '', password: '', role: 'agent' });
  };

  const handleRemoveUser = (email: string) => {
    if(!confirm(`Are you sure you want to remove ${email}?`)) return;
    const updated = users.filter(u => u.email !== email);
    setUsers(updated);
    handleSaveUsers(updated);
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
        <h1 className="text-3xl font-bold tracking-tight text-white">Team Management</h1>
        <p className="mt-2 text-gray-400">Manage your CRM users and lead assignment rules.</p>
      </div>

      {status && (
        <div className={`p-4 rounded-xl backdrop-blur-md border ${status.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          {status.msg}
        </div>
      )}

      {/* Auto-Assignment Settings */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <h3 className="text-xl font-medium text-white border-b border-gray-800 pb-3">Lead Assignment Rule</h3>
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-400 mb-2">Default Team Member to Receive New Leads</label>
            <select 
              value={defaultReceiver}
              onChange={(e) => setDefaultReceiver(e.target.value)}
              className="w-full bg-gray-950/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">-- Select Member --</option>
              {users.map(u => (
                <option key={u.email} value={u.email}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>
          <button 
            onClick={handleSaveReceiver}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all shadow-lg"
          >
            Save Rule
          </button>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <h3 className="text-xl font-medium text-white border-b border-gray-800 pb-3">Team Members</h3>
        
        <div className="space-y-4">
          {users.map((user, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-800/30 border border-gray-700/50 rounded-2xl">
              <div>
                <p className="text-white font-medium">{user.name} <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-md ml-2 uppercase">{user.role}</span></p>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
              {user.email !== 'nikhil@gmail.com' && (
                <button 
                  onClick={() => handleRemoveUser(user.email)}
                  className="mt-3 sm:mt-0 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium rounded-lg transition-colors border border-red-500/20"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add User Form */}
        <form onSubmit={handleAddUser} className="mt-8 pt-6 border-t border-gray-800 space-y-4">
          <h4 className="text-lg font-medium text-gray-300">Add New Member</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Full Name" 
              value={newUser.name}
              onChange={e => setNewUser({...newUser, name: e.target.value})}
              required
              className="w-full bg-gray-950/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500"
            />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={newUser.email}
              onChange={e => setNewUser({...newUser, email: e.target.value})}
              required
              className="w-full bg-gray-950/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500"
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={newUser.password}
              onChange={e => setNewUser({...newUser, password: e.target.value})}
              required
              className="w-full bg-gray-950/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500"
            />
            <select 
              value={newUser.role}
              onChange={e => setNewUser({...newUser, role: e.target.value})}
              className="w-full bg-gray-950/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="agent">Agent (Limited Access)</option>
              <option value="admin">Admin (Full Access)</option>
            </select>
          </div>
          <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-all shadow-lg">
            Add Team Member
          </button>
        </form>
      </div>

    </div>
  );
}
