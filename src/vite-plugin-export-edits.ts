import type { Plugin } from 'vite'
import fs from 'fs'
import path from 'path'

function findTsFiles(dir: string): string[] {
  const files: string[] = []
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

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function applyEdit(content: string, questionId: string, changes: any): string | null {
  const idPattern = new RegExp(`id:\\s*['"]` + escapeRegex(questionId) + `['"]`)
  const match = content.match(idPattern)
  if (!match) return null

  const idPos = match.index!

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
        block.substring(0, expMatch.index!) +
        `explanation: '${newExp}',` +
        block.substring(expMatch.index! + expMatch[0].length)
    }
  }

  if (changes.text) {
    const textMatch = block.match(/(text:\s*['"])([\s\S]*?)(['"]\s*,)/)
    if (textMatch) {
      const newText = changes.text.replace(/'/g, "\\'")
      newBlock =
        newBlock.substring(0, textMatch.index!) +
        `text: '${newText}',` +
        newBlock.substring(textMatch.index! + textMatch[0].length)
    }
  }

  if (changes.correctAnswer) {
    const answerMatch = block.match(/(correctAnswer:\s*\[)([^\]]*?)(\]\s*,)/)
    if (answerMatch) {
      const newAnswers = changes.correctAnswer.map((a: string) => `"${a}"`).join(', ')
      newBlock =
        newBlock.substring(0, answerMatch.index!) +
        `correctAnswer: [${newAnswers}],` +
        newBlock.substring(answerMatch.index! + answerMatch[0].length)
    }
  }

  if (newBlock === block) return null

  return content.substring(0, idPos) + newBlock + content.substring(blockEnd + 1)
}

export function exportEditsPlugin(): Plugin {
  return {
    name: 'export-edits',
    apply: 'serve', // только в dev режиме
    configureServer(server) {
      server.middlewares.use('/api/save-edits', async (req, res, next) => {
        if (req.method !== 'POST') {
          return next()
        }

        let body = ''
        req.on('data', (chunk) => (body += chunk))
        req.on('end', () => {
          try {
            const edits = JSON.parse(body)
            const files = findTsFiles(path.join(process.cwd(), 'src', 'data', 'sections'))

            let appliedCount = 0
            const notFound: string[] = []

            for (const [questionId, edit] of Object.entries(edits)) {
              const editData = edit as any
              if (!editData.changes || Object.keys(editData.changes).length === 0) continue

              let found = false
              for (const filePath of files) {
                const content = fs.readFileSync(filePath, 'utf-8')
                const newContent = applyEdit(content, questionId, editData.changes)
                if (newContent !== null) {
                  fs.writeFileSync(filePath, newContent, 'utf-8')
                  found = true
                  appliedCount++
                  break
                }
              }

              if (!found) notFound.push(questionId)
            }

            res.setHeader('Content-Type', 'application/json')
            res.end(
              JSON.stringify({
                success: true,
                applied: appliedCount,
                notFound,
              })
            )
          } catch (err) {
            res.statusCode = 400
            res.end(JSON.stringify({ success: false, error: (err as Error).message }))
          }
        })
      })
    },
  }
}
