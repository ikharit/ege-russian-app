import { Section } from "../../../types"
import { task19Questions } from '../../questions/task19'

export const dooshinTask19: Section = {
    id: "section-dooshin-19",
    courseId: 'ege-russian-2025',
    title: "Дощинский: Задание 19 (запятые в сложных предложениях)",
    subtitle: "Укажите цифры, на местах которых нужно поставить запятые",
    order: 190,
    icon: 'BookOpen',
    color: "#58cc02",
    lessons: [
      {
        id: "lesson-dooshin-19-1",
        sectionId: "section-dooshin-19",
        title: "Задание 19. Дощинский 2026 (1-50)",
        type: 'practice',
        description: "Расставьте пропущенные запятые в сложных предложениях",
        xpReward: 60,
        prerequisites: [],
        questions: task19Questions.map((q, i) => ({
          id: `qd19-${i + 1}`,
          type: 'ege-multiple' as const,
          text: q.text,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          difficulty: 'easy' as const,
          xpReward: 10,
          atoms: ['task19', 'punctuation'],
        })),
      },
    ],
}

export default dooshinTask19
