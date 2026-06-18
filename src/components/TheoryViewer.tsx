import { BookOpen, Lightbulb, AlertTriangle, Star, ListChecks, Leaf, GitCompare, ArrowRight, Quote, Table, Columns } from 'lucide-react'
import React from 'react'

interface Block {
  type: 'heading' | 'subheading' | 'callout' | 'list' | 'table' | 'gap' | 'root' | 'pair' | 'flow' | 'quote' | 'paragraph' | 'roots' | 'comparison' | 'example' | 'key-term'
  content?: string
  items?: string[]
  cells?: string[]
  calloutType?: 'tip' | 'warning' | 'important' | 'example' | 'rule'
  left?: string
  right?: string
  condition?: string
  consequence?: string
  roots?: string[]
  leftExample?: string
  rightExample?: string
  leftLabel?: string
  rightLabel?: string
}

// Lines to completely hide (interactive artifacts)
const HIDDEN_PATTERNS = [
  /^Перейти$/, /^Answer empty$/, /^Select all the appropriate answers$/, /^Selected answer$/,
  /^Впишите цифру.*$/, /^рассортируй слова по корзинам.*$/, /^Практика на закрепление.*$/, /^Задание на закрепление.*$/,
  /^Впиши нужные средства.*$/, /^Впиши нужные лексические средства.*$/, /^Но, говорят, вы \(не\)людим.*$/,
  /^От чего зависит чередование.*$/, /^2\. Важный тест на проверку.*$/, /^3\. Важный тест на проверку.*$/,
  /^Разбей предложения по группам.*$/, /^Запятая есть \(ССП\).*$/, /^Запятая нет \(ОЧП\).*$/,
  /^Зависит от контекста.*$/, /^Может быть.*$/, /^Пожалуй.*$/, /^Поставьте запятые.*$/,
  /^Не сказал бы, что люблю вас.*$/, /^а$/, /^Обособляем ли в этом контексте.*$/, /^Обособляем$/, /^Не обособляем$/,
  /^Распредели конструкции по правилам.*$/, /^Соотнеси примеры из некоторых произведений.*$/,
  /^БСП$/, /^Тире$/, /^Двоеточие$/, /^И двоеточие, и тире$/, /^Слитно$/, /^Раздельно$/,
  /^От ударения$/, /^От наличия или отсутствия следующей за корнем гласной -А-$/, /^От лексического значения$/,
  /^Ответ --.*$/, /^Ответ записываем.*$/, /^False$/, /^True$/, /^0\//, /^CORRECT$/, /^Sign in$/,
  /^Page \d+$/, /^LESSON \d+$/, /^О\/\d+$/, /^Проверь себя.*$/, /^Попробуй.*$/, /^Введите.*$/,
  /^Ответ сохранён.*$/, /^Answer saved.*$/, /^Неправильно.*$/, /^Верно.*$/, /^Правильно.*$/, /^Correct.*$/, /^Incorrect.*$/, /^Wrong.*$/,
  /^Неплохой тест на словарные.*$/,
  /^[ИЕОА]$/, /^[ИЕОА]\s+[ИЕОА]\s+[ИЕОА]\s+[ИЕОА]$/, // single letters as column headers
  /^\d+\.\s*Теория.*$/, /^\d+\.\s*Практика.*$/,
]

function isHiddenLine(line: string): boolean {
  return HIDDEN_PATTERNS.some(p => p.test(line.trim()))
}

// Check if a line is a "roots row" like "БЛЕСТ(БЛИСТ) ДЕР(ДИР) МЕР(МИР)"
function isRootsRow(line: string): boolean {
  const words = line.trim().split(/\s+/)
  if (words.length < 2) return false
  return words.every(w => /^[А-ЯЁ]+\([А-ЯЁ]+\)$/.test(w))
}

// Check if line is a comparison like "МАК пишется, если..." followed by "МОК пишем, если..."
function isComparisonStart(line: string): boolean {
  return /^[А-ЯЁ]+\s+пишется?/i.test(line.trim())
}

