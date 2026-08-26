'use client';

import { useState, useEffect } from 'react';

export default function TeamSettingsPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [defaultReceiver, setDefaultReceiver] = useState('');
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const [currentUserEmail, setCurrentUserEmail] = useState('');

  // New user form state
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'agent' });
  const [mysqlTeam, setMysqlTeam] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/team')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUsers(data.users || []);
          setDefaultReceiver(data.default_receiver || '');
          setCurrentUserEmail(data.currentUserEmail || '');
          
          // Fetch external MySQL team members
          const userEmailToFetch = data.currentUserEmail || 'nikhilagarwal241195@gmail.com';
          fetch(`https://myvastutool.com/database_bridge.php?action=get_mysql_team&key=kraya_bridge_key_2026&email=${encodeURIComponent(userEmailToFetch)}`)
            .then(res => res.json())
            .then(data2 => {
              if (data2.success && data2.data) {
                setMysqlTeam(data2.data);
              }
            })
            .catch(console.error);
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Team Management</h1>
        <p className="mt-2 text-gray-500">Manage your CRM users and lead assignment rules.</p>
      </div>

      {status && (
        <div className={`p-4 rounded-xl backdrop-blur-md border ${status.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {status.msg}
        </div>
      )}

      {/* Auto-Assignment Settings - SUPER ADMIN ONLY */}
      {(currentUserEmail === 'vastuwithnikhil@gmail.com' || currentUserEmail === 'nikhil@gmail.com') ? (
        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-6">
          <h3 className="text-xl font-medium text-gray-900 border-b border-gray-200 pb-3 flex items-center">
            <svg className="w-5 h-5 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            Super Admin: Lead Assignment Rule
          </h3>
          <p className="text-sm text-amber-600 mb-2">Only Super Admins can see and edit this setting.</p>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-600 mb-2">Default Team Member to Receive New Leads</label>
              <select 
                value={defaultReceiver}
                onChange={(e) => setDefaultReceiver(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">-- Select Member --</option>
                {users.map(u => (
                  <option key={u.email} value={u.email}>{u.name} ({u.email})</option>
                ))}
              </select>
            </div>
            <button 
              onClick={handleSaveReceiver}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-all shadow-lg"
            >
              Save Rule
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 flex items-center justify-center">
          <p className="text-gray-500 text-sm flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            Lead assignment rules can only be modified by the Super Admin.
          </p>
        </div>
      )}

      {/* Users List */}
      <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-6">
        <h3 className="text-xl font-medium text-gray-900 border-b border-gray-200 pb-3">Team Members</h3>
        
        <div className="space-y-4">
          {users.map((user, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-gray-100 transition-colors">
              <div>
                <p className="text-gray-900 font-medium">{user.name} <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md ml-2 uppercase border border-emerald-100">{user.role}</span></p>
                <p className="text-sm text-gray-500">{user.email}</p>
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
        <form onSubmit={handleAddUser} className="mt-8 pt-6 border-t border-gray-200 space-y-4">
          <h4 className="text-lg font-medium text-gray-700">Add New Team Member</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Name</label>
              <input 
                type="text" 
                required
                value={newUser.name}
                onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                className="w-full bg-white border border-gray-300 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="e.g. Ramesh"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Email (Login ID)</label>
              <input 
                type="email" 
                required
                value={newUser.email}
                onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full bg-white border border-gray-300 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="ramesh@team.com"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Password</label>
              <input 
                type="text" 
                required
                value={newUser.password}
                onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                className="w-full bg-white border border-gray-300 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="Enter a strong password"
              />
            </div>
          </div>
          <button type="submit" className="w-full md:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-all shadow-lg mt-4">
            Create Login ID
          </button>
        </form>
      </div>

    </div>
  );
}
