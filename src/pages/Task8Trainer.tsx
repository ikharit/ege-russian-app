import { task8Questions } from '../data/task8Questions'
import { SimpleTrainerPage } from './SimpleTrainerPage'

export function Task8Trainer() {
  return (
    <SimpleTrainerPage
      title="Слитное/раздельное"
      taskNumber="8"
      questions={task8Questions}
      promptText="Выберите правильное написание слова с НЕ"
    />
  )
}
