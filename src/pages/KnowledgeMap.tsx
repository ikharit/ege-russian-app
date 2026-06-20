import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide } from 'd3-force'
import { useProgressStore } from '../stores/progressStore'
import {
  buildKnowledgeNodes,
  knowledgeEdges,
  nodeStatusColors,
  edgeLabelColors,
} from '../data/knowledgeGraph'
import type { KnowledgeNode } from '../types/knowledgeGraph'
import { Map, RotateCcw, ZoomIn, ZoomOut, Minus } from 'lucide-react'
import { course } from '../data/courseData'

// Mapping taskNumber → sectionId for navigation
const taskToCourseSection: Record<number, string> = {
  1: 'section-text-work',
  2: 'section-text-work',
  3: 'section-text-work',
  4: 'section-orthoepy-lex',
  5: 'section-orthoepy-lex',
  6: 'section-orthoepy-lex',
  7: 'section-grammar',
  8: 'section-grammar',
  9: 'section-orthography',
  10: 'section-orthography',
  11: 'section-orthography',
  12: 'section-orthography',
  13: 'section-orthography',
  14: 'section-orthography',
  15: 'section-orthography',
  16: 'section-punctuation',
  17: 'section-punctuation',
  18: 'section-punctuation',
  19: 'section-punctuation',
  20: 'section-orthography',
  21: 'section-punctuation',
  22: 'section-text-work',
  23: 'section-text-work',
  24: 'section-text-work',
  25: 'section-text-work',
  26: 'section-text-work',
  27: 'section-text-work',
}

interface SimNode extends KnowledgeNode {
  x: number
  y: number
  vx?: number
  vy?: number
  fx?: number | null
  fy?: number | null
  index?: number
}

interface SimLink {
  source: string | SimNode
  target: string | SimNode
  label?: string
  strength: number
}

