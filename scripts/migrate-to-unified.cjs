const fs = require('fs')
const path = require('path')

// ─── Конфигурация миграции ───
const PROJECT_ROOT = path.join(__dirname, '..')
const DATA_DIR = path.join(PROJECT_ROOT, 'src', 'data')
const OUTPUT_DIR = path.join(DATA_DIR, 'questions')

// Создаём выходную директорию
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

// ─── Словарь заданий → файлы ───
const TASK_FILES = {
  '7': ['task7Questions.ts'],
  '8': ['task8Questions.ts'],
  '9': ['task9Questions.ts'],
  '10': ['atomization/task10Questions.ts'],
  '11': ['task11Questions.ts'],
  '12': ['task12Questions.ts'],
  '13': ['task13Questions.ts'],
  '14': ['task14Questions.ts'],
  '15': ['task15Questions.ts'],
  '16': ['task16LessonData.ts'],
  '17': ['task17Questions.ts'],
  '18': ['task18Questions.ts'],
  '19': ['task19Questions.ts'],
  '20': ['task20Questions.ts', 'sections/dooshin20.ts'],
  '21': ['task21Questions.ts'],
  '22': ['task22Questions.ts'],
  '23': ['task23Questions.ts'],
  '24': ['task24Questions.ts'],
  '25': ['task25Questions.ts'],
  '26': ['task26Questions.ts'],
  '1': ['task1Questions.ts'],
  '2': ['task2Questions.ts'],
  '3': ['task3Questions.ts'],
  '6': ['task6Questions.ts'],
}

// ─── Парсинг вопросов из .ts файла ───
function parseQuestionsFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const questions = []

  // Находим все объекты-вопросы
  // Паттерн: { id: '...', text: '...', ... }
  const regex = /\{\s*id:\s*'([^']+)'[\s\S]*?(?:text|question):\s*'([^']*)'[\s\S]*?\}/g

  let match
  while ((match = regex.exec(content)) !== null) {
    const objStr = match[0]
    const id = match[1]

    // Извлекаем поля
    const extract = (field, defaultVal = undefined) => {
      // Сначала пробуем string value
      let m = objStr.match(new RegExp(`${field}:\\s*'([^']*)'`))
      if (m) return m[1]
      // Пробуем number
      m = objStr.match(new RegExp(`${field}:\\s*(\\d+)`))
      if (m) return parseInt(m[1])
      // Пробуем boolean
      m = objStr.match(new RegExp(`${field}:\\s*(true|false)`))
      if (m) return m[1] === 'true'
      // Пробуем array of strings
      m = objStr.match(new RegExp(`${field}:\\s*\\[([^\\]]*)\\]`))
      if (m) {
        const arr = m[1].match(/'([^']*)'/g)
        if (arr) return arr.map(s => s.slice(1, -1))
      }
      // Пробуем array с correctAnswer
      m = objStr.match(new RegExp(`${field}:\\s*\\[\\s*'([^']*)'(?:\\s*,\\s*'([^']*)')*\\s*\\]`))
      if (m) {
        // Ручной парсинг массива
        const arrContent = objStr.match(new RegExp(`${field}:\\s*\\[([\\s\\S]*?)\\]\\s*[,}]`))
        if (arrContent) {
          const items = arrContent[1].match(/'([^']*)'/g)
          if (items) return items.map(s => s.slice(1, -1))
        }
      }
      return defaultVal
    }

    // Extract type
    let type = extract('type')
    if (!type) {
      // Определяем по наличию options
      if (objStr.includes('options:')) type = 'single'
      else type = 'text'
    }

    // Extract options
    const options = extract('options') || extract('question') // question для task1-3

    // Extract correctAnswer
    let correctAnswer = extract('correctAnswer')
    if (!correctAnswer) {
      // Пробуем найти правильный ответ другим способом
      const ca = objStr.match(/correctAnswer:\s*\[\s*'([^']*)'\s*\]/)
      if (ca) correctAnswer = [ca[1]]
    }

    // Extract text (может быть в question или text)
    let text = extract('text') || extract('question') || ''

    // Extract explanation
    const explanation = extract('explanation') || ''

    // Extract difficulty
    let difficulty = extract('difficulty')
    if (!difficulty) difficulty = 'easy'

    // Extract xpReward
    let xpReward = extract('xpReward')
    if (xpReward === undefined) xpReward = 10

    // Extract atoms
    let atoms = extract('atoms')
    if (!atoms) atoms = []

    // Determine taskNumber from ID
    let taskNumber = ''
    if (id.startsWith('t')) {
      const m = id.match(/t(\d+)/)
      if (m) taskNumber = m[1]
    } else if (id.startsWith('q')) {
      const m = id.match(/q(\d+)/)
      if (m) taskNumber = m[1]
    } else if (id.startsWith('task')) {
      const m = id.match(/task(\d+)/)
      if (m) taskNumber = m[1]
    }

    // Extract tags from atoms + filename
    const tags = [...new Set([...atoms, `task${taskNumber}`])]

    if (id && text) {
      questions.push({
        id,
        taskNumber,
        type,
        text,
        options,
        correctAnswer: correctAnswer || [],
        explanation,
        difficulty,
        xpReward,
        atoms,
        tags,
      })
    }
  }

  return questions
}

