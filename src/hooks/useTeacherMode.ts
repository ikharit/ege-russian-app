import { useState, useEffect } from 'react'
import { useProgressStore } from '../stores/progressStore'

export function useTeacherMode(): boolean {
  const isTeacher = useProgressStore((s) => s.isTeacher)
  const [isTeacherMode, setIsTeacherMode] = useState(() => {
    // Check URL param first
    const search = window.location.search
    const hash = window.location.hash
    const urlParams = new URLSearchParams(search)
    const hashParams = new URLSearchParams(hash.split('?')[1] || '')
    if (urlParams.get('teacher') === 'true' || hashParams.get('teacher') === 'true') {
      return true
    }
    // Check localStorage fallback
    try {
      const stored = localStorage.getItem('ege-progress-storage')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed?.state?.isTeacher === true) {
          return true
        }
      }
    } catch {}
    return isTeacher
  })

  useEffect(() => {
    if (isTeacher) {
      setIsTeacherMode(true)
    }
  }, [isTeacher])

  return isTeacherMode
}
