import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Users, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useClassStore } from '../stores/classStore'
import { useStudentStore } from '../stores/studentStore'
import { useProgressStore } from '../stores/progressStore'

export function JoinClass() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [status, setStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [joinedClass, setJoinedClass] = useState<{ name: string; teacherName: string } | null>(null)

  const joinClass = useClassStore((s) => s.joinClass)
  const getClassByCode = useClassStore((s) => s.getClassByCode)
  const activeProfile = useStudentStore((s) => s.getActiveProfile())
  const userStats = useProgressStore((s) => s.userStats)

  const handleCodeChange = (value: string) => {
    const upper = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)
    setCode(upper)
    if (status !== 'idle') {
      setStatus('idle')
      setErrorMsg('')
    }
  }

  const handleJoin = () => {
    if (code.length !== 6) {
      setStatus('error')
      setErrorMsg('Код должен содержать 6 символов')
      return
    }
    if (!activeProfile) {
      setStatus('error')
      setErrorMsg('Сначала создайте профиль ученика')
      return
    }

    setStatus('checking')

    const classRoom = getClassByCode(code)
    if (!classRoom) {
      setStatus('error')
      setErrorMsg('Класс с таким кодом не найден')
      return
    }

    const success = joinClass(code, activeProfile)
    if (!success) {
      setStatus('error')
      setErrorMsg('Вы уже состоите в этом классе')
      return
    }

    setJoinedClass({ name: classRoom.name, teacherName: classRoom.teacherName })
    setStatus('success')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJoin()
    }
  }

  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        navigate('/')
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [status, navigate])

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-gray-500 mb-6"
      >
        <ArrowLeft size={18} /> Назад
      </button>

      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-duo-green/10 flex items-center justify-center mx-auto mb-4">
          <Users size={32} className="text-duo-green" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Присоединиться к классу</h1>
        <p className="text-gray-500 mt-2">Введите код приглашения от учителя</p>
      </div>

      <div className="card">
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-bold text-gray-700">Код приглашения</label>
            <div className="flex gap-2 mt-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-14 rounded-xl border-2 flex items-center justify-center text-2xl font-bold font-mono transition-all ${
                    code.length > i
                      ? 'border-duo-green text-duo-green bg-duo-green/5'
                      : 'border-gray-200 text-gray-300'
                  }`}
                >
                  {code[i] || ''}
                </div>
              ))}
            </div>
            <input
              type="text"
              inputMode="text"
              autoComplete="off"
              autoCapitalize="characters"
              maxLength={6}
              className="absolute opacity-0 w-1 h-1"
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ position: 'fixed', left: '-9999px' }}
            />
            <button
              onClick={() => {
                const el = document.querySelector('input[type="text"]') as HTMLInputElement | null
                el?.focus()
              }}
              className="w-full mt-3 p-4 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-duo-green hover:text-duo-green transition-colors text-sm font-medium"
            >
              Нажмите, чтобы ввести код
            </button>
          </div>

          {status === 'error' && (
            <motion.div
              className="flex items-center gap-2 p-3 bg-duo-red/10 rounded-xl text-duo-red text-sm"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle size={16} />
              {errorMsg}
            </motion.div>
          )}

          {status === 'success' && joinedClass && (
            <motion.div
              className="flex items-center gap-2 p-3 bg-duo-green/10 rounded-xl text-duo-green text-sm"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <CheckCircle size={16} />
              Вы присоединились к классу «{joinedClass.name}» ({joinedClass.teacherName})!
            </motion.div>
          )}

          <button
            onClick={handleJoin}
            disabled={code.length !== 6 || status === 'checking' || status === 'success'}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {status === 'checking' ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Проверка...
              </>
            ) : status === 'success' ? (
              <>
                <CheckCircle size={18} />
                Присоединено!
              </>
            ) : (
              <>
                <Users size={18} />
                Присоединиться
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-400">
          Нет кода? Попросите учителя создать класс и дать вам код приглашения.
        </p>
      </div>
    </div>
  )
}
