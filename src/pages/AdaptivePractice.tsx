import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Check, X, RotateCcw, Zap, Target } from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'
import { getAtomizedWords } from '../data/atomization'
import type { AtomizedWord } from '../data/atomization/atoms'

function generateOptions(word: AtomizedWord): string[] {
  const correct = word.word
  const distractors: string[] = []
  
  // Common mistake patterns based on atoms
  if (word.atoms.includes('prefix_pre_pri')) {
    if (correct.startsWith('пре')) distractors.push(correct.replace(/^пре/, 'при'))
    else if (correct.startsWith('при')) distractors.push(correct.replace(/^при/, 'пре'))
  }
  if (word.atoms.includes('prefix_vs_vz')) {
    if (correct.startsWith('вс')) distractors.push(correct.replace(/^вс/, 'вз'))
    else if (correct.startsWith('вз')) distractors.push(correct.replace(/^вз/, 'вс'))
  }
  if (word.atoms.includes('prefix_bez_bes')) {
    if (correct.startsWith('без')) distractors.push(correct.replace(/^без/, 'бес'))
    else if (correct.startsWith('бес')) distractors.push(correct.replace(/^бес/, 'без'))
  }
  if (word.atoms.includes('prefix_iz_is')) {
    if (correct.startsWith('из')) distractors.push(correct.replace(/^из/, 'ис'))
    else if (correct.startsWith('ис')) distractors.push(correct.replace(/^ис/, 'из'))
  }
  if (word.atoms.includes('prefix_ne_ni')) {
    if (correct.startsWith('не')) distractors.push(correct.replace(/^не/, 'ни'))
    else if (correct.startsWith('ни')) distractors.push(correct.replace(/^ни/, 'не'))
  }
  if (word.atoms.includes('root_vowel_alternation')) {
    // Swap a/o, e/i in root
    const variants = [
      correct.replace(/а/g, 'о').replace(/о/g, 'а'),
      correct.replace(/е/g, 'и').replace(/и/g, 'е'),
    ]
    distractors.push(...variants.filter(v => v !== correct))
  }
  
  // If no specific distractor generated, add some generic ones
  if (distractors.length === 0) {
    distractors.push(correct + 'ь', correct.replace(/ь$/, ''))
  }
  
  // Take first 2 unique distractors + correct, shuffle
  const unique = [...new Set([correct, ...distractors.filter(d => d !== correct)])].slice(0, 4)
  return unique.sort(() => Math.random() - 0.5)
}

