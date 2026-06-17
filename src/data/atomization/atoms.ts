export interface Atom {
  id: string
  name: string
  description: string
  taskNumbers: number[]
  parentAtom?: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface AtomizedWord {
  word: string
  rawForm: string
  questionText: string
  atoms: string[]
  taskNumber: number
  difficulty: 'easy' | 'medium' | 'hard'
  explanation: string
  rule: string
}

// Атомы задания №10 (приставки)
export const atoms: Atom[] = [
  // Корневые категории
  {
    id: 'prefix_pre_pri',
    name: 'ПРЕ- / ПРИ-',
    description: 'Приставки ПРЕ- (вперёд, заранее) и ПРИ- (приближение, неполнота). Словарные слова и проверяемые.',
    taskNumbers: [10],
    difficulty: 'medium'
  },
  {
    id: 'prefix_z_s',
    name: 'З- / С-',
    description: 'Изменяемые по глухости/звонкости приставки (раз-/рас-, воз-/вос-, без-/бес-, из-/ис-, низ-/нис-).',
    taskNumbers: [10],
    difficulty: 'medium'
  },
  {
    id: 'prefix_y_i',
    name: 'Ы- / И-',
    description: 'Приставки с Ы после С (сызнова, сыграть) и И в других случаях.',
    taskNumbers: [10],
    difficulty: 'easy'
  },
  {
    id: 'prefix_hard_soft',
    name: 'Ъ / Ь',
    description: 'Разделительный Ъ (въезд, объявить) и Ь (обезьяний, вьющийся).',
    taskNumbers: [10],
    difficulty: 'hard'
  },
  {
    id: 'prefix_ra_ro',
    name: 'РА- / РО- / РАЗ- / РОЗ- / РАС- / РОС-',
    description: 'Приставки с чередованием а/о и с/з: раскаяние, разобрать, росчерк, розыск.',
    taskNumbers: [10],
    difficulty: 'hard'
  },
  {
    id: 'prefix_pra_pro',
    name: 'ПРА- / ПРО-',
    description: 'ПРА- (родство: прадед) и ПРО- (прототип, промежуток).',
    taskNumbers: [10],
    difficulty: 'easy'
  },
  {
    id: 'prefix_unchangeable',
    name: 'Неизменяемые приставки',
    description: 'С-, под-, над-, от-, об-, в-, пред-, про-, за-, до-, на-, при-, без-, меж-, контр-, сверх-, трёх-, двух-, фото- и др.',
    taskNumbers: [10],
    difficulty: 'easy'
  },
  // Податомы ПРЕ-/ПРИ-
  {
    id: 'pre_pri_dict',
    name: 'Словарные ПРЕ-/ПРИ-',
    description: 'Словарные слова, где нельзя проверить по корню: преисполнен, премудрый, преследование, премадонна.',
    taskNumbers: [10],
    parentAtom: 'prefix_pre_pri',
    difficulty: 'hard'
  },
  {
    id: 'pre_pri_verif',
    name: 'Проверяемые ПРЕ-/ПРИ-',
    description: 'Приставка + проверочное слово: приобрёл (обрести), приоткрыть (открыть).',
    taskNumbers: [10],
    parentAtom: 'prefix_pre_pri',
    difficulty: 'medium'
  },
  {
    id: 'pre_pri_pred',
    name: 'ПРЕД- / ПОД-',
    description: 'Приставки ПРЕД- (предзащита, предъюбилейный) и ПОД- (подножие, подкараулить).',
    taskNumbers: [10],
    parentAtom: 'prefix_pre_pri',
    difficulty: 'medium'
  },
  // Податомы З-/С-
  {
    id: 'z_s_deaf',
    name: 'Глухая/звонкая (РАЗ-/РАС-, БЕЗ-/БЕС-)',
    description: 'Изменяемые по глухости/звонкости: разобрать → расширить, безыскусный → бесправный.',
    taskNumbers: [10],
    parentAtom: 'prefix_z_s',
    difficulty: 'medium'
  },
  {
    id: 'z_s_iz_is',
    name: 'ИЗ- / ИС- / ИСПО-',
    description: 'ИЗ- перед р (израсходовать), ИС- перед п/с (исследовать, исподтишка).',
    taskNumbers: [10],
    parentAtom: 'prefix_z_s',
    difficulty: 'hard'
  },
  {
    id: 'z_s_vz_vs',
    name: 'ВЗ- / ВС- / ВЪ-',
    description: 'ВЗ- перед б/д/з (взобраться), ВС- перед к/х/п (всколоситься), ВЪ- (въезд).',
    taskNumbers: [10],
    parentAtom: 'prefix_z_s',
    difficulty: 'hard'
  },
  // Податомы Ъ/Ь
  {
    id: 'hard_sign',
    name: 'Разделительный Ъ',
    description: 'Ъ между согласными: въезд, объявить, съезд, предъюбилейный, трёхъядерный.',
    taskNumbers: [10],
    parentAtom: 'prefix_hard_soft',
    difficulty: 'medium'
  },
  {
    id: 'soft_sign',
    name: 'Ь в корне/приставке',
    description: 'Ь в корне: обезьяний, вьющийся, бьющийся. Ь в приставке: бесцветный.',
    taskNumbers: [10],
    parentAtom: 'prefix_hard_soft',
    difficulty: 'hard'
  },
  // Податомы РА-/РО-
  {
    id: 'ra_ro_vowel',
    name: 'РАС- / РАЗ- / РОС- / РОЗ-',
    description: 'РАС- перед к/ч/п (раскаяние), РАЗ- перед глухими (разобрать), РОС-/РОЗ- (росчерк, розыск).',
    taskNumbers: [10],
    parentAtom: 'prefix_ra_ro',
    difficulty: 'hard'
  },
  // Податомы неизменяемые
  {
    id: 'unch_compound',
    name: 'Сложные приставки',
    description: 'МЕЖ-, СВЕРХ-, ТРЁХ-, ДВУХ-, ФОТО-, СУПЕР-, КОНТР-, ПОСТ-, ПРЕД-.',
    taskNumbers: [10],
    parentAtom: 'prefix_unchangeable',
    difficulty: 'easy'
  },
  {
    id: 'unch_simple',
    name: 'Простые неизменяемые',
    description: 'С-, ПОД-, НАД-, ОТ-, ОБ-, В-, ЗА-, ДО-, НА-, ПРИ-, БЕЗ-, ПРО-, ЧЕРЕС-, ЧРЕЗ-.',
    taskNumbers: [10],
    parentAtom: 'prefix_unchangeable',
    difficulty: 'easy'
  },
  // Задание №12 — грамматика (спряжение, причастия, краткие причастия)
  {
    id: 'conjugation_1',
    name: '1-е спряжение',
    description: 'Глаголы с личными окончаниями -Е/У/Ю (читаю, идёшь, строят).',
    taskNumbers: [12],
    difficulty: 'easy'
  },
  {
    id: 'conjugation_2',
    name: '2-е спряжение',
    description: 'Глаголы с личными окончаниями -И/А/Я (говорю, смотришь, гуляют).',
    taskNumbers: [12],
    difficulty: 'easy'
  },
  {
    id: 'past_tense',
    name: 'Прошедшее время',
    description: 'Суффиксы -ВШ-, -В-, -Л- (читал, пришёл, развёл).',
    taskNumbers: [12],
    difficulty: 'medium'
  },
  {
    id: 'participle_short',
    name: 'Краткие причастия',
    description: 'Причастные суффиксы -ЕН-/-Н- (сделан, куплен, записан).',
    taskNumbers: [12],
    difficulty: 'hard'
  },
  // Задание №13 — НЕ с разными частями речи
  {
    id: 'ne_adjective',
    name: 'НЕ с прилагательными',
    description: 'Слитно и раздельно: НЕ с прилагательными и причастиями.',
    taskNumbers: [13],
    difficulty: 'medium'
  },
  {
    id: 'ne_adverb',
    name: 'НЕ с наречиями',
    description: 'Слитно и раздельно: НЕ с наречиями.',
    taskNumbers: [13],
    difficulty: 'medium'
  },
  {
    id: 'ne_verb',
    name: 'НЕ с глаголами',
    description: 'Слитно и раздельно: НЕ с глаголами.',
    taskNumbers: [13],
    difficulty: 'easy'
  },
  {
    id: 'ne_participle',
    name: 'НЕ с причастиями',
    description: 'Слитно и раздельно: НЕ с причастиями.',
    taskNumbers: [13],
    difficulty: 'hard'
  },
  {
    id: 'ne_noun',
    name: 'НЕ с существительными',
    description: 'Слитно и раздельно: НЕ с существительными.',
    taskNumbers: [13],
    difficulty: 'medium'
  },
  {
    id: 'ne_deeprich',
    name: 'НЕ с деепричастиями',
    description: 'Слитно и раздельно: НЕ с деепричастиями.',
    taskNumbers: [13],
    difficulty: 'hard'
  },
  {
    id: 'ne_opposition',
    name: 'НЕ при противопоставлении',
    description: 'НЕ раздельно при противопоставлении (не красный, а зелёный).',
    taskNumbers: [13],
    difficulty: 'easy'
  },
  {
    id: 'ne_particle',
    name: 'Частица НЕ',
    description: 'Частица НЕ (слитно): нет, некого, нечего, негде, незачем.',
    taskNumbers: [13],
    difficulty: 'medium'
  },
  // Задание №14 — НИ/НЕ, слитно/раздельно/дефис
  {
    id: 'ni_words',
    name: 'Слова с НИ',
    description: 'Слитные слова с НИ: никто, ничего, никуда, низко, низкий.',
    taskNumbers: [14],
    difficulty: 'easy'
  },
  {
    id: 'ni_phrases',
    name: 'Устойчивые выражения с НИ',
    description: 'Устойчивые выражения: ни при чём, ни к чему, ни к селу, ни к городу.',
    taskNumbers: [14],
    difficulty: 'medium'
  },
  {
    id: 'defis_compound',
    name: 'Дефисное написание',
    description: 'Дефис: по-русски, из-за, до-а, в-третьих, ещё, северо-запад, пол-яблока, кое-кто, кто-то, что-либо.',
    taskNumbers: [14],
    difficulty: 'hard'
  },
  {
    id: 'solid_writing',
    name: 'Слитное написание',
    description: 'Слитно: полдень, полночи, полуготы, ибо, зато, либо, нисколько, нечего, негде, нечем, некого, нет.',
    taskNumbers: [14],
    difficulty: 'medium'
  },
  {
    id: 'prepositions_derived',
    name: 'Производные предлоги',
    description: 'Производные предлоги: благодаря, вопреки, согласно, подобно, ввиду, вследствие.',
    taskNumbers: [14],
    difficulty: 'medium'
  },
  // Задание №15 — н/нн
  {
    id: 'n_nn_verb_adj',
    name: 'Отглагольные прилагательные и причастия',
    description: 'Н/НН в отглагольных прилагательных и причастиях (кованый, кошеный).',
    taskNumbers: [15],
    difficulty: 'hard'
  },
  {
    id: 'n_nn_noun_adj',
    name: 'Отымённые прилагательные',
    description: 'Н/НН в отымённых прилагательных (ветреный, деревянный, стеклянный).',
    taskNumbers: [15],
    difficulty: 'medium'
  },
  {
    id: 'n_nn_adverb',
    name: 'Наречия с н/нн',
    description: 'Н/НН в наречиях (отчасти, вовсе, поныне).',
    taskNumbers: [15],
    difficulty: 'medium'
  },
  {
    id: 'n_nn_short',
    name: 'Краткие прилагательные',
    description: 'Н/НН в кратких прилагательных и причастиях (красив, уверен, убеждён).',
    taskNumbers: [15],
    difficulty: 'hard'
  }
]

export interface UserAtomProgress {
  atomId: string
  totalAttempts: number
  correctCount: number
  accuracy: number
  lastAttemptAt: string
  masteryLevel: 'new' | 'learning' | 'review' | 'mastered'
}

// Хелпер для поиска атома по ID
export const getAtomById = (id: string): Atom | undefined => atoms.find(a => a.id === id)

// Хелпер для получения дочерних атомов
export const getChildAtoms = (parentId: string): Atom[] => atoms.filter(a => a.parentAtom === parentId)

// Хелпер для получения корневых атомов (без parent)
export const getRootAtoms = (): Atom[] => atoms.filter(a => !a.parentAtom)

// Хелпер для получения атомов по номеру задания
export const getAtomsForTask = (taskNumber: number): Atom[] => atoms.filter(a => a.taskNumbers?.includes(taskNumber))
