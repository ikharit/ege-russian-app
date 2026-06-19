import { task13Questions } from '../data/task13Questions'
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
