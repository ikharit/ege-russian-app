const fs = require('fs');
const path = require('path');

const explanations = {
  task9: 'Правописание корней: проверьте гласную в корне через однокоренное слово или изменение формы.',
  task10: 'Правописание приставок/НЕ/НИ: проверьте правильность приставки или слитное/раздельное написание с частицей.',
  task11: 'Правописание суффиксов: проверьте гласную или согласную в суффиксе.',
  task12: 'Чередование согласных в корне: проверьте, какая согласная пишется в данной форме слова.',
};

for (const task of ['task9', 'task10', 'task11', 'task12']) {
  const file = path.join('C:/Users/USER/Documents/kimi/workspace/ege-russian-app/src/data/sections/dooshin', task + '.ts');
  let content = fs.readFileSync(file, 'utf-8');
  const oldExpl = "explanation: 'Проверьте правописание.'";
  const newExpl = "explanation: '" + explanations[task] + "'";
  let count = 0;
  let idx = content.indexOf(oldExpl);
  while (idx !== -1) {
    count++;
    idx = content.indexOf(oldExpl, idx + 1);
  }
  content = content.split(oldExpl).join(newExpl);
  fs.writeFileSync(file, content, 'utf-8');
  console.log(task + ': replaced ' + count + ' explanations');
}
console.log('Done');
