import { useEffect } from 'react'
import { useTeacherAnalyticsStore } from '../../stores/teacherAnalyticsStore'
import { AlertTriangle, TrendingDown, BookOpen, User } from 'lucide-react'

export function StudentErrorAnalytics() {
  const { students, loading, error, fetchStudents } = useTeacherAnalyticsStore()

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  if (loading) return <div className="p-4 text-gray-500">Загрузка аналитики...</div>
  if (error) return <div className="p-4 text-red-500">Ошибка: {error}</div>
  if (students.length === 0) return <div className="p-4 text-gray-500">Ученики не найдены. Добавьте учеников через класс.</div>

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-orange-500" />
        Аналитика ошибок учеников
      </h2>

      {students.map((student) => (
        <div key={student.studentId} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold">{student.studentName}</div>
                <div className="text-sm text-gray-500">
                  Уровень {student.level} · {student.xp} XP · streak {student.streak}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-600">Общая точность</div>
              <div className={`text-lg font-bold ${student.overallAccuracy < 70 ? 'text-red-500' : 'text-green-600'}`}>
                {student.overallAccuracy}%
              </div>
            </div>
          </div>

          {/* Проблемные слова */}
          {student.topWeakWords.length > 0 && (
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <TrendingDown className="w-4 h-4 text-red-500" />
                Проблемные слова
              </div>
              <div className="flex flex-wrap gap-2">
                {student.topWeakWords.map((w) => (
                  <span
                    key={w.word}
                    className="px-2 py-1 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100"
                    title={`Правило: ${w.ruleId || 'неизвестно'}`}
                  >
                    {w.word} ({w.wrongCount})
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Проблемные правила */}
          {student.topWeakRules.length > 0 && (
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <BookOpen className="w-4 h-4 text-orange-500" />
                Проблемные правила
              </div>
              <div className="space-y-2">
                {student.topWeakRules.map((r) => (
                  <div key={r.ruleId} className="bg-orange-50 rounded-lg p-2 border border-orange-100">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm text-orange-800">{r.ruleId}</span>
                      <span className="text-xs text-orange-600">{r.wrongCount} ошибок</span>
                    </div>
                    <div className="text-xs text-orange-600 mt-1">
                      Слова: {r.words.slice(0, 5).join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default StudentErrorAnalytics
