import { useTask5Store } from '../../stores/task5Store'

export function Task5MiniProgress() {
  const { getOverallProgress } = useTask5Store()
  const { total, passed } = getOverallProgress()
  const pct = total > 0 ? (passed / total) * 100 : 0

  return (
    <div className="w-16">
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[10px] text-gray-400 mt-0.5 text-right">{passed}/{total}</p>
    </div>
  )
}
