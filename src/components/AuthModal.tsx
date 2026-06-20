import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LogIn, Mail, Lock, Chrome, Eye, EyeOff, X, Loader2, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react'
import { supabase, isSupabaseConfigured, signInWithEmail, signUpWithEmail, signInWithGoogle, resetPasswordForEmail } from '../lib/supabase'
import { useProgressStore } from '../stores/progressStore'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'register' | 'forgotPassword'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const setUserId = useProgressStore((s) => s.setUserId)
  const loadProgress = useProgressStore((s) => s.loadProgress)
  const setUserName = useProgressStore((s) => s.setUserName)

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setError(null)
    setSuccess(null)
    setLoading(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!email.trim() || !password.trim()) {
      setError('Введите email и пароль')
      return
    }

    setLoading(true)
    const { data, error } = await signInWithEmail(email.trim(), password)
    setLoading(false)

    if (error) {
      setError(error.message || 'Ошибка входа')
      return
    }

    if (data?.user) {
      setUserId(data.user.id)
      if (data.user.user_metadata?.name) {
        setUserName(data.user.user_metadata.name)
      } else if (data.user.email) {
        setUserName(data.user.email.split('@')[0])
      }
      await loadProgress()
      setSuccess('Вход выполнен!')
      setTimeout(() => {
        handleClose()
        navigate('/profile')
      }, 800)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!email.trim() || !password.trim()) {
      setError('Введите email и пароль')
      return
    }
    if (password.length < 6) {
      setError('Пароль должен быть не менее 6 символов')
      return
    }

    setLoading(true)
    const { data, error } = await signUpWithEmail(email.trim(), password)
    setLoading(false)

    if (error) {
      setError(error.message || 'Ошибка регистрации')
      return
    }

    if (data?.user) {
      setUserId(data.user.id)
      if (data.user.email) {
        setUserName(data.user.email.split('@')[0])
      }
      setSuccess('Регистрация успешна! Проверьте email для подтверждения.')
      setTimeout(() => {
        handleClose()
        navigate('/profile')
      }, 1200)
    } else {
      setSuccess('Регистрация успешна! Проверьте email.')
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!email.trim()) {
      setError('Введите email')
      return
    }

    setLoading(true)
    const { error } = await resetPasswordForEmail(email.trim())
    setLoading(false)

    if (error) {
      setError(error.message || 'Ошибка отправки ссылки')
      return
    }

    setSuccess('Ссылка для сброса пароля отправлена на email!')
  }

  const handleGoogleLogin = async () => {
    setError(null)
    setSuccess(null)
    setLoading(true)
    const { error } = await signInWithGoogle()
    setLoading(false)
    if (error) {
      setError(error.message || 'Ошибка входа через Google')
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Синхронизация</h2>
                <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
              <div className="flex items-start gap-3 text-amber-700 bg-amber-50 rounded-xl p-4">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <p className="text-sm">Supabase не настроен. Добавьте переменные окружения VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                {mode === 'forgotPassword' && (
                  <button
                    onClick={() => { setMode('login'); setError(null); setSuccess(null); }}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ArrowLeft size={20} className="text-gray-500" />
                  </button>
                )}
                <div className="w-10 h-10 rounded-xl bg-duo-green/10 flex items-center justify-center">
                  <LogIn size={20} className="text-duo-green" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {mode === 'login' ? 'Вход' : mode === 'register' ? 'Регистрация' : 'Восстановление пароля'}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {mode === 'login' ? 'Войдите в аккаунт' : mode === 'register' ? 'Создайте новый аккаунт' : 'Введите email для сброса пароля'}
                  </p>
                </div>
              </div>
              <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Error / Success */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-2 text-red-700 bg-red-50 rounded-xl p-3 mb-4 text-sm"
                >
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-2 text-green-700 bg-green-50 rounded-xl p-3 mb-4 text-sm"
                >
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                  <span>{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            {mode === 'forgotPassword' ? (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-duo-green/30 focus:border-duo-green transition-all text-sm"
                      disabled={loading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-duo-green text-white font-bold rounded-xl hover:bg-duo-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Отправка...</span>
                    </>
                  ) : (
                    <span>Отправить ссылку для сброса</span>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-duo-green/30 focus:border-duo-green transition-all text-sm"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Пароль</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={mode === 'register' ? 'минимум 6 символов' : '••••••'}
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-duo-green/30 focus:border-duo-green transition-all text-sm"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {mode === 'login' && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => { setMode('forgotPassword'); setError(null); setSuccess(null); }}
                      className="text-xs text-duo-green hover:underline"
                    >
                      Забыли пароль?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-duo-green text-white font-bold rounded-xl hover:bg-duo-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>{mode === 'login' ? 'Вход...' : 'Регистрация...'}</span>
                    </>
                  ) : (
                    <span>{mode === 'login' ? 'Войти' : 'Зарегистрироваться'}</span>
                  )}
                </button>
              </form>
            )}

            {/* Divider + Google OAuth + Toggle — только для login/register */}
            {mode !== 'forgotPassword' && (
              <>
                {/* Divider */}
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400">или</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Google OAuth */}
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Chrome size={18} className="text-blue-500" />
                  <span>Войти через Google</span>
                </button>

                {/* Toggle mode */}
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setMode(mode === 'login' ? 'register' : 'login')
                      setError(null)
                      setSuccess(null)
                    }}
                    className="text-sm text-duo-green hover:underline font-medium"
                  >
                    {mode === 'login' ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
