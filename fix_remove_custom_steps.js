const fs = require('fs');
const file = 'c:/xampp/htdocs/myvastutool/ai salesman employee/src/app/dashboard/client-followup/page.tsx';

let content = fs.readFileSync(file, 'utf8');

// 1. Remove customSteps state, useEffect and handleAddCustomStep
const stateStart = `const [customSteps, setCustomSteps] = useState<string[]>(['Step 1', 'Step 2', 'Step 3']);`;
const handleEnd = `localStorage.setItem('custom_crm_steps', JSON.stringify(newSteps));
    }
  };`;

const startIndex = content.indexOf(stateStart);
const endIndex = content.indexOf(handleEnd) + handleEnd.length;

if (startIndex !== -1 && endIndex !== -1) {
    // define a static array instead
    const replacement = `const DELIVERY_STEPS = ['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5'];`;
    content = content.substring(0, startIndex) + replacement + content.substring(endIndex);
}

// 2. Remove the Add Custom Step button and change map array
const buttonBlockStart = `<div className="border-t border-gray-100 mt-1 pt-1">`;
const buttonBlockEnd = `Add Custom Step
                                        </button>
                                    </div>`;

const bStartIndex = content.indexOf(buttonBlockStart);
const bEndIndex = content.indexOf(buttonBlockEnd) + buttonBlockEnd.length;

if (bStartIndex !== -1 && bEndIndex !== -1) {
    content = content.substring(0, bStartIndex) + content.substring(bEndIndex);
}

// update the array mapping
content = content.replace(`{customSteps.map((step, i) => (`, `{DELIVERY_STEPS.map((step, i) => (`);

fs.writeFileSync(file, content, 'utf8');
console.log("Custom steps removed and changed to static predefined steps.");
