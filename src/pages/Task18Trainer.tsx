import { task18Questions } from '../data/task18Questions'
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
