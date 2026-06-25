import { Section } from '../../types'

export const task4Sections: Section[] = [
  {
    id: 'section-task4',
    courseId: 'ege-russian-2025',
    title: 'Ударение',
    subtitle: 'Задание 4: правильная постановка ударения',
    order: 4,
    icon: 'Volume2',
    color: '#e74c3c',
    lessons: [
      {
        id: 'lesson-task4-1',
        sectionId: 'section-task4',
        title: 'Задание 4. Уровень 1',
        type: 'practice',
        description: 'Выберите слово с правильным ударением',
        xpReward: 60,
        prerequisites: [],
        questions: [
          { id: 'q4-1', type: 'single', text: 'Как правильно?', options: ['кАшлянуть', 'кашлЯнуть'], correctAnswer: ["кАшлянуть"], explanation: 'Ударение падает на корень -кашл-: кАшлянуть.', difficulty: 'easy', xpReward: 10, atoms: ['task4'] },
          { id: 'q4-2', type: 'single', text: 'Как правильно?', options: ['позвонИть', 'позвОнить'], correctAnswer: ["позвонИть"], explanation: 'Ударение на -звон-: позвонИть.', difficulty: 'easy', xpReward: 10, atoms: ['task4'] },
          { id: 'q4-3', type: 'single', text: 'Как правильно?', options: ['сверлИть', 'свЕрлить'], correctAnswer: ["сверлИть"], explanation: 'Ударение на корень: сверлИть.', difficulty: 'easy', xpReward: 10, atoms: ['task4'] },
          { id: 'q4-4', type: 'single', text: 'Как правильно?', options: ['наврАть', 'нАврать'], correctAnswer: ["наврАть"], explanation: 'Ударение на -вра-: наврАть.', difficulty: 'easy', xpReward: 10, atoms: ['task4'] },
          { id: 'q4-5', type: 'single', text: 'Как правильно?', options: ['опломбировАть', 'опломбИровать'], correctAnswer: ["опломбировАть"], explanation: 'Ударение на -ров-: опломбировАть.', difficulty: 'easy', xpReward: 10, atoms: ['task4'] },
          { id: 'q4-6', type: 'single', text: 'Как правильно?', options: ['облегчИть', 'облЕгчить'], correctAnswer: ["облегчИть"], explanation: 'Ударение на -легч-: облегчИть.', difficulty: 'easy', xpReward: 10, atoms: ['task4'] },
          { id: 'q4-7', type: 'single', text: 'Как правильно?', options: ['дешевИзна', 'дешевизнА'], correctAnswer: ["дешевИзна"], explanation: 'Ударение на -изн-: дешевИзна.', difficulty: 'easy', xpReward: 10, atoms: ['task4'] },
          { id: 'q4-8', type: 'single', text: 'Как правильно?', options: ['диспансЕр', 'диспАнсер'], correctAnswer: ["диспансЕр"], explanation: 'Ударение на -сер: диспансЕр.', difficulty: 'easy', xpReward: 10, atoms: ['task4'] },
          { id: 'q4-9', type: 'single', text: 'Как правильно?', options: ['договорЁнность', 'договОренность'], correctAnswer: ["договорЁнность"], explanation: 'Ударение на -рён-: договорЁнность.', difficulty: 'easy', xpReward: 10, atoms: ['task4'] },
          { id: 'q4-10', type: 'single', text: 'Как правильно?', options: ['жалюзИ', 'жАлюзи'], correctAnswer: ["жалюзИ"], explanation: 'Ударение на последний слог: жалюзИ.', difficulty: 'easy', xpReward: 10, atoms: ['task4'] },
          { id: 'q4-11', type: 'single', text: 'Как правильно?', options: ['знАчимость', 'значИмость'], correctAnswer: ["знАчимость"], explanation: 'Ударение на первый слог: знАчимость.', difficulty: 'easy', xpReward: 10, atoms: ['task4'] },
          { id: 'q4-12', type: 'single', text: 'Как правильно?', options: ['зАгнутый', 'загнУтый'], correctAnswer: ["зАгнутый"], explanation: 'Ударение на -аг-: зАгнутый.', difficulty: 'easy', xpReward: 10, atoms: ['task4'] },
          { id: 'q4-13', type: 'single', text: 'Как правильно?', options: ['каталОг', 'катАлог'], correctAnswer: ["каталОг"], explanation: 'Ударение на -лог: каталОг.', difficulty: 'easy', xpReward: 10, atoms: ['task4'] },
          { id: 'q4-14', type: 'single', text: 'Как правильно?', options: ['квартАл', 'кварталА'], correctAnswer: ["квартАл"], explanation: 'Ударение на второй слог: квартАл.', difficulty: 'easy', xpReward: 10, atoms: ['task4'] },
          { id: 'q4-15', type: 'single', text: 'Как правильно?', options: ['киломЕтр', 'километрА'], correctAnswer: ["киломЕтр"], explanation: 'Ударение на третий слог: киломЕтр.', difficulty: 'easy', xpReward: 10, atoms: ['task4'] },
        ]
      },
      {
        id: 'lesson-task4-2',
        sectionId: 'section-task4',
        title: 'Задание 4. Уровень 2',
        type: 'practice',
        description: 'Сложные случаи ударения',
        xpReward: 70,
        prerequisites: ['lesson-task4-1'],
        questions: [
          { id: 'q4-16', type: 'single', text: 'Как правильно?', options: ['корЫсть', 'кОрысть'], correctAnswer: ["корЫсть"], explanation: 'Ударение на -ы-: корЫсть.', difficulty: 'medium', xpReward: 12, atoms: ['task4'] },
          { id: 'q4-17', type: 'single', text: 'Как правильно?', options: ['крАла', 'кралА'], correctAnswer: ["кралА"], explanation: 'Ударение на окончание: кралА.', difficulty: 'medium', xpReward: 12, atoms: ['task4'] },
          { id: 'q4-18', type: 'single', text: 'Как правильно?', options: ['кУхонный', 'кухОнный'], correctAnswer: ["кУхонный"], explanation: 'Ударение на первый слог: кУхонный.', difficulty: 'medium', xpReward: 12, atoms: ['task4'] },
          { id: 'q4-19', type: 'single', text: 'Как правильно?', options: ['мЕстностей', 'местностЕй'], correctAnswer: ["мЕстностей"], explanation: 'Ударение на первый слог: мЕстностей.', difficulty: 'medium', xpReward: 12, atoms: ['task4'] },
          { id: 'q4-20', type: 'single', text: 'Как правильно?', options: ['мусоропровОд', 'мусоропрОвод'], correctAnswer: ["мусоропровОд"], explanation: 'Ударение на -вод: мусоропровОд.', difficulty: 'medium', xpReward: 12, atoms: ['task4'] },
          { id: 'q4-21', type: 'single', text: 'Как правильно?', options: ['досУг', 'досугА'], correctAnswer: ["досУг"], explanation: 'Ударение на -су-: досУг.', difficulty: 'medium', xpReward: 12, atoms: ['task4'] },
          { id: 'q4-22', type: 'single', text: 'Как правильно?', options: ['недУг', 'недугО'], correctAnswer: ["недУг"], explanation: 'Ударение на первый слог: недУг.', difficulty: 'medium', xpReward: 12, atoms: ['task4'] },
          { id: 'q4-23', type: 'single', text: 'Как правильно?', options: ['нЕдруг', 'недрУг'], correctAnswer: ["нЕдруг"], explanation: 'Ударение на первый слог: нЕдруг.', difficulty: 'medium', xpReward: 12, atoms: ['task4'] },
          { id: 'q4-24', type: 'single', text: 'Как правильно?', options: ['нЕнависть', 'ненавИсть'], correctAnswer: ["нЕнависть"], explanation: 'Ударение на первый слог: нЕнависть.', difficulty: 'medium', xpReward: 12, atoms: ['task4'] },
          { id: 'q4-25', type: 'single', text: 'Как правильно?', options: ['нОвости', 'новостИ'], correctAnswer: ["нОвости"], explanation: 'Ударение на первый слог: нОвости.', difficulty: 'medium', xpReward: 12, atoms: ['task4'] },
          { id: 'q4-26', type: 'single', text: 'Как правильно?', options: ['нОготь', 'ногОть'], correctAnswer: ["нОготь"], explanation: 'Ударение на первый слог: нОготь.', difficulty: 'medium', xpReward: 12, atoms: ['task4'] },
          { id: 'q4-27', type: 'single', text: 'Как правильно?', options: ['обеспЕчить', 'обеспечИть'], correctAnswer: ["обеспЕчить"], explanation: 'Ударение на -печ-: обеспЕчить.', difficulty: 'medium', xpReward: 12, atoms: ['task4'] },
          { id: 'q4-28', type: 'single', text: 'Как правильно?', options: ['одОбрить', 'одобрИть'], correctAnswer: ["одобрИть"], explanation: 'Ударение на -бр-: одобрИть.', difficulty: 'medium', xpReward: 12, atoms: ['task4'] },
          { id: 'q4-29', type: 'single', text: 'Как правильно?', options: ['оптОвый', 'оптовЫй'], correctAnswer: ["оптОвый"], explanation: 'Ударение на -то-: оптОвый.', difficulty: 'medium', xpReward: 12, atoms: ['task4'] },
          { id: 'q4-30', type: 'single', text: 'Как правильно?', options: ['звонИт', 'звОнит'], correctAnswer: ["звонИт"], explanation: 'Ударение на -он-: звонИт.', difficulty: 'medium', xpReward: 12, atoms: ['task4'] },
        ]
      },
      {
        id: 'lesson-task4-3',
        sectionId: 'section-task4',
        title: 'Задание 4. Уровень 3',
        type: 'practice',
        description: 'Ударение в причастиях и деепричастиях',
        xpReward: 70,
        prerequisites: ['lesson-task4-2'],
        questions: [
          { id: 'q4-31', type: 'single', text: 'Как правильно?', options: ['зАнятый', 'занЯтый'], correctAnswer: ["зАнятый"], explanation: 'Ударение на первый слог: зАнятый.', difficulty: 'medium', xpReward: 12, atoms: ['task4'] },
          { id: 'q4-32', type: 'single', text: 'Как правильно?', options: ['зАпертый', 'запЁртый'], correctAnswer: ["зАпертый"], explanation: 'Ударение на первый слог: зАпертый.', difficulty: 'medium', xpReward: 12, atoms: ['task4'] },
          { id: 'q4-33', type: 'single', text: 'Как правильно?', options: ['заселЁнный', 'заселеннЫй'], correctAnswer: ["заселЁнный"], explanation: 'Ударение на -ёл-: заселЁнный.', difficulty: 'medium', xpReward: 12, atoms: ['task4'] },
          { id: 'q4-34', type: 'single', text: 'Как правильно?', options: ['нАжитый', 'нажИтый'], correctAnswer: ["нАжитый"], explanation: 'Ударение на первый слог: нАжитый.', difficulty: 'medium', xpReward: 12, atoms: ['task4'] },
          { id: 'q4-35', type: 'single', text: 'Как правильно?', options: ['нАчатый', 'начАтый'], correctAnswer: ["нАчатый"], explanation: 'Ударение на первый слог: нАчатый.', difficulty: 'medium', xpReward: 12, atoms: ['task4'] },
          { id: 'q4-36', type: 'single', text: 'Как правильно?', options: ['ободрЁнный', 'ободрённЫй'], correctAnswer: ["ободрЁнный"], explanation: 'Ударение на -дрён-: ободрЁнный.', difficulty: 'medium', xpReward: 12, atoms: ['task4'] },
          { id: 'q4-37', type: 'single', text: 'Как правильно?', options: ['определЁнный', 'определённЫй'], correctAnswer: ["определЁнный"], explanation: 'Ударение на -ёл-: определЁнный.', difficulty: 'medium', xpReward: 12, atoms: ['task4'] },
          { id: 'q4-38', type: 'single', text: 'Как правильно?', options: ['отключЁнный', 'отключённЫй'], correctAnswer: ["отключЁнный"], explanation: 'Ударение на -ёл-: отключЁнный.', difficulty: 'medium', xpReward: 12, atoms: ['task4'] },
          { id: 'q4-39', type: 'single', text: 'Как правильно?', options: ['поделЁнный', 'поделённЫй'], correctAnswer: ["поделЁнный"], explanation: 'Ударение на -ёл-: поделЁнный.', difficulty: 'medium', xpReward: 12, atoms: ['task4'] },
          { id: 'q4-40', type: 'single', text: 'Как правильно?', options: ['снЯтый', 'снятЫй'], correctAnswer: ["снЯтый"], explanation: 'Ударение на первый слог: снЯтый.', difficulty: 'medium', xpReward: 12, atoms: ['task4'] },
          { id: 'q4-41', type: 'single', text: 'Как правильно?', options: ['балУясь', 'балуЯсь'], correctAnswer: ["балУясь"], explanation: 'Ударение на -у-: балУясь.', difficulty: 'medium', xpReward: 12, atoms: ['task4'] },
          { id: 'q4-42', type: 'single', text: 'Как правильно?', options: ['закУпорив', 'закупОрив'], correctAnswer: ["закУпорив"], explanation: 'Ударение на -у-: закУпорив.', difficulty: 'medium', xpReward: 12, atoms: ['task4'] },
          { id: 'q4-43', type: 'single', text: 'Как правильно?', options: ['начАв', 'начАвшись'], correctAnswer: ["начАв"], explanation: 'Ударение на -ча-: начАв.', difficulty: 'medium', xpReward: 12, atoms: ['task4'] },
          { id: 'q4-44', type: 'single', text: 'Как правильно?', options: ['поднЯв', 'поднявШи'], correctAnswer: ["поднЯв"], explanation: 'Ударение на -ня-: поднЯв.', difficulty: 'medium', xpReward: 12, atoms: ['task4'] },
          { id: 'q4-45', type: 'single', text: 'Как правильно?', options: ['понЯв', 'понявШи'], correctAnswer: ["понЯв"], explanation: 'Ударение на -ня-: понЯв.', difficulty: 'medium', xpReward: 12, atoms: ['task4'] },
        ]
      },
      {
        id: 'lesson-task4-ege',
        sectionId: 'section-task4',
        title: 'Задание 4. Формат ЕГЭ',
        type: 'practice',
        description: 'Реальные задания ЕГЭ: укажите номера ответов, где ударение падает на одну и ту же букву',
        xpReward: 80,
        prerequisites: ['lesson-task4-3'],
        questions: [
          { id: 'q4-ege-1', type: 'ege-multiple', text: 'Укажите варианты ответов, в которых в обоих словах одного ряда ударение падает на одну и ту же букву. Запишите номера ответов.', options: ['1) кАшлянуть, сверлИть', '2) позвонИть, дешевИзна', '3) наврАть, жалюзИ', '4) диспансЕр, корЫсть', '5) знАчимость, квартАл'], correctAnswer: ["2", "5"], explanation: '2) позвонИть (на И), дешевИзна (на И) — ударение на И в обоих. 5) знАчимость (на А), квартАл (на А) — ударение на А в обоих.', difficulty: 'medium', xpReward: 15, atoms: ['task4'] },
          { id: 'q4-ege-2', type: 'ege-multiple', text: 'Укажите варианты ответов, в которых в обоих словах одного ряда ударение падает на одну и ту же букву. Запишите номера ответов.', options: ['1) опломбировАть, облегчИть', '2) договорЁнность, зАгнутый', '3) кУхонный, мЕстностей', '4) мусоропровОд, нЕдруг', '5) нОвости, нОготь'], correctAnswer: ["5"], explanation: '5) нОвости (на О), нОготь (на О) — ударение на О в обоих. В остальных вариантах ударение падает на разные буквы.', difficulty: 'medium', xpReward: 15, atoms: ['task4'] },
        ]
      }
    ]
  }
]
