import { SwipeTrainerPage } from './SwipeTrainerPage'
import { task25Questions } from '../data/questions/task25'

export function Task25SwipeTrainer() {
  return (
    <SwipeTrainerPage
      title="Задание 25. Свайп-карточки"
      taskNumber="25"
      questions={task25Questions}
      mode="multi"
    />
  )
}
