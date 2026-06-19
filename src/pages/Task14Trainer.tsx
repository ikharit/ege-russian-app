import { task14Questions } from '../data/task14Questions'
import { SimpleTrainerPage } from './SimpleTrainerPage'

export function Task14Trainer() {
  return (
    <SimpleTrainerPage
      title="Слитное/раздельное/дефисное"
      taskNumber="14"
      questions={task14Questions}
      promptText="Выберите правильное написание слова"
    />
  )
}
