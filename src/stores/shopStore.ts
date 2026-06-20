import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useProgressStore } from './progressStore'

export type ShopCategory = 'avatar' | 'theme' | 'badge' | 'sound' | 'frame'
export type ShopRarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface ShopItem {
  id: string
  name: string
  description: string
  category: ShopCategory
  price: number // XP
  icon: string // emoji или lucide icon name
  rarity: ShopRarity
  unlocked: boolean
  purchased: boolean
  condition?: string // условие разблокировки (optional)
}

export interface EquippedItems {
  avatar: string | null
  theme: string | null
  badge: string | null
  sound: string | null
  frame: string | null
}

export interface ShopStore {
  inventory: ShopItem[]
  equipped: EquippedItems
  purchase: (itemId: string) => boolean
  equip: (itemId: string, category: ShopCategory) => void
  unequip: (category: ShopCategory) => void
  getItemById: (itemId: string) => ShopItem | undefined
  getItemsByCategory: (category: ShopCategory) => ShopItem[]
  getPurchasedItems: () => ShopItem[]
  getEquippedItem: (category: ShopCategory) => ShopItem | undefined
  getEquippedAvatar: () => string
  getEquippedBadge: () => ShopItem | undefined
  getEquippedFrame: () => ShopItem | undefined
  resetShop: () => void
}

const defaultInventory: ShopItem[] = [
  // Аватарки
  { id: 'avatar_default', name: 'Обычный', description: 'Стандартная аватарка', category: 'avatar', price: 0, icon: '🙂', rarity: 'common', unlocked: true, purchased: true },
  { id: 'avatar_lion', name: 'Лев', description: 'Царь зверей', category: 'avatar', price: 500, icon: '🦁', rarity: 'rare', unlocked: true, purchased: false },
  { id: 'avatar_owl', name: 'Сова', description: 'Мудрая и внимательная', category: 'avatar', price: 1000, icon: '🦉', rarity: 'rare', unlocked: true, purchased: false },
  { id: 'avatar_rocket', name: 'Ракета', description: 'Стремительный к цели', category: 'avatar', price: 2000, icon: '🚀', rarity: 'epic', unlocked: true, purchased: false },
  { id: 'avatar_crown', name: 'Корона', description: 'Вершина достижений', category: 'avatar', price: 5000, icon: '👑', rarity: 'legendary', unlocked: true, purchased: false, condition: 'Достигни 10 уровня' },
  // Темы
  { id: 'theme_light', name: 'Светлая', description: 'Классическая светлая тема', category: 'theme', price: 0, icon: '☀️', rarity: 'common', unlocked: true, purchased: true },
  { id: 'theme_dark', name: 'Тёмная', description: 'Для ночных занятий', category: 'theme', price: 1000, icon: '🌙', rarity: 'rare', unlocked: true, purchased: false },
  { id: 'theme_purple', name: 'Фиолетовая', description: 'Магия знаний', category: 'theme', price: 1500, icon: '🔮', rarity: 'epic', unlocked: true, purchased: false },
  { id: 'theme_fire', name: 'Огонь', description: 'Горячий темп', category: 'theme', price: 3000, icon: '🔥', rarity: 'epic', unlocked: true, purchased: false, condition: 'Реши 50 заданий' },
  // Бейджи
  { id: 'badge_novice', name: 'Новичок', description: 'Начало пути', category: 'badge', price: 0, icon: '🌱', rarity: 'common', unlocked: true, purchased: true },
  { id: 'badge_scholar', name: 'Учёный', description: 'Знания накапливаются', category: 'badge', price: 500, icon: '📚', rarity: 'rare', unlocked: true, purchased: false },
  { id: 'badge_literate', name: 'Грамотей', description: 'Мастер слова', category: 'badge', price: 1000, icon: '✍️', rarity: 'rare', unlocked: true, purchased: false },
  { id: 'badge_genius', name: 'Гений русского', description: 'Вершина русского языка', category: 'badge', price: 5000, icon: '🧠', rarity: 'legendary', unlocked: true, purchased: false, condition: 'Пройди все уроки' },
  // Звуки
  { id: 'sound_default', name: 'Стандартный', description: 'Классический звук', category: 'sound', price: 0, icon: '🔔', rarity: 'common', unlocked: true, purchased: true },
  { id: 'sound_fun', name: 'Весёлый', description: 'Поднимает настроение', category: 'sound', price: 500, icon: '🎉', rarity: 'rare', unlocked: true, purchased: false },
  { id: 'sound_motivational', name: 'Мотивационный', description: 'Вдохновляет на подвиги', category: 'sound', price: 1000, icon: '💪', rarity: 'rare', unlocked: true, purchased: false },
  // Рамки
  { id: 'frame_basic', name: 'Базовая', description: 'Простая рамка', category: 'frame', price: 0, icon: '⬜', rarity: 'common', unlocked: true, purchased: true },
  { id: 'frame_gold', name: 'Золотая', description: 'Блестящая золотая рамка', category: 'frame', price: 2000, icon: '🟨', rarity: 'epic', unlocked: true, purchased: false },
  { id: 'frame_rainbow', name: 'Радужная', description: 'Все цвета радуги', category: 'frame', price: 3000, icon: '🌈', rarity: 'epic', unlocked: true, purchased: false },
]

