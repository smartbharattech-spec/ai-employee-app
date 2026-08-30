const fs = require('fs');
const file = 'c:/xampp/htdocs/myvastutool/ai salesman employee/src/app/dashboard/client-followup/page.tsx';

let content = fs.readFileSync(file, 'utf8');

// 1. Add state for serviceCategories
const stateAnchor = "const [customSteps, setCustomSteps]";
if (content.includes(stateAnchor)) {
    // we already removed customSteps but wait, the previous script removed it and added DELIVERY_STEPS.
    // Let's find DELIVERY_STEPS
}

const delAnchor = "const DELIVERY_STEPS = ['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5'];";
if (content.includes(delAnchor)) {
    const newState = `const [serviceCategories, setServiceCategories] = useState<any[]>([]);
  
  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.service_categories) {
          try {
            setServiceCategories(JSON.parse(data.data.service_categories));
          } catch(e) {}
        }
      })
      .catch(() => {});
  }, []);`;
    content = content.replace(delAnchor, newState);
}

// 2. Replace the dropdown map logic in the table
const mapAnchor = `{DELIVERY_STEPS.map((step, i) => (`;
if (content.includes(mapAnchor)) {
    // We want to calculate the specific steps for this row's sub
    const replacement = `{(() => {
                                        const leadService = sub.crmData?.data?.service_type || sub.crmData?.data?.service_category || 'consultation';
                                        const cat = serviceCategories.find(c => c.name.toLowerCase() === leadService.toLowerCase() || c.id === leadService) || serviceCategories[0];
                                        const stepsToRender = cat?.steps || ['Step 1', 'Step 2', 'Step 3'];
                                        
                                        return stepsToRender.map((step: string, i: number) => (
                                          <button
                                              key={i}
                                              onClick={(e) => { e.stopPropagation(); handleStepChange(sub.chat_id, step, sub.crmData); }}
                                              className={\`w-full text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-colors \${sub.crmData?.data?.service_step_name === step ? 'bg-teal-50 text-teal-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}\`}
                                          >
                                              {step}
                                          </button>
                                        ));
                                      })()}`;
    content = content.replace(`{DELIVERY_STEPS.map((step, i) => (
                                          <button
                                              key={i}
                                              onClick={(e) => { e.stopPropagation(); handleStepChange(sub.chat_id, step, sub.crmData); }}
                                              className={\`w-full text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-colors \${sub.crmData?.data?.service_step_name === step ? 'bg-teal-50 text-teal-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}\`}
                                          >
                                              {step}
                                          </button>
                                      ))}`, replacement);
}

fs.writeFileSync(file, content, 'utf8');
console.log("Updated client-followup with dynamic service categories.");
