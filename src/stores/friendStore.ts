import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface FriendProfile {
  id: string
  name: string
  emoji: string
  level: number
  xp: number
  streak: number
  completedLessons: number
  totalLessons: number
  bestScore: number
  achievementsCount: number
  hearts: number
  maxHearts: number
  lastActive: string
  status: 'online' | 'recently' | 'offline'
}

export interface FriendRequest {
  id: string
  fromId: string
  fromName: string
  fromEmoji: string
  sentAt: string
}

export interface FriendActivity {
  id: string
  friendId: string
  friendName: string
  friendEmoji: string
  type: 'lesson_completed' | 'achievement_unlocked' | 'streak_milestone' | 'level_up' | 'duel_won'
  description: string
  xp?: number
  timestamp: string
}

interface FriendStore {
  friends: FriendProfile[]
  incomingRequests: FriendRequest[]
  outgoingRequests: string[] // IDs we've sent requests to
  activities: FriendActivity[]
  
  // Actions
  sendFriendRequest: (toId: string, toName: string, toEmoji: string) => boolean
  acceptFriendRequest: (requestId: string) => void
  rejectFriendRequest: (requestId: string) => void
  removeFriend: (friendId: string) => void
  updateFriendProgress: (friendId: string, data: Partial<FriendProfile>) => void
  getFriendComparison: (friendId: string) => { you: Partial<FriendProfile>; friend: FriendProfile } | null
  getActivities: (limit?: number) => FriendActivity[]
  addActivity: (activity: Omit<FriendActivity, 'id'>) => void
  getOnlineFriends: () => FriendProfile[]
  canSendHearts: (friendId: string) => boolean
  sendHeart: (friendId: string) => void
  lastHeartSent: Record<string, string> // friendId -> ISO date
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 10)
}

export const useFriendStore = create<FriendStore>()(
  persist(
    (set, get) => ({
      friends: [],
      incomingRequests: [],
      outgoingRequests: [],
      activities: [],
      lastHeartSent: {},

      sendFriendRequest: (toId: string, toName: string, toEmoji: string) => {
        const { outgoingRequests, friends } = get()
        
        // Check if already friends or already sent
        if (friends.some(f => f.id === toId)) return false
        if (outgoingRequests.includes(toId)) return false

        const request: FriendRequest = {
          id: generateId(),
          fromId: 'me', // In real app, this would be current user ID
          fromName: 'Я',
          fromEmoji: '😊',
          sentAt: new Date().toISOString(),
        }

        // In a real app, this would send to backend
        // For now, simulate by adding to outgoing
        set({ outgoingRequests: [...outgoingRequests, toId] })
        return true
      },

      acceptFriendRequest: (requestId: string) => {
        const { incomingRequests, friends } = get()
        const request = incomingRequests.find(r => r.id === requestId)
        if (!request) return

        const newFriend: FriendProfile = {
          id: request.fromId,
          name: request.fromName,
          emoji: request.fromEmoji,
          level: 1,
          xp: 0,
          streak: 0,
          completedLessons: 0,
          totalLessons: 100,
          bestScore: 0,
          achievementsCount: 0,
          hearts: 5,
          maxHearts: 5,
          lastActive: request.sentAt,
          status: 'recently',
        }

        set({
          friends: [...friends, newFriend],
          incomingRequests: incomingRequests.filter(r => r.id !== requestId),
        })

        // Add activity
        get().addActivity({
          friendId: request.fromId,
          friendName: request.fromName,
          friendEmoji: request.fromEmoji,
          type: 'lesson_completed',
          description: `Добавил(а) вас в друзья`,
          timestamp: new Date().toISOString(),
        })
      },

      rejectFriendRequest: (requestId: string) => {
        const { incomingRequests } = get()
        set({ incomingRequests: incomingRequests.filter(r => r.id !== requestId) })
      },

      removeFriend: (friendId: string) => {
        const { friends } = get()
        set({ friends: friends.filter(f => f.id !== friendId) })
      },

      updateFriendProgress: (friendId: string, data: Partial<FriendProfile>) => {
        const { friends } = get()
        set({
          friends: friends.map(f => 
            f.id === friendId ? { ...f, ...data, lastActive: new Date().toISOString() } : f
          ),
        })
      },

      getFriendComparison: (friendId: string) => {
        const { friends } = get()
        const friend = friends.find(f => f.id === friendId)
        if (!friend) return null

        // In real app, this would compare with current user's progress store
        const you = {
          level: 5,
          xp: 1200,
          streak: 3,
          completedLessons: 45,
          bestScore: 85,
          achievementsCount: 12,
        }

        return { you, friend }
      },

      getActivities: (limit = 20) => {
        const { activities } = get()
        return activities
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, limit)
      },

      addActivity: (activity) => {
        const { activities } = get()
        const newActivity: FriendActivity = {
          ...activity,
          id: generateId(),
        }
        set({ activities: [newActivity, ...activities].slice(0, 100) })
      },

      getOnlineFriends: () => {
        const { friends } = get()
        return friends.filter(f => f.status === 'online')
      },

      canSendHearts: (friendId: string) => {
        const { lastHeartSent } = get()
        const lastSent = lastHeartSent[friendId]
        if (!lastSent) return true
        
        const lastDate = new Date(lastSent).toISOString().split('T')[0]
        const today = new Date().toISOString().split('T')[0]
        return lastDate !== today
      },

      sendHeart: (friendId: string) => {
        const { lastHeartSent, friends } = get()
        if (!get().canSendHearts(friendId)) return

        set({
          lastHeartSent: { ...lastHeartSent, [friendId]: new Date().toISOString() },
          friends: friends.map(f => 
            f.id === friendId ? { ...f, hearts: Math.min(f.hearts + 1, f.maxHearts) } : f
          ),
        })

        get().addActivity({
          friendId,
          friendName: friends.find(f => f.id === friendId)?.name || 'Друг',
          friendEmoji: friends.find(f => f.id === friendId)?.emoji || '👤',
          type: 'lesson_completed',
          description: 'Отправил(а) сердечко ❤️',
          timestamp: new Date().toISOString(),
        })
      },
    }),
    { name: 'ege-friend-storage' }
  )
)
