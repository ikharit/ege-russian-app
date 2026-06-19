const fs = require('fs');
const path = require('path');

const lessons = [];
const groups = [];

for (const task of ['task9', 'task10', 'task11', 'task12']) {
  const file = fs.readFileSync(path.join('C:/Users/USER/Documents/kimi/workspace/ege-russian-app/src/data/sections/dooshin', task + '.ts'), 'utf-8');
  const sectionIdMatch = file.match(/id:\s*\"(section-dooshin-\d+)\"/);
  const titleMatch = file.match(/title:\s*\"([^\"]+)\"/);
  const subtitleMatch = file.match(/subtitle:\s*\"([^\"]+)\"/);
  const sectionId = sectionIdMatch ? sectionIdMatch[1] : 'section-dooshin';
  const sectionTitle = titleMatch ? titleMatch[1] : task;
  const sectionSubtitle = subtitleMatch ? subtitleMatch[1] : '';
  
  const lessonRegex = /id:\s*\"(lesson-dooshin-[\d-]+)\"[\s\S]*?title:\s*\"([^\"]+)\"[\s\S]*?type:\s*'([^']+)'[\s\S]*?description:\s*\"([^\"]+)\"[\s\S]*?xpReward:\s*(\d+)[\s\S]*?prerequisites:\s*(\[[^\]]*\])/g;
  let m;
  const groupLessons = [];
  while ((m = lessonRegex.exec(file)) !== null) {
    const [, id, title, type, description, xpReward, prerequisites] = m;
    groupLessons.push({ id, title, type, description, xpReward: parseInt(xpReward), prerequisites: JSON.parse(prerequisites) });
  }
  
  if (groupLessons.length === 0) {
    const simpleRegex = /id:\s*\"(lesson-dooshin-[\d-]+)\"[\s\S]*?title:\s*\"([^\"]+)\"[\s\S]*?questions:/g;
    while ((m = simpleRegex.exec(file)) !== null) {
      const [, id, title] = m;
      groupLessons.push({ id, title, type: 'practice', description: 'Впишите пропущенную букву', xpReward: 60, prerequisites: [] });
    }
  }
  
  lessons.push(...groupLessons.map(l => ({ ...l, sectionId: 'section-dooshin-all' })));
  groups.push({ id: 'group-' + task.replace('task', 'task'), title: sectionTitle, subtitle: sectionSubtitle, lessons: groupLessons.map(l => ({ ...l, sectionId: 'section-dooshin-all' })) });
}

const meta = `import { Section } from '../../types'

export const dooshinMetaSection: Section = {
  id: 'section-dooshin-all',
  courseId: 'ege-russian-2025',
  title: 'Отработки из Дощинского',
  subtitle: '50 вариантов ЕГЭ 2026 — задания 9-20',
  order: 100,
  icon: 'BookOpen',
  color: '#58cc02',
  lessons: [
${lessons.map(l => `    { id: '${l.id}', sectionId: '${l.sectionId}', title: '${l.title}', type: '${l.type}', description: '${l.description}', xpReward: ${l.xpReward}, prerequisites: ${JSON.stringify(l.prerequisites)}, questions: [] },`).join('\n')}
  ],
  groups: [
${groups.map(g => `    { id: '${g.id}', title: '${g.title}', subtitle: '${g.subtitle}', lessons: [\n${g.lessons.map(l => `      { id: '${l.id}', sectionId: '${l.sectionId}', title: '${l.title}', type: '${l.type}', description: '${l.description}', xpReward: ${l.xpReward}, prerequisites: ${JSON.stringify(l.prerequisites)}, questions: [] },`).join('\n')}\n    ] },`).join('\n')}
  ]
}
`;

fs.writeFileSync('C:/Users/USER/Documents/kimi/workspace/ege-russian-app/src/data/sections/dooshinMeta.ts', meta);
console.log('Generated dooshinMeta.ts with', lessons.length, 'lessons');
