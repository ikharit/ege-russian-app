import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, ChevronDown, ChevronUp, Megaphone, BookOpen, Wrench, Star, History, Cog } from 'lucide-react'
import { RELEASE_NOTES, LATEST_VERSION } from '../data/releaseNotes'

const STORAGE_KEY = 'ege-release-notes-dismissed'

function getDismissedVersion(): string | null {
  try { return localStorage.getItem(STORAGE_KEY) } catch { return null }
}

function setDismissedVersion(version: string) {
  try { localStorage.setItem(STORAGE_KEY, version) } catch {}
}

function getBulletIcon(type: string, size: number = 13) {
  switch (type) {
    case 'ege-important': return <Star size={size} className="text-duo-yellow shrink-0 mt-0.5" fill="currentColor" />
    case 'feature': return <Sparkles size={size} className="text-duo-green shrink-0 mt-0.5" />
    case 'fix': return <Wrench size={size} className="text-duo-blue shrink-0 mt-0.5" />
    case 'fun': return <BookOpen size={size} className="text-duo-purple shrink-0 mt-0.5" />
    case 'tech': return <Cog size={size} className="text-gray-400 shrink-0 mt-0.5" />
    default: return <Sparkles size={size} className="text-gray-400 shrink-0 mt-0.5" />
  }
}

function getBulletClass(type: string) {
  switch (type) {
    case 'ege-important': return 'bg-duo-yellow/10 text-gray-800 font-medium'
    case 'feature': return 'bg-duo-green/5 text-gray-700'
    case 'fix': return 'bg-duo-blue/5 text-gray-700'
    case 'fun': return 'bg-duo-purple/5 text-gray-700'
    case 'tech': return 'bg-gray-50 text-gray-400'
    default: return 'bg-gray-50 text-gray-700'
  }
}

