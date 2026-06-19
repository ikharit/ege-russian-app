import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, ChevronDown, ChevronUp, Megaphone, BookOpen, Wrench, Star } from 'lucide-react'
import { RELEASE_NOTES, LATEST_VERSION } from '../data/releaseNotes'

const STORAGE_KEY = 'ege-release-notes-dismissed'

function getDismissedVersion(): string | null {
  try { return localStorage.getItem(STORAGE_KEY) } catch { return null }
}

function setDismissedVersion(version: string) {
  try { localStorage.setItem(STORAGE_KEY, version) } catch {}
}

function getBulletIcon(type: string) {
  switch (type) {
    case 'ege-important': return <Star size={14} className="text-duo-yellow shrink-0 mt-0.5" fill="currentColor" />
    case 'feature': return <Sparkles size={14} className="text-duo-green shrink-0 mt-0.5" />
    case 'fix': return <Wrench size={14} className="text-duo-blue shrink-0 mt-0.5" />
    case 'fun': return <BookOpen size={14} className="text-duo-purple shrink-0 mt-0.5" />
    default: return <Sparkles size={14} className="text-gray-400 shrink-0 mt-0.5" />
  }
}

function getBulletClass(type: string) {
  switch (type) {
    case 'ege-important': return 'bg-duo-yellow/10 text-gray-800 font-medium'
    case 'feature': return 'bg-duo-green/5 text-gray-700'
    case 'fix': return 'bg-duo-blue/5 text-gray-700'
    case 'fun': return 'bg-duo-purple/5 text-gray-700'
    default: return 'bg-gray-50 text-gray-700'
  }
}

export function ReleaseNotesWidget() {
  const [expanded, setExpanded] = useState(false)
  const [dismissed, setDismissed] = useState(getDismissedVersion())
  const [showHistory, setShowHistory] = useState(false)

  const latest = RELEASE_NOTES[0] as any
  const isUnread = dismissed !== LATEST_VERSION
  const recentCount = RELEASE_NOTES.length

  useEffect(() => {
    if (isUnread) setExpanded(true)
  }, [isUnread])

  const handleDismiss = () => {
    setDismissedVersion(LATEST_VERSION)
    setDismissed(LATEST_VERSION)
    setExpanded(false)
  }

  if (!isUnread && !expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-duo-blue/10 to-duo-purple/10 border border-duo-blue/20 rounded-xl text-sm text-duo-blue font-bold hover:from-duo-blue/20 hover:to-duo-purple/20 transition-all"
      >
        <Megaphone size={16} />
        Что нового
        <span className="text-[10px] bg-duo-yellow text-gray-800 px-1.5 py-0.5 rounded font-bold">{recentCount}</span>
      </button>
    )
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`card overflow-hidden ${latest.highlighted ? 'border-duo-yellow/30 bg-gradient-to-br from-duo-yellow/5 to-white' : 'bg-white'}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{latest.emoji}</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-800">{latest.title}</h3>
                {isUnread && (
                  <span className="px-2 py-0.5 bg-duo-red text-white text-[10px] font-bold rounded-full uppercase tracking-wide">
                    NEW
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400">v{latest.version} • {latest.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </button>
            <button
              onClick={handleDismiss}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              title="Прочитано"
            >
              <X size={16} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-4 pb-4 space-y-2">
                {latest.bullets.slice(0, 4).map((b: any, i: number) => (
                  <div
                    key={i}
                    className={`flex flex-col gap-1 p-2 rounded-lg text-sm ${getBulletClass(b.type)}`}
                  >
                    <div className="flex items-start gap-2">
                      {getBulletIcon(b.type)}
                      <span>{b.text}</span>
                    </div>
                    {b.impact && (
                      <span className="text-xs text-gray-500 italic ml-6">{b.impact}</span>
                    )}
                  </div>
                ))}

                {latest.bullets.length > 4 && (
                  <button
                    onClick={() => setShowHistory(true)}
                    className="text-xs text-duo-blue font-bold hover:underline w-full text-left pt-1"
                  >
                    + {latest.bullets.length - 4} пункта и вся история →
                  </button>
                )}

                <button
                  onClick={handleDismiss}
                  className="w-full py-2 mt-2 bg-duo-green text-white text-sm font-bold rounded-xl hover:bg-duo-green/90 transition-colors"
                >
                  Понятно, круто! 🚀
                </button>
              </div>
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
                  <Megaphone size={20} className="text-duo-blue" />
                  <h2 className="font-bold text-gray-800">История версий</h2>
                </div>
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                {RELEASE_NOTES.map((note, idx) => (
                  <div
                    key={note.version}
                    className={`p-4 rounded-xl border ${idx === 0 ? 'border-duo-yellow/30 bg-duo-yellow/5' : 'border-gray-100 bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{note.emoji}</span>
                      <div>
                        <p className="font-bold text-sm text-gray-800">{note.title}</p>
                        <p className="text-xs text-gray-400">v{note.version} • {note.date}</p>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      {note.bullets.map((b: any, i: number) => (
                        <div
                          key={i}
                          className={`flex items-start gap-2 p-1.5 rounded-lg text-xs ${getBulletClass(b.type)}`}
                        >
                          {getBulletIcon(b.type)}
                          <span>{b.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
