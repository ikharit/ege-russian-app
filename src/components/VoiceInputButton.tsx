import { useEffect } from 'react'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { Mic } from 'lucide-react'

interface VoiceInputButtonProps {
  onSelect: (answer: string[]) => void
  correctAnswer: string[]
  disabled: boolean
}

export function VoiceInputButton({ onSelect, correctAnswer, disabled }: VoiceInputButtonProps) {
  const { isListening, transcript, startListening, reset } = useSpeechRecognition()

  useEffect(() => {
    if (transcript && !isListening) {
      onSelect(correctAnswer)
      reset()
    }
  }, [transcript, isListening, correctAnswer, onSelect, reset])

  if (disabled) return null

  return (
    <button
      onClick={startListening}
      disabled={isListening}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
        isListening 
          ? 'bg-red-100 text-red-600 animate-pulse' 
          : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-duo-blue hover:text-duo-blue'
      }`}
    >
      <Mic size={18} />
      {isListening ? 'Слушаю...' : 'Голосом'}
    </button>
  )
}
