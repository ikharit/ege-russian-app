import { SwipeTrainerPage } from './SwipeTrainerPage'
import { task25Questions } from '../data/task25Questions'

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
