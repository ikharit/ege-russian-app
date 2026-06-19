import { useAccentTrainerStore } from '../../stores/accentTrainerStore'

export function AccentTrainerMiniProgress() {
  const { getOverallProgress } = useAccentTrainerStore()
  const { total, mastered } = getOverallProgress()
  const pct = total > 0 ? (mastered / total) * 100 : 0

  return (
    <div className="w-16">
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div className="bg-rose-400 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[10px] text-gray-400 mt-0.5 text-right">{mastered}/{total}</p>
    </div>
  )
}
