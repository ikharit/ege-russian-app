const fs = require('fs');
const content = fs.readFileSync('src/data/theoryData.ts', 'utf8');
let count = 0;
for (let i = 0; i < content.length; i++) {
  if (content[i] === '`' && (i === 0 || content[i-1] !== '\\')) count++;
}
console.log('Unescaped backticks:', count);
console.log('Should be even:', count % 2 === 0);
