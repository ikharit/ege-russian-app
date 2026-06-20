import { task22Questions } from '../data/task22Questions'
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
