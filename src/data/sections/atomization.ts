import { Section } from '../../types'
import { task10Questions } from '../atomization/task10Questions'

export const atomizationSections: Section[] = [
  {
    id: 'section-atomization',
    courseId: 'ege-russian-2025',
    title: 'Приставки, Ъ и Ь',
    subtitle: 'Задание 10: правописание приставок, разделительных знаков',
    order: 10,
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
        title: 'Чередование по глухости/звонкости',
        type: 'practice',
        description: 'ВЗ/ВС, РАЗ/РАС, ИЗ/ИС, БЕЗ/БЕС, ВОЗ/ВОС, ЧРЕЗ/ЧРЕС, НИЗ/НИС',
        xpReward: 50,
        prerequisites: ['lesson-atom-10-1'],
        questions: task10Questions.filter(q =>
          q.atoms?.includes('z_s_vz_vs') ||
          q.atoms?.includes('ra_ro_vowel') ||
          q.atoms?.includes('z_s_deaf') ||
          q.atoms?.includes('z_s_iz_is')
        )
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
        title: 'Ы / И после приставки С-',
        type: 'practice',
        description: 'СЫзнова, сЫграть, съесть — когда пишется Ы, а когда И',
        xpReward: 50,
        prerequisites: ['lesson-atom-10-3'],
        questions: task10Questions.filter(q => q.atoms?.includes('prefix_y_i'))
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
        id: 'lesson-atom-10-ege',
        sectionId: 'section-atomization',
        title: 'Задание 10. Формат ЕГЭ',
        type: 'practice',
        description: 'Реальные задания в формате ЕГЭ',
        xpReward: 80,
        prerequisites: ['lesson-atom-10-6'],
        questions: [
          { id: 'q10-ege-1', type: 'ege-multiple', text: 'Укажите варианты ответов, в которых во всех словах одного ряда пропущена одна и та же буква.', options: ['1) пр_исполнен, пр_града, пр_дзащита', '2) п_ртьера, п_солить, п_дкараулить', '3) в_тражи, в_рмишель, в_стибюль', '4) че_есчур, че_есполосица', '5) р_зъехаться, р_збрать, р_счерк'], correctAnswer: ['1', '2', '4'], explanation: '1) прЕисполнен, прЕграда, прЕдзащита — везде Е. 2) пОртьера, пОсолить, пОдкараулить — везде О. 4) черЕсчур, черЕсполосица — везде С.', difficulty: 'medium', xpReward: 15, atoms: ['task10', 'prefixes'] },
          { id: 'q10-ege-2', type: 'ege-multiple', text: 'Укажите варианты ответов, в которых во всех словах одного ряда пропущена одна и та же буква.', options: ['1) д_рассказать, д_печатать, д_караулить', '2) пр_седания, пр_образ, пр_граждение', '3) с_знова, из_мать, с_грать', '4) н_сахарить, н_дтреснутый, н_клейка', '5) к_рикатура, к_смонавт, к_сатка'], correctAnswer: ['1', '3', '4'], explanation: '1) дОрассказать, дОпечатать, дОкараулить — везде О. 3) сЫзнова, изЫмать, сЫграть — везде Ы. 4) нАсахарить, нАдтреснутый, нАклейка — везде А.', difficulty: 'medium', xpReward: 15, atoms: ['task10', 'prefixes'] },
          { id: 'q10-ege-3', type: 'ege-multiple', text: 'Укажите варианты ответов, в которых во всех словах одного ряда пропущена одна и та же буква.', options: ['1) б_ющийся, л_ющийся, р_зкаяние', '2) в_колосилась, в_збраться, в_спевать', '3) изр_ходовать, из_мать, изв_зчик', '4) ар_ергард, п_ртьера, кур_ёз', '5) че_есчур, че_сполосица, че_сстрочный'], correctAnswer: ['2', '5'], explanation: '2) вОлосилась, взОбраться, вОспевать — везде О. 5) черЕсчур, черЕсполосица, черЕсстрочный — везде С.', difficulty: 'medium', xpReward: 15, atoms: ['task10', 'prefixes'] },
          { id: 'q10-ege-4', type: 'ege-multiple', text: 'Укажите варианты ответов, в которых во всех словах одного ряда пропущена одна и та же буква.', options: ['1) пр_исполнен, пр_дзащита, пр_граждение', '2) п_солить, п_ртьера, п_дкараулить', '3) в_тражи, в_стибюль, в_рмишель', '4) р_зъехаться, р_збрать, р_счерк', '5) че_есчур, че_сполосица'], correctAnswer: ['1', '2', '5'], explanation: '1) прЕисполнен, прЕдзащита, прЕграждение — везде Е. 2) пОсолить, пОртьера, пОдкараулить — везде О. 5) черЕсчур, черЕсполосица — везде С.', difficulty: 'medium', xpReward: 15, atoms: ['task10', 'prefixes'] },
          { id: 'q10-ege-5', type: 'ege-multiple', text: 'Укажите варианты ответов, в которых во всех словах одного ряда пропущена одна и та же буква.', options: ['1) пр_исполнен, пр_града, пр_дзащита', '2) б_ющийся, л_ющийся, р_зкаяние', '3) п_солить, п_ртьера, п_дкараулить', '4) в_тражи, в_стибюль, в_рмишель', '5) че_есчур, че_сполосица'], correctAnswer: ['1', '3', '5'], explanation: '1) прЕисполнен, прЕграда, прЕдзащита — везде Е. 3) пОсолить, пОртьера, пОдкараулить — везде О. 5) черЕсчур, черЕсполосица — везде С.', difficulty: 'medium', xpReward: 15, atoms: ['task10', 'prefixes'] },
          { id: 'q10-ege-6', type: 'ege-multiple', text: 'Укажите варианты ответов, в которых во всех словах одного ряда пропущена одна и та же буква.', options: ['1) д_рассказать, д_печатать, д_караулить', '2) пр_седания, пр_образ, пр_граждение', '3) с_знова, из_мать, с_грать', '4) н_сахарить, н_дтреснутый, н_клейка', '5) к_рикатура, к_смонавт, к_сатка'], correctAnswer: ['1', '3', '4'], explanation: '1) дОрассказать, дОпечатать, дОкараулить — везде О. 3) сЫзнова, изЫмать, сЫграть — везде Ы. 4) нАсахарить, нАдтреснутый, нАклейка — везде А.', difficulty: 'medium', xpReward: 15, atoms: ['task10', 'prefixes'] },
          { id: 'q10-ege-7', type: 'ege-multiple', text: 'Укажите варианты ответов, в которых во всех словах одного ряда пропущена одна и та же буква.', options: ['1) в_колосилась, в_збраться, в_спевать', '2) р_зъехаться, р_збрать, р_счерк', '3) б_ющийся, л_ющийся, р_зкаяние', '4) пр_исполнен, пр_града, пр_дзащита', '5) п_солить, п_ртьера, п_дкараулить'], correctAnswer: ['1', '4', '5'], explanation: '1) вОлосилась, взОбраться, вОспевать — везде О. 4) прЕисполнен, прЕграда, прЕдзащита — везде Е. 5) пОсолить, пОртьера, пОдкараулить — везде О.', difficulty: 'medium', xpReward: 15, atoms: ['task10', 'prefixes'] },
          { id: 'q10-ege-8', type: 'ege-multiple', text: 'Укажите варианты ответов, в которых во всех словах одного ряда пропущена одна и та же буква.', options: ['1) ар_ергард, п_ртьера, кур_ёз', '2) че_есчур, че_сполосица, че_сстрочный', '3) д_рассказать, д_печатать, д_караулить', '4) пр_седания, пр_образ, пр_граждение', '5) изр_ходовать, из_мать, изв_зчик'], correctAnswer: ['2', '3'], explanation: '2) черЕсчур, черЕсполосица, черЕсстрочный — везде С. 3) дОрассказать, дОпечатать, дОкараулить — везде О.', difficulty: 'medium', xpReward: 15, atoms: ['task10', 'prefixes'] },
          { id: 'q10-ege-9', type: 'ege-multiple', text: 'Укажите варианты ответов, в которых во всех словах одного ряда пропущена одна и та же буква.', options: ['1) н_сахарить, н_дтреснутый, н_клейка', '2) к_рикатура, к_смонавт, к_сатка', '3) б_ющийся, л_ющийся, р_зкаяние', '4) с_знова, из_мать, с_грать', '5) пр_исполнен, пр_града, пр_дзащита'], correctAnswer: ['1', '4', '5'], explanation: '1) нАсахарить, нАдтреснутый, нАклейка — везде А. 4) сЫзнова, изЫмать, сЫграть — везде Ы. 5) прЕисполнен, прЕграда, прЕдзащита — везде Е.', difficulty: 'medium', xpReward: 15, atoms: ['task10', 'prefixes'] },
          { id: 'q10-ege-10', type: 'ege-multiple', text: 'Укажите варианты ответов, в которых во всех словах одного ряда пропущена одна и та же буква.', options: ['1) р_зъехаться, р_збрать, р_счерк', '2) в_колосилась, в_збраться, в_спевать', '3) п_солить, п_ртьера, п_дкараулить', '4) че_есчур, че_сполосица', '5) д_рассказать, д_печатать, д_караулить'], correctAnswer: ['2', '3', '4', '5'], explanation: '2) вОлосилась, взОбраться, вОспевать — везде О. 3) пОсолить, пОртьера, пОдкараулить — везде О. 4) черЕсчур, черЕсполосица — везде С. 5) дОрассказать, дОпечатать, дОкараулить — везде О.', difficulty: 'medium', xpReward: 15, atoms: ['task10', 'prefixes'] },
        ]
      }
    ]
  }
]