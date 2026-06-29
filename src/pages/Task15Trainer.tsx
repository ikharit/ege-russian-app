import { task15Questions } from '../data/questions/task15'
import { SimpleTrainerPage } from './SimpleTrainerPage'

export function Task15Trainer() {
  return (
    <SimpleTrainerPage
      title="Пунктуация"
      taskNumber="15"
      questions={task15Questions}
      promptText="Выберите предложение с правильно расставленными знаками препинания"
    />
  )
}
