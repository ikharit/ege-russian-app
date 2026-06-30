import { Section } from '../../types'
import { task13EgeQuestions } from '../../data/questions/task13_ege'
import { task13AtomQuestions } from '../../data/questions/task13_atom'

export const grammarSections: Section[] = [
  {
    id: 'section-gram-1',
    courseId: 'ege-russian-2025',
    title: 'Грамматика: окончания, НЕ/НИ, слитно/раздельно',
    subtitle: 'Задания 12–14 ЕГЭ',
    order: 12,
    icon: 'GraduationCap',
    color: '#ce82ff',
    lessons: [
      {
        id: 'lesson-gram-12-1',
        sectionId: 'section-gram-1',
        title: 'Задание 12. Личные окончания глаголов',
        type: 'practice',
        description: 'Правописание личных окончаний глаголов в настоящем и прошедшем времени',
        xpReward: 60,
        prerequisites: [],
        questions: [
        { id: 'q12-1', type: 'text', text: 'Впишите пропущенную букву: (они) стро_т', correctAnswer: ['я'], explanation: '2-е спряжение: строИТЬ — на -ИТЬ → И А Я (мИлАЯ). Они строЯТ.', difficulty: 'easy', xpReward: 10, atoms: ['conjugation_2'] },
          { id: 'q12-2', type: 'text', text: 'Впишите пропущенную букву: (они) смотр_т', correctAnswer: ['я'], explanation: '2-е спряжение: смотрЕТЬ. Не на -ИТЬ → Е У Ю (цЕлУЮ). Они смотрЯТ.', difficulty: 'easy', xpReward: 10, atoms: ['conjugation_2'] },
          { id: 'q12-3', type: 'text', text: 'Впишите пропущенную букву: (они) держ_т', correctAnswer: ['а'], explanation: 'ИСКЛЮЧЕНИЕ: держАТЬ — не на -ИТЬ, но 2-е спряжение (как вертИшь). Они держАТ.', difficulty: 'easy', xpReward: 10, atoms: ['conjugation_2'] },
          { id: 'q12-4', type: 'text', text: 'Впишите пропущенную букву: (они) гон_т', correctAnswer: ['я'], explanation: 'ИСКЛЮЧЕНИЕ: гнАТЬ — не на -ИТЬ, но 2-е спряжение (как вертИшь). Не на -ИТЬ → Е У Ю (цЕлУЮ). Они гонЯТ.', difficulty: 'easy', xpReward: 10, atoms: ['conjugation_2'] },
          { id: 'q12-5', type: 'text', text: 'Впишите пропущенную букву: (они) вид_т', correctAnswer: ['я'], explanation: '2-е спряжение: видЕТЬ. Не на -ИТЬ → Е У Ю (цЕлУЮ). Они видЯТ.', difficulty: 'easy', xpReward: 10, atoms: ['conjugation_2'] },
          { id: 'q12-6', type: 'text', text: 'Впишите пропущенную букву: (они) нес_т', correctAnswer: ['у'], explanation: '1-е спряжение: нестИ — не на -ИТЬ → Е У Ю (цЕлУЮ). Они несУТ.', difficulty: 'easy', xpReward: 10, atoms: ['conjugation_1'] },
          { id: 'q12-7', type: 'text', text: 'Впишите пропущенную букву: (они) ид_т', correctAnswer: ['у'], explanation: '1-е спряжение: идтИ — не на -ИТЬ → Е У Ю (цЕлУЮ). Они идУТ.', difficulty: 'easy', xpReward: 10, atoms: ['conjugation_1'] },
          { id: 'q12-8', type: 'text', text: 'Впишите пропущенную букву: (они) бег_т', correctAnswer: ['у'], explanation: '1-е спряжение: бежАТЬ — не на -ИТЬ → Е У Ю (цЕлУЮ). Они бегУТ.', difficulty: 'easy', xpReward: 10, atoms: ['conjugation_1'] },
          { id: 'q12-9', type: 'text', text: 'Впишите пропущенную букву: (они) бред_т', correctAnswer: ['у'], explanation: '1-е спряжение: бредИ — не на -ИТЬ → Е У Ю (цЕлУЮ). Они бредУТ.', difficulty: 'easy', xpReward: 10, atoms: ['conjugation_1'] },
          { id: 'q12-10', type: 'text', text: 'Впишите пропущенную букву: (они) дремл_т', correctAnswer: ['ю'], explanation: '2-е спряжение: дремАТЬ. Не на -ИТЬ → Е У Ю (цЕлУЮ). Они дремлЮТ.', difficulty: 'easy', xpReward: 10, atoms: ['conjugation_2'] },
          { id: 'q12-11', type: 'text', text: 'Впишите пропущенную букву: (они) стел_т', correctAnswer: ['ю'], explanation: 'ИСКЛЮЧЕНИЕ: стелИТЬ — на -ИТЬ, но 1-е спряжение (как брить, гнать). На -ИТЬ → И А Я (мИлАЯ), но это исключение: стелЮТ.', difficulty: 'easy', xpReward: 10, atoms: ['conjugation_2'] },
          { id: 'q12-12', type: 'text', text: 'Впишите пропущенную букву: (они) терп_т', correctAnswer: ['я'], explanation: '2-е спряжение: терпЕТЬ. Не на -ИТЬ → Е У Ю (цЕлУЮ). Они терпЯТ.', difficulty: 'easy', xpReward: 10, atoms: ['conjugation_2'] },
          { id: 'q12-13', type: 'text', text: 'Впишите пропущенную букву: (они) верт_т', correctAnswer: ['я'], explanation: '2-е спряжение: вертЕТЬ. Не на -ИТЬ → Е У Ю (цЕлУЮ). Они вертЯТ.', difficulty: 'easy', xpReward: 10, atoms: ['conjugation_2'] },
          { id: 'q12-14', type: 'text', text: 'Впишите пропущенную букву: (они) обид_т', correctAnswer: ['я'], explanation: '2-е спряжение: обидЕТЬ. Не на -ИТЬ → Е У Ю (цЕлУЮ). Они обидЯТ.', difficulty: 'easy', xpReward: 10, atoms: ['conjugation_2'] },
          { id: 'q12-15', type: 'text', text: 'Впишите пропущенную букву: (они) лов_т', correctAnswer: ['я'], explanation: '2-е спряжение: ловИТЬ — на -ИТЬ → И А Я (мИлАЯ). Они ловЯТ.', difficulty: 'easy', xpReward: 10, atoms: ['conjugation_2'] },
        ]
      },
      {
        id: 'lesson-gram-12-2',
        sectionId: 'section-gram-1',
        title: 'Задание 12. Страдательные причастия',
        type: 'practice',
        description: 'Правописание личных окончаний страдательных причастий',
        xpReward: 60,
        prerequisites: ['lesson-gram-12-1'],
        questions: [
          { id: 'q12-16', type: 'single', text: 'Как правильно? (что сделано?) построен..', options: ['построен', 'построенн'], correctAnswer: ['построен'], explanation: 'Краткое причастие: -ен (построен).', difficulty: 'easy', xpReward: 10, atoms: ['participle_short'] },
          { id: 'q12-17', type: 'single', text: 'Как правильно? (что сделано?) написан..', options: ['написан', 'написанн'], correctAnswer: ['написан'], explanation: 'Краткое причастие: -ан (написан).', difficulty: 'easy', xpReward: 10, atoms: ['participle_short'] },
          { id: 'q12-18', type: 'single', text: 'Как правильно? (что сделано?) решен..', options: ['решён', 'решен'], correctAnswer: ['решён'], explanation: 'Краткое причастие: -ён (решён).', difficulty: 'easy', xpReward: 10, atoms: ['participle_short'] },
          { id: 'q12-19', type: 'single', text: 'Как правильно? (что сделано?) прочитан..', options: ['прочитан', 'прочитанн'], correctAnswer: ['прочитан'], explanation: 'Краткое причастие: -ан (прочитан).', difficulty: 'easy', xpReward: 10, atoms: ['participle_short'] },
          { id: 'q12-20', type: 'single', text: 'Как правильно? (что сделано?) приготовлен..', options: ['приготовлен', 'приготовленн'], correctAnswer: ['приготовлен'], explanation: 'Краткое причастие: -ен (приготовлен).', difficulty: 'easy', xpReward: 10, atoms: ['participle_short'] },
          { id: 'q12-21', type: 'single', text: 'Как правильно? (что сделано?) взя..', options: ['взят', 'взятт'], correctAnswer: ['взят'], explanation: 'Краткое причастие: -ят (взят).', difficulty: 'easy', xpReward: 10, atoms: ['participle_short'] },
          { id: 'q12-22', type: 'single', text: 'Как правильно? (что сделано?) начат..', options: ['начат', 'начатт'], correctAnswer: ['начат'], explanation: 'Краткое причастие: -ат (начат).', difficulty: 'easy', xpReward: 10, atoms: ['participle_short'] },
          { id: 'q12-23', type: 'single', text: 'Как правильно? (что сделано?) открыт..', options: ['открыт', 'открытт'], correctAnswer: ['открыт'], explanation: 'Краткое причастие: -ыт (открыт).', difficulty: 'easy', xpReward: 10, atoms: ['participle_short'] },
          { id: 'q12-24', type: 'single', text: 'Как правильно? (что сделано?) закрыт..', options: ['закрыт', 'закрытт'], correctAnswer: ['закрыт'], explanation: 'Краткое причастие: -ыт (закрыт).', difficulty: 'easy', xpReward: 10, atoms: ['participle_short'] },
          { id: 'q12-25', type: 'single', text: 'Как правильно? (что сделано?) сделан..', options: ['сделан', 'сделанн'], correctAnswer: ['сделан'], explanation: 'Краткое причастие: -ан (сделан).', difficulty: 'easy', xpReward: 10, atoms: ['participle_short'] },
          { id: 'q12-26', type: 'single', text: 'Как правильно? (что сделано?) понят..', options: ['понят', 'понятт'], correctAnswer: ['понят'], explanation: 'Краткое причастие: -ят (понят).', difficulty: 'easy', xpReward: 10, atoms: ['participle_short'] },
          { id: 'q12-27', type: 'single', text: 'Как правильно? (что сделано?) изучен..', options: ['изучен', 'изученн'], correctAnswer: ['изучен'], explanation: 'Краткое причастие: -ен (изучен).', difficulty: 'easy', xpReward: 10, atoms: ['participle_short'] },
          { id: 'q12-28', type: 'single', text: 'Как правильно? (что сделано?) забыт..', options: ['забыт', 'забытт'], correctAnswer: ['забыт'], explanation: 'Краткое причастие: -ыт (забыт).', difficulty: 'easy', xpReward: 10, atoms: ['participle_short'] },
          { id: 'q12-29', type: 'single', text: 'Как правильно? (что сделано?) привезен..', options: ['привезён', 'привезен'], correctAnswer: ['привезён'], explanation: 'Краткое причастие: -ён (привезён).', difficulty: 'easy', xpReward: 10, atoms: ['participle_short'] },
          { id: 'q12-30', type: 'single', text: 'Как правильно? (что сделано?) украден..', options: ['украден', 'украденн'], correctAnswer: ['украден'], explanation: 'Краткое причастие: -ен (украден).', difficulty: 'easy', xpReward: 10, atoms: ['participle_short'] },
        ]
      },
      {
        id: 'lesson-gram-12-ege',
        sectionId: 'section-gram-1',
        title: 'Задание 12. Формат ЕГЭ',
        type: 'practice',
        description: 'Реальные задания в формате ЕГЭ',
        xpReward: 80,
        prerequisites: ['lesson-gram-12-2'],
        questions: [
          { id: 'q12-ege-1', type: 'ege-multiple', text: 'Укажите варианты ответов, в которых во всех словах одного ряда пропущена одна и та же буква.', options: ['1) уменьш_нный, высуш_нный, занавеш_нное', '2) мел_щий, лопоч_щий, бор_шься', '3) распуска_тся, клокоч_т, разве_шь', '4) скач_нный, повенч_нные, замеш_нный', '5) перемен_тся, науч_т, слыш_тся'], correctAnswer: ['1', '3', '4', '5'], explanation: '1) уменьшЕнный, высушЕнный, занавешЕнное — везде Е. 3) распускаЕтся, клокочЕт, развеЕшь — везде Е. 4) скачАнный, повенчАнные, замешАнный — везде А. 5) переменИтся, научИт, слышИтся — везде И.', difficulty: 'medium', xpReward: 15, atoms: ['task12', 'endings'] },
          { id: 'q12-ege-2', type: 'ege-multiple', text: 'Укажите варианты ответов, в которых во всех словах одного ряда пропущена одна и та же буква.', options: ['1) мел_щий, лопоч_щий, блещ_щий', '2) уменьш_нный, высуш_нный, разбуж_нный', '3) скач_нный, повенч_нные, замеш_нный', '4) ключ_вший, относ_шься, терп_шь', '5) перемен_тся, науч_т, с_вший'], correctAnswer: ['1', '2', '3', '4'], explanation: '1) мелУщий, лопочУщий, блещУщий — везде У. 2) уменьшЕнный, высушЕнный, разбужЕнный — везде Е. 3) скачАнный, повенчАнные, замешАнный — везде А. 4) ключИвший, относИшься, терпИшь — везде И.', difficulty: 'medium', xpReward: 15, atoms: ['task12', 'endings'] },
          { id: 'q12-ege-3', type: 'ege-multiple', text: 'Укажите варианты ответов, в которых во всех словах одного ряда пропущена одна и та же буква.', options: ['1) уменьш_нный, высуш_нный, занавеш_нное', '2) мел_щий, лопоч_щий, бор_шься', '3) распуска_тся, клокоч_т, разве_шь', '4) скач_нный, повенч_нные, замеш_нный', '5) перемен_тся, науч_т, слыш_тся'], correctAnswer: ['1', '3', '4', '5'], explanation: '1) уменьшЕнный, высушЕнный, занавешЕнное — везде Е. 3) распускаЕтся, клокочЕт, развеЕшь — везде Е. 4) скачАнный, повенчАнные, замешАнный — везде А. 5) переменИтся, научИт, слышИтся — везде И.', difficulty: 'medium', xpReward: 15, atoms: ['task12', 'endings'] },
          { id: 'q12-ege-4', type: 'ege-multiple', text: 'Укажите варианты ответов, в которых во всех словах одного ряда пропущена одна и та же буква.', options: ['1) мел_щий, лопоч_щий, блещ_щий', '2) уменьш_нный, высуш_нный, разбуж_нный', '3) скач_нный, повенч_нные, замеш_нный', '4) ключ_вший, относ_шься, терп_шь', '5) ове_нный, рав_ший, вид_мый'], correctAnswer: ['1', '2', '3', '4'], explanation: '1) мелУщий, лопочУщий, блещУщий — везде У. 2) уменьшЕнный, высушЕнный, разбужЕнный — везде Е. 3) скачАнный, повенчАнные, замешАнный — везде А. 4) ключИвший, относИшься, терпИшь — везде И.', difficulty: 'medium', xpReward: 15, atoms: ['task12', 'endings'] },
          { id: 'q12-ege-5', type: 'ege-multiple', text: 'Укажите варианты ответов, в которых во всех словах одного ряда пропущена одна и та же буква.', options: ['1) уменьш_нный, высуш_нный, занавеш_нное', '2) мел_щий, лопоч_щий, блещ_щий', '3) распуска_тся, клокоч_т, разве_шь', '4) скач_нный, повенч_нные, замеш_нный', '5) перемен_тся, науч_т, с_вший'], correctAnswer: ['1', '2', '3', '4'], explanation: '1) уменьшЕнный, высушЕнный, занавешЕнное — везде Е. 2) мелУщий, лопочУщий, блещУщий — везде У. 3) распускаЕтся, клокочЕт, развеЕшь — везде Е. 4) скачАнный, повенчАнные, замешАнный — везде А.', difficulty: 'medium', xpReward: 15, atoms: ['task12', 'endings'] },
          { id: 'q12-ege-6', type: 'ege-multiple', text: 'Укажите варианты ответов, в которых во всех словах одного ряда пропущена одна и та же буква.', options: ['1) мел_щий, лопоч_щий, блещ_щий', '2) уменьш_нный, высуш_нный, разбуж_нный', '3) скач_нный, повенч_нные, замеш_нный', '4) ключ_вший, относ_шься, терп_шь', '5) ове_нный, рав_ший, вид_мый'], correctAnswer: ['1', '2', '3', '4'], explanation: '1) мелУщий, лопочУщий, блещУщий — везде У. 2) уменьшЕнный, высушЕнный, разбужЕнный — везде Е. 3) скачАнный, повенчАнные, замешАнный — везде А. 4) ключИвший, относИшься, терпИшь — везде И.', difficulty: 'medium', xpReward: 15, atoms: ['task12', 'endings'] },
          { id: 'q12-ege-7', type: 'ege-multiple', text: 'Укажите варианты ответов, в которых во всех словах одного ряда пропущена одна и та же буква.', options: ['1) уменьш_нный, высуш_нный, занавеш_нное', '2) мел_щий, лопоч_щий, бор_шься', '3) распуска_тся, клокоч_т, разве_шь', '4) скач_нный, повенч_нные, замеш_нный', '5) перемен_тся, науч_т, слыш_тся'], correctAnswer: ['1', '3', '4', '5'], explanation: '1) уменьшЕнный, высушЕнный, занавешЕнное — везде Е. 3) распускаЕтся, клокочЕт, развеЕшь — везде Е. 4) скачАнный, повенчАнные, замешАнный — везде А. 5) переменИтся, научИт, слышИтся — везде И.', difficulty: 'medium', xpReward: 15, atoms: ['task12', 'endings'] },
          { id: 'q12-ege-8', type: 'ege-multiple', text: 'Укажите варианты ответов, в которых во всех словах одного ряда пропущена одна и та же буква.', options: ['1) мел_щий, лопоч_щий, блещ_щий', '2) уменьш_нный, высуш_нный, разбуж_нный', '3) скач_нный, повенч_нные, замеш_нный', '4) ове_нный, рав_ший, вид_мый', '5) ключ_вший, относ_шься, терп_шь'], correctAnswer: ['1', '2', '3', '5'], explanation: '1) мелУщий, лопочУщий, блещУщий — везде У. 2) уменьшЕнный, высушЕнный, разбужЕнный — везде Е. 3) скачАнный, повенчАнные, замешАнный — везде А. 5) ключИвший, относИшься, терпИшь — везде И.', difficulty: 'medium', xpReward: 15, atoms: ['task12', 'endings'] },
          { id: 'q12-ege-9', type: 'ege-multiple', text: 'Укажите варианты ответов, в которых во всех словах одного ряда пропущена одна и та же буква.', options: ['1) уменьш_нный, высуш_нный, занавеш_нное', '2) мел_щий, лопоч_щий, блещ_щий', '3) распуска_тся, клокоч_т, разве_шь', '4) скач_нный, повенч_нные, замеш_нный', '5) ове_нный, рав_ший, вид_мый'], correctAnswer: ['1', '2', '3', '4'], explanation: '1) уменьшЕнный, высушЕнный, занавешЕнное — везде Е. 2) мелУщий, лопочУщий, блещУщий — везде У. 3) распускаЕтся, клокочЕт, развеЕшь — везде Е. 4) скачАнный, повенчАнные, замешАнный — везде А.', difficulty: 'medium', xpReward: 15, atoms: ['task12', 'endings'] },
          { id: 'q12-ege-10', type: 'ege-multiple', text: 'Укажите варианты ответов, в которых во всех словах одного ряда пропущена одна и та же буква.', options: ['1) мел_щий, лопоч_щий, блещ_щий', '2) уменьш_нный, высуш_нный, разбуж_нный', '3) скач_нный, повенч_нные, замеш_нный', '4) ключ_вший, относ_шься, терп_шь', '5) ове_нный, рав_ший, пропол_шь'], correctAnswer: ['1', '2', '3', '4'], explanation: '1) мелУщий, лопочУщий, блещУщий — везде У. 2) уменьшЕнный, высушЕнный, разбужЕнный — везде Е. 3) скачАнный, повенчАнные, замешАнный — везде А. 4) ключИвший, относИшься, терпИшь — везде И.', difficulty: 'medium', xpReward: 15, atoms: ['task12', 'endings'] },
        ]
      },
      {
        id: 'lesson-gram-13-ege',
        sectionId: 'section-gram-1',
        title: 'Задание 13. НЕ/НИ с частями речи (ЕГЭ формат)',
        type: 'practice',
        description: 'Реальные задания ЕГЭ в оригинальном формате: 5 предложений с выбором цифр',
        xpReward: 80,
        prerequisites: ['lesson-gram-12-ege'],
        questions: task13EgeQuestions,
      },
      {
        id: 'lesson-gram-13-atom',
        sectionId: 'section-gram-1',
        title: 'Задание 13. НЕ/НИ с частями речи (атомарный)',
        type: 'practice',
        description: 'Пошаговое изучение: каждое предложение отдельно',
        xpReward: 200,
        prerequisites: ['lesson-gram-13-ege'],
        questions: task13AtomQuestions,
      },
      {
        id: 'lesson-gram-14-2',
        sectionId: 'section-gram-1',
        title: 'Задание 14. Слитно, раздельно, дефис',
        type: 'practice',
        description: 'Слитное, раздельное и дефисное написание',
        xpReward: 70,
        prerequisites: [],
        questions: [
          { id: 'q14-11', type: 'single', text: 'Как написать? (в) пол..не', options: ['полдень', 'пол день'], correctAnswer: ['полдень'], explanation: '«Полдень» — слитно.', difficulty: 'medium', xpReward: 12, atoms: ['solid_writing'] },
          { id: 'q14-12', type: 'single', text: 'Как написать? (в) пол..ночи', options: ['полночи', 'пол ночи'], correctAnswer: ['полночи'], explanation: '«Полночи» — слитно.', difficulty: 'medium', xpReward: 12, atoms: ['solid_writing'] },
          { id: 'q14-13', type: 'single', text: 'Как написать? по..английски', options: ['по-английски', 'поанглийски'], correctAnswer: ['по-английски'], explanation: '«По-английски» — дефис.', difficulty: 'medium', xpReward: 12, atoms: ['defis_compound'] },
          { id: 'q14-14', type: 'single', text: 'Как написать? из..за', options: ['из-за', 'изза'], correctAnswer: ['из-за'], explanation: '«Из-за» — дефис.', difficulty: 'medium', xpReward: 12, atoms: ['defis_compound'] },
          { id: 'q14-15', type: 'single', text: 'Как написать? из..под', options: ['из-под', 'изпод'], correctAnswer: ['из-под'], explanation: '«Из-под» — дефис.', difficulty: 'medium', xpReward: 12, atoms: ['defis_compound'] },
          { id: 'q14-16', type: 'single', text: 'Как написать? по..русски', options: ['по-русски', 'порусски'], correctAnswer: ['по-русски'], explanation: '«По-русски» — дефис.', difficulty: 'medium', xpReward: 12, atoms: ['defis_compound'] },
          { id: 'q14-17', type: 'single', text: 'Как написать? в..третьих', options: ['в-третьих', 'втретьих'], correctAnswer: ['в-третьих'], explanation: '«В-третьих» — дефис.', difficulty: 'medium', xpReward: 12, atoms: ['defis_compound'] },
          { id: 'q14-18', type: 'single', text: 'Как написать? кое..кто', options: ['кое-кто', 'коекто'], correctAnswer: ['кое-кто'], explanation: '«Кое-кто» — дефис.', difficulty: 'medium', xpReward: 12, atoms: ['defis_compound'] },
          { id: 'q14-19', type: 'single', text: 'Как написать? кое..что', options: ['кое-что', 'коечто'], correctAnswer: ['кое-что'], explanation: '«Кое-что» — дефис.', difficulty: 'medium', xpReward: 12, atoms: ['defis_compound'] },
          { id: 'q14-20', type: 'single', text: 'Как написать? кое..где', options: ['кое-где', 'коегде'], correctAnswer: ['кое-где'], explanation: '«Кое-где» — дефис.', difficulty: 'medium', xpReward: 12, atoms: ['defis_compound'] },
        ]
      },
      {
        id: 'lesson-gram-14-d1',
        sectionId: 'section-gram-1',
        title: 'Задание 14. Дощинский (1-30)',
        type: 'practice',
        description: 'Слитное, раздельное и дефисное написание',
        xpReward: 60,
        prerequisites: [],
        questions: [
          { id: 'qd14-1', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ЧТО(ТО)', correctAnswer: ['дефис'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-2', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ДРУГ(ДРУГУ)', correctAnswer: ['раздельно'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-3', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ТАК(ЖЕ)', correctAnswer: ['слитно'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-4', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ЧТО(БЫ)', correctAnswer: ['слитно'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-5', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ВСЁ(ТАКИ)', correctAnswer: ['дефис'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-6', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ВСЁ(РАВНО)', correctAnswer: ['раздельно'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-7', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ТОЧЬ(В)', correctAnswer: ['дефис'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-8', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ТУТ(ЖЕ)', correctAnswer: ['раздельно'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-9', type: 'text', text: 'Впишите слитно, раздельно или через дефис: КАКОЕ(ТО)', correctAnswer: ['дефис'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-10', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ОТКУДА(ТО)', correctAnswer: ['дефис'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-11', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ПОТОМУ(ЧТО)', correctAnswer: ['раздельно'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-12', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ДАВНЫМ(ДАВНО)', correctAnswer: ['дефис'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-13', type: 'text', text: 'Впишите слитно, раздельно или через дефис: КОНЦЕ(КОНЦОВ)', correctAnswer: ['раздельно'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-14', type: 'text', text: 'Впишите слитно, раздельно или через дефис: КРЕПКО(НАКРЕПКО)', correctAnswer: ['дефис'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-15', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ГДЕ(НИБУДЬ)', correctAnswer: ['дефис'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-16', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ТО(ЖЕ)', correctAnswer: ['слитно'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-17', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ВРЯД(ЛИ)', correctAnswer: ['раздельно'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-18', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ПОДХОДИТЕ(КА)', correctAnswer: ['дефис'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-19', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ВСЁ(ЖЕ)', correctAnswer: ['раздельно'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-20', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ДРУГ(ДРУГА)', correctAnswer: ['раздельно'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-21', type: 'text', text: 'Впишите слитно, раздельно или через дефис: КАКИЕ(ТО)', correctAnswer: ['дефис'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-22', type: 'text', text: 'Впишите слитно, раздельно или через дефис: КОГО(НИБУДЬ)', correctAnswer: ['дефис'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-23', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ЕДВА(ЛИ)', correctAnswer: ['раздельно'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-24', type: 'text', text: 'Впишите слитно, раздельно или через дефис: БУД(ТО)', correctAnswer: ['слитно'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-25', type: 'text', text: 'Впишите слитно, раздельно или через дефис: КОГДА(ТО)', correctAnswer: ['дефис'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-26', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ИЗ(ПОД)', correctAnswer: ['дефис'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-27', type: 'text', text: 'Впишите слитно, раздельно или через дефис: КАКОЙ(ТО)', correctAnswer: ['дефис'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-28', type: 'text', text: 'Впишите слитно, раздельно или через дефис: КАК(БЫ)', correctAnswer: ['раздельно'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-29', type: 'text', text: 'Впишите слитно, раздельно или через дефис: КОМУ(ТО)', correctAnswer: ['дефис'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-30', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ЧЬЁ(ТО)', correctAnswer: ['дефис'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] }
        ]
      },
      {
        id: 'lesson-gram-14-d2',
        sectionId: 'section-gram-1',
        title: 'Задание 14. Дощинский (31-60)',
        type: 'practice',
        description: 'Слитное, раздельное и дефисное написание',
        xpReward: 60,
        prerequisites: [],
        questions: [
          { id: 'qd14-31', type: 'text', text: 'Впишите слитно, раздельно или через дефис: КАКАЯ(ТО)', correctAnswer: ['дефис'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-32', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ЯРКО(ЗОЛОТЫМИ)', correctAnswer: ['дефис'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-33', type: 'text', text: 'Впишите слитно, раздельно или через дефис: КРЕСТ(НАКРЕСТ)', correctAnswer: ['дефис'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-34', type: 'text', text: 'Впишите слитно, раздельно или через дефис: КАК(ТО)', correctAnswer: ['дефис'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-35', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ИЗ(ЗА)', correctAnswer: ['дефис'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-36', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ТАК(КАК)', correctAnswer: ['раздельно'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-37', type: 'text', text: 'Впишите слитно, раздельно или через дефис: МОСКВЫ(РЕКИ)', correctAnswer: ['дефис'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-38', type: 'text', text: 'Впишите слитно, раздельно или через дефис: НАКОНЕЦ(ТО)', correctAnswer: ['дефис'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-39', type: 'text', text: 'Впишите слитно, раздельно или через дефис: СКОЛЬ(БЫ)', correctAnswer: ['раздельно'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-40', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ТЕПЕРЬ(ЖЕ)', correctAnswer: ['раздельно'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-41', type: 'text', text: 'Впишите слитно, раздельно или через дефис: КАК(БУДТО)', correctAnswer: ['раздельно'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-42', type: 'text', text: 'Впишите слитно, раздельно или через дефис: В(ПОЛ)ГОЛОСА', correctAnswer: ['слитно'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-43', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ЕСЛИ(БЫ)', correctAnswer: ['раздельно'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-44', type: 'text', text: 'Впишите слитно, раздельно или через дефис: КАКОЙ(НИБУДЬ)', correctAnswer: ['дефис'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-45', type: 'text', text: 'Впишите слитно, раздельно или через дефис: БОК(О)БОК', correctAnswer: ['раздельно'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-46', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ВОТ(ВОТ)', correctAnswer: ['дефис'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-47', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ДРУГ(С)ДРУГОМ', correctAnswer: ['раздельно'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-48', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ИССИНЯ(ЧЁРНЫХ)', correctAnswer: ['дефис'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-49', type: 'text', text: 'Впишите слитно, раздельно или через дефис: КАКОЙ(ЛИБО)', correctAnswer: ['дефис'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-50', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ВСЁ(БЫ)', correctAnswer: ['раздельно'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-51', type: 'text', text: 'Впишите слитно, раздельно или через дефис: КОГДА(ЛИБО)', correctAnswer: ['дефис'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-52', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ЧУТЬ(ЧУТЬ)', correctAnswer: ['дефис'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-53', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ТЕ(ЖЕ)', correctAnswer: ['раздельно'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-54', type: 'text', text: 'Впишите слитно, раздельно или через дефис: СКОЛЬКО(БЫ)', correctAnswer: ['раздельно'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-55', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ЧТО(ЛИБО)', correctAnswer: ['дефис'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-56', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ДИВО(ДИВНОЕ)', correctAnswer: ['раздельно'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-57', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ЧУДО(ЧУДНОЕ)', correctAnswer: ['раздельно'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-58', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ЧЁМ(БЫ)', correctAnswer: ['раздельно'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-59', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ЗАЧЕМ(ТО)', correctAnswer: ['дефис'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-60', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ВРОДЕ(БЫ)', correctAnswer: ['раздельно'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] }
        ]
      },
      {
        id: 'lesson-gram-14-d3',
        sectionId: 'section-gram-1',
        title: 'Задание 14. Дощинский (61-86)',
        type: 'practice',
        description: 'Слитное, раздельное и дефисное написание',
        xpReward: 52,
        prerequisites: [],
        questions: [
          { id: 'qd14-61', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ЧУТЬ(ЛИ)', correctAnswer: ['раздельно'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-62', type: 'text', text: 'Впишите слитно, раздельно или через дефис: СРАЗУ(ЖЕ)', correctAnswer: ['раздельно'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-63', type: 'text', text: 'Впишите слитно, раздельно или через дефис: КАКИХ(ЛИБО)', correctAnswer: ['дефис'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-64', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ЕЛЕ(ЕЛЕ)', correctAnswer: ['дефис'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-65', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ЧЁМ(ЛИБО)', correctAnswer: ['дефис'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-66', type: 'text', text: 'Впишите слитно, раздельно или через дефис: КОЕ(К)ЧЕМУ', correctAnswer: ['раздельно'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-67', type: 'text', text: 'Впишите слитно, раздельно или через дефис: КАКИМИ(ЛИБО)', correctAnswer: ['дефис'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-68', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ТОТЧАС(ЖЕ)', correctAnswer: ['раздельно'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-69', type: 'text', text: 'Впишите слитно, раздельно или через дефис: КАКОГО(ТО)', correctAnswer: ['дефис'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-70', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ЧТО(НИБУДЬ)', correctAnswer: ['дефис'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-71', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ГДЕ(ТО)', correctAnswer: ['дефис'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-72', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ТОГО(ЖЕ)', correctAnswer: ['раздельно'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-73', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ДО(СИХ)ПОР', correctAnswer: ['раздельно'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-74', type: 'text', text: 'Впишите слитно, раздельно или через дефис: СЛЕД(В)СЛЕД', correctAnswer: ['раздельно'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-75', type: 'text', text: 'Впишите слитно, раздельно или через дефис: КАЗАЛОСЬ(БЫ)', correctAnswer: ['раздельно'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-76', type: 'text', text: 'Впишите слитно, раздельно или через дефис: КАКИМ(ТО)', correctAnswer: ['дефис'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-77', type: 'text', text: 'Впишите слитно, раздельно или через дефис: КАКИЕ(ЛИБО)', correctAnswer: ['дефис'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-78', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ТАК(ЧТО)', correctAnswer: ['раздельно'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-79', type: 'text', text: 'Впишите слитно, раздельно или через дефис: КАКИХ(ТО)', correctAnswer: ['дефис'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-80', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ЧЕМ(ТО)', correctAnswer: ['дефис'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-81', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ХОТЯ(БЫ)', correctAnswer: ['слитно'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-82', type: 'text', text: 'Впишите слитно, раздельно или через дефис: КОГО(ЛИБО)', correctAnswer: ['слитно'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-83', type: 'text', text: 'Впишите слитно, раздельно или через дефис: КАК(НИБУДЬ)', correctAnswer: ['слитно'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-84', type: 'text', text: 'Впишите слитно, раздельно или через дефис: КОНЕЧНО(ЖЕ)', correctAnswer: ['слитно'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-85', type: 'text', text: 'Впишите слитно, раздельно или через дефис: МАЛО(ПОМАЛУ)', correctAnswer: ['слитно'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] },
          { id: 'qd14-86', type: 'text', text: 'Впишите слитно, раздельно или через дефис: ТЕМ(ЖЕ)', correctAnswer: ['слитно'], explanation: 'Правильное написание: слитно.', difficulty: 'easy', xpReward: 10, atoms: ['task14', 'complex_words'] }
        ]
      },
{
        id: 'lesson-gram-14-ege',
        sectionId: 'section-gram-1',
        title: 'Задание 14. Формат ЕГЭ',
        type: 'practice',
        description: 'Реальные задания в формате ЕГЭ',
        xpReward: 80,
        prerequisites: [],
        questions: [
  {
    "id": "q14-ege-1",
    "type": "ege-multiple",
    "text": "Укажите варианты ответов, в которых слово пишется СЛИТНО. Запишите номера этих ответов.",
    "options": [
      "1) ЧЬЁТО, КОГДАЛИБО",
      "2) ЯРКОЗОЛОТЫМИ, ЕЛЕЕЛЕ",
      "3) КОГОЛИБО, ТЕМЖЕ",
      "4) КАКИЕТО, КАКТО",
      "5) ТАКЖЕ, ТОЖЕ"
    ],
    "correctAnswer": [
      "3",
      "5"
    ],
    "explanation": "Правильные ответы: 3, 5. слитно: КОГОЛИБО, ТЕМЖЕ, ТАКЖЕ, ТОЖЕ.",
    "difficulty": "medium",
    "xpReward": 15,
    "atoms": [
      "task14",
      "complex_words"
    ]
  },
  {
    "id": "q14-ege-2",
    "type": "ege-multiple",
    "text": "Укажите варианты ответов, в которых слово пишется ЧЕРЕЗ ДЕФИС. Запишите номера этих ответов.",
    "options": [
      "1) КАКИМТО, ЧУТЬЧУТЬ",
      "2) КОГДАТО, ИЗЗА",
      "3) ВПОЛГОЛОСА, ТАКЖЕ",
      "4) ДРУГДРУГУ, ТОГОЖЕ",
      "5) ИССИНЯЧЁРНЫХ, КАКИЕЛИБО"
    ],
    "correctAnswer": [
      "1",
      "2",
      "5"
    ],
    "explanation": "Правильные ответы: 1, 2, 5. дефис: КАКИМТО, ЧУТЬЧУТЬ, КОГДАТО, ИЗЗА, ИССИНЯЧЁРНЫХ, КАКИЕЛИБО.",
    "difficulty": "medium",
    "xpReward": 15,
    "atoms": [
      "task14",
      "complex_words"
    ]
  },
  {
    "id": "q14-ege-3",
    "type": "ege-multiple",
    "text": "Укажите варианты ответов, в которых слово пишется СЛИТНО. Запишите номера этих ответов.",
    "options": [
      "1) ТАККАК, КАЗАЛОСЬБЫ",
      "2) КРЕПКОНАКРЕПКО, КОМУТО",
      "3) КОНЕЧНОЖЕ, ТОЖЕ",
      "4) ТУТЖЕ, ТАКЧТО",
      "5) ХОТЯБЫ, ТАКЖЕ"
    ],
    "correctAnswer": [
      "3",
      "5"
    ],
    "explanation": "Правильные ответы: 3, 5. слитно: КОНЕЧНОЖЕ, ТОЖЕ, ХОТЯБЫ, ТАКЖЕ.",
    "difficulty": "medium",
    "xpReward": 15,
    "atoms": [
      "task14",
      "complex_words"
    ]
  },
  {
    "id": "q14-ege-4",
    "type": "ege-multiple",
    "text": "Укажите варианты ответов, в которых слово пишется РАЗДЕЛЬНО. Запишите номера этих ответов.",
    "options": [
      "1) КОГОЛИБО, КОНЕЧНОЖЕ",
      "2) ЕДВАЛИ, ВРЯДЛИ",
      "3) КРЕСТНАКРЕСТ, ЧЕМТО",
      "4) КОЕКЧЕМУ, ВСЁЖЕ",
      "5) ХОТЯБЫ, КАКНИБУДЬ"
    ],
    "correctAnswer": [
      "2",
      "4"
    ],
    "explanation": "Правильные ответы: 2, 4. раздельно: ЕДВАЛИ, ВРЯДЛИ, КОЕКЧЕМУ, ВСЁЖЕ.",
    "difficulty": "medium",
    "xpReward": 15,
    "atoms": [
      "task14",
      "complex_words"
    ]
  },
  {
    "id": "q14-ege-5",
    "type": "ege-multiple",
    "text": "Укажите варианты ответов, в которых слово пишется ЧЕРЕЗ ДЕФИС. Запишите номера этих ответов.",
    "options": [
      "1) ОТКУДАТО, КАКОЙТО",
      "2) ТАККАК, СКОЛЬБЫ",
      "3) ВРОДЕБЫ, БОКОБОК",
      "4) ХОТЯБЫ, ЧТОБЫ",
      "5) КОГДАТО, ВОТВОТ"
    ],
    "correctAnswer": [
      "1",
      "5"
    ],
    "explanation": "Правильные ответы: 1, 5. дефис: ОТКУДАТО, КАКОЙТО, КОГДАТО, ВОТВОТ.",
    "difficulty": "medium",
    "xpReward": 15,
    "atoms": [
      "task14",
      "complex_words"
    ]
  },
  {
    "id": "q14-ege-6",
    "type": "ege-multiple",
    "text": "Укажите варианты ответов, в которых слово пишется ЧЕРЕЗ ДЕФИС. Запишите номера этих ответов.",
    "options": [
      "1) КАКИЕТО, КАКОГОТО",
      "2) СКОЛЬБЫ, ТЕПЕРЬЖЕ",
      "3) КОНЦЕКОНЦОВ, ДРУГСДРУГОМ",
      "4) ВОТВОТ, КАКОЙНИБУДЬ",
      "5) ТУТЖЕ, СРАЗУЖЕ"
    ],
    "correctAnswer": [
      "1",
      "4"
    ],
    "explanation": "Правильные ответы: 1, 4. дефис: КАКИЕТО, КАКОГОТО, ВОТВОТ, КАКОЙНИБУДЬ.",
    "difficulty": "medium",
    "xpReward": 15,
    "atoms": [
      "task14",
      "complex_words"
    ]
  },
  {
    "id": "q14-ege-7",
    "type": "ege-multiple",
    "text": "Укажите варианты ответов, в которых слово пишется СЛИТНО. Запишите номера этих ответов.",
    "options": [
      "1) ДРУГДРУГА, ВСЁЖЕ",
      "2) ВОТВОТ, ИЗЗА",
      "3) ТЕМЖЕ, КОНЕЧНОЖЕ",
      "4) КОГОЛИБО, ЧТОБЫ",
      "5) КАКНИБУДЬ, ТОЖЕ"
    ],
    "correctAnswer": [
      "3",
      "4",
      "5"
    ],
    "explanation": "Правильные ответы: 3, 4, 5. слитно: ТЕМЖЕ, КОНЕЧНОЖЕ, КОГОЛИБО, ЧТОБЫ, КАКНИБУДЬ, ТОЖЕ.",
    "difficulty": "medium",
    "xpReward": 15,
    "atoms": [
      "task14",
      "complex_words"
    ]
  },
  {
    "id": "q14-ege-8",
    "type": "ege-multiple",
    "text": "Укажите варианты ответов, в которых слово пишется СЛИТНО. Запишите номера этих ответов.",
    "options": [
      "1) ТОЖЕ, МАЛОПОМАЛУ",
      "2) ВРОДЕБЫ, ТОТЧАСЖЕ",
      "3) КОГОЛИБО, ТАКЖЕ",
      "4) КОНЕЧНОЖЕ, ТЕМЖЕ",
      "5) ЧТОБЫ, ХОТЯБЫ"
    ],
    "correctAnswer": [
      "1",
      "3",
      "4",
      "5"
    ],
    "explanation": "Правильные ответы: 1, 3, 4, 5. слитно: ТОЖЕ, МАЛОПОМАЛУ, КОГОЛИБО, ТАКЖЕ, КОНЕЧНОЖЕ, ТЕМЖЕ, ЧТОБЫ, ХОТЯБЫ.",
    "difficulty": "medium",
    "xpReward": 15,
    "atoms": [
      "task14",
      "complex_words"
    ]
  },
  {
    "id": "q14-ege-9",
    "type": "ege-multiple",
    "text": "Укажите варианты ответов, в которых слово пишется СЛИТНО. Запишите номера этих ответов.",
    "options": [
      "1) КОНЕЧНОЖЕ, КОГОЛИБО",
      "2) БОКОБОК, СЛЕДВСЛЕД",
      "3) ИССИНЯЧЁРНЫХ, КАКИХЛИБО",
      "4) ТОЖЕ, КАКНИБУДЬ",
      "5) МАЛОПОМАЛУ, ВПОЛГОЛОСА"
    ],
    "correctAnswer": [
      "1",
      "4",
      "5"
    ],
    "explanation": "Правильные ответы: 1, 4, 5. слитно: КОНЕЧНОЖЕ, КОГОЛИБО, ТОЖЕ, КАКНИБУДЬ, МАЛОПОМАЛУ, ВПОЛГОЛОСА.",
    "difficulty": "medium",
    "xpReward": 15,
    "atoms": [
      "task14",
      "complex_words"
    ]
  },
  {
    "id": "q14-ege-10",
    "type": "ege-multiple",
    "text": "Укажите варианты ответов, в которых слово пишется СЛИТНО. Запишите номера этих ответов.",
    "options": [
      "1) ТАКЖЕ, ТОЖЕ",
      "2) КОНЕЧНОЖЕ, ВПОЛГОЛОСА",
      "3) ЧТОБЫ, ХОТЯБЫ",
      "4) МАЛОПОМАЛУ, ТЕМЖЕ",
      "5) ЧЁМЛИБО, ЧУТЬЧУТЬ"
    ],
    "correctAnswer": [
      "1",
      "2",
      "3",
      "4"
    ],
    "explanation": "Правильные ответы: 1, 2, 3, 4. слитно: ТАКЖЕ, ТОЖЕ, КОНЕЧНОЖЕ, ВПОЛГОЛОСА, ЧТОБЫ, ХОТЯБЫ, МАЛОПОМАЛУ, ТЕМЖЕ.",
    "difficulty": "medium",
    "xpReward": 15,
    "atoms": [
      "task14",
      "complex_words"
    ]
  }
]
      }
    ]
  }
]