function parseTheory(text: string): Block[] {
  const lines = text.split('\n')
  const blocks: Block[] = []
  let currentList: string[] = []
  let currentRoots: string[] = []
  let currentComparison: { left?: string, right?: string } | null = null

  const flushList = () => { if (currentList.length > 0) { blocks.push({ type: 'list', items: [...currentList] }); currentList = [] } }
  const flushRoots = () => { if (currentRoots.length > 0) { blocks.push({ type: 'roots', roots: [...currentRoots] }); currentRoots = [] } }
  const flushComparison = () => { if (currentComparison) { blocks.push({ type: 'comparison', ...currentComparison }); currentComparison = null } }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) {
      flushList(); flushRoots(); flushComparison()
      continue
    }

    if (isHiddenLine(line)) {
      flushList(); flushRoots(); flushComparison()
      continue
    }

    // Detect roots rows (accumulate multiple rows)
    if (isRootsRow(line)) {
      flushList(); flushComparison()
      currentRoots.push(...line.split(/\s+/))
      continue
    }
    // If we had roots but next line is not roots, flush
    if (currentRoots.length > 0 && !isRootsRow(line)) {
      flushRoots()
    }

    // Detect comparison pairs (МАК пишется... vs МОК пишем...)
    if (isComparisonStart(line)) {
      flushList(); flushRoots()
      const match = line.match(/^([А-ЯЁ]+)\s+(пишется?.*?)(?:\s+\(([^)]+)\))?\s*$/i)
      if (match) {
        const root = match[1]
        const example = match[2]
        const parenthetical = match[3] || ''
        if (!currentComparison) {
          currentComparison = { left: root + ' ' + example + (parenthetical ? ' (' + parenthetical + ')' : '') }
        } else {
          currentComparison.right = root + ' ' + example + (parenthetical ? ' (' + parenthetical + ')' : '')
          flushComparison()
        }
        continue
      }
    }
    if (currentComparison && !isComparisonStart(line)) {
      flushComparison()
    }

    // Detect callouts
    const calloutMatch = line.match(/^(TIP|WARNING|IMPORTANT|EXAMPLE|RULE):\s*(.+)/)
    if (calloutMatch) { flushList(); flushRoots(); flushComparison(); blocks.push({ type: 'callout', calloutType: calloutMatch[1].toLowerCase() as Block['calloutType'], content: calloutMatch[2] }); continue }

    // Detect table rows (tab-separated)
    if (line.includes('\t')) { flushList(); flushRoots(); flushComparison(); const cells = line.split('\t').map(c => c.trim()).filter(Boolean); blocks.push({ type: 'table', cells }); continue }

    // Detect gap words (e.g., "беспр..цедентный")
    if (line.includes('..') && !line.includes(' ')) { flushList(); flushRoots(); flushComparison(); blocks.push({ type: 'gap', content: line }); continue }

    // Detect root (e.g., "/бир-а/")
    if (line.startsWith('/') && line.endsWith('/') && line.includes('-')) { flushList(); flushRoots(); flushComparison(); blocks.push({ type: 'root', content: line.slice(1, -1) }); continue }

    // Detect pair (e.g., "Заб-ИРА-юсь -- за-бер-у")
    if (line.includes('--') && line.includes('-')) { flushList(); flushRoots(); flushComparison(); const parts = line.split('--').map(p => p.trim()); blocks.push({ type: 'pair', left: parts[0], right: parts[1] || '' }); continue }

    // Detect flow (e.g., "Если... то...")
    if (line.match(/^Если[\s\S]*то[\s\S]*$/i)) { flushList(); flushRoots(); flushComparison(); const match = line.match(/^(Если[\s\S]*?)\s+(то[\s\S]*)$/i); if (match) { blocks.push({ type: 'flow', condition: match[1], consequence: match[2] }) } else { blocks.push({ type: 'paragraph', content: line }) }; continue }

    // Detect quote (e.g., "«...»")
    if (line.startsWith('«') && line.endsWith('»')) { flushList(); flushRoots(); flushComparison(); blocks.push({ type: 'quote', content: line.slice(1, -1) }); continue }

    // Detect headings
    const isHeading = line.length < 80 && (line.startsWith('О чём') || line.startsWith('Как задание') || line.startsWith('Как выглядит') || line.startsWith('Теория') || line.startsWith('Правило') || line.startsWith('Применение') || line.startsWith('Резюме') || line.startsWith('Закрепи') || line.startsWith('Нюансы') || line.startsWith('Разделы') || line.startsWith('In summa') || /^\d+\)\.?\s/.test(line) || /^[IVX]+\./.test(line) || /^№\d/.test(line))
    if (isHeading) { flushList(); flushRoots(); flushComparison(); blocks.push({ type: 'heading', content: line }); continue }

    // Detect subheadings (bold-like lines ending with colon or short caps)
    if (line.length < 60 && (line.endsWith(':') || line.toUpperCase() === line)) { flushList(); flushRoots(); flushComparison(); blocks.push({ type: 'subheading', content: line }); continue }

    // List items
    if (line.startsWith('- ') || line.startsWith('• ')) { currentList.push(line.slice(2)); continue }

    // Regular paragraph
    flushList(); flushRoots(); flushComparison()
    blocks.push({ type: 'paragraph', content: line })
  }

  flushList(); flushRoots(); flushComparison()
  return blocks
}

