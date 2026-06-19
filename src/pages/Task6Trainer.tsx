import { task6Questions } from '../data/task6Questions'
import { SimpleTrainerPage } from './SimpleTrainerPage'

export function Task6Trainer() {
  return (
    <SimpleTrainerPage
      title="Суффиксы"
      taskNumber="6"
      questions={task6Questions}
      promptText="Вставьте пропущенную букву в суффикс глагола"
    />
  )
}
