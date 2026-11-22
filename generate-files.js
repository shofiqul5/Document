// ব্যবহার: node generate-files.js
// এই ফোল্ডারের সব ফাইল ও ফোল্ডারের তালিকা দিয়ে files.json বানায়।
const fs = require('fs');
const path = require('path');

const ignore = new Set(['index.html', 'files.json', 'generate-files.js', '_headers', '_redirects', '_worker.js', 'functions', 'node_modules']);

const items = fs.readdirSync(__dirname, { withFileTypes: true })
    .filter(e => !e.name.startsWith('.') && !ignore.has(e.name))
    .map(e => ({ name: e.name, type: e.isDirectory() ? 'dir' : 'file' }))
    .sort((a, b) => (a.type === b.type ? 0 : a.type === 'dir' ? -1 : 1) || a.name.localeCompare(b.name));

fs.writeFileSync(path.join(__dirname, 'files.json'), JSON.stringify(items, null, 2));
console.log(`files.json created with ${items.length} items`);