// ─── Парсинг вопросов из grammar.ts (вложенные в уроки) ───
function parseQuestionsFromGrammar(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const questions = []

  // grammar.ts содержит вопросы внутри объектов questions: [...]
  // Паттерн: { id: 'q12-1', type: 'text', text: '...', correctAnswer: ['...'], explanation: '...', ... }
  const regex = /\{ id:\s*'([a-zA-Z0-9_-]+)'\s*,\s*type:\s*'([^']+)'\s*,\s*text:\s*'([^']*)'\s*,[\s\S]*?correctAnswer:\s*\[([^\]]*)\]\s*,[\s\S]*?explanation:\s*'([^']*)'[\s\S]*?\}/g

  let match
  while ((match = regex.exec(content)) !== null) {
    const id = match[1]
    const type = match[2]
    const text = match[3]
    const correctAnswerStr = match[4]
    const explanation = match[5]
    const objStr = match[0]

    // Parse correctAnswer array
    const correctAnswer = correctAnswerStr.match(/'([^']*)'/g)?.map(s => s.slice(1, -1)) || []

    // Extract options
    const optionsMatch = objStr.match(/options:\s*\[([\s\S]*?)\]\s*,/)
    const options = optionsMatch ? optionsMatch[1].match(/'([^']*)'/g)?.map(s => s.slice(1, -1)) : undefined

    // Extract difficulty
    const diffMatch = objStr.match(/difficulty:\s*'([^']+)'/)
    const difficulty = diffMatch ? diffMatch[1] : 'easy'

    // Extract xpReward
    const xpMatch = objStr.match(/xpReward:\s*(\d+)/)
    const xpReward = xpMatch ? parseInt(xpMatch[1]) : 10

    // Extract atoms
    const atomsMatch = objStr.match(/atoms:\s*\[([^\]]*)\]/)
    const atoms = atomsMatch ? atomsMatch[1].match(/'([^']*)'/g)?.map(s => s.slice(1, -1)) || [] : []

    // Determine taskNumber from ID
    let taskNumber = ''
    const m = id.match(/q(\d+)|task(\d+)/)
    if (m) taskNumber = m[1] || m[2]

    const tags = [...new Set([...atoms, `task${taskNumber}`])]

    questions.push({
      id,
      taskNumber,
      type,
      text,
      options,
      correctAnswer,
      explanation,
      difficulty,
      xpReward,
      atoms,
      tags,
    })
  }

  return questions
}

