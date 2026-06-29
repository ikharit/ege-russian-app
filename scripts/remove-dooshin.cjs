const fs = require('fs')

function removeDooshinQuestions(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  
  const arrayStart = content.match(/export const task\d+Questions: UnifiedQuestion\[\] = \[/)
  if (!arrayStart) {
    console.log('  ⚠️ No array found in ' + filePath)
    return
  }
  
  const startIdx = content.indexOf(arrayStart[0]) + arrayStart[0].length
  const endIdx = content.lastIndexOf(']')
  
  const arrayContent = content.slice(startIdx, endIdx)
  
  const questions = []
  let depth = 0
  let current = ''
  let inString = false
  let stringChar = ''
  
  for (let i = 0; i < arrayContent.length; i++) {
    const char = arrayContent[i]
    const prev = i > 0 ? arrayContent[i - 1] : ''
    
    if (!inString && (char === '"' || char === "'")) {
      inString = true
      stringChar = char
    } else if (inString && char === stringChar && prev !== '\\') {
      inString = false
    }
    
    if (!inString) {
      if (char === '{') depth++
      if (char === '}') depth--
    }
    
    current += char
    
    if (depth === 0 && char === '}' && current.trim().startsWith('{')) {
      questions.push(current.trim())
      current = ''
      // Skip trailing comma and whitespace
      while (i + 1 < arrayContent.length && [',', ' ', '\n'].includes(arrayContent[i + 1])) {
        i++
      }
    }
  }
  
  const filtered = questions.filter(q => {
    const idMatch = q.match(/id:\s*'([^']+)'/)
    if (!idMatch) return true
    return !idMatch[1].startsWith('qd')
  })
  
  const removed = questions.length - filtered.length
  
  if (removed > 0) {
    const prefix = content.slice(0, startIdx)
    const suffix = content.slice(endIdx)
    const newArray = filtered.map((q, i) => q + (i < filtered.length - 1 ? ',' : '')).join('\n\n')
    const newContent = prefix + '\n' + newArray + '\n' + suffix
    
    fs.writeFileSync(filePath, newContent, 'utf-8')
    console.log('  ✅ ' + filePath + ': removed ' + removed + ' dooshin questions, kept ' + filtered.length)
  } else {
    console.log('  ✅ ' + filePath + ': no dooshin questions found')
  }
}

const files = [
  'src/data/questions/task13.ts',
  'src/data/questions/task14.ts',
  'src/data/questions/task12.ts',
  'src/data/questions/task15.ts',
  'src/data/questions/task7.ts',
  'src/data/questions/task9.ts',
  'src/data/questions/task11.ts',
]

for (const f of files) {
  if (fs.existsSync(f)) {
    removeDooshinQuestions(f)
  }
}

console.log('\nDone!')
