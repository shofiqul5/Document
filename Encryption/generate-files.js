// ব্যবহার: node generate-files.js
// এই ফোল্ডারের সব ফাইল ও সাবফোল্ডারের (ভেতরের ফোল্ডারসহ) তালিকা দিয়ে files.json বানায়।
const fs = require('fs');
const path = require('path');

const ignore = new Set(['index.html', 'files.json', 'generate-files.js', '_headers', '_redirects', '_worker.js', 'functions', 'node_modules']);

function scan(dir) {
    return fs.readdirSync(dir, { withFileTypes: true })
        .filter(e => !e.name.startsWith('.') && !ignore.has(e.name))
        .map(e => e.isDirectory()
            ? { name: e.name, type: 'dir', children: scan(path.join(dir, e.name)) }
            : { name: e.name, type: 'file' })
        .sort((a, b) => (a.type === b.type ? 0 : a.type === 'dir' ? -1 : 1) || a.name.localeCompare(b.name));
}

const items = scan(__dirname);
fs.writeFileSync(path.join(__dirname, 'files.json'), JSON.stringify(items, null, 2));
console.log(`files.json created with ${items.length} top-level items`);
