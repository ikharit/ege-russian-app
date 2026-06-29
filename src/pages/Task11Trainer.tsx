import { task11Questions } from '../data/questions/task11'
import { SimpleTrainerPage } from './SimpleTrainerPage'

export function Task11Trainer() {
  return (
    <SimpleTrainerPage
      title="Суффиксы прилагательных"
      taskNumber="11"
      questions={task11Questions}
      promptText="Вставьте пропущенные буквы в суффикс прилагательного"
    />
  )
}
