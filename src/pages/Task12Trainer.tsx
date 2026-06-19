import { task12Questions } from '../data/task12Questions'
import { SimpleTrainerPage } from './SimpleTrainerPage'

export function Task12Trainer() {
  return (
    <SimpleTrainerPage
      title="Окончания причастий"
      taskNumber="12"
      questions={task12Questions}
      promptText="Выберите правильное окончание причастия или деепричастия"
    />
  )
}
