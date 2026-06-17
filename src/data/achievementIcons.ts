import { 
  BookOpen, Flame, Zap, Trophy, Star, Heart, Target, Clock, Sun, Moon, 
  Calendar, Rocket, Dumbbell, Infinity, Download, Award, CheckCircle2
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
  'ach-level-5': Trophy,
  'ach-level-10': Trophy,
  'ach-level-20': Trophy,
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
}

export function getAchievementIcon(id: string): LucideIcon {
  return achievementIcons[id] || Award
}
