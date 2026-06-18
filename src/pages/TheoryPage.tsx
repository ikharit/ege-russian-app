import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Search, ArrowLeft, BookOpenText, Edit3 } from 'lucide-react'
import { theoryLessons, TheoryLesson } from '../data/theoryData'
import { TheoryViewer } from '../components/TheoryViewer'

export default function TheoryPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<TheoryLesson | null>(null)

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

  if (selectedLesson) {
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
        {filtered.map((lesson, index) => (
          <button key={lesson.taskNumber + '-' + index} onClick={() => setSelectedLesson(lesson)}
            className="w-full text-left bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100 active:scale-[0.98]">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-duo-blue/10 flex items-center justify-center shrink-0">
                <BookOpen size={18} className="text-duo-blue" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium mb-0.5">{lesson.category}</p>
                <p className="font-bold text-gray-800 text-sm">Задание {lesson.taskNumber === 'Сочинение' ? '27 (Сочинение)' : lesson.taskNumber}. {lesson.title}</p>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{lesson.theoryText.slice(0, 120)}...</p>
              </div>
            </div>
          </button>
        ))}
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
