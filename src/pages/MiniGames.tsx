import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Gamepad2, Brain, Timer, Trophy, Zap, Star, ChevronRight } from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'

interface MiniGame {
  id: string
  title: string
  description: string
  icon: any
  color: string
  bgColor: string
  path: string
  bestScore?: number
  isNew?: boolean
}

export function MiniGames() {
  const navigate = useNavigate()
  const accentStats = useProgressStore((s) => s.userStats)

  const games: MiniGame[] = [
    {
      id: 'accent',
      title: 'Тренажёр ударений',
      description: 'Угадай ударную букву в слове. Режим на время — 60 секунд!',
      icon: Brain,
      color: 'text-duo-purple',
      bgColor: 'bg-duo-purple/10',
      path: '/accent-trainer',
      bestScore: 0, // TODO: get from accent trainer store
      isNew: true,
    },
    {
      id: 'spelling',
      title: 'Орфографический спринт',
      description: 'Вставь пропущенную букву. Скорость + точность = победа!',
      icon: Zap,
      color: 'text-duo-yellow',
      bgColor: 'bg-duo-yellow/10',
      path: '#',
      isNew: true,
    },
    {
      id: 'punctuation',
      title: 'Пунктуатор',
      description: 'Расставь запятые в предложении. Проверка по правилам.',
      icon: Timer,
      color: 'text-duo-blue',
      bgColor: 'bg-duo-blue/10',
      path: '#',
    },
    {
      id: 'blitz',
      title: 'Блиц-турнир',
      description: '10 вопросов подряд, без права на ошибку!',
      icon: Trophy,
      color: 'text-duo-green',
      bgColor: 'bg-duo-green/10',
      path: '#',
    },
  ]

  return (
    <div className="max-w-md mx-auto px-4 py-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Gamepad2 size={28} className="text-duo-purple" />
        <h1 className="text-2xl font-bold text-gray-800">Мини-игры</h1>
      </div>

      <p className="text-gray-500 text-sm">
        Тренируйся в игровой форме! Соревнуйся с собой и друзьями.
      </p>

      {/* Games list */}
      <div className="flex flex-col gap-4">
        {games.map((game, idx) => (
          <motion.div
            key={game.id}
            className={`card cursor-pointer transition-all hover:shadow-lg ${game.path === '#' ? 'opacity-60' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => game.path !== '#' && navigate(game.path)}
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl ${game.bgColor} flex items-center justify-center shrink-0`}>
                <game.icon size={24} className={game.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-800">{game.title}</h3>
                  {game.isNew && (
                    <span className="px-1.5 py-0.5 bg-duo-green text-white text-xs font-bold rounded-full">
                      NEW
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">{game.description}</p>
                {game.bestScore !== undefined && game.bestScore > 0 && (
                  <div className="flex items-center gap-1 mt-2">
                    <Star size={12} className="text-duo-yellow" />
                    <span className="text-xs font-bold text-gray-600">Рекорд: {game.bestScore}</span>
                  </div>
                )}
              </div>
              {game.path !== '#' ? (
                <ChevronRight size={20} className="text-gray-300 shrink-0 mt-1" />
              ) : (
                <span className="text-xs text-gray-400 shrink-0 mt-1">Скоро</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Leaderboard teaser */}
      <motion.div
        className="card bg-gradient-to-r from-duo-purple/10 to-duo-blue/10 border border-duo-purple/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-3">
          <Trophy size={24} className="text-duo-purple" />
          <div className="flex-1">
            <h3 className="font-bold text-gray-800">Таблица лидеров</h3>
            <p className="text-sm text-gray-500">Скоро: соревнуйся с друзьями в мини-играх!</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
