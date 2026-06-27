import { Section } from "../../../types"
import { task17Questions } from '../../task17Questions'

export const dooshinTask17: Section = {
    id: "section-dooshin-17",
    courseId: 'ege-russian-2025',
    title: "Дощинский: Задание 17 (знаки препинания)",
    subtitle: "Расставьте запятые, выберите цифры",
    order: 170,
    icon: 'BookOpen',
    color: "#58cc02",
    lessons: [
      {
        id: "lesson-dooshin-17-1",
        sectionId: "section-dooshin-17",
        title: "Вопросы 1-30",
        type: 'practice',
        description: "Выберите цифры, где нужны запятые",
        xpReward: 60,
        prerequisites: [],
        questions: task17Questions.slice(0, 30).map((q, i) => ({
          id: `qd17-${i + 1}`,
          type: 'ege-multiple' as const,
          text: q.text,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          difficulty: 'easy' as const,
          xpReward: 10,
          atoms: ['task17', 'punctuation'],
        })),
      },
    ],
}

export default dooshinTask17
