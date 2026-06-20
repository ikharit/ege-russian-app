let voicesLoaded = false
let ruVoices: SpeechSynthesisVoice[] = []

function loadVoices(): SpeechSynthesisVoice[] {
  if (voicesLoaded) return ruVoices
  const all = window.speechSynthesis.getVoices()
  ruVoices = all.filter(v => v.lang.startsWith('ru'))
  voicesLoaded = true
  return ruVoices
}

window.speechSynthesis.onvoiceschanged = () => {
  voicesLoaded = false
  loadVoices()
}

export function speak(text: string): void {
  if (!window.speechSynthesis) return
  const voices = loadVoices()
  if (voices.length === 0) return

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'ru-RU'
  utterance.voice = voices[0]
  utterance.rate = 0.9
  utterance.pitch = 1

  window.speechSynthesis.cancel() // stop any current speech
  window.speechSynthesis.speak(utterance)
}

export function stopSpeaking(): void {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
}

export function isTTSAvailable(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}
