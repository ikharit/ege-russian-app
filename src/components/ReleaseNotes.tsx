import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronDown, ChevronUp, Megaphone } from 'lucide-react'
import { RELEASE_NOTES, LATEST_VERSION } from '../data/releaseNotes'

const STORAGE_KEY = 'ege-release-notes-dismissed'

function getDismissedVersion(): string | null {
  try { return localStorage.getItem(STORAGE_KEY) } catch { return null }
}

function setDismissedVersion(version: string) {
  try { localStorage.setItem(STORAGE_KEY, version) } catch {}
}

export function ReleaseNotesWidget() {
  const [expanded, setExpanded] = useState(false)
  const [dismissed, setDismissed] = useState(getDismissedVersion())
  const [showHistory, setShowHistory] = useState(false)

  const latest = RELEASE_NOTES[0]
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
              <h3 className="font-bold text-gray-800">{latest.title}</h3>
              <p className="text-xs text-gray-400">{latest.date}</p>
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
                {latest.bullets.slice(0, 3).map((text, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 rounded-lg text-sm bg-gray-50 text-gray-700"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-duo-green shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}

                {latest.bullets.length > 3 && (
                  <button
                    onClick={() => setShowHistory(true)}
                    className="text-xs text-duo-blue font-bold hover:underline w-full text-left pt-1"
                  >
                    + {latest.bullets.length - 3} пункта и вся история →
                  </button>
                )}

                <button
                  onClick={handleDismiss}
                  className="w-full py-2 mt-2 bg-duo-green text-white text-sm font-bold rounded-xl hover:bg-duo-green/90 transition-colors"
                >
                  Ок
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
                  <h2 className="font-bold text-gray-800">История</h2>
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
                        <p className="text-xs text-gray-400">{note.date}</p>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      {note.bullets.map((text, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 p-1.5 rounded-lg text-xs bg-gray-50 text-gray-700"
                        >
                          <span className="w-1 h-1 rounded-full bg-gray-300 shrink-0" />
                          <span>{text}</span>
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
