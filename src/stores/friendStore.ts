import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase, isSupabaseConfigured, getCurrentUser } from '../lib/supabase'
import type { FriendRequestDB, FriendDB } from '../lib/supabase'

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
  isLoading: boolean
  syncError: string | null

  // Actions
  sendFriendRequest: (toId: string, toName: string, toEmoji: string) => Promise<boolean>
  acceptFriendRequest: (requestId: string) => Promise<boolean>
  rejectFriendRequest: (requestId: string) => Promise<boolean>
  removeFriend: (friendId: string) => Promise<boolean>
  updateFriendProgress: (friendId: string, data: Partial<FriendProfile>) => void
  getFriendComparison: (friendId: string) => { you: Partial<FriendProfile>; friend: FriendProfile } | null
  getActivities: (limit?: number) => FriendActivity[]
  addActivity: (activity: Omit<FriendActivity, 'id'>) => void
  getOnlineFriends: () => FriendProfile[]
  canSendHearts: (friendId: string) => boolean
  sendHeart: (friendId: string) => void
  lastHeartSent: Record<string, string> // friendId -> ISO date
  loadFriends: () => Promise<void>
  clearSyncError: () => void
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 10)
}

function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(str)
}

function dbToFriendRequest(db: FriendRequestDB): FriendRequest {
  return {
    id: db.id,
    fromId: db.from_user_id,
    fromName: db.from_name || 'Пользователь',
    fromEmoji: db.from_emoji || '👤',
    sentAt: db.created_at,
  }
}

function dbToFriendProfile(db: FriendDB): FriendProfile {
  return {
    id: db.friend_id,
    name: db.friend_name || 'Пользователь',
    emoji: db.friend_emoji || '👤',
    level: db.friend_level || 1,
    xp: db.friend_xp || 0,
    streak: db.friend_streak || 0,
    completedLessons: 0,
    totalLessons: 100,
    bestScore: 0,
    achievementsCount: 0,
    hearts: 5,
    maxHearts: 5,
    lastActive: db.created_at || new Date().toISOString(),
    status: 'recently',
  }
}

