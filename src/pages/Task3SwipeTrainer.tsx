import { SwipeTrainerPage } from './SwipeTrainerPage'
import { task3Questions } from '../data/questions/task3'

export function Task3SwipeTrainer() {
  return (
    <SwipeTrainerPage
      title="Задание 3. Свайп-карточки"
      taskNumber="3"
      questions={task3Questions}
      mode="multi"
    />
  )
}
