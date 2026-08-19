const fs = require('fs');
const path = 'src/app/dashboard/numbers/page.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  '<div className="grid grid-cols-2 gap-1.5">',
  '<div className="flex flex-col gap-1">'
);

content = content.replaceAll(
  'text-[10px] px-2 py-1.5 rounded font-medium',
  'w-full text-left text-[11px] px-3 py-2 rounded-md font-medium flex items-center justify-between'
);

fs.writeFileSync(path, content);
console.log('Grid changed to list');
