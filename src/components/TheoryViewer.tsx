import { BookOpen, Lightbulb, AlertTriangle, Star, ListChecks, Leaf, GitCompare, ArrowRight, Quote } from 'lucide-react'
import React from 'react'

interface Block {
  type: 'heading' | 'subheading' | 'callout' | 'list' | 'table' | 'gap' | 'root' | 'pair' | 'flow' | 'quote' | 'paragraph'
  content?: string
  items?: string[]
  cells?: string[]
  calloutType?: 'tip' | 'warning' | 'important' | 'example' | 'rule'
  left?: string
  right?: string
  condition?: string
  consequence?: string
}

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
]

function isHiddenLine(line: string): boolean {
  return HIDDEN_PATTERNS.some(p => p.test(line.trim()))
}

function parseTheory(text: string): Block[] {
  const lines = text.split('\n')
  const blocks: Block[] = []
  let currentList: string[] = []
  const flushList = () => { if (currentList.length > 0) { blocks.push({ type: 'list', items: [...currentList] }); currentList = [] } }
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) { flushList(); continue }
    if (isHiddenLine(line)) { flushList(); continue }
    const calloutMatch = line.match(/^(TIP|WARNING|IMPORTANT|EXAMPLE|RULE):\s*(.+)/)
    if (calloutMatch) { flushList(); blocks.push({ type: 'callout', calloutType: calloutMatch[1].toLowerCase() as Block['calloutType'], content: calloutMatch[2] }); continue }
    if (line.includes('\t')) { flushList(); const cells = line.split('\t').map(c => c.trim()).filter(Boolean); blocks.push({ type: 'table', cells }); continue }
    if (line.includes('..') && !line.includes(' ')) { flushList(); blocks.push({ type: 'gap', content: line }); continue }
    if (line.startsWith('/') && line.endsWith('/') && line.includes('-')) { flushList(); blocks.push({ type: 'root', content: line.slice(1, -1) }); continue }
    if (line.includes('--') && line.includes('-')) { flushList(); const parts = line.split('--').map(p => p.trim()); blocks.push({ type: 'pair', left: parts[0], right: parts[1] || '' }); continue }
    if (line.match(/^Если[\s\S]*то[\s\S]*$/i)) { flushList(); const match = line.match(/^(Если[\s\S]*?)\s+(то[\s\S]*)$/i); if (match) { blocks.push({ type: 'flow', condition: match[1], consequence: match[2] }) } else { blocks.push({ type: 'paragraph', content: line }) }; continue }
    if (line.startsWith('«') && line.endsWith('»')) { flushList(); blocks.push({ type: 'quote', content: line.slice(1, -1) }); continue }
    const isHeading = line.length < 80 && (line.startsWith('О чём') || line.startsWith('Как задание') || line.startsWith('Как выглядит') || line.startsWith('Теория') || line.startsWith('Правило') || line.startsWith('Применение') || line.startsWith('Резюме') || line.startsWith('Закрепи') || line.startsWith('Нюансы') || line.startsWith('Разделы') || line.startsWith('In summa') || /^\d+\)\.?\s/.test(line) || /^[IVX]+\./.test(line) || /^№\d/.test(line))
    if (isHeading) { flushList(); blocks.push({ type: 'heading', content: line }); continue }
    if (line.length < 60 && (line.endsWith(':') || line.toUpperCase() === line)) { flushList(); blocks.push({ type: 'subheading', content: line }); continue }
    if (line.startsWith('- ') || line.startsWith('• ')) { currentList.push(line.slice(2)); continue }
    flushList(); blocks.push({ type: 'paragraph', content: line })
  }
  flushList(); return blocks
}

const calloutConfig = {
  tip: { icon: Lightbulb, color: 'bg-amber-50 border-amber-200 text-amber-800', iconColor: 'text-amber-500' },
  warning: { icon: AlertTriangle, color: 'bg-orange-50 border-orange-200 text-orange-800', iconColor: 'text-orange-500' },
  important: { icon: Star, color: 'bg-red-50 border-red-200 text-red-800', iconColor: 'text-red-500' },
  example: { icon: ListChecks, color: 'bg-blue-50 border-blue-200 text-blue-800', iconColor: 'text-blue-500' },
  rule: { icon: BookOpen, color: 'bg-purple-50 border-purple-200 text-purple-800', iconColor: 'text-purple-500' },
}

function renderBlock(block: Block, index: number): React.ReactNode {
  switch (block.type) {
    case 'heading': return <h3 key={index} className="font-bold text-gray-800 mt-6 mb-3 text-sm uppercase tracking-wide border-b border-gray-200 pb-2">{block.content}</h3>
    case 'subheading': return <h4 key={index} className="font-semibold text-gray-700 mt-4 mb-2 text-sm bg-gray-50 px-3 py-2 rounded-lg inline-block">{block.content}</h4>
    case 'callout': { const config = calloutConfig[block.calloutType || 'tip']; const Icon = config.icon; return <div key={index} className={`rounded-xl border px-4 py-3 my-3 ${config.color}`}><div className="flex items-start gap-2"><Icon size={18} className={`mt-0.5 shrink-0 ${config.iconColor}`} /><p className="text-sm leading-relaxed">{block.content}</p></div></div> }
    case 'list': return <ul key={index} className="list-disc list-inside space-y-1.5 my-3 text-gray-700 pl-2">{block.items?.map((item, i) => <li key={i} className="text-sm leading-relaxed">{item}</li>)}</ul>
    case 'table': return <div key={index} className="grid grid-cols-2 gap-2 my-3 text-sm text-gray-700">{block.cells?.map((cell, ci) => <div key={ci} className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">{cell}</div>)}</div>
    case 'gap': return <div key={index} className="inline-flex items-center gap-2 bg-duo-snow rounded-lg px-3 py-2 my-1 font-mono text-sm text-gray-800 border border-gray-200"><span className="text-duo-green font-bold">[___]</span><span>{block.content}</span></div>
    case 'root': return <div key={index} className="inline-flex items-center gap-2 bg-green-50 rounded-lg px-3 py-2 my-1 text-sm text-green-800 border border-green-200"><Leaf size={16} className="text-green-600" /><span className="font-mono font-semibold">{block.content}</span></div>
    case 'pair': return <div key={index} className="flex items-center gap-3 bg-blue-50 rounded-xl px-4 py-3 my-2 text-sm border border-blue-200"><span className="font-mono font-semibold text-blue-800">{block.left}</span><GitCompare size={16} className="text-blue-400" /><span className="font-mono text-blue-700">{block.right}</span></div>
    case 'flow': return <div key={index} className="flex items-center gap-2 bg-amber-50 rounded-xl px-4 py-3 my-2 text-sm text-amber-800 border border-amber-200"><span className="font-medium">{block.condition}</span><ArrowRight size={16} className="text-amber-500 shrink-0" /><span className="font-medium">{block.consequence}</span></div>
    case 'quote': return <blockquote key={index} className="border-l-4 border-duo-green pl-4 py-2 my-3 bg-gray-50 rounded-r-lg"><div className="flex items-start gap-2"><Quote size={16} className="text-duo-green mt-1 shrink-0" /><p className="text-sm text-gray-700 italic leading-relaxed">{block.content}</p></div></blockquote>
    case 'paragraph': default: return <p key={index} className="text-sm text-gray-700 leading-relaxed my-2">{block.content}</p>
  }
}

export function TheoryViewer({ text }: { text: string }) {
  const blocks = parseTheory(text)
  return <div className="space-y-1">{blocks.map((block, i) => renderBlock(block, i))}</div>
}
