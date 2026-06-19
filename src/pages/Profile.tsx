import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, User, Trophy, Flame, Star, Heart, Zap, Trash2, Download, Upload, Bell, ChevronRight, BookOpen, Users, Volume2, VolumeX, Moon, Sun, Bot, CheckCircle, AlertTriangle, XCircle, Loader2 } from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'
import { useFirebaseStore } from '../stores/firebaseStore'
import { useSettingsStore } from '../stores/settingsStore'
import { useChatStore } from '../stores/chatStore'
import { SyncStatus } from '../components/SyncStatus'
import { achievements as allAchievements, getAchievementProgress } from '../data/achievements'
import { getAchievementIcon } from '../data/achievementIcons'
import { getUnlockedStatuses, getStatusById } from '../data/statuses'
import { Popover } from '../components/Popover'
import { useNotificationStore } from '../stores/notificationStore'
import { useStudentStore } from '../stores/studentStore'
import { useClassStore } from '../stores/classStore'
import { useStudyPlanStore } from '../stores/studyPlanStore'
import { getPlayerTypeLabel, getPlayerTypeDescription, getPlayerTypeIcon, getPlayerTypeColor, type PlayerType } from '../utils/personalityEngine'

function AIAssistantSection() {
  const apiKey = useChatStore((s) => s.apiKey)
  const provider = useChatStore((s) => s.provider)
  const apiEndpoint = useChatStore((s) => s.apiEndpoint)
  const connectionStatus = useChatStore((s) => s.connectionStatus)
  const setApiKey = useChatStore((s) => s.setApiKey)
  const setProvider = useChatStore((s) => s.setProvider)
  const setEndpoint = useChatStore((s) => s.setEndpoint)
  const checkConnection = useChatStore((s) => s.checkConnection)
  const clearMessages = useChatStore((s) => s.clearMessages)

  const [localKey, setLocalKey] = useState(apiKey || '')
  const [localEndpoint, setLocalEndpoint] = useState(apiEndpoint)
  const [showCustom, setShowCustom] = useState(provider === 'custom')

  useEffect(() => {
    setLocalKey(apiKey || '')
  }, [apiKey])

  useEffect(() => {
    setLocalEndpoint(apiEndpoint)
  }, [apiEndpoint])

  const handleSaveKey = () => {
    setApiKey(localKey)
  }

  const handleProviderChange = (p: 'kimi' | 'openai' | 'custom') => {
    setProvider(p)
    setShowCustom(p === 'custom')
    if (p !== 'custom') {
      setLocalEndpoint('')
    }
  }

  const statusConfig = {
    unknown: { icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-50', label: 'Не проверено' },
    checking: { icon: Loader2, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Проверка...' },
    connected: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50', label: 'Работает' },
    error: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', label: 'Ошибка соединения' },
    no_key: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', label: 'Нет ключа' },
  }

  const StatusIcon = statusConfig[connectionStatus].icon

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-duo-purple to-duo-blue flex items-center justify-center text-white">
          <Bot size={20} />
        </div>
        <div>
          <h3 className="font-bold text-gray-700">AI-ассистент</h3>
          <p className="text-xs text-gray-500">Настройка API ключа для AI-репетитора</p>
        </div>
      </div>

      {/* Provider selector */}
      <div className="mb-3">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Провайдер</label>
        <div className="flex gap-2">
          {(['kimi', 'openai', 'custom'] as const).map((p) => (
            <button
              key={p}
              onClick={() => handleProviderChange(p)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${
                provider === p
                  ? 'bg-duo-purple text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {p === 'kimi' ? 'Kimi' : p === 'openai' ? 'OpenAI' : 'Custom'}
            </button>
          ))}
        </div>
      </div>

      {/* API Key */}
      <div className="mb-3">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">API ключ</label>
        <div className="flex gap-2">
          <input
            type="password"
            value={localKey}
            onChange={(e) => setLocalKey(e.target.value)}
            placeholder="sk-..."
            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-duo-purple/30"
          />
          <button
            onClick={handleSaveKey}
            className="px-3 py-2 bg-duo-green text-white rounded-lg text-xs font-bold hover:bg-duo-green/90 transition-colors"
          >
            Сохранить
          </button>
        </div>
      </div>

      {/* Custom endpoint */}
      {showCustom && (
        <div className="mb-3">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Endpoint URL</label>
          <input
            type="text"
            value={localEndpoint}
            onChange={(e) => {
              setLocalEndpoint(e.target.value)
              setEndpoint(e.target.value)
            }}
            placeholder="https://api.example.com/v1/chat/completions"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-duo-purple/30"
          />
        </div>
      )}

      {/* Status */}
      <div className={`flex items-center gap-2 p-2.5 rounded-lg ${statusConfig[connectionStatus].bg} mb-3`}>
        <StatusIcon size={16} className={`${statusConfig[connectionStatus].color} ${connectionStatus === 'checking' ? 'animate-spin' : ''}`} />
        <span className={`text-xs font-bold ${statusConfig[connectionStatus].color}`}>
          {statusConfig[connectionStatus].label}
        </span>
      </div>

      {/* Check button */}
      <button
        onClick={checkConnection}
        disabled={connectionStatus === 'checking' || !apiKey}
        className={`w-full py-2 rounded-lg font-bold text-sm transition-colors mb-3 ${
          !apiKey || connectionStatus === 'checking'
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-duo-purple text-white hover:bg-duo-purple/90'
        }`}
      >
        {connectionStatus === 'checking' ? 'Проверка...' : 'Проверить соединение'}
      </button>

      {/* Clear history */}
      <button
        onClick={() => {
          if (confirm('Очистить историю чата? Это действие нельзя отменить.')) {
            clearMessages()
          }
        }}
        className="w-full py-2 rounded-lg font-bold text-sm border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
      >
        Очистить историю чата
      </button>

      <p className="text-[10px] text-gray-400 mt-3 text-center">
        Введите свой API ключ. Данные не передаются третьим лицам. Ключ хранится только на вашем устройстве.
      </p>
    </div>
  )
}

export function Profile() {
  const navigate = useNavigate()
  const stats = useProgressStore((s) => s.userStats)
  const lessonProgress = useProgressStore((s) => s.lessonProgress)
  const achievements = useProgressStore((s) => s.achievements)
  const setUserName = useProgressStore((s) => s.setUserName)
  const toggleInfiniteHearts = useProgressStore((s) => s.toggleInfiniteHearts)
  const incrementExportCount = useProgressStore((s) => s.incrementExportCount)
  const importProgress = useProgressStore((s) => s.importProgress)
  const setActiveStatus = useProgressStore((s) => s.setActiveStatus)
  const leaderboardRanks = useProgressStore((s) => s.leaderboardRanks)
  const name = useProgressStore((s) => s.userStats.name || 'ученик')
  const activeStatusId = useProgressStore((s) => s.userStats.activeStatus)
  const isOnline = useFirebaseStore((s) => s.isOnline)
  const lastSync = useFirebaseStore((s) => s.lastSync)
  const playerProfile = useProgressStore((s) => s.getPlayerProfile())
  const setPlayerProfile = useProgressStore((s) => s.setPlayerProfile)

  // Settings
  const soundEnabled = useSettingsStore((s) => s.soundEnabled)
  const toggleSound = useSettingsStore((s) => s.toggleSound)
  const theme = useSettingsStore((s) => s.theme)
  const setTheme = useSettingsStore((s) => s.setTheme)

  const [isEditing, setIsEditing] = useState(false)
  const [showStatusPicker, setShowStatusPicker] = useState(false)
  const [showNotificationSettings, setShowNotificationSettings] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)

  // Notification settings
  const notifSettings = useNotificationStore((s) => s.settings)
  const updateNotifSettings = useNotificationStore((s) => s.updateSettings)
  const requestPermission = useNotificationStore((s) => s.requestPermission)
  const permission = useNotificationStore((s) => s.permission)

  const completedLessons = Object.values(lessonProgress).filter(l => l.status === 'completed').length
  const unlockedStatuses = getUnlockedStatuses(achievements, leaderboardRanks)
  const activeStatus = getStatusById(activeStatusId || '') || unlockedStatuses[0]
  const totalQuestions = Object.values(lessonProgress).reduce((sum, lp) => sum + (lp.attempts || 0), 0)
  const bestScore = Object.values(lessonProgress).reduce((max, lp) => Math.max(max, lp.bestScore || 0), 0)

  const [showAllAchievements, setShowAllAchievements] = useState(false)

  const handleNameSave = () => {
    const newName = nameRef.current?.value.trim()
    if (newName) {
      setUserName(newName)
    }
    setIsEditing(false)
  }

  const handleReset = () => {
    if (confirm('Весь прогресс будет удалён безвозвратно. Продолжить?')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  const handleExport = () => {
    incrementExportCount()
    const data = {
      version: 2,
      exportedAt: new Date().toISOString(),
      progress: {
        userStats: stats,
        lessonProgress,
        achievements,
        atomProgress: useProgressStore.getState().atomProgress,
        wrongAnswers: useProgressStore.getState().wrongAnswers,
        taskStats: useProgressStore.getState().taskStats,
        dailyQuestProgress: useProgressStore.getState().dailyQuestProgress,
        theoryTestsCompleted: useProgressStore.getState().theoryTestsCompleted,
        examResults: useProgressStore.getState().examResults,
        leaderboard: useProgressStore.getState().leaderboard,
        leaderboardRanks: useProgressStore.getState().leaderboardRanks,
        isTeacher: useProgressStore.getState().isTeacher,
        userId: useProgressStore.getState().userId,
      },
      student: {
        profiles: useStudentStore.getState().profiles,
        activeProfileId: useStudentStore.getState().activeProfileId,
      },
      classStore: {
        classes: useClassStore.getState().classes,
        activeClassId: useClassStore.getState().activeClassId,
      },
      studyPlan: useStudyPlanStore.getState(),
      settings: {
        soundEnabled,
        theme,
      },
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ege-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      try {
        const parsed = JSON.parse(content)
        
        // Full backup (v2)
        if (parsed.version === 2) {
          // Import progress store
          if (parsed.progress) {
            const progress = parsed.progress
            useProgressStore.setState((s: any) => ({
              ...s,
              userStats: { ...s.userStats, ...progress.userStats },
              lessonProgress: { ...s.lessonProgress, ...progress.lessonProgress },
              achievements: [...new Set([...s.achievements, ...(progress.achievements || [])])],
              atomProgress: { ...s.atomProgress, ...(progress.atomProgress || {}) },
              wrongAnswers: [...s.wrongAnswers, ...(progress.wrongAnswers || [])],
              taskStats: { ...s.taskStats, ...(progress.taskStats || {}) },
              dailyQuestProgress: { ...s.dailyQuestProgress, ...(progress.dailyQuestProgress || {}) },
              theoryTestsCompleted: { ...s.theoryTestsCompleted, ...(progress.theoryTestsCompleted || {}) },
              examResults: [...s.examResults, ...(progress.examResults || [])],
              leaderboard: progress.leaderboard || s.leaderboard,
              leaderboardRanks: progress.leaderboardRanks || s.leaderboardRanks,
              isTeacher: progress.isTeacher ?? s.isTeacher,
              userId: progress.userId ?? s.userId,
            }))
          }
          // Import student store
          if (parsed.student) {
            useStudentStore.setState((s: any) => ({
              ...s,
              profiles: parsed.student.profiles || s.profiles,
              activeProfileId: parsed.student.activeProfileId ?? s.activeProfileId,
            }))
          }
          // Import class store
          if (parsed.classStore) {
            useClassStore.setState((s: any) => ({
              ...s,
              classes: { ...s.classes, ...(parsed.classStore.classes || {}) },
              activeClassId: parsed.classStore.activeClassId ?? s.activeClassId,
            }))
          }
          // Import study plan
          if (parsed.studyPlan) {
            useStudyPlanStore.setState((s: any) => ({
              ...s,
              plan: parsed.studyPlan.plan ?? s.plan,
              examDate: parsed.studyPlan.examDate ?? s.examDate,
              targetScore: parsed.studyPlan.targetScore ?? s.targetScore,
            }))
          }
          // Import settings
          if (parsed.settings) {
            useSettingsStore.setState((s: any) => ({
              ...s,
              soundEnabled: parsed.settings.soundEnabled ?? s.soundEnabled,
              theme: parsed.settings.theme ?? s.theme,
            }))
          }
          alert('Прогресс успешно импортирован!')
          window.location.reload()
          return
        }
        
        // Legacy v1 import (old format)
        const result = importProgress(content)
        alert(result.message)
        if (result.success) {
          window.location.reload()
        }
      } catch (err) {
        alert('Ошибка чтения файла: ' + (err as Error).message)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Профиль</h1>
      </div>

      {/* Avatar + Name */}
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-duo-green flex items-center justify-center text-white">
          <User size={40} />
        </div>
        {isEditing ? (
          <div className="flex items-center justify-center gap-2">
            <input
              ref={nameRef}
              defaultValue={name}
              autoFocus
              className="border-2 border-duo-green rounded-lg px-3 py-1 text-center font-bold text-gray-800 focus:outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
            />
            <button onClick={handleNameSave} className="text-duo-green font-bold text-sm">OK</button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-xl font-bold text-gray-800">{name}</h2>
            <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-gray-600 text-sm">
              ✎
            </button>
          </div>
        )}
        <p className="text-gray-500 text-sm">Уровень {stats.level}</p>
        
        {/* Active Status */}
        <motion.button
          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold text-white"
          style={{ backgroundColor: activeStatus.color }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowStatusPicker(!showStatusPicker)}
        >
          <span>{activeStatus.emoji}</span>
          <span>{activeStatus.name}</span>
        </motion.button>
        <p className="text-xs text-gray-400 mt-1">{activeStatus.description}</p>

        {/* Status picker */}
        {showStatusPicker && (
          <motion.div
            className="mt-3 flex flex-wrap gap-2 justify-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {unlockedStatuses.map(status => (
              <button
                key={status.id}
                onClick={() => {
                  setActiveStatus(status.id)
                  setShowStatusPicker(false)
                }}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold transition-all ${
                  activeStatusId === status.id 
                    ? 'ring-2 ring-offset-1' 
                    : 'opacity-70 hover:opacity-100'
                }`}
                style={{ 
                  backgroundColor: status.color + '20', 
                  color: status.color,
                  '--tw-ring-color': status.color 
                } as React.CSSProperties}
              >
                <span>{status.emoji}</span>
                <span>{status.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Stats Grid — animated icons */}
      <style>{`
        @keyframes xp-bounce { 0%,100%{transform:scale(1) rotate(0deg)} 20%{transform:scale(1.2) rotate(-5deg)} 40%{transform:scale(0.9) rotate(3deg)} 60%{transform:scale(1.15) rotate(-2deg)} 80%{transform:scale(1) rotate(1deg)} }
        @keyframes flame-flicker { 0%,100%{transform:scale(1);opacity:1} 25%{transform:scale(1.12);opacity:0.8} 50%{transform:scale(0.95);opacity:1} 75%{transform:scale(1.08);opacity:0.9} }
        @keyframes heart-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
        @keyframes trophy-shine { 0%{transform:translateX(-100%) rotate(45deg)} 100%{transform:translateX(200%) rotate(45deg)} }
        @keyframes trophy-glow { 0%,100%{filter:brightness(1)} 50%{filter:brightness(1.25)} }
      `}</style>
      <div className="grid grid-cols-2 gap-3">
        <div className="card flex items-center gap-3">
          <div className="relative">
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-[xp-bounce_1.5s_infinite]" style={{ animationDelay: '0s', opacity: 0.8 }} />
            <div className="absolute -bottom-0.5 -left-1 w-1.5 h-1.5 bg-orange-400 rounded-full animate-[xp-bounce_1.5s_infinite]" style={{ animationDelay: '0.3s', opacity: 0.6 }} />
            <Zap size={20} className="text-duo-yellow animate-[xp-bounce_2s_ease-in-out_infinite]" />
          </div>
          <div>
            <p className="text-lg font-bold">{stats.xp}</p>
            <p className="text-xs text-gray-500">XP</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="relative">
            <Flame size={20} className="text-orange-500 animate-[flame-flicker_1.2s_ease-in-out_infinite]" />
          </div>
          <div>
            <p className="text-lg font-bold">{stats.streak}</p>
            <p className="text-xs text-gray-500">Дней подряд</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="relative">
            <Heart size={20} className="text-red-500 animate-[heart-float_1.5s_ease-in-out_infinite]" />
          </div>
          <div>
            <p className="text-lg font-bold">{stats.hearts}/{stats.maxHearts}</p>
            <p className="text-xs text-gray-500">Сердечки</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-white/30 w-3 h-full animate-[trophy-shine_2.5s_ease-in-out_infinite]" style={{ transform: 'translateX(-100%) rotate(45deg)' }} />
            <Trophy size={20} className="text-duo-purple animate-[trophy-glow_2s_ease-in-out_infinite]" />
          </div>
          <div>
            <p className="text-lg font-bold">{stats.maxStreak}</p>
            <p className="text-xs text-gray-500">Рекорд</p>
          </div>
        </div>
      </div>

      {/* Personality Type Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-700">Мой тип личности</h3>
          <button
            onClick={() => navigate('/personality-quiz')}
            className="text-xs text-duo-blue font-bold hover:underline"
          >
            {playerProfile ? 'Изменить' : 'Пройти тест'}
          </button>
        </div>
        {playerProfile ? (
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold shrink-0"
              style={{ backgroundColor: getPlayerTypeColor(playerProfile.type) }}
            >
              {getPlayerTypeIcon(playerProfile.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-800">{getPlayerTypeLabel(playerProfile.type)}</p>
              <p className="text-xs text-gray-500">{getPlayerTypeDescription(playerProfile.type)}</p>
              <div className="flex gap-2 mt-1.5 flex-wrap">
                {(Object.entries(playerProfile.scores) as [PlayerType, number][])
                  .sort((a, b) => b[1] - a[1])
                  .map(([type, score]) => (
                    <span
                      key={type}
                      className="text-[10px] px-2 py-0.5 rounded-full font-bold text-white"
                      style={{ backgroundColor: getPlayerTypeColor(type) + 'CC' }}
                    >
                      {getPlayerTypeLabel(type)} {score}%
                    </span>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500 mb-2">Пройди короткий тест, чтобы узнать свой тип!</p>
            <button
              onClick={() => navigate('/personality-quiz')}
              className="px-4 py-2 bg-duo-green text-white rounded-xl text-sm font-bold hover:bg-duo-green/90 transition-colors"
            >
              Пройти тест
            </button>
          </div>
        )}
      </div>

      {/* My Homework button */}
      <button
        onClick={() => navigate('/my-homework')}
        className="card flex items-center justify-between text-left hover:bg-duo-blue/5 transition-colors border-duo-blue/20"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-duo-blue/20 flex items-center justify-center">
            <BookOpen size={20} className="text-duo-blue" />
          </div>
          <div>
            <p className="font-bold text-sm text-gray-800">Мои домашки</p>
            <p className="text-xs text-gray-500">Посмотреть задания из Google Sheets</p>
          </div>
        </div>
        <ChevronRight size={20} className="text-gray-400" />
      </button>

      {/* Infinite Hearts Toggle - moved up for visibility */}
      <div className="card flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Heart size={20} className="text-red-500" />
          <div>
            <p className="font-bold text-sm text-gray-800">Бесконечные сердечки</p>
            <p className="text-xs text-gray-500">Не терять жизни при ошибках</p>
          </div>
        </div>
        <button
          onClick={toggleInfiniteHearts}
          className={`w-12 h-6 rounded-full transition-colors relative ${
            stats.infiniteHearts ? 'bg-duo-green' : 'bg-gray-300'
          }`}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
              stats.infiniteHearts ? 'translate-x-6' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>

      {/* Sound Toggle */}
      <div className="card flex items-center justify-between">
        <div className="flex items-center gap-3">
          {soundEnabled ? <Volume2 size={20} className="text-duo-blue" /> : <VolumeX size={20} className="text-gray-400" />}
          <div>
            <p className="font-bold text-sm text-gray-800">Звуковые эффекты</p>
            <p className="text-xs text-gray-500">{soundEnabled ? 'Включены' : 'Отключены'}</p>
          </div>
        </div>
        <button
          onClick={toggleSound}
          className={`w-12 h-6 rounded-full transition-colors relative ${
            soundEnabled ? 'bg-duo-green' : 'bg-gray-300'
          }`}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
              soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>

      {/* Theme Toggle */}
      <div className="card flex items-center justify-between">
        <div className="flex items-center gap-3">
          {theme === 'dark' ? <Moon size={20} className="text-duo-purple" /> : <Sun size={20} className="text-duo-yellow" />}
          <div>
            <p className="font-bold text-sm text-gray-800">Тема</p>
            <p className="text-xs text-gray-500">
              {theme === 'dark' ? 'Тёмная' : theme === 'light' ? 'Светлая' : 'Системная'}
            </p>
          </div>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {(['light', 'dark', 'system'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`px-2 py-1 rounded-md text-xs font-bold transition-colors ${
                theme === t
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t === 'light' ? '☀️' : t === 'dark' ? '🌙' : '💻'}
            </button>
          ))}
        </div>
      </div>

      {/* Progress details */}
      <div className="card">
        <h3 className="font-bold text-gray-700 mb-3">Прогресс</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Уроков пройдено</span><span className="font-bold">{completedLessons}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Всего попыток</span><span className="font-bold">{totalQuestions}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Лучший результат</span><span className="font-bold">{bestScore}%</span></div>
        </div>
      </div>

      {/* Cloud sync section */}
      <div className="card">
        <h3 className="font-bold text-gray-700 mb-3">Облачная синхронизация</h3>
        <div className="flex items-center gap-2 mb-3">
          <SyncStatus />
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Статус</span>
            <span className="font-bold">
              {isOnline ? 'Онлайн' : 'Оффлайн'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Последний sync</span>
            <span className="font-bold">
              {lastSync ? new Date(lastSync).toLocaleString('ru-RU') : '—'}
            </span>
          </div>
        </div>
        <button
          onClick={() => {
            const store = useFirebaseStore.getState()
            if (store.isOnline) {
              store.syncProgress().then(() => {
                alert('Прогресс синхронизирован!')
              }).catch(() => {
                alert('Ошибка синхронизации')
              })
            } else {
              alert('Нет подключения к интернету')
            }
          }}
          className="mt-3 w-full py-2 bg-duo-green text-white rounded-lg font-bold text-sm hover:bg-duo-green/90 transition-colors"
        >
          Синхронизировать сейчас
        </button>
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800">
          ⚠️ Войдите, чтобы не потерять прогресс на других устройствах
        </div>
      </div>

      {/* AI Assistant Section */}
      <AIAssistantSection />

      {/* Achievements with popover */}
      <Popover
        position="top"
        content={
          <div className="space-y-3 max-h-80 overflow-y-auto">
            <p className="font-bold text-white">🏆 Достижения: {achievements.length} / {allAchievements.length}</p>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-duo-green h-2 rounded-full" 
                style={{ width: `${(achievements.length / allAchievements.length) * 100}%` }}
              />
            </div>
            
            {achievements.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs text-gray-400">Собранные:</p>
                {allAchievements
                  .filter(ach => achievements.includes(ach.id))
                  .map(ach => {
                    const Icon = getAchievementIcon(ach.id)
                    return (
                      <div key={ach.id} className="flex items-center gap-2 bg-gray-800 rounded-lg p-2">
                        <div className="w-8 h-8 rounded-full bg-duo-green/20 flex items-center justify-center">
                          <Icon size={16} className="text-duo-green" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{ach.title}</p>
                          <p className="text-xs text-gray-400">{ach.description}</p>
                        </div>
                      </div>
                    )
                  })}
              </div>
            ) : (
              <p className="text-xs text-gray-400">Пока нет достижений. Продолжай учиться!</p>
            )}
            
            {allAchievements.filter(ach => !achievements.includes(ach.id)).length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-400">Осталось:</p>
                {allAchievements
                  .filter(ach => !achievements.includes(ach.id))
                  .slice(0, 5)
                  .map(ach => {
                    const Icon = getAchievementIcon(ach.id)
                    const progress = getAchievementProgress(ach.id, stats, lessonProgress)
                    const pct = progress.target > 1 ? Math.min(100, Math.round((progress.current / progress.target) * 100)) : 0
                    return (
                      <div key={ach.id} className="flex items-center gap-2 bg-gray-800/50 rounded-lg p-2 opacity-50">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                          <Icon size={16} className="text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-400">{ach.title}</p>
                          {progress.target > 1 && (
                            <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
                              <div className="bg-gray-500 h-1 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                {allAchievements.filter(ach => !achievements.includes(ach.id)).length > 5 && (
                  <p className="text-xs text-gray-500 text-center">
                    +{allAchievements.filter(ach => !achievements.includes(ach.id)).length - 5} ещё...
                  </p>
                )}
              </div>
            )}
          </div>
        }
      >
        <div className="card cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-700">Достижения</h3>
            <span className="text-sm font-bold text-duo-green">{achievements.length}/{allAchievements.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
            <div 
              className="bg-duo-green h-2.5 rounded-full transition-all"
              style={{ width: `${(achievements.length / allAchievements.length) * 100}%` }}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {allAchievements
              .filter(ach => achievements.includes(ach.id))
              .slice(0, 6)
              .map(ach => {
                const Icon = getAchievementIcon(ach.id)
                return (
                  <div key={ach.id} className="w-9 h-9 rounded-full bg-duo-green/10 flex items-center justify-center">
                    <Icon size={18} className="text-duo-green" />
                  </div>
                )
              })}
            {achievements.length > 6 && (
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-500">+{achievements.length - 6}</span>
              </div>
            )}
            {achievements.length === 0 && (
              <p className="text-xs text-gray-400">Нет достижений</p>
            )}
          </div>
        </div>
      </Popover>

      {/* Full achievement list — collapsible */}
      <div className="card">
        <button
          onClick={() => setShowAllAchievements(!showAllAchievements)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <Trophy size={20} className="text-duo-purple" />
            <div>
              <p className="font-bold text-sm text-gray-800">Все достижения</p>
              <p className="text-xs text-gray-500">
                {achievements.length} из {allAchievements.length} разблокировано
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div
                className="bg-duo-green h-2 rounded-full"
                style={{ width: `${(achievements.length / allAchievements.length) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 transition-transform duration-200">
              {showAllAchievements ? '▲' : '▼'}
            </span>
          </div>
        </button>

        {showAllAchievements && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 flex flex-col gap-2 max-h-80 overflow-y-auto pr-1"
          >
            {[...allAchievements]
              .sort((a, b) => {
                const aUnlocked = achievements.includes(a.id)
                const bUnlocked = achievements.includes(b.id)
                if (aUnlocked && !bUnlocked) return 1
                if (!aUnlocked && bUnlocked) return -1
                const aProgress = getAchievementProgress(a.id, stats, lessonProgress)
                const bProgress = getAchievementProgress(b.id, stats, lessonProgress)
                const aPct = aProgress.target > 1 ? (aProgress.current / aProgress.target) * 100 : 0
                const bPct = bProgress.target > 1 ? (bProgress.current / bProgress.target) * 100 : 0
                return bPct - aPct
              })
              .map((ach) => {
                const unlocked = achievements.includes(ach.id)
                const Icon = getAchievementIcon(ach.id)
                const progress = getAchievementProgress(ach.id, stats, lessonProgress)
                const hasProgress = progress.target > 1
                const percent = hasProgress ? Math.min(100, Math.round((progress.current / progress.target) * 100)) : 0
                // Цветовой статус по прогрессу
                const colorTier = unlocked ? 'green' : percent > 50 ? 'yellow' : percent > 10 ? 'orange' : 'gray'
                const tierColors = {
                  green: { border: 'border-duo-green/30', bg: 'bg-green-50', accent: 'bg-duo-green', icon: 'bg-duo-green text-white', text: 'text-gray-700' },
                  yellow: { border: 'border-duo-yellow/40', bg: 'bg-yellow-50', accent: 'bg-duo-yellow', icon: 'bg-yellow-100 text-yellow-600', text: 'text-gray-700' },
                  orange: { border: 'border-orange-300/40', bg: 'bg-orange-50', accent: 'bg-orange-400', icon: 'bg-orange-100 text-orange-500', text: 'text-gray-700' },
                  gray: { border: 'border-gray-200', bg: 'bg-white', accent: 'bg-gray-300', icon: 'bg-gray-100 text-gray-400', text: 'text-gray-400' },
                }
                const tc = tierColors[colorTier]
                return (
                  <div key={ach.id} className={`flex flex-col gap-1 p-2 rounded-lg transition-all border-l-4 border ${tc.border} ${tc.bg}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 ${tc.icon}`}>
                        <Icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-bold text-sm truncate ${tc.text}`}>{ach.title}</p>
                        <p className="text-xs text-gray-400 truncate">{ach.description}</p>
                      </div>
                      {unlocked ? (
                        <Star size={16} className="text-duo-yellow shrink-0" />
                      ) : (
                        <span className={`text-xs font-bold shrink-0 ${colorTier === 'gray' ? 'text-gray-300' : 'text-gray-500'}`}>{percent}%</span>
                      )}
                    </div>
                    {!unlocked && hasProgress && (
                      <div className="ml-11">
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div className={`${tc.accent} h-1.5 rounded-full`} style={{ width: `${percent}%` }} />
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{progress.current} / {progress.target}</p>
                      </div>
                    )}
                  </div>
                )
              })}
          </motion.div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <button onClick={() => navigate('/parent')} className="card flex items-center gap-3 text-left hover:bg-gray-50 transition-colors">
          <Users size={20} className="text-duo-green" />
          <div>
            <p className="font-bold text-sm">Родительский кабинет</p>
            <p className="text-xs text-gray-500">Прогресс ученика</p>
          </div>
        </button>
        <button onClick={handleExport} className="card flex items-center gap-3 text-left hover:bg-gray-50 transition-colors">
          <Download size={20} className="text-duo-blue" />
          <div>
            <p className="font-bold text-sm">Экспорт прогресса</p>
            <p className="text-xs text-gray-500">Сохранить JSON-файл</p>
          </div>
        </button>
        <button onClick={() => setShowNotificationSettings(true)} className="card flex items-center gap-3 text-left hover:bg-gray-50 transition-colors">
          <Bell size={20} className="text-duo-green" />
          <div>
            <p className="font-bold text-sm">Уведомления</p>
            <p className="text-xs text-gray-500">Настройка push и дедлайнов</p>
          </div>
        </button>
        <button onClick={handleImportClick} className="card flex items-center gap-3 text-left hover:bg-gray-50 transition-colors">
          <Upload size={20} className="text-duo-green" />
          <div>
            <p className="font-bold text-sm">Импорт прогресса</p>
            <p className="text-xs text-gray-500">Загрузить JSON-файл</p>
          </div>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
        <button onClick={handleReset} className="card flex items-center gap-3 text-left hover:bg-red-50 transition-colors border-red-200">
          <Trash2 size={20} className="text-red-500" />
          <div>
            <p className="font-bold text-sm text-red-600">Сбросить прогресс</p>
            <p className="text-xs text-gray-500">Удалить все данные</p>
          </div>
        </button>
      </div>

      {/* Notification Settings Modal */}
      {showNotificationSettings && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowNotificationSettings(false)}
        >
          <motion.div
            className="bg-white rounded-t-2xl sm:rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
            initial={{ y: 300 }}
            animate={{ y: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Уведомления</h3>
              <button onClick={() => setShowNotificationSettings(false)} className="text-gray-400">✕</button>
            </div>
            
            <div className="flex flex-col gap-4">
              {/* Permission status */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-bold">Статус: {permission === 'granted' ? '✅ Разрешены' : permission === 'denied' ? '❌ Запрещены' : '⏳ Не запрошены'}</p>
                {permission !== 'granted' && (
                  <button onClick={requestPermission} className="mt-2 w-full py-2 bg-duo-green text-white rounded-lg font-bold text-sm">
                    Разрешить уведомления
                  </button>
                )}
              </div>

              {/* Streak reminder */}
              <label className="flex items-center justify-between">
                <span className="text-sm">Напоминание о streak</span>
                <input
                  type="checkbox"
                  checked={notifSettings.streakReminder}
                  onChange={(e) => updateNotifSettings({ streakReminder: e.target.checked })}
                  className="w-5 h-5 accent-duo-green"
                />
              </label>

              {/* Streak time */}
              {notifSettings.streakReminder && (
                <div className="ml-4">
                  <label className="text-xs text-gray-500">Время напоминания</label>
                  <input
                    type="time"
                    value={notifSettings.streakReminderTime}
                    onChange={(e) => updateNotifSettings({ streakReminderTime: e.target.value })}
                    className="w-full p-2 border rounded-lg text-sm mt-1"
                  />
                </div>
              )}

              {/* Homework deadline */}
              <label className="flex items-center justify-between">
                <span className="text-sm">Дедлайн домашки</span>
                <input
                  type="checkbox"
                  checked={notifSettings.homeworkDeadline}
                  onChange={(e) => updateNotifSettings({ homeworkDeadline: e.target.checked })}
                  className="w-5 h-5 accent-duo-green"
                />
              </label>

              {/* Homework days */}
              {notifSettings.homeworkDeadline && (
                <div className="ml-4">
                  <label className="text-xs text-gray-500">За сколько дней напоминать</label>
                  <select
                    value={notifSettings.homeworkReminderDays}
                    onChange={(e) => updateNotifSettings({ homeworkReminderDays: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg text-sm mt-1"
                  >
                    <option value={1}>1 день</option>
                    <option value={2}>2 дня</option>
                    <option value={3}>3 дня</option>
                    <option value={7}>Неделю</option>
                  </select>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
