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
        description: 'Впишите пропущенную букву',
        xpReward: 60,
        prerequisites: [],
        questions: [
          { id: 'q9-1', type: 'text', text: 'Впишите пропущенную букву: ст_рожилы', correctAnswer: ['а'], explanation: 'Корень -стар- (проверочное: старить).', difficulty: 'easy', xpReward: 10, atoms: ['task9', 'roots'] },
          { id: 'q9-2', type: 'text', text: 'Впишите пропущенную букву: иск_зить', correctAnswer: ['а'], explanation: 'Корень -каз- (проверочное: казать). Приставка ис-.', difficulty: 'easy', xpReward: 10, atoms: ['task9', 'prefix_iz_is', 'roots'] },
          { id: 'q9-3', type: 'text', text: 'Впишите пропущенную букву: оп_лчение', correctAnswer: ['о'], explanation: 'Существительное ополчение — с о в корне.', difficulty: 'easy', xpReward: 10, atoms: ['task9', 'roots'] },
          { id: 'q9-4', type: 'text', text: 'Впишите пропущенную букву: выск_чка', correctAnswer: ['о'], explanation: 'Корень -скоч- (чередуется с -скак- в скакать). Проверочное: скакать.', difficulty: 'easy', xpReward: 10, atoms: ['task9', 'root_vowel_alternation', 'root_skak_skoch'] },
          { id: 'q9-5', type: 'text', text: 'Впишите пропущенную букву: р_стовщик', correctAnswer: ['о'], explanation: 'Корень -рос- (чередуется с -раст-). Проверочное: рост.', difficulty: 'easy', xpReward: 10, atoms: ['task9', 'root_vowel_alternation', 'root_rast_ros'] },
          { id: 'q9-6', type: 'text', text: 'Впишите пропущенную букву: пл_вец', correctAnswer: ['о'], explanation: 'Корень -плав- (чередование а/о). Проверочное: плавать.', difficulty: 'easy', xpReward: 10, atoms: ['task9', 'root_vowel_alternation', 'root_plav_plov'] },
          { id: 'q9-7', type: 'text', text: 'Впишите пропущенную букву: дир_жёр', correctAnswer: ['и'], explanation: 'Иноязычное слово (фр. diriger), непроверяемая гласная.', difficulty: 'easy', xpReward: 10, atoms: ['task9', 'foreign_words'] },
          { id: 'q9-8', type: 'text', text: 'Впишите пропущенную букву: сп_шите (текст)', correctAnswer: ['е'], explanation: 'Корень -пеш- (чередуется с -пиш- в пишу). Проверочное слово: пеший.', difficulty: 'easy', xpReward: 10, atoms: ['task9', 'roots'] },
          { id: 'q9-9', type: 'text', text: 'Впишите пропущенную букву: выд_рать (страницу)', correctAnswer: ['и'], explanation: 'Корень -дир- (чередуется с -дра-). Проверочное: драть.', difficulty: 'easy', xpReward: 10, atoms: ['task9', 'root_vowel_alternation', 'root_dir_dra'] },
          { id: 'q9-10', type: 'text', text: 'Впишите пропущенную букву: м_раторий', correctAnswer: ['о'], explanation: 'Иноязычное слово (лат. moratorius). Непроверяемая гласная о.', difficulty: 'easy', xpReward: 10, atoms: ['task9', 'foreign_words'] },
          { id: 'q9-11', type: 'text', text: 'Впишите пропущенную букву: метаф_ра', correctAnswer: ['о'], explanation: 'Иноязычное слово (греч. metaphora). Непроверяемая гласная о.', difficulty: 'easy', xpReward: 10, atoms: ['task9', 'foreign_words'] },
          { id: 'q9-12', type: 'text', text: 'Впишите пропущенную букву: парад_ксальный', correctAnswer: ['о'], explanation: 'Проверьте через однокоренное: парадокс.', difficulty: 'easy', xpReward: 10, atoms: ['task9', 'foreign_words'] },
          { id: 'q9-13', type: 'text', text: 'Впишите пропущенную букву: поч_татель (таланта)', correctAnswer: ['и'], explanation: 'Корень -чит- (проверяемый). Проверочное: читать. Суффикс -атель-.', difficulty: 'easy', xpReward: 10, atoms: ['task9', 'root_verifiable', 'root_chit_chitat'] },
          { id: 'q9-14', type: 'text', text: 'Впишите пропущенную букву: обж_гаться', correctAnswer: ['и'], explanation: 'Корень -жиг- (чередуется с -жег-). Суффикс -а-, поэтому пишется -и-.', difficulty: 'easy', xpReward: 10, atoms: ['task9', 'root_consonant_alternation', 'root_zhig_zheg'] },
          { id: 'q9-15', type: 'text', text: 'Впишите пропущенную букву: прож_вать (по адресу)', correctAnswer: ['и'], explanation: 'Корень -жив- (проверяемая). Проверочное: жить.', difficulty: 'easy', xpReward: 10, atoms: ['task9', 'root_verifiable', 'root_zhiv_zhit'] },
        ]
      },
      {
        id: 'lesson-orth-9-2',
        sectionId: 'section-orth-1',
        title: 'Задание 9. Уровень 2',
        type: 'practice',
        description: 'Сложные случаи правописания корней',
        xpReward: 70,
        prerequisites: ['lesson-orth-9-1'],
        questions: [
          { id: 'q9-16', type: 'text', text: 'Впишите пропущенную букву: ед_номышленники', correctAnswer: ['и'], explanation: 'Корень -един- (от единый). Проверочное слово: единый.', difficulty: 'medium', xpReward: 12, atoms: ['task9', 'roots'] },
          { id: 'q9-17', type: 'text', text: 'Впишите пропущенную букву: зап_вала (в хоре)', correctAnswer: ['е'], explanation: 'Корень -пев- (от петь). Проверочное слово: петь.', difficulty: 'medium', xpReward: 12, atoms: ['task9', 'roots'] },
          { id: 'q9-18', type: 'text', text: 'Впишите пропущенную букву: оф_церский', correctAnswer: ['и'], explanation: 'Иноязычное слово (нем. Offizier). Непроверяемая гласная.', difficulty: 'medium', xpReward: 12, atoms: ['task9', 'foreign_words'] },
          { id: 'q9-19', type: 'text', text: 'Впишите пропущенную букву: обр_зность', correctAnswer: ['а'], explanation: 'Корень -образ- (от образ). Проверочное слово: образ.', difficulty: 'medium', xpReward: 12, atoms: ['task9', 'roots'] },
          { id: 'q9-20', type: 'text', text: 'Впишите пропущенную букву: либер_лизм', correctAnswer: ['а'], explanation: 'Иноязычное слово (лат. liberalis). Непроверяемая гласная а.', difficulty: 'medium', xpReward: 12, atoms: ['task9', 'foreign_words'] },
          { id: 'q9-21', type: 'text', text: 'Впишите пропущенную букву: м_кнуть (хлеб в соль)', correctAnswer: ['а'], explanation: 'Корень -мак- (чередуется с -мок-). Проверочное слово: мокнуть.', difficulty: 'medium', xpReward: 12, atoms: ['task9', 'roots'] },
          { id: 'q9-22', type: 'text', text: 'Впишите пропущенную букву: изд_лека', correctAnswer: ['а'], explanation: 'Корень -далек- (от далекий). Проверочное слово: далеко.', difficulty: 'medium', xpReward: 12, atoms: ['task9', 'roots'] },
          { id: 'q9-23', type: 'text', text: 'Впишите пропущенную букву: укр_щать', correctAnswer: ['о'], explanation: 'Корень -крощ- (чередуется с -кращ-). Проверочное слово: кроткий.', difficulty: 'medium', xpReward: 12, atoms: ['task9', 'roots'] },
          { id: 'q9-24', type: 'text', text: 'Впишите пропущенную букву: пок_рять (врага)', correctAnswer: ['о'], explanation: 'Корень -кор- в покорять.', difficulty: 'medium', xpReward: 12, atoms: ['task9', 'roots'] },
          { id: 'q9-25', type: 'text', text: 'Впишите пропущенную букву: прив_дение (примера)', correctAnswer: ['е'], explanation: 'Корень -вед- (от вести). Проверочное слово: вести.', difficulty: 'medium', xpReward: 12, atoms: ['task9', 'roots'] },
          { id: 'q9-26', type: 'text', text: 'Впишите пропущенную букву: выч_тание', correctAnswer: ['и'], explanation: 'Корень -чит- (от читать). Проверочное слово: читать.', difficulty: 'medium', xpReward: 12, atoms: ['task9', 'roots'] },
          { id: 'q9-27', type: 'text', text: 'Впишите пропущенную букву: вин_грет', correctAnswer: ['е'], explanation: 'Иноязычное слово (фр. vinaigrette). Непроверяемая гласная е.', difficulty: 'medium', xpReward: 12, atoms: ['task9', 'roots'] },
          { id: 'q9-28', type: 'text', text: 'Впишите пропущенную букву: акк_мпанировать', correctAnswer: ['о'], explanation: 'Иноязычное слово (итал. accompagnare). Одна согласная м.', difficulty: 'medium', xpReward: 12, atoms: ['task9', 'roots'] },
          { id: 'q9-29', type: 'text', text: 'Впишите пропущенную букву: ан_логичный', correctAnswer: ['а'], explanation: 'Иноязычное слово (греч. analogos). Непроверяемая гласная а.', difficulty: 'medium', xpReward: 12, atoms: ['task9', 'roots'] },
          { id: 'q9-30', type: 'text', text: 'Впишите пропущенную букву: пол_гаться (на чьё-то мнение)', correctAnswer: ['а'], explanation: 'Корень -лаг- (чередуется с -лож-). Проверочное слово: положить.', difficulty: 'medium', xpReward: 12, atoms: ['task9', 'roots'] },
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
          { id: 'q9-ege-1', type: 'ege-multiple', text: 'Укажите варианты ответов, в которых во всех словах одного ряда пропущена одна и та же буква.', options: ['1) г_потеза, изб_рательная, заст_лая', '2) д_рижировать, тр_петать, вбл_зи', '3) безотл_гательный, д_лёкая, пов_р', '4) сист_матизация, сх_матический, зат_млённый', '5) к_мпонент, предл_гается, ум_лчать'], correctAnswer: ['1', '3', '4'], explanation: '1) гИпотеза, избИрательная, застИлая — везде И. 3) безотлАгательный, дАлёкая, повАр — везде А. 4) систЕматизация, схЕматический, затЕмлённый — везде Е.', difficulty: 'medium', xpReward: 15, atoms: ['task9', 'roots'] },
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
        description: 'Впишите пропущенную букву в суффикс',
        xpReward: 60,
        prerequisites: [],
        questions: [
          { id: 'q11-1', type: 'text', text: 'Впишите пропущенную букву: щегол_ватый', correctAnswer: ['е'], explanation: 'Суффикс -еват-: щеголеватый.', difficulty: 'easy', xpReward: 10, atoms: ['task9', 'suffixes'] },
          { id: 'q11-2', type: 'text', text: 'Впишите пропущенную букву: находч_вый', correctAnswer: ['и'], explanation: 'Суффикс -ив-: находчивый.', difficulty: 'easy', xpReward: 10, atoms: ['task9', 'suffixes'] },
          { id: 'q11-3', type: 'text', text: 'Впишите пропущенную букву: застр_вать', correctAnswer: ['е'], explanation: 'Суффикс -ева- в глаголе застревать.', difficulty: 'easy', xpReward: 10, atoms: ['task9', 'suffixes'] },
          { id: 'q11-4', type: 'text', text: 'Впишите пропущенную букву: гел_вая (ручка)', correctAnswer: ['е'], explanation: 'От гель: гелевая.', difficulty: 'easy', xpReward: 10, atoms: ['task9', 'suffixes'] },
          { id: 'q11-5', type: 'text', text: 'Впишите пропущенную букву: испыт_вать', correctAnswer: ['ы'], explanation: 'Суффикс -ыв-: испытывать.', difficulty: 'easy', xpReward: 10, atoms: ['task9', 'suffixes'] },
        ]
      }
    ]
  }
]
