// ─── Error Pattern Analyzer ───
// Detects recurring error types from answer history and wrong answers

import { AnswerHistory, ErrorAnalysis, ErrorPattern, WeakSubskill } from '../types'

export type DetectedErrorType =
  // Task 5 — paronym confusion subtypes
  | 'confused_paronym'
  | 'wrong_suffix_isk_ichesk'
  | 'wrong_suffix_n_niy'
  | 'wrong_adjective_form'
  | 'wrong_participle_vs_adjective'
  | 'wrong_noun_vs_adj'
  | 'wrong_verb_vs_noun'
  | 'wrong_word_pair'
  // Task 9 — root spelling subtypes
  | 'unchecked_root'
  | 'alternating_root'
  | 'foreign_root'
  | 'suffix_ova_ova'
  | 'suffix_eva_iva'
  | 'root_vowel_error'
  | 'consonant_cluster_error'
  // Task 10 — prefix / letter subtypes
  | 'prefix_pri_pre'
  | 'prefix_su_s'
  | 'prefix_vo_v'
  | 'hard_soft_sign'
  | 'letter_e_vs_i'
  | 'letter_o_vs_a'
  | 'letter_ya_vs_ye'
  | 'missing_hard_sign'
  // Task 16 — punctuation subtypes
  | 'relative_clause_comma'
  | 'adverbial_participle_comma'
  | 'introductory_comma'
  | 'conjunction_no_comma'
  | 'conjunction_a_comma'
  | 'homogeneous_members_comma'
  | 'subordinate_time_comma'
  | 'subordinate_cause_comma'
  | 'subordinate_condition_comma'
  | 'subordinate_purpose_comma'
  | 'subordinate_concessive_comma'
  | 'subordinate_attributive_comma'
  | 'indirect_question_comma'
  | 'direct_speech_comma'
  | 'missing_comma'
  | 'extra_comma'
  | 'unknown'

function getConfidence(frequency: number): number {
  if (frequency >= 5) return 0.95
  if (frequency >= 3) return 0.8
  if (frequency >= 2) return 0.5
  return 0.3
}

export function detectErrorType(
  taskNumber: string | number | undefined,
  text: string,
  explanation: string
): DetectedErrorType {
  const t = String(taskNumber ?? '')
  const ex = explanation.toLowerCase()
  const tx = text.toLowerCase()

  // ── Task 5 ──
  if (t === '5' || t.includes('5')) {
    if (ex.includes('→') && (ex.includes('органич') || ex.includes('иронич') || ex.includes('человеческ') || ex.includes('вечн') || ex.includes('скрыт') || ex.includes('звучн') || ex.includes('почтен') || ex.includes('сыты') || ex.includes('микроскопич') || ex.includes('соседск') || ex.includes('жёстк') || ex.includes('искусствен') || ex.includes('яблонев') || ex.includes('расчётн') || ex.includes('публицистич') || ex.includes('костя') || ex.includes('артистич') || ex.includes('представля') || ex.includes('камен') || ex.includes('удач') || ex.includes('лакирован') || ex.includes('царск') || ex.includes('эстетич') || ex.includes('проступ') || ex.includes('земля') || ex.includes('различ') || ex.includes('лесн') || ex.includes('землист') || ex.includes('расчётлив') || ex.includes('словесн') || ex.includes('сравним') || ex.includes('конск') || ex.includes('ритмич') || ex.includes('исходящ') || ex.includes('унизительн') || ex.includes('складск') || ex.includes('благодарн') || ex.includes('дождлив') || ex.includes('единствен') || ex.includes('производительн') || ex.includes('романтич') || ex.includes('экономич') || ex.includes('безлич') || ex.includes('будн') || ex.includes('наблюдательск') || ex.includes('раздражительн') || ex.includes('жилой') || ex.includes('дружествен') || ex.includes('популистск') || ex.includes('личностн') || ex.includes('продуктов') || ex.includes('памятн') || ex.includes('комфортн') || ex.includes('этичн') || ex.includes('производственн') || ex.includes('эффективн') || ex.includes('стеклян') || ex.includes('признательн') || ex.includes('неудачн') || ex.includes('пуганы'))) {
      return 'confused_paronym'
    }
    if (ex.includes('неверно') && ex.includes('→')) return 'wrong_word_pair'
    return 'wrong_adjective_form'
  }

  // ── Task 9 ──
  if (t === '9' || t.includes('9')) {
    if (ex.includes('непроверяемый')) return 'unchecked_root'
    if (ex.includes('чередующийся')) return 'alternating_root'
    if (ex.includes('иноязычный')) return 'foreign_root'
    if (ex.includes('проверяемый')) return 'root_vowel_error'
    if (ex.includes('словарное')) return 'unchecked_root'
    return 'root_vowel_error'
  }

  // ── Task 10 ──
  if (t === '10' || t.includes('10')) {
    if (tx.includes('при') || tx.includes('пре')) return 'prefix_pri_pre'
    if (tx.includes('съ') || tx.includes('суб')) return 'prefix_su_s'
    if (tx.includes('въ') || tx.includes('во') || tx.includes('вз')) return 'prefix_vo_v'
    if (tx.includes('ъ') || tx.includes('ь')) return 'hard_soft_sign'
    if (tx.includes('е') && tx.includes('и')) return 'letter_e_vs_i'
    if (tx.includes('а') && tx.includes('о')) return 'letter_o_vs_a'
    return 'missing_hard_sign'
  }

  // ── Task 16 ──
  if (t === '16' || t.includes('16')) {
    if (ex.includes('который') || ex.includes('определительн')) return 'relative_clause_comma'
    if (ex.includes('времени') || ex.includes('придаточное времени') || ex.includes('когда')) return 'subordinate_time_comma'
    if (ex.includes('причины') || ex.includes('так как')) return 'subordinate_cause_comma'
    if (ex.includes('условия') || ex.includes('если')) return 'subordinate_condition_comma'
    if (ex.includes('цели') || ex.includes('чтобы')) return 'subordinate_purpose_comma'
    if (ex.includes('уступки') || ex.includes('хотя')) return 'subordinate_concessive_comma'
    if (ex.includes('изъяснительное') || ex.includes('что') || ex.includes('косвенный вопрос')) return 'indirect_question_comma'
    if (ex.includes('вводное') || ex.includes('однако') || ex.includes('вообще') || ex.includes('например') || ex.includes('поэтому') || ex.includes('к сожалению') || ex.includes('мне кажется') || ex.includes('без сомнения')) return 'introductory_comma'
    if (ex.includes('противительный') || ex.includes('но')) return 'conjunction_no_comma'
    if (ex.includes('союз «а»')) return 'conjunction_a_comma'
    if (ex.includes('однородные') || ex.includes('группа однородных')) return 'homogeneous_members_comma'
    if (ex.includes('деепричастный')) return 'adverbial_participle_comma'
    if (ex.includes('прямая речь')) return 'direct_speech_comma'
    return 'missing_comma'
  }

  return 'unknown'
}

