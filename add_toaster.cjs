const fs = require('fs');
const path = require('path');

const layoutPath = path.join('C:', 'xampp', 'htdocs', 'ai-employee-app', 'src', 'app', 'dashboard', 'layout.tsx');
let content = fs.readFileSync(layoutPath, 'utf8');

if (!content.includes("import { Toaster } from 'react-hot-toast';")) {
  content = content.replace(
    "import { useState } from 'react';",
    "import { useState } from 'react';\nimport { Toaster } from 'react-hot-toast';"
  );
}

if (!content.includes('<Toaster position="top-right" />')) {
  content = content.replace(
    /<div className="flex h-screen bg-slate-50\/50 font-sans text-gray-900 selection:bg-emerald-500\/30">/,
    '<div className="flex h-screen bg-slate-50/50 font-sans text-gray-900 selection:bg-emerald-500/30">\n      <Toaster position="top-right" />'
  );
}

fs.writeFileSync(layoutPath, content);
console.log('Added Toaster to layout');
