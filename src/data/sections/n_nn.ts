import { Section } from '../../types'

export const nnnSections: Section[] = [
  {
    id: 'section-nnn-15',
    courseId: 'ege-russian-2025',
    title: 'Н / НН',
    subtitle: 'Задание 15: правописание -н- и -нн-',
    order: 8,
    icon: 'SpellCheck',
    color: '#9b59b6',
    lessons: [
      {
        id: 'lesson-nnn-15-1',
        sectionId: 'section-nnn-15',
        title: 'Задание 15. Уровень 1',
        type: 'practice',
        description: 'Выберите правильное написание -н- или -нн-',
        xpReward: 60,
        prerequisites: [],
        questions: [
          { id: 'q15-1', type: 'single', text: 'Как правильно?', options: ['ветреный', 'ветренный'], correctAnswer: ['ветренный'], explanation: 'Прилагательное от существительного с суффиксом -ен- (ветер → ветренный).', difficulty: 'easy', xpReward: 10 },
          { id: 'q15-2', type: 'single', text: 'Как правильно?', options: ['деревяный', 'деревянный'], correctAnswer: ['деревянный'], explanation: 'Прилагательное от существительного (дерево → деревянный).', difficulty: 'easy', xpReward: 10 },
          { id: 'q15-3', type: 'single', text: 'Как правильно?', options: ['стекляный', 'стеклянный'], correctAnswer: ['стеклянный'], explanation: 'Прилагательное от существительного (стекло → стеклянный).', difficulty: 'easy', xpReward: 10 },
          { id: 'q15-4', type: 'single', text: 'Как правильно?', options: ['железный', 'железнный'], correctAnswer: ['железный'], explanation: 'Одно н: железный (исключение).', difficulty: 'easy', xpReward: 10 },
          { id: 'q15-5', type: 'single', text: 'Как правильно?', options: ['медный', 'меднный'], correctAnswer: ['медный'], explanation: 'Одно н: медный.', difficulty: 'easy', xpReward: 10 },
          { id: 'q15-6', type: 'single', text: 'Как правильно?', options: ['каменный', 'каменый'], correctAnswer: ['каменный'], explanation: 'Прилагательное от существительного (камень → каменный).', difficulty: 'easy', xpReward: 10 },
          { id: 'q15-7', type: 'single', text: 'Как правильно?', options: ['соленый', 'соленный'], correctAnswer: ['соленый'], explanation: 'Причастие с суффиксом -ен- (солить → соленый).', difficulty: 'easy', xpReward: 10 },
          { id: 'q15-8', type: 'single', text: 'Как правильно?', options: ['крашеный', 'крашенный'], correctAnswer: ['крашенный'], explanation: 'Причастие от глагола совершенного вида (красить → крашенный).', difficulty: 'easy', xpReward: 10 },
          { id: 'q15-9', type: 'single', text: 'Как правильно?', options: ['вареный', 'варенный'], correctAnswer: ['вареный'], explanation: 'Причастие от глагола несовершенного вида (варить → вареный).', difficulty: 'easy', xpReward: 10 },
          { id: 'q15-10', type: 'single', text: 'Как правильно?', options: ['куреный', 'куренный'], correctAnswer: ['куреный'], explanation: 'Причастие от глагола несовершенного вида (курить → куреный).', difficulty: 'easy', xpReward: 10 },
          { id: 'q15-11', type: 'single', text: 'Как правильно?', options: ['плетеный', 'плетенный'], correctAnswer: ['плетеный'], explanation: 'Причастие от глагола несовершенного вида (плести → плетеный).', difficulty: 'easy', xpReward: 10 },
          { id: 'q15-12', type: 'single', text: 'Как правильно?', options: ['потревоженный', 'потревоженый'], correctAnswer: ['потревоженный'], explanation: 'Причастие с приставкой (потревожить → потревоженный).', difficulty: 'easy', xpReward: 10 },
          { id: 'q15-13', type: 'single', text: 'Как правильно?', options: ['непривитый', 'непривитый'], correctAnswer: ['непривитый'], explanation: 'Не + причастие (непривитый).', difficulty: 'easy', xpReward: 10 },
          { id: 'q15-14', type: 'single', text: 'Как правильно?', options: ['неволеный', 'неволенный'], correctAnswer: ['неволенный'], explanation: 'Не + причастие с приставкой (неволенный).', difficulty: 'easy', xpReward: 10 },
          { id: 'q15-15', type: 'single', text: 'Как правильно?', options: ['бетонный', 'бетоный'], correctAnswer: ['бетонный'], explanation: 'Прилагательное от существительного (бетон → бетонный).', difficulty: 'easy', xpReward: 10 },
        ]
      },
      {
        id: 'lesson-nnn-15-2',
        sectionId: 'section-nnn-15',
        title: 'Задание 15. Уровень 2',
        type: 'practice',
        description: 'Сложные случаи -н- и -нн-',
        xpReward: 70,
        prerequisites: ['lesson-nnn-15-1'],
        questions: [
          { id: 'q15-16', type: 'single', text: 'Как правильно?', options: ['граненый', 'граненный'], correctAnswer: ['граненый'], explanation: 'Причастие от глагола несовершенного вида (гранить → граненый).', difficulty: 'medium', xpReward: 12 },
          { id: 'q15-17', type: 'single', text: 'Как правильно?', options: ['жареный', 'жаренный'], correctAnswer: ['жареный'], explanation: 'Причастие от глагола несовершенного вида (жарить → жареный).', difficulty: 'medium', xpReward: 12 },
          { id: 'q15-18', type: 'single', text: 'Как правильно?', options: ['вымытый', 'вымытый'], correctAnswer: ['вымытый'], explanation: 'Не относится к н/нн, но для примера.', difficulty: 'medium', xpReward: 12 },
          { id: 'q15-19', type: 'single', text: 'Как правильно?', options: ['тканный', 'тканый'], correctAnswer: ['тканный'], explanation: 'Причастие от глагола совершенного вида (ткать → тканный).', difficulty: 'medium', xpReward: 12 },
          { id: 'q15-20', type: 'single', text: 'Как правильно?', options: ['рубленый', 'рубленный'], correctAnswer: ['рубленный'], explanation: 'Причастие от глагола совершенного вида (рубить → рубленный).', difficulty: 'medium', xpReward: 12 },
          { id: 'q15-21', type: 'single', text: 'Как правильно?', options: ['певучий', 'певучий'], correctAnswer: ['певучий'], explanation: 'Не относится к н/нн.', difficulty: 'medium', xpReward: 12 },
          { id: 'q15-22', type: 'single', text: 'Как правильно?', options: ['медленный', 'медленый'], correctAnswer: ['медленный'], explanation: 'Прилагательное с суффиксом -енн- (медленный).', difficulty: 'medium', xpReward: 12 },
          { id: 'q15-23', type: 'single', text: 'Как правильно?', options: ['ветренный', 'ветреный'], correctAnswer: ['ветренный'], explanation: 'Прилагательное от существительного (ветер → ветренный).', difficulty: 'medium', xpReward: 12 },
          { id: 'q15-24', type: 'single', text: 'Как правильно?', options: ['знаменитый', 'знаменитый'], correctAnswer: ['знаменитый'], explanation: 'Не относится к н/нн.', difficulty: 'medium', xpReward: 12 },
          { id: 'q15-25', type: 'single', text: 'Как правильно?', options: ['железный', 'железнный'], correctAnswer: ['железный'], explanation: 'Одно н: железный (исключение).', difficulty: 'medium', xpReward: 12 },
          { id: 'q15-26', type: 'single', text: 'Как правильно?', options: ['бессонный', 'бессоный'], correctAnswer: ['бессонный'], explanation: 'Прилагательное с приставкой (бессонный).', difficulty: 'medium', xpReward: 12 },
          { id: 'q15-27', type: 'single', text: 'Как правильно?', options: ['благородный', 'благородный'], correctAnswer: ['благородный'], explanation: 'Не относится к н/нн.', difficulty: 'medium', xpReward: 12 },
          { id: 'q15-28', type: 'single', text: 'Как правильно?', options: ['невинный', 'невиный'], correctAnswer: ['невинный'], explanation: 'Не + прилагательное (невинный).', difficulty: 'medium', xpReward: 12 },
          { id: 'q15-29', type: 'single', text: 'Как правильно?', options: ['невыносимый', 'невыносимый'], correctAnswer: ['невыносимый'], explanation: 'Не относится к н/нн.', difficulty: 'medium', xpReward: 12 },
          { id: 'q15-30', type: 'single', text: 'Как правильно?', options: ['кремень', 'кремень'], correctAnswer: ['кремень'], explanation: 'Не относится к н/нн.', difficulty: 'medium', xpReward: 12 },
        ]
      }
    ]
  }
]
