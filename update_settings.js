const fs = require('fs');
const file = 'c:/xampp/htdocs/myvastutool/ai salesman employee/src/app/dashboard/settings/page.tsx';

let content = fs.readFileSync(file, 'utf8');

const targetStr = `<div className="pt-8 flex items-center justify-end">`;

if (content.includes(targetStr)) {
    const defaultServices = [
      { id: 'cat_consultation', name: 'consultation', steps: ['Step 1', 'Step 2'] },
      { id: 'cat_new_house', name: 'new_house', steps: ['Step 1', 'Step 2'] },
      { id: 'cat_astrology', name: 'astrology', steps: ['Step 1', 'Step 2'] },
      { id: 'cat_course', name: 'course', steps: ['Step 1', 'Step 2'] },
      { id: 'cat_tool', name: 'tool', steps: ['Step 1', 'Step 2'] },
      { id: 'cat_team_consultation', name: 'team_consultation', steps: ['Step 1', 'Step 2'] }
    ];

    // Modify useEffect to seed categories if empty
    const oldUseEffect = `useEffect(() => {
    try {
      if (config.service_categories) {
        setCategories(JSON.parse(config.service_categories));
      }
    } catch(e) {}
  }, [config.service_categories]);`;

    const newUseEffect = `useEffect(() => {
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
  }, [config.service_categories]);`;

    content = content.replace(oldUseEffect, newUseEffect);

    const uiBlock = `
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

          `;
    content = content.replace(targetStr, uiBlock + targetStr);
    fs.writeFileSync(file, content, 'utf8');
    console.log("Successfully updated settings page UI");
} else {
    console.log("Could not find insertion target.");
}
