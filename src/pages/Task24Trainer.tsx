import { task24Questions } from '../data/questions/task24'
import { SimpleTrainerPage } from './SimpleTrainerPage'

export function Task24Trainer() {
  return (
    <SimpleTrainerPage
      title="Типы речи"
      taskNumber="24"
      questions={task24Questions}
      promptText="Определите тип речи."
    />
  )
}
