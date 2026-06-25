import { Section } from "../../../types"
import { task16Questions } from '../../task16Questions'

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
        title: "Задание 16. Дощинский (1-30)",
        type: 'practice',
        description: "Выберите предложение, в котором нужна запятая",
        xpReward: 60,
        prerequisites: [],
        questions: task16Questions.slice(0, 30).map((q, i) => ({
          id: `qd16-${i + 1}`,
          type: 'single' as const,
          text: `${q.instruction}\n\n1) ${q.sentences[0].text}\n2) ${q.sentences[1].text}\n3) ${q.sentences[2].text}\n4) ${q.sentences[3].text}`,
          options: ["1", "2", "3", "4"],
          correctAnswer: [String(q.correctAnswer)],
          explanation: q.explanation,
          difficulty: 'easy' as const,
          xpReward: 10,
          atoms: ['task16', 'punctuation'],
        })),
      },
    ],
}

export default dooshinTask16
