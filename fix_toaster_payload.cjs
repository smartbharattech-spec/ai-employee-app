const fs = require('fs');
const path = require('path');

const pagePath = path.join('C:', 'xampp', 'htdocs', 'ai-employee-app', 'src', 'app', 'dashboard', 'numbers', 'page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

// 1. Add import
if (!content.includes("import { Toaster, toast } from 'react-hot-toast';")) {
  content = content.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { Toaster, toast } from 'react-hot-toast';");
}

// 2. Fix handleQuickStatusChange & replace alerts
content = content.replace(
  /const handleQuickStatusChange = async \([^)]*\) => {[\s\S]*?catch \(err\) {[\s\S]*?}[\s\S]*?};/,
  `const handleQuickStatusChange = async (chat_id: string, newStatus: string, existingCrmData: any) => {
    try {
      const updatedData = { ...(existingCrmData?.data || {}), conversion_status: newStatus };
      const fullPayload = { ...(existingCrmData || {}), data: updatedData };
      const res = await fetch('/api/crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: chat_id, data: fullPayload })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Status updated successfully');
        setLiveStatus(prev => ({
          ...prev,
          subscribers: prev.subscribers.map(s => {
            if (s.chat_id === chat_id) {
              return { ...s, crmData: { ...s.crmData, data: updatedData } };
            }
            return s;
          })
        }));
      } else {
        toast.error('Failed to update status: ' + data.message);
      }
    } catch (err) {
      toast.error('Error updating status');
    }
  };`
);

// 3. Fix handleSaveCRM & replace alerts
content = content.replace(
  /const handleSaveCRM = async \(\) => {[\s\S]*?try {[\s\S]*?body: JSON.stringify\(\{ phone_number: selectedDetails.chat_id, data: editFormData \}\)[\s\S]*?\} catch \(err\) {[\s\S]*?alert\('Error saving CRM data'\);[\s\S]*?finally {[\s\S]*?setIsSavingCRM\(false\);[\s\S]*?}[\s\S]*?};/,
  `const handleSaveCRM = async () => {
    if (!selectedDetails) return;
    setIsSavingCRM(true);
    try {
      const fullPayload = { ...(selectedDetails.crmData || {}), data: editFormData };
      const res = await fetch('/api/crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: selectedDetails.chat_id, data: fullPayload })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('CRM data saved successfully.');
        setSelectedDetails({ ...selectedDetails, crmData: { ...selectedDetails.crmData, data: editFormData } });
        setIsEditingModal(false);
      } else {
        toast.error('Failed to save CRM data: ' + data.message);
      }
    } catch (err) {
      toast.error('Error saving CRM data');
    } finally {
      setIsSavingCRM(false);
    }
  };`
);

// 4. Add Toaster to JSX
if (!content.includes('<Toaster position="top-right" />')) {
  content = content.replace(
    /<div className="flex-1 bg-slate-50\/50">/,
    `<div className="flex-1 bg-slate-50/50">\n      <Toaster position="top-right" />`
  );
}

fs.writeFileSync(pagePath, content);
console.log('Fixed payload bugs and added react-hot-toast');
