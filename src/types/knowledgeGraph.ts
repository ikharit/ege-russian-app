export interface KnowledgeNode {
  id: string;
  label: string;
  taskNumber: number;
  x?: number;
  y?: number;
  completed: boolean;
  started: boolean;
  weak: boolean;
  lessonCount?: number;
}

export interface KnowledgeEdge {
  source: string;
  target: string;
  label?: string;
  strength: number; // 1-3
}

export type EdgeLabel = 'предпосылка' | 'усложнение' | 'связанная тема' | 'применение' | 'требует знания';
