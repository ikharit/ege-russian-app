import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Brain, Zap, Target, TrendingUp, Check, X, RotateCcw, Sparkles, BarChart3 } from 'lucide-react'
import { useAdaptiveStore } from '../stores/adaptiveStore'
import { useProgressStore } from '../stores/progressStore'
import { course } from '../data/courseData'
import { playCorrectSound, playWrongSound } from '../lib/sounds'
import type { Question } from '../types'

interface AdaptiveQuestion extends Question {
  _taskNumber: string
}

export function AdaptiveTrainerPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const taskFilter = searchParams.get('task') || null
  
  const userAbility = useAdaptiveStore((s) => s.userAbility)
  const observeIRT = useAdaptiveStore((s) => s.observeIRT)
  const observeBKT = useAdaptiveStore((s) => s.observeBKT)
  const selectNextQuestion = useAdaptiveStore((s) => s.selectNextQuestion)
  const getIRTProbability = useAdaptiveStore((s) => s.getIRTProbability)
  const getWeakAtoms = useAdaptiveStore((s) => s.getWeakAtoms)
  const getMasteredAtoms = useAdaptiveStore((s) => s.getMasteredAtoms)
  const getRecommendedAtoms = useAdaptiveStore((s) => s.getRecommendedAtoms)
  const addXP = useProgressStore((s) => s.addXP)
  const updateStreak = useProgressStore((s) => s.updateStreak)
  const recordWrongAnswer = useProgressStore((s) => s.recordWrongAnswer)
  const updateTaskStats = useProgressStore((s) => s.updateTaskStats)
  
  // Collect all questions with task numbers
  const allQuestions = useMemo(() => {
    const questions: AdaptiveQuestion[] = []
    for (const section of course.sections) {
      for (const lesson of section.lessons) {
        for (const q of lesson.questions) {
          const taskAtom = q.atoms?.find((a: string) => a.startsWith('task'))
          const taskNumber = taskAtom?.replace('task', '') || '1'
          if (!taskFilter || taskNumber === taskFilter) {
            questions.push({ ...q, _taskNumber: taskNumber })
          }
        }
      }
    }
    return questions
  }, [taskFilter])
  
  const [sessionQuestions, setSessionQuestions] = useState<AdaptiveQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState<string[]>([])
  const [isChecked, setIsChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0, startTime: Date.now() })
  const [showExplanation, setShowExplanation] = useState(false)
  const [finished, setFinished] = useState(false)
  
  // Initialize first question using IRT
  useEffect(() => {
    if (allQuestions.length === 0) return
    const pool = allQuestions.map(q => q.id)
    const firstId = selectNextQuestion(pool, 0.7)
    if (firstId) {
      const first = allQuestions.find(q => q.id === firstId)
      if (first) setSessionQuestions([first])
    }
  }, [allQuestions, selectNextQuestion])
  
  const currentQuestion = sessionQuestions[currentIndex]
  
  const handleSelect = useCallback((option: string) => {
    if (isChecked || finished) return
    if (currentQuestion?.type === 'single') {
      setSelected([option])
    } else {
      setSelected(prev => prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option])
    }
  }, [isChecked, finished, currentQuestion])
  
  const handleCheck = useCallback(() => {
    if (!currentQuestion || selected.length === 0 || isChecked) return
    
    const correct = currentQuestion.type === 'single'
      ? selected[0] === currentQuestion.correctAnswer[0]
      : selected.length === currentQuestion.correctAnswer.length && selected.every(s => currentQuestion.correctAnswer.includes(s))
    
    setIsCorrect(correct)
    setIsChecked(true)
    setShowExplanation(true)
    
    // Update stats
    setSessionStats(prev => ({
      ...prev,
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }))
    
    // Update IRT
    observeIRT(currentQuestion.id, correct)
    
    // Update BKT for all atoms in this question
    if (currentQuestion.atoms) {
      for (const atom of currentQuestion.atoms) {
        observeBKT(atom, correct)
      }
    }
    
    // Update progress store
    if (correct) {
      playCorrectSound()
      addXP(10)
      updateTaskStats(currentQuestion._taskNumber, true)
    } else {
      playWrongSound()
      updateTaskStats(currentQuestion._taskNumber, false)
      recordWrongAnswer({
        id: currentQuestion.id,
        text: currentQuestion.text,
        options: currentQuestion.options,
        correctAnswer: currentQuestion.correctAnswer,
        explanation: currentQuestion.explanation,
        atoms: currentQuestion.atoms,
      }, selected)
    }
  }, [currentQuestion, selected, isChecked, observeIRT, observeBKT, addXP, updateTaskStats, recordWrongAnswer])
  
  const handleNext = useCallback(() => {
    if (!currentQuestion) return
    
    // Select next question using IRT
    const answeredIds = new Set(sessionQuestions.map(q => q.id))
    const pool = allQuestions.filter(q => !answeredIds.has(q.id)).map(q => q.id)
    
    if (pool.length === 0 || sessionQuestions.length >= 10) {
      setFinished(true)
      return
    }
    
    const nextId = selectNextQuestion(pool, 0.7)
    if (nextId) {
      const next = allQuestions.find(q => q.id === nextId)
      if (next) {
        setSessionQuestions(prev => [...prev, next])
        setCurrentIndex(prev => prev + 1)
        setSelected([])
        setIsChecked(false)
        setIsCorrect(false)
        setShowExplanation(false)
      }
    } else {
      setFinished(true)
    }
  }, [currentQuestion, sessionQuestions, allQuestions, selectNextQuestion])
  
  const handleRestart = () => {
    setSessionQuestions([])
    setCurrentIndex(0)
    setSelected([])
    setIsChecked(false)
    setIsCorrect(false)
    setShowExplanation(false)
    setFinished(false)
    setSessionStats({ correct: 0, total: 0, startTime: Date.now() })
    
    // Reinitialize
    if (allQuestions.length > 0) {
      const pool = allQuestions.map(q => q.id)
      const firstId = selectNextQuestion(pool, 0.7)
      if (firstId) {
        const first = allQuestions.find(q => q.id === firstId)
        if (first) setSessionQuestions([first])
      }
    }
  }
  
  // Recommendations panel
  const weakAtoms = getWeakAtoms(0.3)
  const masteredAtoms = getMasteredAtoms(0.9)
  const recommended = getRecommendedAtoms(3)
  
  if (finished) {
    const accuracy = sessionStats.total > 0 ? Math.round((sessionStats.correct / sessionStats.total) * 100) : 0
    const duration = Math.round((Date.now() - sessionStats.startTime) / 1000)
    
    return (
      <div className="max-w-md mx-auto px-4 py-6 flex flex-col gap-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-duo-purple to-duo-blue flex items-center justify-center mx-auto mb-4">
            <Brain size={40} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Сессия завершена!</h1>
          <p className="text-gray-500 mt-2">Адаптивный тренажёр с BKT + IRT</p>
        </motion.div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="card text-center p-4">
            <p className="text-2xl font-bold text-duo-green">{sessionStats.correct}/{sessionStats.total}</p>
            <p className="text-xs text-gray-500">Правильно</p>
          </div>
          <div className="card text-center p-4">
            <p className="text-2xl font-bold text-duo-blue">{accuracy}%</p>
            <p className="text-xs text-gray-500">Точность</p>
          </div>
          <div className="card text-center p-4">
            <p className="text-2xl font-bold text-duo-purple">{userAbility.toFixed(2)}</p>
            <p className="text-xs text-gray-500">Уровень (θ)</p>
          </div>
          <div className="card text-center p-4">
            <p className="text-2xl font-bold text-orange-500">{duration}с</p>
            <p className="text-xs text-gray-500">Время</p>
          </div>
        </div>
        
        {/* BKT Summary */}
        <div className="card">
          <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
            <Target size={18} className="text-duo-purple" />
            Прогресс по атомам (BKT)
          </h3>
          <div className="flex flex-col gap-2">
            {weakAtoms.slice(0, 5).map((atom) => (
              <div key={atom.atomId} className="flex items-center justify-between">
                <span className="text-xs text-gray-600 truncate flex-1">{atom.atomId}</span>
                <div className="w-24 bg-gray-100 rounded-full h-2">
                  <div className="h-full rounded-full bg-red-400" style={{ width: `${atom.pKnown * 100}%` }} />
                </div>
                <span className="text-xs text-gray-400 w-8 text-right">{Math.round(atom.pKnown * 100)}%</span>
              </div>
            ))}
            {masteredAtoms.length > 0 && (
              <p className="text-xs text-duo-green font-bold mt-1">
                ✅ Освоено: {masteredAtoms.length} атомов
              </p>
            )}
          </div>
        </div>
        
        <div className="flex gap-3">
          <button onClick={handleRestart} className="btn-primary flex-1 flex items-center justify-center gap-2">
            <RotateCcw size={18} />
            Ещё раз
          </button>
          <button onClick={() => navigate('/')} className="btn-secondary flex-1">
            На главную
          </button>
        </div>
      </div>
    )
  }
  
  if (!currentQuestion) {
    return (
      <div className="max-w-md mx-auto px-4 py-6 text-center">
        <p className="text-gray-500">Загрузка адаптивного тренажёра...</p>
      </div>
    )
  }
  
  const irtProbability = getIRTProbability(currentQuestion.id)
  
  return (
    <div className="max-w-md mx-auto px-4 py-4 min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => navigate('/trainers')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-duo-purple" />
          <span className="text-sm font-bold text-gray-700">Адаптивный</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>{currentIndex + 1}/10</span>
        </div>
      </div>
      
      {/* Stats bar */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 bg-white rounded-xl p-2 shadow-sm border border-gray-100 flex items-center gap-2">
          <Brain size={14} className="text-duo-purple" />
          <span className="text-xs font-bold text-gray-700">θ = {userAbility.toFixed(2)}</span>
        </div>
        <div className="flex-1 bg-white rounded-xl p-2 shadow-sm border border-gray-100 flex items-center gap-2">
          <TrendingUp size={14} className="text-duo-green" />
          <span className="text-xs font-bold text-gray-700">P = {Math.round(irtProbability * 100)}%</span>
        </div>
        <div className="flex-1 bg-white rounded-xl p-2 shadow-sm border border-gray-100 flex items-center gap-2">
          <Zap size={14} className="text-duo-yellow" />
          <span className="text-xs font-bold text-gray-700">{sessionStats.correct}/{sessionStats.total}</span>
        </div>
      </div>
      
      {/* Question */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold bg-duo-purple/10 text-duo-purple px-2 py-0.5 rounded-full">
              Задание {currentQuestion._taskNumber}
            </span>
            <span className="text-[10px] text-gray-400">
              IRT: {irtProbability > 0.8 ? 'Легко' : irtProbability > 0.5 ? 'Средне' : 'Сложно'}
            </span>
          </div>
          <p className="text-base text-gray-800 font-medium">{currentQuestion.text}</p>
        </div>
        
        {/* Options */}
        <div className="flex flex-col gap-2 mb-4">
          {currentQuestion.options?.map((option: string) => {
            const isSelected = selected.includes(option)
            const isCorrectOption = currentQuestion.correctAnswer.includes(option)
            
            let optionClass = 'bg-white border-gray-200 hover:border-duo-purple'
            if (isChecked) {
              if (isCorrectOption) optionClass = 'bg-duo-green border-duo-green text-white'
              else if (isSelected) optionClass = 'bg-red-100 border-red-300 text-red-700'
              else optionClass = 'bg-white border-gray-200 opacity-60'
            } else if (isSelected) {
              optionClass = 'bg-duo-purple/10 border-duo-purple'
            }
            
            return (
              <motion.button
                key={option}
                whileTap={!isChecked ? { scale: 0.98 } : {}}
                onClick={() => handleSelect(option)}
                disabled={isChecked}
                className={`p-3 rounded-xl border-2 text-left text-sm font-medium transition-all ${optionClass}`}
              >
                {option}
              </motion.button>
            )
          })}
        </div>
        
        {/* Explanation */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4"
            >
              <div className={`p-3 rounded-xl text-sm ${isCorrect ? 'bg-duo-green/10 text-duo-green-dark' : 'bg-red-50 text-red-700'}`}>
                <div className="flex items-center gap-2 mb-1">
                  {isCorrect ? <Check size={16} /> : <X size={16} />}
                  <span className="font-bold">{isCorrect ? 'Правильно!' : 'Неправильно'}</span>
                </div>
                {currentQuestion.explanation && (
                  <p className="mt-1 text-xs opacity-80">{currentQuestion.explanation}</p>
                )}
              </div>
              
              {/* BKT update info */}
              {currentQuestion.atoms && (
                <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                  <p className="text-[10px] text-gray-500 mb-1">Обновление BKT:</p>
                  <div className="flex flex-wrap gap-1">
                    {currentQuestion.atoms.map((atom: string) => {
                      const state = useAdaptiveStore.getState().bktMirror[atom]
                      return (
                        <span key={atom} className="text-[9px] bg-white px-1.5 py-0.5 rounded border border-gray-200">
                          {atom}: {state ? Math.round(state.pKnown * 100) : 30}%
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Action button */}
      {!isChecked ? (
        <button
          onClick={handleCheck}
          disabled={selected.length === 0}
          className="btn-primary w-full disabled:opacity-50"
        >
          Проверить
        </button>
      ) : (
        <button onClick={handleNext} className="btn-primary w-full flex items-center justify-center gap-2">
          Дальше <ArrowLeft size={16} className="rotate-180" />
        </button>
      )}
      
      {/* Recommendations */}
      {recommended.length > 0 && (
        <div className="mt-4 p-3 bg-duo-purple/5 rounded-xl border border-duo-purple/10">
          <p className="text-xs font-bold text-duo-purple mb-2">💡 Рекомендации (BKT):</p>
          <div className="flex flex-col gap-1">
            {recommended.map((r) => (
              <p key={r.atomId} className="text-[10px] text-gray-600">
                • {r.atomId} — {r.reason}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