export function analyzeErrors(history: AnswerHistory[]): ErrorAnalysis {
  const patternsMap = new Map<string, { taskNumber: number; errorType: string; count: number; last: string }>()
  const taskStats: Record<number, { total: number; correct: number }> = {}
  const subskillStats: Record<string, { total: number; correct: number }> = {}

  for (const entry of history) {
    const tn = Number(entry.taskNumber) || 0
    if (!taskStats[tn]) taskStats[tn] = { total: 0, correct: 0 }
    taskStats[tn].total += 1
    if (entry.correct) taskStats[tn].correct += 1

    if (!entry.correct && entry.errorType) {
      const key = `${tn}:${entry.errorType}`
      const existing = patternsMap.get(key)
      if (existing) {
        existing.count += 1
        if (entry.timestamp > existing.last) existing.last = entry.timestamp
      } else {
        patternsMap.set(key, {
          taskNumber: tn,
          errorType: entry.errorType,
          count: 1,
          last: entry.timestamp,
        })
      }

      const skKey = `${tn}:${entry.errorType}`
      if (!subskillStats[skKey]) subskillStats[skKey] = { total: 0, correct: 0 }
      subskillStats[skKey].total += 1
      // wrong answer
    } else if (entry.correct && entry.errorType) {
      const skKey = `${entry.taskNumber}:${entry.errorType}`
      if (!subskillStats[skKey]) subskillStats[skKey] = { total: 0, correct: 0 }
      subskillStats[skKey].total += 1
      subskillStats[skKey].correct += 1
    }
  }

  const patterns: ErrorPattern[] = Array.from(patternsMap.values())
    .map(p => ({
      taskNumber: p.taskNumber,
      errorType: p.errorType,
      frequency: p.count,
      lastOccurred: p.last,
      confidence: getConfidence(p.count),
    }))
    .sort((a, b) => b.confidence - a.confidence || b.frequency - a.frequency)

  const weakSubskills: WeakSubskill[] = Object.entries(subskillStats)
    .map(([key, stats]) => {
      const [taskStr, ...rest] = key.split(':')
      const subskill = rest.join(':')
      return {
        taskNumber: Number(taskStr),
        subskill,
        accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
      }
    })
    .filter(w => w.accuracy < 70)
    .sort((a, b) => a.accuracy - b.accuracy)

  const recommendations: string[] = []
  for (const p of patterns.slice(0, 5)) {
    const rec = getRecommendationForError(p.taskNumber, p.errorType)
    if (rec) recommendations.push(rec)
  }
  if (recommendations.length === 0) {
    recommendations.push('Продолжай регулярную практику — пока ошибок мало, но ранняя диагностика поможет выявить слабые места.')
  }

  return { patterns, weakSubskills, recommendations }
}

