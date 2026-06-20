import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, BookOpen, Edit3, Plus } from 'lucide-react'
import { theoryLessons, TheoryLesson } from '../data/theoryData'
import { TheoryEditor, EditorBlock } from '../components/TheoryEditor'
import { TheoryViewer } from '../components/TheoryViewer'

function textToBlocks(text: string): EditorBlock[] {
  // Simple conversion: split by double newlines and headings
  const lines = text.split('\n')
  const blocks: EditorBlock[] = []
  let currentParagraph = ''

  const flushParagraph = () => {
    if (currentParagraph.trim()) {
      blocks.push({
        id: crypto.randomUUID(),
        type: 'paragraph',
        content: currentParagraph.trim(),
      })
      currentParagraph = ''
    }
  }

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) {
      flushParagraph()
      continue
    }

    // Heading detection
    if (trimmed.length < 80 && (
      trimmed.startsWith('О чём') ||
      trimmed.startsWith('Как задание') ||
      trimmed.startsWith('Как выглядит') ||
      trimmed.startsWith('Теория') ||
      trimmed.startsWith('Правило') ||
      trimmed.startsWith('Применение') ||
      trimmed.startsWith('Резюме') ||
      trimmed.startsWith('Закрепи') ||
      trimmed.startsWith('Нюансы') ||
      trimmed.startsWith('Разделы') ||
      /^\d+\)\.?\s/.test(trimmed) ||
      /^[IVX]+\./.test(trimmed)
    )) {
      flushParagraph()
      blocks.push({
        id: crypto.randomUUID(),
        type: 'heading',
        content: trimmed,
      })
      continue
    }

    // Callout detection
    const calloutMatch = trimmed.match(/^(TIP|WARNING|IMPORTANT|EXAMPLE|RULE):\s*(.+)/)
    if (calloutMatch) {
      flushParagraph()
      blocks.push({
        id: crypto.randomUUID(),
        type: 'callout',
        content: calloutMatch[2],
        calloutType: calloutMatch[1].toLowerCase() as EditorBlock['calloutType'],
      })
      continue
    }

    // Roots detection
    if (/^[А-ЯЁ]+\([А-ЯЁ]+\)$/.test(trimmed)) {
      flushParagraph()
      blocks.push({
        id: crypto.randomUUID(),
        type: 'roots',
        content: '',
        roots: [trimmed],
      })
      continue
    }

    // Pair detection
    if (trimmed.includes('--') && trimmed.includes('-')) {
      flushParagraph()
      const parts = trimmed.split('--').map(p => p.trim())
      blocks.push({
        id: crypto.randomUUID(),
        type: 'pair',
        content: '',
        left: parts[0],
        right: parts[1] || '',
      })
      continue
    }

    // Flow detection
    if (/^Если[\s\S]*то[\s\S]*$/i.test(trimmed)) {
      flushParagraph()
      const match = trimmed.match(/^(Если[\s\S]*?)\s+(то[\s\S]*)$/i)
      if (match) {
        blocks.push({
          id: crypto.randomUUID(),
          type: 'flow',
          content: '',
          condition: match[1],
          consequence: match[2],
        })
      } else {
        currentParagraph += (currentParagraph ? '\n' : '') + trimmed
      }
      continue
    }

    // Quote detection
    if (trimmed.startsWith('«') && trimmed.endsWith('»')) {
      flushParagraph()
      blocks.push({
        id: crypto.randomUUID(),
        type: 'quote',
        content: trimmed.slice(1, -1),
      })
      continue
    }

    // List item
    if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
      flushParagraph()
      const lastBlock = blocks[blocks.length - 1]
      if (lastBlock && lastBlock.type === 'list') {
        lastBlock.items = [...(lastBlock.items || []), trimmed.slice(2)]
      } else {
        blocks.push({
          id: crypto.randomUUID(),
          type: 'list',
          content: '',
          items: [trimmed.slice(2)],
        })
      }
      continue
    }

    // Table row
    if (trimmed.includes('\t')) {
      flushParagraph()
      const cells = trimmed.split('\t').map(c => c.trim()).filter(Boolean)
      const lastBlock = blocks[blocks.length - 1]
      if (lastBlock && lastBlock.type === 'table') {
        lastBlock.cells = [...(lastBlock.cells || []), ...cells]
      } else {
        blocks.push({
          id: crypto.randomUUID(),
          type: 'table',
          content: '',
          cells,
        })
      }
      continue
    }

    // Gap word
    if (trimmed.includes('..') && !trimmed.includes(' ')) {
      flushParagraph()
      blocks.push({
        id: crypto.randomUUID(),
        type: 'gap',
        content: trimmed,
      })
      continue
    }

    // Root
    if (trimmed.startsWith('/') && trimmed.endsWith('/') && trimmed.includes('-')) {
      flushParagraph()
      blocks.push({
        id: crypto.randomUUID(),
        type: 'roots',
        content: '',
        roots: [trimmed.slice(1, -1)],
      })
      continue
    }

    // Regular paragraph
    currentParagraph += (currentParagraph ? '\n' : '') + trimmed
  }

  flushParagraph()
  return blocks
}

