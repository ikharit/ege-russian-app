import { Section } from "../../../types"
import { task18Questions } from '../../task18Questions'

export const dooshinTask18: Section = {
    id: "section-dooshin-18",
    courseId: 'ege-russian-2025',
    title: "Дощинский: Задание 18 (вводные слова)",
    subtitle: "Укажите предложения, где нужна одна запятая",
    order: 180,
    icon: 'BookOpen',
    color: "#58cc02",
    lessons: [
      {
        id: "lesson-dooshin-18-1",
        sectionId: "section-dooshin-18",
        title: "Вопросы 1-30",
        type: 'practice',
        description: "Выберите предложения, где нужна одна запятая",
        xpReward: 60,
        prerequisites: [],
        questions: task18Questions.slice(0, 30).map((q, i) => ({
          id: `qd18-${i + 1}`,
          type: 'multiple' as const,
          text: `${q.text}\n\n${q.options.map((opt, idx) => `${idx + 1}. ${opt}`).join('\n')}`,
          options: q.options.map((_, idx) => String(idx + 1)),
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          difficulty: 'easy' as const,
          xpReward: 10,
          atoms: ['task18', 'punctuation'],
        })),
      },
    ],
}

export default dooshinTask18
