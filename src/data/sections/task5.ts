import { Section } from '../../types'

export const task5Sections: Section[] = [
  {
    id: 'section-task5',
    courseId: 'ege-russian-2025',
    title: 'Паронимы',
    subtitle: 'Задание 5: различение паронимов и их употребление',
    order: 5,
    icon: 'BookOpen',
    color: '#2E75B6',
    lessons: [
      {
        id: 'lesson-task5-1',
        sectionId: 'section-task5',
        title: 'Задание 5. Уровень 1',
        type: 'practice',
        description: 'Выберите правильное слово для вставки в предложение',
        xpReward: 60,
        prerequisites: [],
        questions: [
          { id: 'q5-1', type: 'single', text: 'В библиотеке оформили ... на журналы.', options: ['абонемент', 'абонент'], correctAnswer: ['абонемент'], explanation: 'Абонемент — формальное разрешение на пользование чем-либо (в библиотеке). Абонент — тот, кто пользуется услугами (телефона, радио).', difficulty: 'easy', xpReward: 10 , atoms: ['task5', 'paronyms']},
          { id: 'q5-2', type: 'single', text: 'Он очень ... человек.', options: ['артистический', 'артистичный'], correctAnswer: ['артистичный'], explanation: 'Артистичный — талантливый, яркий. Артистический — связанный с искусством, артистизмом (артистический вкус).', difficulty: 'easy', xpReward: 10 , atoms: ['task5', 'paronyms']},
          { id: 'q5-3', type: 'single', text: 'Положение было ... .', options: ['бедственное', 'бедное'], correctAnswer: ['бедственное'], explanation: 'Бедственное — тяжёлое, безвыходное. Бедное — неимущее, скудное.', difficulty: 'easy', xpReward: 10 , atoms: ['task5', 'paronyms']},
          { id: 'q5-4', type: 'single', text: 'Он оказался ... в этой ситуации.', options: ['безответственный', 'безответный'], correctAnswer: ['безответственный'], explanation: 'Безответственный — не несущий ответственности. Безответный — не получающий ответа (безответная любовь).', difficulty: 'easy', xpReward: 10 , atoms: ['task5', 'paronyms']},
          { id: 'q5-5', type: 'single', text: 'Почва была ... .', options: ['болотистая', 'болотная'], correctAnswer: ['болотистая'], explanation: 'Болотистая — похожая на болото. Болотная — относящаяся к болоту (болотная трава).', difficulty: 'easy', xpReward: 10 , atoms: ['task5', 'paronyms']},
          { id: 'q5-6', type: 'single', text: 'Письмо было ... .', options: ['благодарственное', 'благодарное'], correctAnswer: ['благодарственное'], explanation: 'Благодарственное — выражающее благодарность. Благодарное — достойное благодарности.', difficulty: 'easy', xpReward: 10 , atoms: ['task5', 'paronyms']},
          { id: 'q5-7', type: 'single', text: '... помощь оказалась эффективной.', options: ['Благотворная', 'Благотворительная'], correctAnswer: ['Благотворная'], explanation: 'Благотворная — полезная, приносящая пользу. Благотворительная — связанная с благотворительностью (благотворительный фонд).', difficulty: 'easy', xpReward: 10 , atoms: ['task5', 'paronyms']},
          { id: 'q5-8', type: 'single', text: 'Это ... событие для нашего города.', options: ['вековое', 'вечное'], correctAnswer: ['вековое'], explanation: 'Вековое — древнее, существующее веками. Вечное — бесконечное, непреходящее.', difficulty: 'easy', xpReward: 10 , atoms: ['task5', 'paronyms']},
          { id: 'q5-9', type: 'single', text: 'Здание было ... по своей архитектуре.', options: ['величественное', 'великое'], correctAnswer: ['величественное'], explanation: 'Величественное — производящее впечатление величия. Великое — огромное, выдающееся.', difficulty: 'easy', xpReward: 10 , atoms: ['task5', 'paronyms']},
          { id: 'q5-10', type: 'single', text: 'Нужно ... пробел в знаниях.', options: ['восполнить', 'дополнить'], correctAnswer: ['восполнить'], explanation: 'Восполнить — восстановить, возместить утраченное. Дополнить — добавить то, чего не хватает.', difficulty: 'easy', xpReward: 10 , atoms: ['task5', 'paronyms']},
          { id: 'q5-11', type: 'single', text: 'Это ... территория.', options: ['вражеская', 'враждебная'], correctAnswer: ['вражеская'], explanation: 'Вражеская — принадлежащая врагу. Враждебная — неприязненная, враждебная среда.', difficulty: 'easy', xpReward: 10 , atoms: ['task5', 'paronyms']},
          { id: 'q5-12', type: 'single', text: 'Он ... подарки из магазина.', options: ['выбирал', 'избирал'], correctAnswer: ['выбирал'], explanation: 'Выбирать — отбирать по какому-либо признаку. Избирать — выбирать кого-либо на должность.', difficulty: 'easy', xpReward: 10 , atoms: ['task5', 'paronyms']},
          { id: 'q5-13', type: 'single', text: 'Договор принёс ... .', options: ['выгоду', 'выгодность'], correctAnswer: ['выгоду'], explanation: 'Выгода — польза, доход. Выгодность — качество, свойство быть выгодным.', difficulty: 'easy', xpReward: 10 , atoms: ['task5', 'paronyms']},
          { id: 'q5-14', type: 'single', text: '... книг прошла успешно.', options: ['Раздача', 'Отдача'], correctAnswer: ['Раздача'], explanation: 'Раздача — распределение. Отдача — ответное действие, реакция (отдача в педагогике).', difficulty: 'easy', xpReward: 10 , atoms: ['task5', 'paronyms']},
          { id: 'q5-15', type: 'single', text: '... за услуги была своевременной.', options: ['Оплата', 'Уплата'], correctAnswer: ['Оплата'], explanation: 'Оплата — действие по оплачиванию. Уплата — внесение денег (уплата налогов).', difficulty: 'easy', xpReward: 10 , atoms: ['task5', 'paronyms']},
        ]
      },
      {
        id: 'lesson-task5-2',
        sectionId: 'section-task5',
        title: 'Задание 5. Уровень 2',
        type: 'practice',
        description: 'Сложные случаи различения паронимов',
        xpReward: 70,
        prerequisites: ['lesson-task5-1'],
        questions: [
          { id: 'q5-16', type: 'single', text: '... здания видны издалека.', options: ['Высокие', 'Высотные'], correctAnswer: ['Высокие'], explanation: 'Высокие — большие по размеру. Высотные — относящиеся к высоте (высотные работы).', difficulty: 'medium', xpReward: 12 , atoms: ['task5', 'paronyms']},
          { id: 'q5-17', type: 'single', text: 'Покупателю выдали ... талон.', options: ['гарантийный', 'гарантированный'], correctAnswer: ['гарантийный'], explanation: 'Гарантийный — связанный с гарантией (гарантийный талон). Гарантированный — обеспеченный, застрахованный.', difficulty: 'medium', xpReward: 12 , atoms: ['task5', 'paronyms']},
          { id: 'q5-18', type: 'single', text: 'Это ... сочетание цветов.', options: ['гармоничное', 'гармоническое'], correctAnswer: ['гармоничное'], explanation: 'Гармоничное — согласованное, благоустроенное. Гармоническое — относящееся к гармонии (гармонический ряд).', difficulty: 'medium', xpReward: 12 , atoms: ['task5', 'paronyms']},
          { id: 'q5-19', type: 'single', text: 'Почвы в этом районе ... .', options: ['глинистые', 'глиняные'], correctAnswer: ['глинистые'], explanation: 'Глинистые — содержащие глину. Глиняные — сделанные из глины (глиняный горшок).', difficulty: 'medium', xpReward: 12 , atoms: ['task5', 'paronyms']},
          { id: 'q5-20', type: 'single', text: '... осадки были обильными.', options: ['Дождевые', 'Дождливые'], correctAnswer: ['Дождевые'], explanation: 'Дождевые — вызванные дождём (дождевые черви). Дождливые — характеризующиеся дождями (дождливый день).', difficulty: 'medium', xpReward: 12 , atoms: ['task5', 'paronyms']},
          { id: 'q5-21', type: 'single', text: 'Это ... событие в истории страны.', options: ['драматичное', 'драматическое'], correctAnswer: ['драматичное'], explanation: 'Драматичное — напряжённое, волнующее. Драматическое — относящееся к драматургии (драматический театр).', difficulty: 'medium', xpReward: 12 , atoms: ['task5', 'paronyms']},
          { id: 'q5-22', type: 'single', text: '... успех был ожидаем.', options: ['Популистский', 'Популярный'], correctAnswer: ['Популярный'], explanation: 'Популярный — известный, любимый. Популистский — основанный на популизме (популистские лозунги).', difficulty: 'medium', xpReward: 12 , atoms: ['task5', 'paronyms']},
          { id: 'q5-23', type: 'single', text: 'Он вёл себя ... .', options: ['практично', 'практически'], correctAnswer: ['практично'], explanation: 'Практично — рационально, целесообразно. Практически — на практике, в действительности.', difficulty: 'medium', xpReward: 12 , atoms: ['task5', 'paronyms']},
          { id: 'q5-24', type: 'single', text: 'Нужно ... документы в комитет.', options: ['представить', 'предоставить'], correctAnswer: ['представить'], explanation: 'Представить — показать, представить кому-либо. Предоставить — дать в пользование, предоставить возможность.', difficulty: 'medium', xpReward: 12 , atoms: ['task5', 'paronyms']},
          { id: 'q5-25', type: 'single', text: 'Это ... достижение в науке.', options: ['признанное', 'признательное'], correctAnswer: ['признанное'], explanation: 'Признанное — общепризнанное. Признательное — выражающее благодарность (признательное письмо).', difficulty: 'medium', xpReward: 12 , atoms: ['task5', 'paronyms']},
          { id: 'q5-26', type: 'single', text: '... сельскохозяйственная продукция.', options: ['Продуктовая', 'Продуктивная'], correctAnswer: ['Продуктивная'], explanation: 'Продуктивная — производительная, эффективная. Продуктовая — относящаяся к продуктам (продуктовый магазин).', difficulty: 'medium', xpReward: 12 , atoms: ['task5', 'paronyms']},
          { id: 'q5-27', type: 'single', text: 'Он вёл ... образ жизни.', options: ['экономичный', 'экономный'], correctAnswer: ['экономный'], explanation: 'Экономный — бережливый, не расточительный. Экономичный — дающий экономию (экономичный двигатель).', difficulty: 'medium', xpReward: 12 , atoms: ['task5', 'paronyms']},
          { id: 'q5-28', type: 'single', text: 'Это ... метод работы.', options: ['эффективный', 'эффектный'], correctAnswer: ['эффективный'], explanation: 'Эффективный — дающий результат. Эффектный — производящий впечатление, зрелищный.', difficulty: 'medium', xpReward: 12 , atoms: ['task5', 'paronyms']},
          { id: 'q5-29', type: 'single', text: 'Он ... человек в истории страны.', options: ['значимый', 'значительный'], correctAnswer: ['значимый'], explanation: 'Значимый — имеющий важное значение, влиятельный. Значительный — большой, существенный по размеру или количеству.', difficulty: 'medium', xpReward: 12 , atoms: ['task5', 'paronyms']},
          { id: 'q5-30', type: 'single', text: 'Это ... поступок.', options: ['этичный', 'этический'], correctAnswer: ['этичный'], explanation: 'Этичный — моральный, отвечающий нормам морали. Этический — относящийся к этике (этический кодекс).', difficulty: 'medium', xpReward: 12 , atoms: ['task5', 'paronyms']},
        ]
      },
      {
        id: 'lesson-task5-ege',
        sectionId: 'section-task5',
        title: 'Задание 5. Формат ЕГЭ',
        type: 'practice',
        description: 'Реальные задания ЕГЭ: выберите правильные варианты употребления паронимов',
        xpReward: 80,
        prerequisites: ['lesson-task5-2'],
        questions: [
          { id: 'q5-ege-1', type: 'ege-multiple', text: 'В каких предложениях паронимы употреблены ПРАВИЛЬНО?', options: ['1) Он артистичный человек.', '2) Это артистический вкус.', '3) Высокие здания видны издалека.', '4) Высокие работы требуют осторожности.', '5) Покупателю выдали гарантийный талон.'], correctAnswer: ['1', '2', '3', '5'], explanation: '4) Неправильно: работы на высоте — высотные, а не высокие.', difficulty: 'medium', xpReward: 15 , atoms: ['task5', 'paronyms']},
          { id: 'q5-ege-2', type: 'ege-multiple', text: 'В каких предложениях паронимы употреблены ПРАВИЛЬНО?', options: ['1) Это драматическое событие.', '2) Это драматичное событие.', '3) Он практичный человек.', '4) Практически все были согласны.', '5) Это экономичный автомобиль.'], correctAnswer: ['2', '3', '4', '5'], explanation: '1) Неправильно: драматическое — относится к жанру драмы, а не к напряжённости.', difficulty: 'medium', xpReward: 15 , atoms: ['task5', 'paronyms']},
        ]
      }
    ]
  }
]
