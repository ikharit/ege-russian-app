import { Section } from "../../../types"
import { task14Questions } from '../../task14Questions'

export const dooshinTask14: Section = {
    id: "section-dooshin-14",
    courseId: 'ege-russian-2025',
    title: "Дощинский: Задание 14 (НЕ/НИ с наречиями)",
    subtitle: "Слитно, раздельно, дефис с НЕ и НИ",
    order: 140,
    icon: 'BookOpen',
    color: "#58cc02",
    lessons: [
      {
        id: "lesson-dooshin-14-1",
        sectionId: "section-dooshin-14",
        title: "Вопросы 1-30",
        type: 'practice',
        description: "Выберите правильный вариант написания",
        xpReward: 60,
        prerequisites: [],
        questions: task14Questions.slice(0, 30).map((q, i) => ({
          id: `qd14-${i + 1}`,
          type: 'single' as const,
          text: q.text,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          difficulty: 'easy' as const,
          xpReward: 10,
          atoms: ['task14', 'ne-adverbs'],
        })),
      },
    ],
}

export default dooshinTask14
