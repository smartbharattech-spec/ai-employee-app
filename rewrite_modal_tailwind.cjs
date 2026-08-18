const fs = require('fs');
const path = require('path');

const pagePath = path.join('C:', 'xampp', 'htdocs', 'ai-employee-app', 'src', 'app', 'dashboard', 'numbers', 'page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

const newModalUI = `
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
`;

content = content.replace(/\{\/\* View Details Modal \*\/\s*\n\s*\{detailsModalOpen && selectedDetails && \([\s\S]*?(?=\{\/\* End View Details Modal \*\/|    <\/div>\n  \);\n})/m, newModalUI + '\n');
// if it didn't match the end comment, let's just do a simpler regex from {/* View Details Modal */} to the end of the file.
if (content.indexOf('border-amber-100 text-amber-800 text-sm') !== -1) {
    // it didn't replace, so we do it manually.
    content = content.substring(0, content.indexOf('{/* View Details Modal */}')) + newModalUI + '\n    </div>\n  );\n}';
}

fs.writeFileSync(pagePath, content);
console.log('Successfully updated modal design in ai-employee-app');
