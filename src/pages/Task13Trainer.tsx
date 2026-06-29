import { task13Questions } from '../data/questions/task13'
import { SimpleTrainerPage } from './SimpleTrainerPage'

export function Task13Trainer() {
  return (
    <SimpleTrainerPage
      title="НЕ/НИ с причастиями"
      taskNumber="13"
      questions={task13Questions}
      promptText="Выберите правильное написание: слитно или раздельно"
    />
  )
}
