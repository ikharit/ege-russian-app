import { Section } from "../../../types"
import { task15Questions } from '../../task15Questions'

export const dooshinTask15: Section = {
    id: "section-dooshin-15",
    courseId: 'ege-russian-2025',
    title: "Дощинский: Задание 15 (знаки препинания)",
    subtitle: "Пунктуация в простом и сложном предложении",
    order: 150,
    icon: 'BookOpen',
    color: "#58cc02",
    lessons: [
      {
        id: "lesson-dooshin-15-1",
        sectionId: "section-dooshin-15",
        title: "Задание 15. Дощинский (1-30)",
        type: 'practice',
        description: "Выберите правильный вариант расстановки знаков",
        xpReward: 60,
        prerequisites: [],
        questions: task15Questions.slice(0, 30).map((q, i) => ({
          id: `qd15-${i + 1}`,
          type: 'single' as const,
          text: q.text,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          difficulty: 'easy' as const,
          xpReward: 10,
          atoms: ['task15', 'punctuation'],
        })),
      },
    ],
}

export default dooshinTask15
