import { Section } from '../../types'

export const grammarSections: Section[] = [
  {
    id: 'section-gram-1',
    courseId: 'ege-russian-2025',
    title: 'Грамматика: НЕ и НИ',
    subtitle: 'Правописание и пунктуация частиц',
    order: 5,
    icon: 'GraduationCap',
    color: '#ce82ff',
    lessons: [
      {
        id: 'lesson-gram-13-1',
        sectionId: 'section-gram-1',
        title: 'Задание 13. НЕ с разными частями речи',
        type: 'practice',
        description: 'Правописание НЕ с наречиями, прилагательными, деепричастиями',
        xpReward: 60,
        prerequisites: [],
        questions: [
          { id: 'q13-1', type: 'single', text: 'Как написать? (не)умолимый', options: ['неумолимый', 'не умолимый'], correctAnswer: ['неумолимый'], explanation: 'НЕ с прилагательным пишется слитно, если нет противопоставления.', difficulty: 'easy', xpReward: 10, atoms: ['prefix_ne_ni'] },
          { id: 'q13-2', type: 'single', text: 'Как написать? (не)вежливо', options: ['невежливо', 'не вежливо'], correctAnswer: ['невежливо'], explanation: 'НЕ с наречием на -о пишется слитно.', difficulty: 'easy', xpReward: 10, atoms: ['prefix_ne_ni'] },
          { id: 'q13-3', type: 'single', text: 'Как написать? (не)смотря на дождь', options: ['несмотря', 'не смотря'], correctAnswer: ['несмотря'], explanation: '«Несмотря на» — слитно (предлог).', difficulty: 'easy', xpReward: 10, atoms: ['prefix_ne_ni'] },
          { id: 'q13-4', type: 'single', text: 'Как написать? (не)добросовестный', options: ['недобросовестный', 'не добросовестный'], correctAnswer: ['недобросовестный'], explanation: 'НЕ с прилагательным без противопоставления — слитно.', difficulty: 'easy', xpReward: 10, atoms: ['prefix_ne_ni'] },
        ]
      },
      {
        id: 'lesson-gram-14-1',
        sectionId: 'section-gram-1',
        title: 'Задание 14. НИ- и НЕ-',
        type: 'practice',
        description: 'Различение частиц НИ и НЕ в отрицательных конструкциях',
        xpReward: 70,
        prerequisites: ['lesson-gram-13-1'],
        questions: [
          { id: 'q14-1', type: 'single', text: 'Как написать? (ни/не) кто (ни/не) что', options: ['никто ничего', 'не кто не что', 'ни кто ни что'], correctAnswer: ['никто ничего'], explanation: 'Отрицательные местоимения с НИ пишутся слитно.', difficulty: 'medium', xpReward: 12, atoms: ['prefix_ne_ni'] },
          { id: 'q14-2', type: 'single', text: 'Как написать? (ни/не) один из нас', options: ['ни один', 'не один'], correctAnswer: ['ни один'], explanation: '«Ни один» — усилительная частица НИ.', difficulty: 'medium', xpReward: 12, atoms: ['prefix_ne_ni'] },
        ]
      }
    ]
  }
]
