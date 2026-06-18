import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Search, ArrowLeft, BookOpenText, Edit3, CheckCircle, PlayCircle, AlertCircle, Star, Circle } from 'lucide-react'
import { theoryLessons, TheoryLesson } from '../data/theoryData'
import { TheoryViewer } from '../components/TheoryViewer'
import { TheoryTestRunner } from '../components/TheoryTest'
import { theoryTests } from '../data/theoryTests'
import { useProgressStore } from '../stores/progressStore'

export default function TheoryPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<TheoryLesson | null>(null)
  const [showTest, setShowTest] = useState(false)

  const completeTheoryTest = useProgressStore((s) => s.completeTheoryTest)
  const theoryTestsCompleted = useProgressStore((s) => s.theoryTestsCompleted)

  const categories = Array.from(new Set(theoryLessons.map(l => l.category)))

  const filtered = theoryLessons.filter(l => {
    const matchSearch =
      !search ||
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.taskNumber.toLowerCase().includes(search.toLowerCase()) ||
      l.category.toLowerCase().includes(search.toLowerCase()) ||
      l.theoryText.toLowerCase().includes(search.toLowerCase())
    const matchCategory = !selectedCategory || l.category === selectedCategory
    return matchSearch && matchCategory
  })

  if (selectedLesson && showTest) {
    const test = theoryTests.find(t => t.taskNumber === selectedLesson.taskNumber)
    if (!test) {
      setShowTest(false)
      return null
    }
    return (
      <TheoryTestRunner
        test={test}
        onComplete={(score, xpEarned) => {
          completeTheoryTest(selectedLesson.taskNumber, score, xpEarned)
        }}
        onClose={() => setShowTest(false)}
      />
    )
  }

  if (selectedLesson) {
    const test = theoryTests.find(t => t.taskNumber === selectedLesson.taskNumber)
    const testCompleted = theoryTestsCompleted[selectedLesson.taskNumber]?.completed
    const testScore = theoryTestsCompleted[selectedLesson.taskNumber]?.score

    return (
      <div className="min-h-screen bg-duo-snow">
        <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
          <button onClick={() => setSelectedLesson(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 font-medium">{selectedLesson.category}</p>
            <p className="font-bold text-gray-800 text-sm truncate">
              Задание {selectedLesson.taskNumber === 'Сочинение' ? '27 (Сочинение)' : selectedLesson.taskNumber}. {selectedLesson.title}
            </p>
          </div>
          <button
            onClick={() => navigate(`/theory-editor/${selectedLesson.taskNumber}`)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Редактировать"
          >
            <Edit3 size={18} className="text-gray-500" />
          </button>
        </div>
        <div className="px-4 py-6 max-w-2xl mx-auto">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <TheoryViewer text={selectedLesson.theoryText} />
          </div>

          {/* Theory Test Section */}
          {test && (
            <div className="mt-6 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${testCompleted ? 'bg-duo-green/10' : 'bg-duo-blue/10'}`}>
                  {testCompleted ? <CheckCircle size={20} className="text-duo-green" /> : <PlayCircle size={20} className="text-duo-blue" />}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800 text-sm">Проверь понимание</p>
                  <p className="text-xs text-gray-500">
                    {testCompleted
                      ? `Пройдено · ${testScore}% · ${test.questions.length} вопросов`
                      : `${test.questions.length} вопросов · до 25 XP`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTest(true)}
                className={`w-full py-3 rounded-xl font-medium text-sm transition-colors ${
                  testCompleted
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'btn-primary'
                }`}
              >
                {testCompleted ? 'Пройти снова' : 'Начать тест'}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-duo-snow pb-20">
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-duo-blue/10 flex items-center justify-center">
              <BookOpenText size={20} className="text-duo-blue" />
            </div>
            <div className="flex-1">
              <h1 className="font-bold text-gray-800 text-lg">Теория</h1>
              <p className="text-sm text-gray-500">{theoryLessons.length} уроков по всем заданиям ЕГЭ</p>
            </div>
            <button
              onClick={() => navigate('/theory-editor')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Редактор теории"
            >
              <Edit3 size={18} className="text-gray-500" />
            </button>
          </div>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Поиск по урокам..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-duo-green/20 border border-gray-100" />
          </div>
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            <button onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${!selectedCategory ? 'bg-duo-green text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Все</button>
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${cat === selectedCategory ? 'bg-duo-green text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{cat}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="px-4 py-4 max-w-2xl mx-auto space-y-3">
        {filtered.map((lesson, index) => {
          const tc = theoryTestsCompleted[lesson.taskNumber]
          const score = tc?.score ?? 0
          const completed = tc?.completed ?? false
          const isPerfect = completed && score === 100
          const isPartial = completed && score >= 70 && score < 100
          const isWeak = completed && score < 70

          const cardBorder = isPerfect
            ? 'border-duo-green ring-1 ring-duo-green/20'
            : isPartial
            ? 'border-amber-300 ring-1 ring-amber-200'
            : isWeak
            ? 'border-red-200 ring-1 ring-red-100'
            : 'border-gray-100'

          const iconBg = isPerfect
            ? 'bg-duo-green/10'
            : isPartial
            ? 'bg-amber-50'
            : isWeak
            ? 'bg-red-50'
            : 'bg-duo-blue/10'

          const Icon = isPerfect
            ? CheckCircle
            : isPartial
            ? Star
            : isWeak
            ? AlertCircle
            : BookOpen

          const iconColor = isPerfect
            ? 'text-duo-green'
            : isPartial
            ? 'text-amber-500'
            : isWeak
            ? 'text-red-400'
            : 'text-duo-blue'

          return (
            <button
              key={lesson.taskNumber + '-' + index}
              onClick={() => setSelectedLesson(lesson)}
              className={`w-full text-left bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border active:scale-[0.98] ${cardBorder}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
                  <Icon size={18} className={iconColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-xs text-gray-500 font-medium">{lesson.category}</p>
                    {completed && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isPerfect
                          ? 'bg-duo-green text-white'
                          : isPartial
                          ? 'bg-amber-400 text-white'
                          : 'bg-red-300 text-white'
                      }`}>
                        {score}%
                      </span>
                    )}
                    {!completed && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-400">
                        Новое
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-gray-800 text-sm">
                    Задание {lesson.taskNumber === 'Сочинение' ? '27 (Сочинение)' : lesson.taskNumber}. {lesson.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                    {lesson.theoryText.slice(0, 120)}...
                  </p>
                </div>
              </div>
            </button>
          )
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <BookOpen size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">Ничего не найдено</p>
          </div>
        )}
      </div>
    </div>
  )
}
