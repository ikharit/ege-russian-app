import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Trash2, GripVertical, Type, Heading, Lightbulb, AlertTriangle, Star, ListChecks,
  BookOpen, Leaf, GitCompare, ArrowRight, Quote, Table, ChevronDown, Save, X
} from 'lucide-react'
import React from 'react'

export type EditorBlockType =
  | 'heading'
  | 'paragraph'
  | 'callout'
  | 'list'
  | 'roots'
  | 'comparison'
  | 'pair'
  | 'flow'
  | 'quote'
  | 'table'
  | 'gap'

export interface EditorBlock {
  id: string
  type: EditorBlockType
  content: string
  calloutType?: 'tip' | 'warning' | 'important' | 'example' | 'rule'
  items?: string[]
  cells?: string[]
  roots?: string[]
  left?: string
  right?: string
  condition?: string
  consequence?: string
}

const BLOCK_TEMPLATES: Record<EditorBlockType, () => EditorBlock> = {
  heading: () => ({ id: crypto.randomUUID(), type: 'heading', content: 'Новый заголовок' }),
  paragraph: () => ({ id: crypto.randomUUID(), type: 'paragraph', content: 'Новый абзац...' }),
  callout: () => ({ id: crypto.randomUUID(), type: 'callout', content: 'Важная подсказка!', calloutType: 'tip' }),
  list: () => ({ id: crypto.randomUUID(), type: 'list', content: '', items: ['Первый пункт', 'Второй пункт'] }),
  roots: () => ({ id: crypto.randomUUID(), type: 'roots', content: '', roots: ['БЛЕСТ(БЛИСТ)', 'ДЕР(ДИР)'] }),
  comparison: () => ({ id: crypto.randomUUID(), type: 'comparison', content: '', left: 'Вариант А', right: 'Вариант Б' }),
  pair: () => ({ id: crypto.randomUUID(), type: 'pair', content: '', left: 'Заб-ИРА-юсь', right: 'за-бер-у' }),
  flow: () => ({ id: crypto.randomUUID(), type: 'flow', content: '', condition: 'Если условие', consequence: 'то результат' }),
  quote: () => ({ id: crypto.randomUUID(), type: 'quote', content: 'Цитата' }),
  table: () => ({ id: crypto.randomUUID(), type: 'table', content: '', cells: ['Ячейка 1', 'Ячейка 2'] }),
  gap: () => ({ id: crypto.randomUUID(), type: 'gap', content: 'б..рёзовый' }),
}

const BLOCK_ICONS: Record<EditorBlockType, React.ReactNode> = {
  heading: <Heading size={16} />,
  paragraph: <Type size={16} />,
  callout: <Lightbulb size={16} />,
  list: <ListChecks size={16} />,
  roots: <Leaf size={16} />,
  comparison: <GitCompare size={16} />,
  pair: <GitCompare size={16} />,
  flow: <ArrowRight size={16} />,
  quote: <Quote size={16} />,
  table: <Table size={16} />,
  gap: <BookOpen size={16} />,
}

const BLOCK_LABELS: Record<EditorBlockType, string> = {
  heading: 'Заголовок',
  paragraph: 'Абзац',
  callout: 'Подсказка',
  list: 'Список',
  roots: 'Корни',
  comparison: 'Сравнение',
  pair: 'Пара',
  flow: 'Условие',
  quote: 'Цитата',
  table: 'Таблица',
  gap: 'Пропуск',
}