export function KnowledgeMap() {
  const navigate = useNavigate()
  const svgRef = useRef<SVGSVGElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const lessonProgress = useProgressStore((s) => s.lessonProgress)
  const getProblematicTasks = useProgressStore((s) => s.getProblematicTasks)
  const problematicTasks = getProblematicTasks()

  const [hoveredEdge, setHoveredEdge] = useState<SimLink | null>(null)
  const [hoveredNode, setHoveredNode] = useState<SimNode | null>(null)
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0, tx: 0, ty: 0 })

  // Build nodes with status
  const baseNodes = useMemo(() => buildKnowledgeNodes(), [])
  const nodes = useMemo<SimNode[]>(() => {
    const weakTaskNumbers = new Set(problematicTasks.map((t) => parseInt(t.taskNumber, 10)))

    return baseNodes.map((node) => {
      const sectionId = taskToCourseSection[node.taskNumber]
      const allLessonIds = course.sections
        .flatMap((s) => s.groups || [])
        .filter((g) => g.id === sectionId)
        .flatMap((g) => g.lessons.map((l) => l.id))

      const completed = allLessonIds.filter((id) => lessonProgress[id]?.status === 'completed').length
      const started = allLessonIds.filter((id) => lessonProgress[id]?.status === 'started').length
      const total = allLessonIds.length

      return {
        ...node,
        x: 0,
        y: 0,
        completed: total > 0 && completed === total,
        started: started > 0 || (completed > 0 && completed < total),
        weak: weakTaskNumbers.has(node.taskNumber),
      } as SimNode
    })
  }, [baseNodes, lessonProgress, problematicTasks])

  const edges = useMemo<SimLink[]>(() => {
    return knowledgeEdges.map((e) => ({ ...e }))
  }, [])

  const [simulatedNodes, setSimulatedNodes] = useState<SimNode[]>(nodes)
  const [simulatedEdges, setSimulatedEdges] = useState<SimLink[]>(edges)

  // Run D3 force simulation
  useEffect(() => {
    const width = 800
    const height = 600

    const simulation = forceSimulation(nodes as unknown as any[])
      .force(
        'link',
        forceLink(edges as unknown as any[])
          .id((d: any) => d.id)
          .distance((d: any) => (d.strength === 3 ? 60 : d.strength === 2 ? 100 : 140))
          .strength((d: any) => d.strength * 0.15)
      )
      .force('charge', forceManyBody().strength(-400))
      .force('center', forceCenter(width / 2, height / 2))
      .force('collide', forceCollide().radius((d: any) => 35 + (d.lessonCount || 0) * 2).iterations(2))

    simulation.on('tick', () => {
      setSimulatedNodes([...(nodes as SimNode[])])
      setSimulatedEdges([...(edges as SimLink[])])
    })

    return () => {
      simulation.stop()
    }
  }, [nodes, edges])

  // Zoom / pan helpers
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      setTransform((prev) => {
        const newK = Math.min(Math.max(prev.k * delta, 0.3), 4)
        return { ...prev, k: newK }
      })
    },
    []
  )

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      setIsDragging(true)
      dragStart.current = { x: e.clientX, y: e.clientY, tx: transform.x, ty: transform.y }
    },
    [transform]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return
      const dx = e.clientX - dragStart.current.x
      const dy = e.clientY - dragStart.current.y
      setTransform((prev) => ({
        ...prev,
        x: dragStart.current.tx + dx,
        y: dragStart.current.ty + dy,
      }))
    },
    [isDragging]
  )

  const handlePointerUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const resetView = useCallback(() => {
    setTransform({ x: 0, y: 0, k: 1 })
  }, [])

  const zoomIn = useCallback(() => {
    setTransform((prev) => ({ ...prev, k: Math.min(prev.k * 1.2, 4) }))
  }, [])

  const zoomOut = useCallback(() => {
    setTransform((prev) => ({ ...prev, k: Math.max(prev.k / 1.2, 0.3) }))
  }, [])

  // Mobile touch support
  const touchStart = useRef<{ x: number; y: number; tx: number; ty: number; dist?: number } | null>(null)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        tx: transform.x,
        ty: transform.y,
      }
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      touchStart.current = {
        x: 0,
        y: 0,
        tx: transform.x,
        ty: transform.y,
        dist: Math.sqrt(dx * dx + dy * dy),
      }
    }
  }, [transform])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    if (!touchStart.current) return

    if (e.touches.length === 1) {
      const dx = e.touches[0].clientX - touchStart.current.x
      const dy = e.touches[0].clientY - touchStart.current.y
      setTransform((prev) => ({
        ...prev,
        x: touchStart.current!.tx + dx,
        y: touchStart.current!.ty + dy,
      }))
    } else if (e.touches.length === 2 && touchStart.current.dist) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const dist = Math.sqrt(dx * dx + dy * dy)
      const ratio = dist / touchStart.current.dist
      setTransform((prev) => ({ ...prev, k: Math.min(Math.max(prev.k * ratio, 0.3), 4) }))
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    touchStart.current = null
  }, [])

  // Node color
  const getNodeColor = (node: SimNode) => {
    if (node.weak) return nodeStatusColors.weak
    if (node.completed) return nodeStatusColors.completed
    if (node.started) return nodeStatusColors.started
    return nodeStatusColors.notStarted
  }

  const getNodeRadius = (node: SimNode) => {
    const base = 24
    const extra = Math.min((node.lessonCount || 0) * 1.5, 16)
    return base + extra
  }

  const handleNodeClick = (node: SimNode) => {
    const sectionId = taskToCourseSection[node.taskNumber]
    if (sectionId) {
      navigate(`/course?section=${sectionId}`)
    }
  }

  const hoveredEdgeMidpoint = useMemo(() => {
    if (!hoveredEdge) return null
    const s = typeof hoveredEdge.source === 'string' ? simulatedNodes.find((n) => n.id === hoveredEdge.source) : hoveredEdge.source
    const t = typeof hoveredEdge.target === 'string' ? simulatedNodes.find((n) => n.id === hoveredEdge.target) : hoveredEdge.target
    if (!s || !t) return null
    return { x: (s.x + t.x) / 2, y: (s.y + t.y) / 2, label: hoveredEdge.label }
  }, [hoveredEdge, simulatedNodes])

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-4 h-screen max-h-[calc(100vh-120px)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Map size={24} className="text-duo-green" />
          <h1 className="text-xl font-bold text-gray-800">Карта знаний</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={zoomIn}
            className="p-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
            aria-label="Приблизить"
          >
            <ZoomIn size={18} className="text-gray-600" />
          </button>
          <button
            onClick={zoomOut}
            className="p-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
            aria-label="Отдалить"
          >
            <ZoomOut size={18} className="text-gray-600" />
          </button>
          <button
            onClick={resetView}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors text-sm font-medium text-gray-600"
          >
            <RotateCcw size={16} />
            Сбросить
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 800 600"
          className="w-full h-full"
          style={{ touchAction: 'none' }}
        >
          <g transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`}>
            {/* Links */}
            {simulatedEdges.map((link, i) => {
              const s = typeof link.source === 'string' ? simulatedNodes.find((n) => n.id === link.source) : link.source
              const t = typeof link.target === 'string' ? simulatedNodes.find((n) => n.id === link.target) : link.target
              if (!s || !t) return null
              const color = edgeLabelColors[link.label || ''] || '#94a3b8'
              return (
                <g key={i}>
                  <line
                    x1={s.x}
                    y1={s.y}
                    x2={t.x}
                    y2={t.y}
                    stroke={color}
                    strokeWidth={1 + (link.strength || 1) * 0.5}
                    strokeOpacity={0.7}
                    className="transition-all"
                    onMouseEnter={() => setHoveredEdge(link)}
                    onMouseLeave={() => setHoveredEdge(null)}
                  />
                </g>
              )
            })}

            {/* Edge label tooltip */}
            {hoveredEdgeMidpoint && (
              <g>
                <rect
                  x={hoveredEdgeMidpoint.x - 40}
                  y={hoveredEdgeMidpoint.y - 20}
                  width={80}
                  height={20}
                  rx={4}
                  fill="rgba(0,0,0,0.75)"
                />
                <text
                  x={hoveredEdgeMidpoint.x}
                  y={hoveredEdgeMidpoint.y - 6}
                  textAnchor="middle"
                  fill="white"
                  fontSize={10}
                  fontWeight={600}
                >
                  {hoveredEdgeMidpoint.label}
                </text>
              </g>
            )}

            {/* Nodes */}
            {simulatedNodes.map((node) => {
              const r = getNodeRadius(node)
              const color = getNodeColor(node)
              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x},${node.y})`}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => handleNodeClick(node)}
                >
                  {/* Glow for hovered */}
                  {hoveredNode?.id === node.id && (
                    <circle r={r + 6} fill={color} opacity={0.2} />
                  )}
                  {/* Main circle */}
                  <circle r={r} fill={color} stroke="white" strokeWidth={2} />
                  {/* Task number */}
                  <text
                    textAnchor="middle"
                    dy="-0.2em"
                    fill="white"
                    fontSize={12}
                    fontWeight={700}
                  >
                    {node.taskNumber}
                  </text>
                  {/* Label below */}
                  <text
                    textAnchor="middle"
                    dy={r + 14}
                    fill="#374151"
                    fontSize={10}
                    fontWeight={500}
                  >
                    {node.label}
                  </text>
                  {/* Status indicator dot */}
                  {node.completed && (
                    <circle cx={r - 4} cy={-r + 4} r={4} fill="white" />
                  )}
                  {node.weak && (
                    <circle cx={r - 4} cy={-r + 4} r={4} fill="#ef4444" stroke="white" strokeWidth={1} />
                  )}
                </g>
              )
            })}
          </g>
        </svg>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 p-3 shadow-sm">
          <p className="text-xs font-bold text-gray-600 mb-2">Статус темы</p>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs text-gray-600">Изучено</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-xs text-gray-600">Начато</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-400" />
              <span className="text-xs text-gray-600">Не начато</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-xs text-gray-600">Слабая тема</span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-600 mb-1.5">Связи</p>
            <div className="flex flex-col gap-1">
              {Object.entries(edgeLabelColors).map(([label, color]) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-4 h-0.5 rounded" style={{ backgroundColor: color }} />
                  <span className="text-xs text-gray-600">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Node tooltip */}
        {hoveredNode && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-xl border border-gray-200 p-3 shadow-md max-w-xs pointer-events-none"
          >
            <p className="font-bold text-sm text-gray-800">{hoveredNode.label}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Задание {hoveredNode.taskNumber} · {hoveredNode.lessonCount || 0} уроков
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: getNodeColor(hoveredNode) }}
              >
                {hoveredNode.completed ? 'Изучено' : hoveredNode.started ? 'В процессе' : hoveredNode.weak ? 'Слабая тема' : 'Не начато'}
              </span>
            </div>
            <p className="text-[10px] text-gray-400 mt-1.5">Нажми, чтобы перейти к разделу</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
