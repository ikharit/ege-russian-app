const fs = require('fs');
const content = fs.readFileSync('src/data/sections/dooshin20.ts', 'utf8');
const ids = [...content.matchAll(/id:\s*['"](qd20-[^'"]+)['"]/g)].map(m => m[1]);
console.log('Total question IDs found:', ids.length);
console.log('Unique IDs:', [...new Set(ids)].length);
const dupes = ids.filter((item, index) => ids.indexOf(item) !== index);
console.log('Duplicates:', [...new Set(dupes)]);
console.log('First 5 IDs:', ids.slice(0, 5));
console.log('Last 5 IDs:', ids.slice(-5));