export const useFriendStore = create<FriendStore>()(
  persist(
    (set, get) => ({
      friends: [],
      incomingRequests: [],
      outgoingRequests: [],
      activities: [],
      lastHeartSent: {},
      isLoading: false,
      syncError: null,

      // Load friends and requests from Supabase
      loadFriends: async () => {
        if (!isSupabaseConfigured) return
        const user = await getCurrentUser()
        if (!user) return

        set({ isLoading: true, syncError: null })

        try {
          // Load incoming requests
          const { data: requestsData, error: reqError } = await supabase
            .from('friend_requests')
            .select('*')
            .eq('to_user_id', user.id)
            .eq('status', 'pending')
            .order('created_at', { ascending: false })

          if (reqError) throw reqError

          const incoming = (requestsData || []).map(dbToFriendRequest)

          // Load friends
          const { data: friendsData, error: friendsError } = await supabase
            .from('friends')
            .select('*')
            .eq('user_id', user.id)

          if (friendsError) throw friendsError

          const friends = (friendsData || []).map(dbToFriendProfile)

          // Load outgoing requests
          const { data: outgoingData, error: outError } = await supabase
            .from('friend_requests')
            .select('to_user_id')
            .eq('from_user_id', user.id)
            .eq('status', 'pending')

          if (outError) throw outError

          const outgoing = (outgoingData || []).map((r: any) => r.to_user_id)

          set({
            incomingRequests: incoming,
            friends,
            outgoingRequests: outgoing,
            isLoading: false,
          })
        } catch (err: any) {
          set({ isLoading: false, syncError: err.message || 'Ошибка загрузки друзей' })
        }
      },

      clearSyncError: () => set({ syncError: null }),

      sendFriendRequest: async (toId: string, toName: string, toEmoji: string) => {
        const { outgoingRequests, friends } = get()

        // Check if already friends or already sent
        if (friends.some(f => f.id === toId)) return false
        if (outgoingRequests.includes(toId)) return false

        // Validate UUID
        if (!isValidUUID(toId)) {
          set({ syncError: 'Некорректный ID. Убедитесь, что ID — это UUID из профиля друга.' })
          return false
        }

        // Try Supabase first
        if (isSupabaseConfigured) {
          try {
            const user = await getCurrentUser()
            if (!user) {
              set({ syncError: 'Войдите в аккаунт, чтобы добавлять друзей' })
              return false
            }

            const { error } = await supabase.from('friend_requests').insert({
              from_user_id: user.id,
              to_user_id: toId,
              from_name: toName || 'Я',
              from_emoji: toEmoji || '😊',
              status: 'pending',
            })

            if (error) {
              if (error.message?.includes('duplicate')) {
                set({ syncError: 'Запрос уже отправлен' })
                return false
              }
              throw error
            }

            set({ outgoingRequests: [...outgoingRequests, toId] })
            return true
          } catch (err: any) {
            set({ syncError: err.message || 'Ошибка отправки запроса' })
            return false
          }
        }

        // Fallback: local-only mode
        const request: FriendRequest = {
          id: generateId(),
          fromId: 'me',
          fromName: 'Я',
          fromEmoji: '😊',
          sentAt: new Date().toISOString(),
        }
        set({ outgoingRequests: [...outgoingRequests, toId] })
        return true
      },

      acceptFriendRequest: async (requestId: string) => {
        const { incomingRequests, friends } = get()
        const request = incomingRequests.find(r => r.id === requestId)
        if (!request) return false

        if (isSupabaseConfigured) {
          try {
            const user = await getCurrentUser()
            if (!user) return false

            // Call RPC function to accept
            const { error } = await supabase.rpc('accept_friend_request', { request_id: requestId })

            if (error) {
              // Fallback: direct update if RPC doesn't exist
              const { error: updateError } = await supabase
                .from('friend_requests')
                .update({ status: 'accepted' })
                .eq('id', requestId)
                .eq('to_user_id', user.id)

              if (updateError) throw updateError

              // Insert bidirectional friends (ignore duplicates)
              const { error: f1 } = await supabase.from('friends').insert({
                user_id: user.id,
                friend_id: request.fromId,
                friend_name: request.fromName,
                friend_emoji: request.fromEmoji,
              })

              const { error: f2 } = await supabase.from('friends').insert({
                user_id: request.fromId,
                friend_id: user.id,
                friend_name: 'Я',
                friend_emoji: '😊',
              })

              if (f1 && !f1.message?.includes('duplicate')) throw f1
              if (f2 && !f2.message?.includes('duplicate')) throw f2
            }

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

            get().addActivity({
              friendId: request.fromId,
              friendName: request.fromName,
              friendEmoji: request.fromEmoji,
              type: 'lesson_completed',
              description: `Добавил(а) вас в друзья`,
              timestamp: new Date().toISOString(),
            })

            return true
          } catch (err: any) {
            set({ syncError: err.message || 'Ошибка принятия запроса' })
            return false
          }
        }

        // Local-only fallback
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

        get().addActivity({
          friendId: request.fromId,
          friendName: request.fromName,
          friendEmoji: request.fromEmoji,
          type: 'lesson_completed',
          description: `Добавил(а) вас в друзья`,
          timestamp: new Date().toISOString(),
        })

        return true
      },

      rejectFriendRequest: async (requestId: string) => {
        const { incomingRequests } = get()

        if (isSupabaseConfigured) {
          try {
            const user = await getCurrentUser()
            if (!user) return false

            // Try RPC first
            const { error: rpcError } = await supabase.rpc('reject_friend_request', { request_id: requestId })

            if (rpcError) {
              // Fallback: direct delete
              const { error } = await supabase
                .from('friend_requests')
                .delete()
                .eq('id', requestId)
                .eq('to_user_id', user.id)

              if (error) throw error
            }

            set({ incomingRequests: incomingRequests.filter(r => r.id !== requestId) })
            return true
          } catch (err: any) {
            set({ syncError: err.message || 'Ошибка отклонения запроса' })
            return false
          }
        }

        set({ incomingRequests: incomingRequests.filter(r => r.id !== requestId) })
        return true
      },

      removeFriend: async (friendId: string) => {
        const { friends } = get()

        if (isSupabaseConfigured) {
          try {
            const user = await getCurrentUser()
            if (!user) return false

            // Delete both directions of the friendship
            const { error: e1 } = await supabase
              .from('friends')
              .delete()
              .eq('user_id', user.id)
              .eq('friend_id', friendId)

            const { error: e2 } = await supabase
              .from('friends')
              .delete()
              .eq('user_id', friendId)
              .eq('friend_id', user.id)

            if (e1 && !e1.message?.includes('0 rows')) throw e1
            if (e2 && !e2.message?.includes('0 rows')) throw e2

            set({ friends: friends.filter(f => f.id !== friendId) })
            return true
          } catch (err: any) {
            set({ syncError: err.message || 'Ошибка удаления друга' })
            return false
          }
        }

        set({ friends: friends.filter(f => f.id !== friendId) })
        return true
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
