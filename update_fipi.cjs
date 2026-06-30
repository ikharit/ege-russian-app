const fs = require('fs');
const content = fs.readFileSync('src/data/fipiVariants.ts', 'utf-8');

const task13Line = "      { taskNumber: 13, type: 'practice', title: 'НЕ/НИ с частями речи', maxScore: 1, sectionId: 'section-orthography', dataSource: 'task13', questionCount: 1 },";

const oldStr = "{ taskNumber: 12, type: 'practice', title: 'Окончания причастий и деепричастий', maxScore: 1, sectionId: 'section-grammar', dataSource: 'task12', questionCount: 1 },\n      { taskNumber: 14";
const newStr = "{ taskNumber: 12, type: 'practice', title: 'Окончания причастий и деепричастий', maxScore: 1, sectionId: 'section-grammar', dataSource: 'task12', questionCount: 1 },\n" + task13Line + "\n      { taskNumber: 14";

const updated = content.replace(oldStr, newStr);

fs.writeFileSync('src/data/fipiVariants.ts', updated, 'utf-8');
console.log('Updated fipiVariants.ts');
