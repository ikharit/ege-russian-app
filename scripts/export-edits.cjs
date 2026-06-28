const fs = require('fs')
const path = require('path')

const EDITS_FILE = path.join(process.cwd(), 'edits.json')

/** Recursively find all .ts files in a directory */
function findTsFiles(dir) {
  const files = []
  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      files.push(...findTsFiles(fullPath))
    } else if (fullPath.endsWith('.ts')) {
      files.push(fullPath)
    }
  }
  return files
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Apply a single edit to file content.
 * Returns new content if changed, or null if questionId not found / no change.
 */
function applyEdit(content, questionId, changes) {
  const idPattern = new RegExp(`id:\\s*['"]${escapeRegex(questionId)}['"]`)
  const match = content.match(idPattern)
  if (!match) return null

  const idPos = match.index

  // Find the end of the question object by counting braces, respecting strings
  let braceDepth = 0
  let inString = false
  let stringChar = ''
  let blockEnd = idPos

  for (let i = idPos; i < content.length; i++) {
    const char = content[i]
    const prevChar = i > 0 ? content[i - 1] : ''

    if (!inString) {
      if (char === '"' || char === "'") {
        inString = true
        stringChar = char
      } else if (char === '{') {
        braceDepth++
      } else if (char === '}') {
        braceDepth--
        if (braceDepth === 0) {
          blockEnd = i
          break
        }
      }
    } else {
      if (char === stringChar && prevChar !== '\\') {
        inString = false
      }
    }
  }

  const block = content.substring(idPos, blockEnd + 1)
  let newBlock = block

  if (changes.explanation) {
    const expMatch = block.match(/(explanation:\s*['"])([\s\S]*?)(['"]\s*,)/)
    if (expMatch) {
      const newExp = changes.explanation.replace(/'/g, "\\'")
      newBlock =
        block.substring(0, expMatch.index) +
        `explanation: '${newExp}',` +
        block.substring(expMatch.index + expMatch[0].length)
    }
  }

  if (changes.text) {
    const textMatch = block.match(/(text:\s*['"])([\s\S]*?)(['"]\s*,)/)
    if (textMatch) {
      const newText = changes.text.replace(/'/g, "\\'")
      newBlock =
        newBlock.substring(0, textMatch.index) +
        `text: '${newText}',` +
        newBlock.substring(textMatch.index + textMatch[0].length)
    }
  }

  if (changes.correctAnswer) {
    const answerMatch = block.match(/(correctAnswer:\s*\[)([^\]]*?)(\]\s*,)/)
    if (answerMatch) {
      const newAnswers = changes.correctAnswer.map((a) => `"${a}"`).join(', ')
      newBlock =
        newBlock.substring(0, answerMatch.index) +
        `correctAnswer: [${newAnswers}],` +
        newBlock.substring(answerMatch.index + answerMatch[0].length)
    }
  }

  if (newBlock === block) return null

  return content.substring(0, idPos) + newBlock + content.substring(blockEnd + 1)
}

/* ─── Main ─── */

if (!fs.existsSync(EDITS_FILE)) {
  console.error('❌ edits.json не найден в корне проекта.')
  console.log('')
  console.log('💡 Чтобы экспортировать правки:')
  console.log('   1. В браузере нажми кнопку «Скачать правки» в редакторе')
  console.log('   2. Положи скачанный файл как edits.json в корень проекта')
  console.log('   3. Запусти: npm run export-edits')
  process.exit(1)
}

const edits = JSON.parse(fs.readFileSync(EDITS_FILE, 'utf-8'))
const files = findTsFiles(path.join(process.cwd(), 'src', 'data', 'sections'))

let appliedCount = 0
const notFound = []

for (const [questionId, edit] of Object.entries(edits)) {
  if (!edit.changes || Object.keys(edit.changes).length === 0) continue

  const agent = edit.agent || 'неизвестно'

  let found = false
  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf-8')
    const newContent = applyEdit(content, questionId, edit.changes)
    if (newContent !== null) {
      fs.writeFileSync(filePath, newContent, 'utf-8')
      console.log(`✅ ${questionId} → ${path.relative(process.cwd(), filePath)} (${agent})`)
      found = true
      appliedCount++
      break
    }
  }

  if (!found) notFound.push(questionId)
}

// Итоговая статистика по агентам
const agentStats = {}
for (const [, edit] of Object.entries(edits)) {
  if (!edit.changes || Object.keys(edit.changes).length === 0) continue
  const a = edit.agent || 'неизвестно'
  agentStats[a] = (agentStats[a] || 0) + 1
}

console.log(`\n📊 Применено: ${appliedCount} правок`)
if (Object.keys(agentStats).length > 0) {
  console.log('\n🤖 По агентам:')
  for (const [a, count] of Object.entries(agentStats)) {
    console.log(`   ${a}: ${count}`)
  }
}
if (notFound.length > 0) {
  console.log(`⚠️  Не найдены: ${notFound.join(', ')}`)
}

// Очистка edits.json после успешного применения
if (appliedCount > 0 && notFound.length === 0) {
  fs.unlinkSync(EDITS_FILE)
  console.log('🗑️  edits.json удалён (все правки применены)')
}
