import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Volume2, ChevronRight } from 'lucide-react'
import { AccentTrainerMiniProgress } from '../components/dashboard/AccentTrainerMiniProgress'
import { Task5MiniProgress } from '../components/dashboard/Task5MiniProgress'
import { Task10MiniProgress } from '../components/dashboard/Task10MiniProgress'

interface TrainerItem {
  id: string
  taskNumber: string
  title: string
  subtitle: string
  path: string
  color: string
  bgGradient: string
  borderColor: string
  textColor: string
  icon?: React.ReactNode
  miniProgress?: React.ReactNode
}

const trainers: TrainerItem[] = [
  {
    id: 'accent',
    taskNumber: '№4',
    title: 'Ударения',
    subtitle: 'Кликай на ударную букву',
    path: '/accent-trainer',
    color: 'bg-rose-400',
    bgGradient: 'from-rose-50 to-pink-50',
    borderColor: 'border-rose-200',
    textColor: 'text-rose-500',
    icon: <Volume2 size={20} />,
    miniProgress: <AccentTrainerMiniProgress />,
  },
  {
    id: 'task5',
    taskNumber: '№5',
    title: 'Паронимы',
    subtitle: 'Словарь ФИПИ',
    path: '/task5-trainer',
    color: 'bg-emerald-500',
    bgGradient: 'from-emerald-50 to-teal-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-500',
    miniProgress: <Task5MiniProgress />,
  },
  {
    id: 'task6',
    taskNumber: '№6',
    title: 'Суффиксы',
    subtitle: 'Чередование в корнях',
    path: '/task6-trainer',
    color: 'bg-cyan-500',
    bgGradient: 'from-cyan-50 to-sky-50',
    borderColor: 'border-cyan-200',
    textColor: 'text-cyan-500',
  },
  {
    id: 'task7',
    taskNumber: '№7',
    title: 'Окончания глаголов',
    subtitle: 'I и II спряжение',
    path: '/task7-trainer',
    color: 'bg-violet-500',
    bgGradient: 'from-violet-50 to-purple-50',
    borderColor: 'border-violet-200',
    textColor: 'text-violet-500',
  },
  {
    id: 'task8',
    taskNumber: '№8',
    title: 'Слитное / раздельное',
    subtitle: 'Написание с НЕ',
    path: '/task8-trainer',
    color: 'bg-amber-500',
    bgGradient: 'from-amber-50 to-yellow-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-500',
  },
  {
    id: 'task9',
    taskNumber: '№9',
    title: 'Пропущенные буквы',
    subtitle: 'Буквы в корнях',
    path: '/task9-trainer',
    color: 'bg-lime-500',
    bgGradient: 'from-lime-50 to-green-50',
    borderColor: 'border-lime-200',
    textColor: 'text-lime-500',
  },
  {
    id: 'task10',
    taskNumber: '№10',
    title: 'ПРЕ / ПРИ, Ъ / Ь, Ы / И',
    subtitle: 'Сложные слова',
    path: '/task10-trainer',
    color: 'bg-blue-500',
    bgGradient: 'from-blue-50 to-indigo-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-500',
    miniProgress: <Task10MiniProgress />,
  },
  {
    id: 'task11',
    taskNumber: '№11',
    title: 'Суффиксы прилагательных',
    subtitle: '-нн- / -н-',
    path: '/task11-trainer',
    color: 'bg-pink-500',
    bgGradient: 'from-pink-50 to-rose-50',
    borderColor: 'border-pink-200',
    textColor: 'text-pink-500',
  },
  {
    id: 'task12',
    taskNumber: '№12',
    title: 'Окончания причастий',
    subtitle: 'Причастия и деепричастия',
    path: '/task12-trainer',
    color: 'bg-indigo-500',
    bgGradient: 'from-indigo-50 to-blue-50',
    borderColor: 'border-indigo-200',
    textColor: 'text-indigo-500',
  },
  {
    id: 'task13',
    taskNumber: '№13',
    title: 'НЕ / НИ с причастиями',
    subtitle: 'Слитно или раздельно',
    path: '/task13-trainer',
    color: 'bg-teal-500',
    bgGradient: 'from-teal-50 to-cyan-50',
    borderColor: 'border-teal-200',
    textColor: 'text-teal-500',
  },
  {
    id: 'task14',
    taskNumber: '№14',
    title: 'Слитное / раздельное / дефисное',
    subtitle: 'Наречия и предлоги',
    path: '/task14-trainer',
    color: 'bg-fuchsia-500',
    bgGradient: 'from-fuchsia-50 to-pink-50',
    borderColor: 'border-fuchsia-200',
    textColor: 'text-fuchsia-500',
  },
  {
    id: 'task15',
    taskNumber: '№15',
    title: 'Пунктуация',
    subtitle: 'Знаки препинания',
    path: '/task15-trainer',
    color: 'bg-slate-500',
    bgGradient: 'from-slate-50 to-gray-50',
    borderColor: 'border-slate-200',
    textColor: 'text-slate-500',
  },
  {
    id: 'task16',
    taskNumber: '№16',
    title: 'Пунктуация',
    subtitle: 'Сложные предложения',
    path: '/task16-trainer',
    color: 'bg-orange-500',
    bgGradient: 'from-orange-50 to-amber-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-500',
  },
]

export function TrainersPage() {
  const navigate = useNavigate()

  const handleKeyNav = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      action()
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Назад на главную"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Тренажёры</h1>
          <p className="text-sm text-gray-500">{trainers.length} заданий для подготовки</p>
        </div>
      </div>

      {/* Trainer Grid */}
      <div className="grid grid-cols-2 gap-3">
        {trainers.map((trainer) => (
          <motion.div
            key={trainer.id}
            className={`card bg-gradient-to-br ${trainer.bgGradient} ${trainer.borderColor} cursor-pointer`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(trainer.path)}
            onKeyDown={(e) => handleKeyNav(e, () => navigate(trainer.path))}
            role="button"
            tabIndex={0}
            aria-label={`Тренажёр ${trainer.title}, ${trainer.taskNumber}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-lg ${trainer.color} flex items-center justify-center text-white text-sm font-bold`}>
                {trainer.icon || trainer.taskNumber}
              </div>
              <span className={`text-xs font-bold uppercase tracking-wide ${trainer.textColor}`}>
                {trainer.taskNumber}
              </span>
            </div>
            <p className="font-bold text-gray-800 text-sm leading-tight">{trainer.title}</p>
            <p className="text-xs text-gray-500 mt-1">{trainer.subtitle}</p>
            {trainer.miniProgress && (
              <div className="mt-2">
                {trainer.miniProgress}
              </div>
            )}
            <div className="flex justify-end mt-1">
              <ChevronRight size={16} className="text-gray-300" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
