import { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Check, X, RotateCcw, BookOpen, AlertCircle, ChevronRight, Trash2 } from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'
import type { WrongAnswer } from '../types'
import { detectErrorType, getSubskillName } from '../utils/errorPatternAnalyzer'

export function MistakesReview() {
  const navigate = useNavigate()
  const wrongAnswers = useProgressStore((s) => s.getWrongAnswers())
  const removeWrongAnswer = useProgressStore((s) => s.removeWrongAnswer)
  const incrementWrongAnswerAttempt = useProgressStore((s) => s.incrementWrongAnswerAttempt)
  const addXP = useProgressStore((s) => s.addXP)

  const [mode, setMode] = useState<'list' | 'practice'>('list')
  const [practiceQuestions, setPracticeQuestions] = useState<WrongAnswer[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selected, setSelected] = useState<string[]>([])
  const [isChecked, setIsChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [isFinished, setIsFinished] = useState(false)

  const unreviewed = useMemo(() => wrongAnswers.filter(w => !w.reviewed), [wrongAnswers])
  const byErrorType = useMemo(() => {
    const map: Record<string, WrongAnswer[]> = {}
    for (const w of wrongAnswers) {
      const et = detectErrorType(w.taskNumber, w.text, w.explanation)
      const key = `${getSubskillName(et)} (${w.taskNumber ? `Задание ${w.taskNumber}` : 'Без задания'})`
      if (!map[key]) map[key] = []
      map[key].push(w)
    }
    return map
  }, [wrongAnswers])

  const startPractice = (questions: WrongAnswer[]) => {
    if (questions.length === 0) return
    setPracticeQuestions(questions)
    setCurrentIdx(0)
    setCorrectCount(0)
    setIsFinished(false)
    setSelected([])
    setIsChecked(false)
    setMode('practice')
  }

  const current = practiceQuestions[currentIdx]

  const handleSelect = (option: string) => {
    if (isChecked) return
    setSelected([option])
  }

  const handleCheck = useCallback(() => {
    if (!current || selected.length === 0) return
    const correct =
      current.correctAnswer.length === selected.length &&
      selected.every(s => current.correctAnswer.includes(s))
    setIsCorrect(correct)
    setIsChecked(true)
    if (correct) {
      setCorrectCount(c => c + 1)
      removeWrongAnswer(current.questionId)
    } else {
      incrementWrongAnswerAttempt(current.questionId, selected)
    }
  }, [selected, current, removeWrongAnswer, incrementWrongAnswerAttempt])

  const handleNext = useCallback(() => {
    setSelected([])
    setIsChecked(false)
    setIsCorrect(false)
    if (currentIdx < practiceQuestions.length - 1) {
      setCurrentIdx(i => i + 1)
    } else {
      setIsFinished(true)
      addXP(Math.round((correctCount / practiceQuestions.length) * 50))
    }
  }, [currentIdx, practiceQuestions.length, correctCount, addXP])

  const handleRetry = () => {
    setCurrentIdx(0)
    setCorrectCount(0)
    setIsFinished(false)
    setSelected([])
    setIsChecked(false)
  }

  const handleBackToList = () => {
    setMode('list')
    setIsFinished(false)
  }

  const deleteWrongAnswer = (id: string) => {
    removeWrongAnswer(id)
  }

  // ─── PRACTICE MODE ───
  if (mode === 'practice') {
    if (isFinished) {
      const percentage = Math.round((correctCount / practiceQuestions.length) * 100)
      return (
        <div className="min-h-screen bg-white flex flex-col">
          <div className="px-4 py-3 flex items-center gap-4 border-b border-gray-100">
            <button onClick={() => setMode('list')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Работа над ошибками</p>
              <p className="font-bold text-sm">Результат</p>
            </div>
          </div>
          <div className="flex-1 px-4 py-8 text-center max-w-md mx-auto">
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
              {percentage >= 80 ? 'Отлично!' : percentage >= 60 ? 'Хороший результат!' : 'Продолжай работать!'}
            </h2>
            <p className="text-gray-500 mb-6">{correctCount} из {practiceQuestions.length} исправлено</p>
            <p className="text-sm text-gray-600 mb-8">
              {percentage === 100
                ? 'Все ошибки исправлены! Они удалены из списка.'
                : 'Неисправленные ошибки остались в списке — повтори ещё раз.'}
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={handleRetry} className="btn-secondary flex items-center gap-2">
                <RotateCcw size={18} /> Ещё раз
              </button>
              <button onClick={handleBackToList} className="btn-primary">К списку ошибок</button>
            </div>
          </div>
        </div>
      )
    }

    if (!current) return null

    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="px-4 py-3 flex items-center gap-4 border-b border-gray-100">
          <button onClick={() => setMode('list')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <p className="text-xs text-gray-500">Работа над ошибками</p>
            <p className="font-bold text-sm">Повторение</p>
          </div>
        </div>

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
                <div className="bg-duo-green h-2 rounded-full transition-all" style={{ width: `${((currentIdx + 1) / practiceQuestions.length) * 100}%` }} />
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Вопрос {currentIdx + 1} из {practiceQuestions.length}</span>
                <span className="flex items-center gap-1"><Check size={14} className="text-duo-green" /> {correctCount}</span>
              </div>

              {/* Warning that this was an error before */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                <AlertCircle size={18} className="text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-700">Это вопрос, в котором вы ошиблись</p>
                  <p className="text-xs text-amber-600">Ваш ответ: {current.userAnswer.join(', ')}</p>
                </div>
              </div>

              {/* Question */}
              <div className="bg-duo-snow p-4 rounded-2xl">
                <p className="text-sm text-gray-500 mb-1">{current.taskNumber ? `Задание ${current.taskNumber}` : 'Вопрос'}</p>
                <p className="text-xl font-bold text-gray-800">{current.text}</p>
              </div>

              {/* Options */}
              {current.options && current.options.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {current.options.map((option, idx) => {
                    const isSel = selected.includes(option)
                    const isCorrectOpt = current.correctAnswer.includes(option)
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
              ) : (
                <div className="text-center text-gray-500 text-sm py-4">
                  Варианты ответа отсутствуют для этого вопроса.
                </div>
              )}

              {/* Explanation */}
              {isChecked && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className={`p-4 rounded-xl ${isCorrect ? 'bg-green-50 border border-duo-green' : 'bg-red-50 border border-duo-red'}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {isCorrect ? (
                      <><Check size={18} className="text-duo-green" /><span className="font-bold text-duo-green">Исправлено!</span></>
                    ) : (
                      <><X size={18} className="text-duo-red" /><span className="font-bold text-duo-red">Снова ошибка</span></>
                    )}
                  </div>
                  <p className="text-sm text-gray-700">{current.explanation}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Правильный ответ: {current.correctAnswer.join(', ')}
                  </p>
                </motion.div>
              )}

              {/* Action button */}
              <button
                onClick={isChecked ? handleNext : handleCheck}
                disabled={selected.length === 0}
                className={`btn-primary w-full ${isChecked ? (isCorrect ? '' : 'bg-duo-red') : ''}`}
              >
                {isChecked ? (currentIdx === practiceQuestions.length - 1 ? 'Завершить' : 'Далее') : 'Проверить'}
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    )
  }

  // ─── LIST MODE ───
  return (
    <div className="min-h-screen bg-duo-snow flex flex-col">
      <div className="px-4 py-3 flex items-center gap-4 bg-white border-b border-gray-100">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="font-bold text-gray-800">Работа над ошибками</h1>
          <p className="text-xs text-gray-500">{unreviewed.length} неразобранных ошибок</p>
        </div>
      </div>

      <div className="flex-1 px-4 py-6 max-w-md mx-auto w-full">
        {wrongAnswers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Ошибок нет!</h2>
            <p className="text-gray-500 mb-6">Вы ещё не совершили ни одной ошибки. Продолжайте учиться — здесь появятся вопросы, в которых вы ошиблись.</p>
            <button onClick={() => navigate('/course')} className="btn-primary">К курсу</button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Practice all unreviewed */}
            {unreviewed.length > 0 && (
              <button
                onClick={() => startPractice(unreviewed)}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <RotateCcw size={18} /> Повторить все ошибки ({unreviewed.length})
              </button>
            )}

            {/* Grouped by error type */}
            {Object.entries(byErrorType).map(([errorName, items]) => (
              <div key={errorName} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                  <span className="font-bold text-sm text-gray-700">{errorName}</span>
                  <span className="text-xs text-gray-500">{items.length} ошибок</span>
                </div>
                <div className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <div key={item.questionId} className="p-4 flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm text-gray-800 font-medium flex-1">{item.text}</p>
                        <button
                          onClick={() => deleteWrongAnswer(item.questionId)}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors shrink-0"
                          title="Удалить из ошибок"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-lg font-medium">
                          Ваш ответ: {item.userAnswer.join(', ')}
                        </span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg font-medium">
                          Правильно: {item.correctAnswer.join(', ')}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{item.explanation}</p>
                      <button
                        onClick={() => startPractice([item])}
                        className="text-sm text-duo-blue font-medium flex items-center gap-1 hover:underline self-start"
                      >
                        <BookOpen size={14} /> Повторить <ChevronRight size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
