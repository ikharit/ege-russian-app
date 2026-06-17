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