function getRecommendationForError(taskNumber: number, errorType: string): string | null {
  const map: Record<string, string> = {
    confused_paronym: 'Повтори правила паронимов: «краткий» справочник по словарю Ефремовой.',
    wrong_suffix_isk_ichesk: 'Повтори суффиксы -ИСК- / -ИЧЕСК-: различия прилагательных.',
    wrong_adjective_form: 'Повтори правила образования прилагательных и причастий.',
    unchecked_root: 'Запоминай непроверяемые корни: веди словарик с трудными словами.',
    alternating_root: 'Повтори чередующиеся корни: раст/ращ/рос, лаг/лож, клан/клон.',
    foreign_root: 'Запоминай иноязычные корни: веди список частых заимствований.',
    root_vowel_error: 'Проверяй корни по однокоренным словам: практикуй подбор проверочных.',
    prefix_pri_pre: 'Повтори приставки ПРИ- / ПРЕ-: раздели по значениям (приближение vs высшая степень).',
    prefix_su_s: 'Повтори приставки СУБ- / С- и разделительные Ъ/Ь.',
    prefix_vo_v: 'Повтори приставки ВО- / В- и разделительные знаки.',
    hard_soft_sign: 'Повтори правила Ъ и Ь после приставок и в середине слова.',
    letter_e_vs_i: 'Повтори правила написания Е / И в корнях и приставках.',
    letter_o_vs_a: 'Повтори правила написания О / А в корнях и приставках.',
    missing_hard_sign: 'Повтори разделительные Ъ и Ь после приставок.',
    relative_clause_comma: 'Повтори запятые в придаточных определительных с «который».',
    subordinate_time_comma: 'Повтори запятые в придаточных времени (когда, пока, после).',
    subordinate_cause_comma: 'Повтори запятые в придаточных причины (так как, потому что).',
    subordinate_condition_comma: 'Повтори запятые в придаточных условия (если, когда).',
    subordinate_purpose_comma: 'Повтори запятые в придаточных цели (чтобы, дабы).',
    subordinate_concessive_comma: 'Повтори запятые в придаточных уступки (хотя, несмотря на).',
    indirect_question_comma: 'Повтори запятые в косвенных вопросах и изъяснительных придаточных.',
    introductory_comma: 'Повтори запятые при вводных словах и словосочетаниях.',
    conjunction_no_comma: 'Повтори запятые перед противительными союзами (но, а).',
    conjunction_a_comma: 'Повтори запятые перед союзом «а».',
    homogeneous_members_comma: 'Повтори запятые между однородными членами.',
    adverbial_participle_comma: 'Повтори запятые при деепричастных оборотах.',
    direct_speech_comma: 'Повтори пунктуацию прямой речи.',
    missing_comma: 'Повтори основные случаи постановки запятых.',
    extra_comma: 'Повтори случаи, когда запятая НЕ нужна.',
  }
  return map[errorType] ?? `Подтяни задание ${taskNumber}: тема «${errorType}».`
}

export function getSubskillName(errorType: string): string {
  const map: Record<string, string> = {
    confused_paronym: 'Паронимы',
    wrong_suffix_isk_ichesk: 'Суффиксы -ИСК-/-ИЧЕСК-',
    wrong_adjective_form: 'Формы прилагательных',
    unchecked_root: 'Непроверяемые корни',
    alternating_root: 'Чередующиеся корни',
    foreign_root: 'Иноязычные корни',
    root_vowel_error: 'Проверяемые корни',
    prefix_pri_pre: 'Приставки ПРИ-/ПРЕ-',
    prefix_su_s: 'Приставки СУБ-/С-',
    prefix_vo_v: 'Приставки ВО-/В-',
    hard_soft_sign: 'Разделительные Ъ/Ь',
    letter_e_vs_i: 'Е/И в корнях',
    letter_o_vs_a: 'О/А в корнях',
    missing_hard_sign: 'Разделительные знаки',
    relative_clause_comma: 'Придаточные с «который»',
    subordinate_time_comma: 'Придаточные времени',
    subordinate_cause_comma: 'Придаточные причины',
    subordinate_condition_comma: 'Придаточные условия',
    subordinate_purpose_comma: 'Придаточные цели',
    subordinate_concessive_comma: 'Придаточные уступки',
    indirect_question_comma: 'Косвенные вопросы',
    introductory_comma: 'Вводные слова',
    conjunction_no_comma: 'Союз «но»',
    conjunction_a_comma: 'Союз «а»',
    homogeneous_members_comma: 'Однородные члены',
    adverbial_participle_comma: 'Деепричастные обороты',
    direct_speech_comma: 'Прямая речь',
    missing_comma: 'Пропущенные запятые',
    extra_comma: 'Лишние запятые',
    unknown: 'Прочие ошибки',
  }
  return map[errorType] ?? errorType
}
