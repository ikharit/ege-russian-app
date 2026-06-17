import { Section } from '../../types'
import { task10Questions } from '../atomization/task10Questions'

export const atomizationSections: Section[] = [
  {
    id: 'section-atomization',
    courseId: 'ege-russian-2025',
    title: 'Атомизация приставок',
    subtitle: 'Задание 10: 70 вопросов по атомарным категориям',
    order: 6,
    icon: 'Sparkles',
    color: '#ff6b6b',
    lessons: [
      {
        id: 'lesson-atom-10-1',
        sectionId: 'section-atomization',
        title: 'ПРЕ- / ПРИ- (словарные)',
        type: 'practice',
        description: 'Словарные слова с приставками ПРЕ- и ПРИ-',
        xpReward: 50,
        prerequisites: [],
        questions: task10Questions.filter(q => q.atoms?.includes('pre_pri_dict'))
      },
      {
        id: 'lesson-atom-10-2',
        sectionId: 'section-atomization',
        title: 'ПРЕ- / ПРИ- (проверяемые)',
        type: 'practice',
        description: 'Проверяемые приставки ПРЕ- и ПРИ-',
        xpReward: 50,
        prerequisites: ['lesson-atom-10-1'],
        questions: task10Questions.filter(q => q.atoms?.includes('pre_pri_verif'))
      },
      {
        id: 'lesson-atom-10-3',
        sectionId: 'section-atomization',
        title: 'ВС- / ВЗ- / РАС- / РАЗ-',
        type: 'practice',
        description: 'Изменяемые приставки по глухости/звонкости',
        xpReward: 50,
        prerequisites: ['lesson-atom-10-1'],
        questions: task10Questions.filter(q => q.atoms?.includes('z_s_vz_vs') || q.atoms?.includes('ra_ro_vowel') || q.atoms?.includes('z_s_deaf'))
      },
      {
        id: 'lesson-atom-10-4',
        sectionId: 'section-atomization',
        title: 'Разделительный Ъ и Ь',
        type: 'practice',
        description: 'Въезд, объявить, субъективный, обезьяний',
        xpReward: 50,
        prerequisites: ['lesson-atom-10-1'],
        questions: task10Questions.filter(q => q.atoms?.includes('hard_sign') || q.atoms?.includes('soft_sign'))
      },
      {
        id: 'lesson-atom-10-5',
        sectionId: 'section-atomization',
        title: 'ИЗ- / ИС- / СЫ- / БЕЗ- / БЕС-',
        type: 'practice',
        description: 'Приставки с чередованием согласных',
        xpReward: 50,
        prerequisites: ['lesson-atom-10-3'],
        questions: task10Questions.filter(q => q.atoms?.includes('z_s_iz_is') || q.atoms?.includes('prefix_y_i') || q.atoms?.includes('z_s_deaf'))
      },
      {
        id: 'lesson-atom-10-6',
        sectionId: 'section-atomization',
        title: 'Неизменяемые и сложные приставки',
        type: 'practice',
        description: 'ЧЕРЕС-, СВЕРХ-, ТРЁХ-, ПРА-, ПРО- и др.',
        xpReward: 50,
        prerequisites: ['lesson-atom-10-4'],
        questions: task10Questions.filter(q => q.atoms?.includes('unch_compound') || q.atoms?.includes('prefix_pra_pro') || q.atoms?.includes('prefix_unchangeable'))
      },
      {
        id: 'lesson-atom-10-mixed',
        sectionId: 'section-atomization',
        title: 'Задание 10. Смешанный тренинг',
        type: 'practice',
        description: 'Все категории приставок вперемешку',
        xpReward: 70,
        prerequisites: ['lesson-atom-10-2', 'lesson-atom-10-3', 'lesson-atom-10-4', 'lesson-atom-10-5', 'lesson-atom-10-6'],
        questions: task10Questions
      }
    ]
  }
]
