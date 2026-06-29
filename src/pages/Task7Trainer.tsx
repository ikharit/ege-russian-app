import { task7Questions } from '../data/questions/task7'
import { SimpleTrainerPage } from './SimpleTrainerPage'

export function Task7Trainer() {
  return (
    <SimpleTrainerPage
      title="Окончания глаголов"
      taskNumber="7"
      questions={task7Questions}
      promptText="Выберите правильное окончание глагола"
    />
  )
}
