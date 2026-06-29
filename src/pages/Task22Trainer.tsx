import { task22Questions } from '../data/questions/task22'
import { SimpleTrainerPage } from './SimpleTrainerPage'

export function Task22Trainer() {
  return (
    <SimpleTrainerPage
      title="Изобразительно-выразительные средства"
      taskNumber="22"
      questions={task22Questions}
      promptText="Определите средства выразительности."
    />
  )
}
