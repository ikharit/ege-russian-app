import { useMemo } from 'react'
import { useProgressStore } from '../stores/progressStore'
import { getRootAtoms, getChildAtoms, getAtomById } from '../data/atomization/atoms'
import { Target, TrendingUp, AlertTriangle, Zap } from 'lucide-react'

export function AtomRadar() {
  const atomProgress = useProgressStore((s) => s.atomProgress)
  const getWeakAtoms = useProgressStore((s) => s.getWeakAtoms)

  const weakAtoms = getWeakAtoms(70)
  const rootAtoms = getRootAtoms()

  const atomStats = useMemo(() => {
    return rootAtoms.map(atom => {
      const children = getChildAtoms(atom.id)
      const allAtomIds = [atom.id, ...children.map(c => c.id)]
      const attempts = allAtomIds.reduce((sum, id) => sum + (atomProgress[id]?.totalAttempts || 0), 0)
      const correct = allAtomIds.reduce((sum, id) => sum + (atomProgress[id]?.correctCount || 0), 0)
      const accuracy = attempts > 0 ? Math.round((correct / attempts) * 100) : 0
      return { ...atom, attempts, accuracy }
    })
  }, [atomProgress, rootAtoms])

  const hasData = atomStats.some(a => a.attempts > 0)

  if (!hasData) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Target className="text-duo-blue" size={20} />
          <h3 className="font-bold text-gray-800">Атомы знаний</h3>
        </div>
        <p className="text-sm text-gray-500">
          Пройдите уроки из раздела «Атомизация приставок», чтобы увидеть статистику по категориям.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <Target className="text-duo-blue" size={20} />
        <h3 className="font-bold text-gray-800">Атомы знаний</h3>
      </div>

      <div className="space-y-4">
        {atomStats.map(atom => (
          <div key={atom.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">{atom.name}</span>
              <div className="flex items-center gap-2">
                {atom.attempts > 0 ? (
                  <>
                    <span className={`text-xs font-bold ${atom.accuracy >= 80 ? 'text-duo-green' : atom.accuracy >= 50 ? 'text-duo-yellow' : 'text-red-500'}`}>
                      {atom.accuracy}%
                    </span>
                    <span className="text-xs text-gray-400">{atom.attempts} попыток</span>
                  </>
                ) : (
                  <span className="text-xs text-gray-400">Нет данных</span>
                )}
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  atom.accuracy >= 80 ? 'bg-duo-green' : atom.accuracy >= 50 ? 'bg-duo-yellow' : 'bg-red-400'
                }`}
                style={{ width: `${atom.attempts > 0 ? atom.accuracy : 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {weakAtoms.length > 0 && (
        <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-100">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="text-red-500" size={16} />
            <span className="text-sm font-bold text-red-700">Требуют внимания</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {weakAtoms.slice(0, 5).map(atomId => {
              const atom = getAtomById(atomId)
              const progress = atomProgress[atomId]
              return (
                <span key={atomId} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-lg">
                  {atom?.name || atomId} ({progress?.accuracy}%)
                </span>
              )
            })}
          </div>
          <p className="text-xs text-red-600 mt-2">
            Пройдите уроки с этими атомами, чтобы улучшить результат.
          </p>
        </div>
      )}
    </div>
  )
}
