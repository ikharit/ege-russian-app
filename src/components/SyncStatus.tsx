import { useFirebaseStore } from '../stores/firebaseStore'

export function SyncStatus() {
  const isOnline = useFirebaseStore((s) => s.isOnline)
  const isSyncing = useFirebaseStore((s) => s.isSyncing)
  const lastSync = useFirebaseStore((s) => s.lastSync)

  let statusText = 'Синхронизировано'
  let statusEmoji = '🟢'

  if (!isOnline) {
    statusText = 'Оффлайн'
    statusEmoji = '🔴'
  } else if (isSyncing) {
    statusText = 'Синхронизация...'
    statusEmoji = '🟡'
  }

  return (
    <div
      className="flex items-center gap-1"
      title={
        lastSync
          ? `Последняя синхронизация: ${new Date(lastSync).toLocaleString('ru-RU')}`
          : 'Синхронизация ещё не выполнялась'
      }
    >
      <span className="text-sm leading-none">{statusEmoji}</span>
      <span className="text-xs font-medium text-gray-600">{statusText}</span>
    </div>
  )
}