export function AdaptivePractice() {
  const navigate = useNavigate()
  const weakAtoms = useProgressStore((s) => s.getWeakAtoms(70))
  const recordAtomAttempt = useProgressStore((s) => s.recordAtomAttempt)
  const recordWrongAnswer = useProgressStore((s) => s.recordWrongAnswer)
  const addXP = useProgressStore((s) => s.addXP)
  
  const [questions, setQuestions] = useState<AtomizedWord[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [isChecked, setIsChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAtomizedWords().then(words => {
      let selected: AtomizedWord[]
      if (weakAtoms.length > 0) {
        selected = words.filter(w => w.atoms.some(a => weakAtoms.includes(a)))
      } else {
        // Fallback: random words for practice
        selected = words
      }
      const shuffled = selected.sort(() => Math.random() - 0.5).slice(0, 10)
      setQuestions(shuffled)
      setLoading(false)
    })
  }, [weakAtoms.join(',')])

  const current = questions[currentIdx]
  const options = current ? generateOptions(current) : []

  const handleSelect = (option: string) => {
    if (isChecked) return
    setSelected(option)
  }

  const handleCheck = useCallback(() => {
    if (!selected || !current) return
    const correct = selected === current.word
    setIsCorrect(correct)
    setIsChecked(true)
    if (correct) setCorrectCount(c => c + 1)
    else {
      // Record wrong answer for mistakes review
      recordWrongAnswer({
        id: `atom-${current.word}-${current.atoms.join('-')}`,
        text: current.questionText || `Как правильно написать слово: ${current.rawForm}?`,
        options,
        correctAnswer: [current.word],
        explanation: current.explanation,
        atoms: current.atoms,
      }, [selected])
    }
    
    // Record atom progress
    for (const atomId of current.atoms) {
      recordAtomAttempt(atomId, correct)
    }
  }, [selected, current, recordAtomAttempt, recordWrongAnswer, options])

  const handleNext = useCallback(() => {
    setSelected(null)
    setIsChecked(false)
    setIsCorrect(false)
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1)
    } else {
      setIsFinished(true)
      addXP(Math.round((correctCount / questions.length) * 50))
    }
  }, [currentIdx, questions.length, correctCount, addXP])

  const handleRetry = () => {
    setCurrentIdx(0)
    setCorrectCount(0)
    setIsFinished(false)
    setSelected(null)
    setIsChecked(false)
  }

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-duo-green border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-500">Подбираем вопросы по слабым местам...</p>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Отлично!</h2>
        <p className="text-gray-500 mb-6">У вас пока нет слабых мест для тренировки. Пройдите больше уроков, чтобы мы выявили проблемные зоны.</p>
        <button onClick={() => navigate('/')} className="btn-primary">На главную</button>
      </div>
    )
  }

  if (isFinished) {
    const percentage = Math.round((correctCount / questions.length) * 100)
    return (
      <div className="max-w-md mx-auto px-4 py-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`w-28 h-28 mx-auto rounded-full flex items-center justify-center text-3xl font-bold mb-6 ${
            percentage >= 80 ? 'bg-duo-green text-white' :
            percentage >= 60 ? 'bg-duo-yellow text-gray-900' : 'bg-duo-red text-white'
          }`}
        >
          {percentage}%
        </motion.div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {percentage >= 80 ? 'Отличная тренировка!' : percentage >= 60 ? 'Хороший результат!' : 'Продолжай тренироваться!'}
        </h2>
        <p className="text-gray-500 mb-6">{correctCount} из {questions.length} правильных ответов</p>
        
        <div className="flex gap-3 justify-center">
          <button onClick={handleRetry} className="btn-secondary flex items-center gap-2">
            <RotateCcw size={18} /> Ещё раз
          </button>
          <button onClick={() => navigate('/')} className="btn-primary">На главную</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-4 border-b border-gray-100">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <p className="text-xs text-gray-500">Адаптивная практика</p>
          <p className="font-bold text-sm">Тренировка слабых мест</p>
        </div>
        <Target size={20} className="text-duo-green" />
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-md mx-auto flex flex-col gap-4"
          >
            {/* Progress */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-duo-green h-2 rounded-full transition-all" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Вопрос {currentIdx + 1} из {questions.length}</span>
              <span className="flex items-center gap-1"><Zap size={14} className="text-duo-yellow" /> {correctCount}</span>
            </div>

            {/* Question */}
            <div className="bg-duo-snow p-4 rounded-2xl">
              <p className="text-sm text-gray-500 mb-2">{current.questionText || 'Вопрос:'}</p>
              <p className="text-xl font-bold text-gray-800">{current.rawForm}</p>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-2">
              {options.map((option, idx) => {
                const isSel = selected === option
                const isCorrectOpt = option === current.word
                let cls = 'border-2 rounded-xl p-4 text-left font-medium transition-all '
                
                if (!isChecked) {
                  cls += isSel ? 'border-duo-blue bg-blue-50 text-duo-blue' : 'border-gray-200 bg-white hover:bg-gray-50'
                } else {
                  if (isCorrectOpt) cls += 'border-duo-green bg-green-50 text-duo-green'
                  else if (isSel && !isCorrectOpt) cls += 'border-duo-red bg-red-50 text-duo-red'
                  else cls += 'border-gray-200 bg-white opacity-60'
                }

                return (
                  <motion.button
                    key={option}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => handleSelect(option)}
                    className={cls}
                    disabled={isChecked}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {isChecked && isCorrectOpt && <Check size={20} className="text-duo-green" />}
                      {isChecked && isSel && !isCorrectOpt && <X size={20} className="text-duo-red" />}
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* Explanation */}
            {isChecked && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={`p-4 rounded-xl ${isCorrect ? 'bg-green-50 border border-duo-green' : 'bg-red-50 border border-duo-red'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {isCorrect ? (
                    <><Check size={18} className="text-duo-green" /><span className="font-bold text-duo-green">Правильно!</span></>
                  ) : (
                    <><X size={18} className="text-duo-red" /><span className="font-bold text-duo-red">Неправильно</span></>
                  )}
                </div>
                <p className="text-sm text-gray-700">{current.explanation}</p>
                <p className="text-sm text-gray-500 mt-1">Правило: {current.rule}</p>
              </motion.div>
            )}

            {/* Action button */}
            <button
              onClick={isChecked ? handleNext : handleCheck}
              disabled={!selected}
              className={`btn-primary w-full ${isChecked ? (isCorrect ? '' : 'bg-duo-red') : ''}`}
            >
              {isChecked ? (currentIdx === questions.length - 1 ? 'Завершить' : 'Далее') : 'Проверить'}
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
