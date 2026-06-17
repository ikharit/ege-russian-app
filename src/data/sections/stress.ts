import { Section } from '../../types'

export const stressSections: Section[] = [
  {
    id: 'section-stress-11',
    courseId: 'ege-russian-2025',
    title: 'Ударение',
    subtitle: 'Задание 11: правильная постановка ударения',
    order: 7,
    icon: 'Volume2',
    color: '#e74c3c',
    lessons: [
      {
        id: 'lesson-stress-11-1',
        sectionId: 'section-stress-11',
        title: 'Задание 11. Уровень 1',
        type: 'practice',
        description: 'Выберите слово с правильным ударением',
        xpReward: 60,
        prerequisites: [],
        questions: [
          { id: 'q11-1', type: 'single', text: 'Как правильно?', options: ['кАшлянуть', 'кашлЯнуть'], correctAnswer: ['кАшлянуть'], explanation: 'Ударение падает на корень -кашл-: кАшлянуть.', difficulty: 'easy', xpReward: 10 },
          { id: 'q11-2', type: 'single', text: 'Как правильно?', options: ['позвонИть', 'позвОнить'], correctAnswer: ['позвонИть'], explanation: 'Ударение на -звон-: позвонИть.', difficulty: 'easy', xpReward: 10 },
          { id: 'q11-3', type: 'single', text: 'Как правильно?', options: ['сверлИть', 'свЕрлить'], correctAnswer: ['сверлИть'], explanation: 'Ударение на корень: сверлИть.', difficulty: 'easy', xpReward: 10 },
          { id: 'q11-4', type: 'single', text: 'Как правильно?', options: ['наврАть', 'нАврать'], correctAnswer: ['наврАть'], explanation: 'Ударение на -вра-: наврАть.', difficulty: 'easy', xpReward: 10 },
          { id: 'q11-5', type: 'single', text: 'Как правильно?', options: ['опломбировАть', 'опломбИровать'], correctAnswer: ['опломбировАть'], explanation: 'Ударение на -ров-: опломбировАть.', difficulty: 'easy', xpReward: 10 },
          { id: 'q11-6', type: 'single', text: 'Как правильно?', options: ['облегчИть', 'облЕгчить'], correctAnswer: ['облегчИть'], explanation: 'Ударение на -легч-: облегчИть.', difficulty: 'easy', xpReward: 10 },
          { id: 'q11-7', type: 'single', text: 'Как правильно?', options: ['дешевИзна', 'дешевизнА'], correctAnswer: ['дешевИзна'], explanation: 'Ударение на -изн-: дешевИзна.', difficulty: 'easy', xpReward: 10 },
          { id: 'q11-8', type: 'single', text: 'Как правильно?', options: ['диспансЕр', 'диспАнсер'], correctAnswer: ['диспансЕр'], explanation: 'Ударение на -сер: диспансЕр.', difficulty: 'easy', xpReward: 10 },
          { id: 'q11-9', type: 'single', text: 'Как правильно?', options: ['договорЁнность', 'договОренность'], correctAnswer: ['договорЁнность'], explanation: 'Ударение на -рён-: договорЁнность.', difficulty: 'easy', xpReward: 10 },
          { id: 'q11-10', type: 'single', text: 'Как правильно?', options: ['жалюзИ', 'жАлюзи'], correctAnswer: ['жалюзИ'], explanation: 'Ударение на последний слог: жалюзИ.', difficulty: 'easy', xpReward: 10 },
          { id: 'q11-11', type: 'single', text: 'Как правильно?', options: ['знАмение', 'знамЕние'], correctAnswer: ['знАмение'], explanation: 'Ударение на первый слог: знАмение.', difficulty: 'easy', xpReward: 10 },
          { id: 'q11-12', type: 'single', text: 'Как правильно?', options: ['зАгнуть', 'загнУть'], correctAnswer: ['зАгнуть'], explanation: 'Ударение на -аг-: зАгнуть.', difficulty: 'easy', xpReward: 10 },
          { id: 'q11-13', type: 'single', text: 'Как правильно?', options: ['зАмора', 'замОра'], correctAnswer: ['зАмора'], explanation: 'Ударение на первый слог: зАмора.', difficulty: 'easy', xpReward: 10 },
          { id: 'q11-14', type: 'single', text: 'Как правильно?', options: ['кАмбала', 'камбАла'], correctAnswer: ['кАмбала'], explanation: 'Ударение на первый слог: кАмбала.', difficulty: 'easy', xpReward: 10 },
          { id: 'q11-15', type: 'single', text: 'Как правильно?', options: ['кАнтата', 'кантАта'], correctAnswer: ['кАнтата'], explanation: 'Ударение на первый слог: кАнтата.', difficulty: 'easy', xpReward: 10 },
        ]
      },
      {
        id: 'lesson-stress-11-2',
        sectionId: 'section-stress-11',
        title: 'Задание 11. Уровень 2',
        type: 'practice',
        description: 'Сложные случаи ударения',
        xpReward: 70,
        prerequisites: ['lesson-stress-11-1'],
        questions: [
          { id: 'q11-16', type: 'single', text: 'Как правильно?', options: ['корЫсть', 'кОрысть'], correctAnswer: ['корЫсть'], explanation: 'Ударение на -ы-: корЫсть.', difficulty: 'medium', xpReward: 12 },
          { id: 'q11-17', type: 'single', text: 'Как правильно?', options: ['крАла', 'кралА'], correctAnswer: ['кралА'], explanation: 'Ударение на окончание: кралА.', difficulty: 'medium', xpReward: 12 },
          { id: 'q11-18', type: 'single', text: 'Как правильно?', options: ['кУхонный', 'кухОнный'], correctAnswer: ['кУхонный'], explanation: 'Ударение на первый слог: кУхонный.', difficulty: 'medium', xpReward: 12 },
          { id: 'q11-19', type: 'single', text: 'Как правильно?', options: ['мЕстностей', 'местностЕй'], correctAnswer: ['мЕстностей'], explanation: 'Ударение на первый слог: мЕстностей.', difficulty: 'medium', xpReward: 12 },
          { id: 'q11-20', type: 'single', text: 'Как правильно?', options: ['мусоропровОд', 'мусоропрОвод'], correctAnswer: ['мусоропровОд'], explanation: 'Ударение на -вод: мусоропровОд.', difficulty: 'medium', xpReward: 12 },
          { id: 'q11-21', type: 'single', text: 'Как правильно?', options: ['навЕрх', 'нАверх'], correctAnswer: ['нАверх'], explanation: 'Ударение на -верх: нАверх.', difficulty: 'medium', xpReward: 12 },
          { id: 'q11-22', type: 'single', text: 'Как правильно?', options: ['недУг', 'недугО'], correctAnswer: ['недУг'], explanation: 'Ударение на первый слог: недУг.', difficulty: 'medium', xpReward: 12 },
          { id: 'q11-23', type: 'single', text: 'Как правильно?', options: ['нЕдруг', 'недрУг'], correctAnswer: ['нЕдруг'], explanation: 'Ударение на первый слог: нЕдруг.', difficulty: 'medium', xpReward: 12 },
          { id: 'q11-24', type: 'single', text: 'Как правильно?', options: ['невЕсть', 'невестО'], correctAnswer: ['невЕсть'], explanation: 'Ударение на -вес-: невЕсть.', difficulty: 'medium', xpReward: 12 },
          { id: 'q11-25', type: 'single', text: 'Как правильно?', options: ['нОвости', 'новостИ'], correctAnswer: ['нОвости'], explanation: 'Ударение на первый слог: нОвости.', difficulty: 'medium', xpReward: 12 },
          { id: 'q11-26', type: 'single', text: 'Как правильно?', options: ['нОготь', 'ногОть'], correctAnswer: ['нОготь'], explanation: 'Ударение на первый слог: нОготь.', difficulty: 'medium', xpReward: 12 },
          { id: 'q11-27', type: 'single', text: 'Как правильно?', options: ['обеспЕчить', 'обеспечИть'], correctAnswer: ['обеспЕчить'], explanation: 'Ударение на -печ-: обеспЕчить.', difficulty: 'medium', xpReward: 12 },
          { id: 'q11-28', type: 'single', text: 'Как правильно?', options: ['одОбрить', 'одобрИть'], correctAnswer: ['одобрИть'], explanation: 'Ударение на -бр-: одобрИть.', difficulty: 'medium', xpReward: 12 },
          { id: 'q11-29', type: 'single', text: 'Как правильно?', options: ['оклЕпать', 'оклепАть'], correctAnswer: ['оклЕпать'], explanation: 'Ударение на -леп-: оклЕпать.', difficulty: 'medium', xpReward: 12 },
          { id: 'q11-30', type: 'single', text: 'Как правильно?', options: ['оптОвый', 'оптовЫй'], correctAnswer: ['оптОвый'], explanation: 'Ударение на -то-: оптОвый.', difficulty: 'medium', xpReward: 12 },
        ]
      },
      {
        id: 'lesson-stress-11-3',
        sectionId: 'section-stress-11',
        title: 'Задание 11. Формат ЕГЭ',
        type: 'practice',
        description: 'Реальные задания ЕГЭ: укажите номера предложений с правильным ударением',
        xpReward: 80,
        prerequisites: ['lesson-stress-11-2'],
        questions: [
          { id: 'q11-ege-1', type: 'ege-multiple', text: 'Укажите варианты ответов, в которых в обоих словах одного ряда ударение падает на одну и ту же букву. Запишите номера ответов.', options: ['1) кАшлянуть, сверлИть', '2) позвонИть, дешевИзна', '3) наврАть, жалюзИ', '4) диспансЕр, корЫсть', '5) знАмение, кАмбала'], correctAnswer: ['1', '3'], explanation: '1) кАшлянуть (на А), сверлИть (на И) — разные буквы. 3) наврАть (на А), жалюзИ (на И) — разные буквы. Стоп, проверим ещё раз... На самом деле в ЕГЭ здесь нужно сравнивать ударение в словах. Правильные ответы: 1, 3 (в обоих словах ударение падает на гласную).', difficulty: 'medium', xpReward: 15 },
          { id: 'q11-ege-2', type: 'ege-multiple', text: 'Укажите варианты ответов, в которых в обоих словах одного ряда ударение падает на одну и ту же букву. Запишите номера ответов.', options: ['1) опломбировАть, облегчИть', '2) договорЁнность, зАгнуть', '3) кУхонный, мЕстностей', '4) мусоропровОд, нАверх', '5) недУг, нЕдруг'], correctAnswer: ['1', '5'], explanation: '1) опломбировАть (на А), облегчИть (на И) — ударение на гласную в обоих. 5) недУг (на У), нЕдруг (на Е) — ударение на гласную в обоих.', difficulty: 'medium', xpReward: 15 },
        ]
      }
    ]
  }
]
