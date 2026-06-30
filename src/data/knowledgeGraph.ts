import { KnowledgeNode, KnowledgeEdge } from '../types/knowledgeGraph'
import { course } from './courseData'

// Map task number to section group id for navigation
export const taskToSectionMap: Record<number, string> = {
  1: 'group-task1',
  2: 'group-task2',
  3: 'group-task3',
  4: 'group-task4',
  5: 'group-task5',
  6: 'group-task6',
  7: 'group-task7',
  8: 'group-task8',
  9: 'group-task9',
  10: 'group-task10',
  11: 'group-task11',
  12: 'group-task12',
  13: 'group-task13',
  14: 'group-task14',
  15: 'group-task15',
  16: 'group-task16',
  17: 'group-task17',
  18: 'group-task18',
  19: 'group-task19',
  22: 'group-task22',
  23: 'group-task23',
  24: 'group-task24',
  25: 'group-task25',
  26: 'group-task26',
  27: 'group-task27',
}

// Hardcoded edges between EGE tasks (pedagogical connections)
export const knowledgeEdges: KnowledgeEdge[] = [
  // Орфография → усложнение
  { source: 'node-task9', target: 'node-task19', label: 'усложнение', strength: 2 },
  { source: 'node-task12', target: 'node-task22', label: 'усложнение', strength: 2 },
  { source: 'node-task13', target: 'node-task23', label: 'усложнение', strength: 2 },
  { source: 'node-task14', target: 'node-task24', label: 'усложнение', strength: 2 },
  { source: 'node-task15', target: 'node-task25', label: 'усложнение', strength: 2 },

  // Лексика → связанная тема
  { source: 'node-task6', target: 'node-task22', label: 'связанная тема', strength: 1 },

  // Грамматика → связанная тема
  { source: 'node-task7', target: 'node-task23', label: 'связанная тема', strength: 1 },
  { source: 'node-task8', target: 'node-task24', label: 'связанная тема', strength: 1 },

  // Пунктуация → усложнение
  { source: 'node-task16', target: 'node-task26', label: 'усложнение', strength: 2 },
  { source: 'node-task17', target: 'node-task25', label: 'применение', strength: 2 },
  { source: 'node-task18', target: 'node-task27', label: 'применение', strength: 2 },

  // Работа с текстом → связанные темы
  { source: 'node-task1', target: 'node-task22', label: 'связанная тема', strength: 1 },
  { source: 'node-task2', target: 'node-task25', label: 'связанная тема', strength: 1 },
  { source: 'node-task3', target: 'node-task27', label: 'связанная тема', strength: 1 },

  // Сочинение → требует знания всех заданий 17-26
  { source: 'node-task27', target: 'node-task17', label: 'требует знания', strength: 1 },
  { source: 'node-task27', target: 'node-task18', label: 'требует знания', strength: 1 },
  { source: 'node-task27', target: 'node-task19', label: 'требует знания', strength: 1 },
  { source: 'node-task27', target: 'node-task22', label: 'требует знания', strength: 1 },
  { source: 'node-task27', target: 'node-task23', label: 'требует знания', strength: 1 },
  { source: 'node-task27', target: 'node-task24', label: 'требует знания', strength: 1 },
  { source: 'node-task27', target: 'node-task25', label: 'требует знания', strength: 1 },
  { source: 'node-task27', target: 'node-task26', label: 'требует знания', strength: 1 },

  // Последовательные связи внутри блоков
  { source: 'node-task9', target: 'node-task10', label: 'предпосылка', strength: 1 },
  { source: 'node-task10', target: 'node-task11', label: 'предпосылка', strength: 1 },
  { source: 'node-task11', target: 'node-task12', label: 'предпосылка', strength: 1 },
  { source: 'node-task12', target: 'node-task13', label: 'предпосылка', strength: 1 },
  { source: 'node-task13', target: 'node-task14', label: 'предпосылка', strength: 1 },
  { source: 'node-task14', target: 'node-task15', label: 'предпосылка', strength: 1 },

  { source: 'node-task16', target: 'node-task17', label: 'предпосылка', strength: 1 },
  { source: 'node-task17', target: 'node-task18', label: 'предпосылка', strength: 1 },
  { source: 'node-task18', target: 'node-task19', label: 'предпосылка', strength: 1 },

  { source: 'node-task4', target: 'node-task5', label: 'предпосылка', strength: 1 },
  { source: 'node-task5', target: 'node-task6', label: 'предпосылка', strength: 1 },

  { source: 'node-task7', target: 'node-task8', label: 'предпосылка', strength: 1 },

  { source: 'node-task1', target: 'node-task2', label: 'предпосылка', strength: 1 },
  { source: 'node-task2', target: 'node-task3', label: 'предпосылка', strength: 1 },

  { source: 'node-task22', target: 'node-task23', label: 'предпосылка', strength: 1 },
  { source: 'node-task23', target: 'node-task24', label: 'предпосылка', strength: 1 },
  { source: 'node-task24', target: 'node-task25', label: 'предпосылка', strength: 1 },
  { source: 'node-task25', target: 'node-task26', label: 'предпосылка', strength: 1 },
]

// Build nodes from course sections (excluding dooshin meta section)
export function buildKnowledgeNodes(): KnowledgeNode[] {
  const nodes: KnowledgeNode[] = []

  for (const section of course.sections) {
    if (section.id === 'section-dooshin-all') continue

    for (const group of section.groups || []) {
      // Extract task number from group id like 'group-task9'
      const match = group.id.match(/group-task(\d+)/)
      if (!match) continue
      const taskNumber = parseInt(match[1], 10)

      const lessonCount = group.lessons.length

      nodes.push({
        id: `node-task${taskNumber}`,
        label: group.title,
        taskNumber,
        completed: false,
        started: false,
        weak: false,
        lessonCount,
      })
    }
  }

  return nodes
}

// Edge label color mapping
export const edgeLabelColors: Record<string, string> = {
  'предпосылка': '#94a3b8',
  'усложнение': '#f59e0b',
  'связанная тема': '#3b82f6',
  'применение': '#10b981',
  'требует знания': '#ef4444',
}

// Node status colors (Tailwind-compatible hex values)
export const nodeStatusColors = {
  completed: '#22c55e', // green-500
  started: '#eab308',   // yellow-500
  weak: '#ef4444',      // red-500
  notStarted: '#9ca3af', // gray-400
}
