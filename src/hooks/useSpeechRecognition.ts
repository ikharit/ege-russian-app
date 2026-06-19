import { useState, useCallback, useRef } from 'react'

interface SpeechRecognitionResult {
  transcript: string
  confidence: number
  isFinal: boolean
}

interface UseSpeechRecognitionReturn {
  isListening: boolean
  transcript: string
  error: string | null
  startListening: () => void
  stopListening: () => void
  reset: () => void
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      setError('Голосовой ввод не поддерживается в этом браузере')
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognition.lang = 'ru-RU'
      recognition.continuous = false
      recognition.interimResults = false
      recognition.maxAlternatives = 3

      recognition.onstart = () => {
        setIsListening(true)
        setError(null)
        setTranscript('')
      }

      recognition.onresult = (event: any) => {
        const results = event.results
        if (results.length > 0) {
          const result = results[0][0]
          setTranscript(result.transcript)
        }
      }

      recognition.onerror = (event: any) => {
        if (event.error !== 'aborted') {
          setError(`Ошибка: ${event.error}`)
        }
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
      recognition.start()
    } catch (e) {
      setError('Не удалось запустить распознавание')
    }
  }, [])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }, [])

  const reset = useCallback(() => {
    setTranscript('')
    setError(null)
    setIsListening(false)
  }, [])

  return { isListening, transcript, error, startListening, stopListening, reset }
}
