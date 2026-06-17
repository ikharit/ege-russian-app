export interface Atom {
  id: string
  name: string
  description: string
  taskNumbers: number[]
  parentId?: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface AtomizedWord {
  word: string         // полное слово: "преисполнен"
  rawForm: string      // с пропусками: "пр..исполнен (отваги)"
  atoms: string[]      // ['prefix_pre_pri', 'pre_pri_dictionary']
  taskNumber: number   // 9 или 10
  difficulty: 'easy' | 'medium' | 'hard'
  explanation: string
  rule: string
}

export interface UserAtomProgress {
  atomId: string
  totalAttempts: number
  correctCount: number
  accuracy: number
  lastAttemptAt: string
  masteryLevel: 'new' | 'learning' | 'review' | 'mastered'
}

export const atoms: Atom[] = [
  // ROOT ATOMS
  {
    id: 'prefixes',
    name: 'Приставки',
    description: 'Правописание приставок в сложных словах',
    taskNumbers: [9],
    difficulty: 'medium',
  },
  {
    id: 'roots',
    name: 'Корни',
    description: 'Чередование гласных и согласных в корне',
    taskNumbers: [9],
    difficulty: 'medium',
  },
  {
    id: 'suffixes',
    name: 'Суффиксы',
    description: 'Правописание суффиксов',
    taskNumbers: [10],
    difficulty: 'medium',
  },

  // PREFIX: ПРЕ- / ПРИ-
  {
    id: 'prefix_pre_pri',
    name: 'ПРЕ- / ПРИ-',
    description: 'Правописание приставок пре-/при-',
    taskNumbers: [9],
    parentId: 'prefixes',
    difficulty: 'medium',
  },
  {
    id: 'pre_pri_dictionary',
    name: 'ПРЕ- словарные',
    description: 'Словарные слова с приставкой ПРЕ- (преисполнен, премудрый)',
    taskNumbers: [9],
    parentId: 'prefix_pre_pri',
    difficulty: 'hard',
  },
  {
    id: 'pri_dictionary',
    name: 'ПРИ- словарные',
    description: 'Словарные слова с приставкой ПРИ- (приобрёл, приоткрыть)',
    taskNumbers: [9],
    parentId: 'prefix_pre_pri',
    difficulty: 'hard',
  },
  {
    id: 'pre_pred',
    name: 'ПРЕД-',
    description: 'Приставка ПРЕД- (предзащита, предзаказ)',
    taskNumbers: [9],
    parentId: 'prefix_pre_pri',
    difficulty: 'medium',
  },
  {
    id: 'pod_verifiable',
    name: 'ПОД-',
    description: 'Приставка ПОД- с проверочным словом (подкараулить, подножие)',
    taskNumbers: [9],
    parentId: 'prefix_pre_pri',
    difficulty: 'easy',
  },

  // PREFIX: ВС- / ВЗ- / ВЪ-
  {
    id: 'prefix_vs_vz',
    name: 'ВС- / ВЗ- / ВЪ-',
    description: 'Правописание приставок вс-/вз-/въ-',
    taskNumbers: [9],
    parentId: 'prefixes',
    difficulty: 'medium',
  },
  {
    id: 'vs_before_kh',
    name: 'ВС- перед к/х/п',
    description: 'ВС- перед к, х, п (всколоситься, вспыхнуть)',
    taskNumbers: [9],
    parentId: 'prefix_vs_vz',
    difficulty: 'medium',
  },
  {
    id: 'vz_before_bd',
    name: 'ВЗ- перед б/д/з',
    description: 'ВЗ- перед б, д, з (взобраться, вздремнуть)',
    taskNumbers: [9],
    parentId: 'prefix_vs_vz',
    difficulty: 'medium',
  },
  {
    id: 'v_hard_sign',
    name: 'ВЪ- разделительный',
    description: 'Разделительный Ъ после В (въезд, съезд)',
    taskNumbers: [9],
    parentId: 'prefix_vs_vz',
    difficulty: 'easy',
  },

  // PREFIX: ЧЕРЕС- / ЧРЕЗ-
  {
    id: 'prefix_cheres_chrez',
    name: 'ЧЕРЕС- / ЧРЕЗ-',
    description: 'Приставки черес-/чрез- (чересчур, чрезвычайный)',
    taskNumbers: [9],
    parentId: 'prefixes',
    difficulty: 'hard',
  },

  // PREFIX: РАС- / РАЗ- / РОС- / РОЗ-
  {
    id: 'prefix_ras_raz',
    name: 'РАС- / РАЗ- / РОС- / РОЗ-',
    description: 'Правописание приставок рас-/раз-/рос-/роз-',
    taskNumbers: [9],
    parentId: 'prefixes',
    difficulty: 'medium',
  },
  {
    id: 'ras_before_kh',
    name: 'РАС- перед к/ч/п',
    description: 'РАС- перед к, ч, п (раскаяние, расширяться)',
    taskNumbers: [9],
    parentId: 'prefix_ras_raz',
    difficulty: 'easy',
  },
  {
    id: 'raz_before_deaf',
    name: 'РАЗ- перед глухими',
    description: 'РАЗ- перед глухими согласными (разобрать, разъехаться)',
    taskNumbers: [9],
    parentId: 'prefix_ras_raz',
    difficulty: 'easy',
  },
  {
    id: 'ros_roz_special',
    name: 'РОС- / РОЗ- особые',
    description: 'Особые случаи (росчерк, розыск)',
    taskNumbers: [9],
    parentId: 'prefix_ras_raz',
    difficulty: 'hard',
  },

  // PREFIX: БЕЗ- / БЕС-
  {
    id: 'prefix_bez_bes',
    name: 'БЕЗ- / БЕС-',
    description: 'Приставки без-/бес- (безыскусный, бесправный)',
    taskNumbers: [9],
    parentId: 'prefixes',
    difficulty: 'easy',
  },

  // PREFIX: ИЗ- / ИС-
  {
    id: 'prefix_iz_is',
    name: 'ИЗ- / ИС- / ИЗО-',
    description: 'Приставки из-/ис-/изо- (израсходовать, исследовать)',
    taskNumbers: [9],
    parentId: 'prefixes',
    difficulty: 'medium',
  },

  // PREFIX: С- / СО- / СУБЪ-
  {
    id: 'prefix_s_so',
    name: 'С- / СО- / СУБЪ-',
    description: 'Приставки с-/со-/субъ- (сызнова, съесть, субъективный)',
    taskNumbers: [9],
    parentId: 'prefixes',
    difficulty: 'medium',
  },
  {
    id: 's_with_y',
    name: 'СЫ- (сызнова, сыграть)',
    description: 'Приставка СЫ- перед з, с, г (сызнова, сыграть, съесть)',
    taskNumbers: [9],
    parentId: 'prefix_s_so',
    difficulty: 'medium',
  },
  {
    id: 'sub_hard_sign',
    name: 'СУБЪ- разделительный',
    description: 'Разделительный Ъ в субъективный',
    taskNumbers: [9],
    parentId: 'prefix_s_so',
    difficulty: 'easy',
  },

  // PREFIX: ОБ- / ОБЕЗ- / ОБЕС- / ОБЪ-
  {
    id: 'prefix_ob_obez',
    name: 'ОБ- / ОБЕЗ- / ОБЕС- / ОБЪ-',
    description: 'Приставки об-/обез-/обес-/объ-',
    taskNumbers: [9],
    parentId: 'prefixes',
    difficulty: 'medium',
  },
  {
    id: 'obez_soft_sign',
    name: 'ОБЕЗЬ-',
    description: 'ОБЕЗЬ- с мягким знаком (обезьяний)',
    taskNumbers: [9],
    parentId: 'prefix_ob_obez',
    difficulty: 'hard',
  },
  {
    id: 'obes_before_ts',
    name: 'ОБЕС- перед ц',
    description: 'ОБЕС- перед ц (обесцветить)',
    taskNumbers: [9],
    parentId: 'prefix_ob_obez',
    difficulty: 'medium',
  },
  {
    id: 'ob_hard_sign',
    name: 'ОБЪ- разделительный',
    description: 'Разделительный Ъ в объективный',
    taskNumbers: [9],
    parentId: 'prefix_ob_obez',
    difficulty: 'easy',
  },

  // PREFIX: НЕ- / НИ-
  {
    id: 'prefix_ne_ni',
    name: 'НЕ- / НИ-',
    description: 'Приставки не-/ни- (негибаемый, нисходить)',
    taskNumbers: [9],
    parentId: 'prefixes',
    difficulty: 'medium',
  },

  // OTHER PREFIXES
  {
    id: 'prefix_other',
    name: 'Другие приставки',
    description: 'до-, на-, от-, за-, во-, пре- и др.',
    taskNumbers: [9],
    parentId: 'prefixes',
    difficulty: 'easy',
  },

  // ROOT ALTERNATION
  {
    id: 'root_alternation',
    name: 'Чередование в корне',
    description: 'Чередование гласных и согласных в корне слова',
    taskNumbers: [9],
    parentId: 'roots',
    difficulty: 'hard',
  },
  {
    id: 'root_b_bj',
    name: 'бить → бью',
    description: 'Чередование б/бь (бьющийся)',
    taskNumbers: [9],
    parentId: 'root_alternation',
    difficulty: 'medium',
  },
  {
    id: 'root_l_lj',
    name: 'лить → лью',
    description: 'Чередование л/ль (льющийся)',
    taskNumbers: [9],
    parentId: 'root_alternation',
    difficulty: 'medium',
  },
  {
    id: 'root_v_vj',
    name: 'вить → вью',
    description: 'Чередование в/вь (вьющееся)',
    taskNumbers: [9],
    parentId: 'root_alternation',
    difficulty: 'medium',
  },

  // ROOT: Vowel alternation
  {
    id: 'root_vowel_alternation',
    name: 'Чередование гласных в корне',
    description: 'А/О, Е/И и др. (плав/плов, рас/раст, скак/скоч)',
    taskNumbers: [9],
    parentId: 'roots',
    difficulty: 'medium',
  },
  {
    id: 'root_plav_plov',
    name: 'плавать → пловец',
    description: 'Чередование а/о в корне -плав-/-плов-',
    taskNumbers: [9],
    parentId: 'root_vowel_alternation',
    difficulty: 'easy',
  },
  {
    id: 'root_rast_ros',
    name: 'расти → рост',
    description: 'Чередование а/о в корне -раст-/-рос-',
    taskNumbers: [9],
    parentId: 'root_vowel_alternation',
    difficulty: 'easy',
  },
  {
    id: 'root_skak_skoch',
    name: 'скакать → скочек',
    description: 'Чередование а/о в корне -скак-/-скоч-',
    taskNumbers: [9],
    parentId: 'root_vowel_alternation',
    difficulty: 'easy',
  },

  // ROOT: Consonant alternation
  {
    id: 'root_consonant_alternation',
    name: 'Чередование согласных в корне',
    description: 'Ж/ЖГ, Д/ДР и др. (жиг/жег, дер/дра)',
    taskNumbers: [9],
    parentId: 'roots',
    difficulty: 'medium',
  },
  {
    id: 'root_zhig_zheg',
    name: 'жечь → жиг',
    description: 'Чередование жиг/жег в корне',
    taskNumbers: [9],
    parentId: 'root_consonant_alternation',
    difficulty: 'medium',
  },
  {
    id: 'root_der_dra',
    name: 'драть → дер',
    description: 'Чередование дер/дра в корне',
    taskNumbers: [9],
    parentId: 'root_consonant_alternation',
    difficulty: 'medium',
  },

  // ROOT: Verifiable roots
  {
    id: 'root_verifiable',
    name: 'Проверяемые корни',
    description: 'Корни с проверочными словами (жив/жить, чит/читать)',
    taskNumbers: [9],
    parentId: 'roots',
    difficulty: 'easy',
  },
  {
    id: 'root_zhiv_zhit',
    name: 'жить → жив',
    description: 'Корень -жив- с проверочным жить',
    taskNumbers: [9],
    parentId: 'root_verifiable',
    difficulty: 'easy',
  },
  {
    id: 'root_chit_chitat',
    name: 'читать → чит',
    description: 'Корень -чит- с проверочным читать',
    taskNumbers: [9],
    parentId: 'root_verifiable',
    difficulty: 'easy',
  },

  // FOREIGN WORDS
  {
    id: 'foreign_words',
    name: 'Иноязычные слова',
    description: 'Слова иноязычного происхождения (дирижёр, мораторий, метафора)',
    taskNumbers: [9],
    difficulty: 'hard',
  },
]

export function getAtomById(id: string): Atom | undefined {
  return atoms.find(a => a.id === id)
}

export function getChildAtoms(parentId: string): Atom[] {
  return atoms.filter(a => a.parentId === parentId)
}

export function getAtomsForTask(taskNumber: number): Atom[] {
  return atoms.filter(a => a.taskNumbers.includes(taskNumber))
}
