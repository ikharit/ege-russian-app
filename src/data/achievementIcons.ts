import { 
  BookOpen, Flame, Zap, Trophy, Star, Heart, Target, Clock, Sun, Moon, 
  Calendar, Rocket, Dumbbell, Infinity, Download, Award, CheckCircle2, CheckCircle,
  Repeat, Timer, Atom, Crown
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const achievementIcons: Record<string, LucideIcon> = {
  'ach-first-lesson': BookOpen,
  'ach-lessons-5': BookOpen,
  'ach-lessons-10': BookOpen,
  'ach-lessons-25': BookOpen,
  'ach-lessons-50': BookOpen,
  'ach-streak-3': Flame,
  'ach-streak-7': Flame,
  'ach-streak-14': Flame,
  'ach-streak-30': Flame,
  'ach-xp-100': Zap,
  'ach-xp-500': Zap,
  'ach-xp-1000': Zap,
  'ach-xp-5000': Zap,
  'ach-level-5': Crown,
  'ach-level-10': Crown,
  'ach-level-20': Crown,
  'ach-perfect': Star,
  'ach-perfect-5': Star,
  'ach-perfect-10': Star,
  'ach-section-1': Target,
  'ach-section-2': Target,
  'ach-section-3': Target,
  'ach-all-sections': CheckCircle2,
  'ach-atom-first': Award,
  'ach-atom-master': Award,
  'ach-night-owl': Moon,
  'ach-early-bird': Sun,
  'ach-weekend': Calendar,
  'ach-speedrun': Rocket,
  'ach-persistent': Dumbbell,
  'ach-no-hearts-lost': Heart,
  'ach-heart-restore': Heart,
  'ach-export': Download,
  'ach-infinite': Infinity,
  // Новые
  'ach-combo-5': Zap,
  'ach-combo-10': Zap,
  'ach-questions-50': Target,
  'ach-questions-200': Target,
  'ach-questions-500': Target,
  'ach-time-1h': Clock,
  'ach-time-5h': Clock,
  'ach-time-10h': Clock,
  'ach-retry-5': Repeat,
  'ach-fast-learner': Rocket,
  'ach-collection': Star,
  'ach-collector': Star,
  'ach-quest-master': Award,
  'ach-ege-ready': Trophy,
  // Mistakes
  'ach-mistake-1': CheckCircle,
  'ach-mistake-5': CheckCircle,
  'ach-mistake-10': CheckCircle,
  'ach-mistake-25': CheckCircle,
  'ach-mistake-all': CheckCircle,
}

export function getAchievementIcon(id: string): LucideIcon {
  return achievementIcons[id] || Award
}
