import { Section } from "../../../types"
import { task13Questions } from '../../task13Questions'

export const dooshinTask13: Section = {
    id: "section-dooshin-13",
    courseId: 'ege-russian-2025',
    title: "Дощинский: Задание 13 (НЕ с причастиями)",
    subtitle: "Слитно, раздельно, дефис с НЕ",
    order: 130,
    icon: 'BookOpen',
    color: "#58cc02",
    lessons: [
      {
        id: "lesson-dooshin-13-1",
        sectionId: "section-dooshin-13",
        title: "Вопросы 1-30",
        type: 'practice',
        description: "Выберите правильный вариант написания",
        xpReward: 60,
        prerequisites: [],
        questions: task13Questions.slice(0, 30).map((q, i) => ({
          id: `qd13-${i + 1}`,
          type: 'single' as const,
          text: q.text,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          difficulty: 'easy' as const,
          xpReward: 10,
          atoms: ['task13', 'ne-participles'],
        })),
      },
    ],
}

export default dooshinTask13
