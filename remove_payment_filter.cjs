const fs = require('fs');
const path = 'src/app/dashboard/numbers/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Remove `paymentFilter` state
content = content.replace(/const \[paymentFilter, setPaymentFilter\] = useState\('all'\);\n?\s*/, '');

// 2. Remove payment filter logic from filteredSubscribers
const pfLogicRegex = /\s*\/\/\s*Payment Filter\s*const payment = sub\.crmData\?\.data\?\.payment_status \|\| 'not_paid';\s*if \(paymentFilter !== 'all' && paymentFilter !== payment\) return false;\s*/;
content = content.replace(pfLogicRegex, '\n    ');

// 3. Remove from Clear Filters button condition and onClick
content = content.replace(/ \|\| paymentFilter !== 'all'/g, '');
content = content.replace(/setPaymentFilter\('all'\);\s*/g, '');

// 4. Update the Modal UI using regex
const modalTargetRegex = /\{\/\* Payment & Conversion Status \*\/\}[\s\S]*?<textarea placeholder="Notes" value=\{editFormData\.notes \|\| ''\} onChange=\{\(e\) => setEditFormData\(\{\.\.\.editFormData, notes: e\.target\.value\}\)\} className="border border-slate-200 rounded-xl px-4 py-3 text-sm mt-8 w-full focus:outline-none focus:border-blue-500" rows=\{3\} \/>\s*<\/div>/;

const modalReplacementStr = `{/* Conversion Status */}
              <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-6">
                <h4 className="text-[13px] font-extrabold text-slate-600 mb-6 uppercase tracking-wider">Conversion Status</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
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
                  <div>
                    {editFormData.conversion_status === 'converted' && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                          <h5 className="text-[13px] font-extrabold text-slate-600 mb-4 tracking-wider">Amount (₹)</h5>
                          <input type="number" placeholder="Enter amount" value={editFormData.payment_amount || ''} onChange={(e) => setEditFormData({...editFormData, payment_amount: e.target.value})} className="border border-slate-200 rounded-xl px-4 py-3 text-sm w-full focus:outline-none focus:border-blue-500" />
                        </div>
                    )}
                  </div>
                </div>
                <textarea placeholder="Notes" value={editFormData.notes || ''} onChange={(e) => setEditFormData({...editFormData, notes: e.target.value})} className="border border-slate-200 rounded-xl px-4 py-3 text-sm mt-8 w-full focus:outline-none focus:border-blue-500" rows={3} />
              </div>`;

if(modalTargetRegex.test(content)) {
  content = content.replace(modalTargetRegex, modalReplacementStr);
  fs.writeFileSync(path, content);
  console.log('Removed Payment Filter and updated Modal');
} else {
  console.log('Could not find modal target regex');
}