// ─── Главная функция миграции ───
function migrate() {
  console.log('═'.repeat(80))
  console.log('  МИГРАЦИЯ: Старые файлы → Единая база')
  console.log('═'.repeat(80))

  const allQuestions = []
  const stats = {}

  // 1. Миграция taskXQuestions.ts
  for (const [taskNum, files] of Object.entries(TASK_FILES)) {
    const taskQuestions = []
    for (const file of files) {
      const filePath = path.join(DATA_DIR, file)
      if (fs.existsSync(filePath)) {
        const questions = parseQuestionsFromFile(filePath)
        taskQuestions.push(...questions)
        console.log(`  📄 ${file} → ${questions.length} вопросов (task ${taskNum})`)
      }
    }
    if (taskQuestions.length > 0) {
      allQuestions.push(...taskQuestions)
      stats[taskNum] = (stats[taskNum] || 0) + taskQuestions.length
    }
  }

  // 2. Миграция grammar.ts (вложенные вопросы)
  const grammarPath = path.join(DATA_DIR, 'sections', 'grammar.ts')
  if (fs.existsSync(grammarPath)) {
    const grammarQuestions = parseQuestionsFromGrammar(grammarPath)
    allQuestions.push(...grammarQuestions)
    console.log(`  📄 grammar.ts → ${grammarQuestions.length} вопросов`)
  }

  // 3. Миграция sections/*.ts (вопросы внутри секций)
  const sectionFiles = [
    'sections/orthography.ts',
    'sections/task4.ts',
    'sections/task5.ts',
    'sections/examTasks.ts',
    'sections/n_nn.ts',
    'sections/task22_27.ts',
    'sections/task1_3.ts',
    'sections/task6_8.ts',
    'sections/atomization.ts',
  ]

  for (const file of sectionFiles) {
    const filePath = path.join(DATA_DIR, file)
    if (fs.existsSync(filePath)) {
      const questions = parseQuestionsFromGrammar(filePath) // Тот же формат
      allQuestions.push(...questions)
      console.log(`  📄 ${file} → ${questions.length} вопросов`)
    }
  }

  // 4. Дедупликация по ID
  const idMap = new Map()
  const duplicates = []
  for (const q of allQuestions) {
    if (idMap.has(q.id)) {
      duplicates.push(q.id)
    } else {
      idMap.set(q.id, q)
    }
  }

  if (duplicates.length > 0) {
    console.log(`\n  ⚠️  Дублирующиеся ID: ${[...new Set(duplicates)].join(', ')}`)
  }

  const uniqueQuestions = [...idMap.values()]

  console.log(`\n  📊 Итого: ${uniqueQuestions.length} уникальных вопросов`)
  console.log(`  📊 По заданиям: ${JSON.stringify(stats, null, 2)}`)

  // 5. Группировка по taskNumber
  const byTask = {}
  for (const q of uniqueQuestions) {
    const tn = q.taskNumber || 'unknown'
    if (!byTask[tn]) byTask[tn] = []
    byTask[tn].push(q)
  }

  // 6. Создание файлов questions/taskX.ts
  for (const [taskNum, questions] of Object.entries(byTask)) {
    if (taskNum === 'unknown') continue

    const fileName = `task${taskNum}.ts`
    const filePath = path.join(OUTPUT_DIR, fileName)

    // Форматируем вопросы
    const questionStrings = questions.map(q => {
      const fields = [
        `    id: '${q.id}',
        `    taskNumber: '${q.taskNumber}',
        `    type: '${q.type}',
        `    text: '${q.text.replace(/'/g, "\\'")}',
      ]
      if (q.options && q.options.length > 0) {
        fields.push(`    options: [${q.options.map(o => `'${o.replace(/'/g, "\\'")}'`).join(', ')}],`)
      }
      fields.push(`    correctAnswer: [${q.correctAnswer.map(a => `'${a.replace(/'/g, "\\'")}'`).join(', ')}],`)
      fields.push(`    explanation: '${q.explanation.replace(/'/g, "\\'").replace(/\n/g, '\\n')}',
        `    difficulty: '${q.difficulty}',
        `    xpReward: ${q.xpReward},
        `    atoms: [${q.atoms.map(a => `'${a}'`).join(', ')}],
        `    tags: [${q.tags.map(t => `'${t}'`).join(', ')}],`)

      return `  {
${fields.join('\n')}
  }`
    }).join(',\n\n')

    const fileContent = `// Задание ${taskNum} — ${questions.length} вопросов
// Сгенерировано автоматически из старых файлов
// Агент: Агент 7

import type { UnifiedQuestion } from './types'

export const task${taskNum}Questions: UnifiedQuestion[] = [
${questionStrings}
]

export const task${taskNum}QuestionsById = Object.fromEntries(
  task${taskNum}Questions.map(q => [q.id, q])
)
`

    fs.writeFileSync(filePath, fileContent, 'utf-8')
    console.log(`  ✅ ${fileName} — ${questions.length} вопросов`)
  }

  // 7. Создание index.ts (индексы)
  const taskNumbers = Object.keys(byTask).filter(t => t !== 'unknown').sort()
  const imports = taskNumbers.map(t => `import { task${t}Questions } from './task${t}'`).join('\n')
  const exports = taskNumbers.map(t => `  ...task${t}Questions,`).join('\n')

  const indexContent = `// ═══════════════════════════════════════════════════════════════════════════════
// ЕДИНАЯ БАЗА ВСЕХ ВОПРОСОВ ЕГЭ — ИНДЕКСЫ
// ═══════════════════════════════════════════════════════════════════════════════
//
// Все вопросы нормализованы. Импортируй отсюда для работы с вопросами.
//
// Агенты: добавляй вопросы в файл questions/taskX.ts, затем импортируй здесь.

import type { UnifiedQuestion, QuestionIndex } from './types'

${imports}

// ─── Все вопросы ───
export const allQuestions: UnifiedQuestion[] = [
${exports}
]

// ─── Индекс по ID ───
export const questionById: Record<string, UnifiedQuestion> = Object.fromEntries(
  allQuestions.map(q => [q.id, q])
)

// ─── Индекс по заданию ───
export const questionsByTask: Record<string, UnifiedQuestion[]> = {}
for (const q of allQuestions) {
  const tn = q.taskNumber || 'unknown'
  if (!questionsByTask[tn]) questionsByTask[tn] = []
  questionsByTask[tn].push(q)
}

// ─── Индекс по атому ───
export const questionsByAtom: Record<string, UnifiedQuestion[]> = {}
for (const q of allQuestions) {
  for (const atom of q.atoms) {
    if (!questionsByAtom[atom]) questionsByAtom[atom] = []
    questionsByAtom[atom].push(q)
  }
}

// ─── Индекс по тегу ───
export const questionsByTag: Record<string, UnifiedQuestion[]> = {}
for (const q of allQuestions) {
  for (const tag of q.tags) {
    if (!questionsByTag[tag]) questionsByTag[tag] = []
    questionsByTag[tag].push(q)
  }
}

// ─── Индекс по сложности ───
export const questionsByDifficulty: Record<string, UnifiedQuestion[]> = {}
for (const q of allQuestions) {
  const d = q.difficulty
  if (!questionsByDifficulty[d]) questionsByDifficulty[d] = []
  questionsByDifficulty[d].push(q)
}

// ─── Статистика ───
export const questionStats = {
  total: allQuestions.length,
  byTask: Object.fromEntries(Object.entries(questionsByTask).map(([k, v]) => [k, v.length])),
  byAtom: Object.fromEntries(Object.entries(questionsByAtom).map(([k, v]) => [k, v.length])),
  byTag: Object.fromEntries(Object.entries(questionsByTag).map(([k, v]) => [k, v.length])),
  byDifficulty: Object.fromEntries(Object.entries(questionsByDifficulty).map(([k, v]) => [k, v.length])),
}

console.log('[unified-db] Вопросов загружено:', allQuestions.length)
`

  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.ts'), indexContent, 'utf-8')
  console.log(`\n  ✅ questions/index.ts — индексы созданы`)

  console.log(`\n  📊 Статистика по заданиям:`)
  for (const [t, n] of Object.entries(stats).sort((a, b) => parseInt(a[0]) - parseInt(b[0]))) {
    console.log(`     Задание ${t}: ${n} вопросов`)
  }
}

migrate()