export function TheoryEditor({
  initialBlocks,
  onSave,
  onCancel,
}: {
  initialBlocks: EditorBlock[]
  onSave: (blocks: EditorBlock[]) => void
  onCancel: () => void
}) {
  const [blocks, setBlocks] = useState<EditorBlock[]>(initialBlocks)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)

  const updateBlock = (id: string, patch: Partial<EditorBlock>) => {
    setBlocks(prev => prev.map(b => (b.id === id ? { ...b, ...patch } : b)))
  }

  const addBlock = (type: EditorBlockType, afterId?: string) => {
    const newBlock = BLOCK_TEMPLATES[type]()
    if (afterId) {
      const idx = blocks.findIndex(b => b.id === afterId)
      setBlocks(prev => [...prev.slice(0, idx + 1), newBlock, ...prev.slice(idx + 1)])
    } else {
      setBlocks(prev => [...prev, newBlock])
    }
    setActiveMenu(null)
  }

  const removeBlock = (id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id))
  }

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const idx = blocks.findIndex(b => b.id === id)
    if (idx === -1) return
    if (direction === 'up' && idx > 0) {
      setBlocks(prev => {
        const next = [...prev]
        ;[next[idx], next[idx - 1]] = [next[idx - 1], next[idx]]
        return next
      })
    }
    if (direction === 'down' && idx < blocks.length - 1) {
      setBlocks(prev => {
        const next = [...prev]
        ;[next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
        return next
      })
    }
  }

  return (
    <div className="min-h-screen bg-duo-snow flex flex-col">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <X size={20} className="text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="font-bold text-gray-800 text-sm">Редактор теории</h1>
          <p className="text-xs text-gray-500">{blocks.length} блоков</p>
        </div>
        <button
          onClick={() => onSave(blocks)}
          className="px-4 py-2 bg-duo-green text-white rounded-xl text-sm font-medium hover:bg-duo-green/90 transition-colors flex items-center gap-2"
        >
          <Save size={16} />
          Сохранить
        </button>
      </div>

      {/* Blocks */}
      <div className="flex-1 px-4 py-6 max-w-2xl mx-auto space-y-4">
        <AnimatePresence>
          {blocks.map((block, index) => (
            <motion.div
              key={block.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              {/* Block toolbar */}
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-100">
                <div className="text-gray-400">
                  {BLOCK_ICONS[block.type]}
                </div>
                <span className="text-xs font-medium text-gray-500">{BLOCK_LABELS[block.type]}</span>
                <div className="flex-1" />
                <button
                  onClick={() => moveBlock(block.id, 'up')}
                  disabled={index === 0}
                  className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                >
                  <ChevronDown size={14} className="rotate-180 text-gray-500" />
                </button>
                <button
                  onClick={() => moveBlock(block.id, 'down')}
                  disabled={index === blocks.length - 1}
                  className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                >
                  <ChevronDown size={14} className="text-gray-500" />
                </button>
                <button
                  onClick={() => removeBlock(block.id)}
                  className="p-1 hover:bg-red-100 rounded text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Block content */}
              <div className="p-3">
                <BlockEditor block={block} onChange={patch => updateBlock(block.id, patch)} />
              </div>

              {/* Add button after block */}
              <div className="px-3 pb-3">
                <button
                  onClick={() => setActiveMenu(activeMenu === block.id ? null : block.id)}
                  className="w-full py-2 border border-dashed border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Plus size={14} />
                  Добавить блок
                </button>
                {activeMenu === block.id && (
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {(Object.keys(BLOCK_TEMPLATES) as EditorBlockType[]).map(type => (
                      <button
                        key={type}
                        onClick={() => addBlock(type, block.id)}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-xs text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        {BLOCK_ICONS[type]}
                        {BLOCK_LABELS[type]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty state / Add first block */}
        {blocks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm mb-4">Нет блоков. Добавьте первый:</p>
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
              {(Object.keys(BLOCK_TEMPLATES) as EditorBlockType[]).slice(0, 6).map(type => (
                <button
                  key={type}
                  onClick={() => addBlock(type)}
                  className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg text-xs text-gray-700 hover:bg-gray-50 border border-gray-200 transition-colors"
                >
                  {BLOCK_ICONS[type]}
                  {BLOCK_LABELS[type]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function BlockEditor({ block, onChange }: { block: EditorBlock; onChange: (patch: Partial<EditorBlock>) => void }) {
  switch (block.type) {
    case 'heading':
      return (
        <input
          type="text"
          value={block.content}
          onChange={e => onChange({ content: e.target.value })}
          className="w-full font-bold text-gray-800 text-sm uppercase tracking-wide border-b border-gray-200 pb-2 bg-transparent focus:outline-none focus:border-duo-green"
          placeholder="Заголовок..."
        />
      )
    case 'paragraph':
      return (
        <textarea
          value={block.content}
          onChange={e => onChange({ content: e.target.value })}
          className="w-full text-sm text-gray-700 leading-relaxed bg-transparent focus:outline-none resize-none"
          placeholder="Текст абзаца..."
          rows={3}
        />
      )
    case 'callout':
      return (
        <div className="space-y-2">
          <select
            value={block.calloutType || 'tip'}
            onChange={e => onChange({ calloutType: e.target.value as EditorBlock['calloutType'] })}
            className="text-xs border border-gray-200 rounded-lg px-2 py-1"
          >
            <option value="tip">💡 Подсказка</option>
            <option value="warning">⚠️ Предупреждение</option>
            <option value="important">⭐ Важно</option>
            <option value="example">📋 Пример</option>
            <option value="rule">📖 Правило</option>
          </select>
          <textarea
            value={block.content}
            onChange={e => onChange({ content: e.target.value })}
            className="w-full text-sm text-gray-700 leading-relaxed bg-transparent focus:outline-none resize-none"
            placeholder="Текст подсказки..."
            rows={2}
          />
        </div>
      )
    case 'list':
      return (
        <div className="space-y-2">
          {block.items?.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-gray-400 text-xs">•</span>
              <input
                type="text"
                value={item}
                onChange={e => {
                  const newItems = [...(block.items || [])]
                  newItems[i] = e.target.value
                  onChange({ items: newItems })
                }}
                className="flex-1 text-sm text-gray-700 bg-transparent focus:outline-none border-b border-gray-100 focus:border-duo-green"
              />
              <button
                onClick={() => onChange({ items: block.items?.filter((_, idx) => idx !== i) })}
                className="text-red-400 hover:text-red-600"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
          <button
            onClick={() => onChange({ items: [...(block.items || []), 'Новый пункт'] })}
            className="text-xs text-duo-green hover:text-duo-green/80 flex items-center gap-1"
          >
            <Plus size={12} /> Добавить пункт
          </button>
        </div>
      )
    case 'roots':
      return (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {block.roots?.map((root, i) => (
              <div key={i} className="flex items-center gap-1 bg-indigo-50 rounded-lg px-2 py-1">
                <input
                  type="text"
                  value={root}
                  onChange={e => {
                    const newRoots = [...(block.roots || [])]
                    newRoots[i] = e.target.value
                    onChange({ roots: newRoots })
                  }}
                  className="text-sm font-mono text-indigo-800 bg-transparent focus:outline-none w-24"
                />
                <button
                  onClick={() => onChange({ roots: block.roots?.filter((_, idx) => idx !== i) })}
                  className="text-red-400 hover:text-red-600"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => onChange({ roots: [...(block.roots || []), 'КОРЕНЬ'] })}
            className="text-xs text-duo-green hover:text-duo-green/80 flex items-center gap-1"
          >
            <Plus size={12} /> Добавить корень
          </button>
        </div>
      )
    case 'comparison':
      return (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Левый</label>
            <textarea
              value={block.left || ''}
              onChange={e => onChange({ left: e.target.value })}
              className="w-full text-sm bg-rose-50 rounded-lg p-2 focus:outline-none"
              rows={2}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Правый</label>
            <textarea
              value={block.right || ''}
              onChange={e => onChange({ right: e.target.value })}
              className="w-full text-sm bg-teal-50 rounded-lg p-2 focus:outline-none"
              rows={2}
            />
          </div>
        </div>
      )
    case 'pair':
      return (
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={block.left || ''}
            onChange={e => onChange({ left: e.target.value })}
            className="flex-1 text-sm font-mono bg-blue-50 rounded-lg px-3 py-2 focus:outline-none"
            placeholder="Заб-ИРА-юсь"
          />
          <GitCompare size={16} className="text-blue-400 shrink-0" />
          <input
            type="text"
            value={block.right || ''}
            onChange={e => onChange({ right: e.target.value })}
            className="flex-1 text-sm font-mono bg-blue-50 rounded-lg px-3 py-2 focus:outline-none"
            placeholder="за-бер-у"
          />
        </div>
      )
    case 'flow':
      return (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={block.condition || ''}
            onChange={e => onChange({ condition: e.target.value })}
            className="flex-1 text-sm bg-amber-50 rounded-lg px-3 py-2 focus:outline-none"
            placeholder="Если..."
          />
          <ArrowRight size={16} className="text-amber-500 shrink-0" />
          <input
            type="text"
            value={block.consequence || ''}
            onChange={e => onChange({ consequence: e.target.value })}
            className="flex-1 text-sm bg-amber-50 rounded-lg px-3 py-2 focus:outline-none"
            placeholder="то..."
          />
        </div>
      )
    case 'quote':
      return (
        <textarea
          value={block.content}
          onChange={e => onChange({ content: e.target.value })}
          className="w-full text-sm text-gray-700 italic bg-gray-50 border-l-4 border-duo-green pl-3 py-2 focus:outline-none resize-none"
          placeholder="Цитата..."
          rows={2}
        />
      )
    case 'table':
      return (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {block.cells?.map((cell, i) => (
              <div key={i} className="flex items-center gap-1">
                <input
                  type="text"
                  value={cell}
                  onChange={e => {
                    const newCells = [...(block.cells || [])]
                    newCells[i] = e.target.value
                    onChange({ cells: newCells })
                  }}
                  className="flex-1 text-sm bg-gray-50 rounded-lg px-2 py-1 focus:outline-none"
                />
                <button
                  onClick={() => onChange({ cells: block.cells?.filter((_, idx) => idx !== i) })}
                  className="text-red-400 hover:text-red-600"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => onChange({ cells: [...(block.cells || []), ''] })}
            className="text-xs text-duo-green hover:text-duo-green/80 flex items-center gap-1"
          >
            <Plus size={12} /> Добавить ячейку
          </button>
        </div>
      )
    case 'gap':
      return (
        <input
          type="text"
          value={block.content}
          onChange={e => onChange({ content: e.target.value })}
          className="w-full text-sm font-mono bg-duo-snow rounded-lg px-3 py-2 focus:outline-none border border-gray-200"
          placeholder="б..рёзовый"
        />
      )
    default:
      return null
  }
}