export function ReleaseNotesWidget() {
  const [expanded, setExpanded] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const dismissed = getDismissedVersion()

  const latest = RELEASE_NOTES[0] as any
  const isUnread = dismissed !== LATEST_VERSION

  // Важные пункты — только ege-important для свёрнутого вида
  const importantBullets = latest.bullets.filter((b: any) => b.type === 'ege-important')
  // Остальные (feature/fix/fun) для развёрнутого
  const otherBullets = latest.bullets.filter((b: any) => ['feature', 'fix', 'fun'].includes(b.type))
  // Технические — tech
  const techBullets = latest.bullets.filter((b: any) => b.type === 'tech')

  const handleDismiss = () => {
    setDismissedVersion(LATEST_VERSION)
    setExpanded(false)
  }

  // Если пользователь уже закрыл эту версию и не разворачивал — показываем кнопку "Что нового"
  if (!isUnread && !expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-duo-blue/10 to-duo-purple/10 border border-duo-blue/20 rounded-xl text-sm text-duo-blue font-bold hover:from-duo-blue/20 hover:to-duo-purple/20 transition-all"
      >
        <Megaphone size={16} />
        Что нового
        <span className="text-[10px] bg-duo-yellow text-gray-800 px-1.5 py-0.5 rounded font-bold">{RELEASE_NOTES.length}</span>
      </button>
    )
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl border overflow-hidden ${latest.highlighted ? 'border-duo-yellow/20 bg-gradient-to-br from-duo-yellow/5 to-white' : 'border-gray-100 bg-white'}`}
      >
        {/* Header — всегда виден */}
        <div
          className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50/50 transition-colors"
          onClick={() => setExpanded(!expanded)}
        >
          <span className="text-xl shrink-0">{latest.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="font-bold text-sm text-gray-800 truncate">{latest.title}</p>
              {isUnread && (
                <span className="px-1.5 py-0.5 bg-duo-red text-white text-[9px] font-bold rounded-full uppercase tracking-wide shrink-0">
                  NEW
                </span>
              )}
            </div>
            <p className="text-[10px] text-gray-400">v{latest.version} • {latest.date}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {isUnread && (
              <button
                onClick={(e) => { e.stopPropagation(); handleDismiss() }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                title="Прочитано"
              >
                <X size={14} className="text-gray-400" />
              </button>
            )}
            {expanded ? (
              <ChevronUp size={16} className="text-gray-400" />
            ) : (
              <ChevronDown size={16} className="text-gray-400" />
            )}
          </div>
        </div>

        {/* Collapsed content — только важные пункты */}
        <AnimatePresence>
          {!expanded && importantBullets.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="px-3 pb-2"
            >
              <div className="space-y-1.5">
                {importantBullets.map((b: any, i: number) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2 p-2 rounded-lg text-xs ${getBulletClass(b.type)}`}
                  >
                    {getBulletIcon(b.type)}
                    <span>{b.text}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowHistory(true)}
                className="mt-2 text-[11px] text-gray-400 hover:text-duo-blue font-medium hover:underline flex items-center gap-1"
              >
                <History size={12} />
                Вся история правок/версий →
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expanded content — 3 уровня */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="px-3 pb-3"
            >
              {/* Важные пункты — крупно */}
              {importantBullets.length > 0 && (
                <div className="space-y-1.5 mb-2">
                  {importantBullets.map((b: any, i: number) => (
                    <div
                      key={`imp-${i}`}
                      className="flex flex-col gap-0.5 p-2.5 rounded-lg bg-duo-yellow/10 border border-duo-yellow/20"
                    >
                      <div className="flex items-start gap-2">
                        <Star size={14} className="text-duo-yellow shrink-0 mt-0.5" fill="currentColor" />
                        <span className="text-sm font-medium text-gray-800">{b.text}</span>
                      </div>
                      {b.impact && (
                        <span className="text-xs text-gray-500 italic ml-6">{b.impact}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Остальные (feature/fix/fun) — мелко */}
              {otherBullets.length > 0 && (
                <div className="space-y-1.5 mb-2">
                  {otherBullets.map((b: any, i: number) => (
                    <div
                      key={`oth-${i}`}
                      className={`flex flex-col gap-0.5 p-2 rounded-lg text-xs ${getBulletClass(b.type)}`}
                    >
                      <div className="flex items-start gap-2">
                        {getBulletIcon(b.type)}
                        <span>{b.text}</span>
                      </div>
                      {b.impact && (
                        <span className="text-[10px] text-gray-500 italic ml-5">{b.impact}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Технические — ещё мельче */}
              {techBullets.length > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-px flex-1 bg-gray-100" />
                    <span className="text-[8px] uppercase tracking-wider text-gray-300 font-medium shrink-0">Под капотом</span>
                    <div className="h-px flex-1 bg-gray-100" />
                  </div>
                  {techBullets.map((b: any, i: number) => (
                    <div
                      key={`tech-${i}`}
                      className="flex items-start gap-2 py-1 px-2 rounded text-[9px] text-gray-400"
                    >
                      <Cog size={9} className="shrink-0 mt-0.5 text-gray-300" />
                      <span>{b.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Футер */}
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => setShowHistory(true)}
                  className="text-[11px] text-duo-blue font-bold hover:underline flex items-center gap-1"
                >
                  <History size={12} />
                  Вся история правок/версий →
                </button>
              </div>

              {isUnread && (
                <button
                  onClick={handleDismiss}
                  className="w-full py-2 mt-2 bg-duo-green text-white text-xs font-bold rounded-xl hover:bg-duo-green/90 transition-colors"
                >
                  Понятно, круто! 🚀
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Full History Modal */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowHistory(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <History size={20} className="text-duo-blue" />
                  <h2 className="font-bold text-gray-800">История правок и версий</h2>
                </div>
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <div className="p-4 space-y-5">
                {RELEASE_NOTES.map((note, idx) => {
                  const important = note.bullets.filter((b: any) => b.type === 'ege-important')
                  const others = note.bullets.filter((b: any) => ['feature', 'fix', 'fun'].includes(b.type))
                  const tech = note.bullets.filter((b: any) => b.type === 'tech')
                  return (
                    <div
                      key={note.version}
                      className={`rounded-xl border overflow-hidden ${idx === 0 ? 'border-duo-yellow/30 bg-duo-yellow/5' : 'border-gray-100 bg-gray-50'}`}
                    >
                      {/* Header */}
                      <div className="p-3 border-b border-gray-100/50">
                        <div className="flex items-center gap-2">
                          <span className="text-xl shrink-0">{note.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-gray-800 truncate">{note.title}</p>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              <p className="text-[10px] text-gray-400">v{note.version} • {note.date}</p>
                              <span className="text-[10px] text-gray-400">
                                {important.length} ключевых{others.length > 0 ? ` · ${others.length} обычных` : ''}{tech.length > 0 ? ` · ${tech.length} технических` : ''}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Important bullets — крупно, заметно */}
                      {important.length > 0 && (
                        <div className="p-3 space-y-2">
                          {important.map((b: any, i: number) => (
                            <div
                              key={i}
                              className="flex flex-col gap-1 p-3 rounded-lg bg-duo-yellow/10 border border-duo-yellow/20"
                            >
                              <div className="flex items-start gap-2">
                                <Star size={14} className="text-duo-yellow shrink-0 mt-0.5" fill="currentColor" />
                                <span className="text-sm font-medium text-gray-800">{b.text}</span>
                              </div>
                              {b.impact && (
                                <span className="text-xs text-gray-500 italic ml-6">{b.impact}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Other bullets (feature/fix/fun) — мелко, компактно */}
                      {others.length > 0 && (
                        <div className="px-3 pb-2">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="h-px flex-1 bg-gray-200" />
                            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium shrink-0">Остальные изменения</span>
                            <div className="h-px flex-1 bg-gray-200" />
                          </div>
                          <div className="space-y-1">
                            {others.map((b: any, i: number) => (
                              <div
                                key={i}
                                className="flex flex-col gap-0.5 p-2 rounded-lg bg-gray-100/60 text-xs text-gray-600"
                              >
                                <div className="flex items-start gap-2">
                                  {getBulletIcon(b.type, 12)}
                                  <span>{b.text}</span>
                                </div>
                                {b.impact && (
                                  <span className="text-[10px] text-gray-400 italic ml-5">{b.impact}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tech bullets — микро-шрифт, ещё мельче */}
                      {tech.length > 0 && (
                        <div className="px-3 pb-3">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="h-px flex-1 bg-gray-100" />
                            <span className="text-[8px] uppercase tracking-wider text-gray-300 font-medium shrink-0">Под капотом</span>
                            <div className="h-px flex-1 bg-gray-100" />
                          </div>
                          <div className="space-y-0.5">
                            {tech.map((b: any, i: number) => (
                              <div
                                key={i}
                                className="flex items-start gap-1.5 py-0.5 px-1.5 rounded text-[9px] text-gray-400"
                              >
                                <Cog size={9} className="shrink-0 mt-0.5 text-gray-300" />
                                <span>{b.text}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
