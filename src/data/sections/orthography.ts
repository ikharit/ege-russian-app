import { Section } from '../../types'

export const orthographySections: Section[] = [
  {
    id: 'section-orth-1',
    courseId: 'ege-russian-2025',
    title: 'Орфография: корни',
    subtitle: 'Чередование гласных, проверяемые и непроверяемые',
    order: 9,
    icon: 'BookOpen',
    color: '#58cc02',
    lessons: [
      {
        id: 'lesson-orth-9-1',
        sectionId: 'section-orth-1',
        title: 'Задание 9. Уровень 1',
        type: 'practice',
        description: 'Выберите правильное написание с пропущенными буквами',
        xpReward: 60,
        prerequisites: [],
        questions: [
          { id: 'q9-1', type: 'single', text: 'Вставьте пропущенные буквы: ст..рожилы', options: ['старожилы', 'сторожилы'], correctAnswer: ['старожилы'], explanation: 'Приставка старо- + корень жил (от жить). Проверочное слово: жилец.', difficulty: 'easy', xpReward: 10, atoms: ['roots'] },
          { id: 'q9-2', type: 'single', text: 'Вставьте пропущенные буквы: иск..са', options: ['исказа', 'искаса'], correctAnswer: ['исказа'], explanation: 'Корень -каз- (проверочное: казать). Приставка ис-.', difficulty: 'easy', xpReward: 10, atoms: ['prefix_iz_is', 'roots'] },
          { id: 'q9-3', type: 'single', text: 'Вставьте пропущенные буквы: оп..лчение', options: ['ополчение', 'опалчение'], correctAnswer: ['ополчение'], explanation: 'Существительное ополчение — с о в корне.', difficulty: 'easy', xpReward: 10, atoms: ['roots'] },
          { id: 'q9-4', type: 'single', text: 'Вставьте пропущенные буквы: выск..чка', options: ['выскочка', 'выскачка'], correctAnswer: ['выскочка'], explanation: 'Корень -скоч- (чередуется с -скак- в скакать). Проверочное: скакать.', difficulty: 'easy', xpReward: 10, atoms: ['root_vowel_alternation', 'root_skak_skoch'] },
          { id: 'q9-5', type: 'single', text: 'Вставьте пропущенные буквы: р..стовщик', options: ['ростовщик', 'растовщик'], correctAnswer: ['ростовщик'], explanation: 'Корень -рос- (чередуется с -раст-). Проверочное: рост.', difficulty: 'easy', xpReward: 10, atoms: ['root_vowel_alternation', 'root_rast_ros'] },
          { id: 'q9-6', type: 'single', text: 'Вставьте пропущенные буквы: пл..вец', options: ['пловец', 'плавец'], correctAnswer: ['пловец'], explanation: 'Корень -плав- (чередование а/о). Проверочное: плавать.', difficulty: 'easy', xpReward: 10, atoms: ['root_vowel_alternation', 'root_plav_plov'] },
          { id: 'q9-7', type: 'single', text: 'Вставьте пропущенные буквы: дир..жёр', options: ['дирижёр', 'диражёр'], correctAnswer: ['дирижёр'], explanation: 'Иноязычное слово (фр. diriger), непроверяемая гласная.', difficulty: 'easy', xpReward: 10, atoms: ['foreign_words'] },
          { id: 'q9-8', type: 'single', text: 'Вставьте пропущенные буквы: сп..шите (текст)', options: ['спешите', 'спишите'], correctAnswer: ['спешите'], explanation: 'Корень -пеш- (чередуется с -пиш- в писать). Проверочное слово: писать.', difficulty: 'easy', xpReward: 10, atoms: ['roots'] },
          { id: 'q9-9', type: 'single', text: 'Вставьте пропущенные буквы: выд..рать (страницу)', options: ['выдерать', 'выдирать'], correctAnswer: ['выдерать'], explanation: 'Корень -дер- (чередуется с -дра-). Проверочное: драть.', difficulty: 'easy', xpReward: 10, atoms: ['root_consonant_alternation', 'root_der_dra'] },
          { id: 'q9-10', type: 'single', text: 'Вставьте пропущенные буквы: м..раторий', options: ['мораторий', 'мураторий'], correctAnswer: ['мораторий'], explanation: 'Иноязычное слово (лат. moratorius). Непроверяемая гласная о.', difficulty: 'easy', xpReward: 10, atoms: ['foreign_words'] },
          { id: 'q9-11', type: 'single', text: 'Вставьте пропущенные буквы: метаф..ра', options: ['метафора', 'метафура'], correctAnswer: ['метафора'], explanation: 'Иноязычное слово (греч. metaphora). Непроверяемая гласная о.', difficulty: 'easy', xpReward: 10, atoms: ['foreign_words'] },
          { id: 'q9-12', type: 'single', text: 'Вставьте пропущенные буквы: парад..ксальный', options: ['парадоксальный', 'парадаксальный'], correctAnswer: ['парадоксальный'], explanation: 'Иноязычное слово (греч. paradoxos). Непроверяемая гласная о.', difficulty: 'easy', xpReward: 10, atoms: ['foreign_words'] },
          { id: 'q9-13', type: 'single', text: 'Вставьте пропущенные буквы: поч..татель (таланта)', options: ['почитатель', 'почетатель'], correctAnswer: ['почитатель'], explanation: 'Корень -чит- (проверяемая). Проверочное: читать.', difficulty: 'easy', xpReward: 10, atoms: ['root_verifiable', 'root_chit_chitat'] },
          { id: 'q9-14', type: 'single', text: 'Вставьте пропущенные буквы: обж..гаться', options: ['обжигаться', 'обжегаться'], correctAnswer: ['обжигаться'], explanation: 'Корень -жиг- (чередуется с -жег-). Проверочное: жечь.', difficulty: 'easy', xpReward: 10, atoms: ['root_consonant_alternation', 'root_zhig_zheg'] },
          { id: 'q9-15', type: 'single', text: 'Вставьте пропущенные буквы: прож..вать (по адресу)', options: ['проживать', 'прожевать'], correctAnswer: ['проживать'], explanation: 'Корень -жив- (проверяемая). Проверочное: жить.', difficulty: 'easy', xpReward: 10, atoms: ['root_verifiable', 'root_zhiv_zhit'] },
        ]
      },
      {
        id: 'lesson-orth-9-2',
        sectionId: 'section-orth-1',
        title: 'Задание 9. Уровень 2',
        type: 'practice',
        description: 'Сложные случаи правописания н/нн',
        xpReward: 70,
        prerequisites: ['lesson-orth-9-1'],
        questions: [
          { id: 'q9-16', type: 'single', text: 'Вставьте пропущенные буквы: ед..номышленники', options: ['единомышленники', 'еденомышленники'], correctAnswer: ['единомышленники'], explanation: 'Корень -един- (от единый). Проверочное слово: единый.', difficulty: 'medium', xpReward: 12, atoms: ['roots'] },
          { id: 'q9-17', type: 'single', text: 'Вставьте пропущенные буквы: зап..вала (в хоре)', options: ['запевала', 'запивала'], correctAnswer: ['запевала'], explanation: 'Корень -пев- (от петь). Проверочное слово: петь.', difficulty: 'medium', xpReward: 12, atoms: ['roots'] },
          { id: 'q9-18', type: 'single', text: 'Вставьте пропущенные буквы: оф..церский', options: ['офицерский', 'официрский'], correctAnswer: ['офицерский'], explanation: 'Иноязычное слово (нем. Offizier). Непроверяемая гласная е.', difficulty: 'medium', xpReward: 12, atoms: ['foreign_words'] },
          { id: 'q9-19', type: 'single', text: 'Вставьте пропущенные буквы: обр..зность', options: ['образность', 'оброзность'], correctAnswer: ['образность'], explanation: 'Корень -образ- (от образ). Проверочное слово: образ.', difficulty: 'medium', xpReward: 12, atoms: ['roots'] },
          { id: 'q9-20', type: 'single', text: 'Вставьте пропущенные буквы: либер..лизм', options: ['либерализм', 'либераллизм'], correctAnswer: ['либерализм'], explanation: 'Одна л: либерализм.', difficulty: 'medium', xpReward: 12, atoms: ['foreign_words'] },
          { id: 'q9-21', type: 'single', text: 'Вставьте пропущенные буквы: м..кнуть (хлеб в соль)', options: ['макнуть', 'мокнуть'], correctAnswer: ['макнуть'], explanation: 'Корень -мак- (чередуется с -мок-). Проверочное слово: мокнуть.', difficulty: 'medium', xpReward: 12, atoms: ['roots'] },
          { id: 'q9-22', type: 'single', text: 'Вставьте пропущенные буквы: изд..лека', options: ['издалека', 'издолека'], correctAnswer: ['издалека'], explanation: 'Корень -далек- (от далекий). Проверочное слово: далеко.', difficulty: 'medium', xpReward: 12, atoms: ['roots'] },
          { id: 'q9-23', type: 'single', text: 'Вставьте пропущенные буквы: укр..щать', options: ['укрощать', 'укращать'], correctAnswer: ['укрощать'], explanation: 'Корень -крош- (чередуется с -краш-). Проверочное слово: красить.', difficulty: 'medium', xpReward: 12, atoms: ['roots'] },
          { id: 'q9-24', type: 'single', text: 'Вставьте пропущенные буквы: пок..рять (врага)', options: ['покорять', 'покарять'], correctAnswer: ['покорять'], explanation: 'Корень -кор- (чередуется с -клан-). Проверочное слово: кланяться.', difficulty: 'medium', xpReward: 12, atoms: ['roots'] },
          { id: 'q9-25', type: 'single', text: 'Вставьте пропущенные буквы: прив..дение (примера)', options: ['приведение', 'привидение'], correctAnswer: ['приведение'], explanation: 'Корень -вед- (от вести). Проверочное слово: вести.', difficulty: 'medium', xpReward: 12, atoms: ['roots'] },
          { id: 'q9-26', type: 'single', text: 'Вставьте пропущенные буквы: выч..тание', options: ['вычитание', 'вычетание'], correctAnswer: ['вычитание'], explanation: 'Корень -чит- (от читать). Проверочное слово: читать.', difficulty: 'medium', xpReward: 12, atoms: ['roots'] },
          { id: 'q9-27', type: 'single', text: 'Вставьте пропущенные буквы: вин..грет', options: ['винегрет', 'винигрет'], correctAnswer: ['винегрет'], explanation: 'Иноязычное слово (фр. vinaigrette). Непроверяемая гласная е.', difficulty: 'medium', xpReward: 12, atoms: ['roots'] },
          { id: 'q9-28', type: 'single', text: 'Вставьте пропущенные буквы: акк..мпанировать', options: ['аккомпанировать', 'аккомпаннировать'], correctAnswer: ['аккомпанировать'], explanation: 'Иноязычное слово (итал. accompagnare). Одна согласная м.', difficulty: 'medium', xpReward: 12, atoms: ['roots'] },
          { id: 'q9-29', type: 'single', text: 'Вставьте пропущенные буквы: ан..логичный', options: ['аналогичный', 'анологичный'], correctAnswer: ['аналогичный'], explanation: 'Иноязычное слово (греч. analogos). Непроверяемая гласная а.', difficulty: 'medium', xpReward: 12, atoms: ['roots'] },
          { id: 'q9-30', type: 'single', text: 'Вставьте пропущенные буквы: пол..гаться (на чьё-то мнение)', options: ['полагаться', 'полягаться'], correctAnswer: ['полагаться'], explanation: 'Корень -лаг- (от ложь в значении "говорить").', difficulty: 'medium', xpReward: 12, atoms: ['roots'] },
        ]
      },
      {
        id: 'lesson-orth-9-ege',
        sectionId: 'section-orth-1',
        title: 'Задание 9. Формат ЕГЭ',
        type: 'practice',
        description: 'Реальные задания в формате ЕГЭ',
        xpReward: 80,
        prerequisites: ['lesson-orth-9-2'],
        questions: [
          { id: 'q9-ege-1', type: 'ege-multiple', text: 'Укажите варианты ответов, в которых во всех словах одного ряда пропущена одна и та же буква.', options: ['1) г..потеза, изб..рательная, заст..лая', '2) д..рижировать, тр..петать, вбл..зи', '3) безотл..гательный, д..лёкая, пов..р', '4) сист..матизация, сх..матический, зат..млённый', '5) к..мпонент, предл..гается, ум..лчать'], correctAnswer: ['1', '3'], explanation: '1) гИпотеза, избИрательная, застИлая — везде И. 3) безотлАгательный, дАлёкая, повАр — везде А.', difficulty: 'medium', xpReward: 15, atoms: ['roots'] },
        ]
      }
    ]
  },
  {
    id: 'section-orth-2',
    courseId: 'ege-russian-2025',
    title: 'Орфография: суффиксы',
    subtitle: 'Прилагательные, деепричастия, существительные',
    order: 11,
    icon: 'BookOpen',
    color: '#2E75B6',
    lessons: [
      {
        id: 'lesson-orth-11-1',
        sectionId: 'section-orth-2',
        title: 'Задание 11. Суффиксы',
        type: 'practice',
        description: 'Выберите правильное написание с пропущенными буквами',
        xpReward: 60,
        prerequisites: [],
        questions: [
          { id: 'q11-1', type: 'single', text: 'Вставьте пропущенные буквы: щегол..ватый', options: ['щеголеватый', 'щеголиватый'], correctAnswer: ['щеголеватый'], explanation: 'Суффикс -еват-: щеголеватый.', difficulty: 'easy', xpReward: 10, atoms: ['suffixes'] },
          { id: 'q11-2', type: 'single', text: 'Вставьте пропущенные буквы: находч..вый', options: ['находчивый', 'находчевый'], correctAnswer: ['находчивый'], explanation: 'Суффикс -ив-: находчивый.', difficulty: 'easy', xpReward: 10, atoms: ['suffixes'] },
          { id: 'q11-3', type: 'single', text: 'Вставьте пропущенные буквы: застр..вать', options: ['застревать', 'застраивать'], correctAnswer: ['застревать'], explanation: 'Деепричастие: застревать.', difficulty: 'easy', xpReward: 10, atoms: ['suffixes'] },
          { id: 'q11-4', type: 'single', text: 'Вставьте пропущенные буквы: гел..вая (ручка)', options: ['гелевая', 'гелиевая'], correctAnswer: ['гелевая'], explanation: 'От гель: гелевая.', difficulty: 'easy', xpReward: 10, atoms: ['suffixes'] },
          { id: 'q11-5', type: 'single', text: 'Вставьте пропущенные буквы: испыт..вать', options: ['испытывать', 'испытевать'], correctAnswer: ['испытывать'], explanation: 'Суффикс -ыв-: испытывать.', difficulty: 'easy', xpReward: 10, atoms: ['suffixes'] },
        ]
      }
    ]
  }
]

