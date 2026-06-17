const fs = require('fs')
const path = require('path')

const FILES = [
  'src/data/sections/orthography.ts',
  'src/data/sections/punctuation.ts',
  'src/data/sections/grammar.ts',
]

// Simple heuristic to assign atoms based on question text
function guessAtoms(text) {
  const lower = text.toLowerCase()
  
  if (lower.includes('пре') || lower.includes('при') || lower.includes('пред') || lower.includes('под')) {
    return ['prefix_pre_pri']
  }
  if (lower.includes('не') || lower.includes('ни')) {
    return ['prefix_ne_ni']
  }
  if (lower.includes('без') || lower.includes('бес')) {
    return ['prefix_bez_bes']
  }
  if (lower.includes('из') || lower.includes('ис')) {
    return ['prefix_iz_is']
  }
  if (lower.includes('с') && (lower.includes('з') || lower.includes('съ'))) {
    return ['prefix_s_so']
  }
  if (lower.includes('вс') || lower.includes('вз') || lower.includes('въ')) {
    return ['prefix_vs_vz']
  }
  if (lower.includes('рас') || lower.includes('раз') || lower.includes('рос')) {
    return ['prefix_ras_raz']
  }
  if (lower.includes('чере') || lower.includes('чрез')) {
    return ['prefix_cheres_chrez']
  }
  if (lower.includes('обез') || lower.includes('обес') || lower.includes('объ')) {
    return ['prefix_ob_obez']
  }
  // Default fallback
  return ['roots']
}

for (const file of FILES) {
  const fullPath = path.resolve(__dirname, '..', file)
  if (!fs.existsSync(fullPath)) {
    console.log(`Skip: ${file} (not found)`)
    continue
  }
  
  let content = fs.readFileSync(fullPath, 'utf-8')
  let count = 0
  
  // Find question objects without atoms and add them
  // Pattern: xpReward: 10 }, or xpReward: 12 }, or xpReward: 15 },
  // But NOT followed by atoms
  content = content.replace(
    /(xpReward:\s*\d+)(,\s*\n\s*})/g,
    (match, xpPart, closing) => {
      // Check if this question already has atoms in previous lines
      const before = content.slice(0, content.indexOf(match))
      const lastQuestionStart = before.lastIndexOf("{ id: '")
      const questionSnippet = before.slice(lastQuestionStart) + match
      
      if (questionSnippet.includes('atoms:')) {
        return match // already has atoms
      }
      
      // Find the text to guess atoms
      const textMatch = questionSnippet.match(/text:\s*'([^']+)'/)
      const atoms = textMatch ? guessAtoms(textMatch[1]) : ['roots']
      
      count++
      return `${xpPart}, atoms: ${JSON.stringify(atoms)}${closing}`
    }
  )
  
  fs.writeFileSync(fullPath, content)
  console.log(`${file}: added atoms to ${count} questions`)
}

console.log('Done!')