function blocksToText(blocks: EditorBlock[]): string {
  return blocks.map(block => {
    switch (block.type) {
      case 'heading': return block.content
      case 'paragraph': return block.content
      case 'callout': return `${(block.calloutType || 'TIP').toUpperCase()}: ${block.content}`
      case 'list': return block.items?.map(item => `- ${item}`).join('\n') || ''
      case 'roots': return block.roots?.join('\n') || ''
      case 'comparison': return `${block.left || ''}\n${block.right || ''}`
      case 'pair': return `${block.left || ''} -- ${block.right || ''}`
      case 'flow': return `${block.condition || ''} ${block.consequence || ''}`
      case 'quote': return `«${block.content}»`
      case 'table': return block.cells?.join('\t') || ''
      case 'gap': return block.content
      default: return block.content
    }
  }).join('\n\n')
}

export default function TheoryEditorPage() {
  const navigate = useNavigate()
  const { taskNumber } = useParams()
  const [selectedLesson, setSelectedLesson] = useState<TheoryLesson | null>(null)
  const [previewMode, setPreviewMode] = useState(false)

  const lesson = taskNumber
    ? theoryLessons.find(l => l.taskNumber === taskNumber) || null
    : null

  const initialBlocks = lesson
    ? textToBlocks(lesson.theoryText)
    : [{ id: crypto.randomUUID(), type: 'heading' as const, content: 'Новый урок' }]

  const handleSave = (blocks: EditorBlock[]) => {
    const text = blocksToText(blocks)
    // In a real app, this would save to backend or localStorage
    // For now, we'll show a preview
    alert('Теория сохранена (в консоли)! В реальном приложении здесь будет сохранение в базу данных.')
  }

  if (lesson) {
    if (previewMode) {
      return (
        <div className="min-h-screen bg-duo-snow">
          <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
            <button onClick={() => setPreviewMode(false)} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div className="flex-1">
              <p className="text-xs text-gray-500">{lesson.category}</p>
              <p className="font-bold text-sm">Предпросмотр: Задание {lesson.taskNumber}. {lesson.title}</p>
            </div>
          </div>
          <div className="px-4 py-6 max-w-2xl mx-auto">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <TheoryViewer text={blocksToText(initialBlocks)} />
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-duo-snow">
        <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
          <button onClick={() => navigate('/theory')} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex-1">
            <p className="text-xs text-gray-500">{lesson.category}</p>
            <p className="font-bold text-sm">Редактор: Задание {lesson.taskNumber}. {lesson.title}</p>
          </div>
          <button
            onClick={() => setPreviewMode(true)}
            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
          >
            Предпросмотр
          </button>
        </div>
        <TheoryEditor
          initialBlocks={initialBlocks}
          onSave={handleSave}
          onCancel={() => navigate('/theory')}
        />
      </div>
    )
  }

  // Lesson selector
  return (
    <div className="min-h-screen bg-duo-snow">
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate('/theory')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="font-bold text-gray-800 text-lg">Редактор теории</h1>
          <p className="text-xs text-gray-500">Выберите урок для редактирования</p>
        </div>
      </div>

      <div className="px-4 py-4 max-w-2xl mx-auto space-y-3">
        <button
          onClick={() => navigate('/theory-editor/new')}
          className="w-full text-left bg-duo-green text-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex items-center gap-3"
        >
          <Plus size={20} />
          <span className="font-medium">Создать новый урок</span>
        </button>

        <div className="space-y-3">
          {theoryLessons.map((lesson) => (
            <button
              key={lesson.taskNumber}
              onClick={() => navigate(`/theory-editor/${lesson.taskNumber}`)}
              className="w-full text-left bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-duo-blue/10 flex items-center justify-center shrink-0">
                <Edit3 size={18} className="text-duo-blue" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium">{lesson.category}</p>
                <p className="font-bold text-gray-800 text-sm">
                  Задание {lesson.taskNumber === 'Сочинение' ? '27 (Сочинение)' : lesson.taskNumber}. {lesson.title}
                </p>
              </div>
              <ArrowLeft size={16} className="text-gray-400 rotate-180" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