const calloutConfig = {
  tip: { icon: Lightbulb, color: 'bg-amber-50 border-amber-200 text-amber-800', iconColor: 'text-amber-500' },
  warning: { icon: AlertTriangle, color: 'bg-orange-50 border-orange-200 text-orange-800', iconColor: 'text-orange-500' },
  important: { icon: Star, color: 'bg-red-50 border-red-200 text-red-800', iconColor: 'text-red-500' },
  example: { icon: ListChecks, color: 'bg-blue-50 border-blue-200 text-blue-800', iconColor: 'text-blue-500' },
  rule: { icon: BookOpen, color: 'bg-purple-50 border-purple-200 text-purple-800', iconColor: 'text-purple-500' },
}

// Highlight uppercase words in a paragraph
function highlightKeyTerms(text: string): React.ReactNode {
  const parts = text.split(/([А-ЯЁ][А-ЯЁ-]+(?:\s*\([^)]*\))?)/g)
  return parts.map((part, i) => {
    if (/^[А-ЯЁ][А-ЯЁ-]+(?:\s*\([^)]*\))?$/.test(part)) {
      return <span key={i} className="font-bold text-gray-900 bg-yellow-50 px-1 rounded">{part}</span>
    }
    return <span key={i}>{part}</span>
  })
}

