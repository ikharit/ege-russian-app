import { task25Questions } from '../data/questions/task25'
import { SimpleTrainerPage } from './SimpleTrainerPage'

export function Task25Trainer() {
  return (
    <SimpleTrainerPage
      title="Лексика. Ударения"
      taskNumber="25"
      questions={task25Questions}
      promptText="Найдите слово с неправильно поставленным ударением."
    />
  )
}
