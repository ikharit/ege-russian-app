import { task18Questions } from '../data/questions/task18'
import { SimpleTrainerPage } from './SimpleTrainerPage'

export function Task18Trainer() {
  return (
    <SimpleTrainerPage
      title="Вводные слова и обращения"
      taskNumber="18"
      questions={task18Questions}
      promptText="Выберите предложения, где нужна одна запятая."
    />
  )
}
