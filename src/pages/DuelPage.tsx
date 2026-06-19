import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Swords, Copy, CheckCircle, Users, Trophy, Zap, Clock,
  ChevronRight, Sparkles, Target, Medal
} from 'lucide-react'
import { useDuelStore, DuelQuestion } from '../stores/duelStore'
import { useStudentStore } from '../stores/studentStore'
import { useProgressStore } from '../stores/progressStore'
import { course } from '../data/courseData'

function generateDuelQuestions(count = 5): DuelQuestion[] {
  const allQuestions = course.sections.flatMap(s => s.lessons.flatMap(l => l.questions))
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count).map(q => ({
    id: q.id,
    text: q.text,
    options: q.options ? [...q.options].sort(() => Math.random() - 0.5) : undefined,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
    taskNumber: q.atoms?.find(a => a.startsWith('task'))?.replace('task', '') || '1',
  }))
}

export function DuelPage() {
  const navigate = useNavigate()
  const activeProfile = useStudentStore((s) => s.getActiveProfile())
  const profile = activeProfile || { id: 'guest', name: 'Гость', emoji: '👤' }

  const duels = useDuelStore((s) => s.duels)
  const createDuel = useDuelStore((s) => s.createDuel)
  const joinDuel = useDuelStore((s) => s.joinDuel)
  const submitAnswers = useDuelStore((s) => s.submitAnswers)
  const getActiveDuel = useDuelStore((s) => s.getActiveDuel)
  const leaveDuel = useDuelStore((s) => s.leaveDuel)
  const cleanupExpired = useDuelStore((s) => s.cleanupExpired)

  const [mode, setMode] = useState<'menu' | 'create' | 'join' | 'play' | 'result'>('menu')
  const [duelCode, setDuelCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [activeDuel, setActiveDuel] = useState(getActiveDuel())
  const [currentQIdx, setCurrentQIdx] = useState(0)
  const [selected, setSelected] = useState<string[]>([])
  const [isChecked, setIsChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [answers, setAnswers] = useState<{ questionId: string; correct: boolean; timeMs: number }[]>([])
  const [startTime, setStartTime] = useState<number>(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [elapsedMs, setElapsedMs] = useState(0)

  useEffect(() => {
    cleanupExpired()
    const duel = getActiveDuel()
    if (duel) {
      setActiveDuel(duel)
      if (duel.status === 'completed') {
        setMode('result')
      } else if (duel.players.some(p => p.profileId === profile.id && p.completedAt)) {
        setMode('result')
      } else if (duel.status === 'active') {
        setMode('play')
      }
    }
  }, [duels, getActiveDuel, cleanupExpired, profile.id])

  const handleCreate = () => {
    const questions = generateDuelQuestions(5)
    const { duelId } = createDuel(profile.name, profile.emoji, questions)
    const duel = useDuelStore.getState().duels[duelId]
    setActiveDuel(duel)
    setMode('create')
  }

  const handleJoin = () => {
    if (!duelCode.trim() || duelCode.length !== 6) return
    const joined = joinDuel(duelCode.trim().toUpperCase(), {
      profileId: profile.id,
      name: profile.name,
      emoji: profile.emoji,
    })
    if (joined) {
      setActiveDuel(joined)
      setMode('play')
      setStartTime(Date.now())
      setElapsedMs(0)
      timerRef.current = setInterval(() => {
        setElapsedMs(Date.now() - (startTime || Date.now()))
      }, 100)
    } else {
      alert('Дуэль не найдена или уже началась. Проверьте код.')
    }
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const currentQuestion = activeDuel?.questions[currentQIdx]

  const handleOptionClick = (option: string) => {
    if (isChecked || !currentQuestion) return
    if (currentQuestion.options && currentQuestion.options.length <= 4) {
      setSelected([option])
    } else {
      setSelected(prev => prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option])
    }
  }

  const handleCheck = () => {
    if (!currentQuestion || selected.length === 0) return
    const qStart = startTime || Date.now()
    const timeMs = Date.now() - qStart
    const correct = currentQuestion.correctAnswer.length === 1
      ? selected[0] === currentQuestion.correctAnswer[0]
      : selected.length === currentQuestion.correctAnswer.length && selected.every(s => currentQuestion.correctAnswer.includes(s))
    setIsCorrect(correct)
    setIsChecked(true)
    setAnswers(prev => [...prev, { questionId: currentQuestion.id, correct, timeMs }])
  }

  const handleNext = () => {
    if (!activeDuel) return
    if (currentQIdx < activeDuel.questions.length - 1) {
      setCurrentQIdx(prev => prev + 1)
      setSelected([])
      setIsChecked(false)
      setIsCorrect(false)
      setStartTime(Date.now())
    } else {
      // Submit all answers
      submitAnswers(activeDuel.id, profile.id, answers)
      if (timerRef.current) clearInterval(timerRef.current)
      setMode('result')
    }
  }

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000)
    const m = Math.floor(s / 60)
    return `${m}:${String(s % 60).padStart(2, '0')}`
  }

  // Menu
  if (mode === 'menu') {
    return (
      <div className="max-w-md mx-auto px-4 py-6 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-gray-800">⚔️ Дуэль</h1>
        </div>

        <p className="text-gray-500 text-sm text-center">
          Соревнуйся с друзьями! Кто быстрее и точнее решит 5 вопросов?
        </p>

        <motion.button
          className="card bg-gradient-to-br from-duo-green/10 to-duo-green/5 border-duo-green/20 cursor-pointer"
          whileHover={{ scale: 1.01 }}
          onClick={handleCreate}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-duo-green flex items-center justify-center text-white">
              <Swords size={24} />
            </div>
            <div>
              <p className="font-bold text-gray-800">Создать дуэль</p>
              <p className="text-xs text-gray-500">Сгенерировать код приглашения</p>
            </div>
          </div>
        </motion.button>

        <motion.button
          className="card bg-gradient-to-br from-duo-blue/10 to-duo-blue/5 border-duo-blue/20 cursor-pointer"
          whileHover={{ scale: 1.01 }}
          onClick={() => { setMode('join'); setDuelCode('') }}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-duo-blue flex items-center justify-center text-white">
              <Users size={24} />
            </div>
            <div>
              <p className="font-bold text-gray-800">Присоединиться</p>
              <p className="text-xs text-gray-500">Ввести код дуэли</p>
            </div>
          </div>
        </motion.button>

        {/* Active duels */}
        {Object.values(duels).filter(d => d.status !== 'completed').length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-gray-700">Активные дуэли</h3>
            {Object.values(duels)
              .filter(d => d.status !== 'completed')
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map(duel => (
                <motion.div
                  key={duel.id}
                  className="card cursor-pointer"
                  whileHover={{ scale: 1.01 }}
                  onClick={() => {
                    setActiveDuel(duel)
                    if (duel.status === 'waiting') setMode('create')
                    else if (duel.players.some(p => p.profileId === profile.id && p.completedAt)) setMode('result')
                    else setMode('play')
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm">Дуэль #{duel.code}</p>
                      <p className="text-xs text-gray-500">
                        {duel.creatorEmoji} {duel.creatorName} • {duel.status === 'waiting' ? '⏳ Ожидание' : '🔥 Активна'}
                      </p>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </div>
    )
  }

  // Create — waiting for opponent
  if (mode === 'create' && activeDuel) {
    return (
      <div className="max-w-md mx-auto px-4 py-6 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <button onClick={() => { leaveDuel(); setMode('menu') }} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Создание дуэли</h1>
        </div>

        <div className="card text-center py-8">
          <div className="text-5xl mb-4">⚔️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Дуэль создана!</h2>
          <p className="text-gray-500 text-sm mb-4">Поделитесь кодом с другом</p>

          <div className="flex items-center gap-2 justify-center p-3 bg-duo-yellow/10 rounded-xl border border-duo-yellow/20">
            <span className="text-2xl font-mono font-bold text-duo-yellow tracking-wider">{activeDuel.code}</span>
            <button
              onClick={() => handleCopyCode(activeDuel.code)}
              className="ml-2 p-1.5 rounded-lg bg-white hover:bg-gray-50 transition-colors"
            >
              {copied ? <CheckCircle size={16} className="text-duo-green" /> : <Copy size={16} className="text-gray-500" />}
            </button>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <Users size={20} className="text-duo-blue" />
            <h3 className="font-bold text-gray-700">Участники</h3>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 p-2 bg-duo-green/10 rounded-lg">
              <span className="text-xl">{activeDuel.creatorEmoji}</span>
              <span className="font-bold text-sm">{activeDuel.creatorName}</span>
              <span className="text-xs text-duo-green ml-auto">✓ Создатель</span>
            </div>
            {activeDuel.players.length > 0 ? (
              <div className="flex items-center gap-3 p-2 bg-duo-blue/10 rounded-lg">
                <span className="text-xl">{activeDuel.players[0].emoji}</span>
                <span className="font-bold text-sm">{activeDuel.players[0].name}</span>
                <span className="text-xs text-duo-blue ml-auto">✓ Присоединился</span>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <span className="text-xl">❓</span>
                <span className="text-gray-400 text-sm">Ожидание соперника...</span>
              </div>
            )}
          </div>
        </div>

        {activeDuel.players.length > 0 && activeDuel.status === 'active' && (
          <motion.button
            className="btn-primary flex items-center justify-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => {
              setMode('play')
              setStartTime(Date.now())
              setElapsedMs(0)
              timerRef.current = setInterval(() => {
                setElapsedMs(Date.now() - (startTime || Date.now()))
              }, 100)
            }}
          >
            <Swords size={18} />
            Начать дуэль!
          </motion.button>
        )}
      </div>
    )
  }

  // Join
  if (mode === 'join') {
    return (
      <div className="max-w-md mx-auto px-4 py-6 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setMode('menu')} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Присоединиться</h1>
        </div>

        <div className="card text-center py-8">
          <div className="text-5xl mb-4">🎮</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Введите код дуэли</h2>
          <p className="text-gray-500 text-sm mb-4">6 символов (без 0, O, I, 1)</p>

          <input
            type="text"
            value={duelCode}
            onChange={(e) => setDuelCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
            placeholder="ABC123"
            className="w-full text-center text-2xl font-mono font-bold tracking-wider p-4 rounded-xl border-2 border-gray-200 focus:border-duo-blue focus:outline-none uppercase"
            maxLength={6}
            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
          />
        </div>

        <button
          onClick={handleJoin}
          disabled={duelCode.length !== 6}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Swords size={18} className="inline mr-2" />
          Присоединиться
        </button>
      </div>
    )
  }

  // Play
  if (mode === 'play' && activeDuel && currentQuestion) {
    const q = currentQuestion
    const isLast = currentQIdx === activeDuel.questions.length - 1

    return (
      <div className="max-w-md mx-auto px-4 py-6 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button onClick={() => { if (timerRef.current) clearInterval(timerRef.current); leaveDuel(); setMode('menu') }} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock size={16} />
            <span className="font-mono">{formatTime(elapsedMs)}</span>
          </div>
          <span className="text-sm font-bold text-gray-700">{currentQIdx + 1}/{activeDuel.questions.length}</span>
        </div>

        {/* Progress */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-duo-green h-2 rounded-full transition-all" style={{ width: `${((currentQIdx + 1) / activeDuel.questions.length) * 100}%` }} />
        </div>

        <h2 className="text-xl font-bold text-gray-800">{q.text}</h2>

        <div className="flex flex-col gap-2">
          {q.options?.map((option, idx) => {
            const isSelected = selected.includes(option)
            const isCorrectOption = q.correctAnswer.includes(option)
            let btnClass = 'border-2 rounded-xl p-4 text-left font-medium transition-all '

            if (!isChecked) {
              btnClass += isSelected ? 'border-duo-blue bg-blue-50 text-duo-blue' : 'border-gray-200 bg-white hover:bg-gray-50'
            } else {
              if (isCorrectOption) btnClass += 'border-duo-green bg-green-50 text-duo-green'
              else if (isSelected && !isCorrectOption) btnClass += 'border-duo-red bg-red-50 text-duo-red'
              else btnClass += 'border-gray-200 bg-white opacity-60'
            }

            return (
              <motion.button
                key={option}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => handleOptionClick(option)}
                className={btnClass}
                disabled={isChecked}
              >
                <span>{option}</span>
              </motion.button>
            )
          })}
        </div>

        <AnimatePresence>
          {isChecked && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={`p-4 rounded-xl ${isCorrect ? 'bg-green-50 border border-duo-green' : 'bg-red-50 border border-duo-red'}`}
            >
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <><Sparkles size={18} className="text-duo-green" /><span className="font-bold text-duo-green">Правильно!</span></>
                ) : (
                  <><Target size={18} className="text-duo-red" /><span className="font-bold text-duo-red">Неправильно</span></>
                )}
              </div>
              <p className="text-sm text-gray-700">{q.explanation}</p>
              <p className="text-sm text-gray-500 mt-1">Правильный ответ: {q.correctAnswer.join(', ')}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={isChecked ? handleNext : handleCheck}
          disabled={selected.length === 0}
          className={`btn-primary w-full ${isChecked ? (isCorrect ? '' : 'bg-duo-red shadow-[0_4px_0_#d32f2f]') : ''}`}
        >
          {isChecked ? (isLast ? 'Завершить ➜' : 'Далее ➜') : 'Проверить'}
        </button>
      </div>
    )
  }

  // Result
  if (mode === 'result' && activeDuel) {
    const myResult = activeDuel.players.find(p => p.profileId === profile.id)
    const opponent = activeDuel.players.find(p => p.profileId !== profile.id)
    const allCompleted = activeDuel.players.length === 2 && activeDuel.players.every(p => p.completedAt)

    const iWon = myResult && opponent && myResult.score > opponent.score
    const isDraw = myResult && opponent && myResult.score === opponent.score

    return (
      <div className="max-w-md mx-auto px-4 py-6 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <button onClick={() => { leaveDuel(); setMode('menu') }} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Результат дуэли</h1>
        </div>

        <div className="card text-center py-8">
          <div className="text-5xl mb-4">{allCompleted ? (iWon ? '🏆' : isDraw ? '🤝' : '💪') : '⏳'}</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {allCompleted
              ? (iWon ? 'Победа!' : isDraw ? 'Ничья!' : 'Поражение')
              : 'Ожидание соперника...'}
          </h2>
          <p className="text-gray-500 text-sm">
            {allCompleted
              ? `Дуэль #${activeDuel.code}`
              : 'Соперник ещё решает. Скоро увидите результат!'}
          </p>
        </div>

        {/* Scoreboard */}
        <div className="card">
          <h3 className="font-bold text-gray-700 mb-3">📊 Счёт</h3>
          <div className="flex flex-col gap-2">
            {/* Me */}
            {myResult && (
              <div className={`flex items-center gap-3 p-3 rounded-xl ${iWon ? 'bg-duo-green/10 border border-duo-green/20' : 'bg-gray-50'}`}>
                <span className="text-2xl">{profile.emoji}</span>
                <div className="flex-1">
                  <p className="font-bold text-sm">{profile.name} (вы)</p>
                  <p className="text-xs text-gray-500">{myResult.answers.filter(a => a.correct).length}/{myResult.answers.length} правильно • {formatTime(myResult.totalTimeMs)}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-duo-yellow">{myResult.score} XP</p>
                  <p className="text-xs text-gray-400">{myResult.accuracy}%</p>
                </div>
              </div>
            )}
            {/* Opponent */}
            {opponent ? (
              <div className={`flex items-center gap-3 p-3 rounded-xl ${!iWon && !isDraw && allCompleted ? 'bg-duo-green/10 border border-duo-green/20' : 'bg-gray-50'}`}>
                <span className="text-2xl">{opponent.emoji}</span>
                <div className="flex-1">
                  <p className="font-bold text-sm">{opponent.name}</p>
                  <p className="text-xs text-gray-500">
                    {opponent.completedAt
                      ? `${opponent.answers.filter(a => a.correct).length}/${opponent.answers.length} правильно • ${formatTime(opponent.totalTimeMs)}`
                      : '⏳ Решает...'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-duo-yellow">{opponent.score} XP</p>
                  <p className="text-xs text-gray-400">{opponent.completedAt ? `${opponent.accuracy}%` : '—'}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="text-2xl">❓</span>
                <p className="text-gray-400 text-sm">Соперник ещё не присоединился</p>
              </div>
            )}
          </div>
        </div>

        {/* Questions recap */}
        {myResult && (
          <div className="card">
            <h3 className="font-bold text-gray-700 mb-3">📝 Ответы</h3>
            <div className="flex flex-col gap-2">
              {activeDuel.questions.map((q, idx) => {
                const myAnswer = myResult.answers.find(a => a.questionId === q.id)
                return (
                  <div key={q.id} className={`flex items-center gap-3 p-2 rounded-lg ${myAnswer?.correct ? 'bg-green-50' : 'bg-red-50'}`}>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${myAnswer?.correct ? 'bg-duo-green text-white' : 'bg-duo-red text-white'}`}>
                      {myAnswer?.correct ? '✓' : '✗'}
                    </span>
                    <span className="text-sm text-gray-700 flex-1 truncate">{q.text}</span>
                    <span className="text-xs text-gray-400">Задание {q.taskNumber}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <button
          onClick={() => { leaveDuel(); setMode('menu') }}
          className="btn-primary"
        >
          <Swords size={18} className="inline mr-2" />
          Новая дуэль
        </button>
      </div>
    )
  }

  return null
}
