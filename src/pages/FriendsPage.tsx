import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, UserPlus, Search, Heart, Trophy, Flame, Zap, X, Check, Users, Activity, Gift, Copy } from 'lucide-react'
import { useFriendStore } from '../stores/friendStore'
import { useProgressStore } from '../stores/progressStore'

export function FriendsPage() {
  const navigate = useNavigate()
  const friends = useFriendStore((s) => s.friends)
  const incomingRequests = useFriendStore((s) => s.incomingRequests)
  const activities = useFriendStore((s) => s.getActivities(20))
  const sendFriendRequest = useFriendStore((s) => s.sendFriendRequest)
  const acceptFriendRequest = useFriendStore((s) => s.acceptFriendRequest)
  const rejectFriendRequest = useFriendStore((s) => s.rejectFriendRequest)
  const removeFriend = useFriendStore((s) => s.removeFriend)
  const canSendHearts = useFriendStore((s) => s.canSendHearts)
  const sendHeart = useFriendStore((s) => s.sendHeart)

  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'activity'>('friends')
  const [copied, setCopied] = useState(false)

  const stats = useProgressStore((s) => s.userStats)
  const myUserId = useProgressStore((s) => s.userId)
  const myProgress = {
    level: stats.level,
    xp: stats.xp,
    streak: stats.streak,
    completedLessons: Object.values(useProgressStore.getState().lessonProgress).filter((l: any) => l.status === 'completed').length,
  }

  const handleCopyId = async () => {
    if (!myUserId) return
    try {
      await navigator.clipboard.writeText(myUserId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = myUserId
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const filteredFriends = friends.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddFriend = () => {
    const id = prompt('Введите ID друга:')
    if (id) {
      const success = sendFriendRequest(id, 'Новый друг', '👤')
      if (success) {
        alert('Запрос отправлен!')
      } else {
        alert('Уже в друзьях или запрос уже отправлен.')
      }
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-4 min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-800">Друзья</h1>
          <p className="text-xs text-gray-500">{friends.length} друзей</p>
        </div>
        <button 
          onClick={handleAddFriend}
          className="p-2 bg-duo-green rounded-lg text-white hover:bg-duo-green-dark transition-colors"
        >
          <UserPlus size={20} />
        </button>
      </div>

      {/* My stats mini */}
      <div className="bg-gradient-to-r from-duo-green/10 to-emerald-50 rounded-2xl p-3 mb-4 border border-duo-green/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">😊</span>
            <div>
              <p className="font-bold text-sm text-gray-800">{stats.name || 'Я'}</p>
              <p className="text-xs text-gray-500">Уровень {myProgress.level}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1 text-orange-500"><Flame size={14} /> {myProgress.streak}</span>
            <span className="flex items-center gap-1 text-duo-yellow"><Zap size={14} /> {myProgress.xp}</span>
          </div>
        </div>
      </div>

      {/* My ID card */}
      <div className="bg-white rounded-2xl p-3 mb-4 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Твой ID (поделись с другом):</p>
            <p className="font-mono font-bold text-sm text-gray-800 tracking-wider">{myUserId || '—'}</p>
          </div>
          <button
            onClick={handleCopyId}
            disabled={!myUserId}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              copied
                ? 'bg-duo-green text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Скопировано!' : 'Копировать'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-4">
        {[
          { id: 'friends', label: 'Друзья', count: friends.length },
          { id: 'requests', label: 'Запросы', count: incomingRequests.length },
          { id: 'activity', label: 'Активность', count: 0 },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === tab.id ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-1 bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'friends' && (
          <motion.div
            key="friends"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex-1 flex flex-col gap-2"
          >
            {/* Search */}
            <div className="relative mb-2">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск друзей..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-duo-green"
              />
            </div>

            {filteredFriends.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
                <Users size={48} className="text-gray-200" />
                <p className="text-gray-400 text-sm">У вас пока нет друзей</p>
                <button onClick={handleAddFriend} className="btn-primary text-sm">
                  <UserPlus size={16} /> Добавить друга
                </button>
              </div>
            ) : (
              filteredFriends.map(friend => (
                <motion.div
                  key={friend.id}
                  className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-duo-blue/10 flex items-center justify-center text-lg">
                      {friend.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-gray-800 truncate">{friend.name}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="flex items-center gap-0.5"><Flame size={12} className="text-orange-500" /> {friend.streak}</span>
                        <span className="flex items-center gap-0.5"><Zap size={12} className="text-duo-yellow" /> {friend.xp}</span>
                        <span className="flex items-center gap-0.5"><Trophy size={12} className="text-duo-purple" /> {friend.achievementsCount}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {canSendHearts(friend.id) ? (
                        <button
                          onClick={() => sendHeart(friend.id)}
                          className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                          title="Отправить сердечко"
                        >
                          <Heart size={16} fill="currentColor" />
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 p-2">❤️</span>
                      )}
                      <button
                        onClick={() => {
                          if (confirm(`Удалить ${friend.name} из друзей?`)) {
                            removeFriend(friend.id)
                          }
                        }}
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                  {/* Progress comparison bar */}
                  <div className="mt-2">
                    <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                      <span>Уровень</span>
                      <span>{friend.level} vs {myProgress.level}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div 
                        className="h-full rounded-full bg-duo-green transition-all" 
                        style={{ width: `${Math.min((friend.level / Math.max(friend.level, myProgress.level, 1)) * 100, 100)}%` }} 
                      />
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {activeTab === 'requests' && (
          <motion.div
            key="requests"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex-1 flex flex-col gap-2"
          >
            {incomingRequests.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
                <UserPlus size={48} className="text-gray-200" />
                <p className="text-gray-400 text-sm">Нет входящих запросов</p>
              </div>
            ) : (
              incomingRequests.map(req => (
                <div key={req.id} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-duo-yellow/10 flex items-center justify-center text-lg">
                      {req.fromEmoji}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm text-gray-800">{req.fromName}</p>
                      <p className="text-xs text-gray-500">Хочет добавить вас в друзья</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => rejectFriendRequest(req.id)}
                        className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                      >
                        <X size={16} />
                      </button>
                      <button
                        onClick={() => acceptFriendRequest(req.id)}
                        className="p-2 rounded-full bg-duo-green text-white hover:bg-duo-green-dark transition-colors"
                      >
                        <Check size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}

        {activeTab === 'activity' && (
          <motion.div
            key="activity"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex-1 flex flex-col gap-2"
          >
            {activities.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
                <Activity size={48} className="text-gray-200" />
                <p className="text-gray-400 text-sm">Пока нет активности</p>
              </div>
            ) : (
              activities.map(act => (
                <div key={act.id} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-duo-blue/10 flex items-center justify-center text-lg">
                    {act.friendEmoji}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">
                      <span className="font-bold">{act.friendName}</span> {act.description}
                    </p>
                    <p className="text-xs text-gray-400">{new Date(act.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  {act.xp && (
                    <span className="text-xs font-bold text-duo-yellow">+{act.xp} XP</span>
                  )}
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
