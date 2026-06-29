import { Section } from '../../types'
import { task15DooshinQuestions } from '../questions/task15_dooshin'

export const nnnSections: Section[] = [
  {
    id: 'section-nnn-15',
    courseId: 'ege-russian-2025',
    title: 'Н / НН',
    subtitle: 'Задание 15: правописание -н- и -нн-',
    order: 15,
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
          { id: 'q15-1', type: 'single', text: 'Как правильно?', options: ['ветреный', 'ветренный'], correctAnswer: ["ветреный"], explanation: 'Прилагательное от существительного с суффиксом -ен- (ветер → ветреный). Одно н.', difficulty: 'easy', xpReward: 10, atoms: ['task15', 'n_nn_noun_adj'] },
          { id: 'q15-2', type: 'single', text: 'Как правильно?', options: ['деревяный', 'деревянный'], correctAnswer: ["деревянный"], explanation: 'Прилагательное от существительного (дерево → деревянный).', difficulty: 'easy', xpReward: 10, atoms: ['task15', 'n_nn_noun_adj'] },
          { id: 'q15-3', type: 'single', text: 'Как правильно?', options: ['стекляный', 'стеклянный'], correctAnswer: ["стеклянный"], explanation: 'Прилагательное от существительного (стекло → стеклянный).', difficulty: 'easy', xpReward: 10, atoms: ['task15', 'n_nn_noun_adj'] },
          { id: 'q15-4', type: 'single', text: 'Как правильно?', options: ['железный', 'железнный'], correctAnswer: ["железный"], explanation: 'Одно н: железный (исключение).', difficulty: 'easy', xpReward: 10, atoms: ['task15', 'n_nn_noun_adj'] },
          { id: 'q15-5', type: 'single', text: 'Как правильно?', options: ['медный', 'меднный'], correctAnswer: ["медный"], explanation: 'Одно н: медный.', difficulty: 'easy', xpReward: 10, atoms: ['task15', 'n_nn_noun_adj'] },
          { id: 'q15-6', type: 'single', text: 'Как правильно?', options: ['каменный', 'каменый'], correctAnswer: ["каменный"], explanation: 'Прилагательное от существительного (камень → каменный).', difficulty: 'easy', xpReward: 10, atoms: ['task15', 'n_nn_noun_adj'] },
          { id: 'q15-7', type: 'single', text: 'Как правильно?', options: ['соленый', 'соленный'], correctAnswer: ["соленый"], explanation: 'Причастие с суффиксом -ен- (солить → соленый).', difficulty: 'easy', xpReward: 10, atoms: ['task15', 'n_nn_verb_adj'] },
          { id: 'q15-8', type: 'single', text: 'Как правильно?', options: ['крашеный', 'крашенный'], correctAnswer: ["крашеный"], explanation: 'Прилагательное с суффиксом -енн- (крашенный).', difficulty: 'easy', xpReward: 10, atoms: ['task15', 'n_nn_verb_adj'] },
          { id: 'q15-9', type: 'single', text: 'Как правильно?', options: ['вареный', 'варенный'], correctAnswer: ["вареный"], explanation: 'Причастие от глагола несовершенного вида (варить → вареный).', difficulty: 'easy', xpReward: 10, atoms: ['task15', 'n_nn_verb_adj'] },
          { id: 'q15-10', type: 'single', text: 'Как правильно?', options: ['куреный', 'куренный'], correctAnswer: ["куреный"], explanation: 'Причастие от глагола несовершенного вида (курить → куреный).', difficulty: 'easy', xpReward: 10, atoms: ['task15', 'n_nn_verb_adj'] },
          { id: 'q15-11', type: 'single', text: 'Как правильно?', options: ['плетеный', 'плетенный'], correctAnswer: ["плетеный"], explanation: 'Причастие от глагола несовершенного вида (плести → плетеный).', difficulty: 'easy', xpReward: 10, atoms: ['task15', 'n_nn_verb_adj'] },
          { id: 'q15-12', type: 'single', text: 'Как правильно?', options: ['потревоженный', 'потревоженый'], correctAnswer: ["потревоженный"], explanation: 'Причастие с приставкой (потревожить → потревоженный).', difficulty: 'easy', xpReward: 10, atoms: ['task15', 'n_nn_verb_adj'] },
          { id: 'q15-13', type: 'single', text: 'Как правильно?', options: ['непривитый', 'непривитный'], correctAnswer: ["непривитый"], explanation: 'Не + причастие: пишется через одно н (привить → привитый).', difficulty: 'easy', xpReward: 10, atoms: ['task15', 'n_nn_verb_adj'] },
          { id: 'q15-14', type: 'single', text: 'Как правильно?', options: ['невысказанный', 'невысказаный'], correctAnswer: ["невысказанный"], explanation: 'Не + причастие с приставкой: сохраняются две н (высказать → высказанный).', difficulty: 'easy', xpReward: 10, atoms: ['task15', 'n_nn_verb_adj'] },
          { id: 'q15-15', type: 'single', text: 'Как правильно?', options: ['бетонный', 'бетоный'], correctAnswer: ["бетонный"], explanation: 'Прилагательное от существительного (бетон → бетонный).', difficulty: 'easy', xpReward: 10, atoms: ['task15', 'n_nn_noun_adj'] },
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
          { id: 'q15-16', type: 'single', text: 'Как правильно?', options: ['граненый', 'граненный'], correctAnswer: ["граненый"], explanation: 'Причастие от глагола несовершенного вида (гранить → граненый).', difficulty: 'medium', xpReward: 12, atoms: ['task15', 'n_nn_verb_adj'] },
          { id: 'q15-17', type: 'single', text: 'Как правильно?', options: ['жареный', 'жаренный'], correctAnswer: ["жареный"], explanation: 'Причастие от глагола несовершенного вида (жарить → жареный).', difficulty: 'medium', xpReward: 12, atoms: ['task15', 'n_nn_verb_adj'] },
          { id: 'q15-18', type: 'single', text: 'Как правильно?', options: ['посаженный', 'посаженый'], correctAnswer: ["посаженный"], explanation: 'Причастие от глагола совершенного вида (посадить → посаженный).', difficulty: 'medium', xpReward: 12, atoms: ['task15', 'n_nn_verb_adj'] },
          { id: 'q15-19', type: 'single', text: 'Как правильно?', options: ['тканный', 'тканый'], correctAnswer: ["тканый"], explanation: 'Прилагательное с суффиксом -енн- (тканный).', difficulty: 'medium', xpReward: 12, atoms: ['task15', 'n_nn_verb_adj'] },
          { id: 'q15-20', type: 'single', text: 'Как правильно?', options: ['рубленый', 'рубленный'], correctAnswer: ["рубленый"], explanation: 'Прилагательное с суффиксом -енн- (рубленный).', difficulty: 'medium', xpReward: 12, atoms: ['task15', 'n_nn_verb_adj'] },
          { id: 'q15-21', type: 'single', text: 'Как правильно?', options: ['крученый', 'крученный'], correctAnswer: ["крученый"], explanation: 'Причастие от глагола несовершенного вида (крутить → крученый).', difficulty: 'medium', xpReward: 12, atoms: ['task15', 'n_nn_verb_adj'] },
          { id: 'q15-22', type: 'single', text: 'Как правильно?', options: ['медленный', 'медленый'], correctAnswer: ["медленный"], explanation: 'Прилагательное с суффиксом -енн- (медленный).', difficulty: 'medium', xpReward: 12, atoms: ['task15', 'n_nn_verb_adj'] },
          { id: 'q15-23', type: 'single', text: 'Как правильно?', options: ['ветренный', 'ветреный'], correctAnswer: ["ветреный"], explanation: 'Прилагательное от существительного с суффиксом -ен- (ветер → ветреный). Одно н.', difficulty: 'medium', xpReward: 12, atoms: ['task15', 'n_nn_noun_adj'] },
          { id: 'q15-24', type: 'single', text: 'Как правильно?', options: ['кованый', 'кованный'], correctAnswer: ["кованый"], explanation: 'Причастие от глагола несовершенного вида (ковать → кованый).', difficulty: 'medium', xpReward: 12, atoms: ['task15', 'n_nn_verb_adj'] },
          { id: 'q15-25', type: 'single', text: 'Как правильно?', options: ['железный', 'железнный'], correctAnswer: ["железный"], explanation: 'Одно н: железный (исключение).', difficulty: 'medium', xpReward: 12, atoms: ['task15', 'n_nn_noun_adj'] },
          { id: 'q15-26', type: 'single', text: 'Как правильно?', options: ['бессонный', 'бессоный'], correctAnswer: ["бессонный"], explanation: 'Прилагательное с приставкой (бессонный).', difficulty: 'medium', xpReward: 12, atoms: ['task15', 'n_nn_noun_adj'] },
          { id: 'q15-27', type: 'single', text: 'Как правильно?', options: ['покрученный', 'покрученый'], correctAnswer: ["покрученный"], explanation: 'Причастие с приставкой от глагола совершенного вида (покрутить → покрученный).', difficulty: 'medium', xpReward: 12, atoms: ['task15', 'n_nn_verb_adj'] },
          { id: 'q15-28', type: 'single', text: 'Как правильно?', options: ['невинный', 'невиный'], correctAnswer: ["невинный"], explanation: 'Не + прилагательное (невинный).', difficulty: 'medium', xpReward: 12, atoms: ['task15', 'n_nn_noun_adj'] },
          { id: 'q15-29', type: 'single', text: 'Как правильно?', options: ['непрошенный', 'непрошеный'], correctAnswer: ["непрошенный"], explanation: 'Не + причастие: сохраняются две н (просить → прошенный).', difficulty: 'medium', xpReward: 12, atoms: ['task15', 'n_nn_verb_adj'] },
          { id: 'q15-30', type: 'single', text: 'Как правильно?', options: ['сплетенный', 'сплетеный'], correctAnswer: ["сплетенный"], explanation: 'Причастие с приставкой от глагола совершенного вида (сплести → сплетенный).', difficulty: 'medium', xpReward: 12, atoms: ['task15', 'n_nn_verb_adj'] },
        ]
      },
      {
        id: 'lesson-dooshin-15-1',
        sectionId: 'section-nnn-15',
        title: 'Задание 15. Дощинский (2026)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: [],
        questions: task15DooshinQuestions
      }
    ]
  }
]