function renderBlock(block: Block, index: number): React.ReactNode {
  switch (block.type) {
    case 'heading':
      return (
        <h3 key={index} className="font-bold text-gray-800 mt-6 mb-3 text-sm uppercase tracking-wide border-b border-gray-200 pb-2">
          {block.content}
        </h3>
      )
    case 'subheading':
      return (
        <h4 key={index} className="font-semibold text-gray-700 mt-4 mb-2 text-sm bg-gray-50 px-3 py-2 rounded-lg inline-block">
          {block.content}
        </h4>
      )
    case 'callout': {
      const config = calloutConfig[block.calloutType || 'tip']
      const Icon = config.icon
      return (
        <div key={index} className={`rounded-xl border px-4 py-3 my-3 ${config.color}`}>
          <div className="flex items-start gap-2">
            <Icon size={18} className={`mt-0.5 shrink-0 ${config.iconColor}`} />
            <p className="text-sm leading-relaxed">{block.content}</p>
          </div>
        </div>
      )
    }
    case 'list':
      return (
        <ul key={index} className="list-disc list-inside space-y-1.5 my-3 text-gray-700 pl-2">
          {block.items?.map((item, i) => <li key={i} className="text-sm leading-relaxed">{item}</li>)}
        </ul>
      )
    case 'table':
      return (
        <div key={index} className="grid grid-cols-2 gap-2 my-3 text-sm text-gray-700">
          {block.cells?.map((cell, ci) => <div key={ci} className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">{cell}</div>)}
        </div>
      )
    case 'gap':
      return (
        <div key={index} className="inline-flex items-center gap-2 bg-duo-snow rounded-lg px-3 py-2 my-1 font-mono text-sm text-gray-800 border border-gray-200">
          <span className="text-duo-green font-bold">[___]</span>
          <span>{block.content}</span>
        </div>
      )
    case 'root':
      return (
        <div key={index} className="inline-flex items-center gap-2 bg-green-50 rounded-lg px-3 py-2 my-1 text-sm text-green-800 border border-green-200">
          <Leaf size={16} className="text-green-600" />
          <span className="font-mono font-semibold">{block.content}</span>
        </div>
      )
    case 'roots':
      return (
        <div key={index} className="my-3">
          <div className="flex flex-wrap gap-2">
            {block.roots?.map((root, i) => (
              <div key={i} className="bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2 text-sm font-mono font-semibold text-indigo-800">
                {root}
              </div>
            ))}
          </div>
        </div>
      )
    case 'comparison':
      return (
        <div key={index} className="my-4 grid grid-cols-2 gap-3">
          {block.left && (
            <div className="bg-rose-50 rounded-xl border border-rose-200 p-4">
              <div className="flex items-center gap-2 mb-1">
                <Columns size={14} className="text-rose-400" />
                <span className="text-xs font-bold text-rose-600 uppercase">Вариант 1</span>
              </div>
              <p className="text-sm text-rose-800">{block.left}</p>
            </div>
          )}
          {block.right && (
            <div className="bg-teal-50 rounded-xl border border-teal-200 p-4">
              <div className="flex items-center gap-2 mb-1">
                <Columns size={14} className="text-teal-400" />
                <span className="text-xs font-bold text-teal-600 uppercase">Вариант 2</span>
              </div>
              <p className="text-sm text-teal-800">{block.right}</p>
            </div>
          )}
        </div>
      )
    case 'pair':
      return (
        <div key={index} className="flex items-center gap-3 bg-blue-50 rounded-xl px-4 py-3 my-2 text-sm border border-blue-200">
          <span className="font-mono font-semibold text-blue-800">{block.left}</span>
          <GitCompare size={16} className="text-blue-400" />
          <span className="font-mono text-blue-700">{block.right}</span>
        </div>
      )
    case 'flow':
      return (
        <div key={index} className="flex items-center gap-2 bg-amber-50 rounded-xl px-4 py-3 my-2 text-sm text-amber-800 border border-amber-200">
          <span className="font-medium">{block.condition}</span>
          <ArrowRight size={16} className="text-amber-500 shrink-0" />
          <span className="font-medium">{block.consequence}</span>
        </div>
      )
    case 'quote':
      return (
        <blockquote key={index} className="border-l-4 border-duo-green pl-4 py-2 my-3 bg-gray-50 rounded-r-lg">
          <div className="flex items-start gap-2">
            <Quote size={16} className="text-duo-green mt-1 shrink-0" />
            <p className="text-sm text-gray-700 italic leading-relaxed">{block.content}</p>
          </div>
        </blockquote>
      )
    case 'paragraph': default:
      return (
        <p key={index} className="text-sm text-gray-700 leading-relaxed my-2">
          {highlightKeyTerms(block.content || '')}
        </p>
      )
  }
}

export function TheoryViewer({ text }: { text: string }) {
  const blocks = parseTheory(text)
  return <div className="space-y-1">{blocks.map((block, i) => renderBlock(block, i))}</div>
}

// Concept for future editor
export interface TheoryBlock {
  id: string
  type: 'heading' | 'paragraph' | 'callout' | 'roots' | 'comparison' | 'pair' | 'flow' | 'quote' | 'table' | 'gap' | 'list'
  content?: string
  calloutType?: 'tip' | 'warning' | 'important' | 'example' | 'rule'
  items?: string[]
  cells?: string[]
  roots?: string[]
  left?: string
  right?: string
  condition?: string
  consequence?: string
}

export const defaultEditorBlocks: TheoryBlock[] = [
  { id: '1', type: 'heading', content: 'О чём задание?' },
  { id: '2', type: 'paragraph', content: 'В этом задании необходимо выбрать ряды слов...' },
  { id: '3', type: 'callout', calloutType: 'tip', content: 'Проверяемая гласная находится с помощью подбора однокоренного слова...' },
  { id: '4', type: 'roots', roots: ['/бир-а/', '/дир-а/', '/тир-а/'] },
  { id: '5', type: 'comparison', left: 'И — суффикс -А- после корня', right: 'Е — без суффикса -А-' },
]
