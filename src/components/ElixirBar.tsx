import { motion } from 'framer-motion'
import { Heart, Beaker, Infinity, Plus } from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'

interface Elixir {
  id: string
  name: string
  emoji: string
  description: string
  effect: 'restore-heart' | 'restore-all' | 'infinite-lesson'
  value: number
}

const elixirs: Elixir[] = [
  { id: 'elixir-heart', name: 'Элексир жизни', emoji: '❤️', description: 'Восстанавливает 1 сердце', effect: 'restore-heart', value: 1 },
  { id: 'elixir-full', name: 'Большой элексир', emoji: '💖', description: 'Восстанавливает все сердца', effect: 'restore-all', value: 5 },
  { id: 'elixir-infinite', name: 'Элексир бессмертия', emoji: '♾️', description: 'Бесконечные сердца на 1 урок', effect: 'infinite-lesson', value: 1 },
]

export function ElixirBar() {
  const hearts = useProgressStore((s) => s.userStats.hearts)
  const maxHearts = useProgressStore((s) => s.userStats.maxHearts)
  const infiniteHearts = useProgressStore((s) => s.userStats.infiniteHearts)
  const restoreHearts = useProgressStore((s) => s.restoreHearts)
  const toggleInfiniteHearts = useProgressStore((s) => s.toggleInfiniteHearts)

  const useElixir = (elixir: Elixir) => {
    if (elixir.effect === 'restore-heart') {
      // Would check inventory, for now just restore
      if (hearts < maxHearts) {
        // Mock: just restore one
        const newHearts = Math.min(maxHearts, hearts + 1)
        // We need a way to set specific heart count — using restoreHearts for now
        restoreHearts()
      }
    } else if (elixir.effect === 'restore-all') {
      restoreHearts()
    } else if (elixir.effect === 'infinite-lesson') {
      toggleInfiniteHearts()
    }
  }

  return (
    <div className="flex items-center gap-2">
      {hearts < maxHearts && !infiniteHearts && (
        <motion.button
          className="flex items-center gap-1 bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-bold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => restoreHearts()}
        >
          <Plus size={12} />
          <span>Восстановить</span>
        </motion.button>
      )}
    </div>
  )
}