const defaultEquipped: EquippedItems = {
  avatar: 'avatar_default',
  theme: 'theme_light',
  badge: 'badge_novice',
  sound: 'sound_default',
  frame: 'frame_basic',
}

export const useShopStore = create<ShopStore>()(
  persist(
    (set, get) => ({
      inventory: defaultInventory,
      equipped: defaultEquipped,

      purchase: (itemId: string) => {
        const item = get().inventory.find((i) => i.id === itemId)
        if (!item) return false
        if (item.purchased) return true
        if (!item.unlocked) return false

        const userXP = useProgressStore.getState().userStats.xp
        if (userXP < item.price) return false

        // Списать XP
        useProgressStore.getState().addXP(-item.price)

        // Отметить как купленное
        set((s) => ({
          inventory: s.inventory.map((i) =>
            i.id === itemId ? { ...i, purchased: true } : i
          ),
        }))

        return true
      },

      equip: (itemId: string, category: ShopCategory) => {
        const item = get().inventory.find((i) => i.id === itemId)
        if (!item || !item.purchased) return
        if (item.category !== category) return

        set((s) => ({
          equipped: { ...s.equipped, [category]: itemId },
        }))
      },

      unequip: (category: ShopCategory) => {
        const defaults: Record<ShopCategory, string> = {
          avatar: 'avatar_default',
          theme: 'theme_light',
          badge: 'badge_novice',
          sound: 'sound_default',
          frame: 'frame_basic',
        }
        set((s) => ({
          equipped: { ...s.equipped, [category]: defaults[category] },
        }))
      },

      getItemById: (itemId: string) => {
        return get().inventory.find((i) => i.id === itemId)
      },

      getItemsByCategory: (category: ShopCategory) => {
        return get().inventory.filter((i) => i.category === category)
      },

      getPurchasedItems: () => {
        return get().inventory.filter((i) => i.purchased)
      },

      getEquippedItem: (category: ShopCategory) => {
        const id = get().equipped[category]
        if (!id) return undefined
        return get().inventory.find((i) => i.id === id)
      },

      getEquippedAvatar: () => {
        const id = get().equipped.avatar
        const item = get().inventory.find((i) => i.id === id)
        return item?.icon ?? '🙂'
      },

      getEquippedBadge: () => {
        const id = get().equipped.badge
        return get().inventory.find((i) => i.id === id)
      },

      getEquippedFrame: () => {
        const id = get().equipped.frame
        return get().inventory.find((i) => i.id === id)
      },

      resetShop: () => {
        set({ inventory: defaultInventory, equipped: defaultEquipped })
      },
    }),
    {
      name: 'ege-shop-storage',
    }
  )
)
