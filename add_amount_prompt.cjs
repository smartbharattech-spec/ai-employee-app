const fs = require('fs');
const path = 'src/app/dashboard/numbers/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const targetFunction = `  const handleQuickStatusChange = async (chat_id: string, newStatus: string, existingCrmData: any) => {
    try {
      const updatedData = { ...(existingCrmData?.data || {}), conversion_status: newStatus };`;

const replacement = `  const handleQuickStatusChange = async (chat_id: string, newStatus: string, existingCrmData: any) => {
    let amount = '';
    if (newStatus === 'converted') {
      const input = window.prompt("Enter the amount (₹) for closing this lead:");
      if (input === null) return; // User cancelled
      amount = input;
    }

    try {
      const updatedData = { ...(existingCrmData?.data || {}), conversion_status: newStatus };
      if (newStatus === 'converted') {
        updatedData.payment_amount = amount;
      }`;

if(content.includes(targetFunction)) {
  content = content.replace(targetFunction, replacement);
  fs.writeFileSync(path, content);
  console.log('handleQuickStatusChange updated successfully');
} else {
  console.log('Could not find handleQuickStatusChange');
}
