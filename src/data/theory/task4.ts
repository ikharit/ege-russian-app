// Теория задания 4: Орфоэпия (ударения)
// Источник: ФИПИ Навигатор 2025, грамота.ру
// Пополнение: агенты могут добавлять правила — сохраняйте формат!

export interface TheoryRule {
  id: string
  taskNumber: string
  title: string
  content: string
  examples: { correct: string; incorrect?: string; note?: string }[]
  exceptions?: string[]
  tags: string[]
}

export interface TheorySection {
  id: string
  taskNumber: string
  title: string
  rules: TheoryRule[]
}

// ─────────────────────────────────────────
// ЗАДАНИЕ 4: Ударения (орфоэпия)
// ─────────────────────────────────────────

export const task4Theory: TheorySection = {
  id: 'task4-orthoepy',
  taskNumber: '4',
  title: 'Орфоэпические нормы (ударения)',
  rules: [
    {
      id: 'task4-1',
      taskNumber: '4',
      title: 'Орфоэпический словник ФИПИ 2025',
      content: 'С 2025 года ФИПИ публикует официальный орфоэпический словник — список слов, из которых составляются задания. Рекомендуется заучить все слова из списка.',
      examples: [
        { correct: 'аэропОрты', note: 'им. п. мн. ч.' },
        { correct: 'бАнты', incorrect: 'банты' },
        { correct: 'бОроду', incorrect: 'бороду', note: 'вин. п. ед. ч.' },
        { correct: 'бухгАлтеров', incorrect: 'бухгалтеров' },
        { correct: 'вероисповЕдание', incorrect: 'вероисповедание' },
        { correct: 'водопровОд', incorrect: 'водопровод' },
        { correct: 'газопровОд', incorrect: 'газопровод' },
        { correct: 'граждАнство', incorrect: 'гражданство' },
        { correct: 'дефИс', incorrect: 'дефис' },
        { correct: 'дешевИзна', incorrect: 'дешевизна' },
        { correct: 'диспансЕр', incorrect: 'диспансер' },
        { correct: 'договорЁнность', incorrect: 'договоренность' },
        { correct: 'докумЕнт', incorrect: 'документ' },
        { correct: 'досУг', incorrect: 'досуг' },
        { correct: 'еретИк', incorrect: 'еретик' },
        { correct: 'жалюзИ', incorrect: 'жалюзи', note: 'в знач. "солнцезащитные конструкции"' },
        { correct: 'знАчимость', incorrect: 'значимость' },
        { correct: 'Иксы', incorrect: 'иксы', note: 'им. п. мн. ч.' },
        { correct: 'каталОг', incorrect: 'каталог' },
        { correct: 'квартАл', incorrect: 'квартал', note: 'во всех значениях' },
        { correct: 'киломЕтр', incorrect: 'километр' },
        { correct: 'кОнусов', incorrect: 'конусов', note: 'род. п. мн. ч.' },
        { correct: 'корЫсть', incorrect: 'корысть' },
      ],
      tags: ['орфоэпия', 'ударения', 'словник', 'ФИПИ']
    },
    {
      id: 'task4-2',
      taskNumber: '4',
      title: 'Ударение в словах с приставками',
      content: 'Во многих словах с приставками ударение падает на корень или на суффикс, а не на приставку. Нужно запомнить ударение каждого слова.',
      examples: [
        { correct: 'зАгнутый', incorrect: 'загнУтый' },
        { correct: 'довезЁнный', incorrect: 'довЕзенный' },
        { correct: 'кУхонный', incorrect: 'кухОнный' },
        { correct: 'мУчнистый', incorrect: 'мучнИстый' },
        { correct: 'нАчистоту', incorrect: 'начистотУ' },
        { correct: 'недОрост', incorrect: 'недорОст' },
        { correct: 'недУг', incorrect: 'недуГ' },
        { correct: 'оптОвый', incorrect: 'оптовЫй' },
        { correct: 'пломбировАть', incorrect: 'пломбИровать' },
        { correct: 'приорИтет', incorrect: 'приОритет' },
        { correct: 'прозорлИвый', incorrect: 'прозОрливый' },
        { correct: 'свЁрток', incorrect: 'свЕрток' },
        { correct: 'свИток', incorrect: 'свитОк' },
        { correct: 'серьёзный', incorrect: 'серьёзный' },
        { correct: 'столЯр', incorrect: 'столяр' },
        { correct: 'тОрты', incorrect: 'торты' },
        { correct: 'тамОжа', incorrect: 'таможА' },
        { correct: 'феномЕн', incorrect: 'фенОмен' },
      ],
      tags: ['орфоэпия', 'ударения', 'приставки']
    },
  ]
}

export default task4Theory
