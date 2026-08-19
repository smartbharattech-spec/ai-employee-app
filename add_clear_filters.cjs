const fs = require('fs');
const path = 'src/app/dashboard/numbers/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const target = `<div className="relative w-full max-w-md">
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
            </div>`;

const replacement = `<div className="flex flex-1 items-center gap-4 w-full max-w-2xl">
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
              {(serviceFilter !== 'all' || topFilter !== 'all' || searchTerm !== '' || timeFilter !== 'all' || statusFilter !== 'all' || callFilter !== 'all' || paymentFilter !== 'all' || conversionFilter !== 'all') && (
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setServiceFilter('all');
                    setTopFilter('all');
                    setTimeFilter('all');
                    setStatusFilter('all');
                    setCallFilter('all');
                    setPaymentFilter('all');
                    setConversionFilter('all');
                    setCurrentPage(1);
                  }}
                  className="text-sm font-bold text-rose-500 hover:text-rose-600 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors whitespace-nowrap flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  Clear Filters
                </button>
              )}
            </div>`;

content = content.replace(target, replacement);
fs.writeFileSync(path, content);
console.log('Clear Filters button added');
