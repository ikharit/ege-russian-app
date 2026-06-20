import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingBag, Filter, Zap, Check, X } from 'lucide-react'
import { useShopStore, type ShopCategory, type ShopRarity } from '../stores/shopStore'
import { useProgressStore } from '../stores/progressStore'
import confetti from 'canvas-confetti'

const categoryLabels: Record<ShopCategory, string> = {
  avatar: 'Аватарки',
  theme: 'Темы',
  badge: 'Бейджи',
  sound: 'Звуки',
  frame: 'Рамки',
}

const rarityColors: Record<ShopRarity, { border: string; bg: string; text: string; glow: string }> = {
  common: { border: 'border-gray-300', bg: 'bg-gray-50', text: 'text-gray-500', glow: '' },
  rare: { border: 'border-blue-400', bg: 'bg-blue-50', text: 'text-blue-600', glow: 'shadow-blue-200' },
  epic: { border: 'border-purple-400', bg: 'bg-purple-50', text: 'text-purple-600', glow: 'shadow-purple-200' },
  legendary: { border: 'border-yellow-400', bg: 'bg-yellow-50', text: 'text-yellow-600', glow: 'shadow-yellow-200' },
}

const rarityLabels: Record<ShopRarity, string> = {
  common: 'Обычный',
  rare: 'Редкий',
  epic: 'Эпический',
  legendary: 'Легендарный',
}

export function ShopPage() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState<ShopCategory | 'all'>('all')
  const [justPurchased, setJustPurchased] = useState<string | null>(null)

  const inventory = useShopStore((s) => s.inventory)
  const equipped = useShopStore((s) => s.equipped)
  const purchase = useShopStore((s) => s.purchase)
  const equip = useShopStore((s) => s.equip)
  const unequip = useShopStore((s) => s.unequip)

  const xp = useProgressStore((s) => s.userStats.xp)
  const questCount = Object.values(useProgressStore((s) => s.dailyQuestProgress)).filter((q) => q.completed).length

  const filtered = activeCategory === 'all'
    ? inventory
    : inventory.filter((i) => i.category === activeCategory)

  const handlePurchase = (itemId: string, rarity: ShopRarity) => {
    const success = purchase(itemId)
    if (success) {
      setJustPurchased(itemId)
      setTimeout(() => setJustPurchased(null), 2000)

      if (rarity === 'legendary') {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFD700', '#FFA500', '#FF6347', '#FFD700'],
        })
      }
    }
  }

  const handleEquip = (itemId: string, category: ShopCategory) => {
    const isEquipped = equipped[category] === itemId
    if (isEquipped) {
      unequip(category)
    } else {
      equip(itemId, category)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <ShoppingBag size={24} className="text-duo-purple" />
          Магазин
        </h1>
      </div>

      {/* XP Bar */}
      <div className="bg-gradient-to-r from-duo-purple/10 to-duo-blue/10 rounded-2xl p-4 border border-duo-purple/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={20} className="text-duo-yellow" fill="currentColor" />
            <span className="font-bold text-lg">{xp} XP</span>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Выполнено квестов</p>
            <p className="font-bold text-duo-purple">{questCount}</p>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => setActiveCategory('all')}
          className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeCategory === 'all'
              ? 'bg-duo-purple text-white shadow-md'
              : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Filter size={14} />
          Все
        </button>
        {(Object.keys(categoryLabels) as ShopCategory[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-duo-purple text-white shadow-md'
                : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-2 gap-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((item) => {
            const rc = rarityColors[item.rarity]
            const isEquipped = equipped[item.category] === item.id
            const canAfford = xp >= item.price
            const isFree = item.price === 0

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className={`relative rounded-2xl p-3 border-2 ${rc.border} ${rc.bg} ${
                  item.rarity === 'legendary' ? 'shadow-lg shadow-yellow-200/50' : item.rarity === 'epic' ? 'shadow-md ' + rc.glow : ''
                } flex flex-col gap-2`}
              >
                {/* Rarity badge */}
                <div className={`absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white/80 ${rc.text}`}>
                  {rarityLabels[item.rarity]}
                </div>

                {/* Icon */}
                <div className="w-12 h-12 mx-auto rounded-xl bg-white flex items-center justify-center text-2xl shadow-sm">
                  {item.icon}
                </div>

                {/* Info */}
                <div className="text-center">
                  <p className="font-bold text-sm text-gray-800">{item.name}</p>
                  <p className="text-[10px] text-gray-400 leading-tight">{item.description}</p>
                </div>

                {/* Condition */}
                {item.condition && !item.purchased && (
                  <p className="text-[9px] text-yellow-600 text-center bg-yellow-50 rounded-lg px-1 py-0.5">
                    {item.condition}
                  </p>
                )}

                {/* Price / Action */}
                {item.purchased ? (
                  <button
                    onClick={() => handleEquip(item.id, item.category)}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                      isEquipped
                        ? 'bg-duo-green text-white'
                        : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-duo-green hover:text-duo-green'
                    }`}
                  >
                    {isEquipped ? (
                      <span className="flex items-center justify-center gap-1">
                        <Check size={14} /> Надето
                      </span>
                    ) : (
                      'Надеть'
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => handlePurchase(item.id, item.rarity)}
                    disabled={!canAfford}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                      canAfford
                        ? 'bg-duo-yellow text-white hover:bg-duo-yellow/90'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isFree ? 'Бесплатно' : `${item.price} XP`}
                  </button>
                )}

                {/* Just purchased animation */}
                {justPurchased === item.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-2xl"
                  >
                    <motion.div
                      initial={{ rotate: -20 }}
                      animate={{ rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                    >
                      <Check size={40} className="text-duo-green" />
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <ShoppingBag size={40} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm">Нет товаров в этой категории</p>
        </div>
      )}
    </div>
  )
}
