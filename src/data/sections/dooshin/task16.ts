import { Section } from "../../../types"
import { task16Questions } from '../../questions/task16'

export const dooshinTask16: Section = {
    id: "section-dooshin-16",
    courseId: 'ege-russian-2025',
    title: "Дощинский: Задание 16 (предложения)",
    subtitle: "Укажите предложение, в котором нужна запятая",
    order: 160,
    icon: 'BookOpen',
    color: "#58cc02",
    lessons: [
      {
        id: "lesson-dooshin-16-1",
        sectionId: "section-dooshin-16",
        title: "Вопросы 1-30",
        type: 'practice',
        description: "Выберите предложение, в котором нужна запятая",
        xpReward: 60,
        prerequisites: [],
        questions: task16Questions.slice(0, 30).map((q, i) => ({
          id: `qd16-${i + 1}`,
          type: 'single' as const,
          text: q.text,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          difficulty: 'easy' as const,
          xpReward: 10,
          atoms: ['task16', 'punctuation'],
        })),
      },
    ],
}

export default dooshinTask16
