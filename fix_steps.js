const fs = require('fs');
const file = 'c:/xampp/htdocs/myvastutool/ai salesman employee/src/app/dashboard/client-followup/page.tsx';

let content = fs.readFileSync(file, 'utf8');

// 1. Add states and functions
const stateAnchor = "const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);";
if (content.includes(stateAnchor) && !content.includes("openStepDropdownId")) {
    const newStates = `const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [openStepDropdownId, setOpenStepDropdownId] = useState<string | null>(null);
  const [customSteps, setCustomSteps] = useState<string[]>(['Step 1', 'Step 2', 'Step 3']);

  useEffect(() => {
    const saved = localStorage.getItem('custom_crm_steps');
    if (saved) {
      try {
        setCustomSteps(JSON.parse(saved));
      } catch(e) {}
    }
  }, []);

  const handleAddCustomStep = () => {
    const stepName = window.prompt("Enter new custom step name (e.g., 'Step 4: Design'):");
    if (stepName && stepName.trim()) {
      const newSteps = [...customSteps, stepName.trim()];
      setCustomSteps(newSteps);
      localStorage.setItem('custom_crm_steps', JSON.stringify(newSteps));
    }
  };

  const handleStepChange = async (chat_id: string, stepLabel: string, existingCrmData: any) => {
    setIsSavingCRM(true);
    try {
        let updatedData = { ...(existingCrmData?.data || {}), service_step_name: stepLabel };
        const fullPayload = { ...(existingCrmData || {}), data: updatedData };
        
        const res = await fetch('/api/crm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone_number: chat_id, data: fullPayload })
        });
        if (res.ok) {
            fetchSubscribers();
        }
    } catch (err) {
        console.error(err);
    } finally {
        setIsSavingCRM(false);
        setOpenStepDropdownId(null);
    }
  };`;
    content = content.replace(stateAnchor, newStates);
}

// 2. Add document click listener for openStepDropdownId
const clickAnchor = `setOpenStatusMenuId(null);
      }`;
if (content.includes(clickAnchor) && !content.includes("setOpenStepDropdownId(null);")) {
    content = content.replace(clickAnchor, `setOpenStatusMenuId(null);
        setOpenStepDropdownId(null);
      }`);
}

// 3. Replace the Delivery Flow Column header
const headerTarget = `{topFilter === 'converted' && <th className="px-6 py-4 hidden md:table-cell">Delivery Flow</th>}`;
if (content.includes(headerTarget)) {
    content = content.replace(headerTarget, `{topFilter === 'converted' && <th className="px-6 py-4 hidden md:table-cell">Delivery Step</th>}`);
}

// 4. Replace the Delivery Flow Column body
const bodyStart = `{/* Delivery Flow Column */}`;
const bodyEnd = `)}

                        <td className="px-6 py-4 max-w-[200px] md:max-w-xs hidden md:table-cell">`;

const startIndex = content.indexOf(bodyStart);
const endIndex = content.indexOf(bodyEnd);

if (startIndex !== -1 && endIndex !== -1) {
    const bodyReplacement = `{/* Delivery Step Column */}
                        {topFilter === 'converted' && (
                          <td className="px-6 py-4 hidden md:table-cell">
                            <div className="relative action-menu-container">
                                <div 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenStepDropdownId(openStepDropdownId === sub.chat_id ? null : sub.chat_id);
                                    }}
                                    className="inline-flex items-center justify-between w-32 px-3 py-1.5 rounded-lg border text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-colors bg-teal-50 text-teal-600 border-teal-200 hover:bg-teal-100"
                                >
                                    <span className="truncate">{sub.crmData?.data?.service_step_name || 'Select Step'}</span>
                                    <svg className="w-3 h-3 ml-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                                
                                <div className={\`absolute left-0 top-full mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-lg transition-all z-20 overflow-hidden flex flex-col p-1 \${openStepDropdownId === sub.chat_id ? 'opacity-100 visible' : 'opacity-0 invisible'}\`}>
                                    <div className="max-h-48 overflow-y-auto">
                                      {customSteps.map((step, i) => (
                                          <button
                                              key={i}
                                              onClick={(e) => { e.stopPropagation(); handleStepChange(sub.chat_id, step, sub.crmData); }}
                                              className={\`w-full text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-colors \${sub.crmData?.data?.service_step_name === step ? 'bg-teal-50 text-teal-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}\`}
                                          >
                                              {step}
                                          </button>
                                      ))}
                                    </div>
                                    <div className="border-t border-gray-100 mt-1 pt-1">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleAddCustomStep(); }}
                                            className="w-full text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors flex items-center"
                                        >
                                            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/></svg>
                                            Add Custom Step
                                        </button>
                                    </div>
                                </div>
                            </div>
                          </td>
                        `;
    content = content.substring(0, startIndex) + bodyReplacement + content.substring(endIndex);
} else {
    console.log("Could not find body replacement markers.");
}

fs.writeFileSync(file, content, 'utf8');
console.log("Custom steps implementation added.");
