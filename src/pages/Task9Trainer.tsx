import { task9Questions } from '../data/questions/task9'
import { SimpleTrainerPage } from './SimpleTrainerPage'

export function Task9Trainer() {
  return (
    <SimpleTrainerPage
      title="Пропущенные буквы"
      taskNumber="9"
      questions={task9Questions}
      promptText="Вставьте пропущенную букву в корень слова"
    />
  )
}
