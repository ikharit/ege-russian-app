const fs = require('fs')
const path = require('path')

const INPUT = path.resolve(__dirname, '../../atomization-project/data/raw_words.txt')
const OUTPUT = path.resolve(__dirname, '../src/data/atomization/atomizedWords.json')

function parseLine(line) {
  const trimmed = line.trim()
  if (!trimmed) return null

  let context = ''
  let rawForm = trimmed

  const prefixMatch = trimmed.match(/^\(([^)]+)\)\s*(.+)/)
  if (prefixMatch) {
    context = prefixMatch[1]
    rawForm = prefixMatch[2]
  }

  const suffixMatch = rawForm.match(/^(.+?)\s*\(([^)]+)\)\s*$/)
  if (suffixMatch) {
    rawForm = suffixMatch[1]
    context = context || suffixMatch[2]
  }

  const dotIdx = rawForm.indexOf('..')
  if (dotIdx === -1) return null

  const before = rawForm.slice(0, dotIdx)
  const after = rawForm.slice(dotIdx + 2)

  const result = resolveWord(before, after, rawForm, context)

  return {
    word: result.word,
    rawForm: trimmed,
    atoms: result.atoms,
    taskNumber: 9,
    difficulty: result.difficulty,
    explanation: result.explanation,
    rule: result.rule,
  }
}

function resolveWord(before, after, rawForm, context) {
  let word = ''
  let atoms = []
  let explanation = ''
  let rule = ''
  let difficulty = 'medium'

  if (before === 'пр') {
    if (after.startsWith('д')) {
      const predWords = ['защита','заказ','седания','дпринять','дставить','думал','дъюбилейный','глашить']
      const podWords = ['караул','ножие','править']
      if (predWords.some(w => after.includes(w))) {
        word = 'пред' + after
        atoms = ['prefix_pre_pri', 'pre_pred']
        explanation = `Приставка ПРЕД- (пред${after})`
        rule = 'Пишется ПРЕД- в значении "перед"'
      } else if (podWords.some(w => after.includes(w))) {
        word = 'под' + after
        atoms = ['prefix_pre_pri', 'pod_verifiable']
        explanation = `Приставка ПОД- (под${after})`
        rule = 'Пишется ПОД- в значении "снизу", "неполнота"'
      } else {
        word = 'пред' + after
        atoms = ['prefix_pre_pri', 'pre_pred']
      }
    } else {
      const preWords = ['исполнен','мудрый','образ','града','сечь','творить','вращение','амурский','клеить','следование','мадонна','станище','глашить','вратив']
      const priWords = ['обрёл','озёрский','открыть','вязанный','интересный','строиться','язык','родитель','обнял','емлемый','седание','амур']
      
      if (preWords.some(w => after.includes(w))) {
        word = 'пре' + after
        atoms = ['prefix_pre_pri', 'pre_pri_dictionary']
        explanation = `Словарное слово с ПРЕ-: пре${after}`
        rule = 'ПРЕ- пишется в словарных словах (преисполнен, премудрый и т.д.)'
        difficulty = 'hard'
      } else if (priWords.some(w => after.includes(w))) {
        word = 'при' + after
        atoms = ['prefix_pre_pri', 'pri_dictionary']
        explanation = `Словарное слово с ПРИ-: при${after}`
        rule = 'ПРИ- пишется в словарных словах (приобрести, приоткрыть и т.д.)'
        difficulty = 'hard'
      } else {
        word = 'при' + after
        atoms = ['prefix_pre_pri', 'pri_dictionary']
        explanation = `Предположительно ПРИ-: при${after}`
        difficulty = 'medium'
      }
    }
  }

  else if (before === 'в') {
    if (after.startsWith('колос') || after.startsWith('пых') || after.startsWith('плес') || after.startsWith('ка')) {
      word = 'вс' + after
      atoms = ['prefix_vs_vz', 'vs_before_kh']
      explanation = `Приставка ВС- перед к, х, п: вс${after}`
      rule = 'Перед к, х, п пишется ВС- (всколоситься, вспыхнуть)'
    } else if (after.startsWith('езд') || after.startsWith('ём') || after.startsWith('ю')) {
      word = 'въ' + after
      atoms = ['prefix_vs_vz', 'v_hard_sign']
      explanation = `Разделительный Ъ: въ${after}`
      rule = 'Ъ пишется после приставки, оканчивающейся на согласную, перед е, ё, ю, я'
      difficulty = 'easy'
    } else if (after.startsWith('ь')) {
      word = 'в' + after.replace(/^ь/, 'ью')
      atoms = ['root_alternation', 'root_v_vj']
      explanation = `Чередование в/вь: вьющееся`
      rule = 'В корне -вит- перед суффиксом -ю- пишется Ь'
      difficulty = 'medium'
    } else {
      word = 'в' + after
      atoms = ['prefix_other']
      explanation = `Неопределённый случай: в${after}`
    }
  }
  else if (before === 'вз') {
    word = 'взо' + after
    atoms = ['prefix_vs_vz', 'vz_before_bd']
    explanation = `Приставка ВЗО-: взо${after}`
    rule = 'Перед б, д, з, ж пишется ВЗО- (взобраться)'
  }

  else if (before === 'чере') {
    word = 'черес' + after
    atoms = ['prefix_cheres_chrez']
    explanation = `Приставка ЧЕРЕС-: черес${after}`
    rule = 'Черес- пишется в словах чересчур, чересполосица'
    difficulty = 'hard'
  }
  else if (before === 'чре') {
    word = 'чрез' + after
    atoms = ['prefix_cheres_chrez']
    explanation = `Приставка ЧРЕЗ-: чрез${after}`
    rule = 'Чрез- пишется в слове чрезвычайный'
    difficulty = 'hard'
  }

  else if (before === 'ра') {
    if (after.startsWith('кая') || after.startsWith('шир')) {
      word = 'рас' + after
      atoms = ['prefix_ras_raz', 'ras_before_kh']
      explanation = `Приставка РАС- перед к, ч: рас${after}`
      rule = 'Перед к, ч, п пишется РАС- (раскаяние, расширяться)'
    } else {
      word = 'ра' + after
      atoms = ['prefix_ras_raz']
    }
  }
  else if (before === 'раз') {
    if (after.startsWith('е')) {
      word = 'разъ' + after
      atoms = ['prefix_ras_raz', 'raz_before_deaf']
      explanation = `Приставка РАЗЪ-: разъ${after}`
      rule = 'Ъ пишется после приставки перед е, ё, ю, я'
    } else {
      word = 'разо' + after
      atoms = ['prefix_ras_raz', 'raz_before_deaf']
      explanation = `Приставка РАЗО-: разо${after}`
      rule = 'Перед глухими согласными пишется РАЗО- (разобрать)'
    }
  }
  else if (before === 'ро') {
    word = 'рос' + after
    atoms = ['prefix_ras_raz', 'ros_roz_special']
    explanation = `Особый случай РОС-: рос${after}`
    rule = 'В слове росчерк пишется РОС-'
    difficulty = 'hard'
  }
  else if (before === 'роз') {
    word = 'розы' + after
    atoms = ['prefix_ras_raz', 'ros_roz_special']
    explanation = `Особый случай РОЗЫ-: розы${after}`
    rule = 'В слове розыск пишется РОЗЫ-'
    difficulty = 'hard'
  }

  else if (before === 'двух' || before === 'трёх' || before === 'четырёх' || before === 'пяти') {
    word = before + 'ъ' + after
    atoms = ['prefix_other']
    explanation = `Разделительный Ъ: ${before}ъ${after}`
    rule = 'Ъ пишется после приставки, оканчивающейся на согласную, перед е, ё, ю, я, и'
  }
  else if (before === 'мед') {
    word = 'мед' + after
    atoms = ['prefix_other']
    explanation = 'Сложное слово: мединститут (медицинский институт)'
  }
  else if (before === 'пост') {
    word = 'пост' + after
    atoms = ['prefix_other']
    explanation = 'Приставка ПОСТ-: постинфарктный'
  }
  else if (before === 'прот') {
    word = 'прото' + after
    atoms = ['prefix_other']
    explanation = 'Приставка ПРОТО-: прототип'
  }
  else if (before === 'сверх') {
    word = 'сверх' + after
    atoms = ['prefix_other']
    explanation = 'Приставка СВЕРХ-: сверхинвестиции'
  }
  else if (before === 'дет') {
    word = 'дет' + after
    atoms = ['prefix_other']
    explanation = 'Сложное слово: детясли'
  }
  else if (before === 'без') {
    word = 'без' + after[0] + after
    atoms = ['prefix_bez_bes']
    explanation = `Приставка БЕЗ-: без${after[0]}${after}`
    rule = 'БЕЗ- пишется перед звонкими согласными'
    difficulty = 'easy'
  }
  else if (before === 'бес') {
    word = 'бес' + after
    atoms = ['prefix_bez_bes']
    explanation = `Приставка БЕС-: бес${after}`
    rule = 'БЕС- пишется перед глухими согласными'
    difficulty = 'easy'
  }
  else if (before === 'бе') {
    if (after.startsWith('с')) {
      word = 'бесс' + after.slice(1)
      atoms = ['prefix_bez_bes']
    } else if (after.startsWith('к')) {
      word = 'беск' + after.slice(1)
      atoms = ['prefix_bez_bes']
    } else {
      word = 'бе' + after
      atoms = ['prefix_bez_bes']
    }
  }

  else if (before === 'из') {
    word = 'из' + after
    atoms = ['prefix_iz_is']
    explanation = `Приставка ИЗ-: из${after}`
  }
  else if (before === 'ис') {
    if (after.startsWith('под')) {
      word = 'испод' + after.slice(3)
      atoms = ['prefix_iz_is']
    } else if (after.startsWith('след')) {
      word = 'исс' + after
      atoms = ['prefix_iz_is']
      explanation = 'Двойная с: исследовать'
    } else {
      word = 'ис' + after
      atoms = ['prefix_iz_is']
    }
  }
  else if (before === 'и') {
    if (after.startsWith('расход')) {
      word = 'израсход' + after.slice(6)
      atoms = ['prefix_iz_is']
    } else if (after.startsWith('подтишк')) {
      word = 'исподтишк' + after.slice(7)
      atoms = ['prefix_iz_is']
    } else if (after.startsWith('след')) {
      word = 'исс' + after
      atoms = ['prefix_iz_is']
    } else if (after.startsWith('мпровизир')) {
      word = 'с' + after
      atoms = ['prefix_s_so']
    } else {
      word = 'и' + after
      atoms = ['prefix_iz_is']
    }
  }

  else if (before === 'с') {
    if (after.startsWith('знов') || after.startsWith('грать') || after.startsWith('ест') || after.startsWith('ъезд')) {
      word = 'сы' + after
      atoms = ['prefix_s_so', 's_with_y']
      explanation = `Приставка СЫ-: сы${after}`
      rule = 'Перед з, с, г, к пишется СЫ- (сызнова, сыграть, съесть)'
    } else if (after.startsWith('едоб')) {
      word = 'со' + after
      atoms = ['prefix_s_so']
    } else {
      word = 'с' + after
      atoms = ['prefix_s_so']
    }
  }
  else if (before === 'суб') {
    word = 'субъ' + after
    atoms = ['prefix_s_so', 'sub_hard_sign']
    explanation = `Разделительный Ъ: субъ${after}`
    rule = 'Ъ пишется в слове субъективный'
    difficulty = 'easy'
  }

  else if (before === 'обез') {
    word = 'обезь' + after
    atoms = ['prefix_ob_obez', 'obez_soft_sign']
    explanation = `ОБЕЗЬ- с мягким знаком: обезь${after}`
    rule = 'В слове обезьяний пишется ОБЕЗЬ-'
    difficulty = 'hard'
  }
  else if (before === 'обес') {
    word = 'обес' + after
    atoms = ['prefix_ob_obez', 'obes_before_ts']
    explanation = `ОБЕС- перед ц: обес${after}`
    rule = 'ОБЕС- пишется перед ц (обесцветить)'
  }
  else if (before === 'об') {
    if (after.startsWith('ектив')) {
      word = 'объ' + after
      atoms = ['prefix_ob_obez', 'ob_hard_sign']
      explanation = `Разделительный Ъ: объ${after}`
      rule = 'Ъ пишется после приставки, оканчивающейся на согласную'
      difficulty = 'easy'
    } else {
      word = 'об' + after
      atoms = ['prefix_ob_obez']
    }
  }
  else if (before === 'обе') {
    word = 'обес' + after
    atoms = ['prefix_ob_obez', 'obes_before_ts']
  }

  else if (before === 'не') {
    if (after.startsWith('гиб') || after.startsWith('конеч') || after.startsWith('прибуд') || after.startsWith('об')) {
      word = 'не' + after
      atoms = ['prefix_ne_ni']
    } else if (after.startsWith('пр')) {
      if (after.startsWith('при')) {
        word = 'непри' + after.slice(3)
        atoms = ['prefix_ne_ni', 'prefix_pre_pri', 'pri_dictionary']
      } else if (after.startsWith('пре')) {
        word = 'непре' + after.slice(3)
        atoms = ['prefix_ne_ni', 'prefix_pre_pri', 'pre_pri_dictionary']
      } else {
        word = 'непри' + after.slice(2)
        atoms = ['prefix_ne_ni', 'prefix_pre_pri']
      }
    } else if (after.startsWith('ступ')) {
      word = 'непри' + after
      atoms = ['prefix_ne_ni', 'prefix_pre_pri', 'pri_dictionary']
    } else if (after.startsWith('емлем')) {
      word = 'непри' + after
      atoms = ['prefix_ne_ni', 'prefix_pre_pri', 'pri_dictionary']
    } else if (after.startsWith('гляд')) {
      word = 'непри' + after
      atoms = ['prefix_ne_ni', 'prefix_pre_pri', 'pri_dictionary']
    } else if (after.startsWith('бход')) {
      word = 'необ' + after
      atoms = ['prefix_ne_ni']
    } else {
      word = 'не' + after
      atoms = ['prefix_ne_ni']
    }
  }
  else if (before === 'ни') {
    word = 'нис' + after
    atoms = ['prefix_ne_ni']
    explanation = `Приставка НИС-: нис${after}`
    rule = 'В глаголе нисходить пишется НИС-'
  }
  else if (before === 'н') {
    if (after.startsWith('сахар')) {
      word = 'нас' + after
      atoms = ['prefix_other']
    } else if (after.startsWith('дстр')) {
      word = 'над' + after
      atoms = ['prefix_other']
    } else if (after.startsWith('дтрес')) {
      word = 'над' + after
      atoms = ['prefix_other']
    } else if (after.startsWith('едосчит')) {
      word = 'недо' + after
      atoms = ['prefix_other']
    } else {
      word = 'н' + after
      atoms = ['prefix_ne_ni']
    }
  }

  else if (before === 'до') {
    word = 'до' + after
    atoms = ['prefix_other']
    explanation = `Приставка ДО-: до${after}`
    difficulty = 'easy'
  }
  else if (before === 'на') {
    if (after.startsWith('счёт')) {
      word = 'нас' + after
      atoms = ['prefix_other']
    } else {
      word = 'на' + after
      atoms = ['prefix_other']
    }
  }
  else if (before === 'от') {
    word = 'от' + after
    atoms = ['prefix_other']
  }
  else if (before === 'з') {
    word = 'за' + after
    atoms = ['prefix_other']
    explanation = `Приставка ЗА-: за${after}`
  }
  else if (before === 'о') {
    if (after.startsWith('бойн')) {
      word = 'об' + after
      atoms = ['prefix_ob_obez']
    } else {
      word = 'о' + after
      atoms = ['prefix_other']
    }
  }
  else if (before === 'под') {
    if (after.startsWith('ъезж')) {
      word = 'подъ' + after
      atoms = ['prefix_pre_pri', 'v_hard_sign']
    } else if (after.startsWith('брать')) {
      word = 'подо' + after
      atoms = ['prefix_pre_pri', 'pod_verifiable']
    } else if (after.startsWith('кладк')) {
      word = 'под' + after
      atoms = ['prefix_pre_pri', 'pod_verifiable']
    } else {
      word = 'под' + after
      atoms = ['prefix_pre_pri']
    }
  }
  else if (before === 'по') {
    if (after.startsWith('кладк')) {
      word = 'под' + after
      atoms = ['prefix_pre_pri', 'pod_verifiable']
    } else {
      word = 'по' + after
      atoms = ['prefix_other']
    }
  }
  else if (before === 'во') {
    word = 'вос' + after
    atoms = ['prefix_other']
  }
  else if (before === 'пре') {
    word = 'пре' + after
    atoms = ['prefix_pre_pri', 'pre_pri_dictionary']
  }
  else if (before === 'при') {
    word = 'при' + after
    atoms = ['prefix_pre_pri', 'pri_dictionary']
  }

  else if (before === 'п') {
    if (after.startsWith('дкараул')) {
      word = 'под' + after
      atoms = ['prefix_pre_pri', 'pod_verifiable']
    } else if (after.startsWith('дножие')) {
      word = 'под' + after
      atoms = ['prefix_pre_pri', 'pod_verifiable']
    } else if (after.startsWith('дправ')) {
      word = 'под' + after
      atoms = ['prefix_pre_pri', 'pod_verifiable']
    } else if (after.startsWith('еса')) {
      word = 'пь' + after
      atoms = ['suffixes']
      explanation = 'Суффикс -ь- в слове пьеса'
      difficulty = 'medium'
    } else if (after.startsWith('сол')) {
      word = 'посол' + after.slice(3)
      atoms = ['prefix_other']
    } else {
      word = 'п' + after
      atoms = ['prefix_pre_pri']
    }
  }

  else if (before === 'б') {
    word = 'бь' + after
    atoms = ['root_alternation', 'root_b_bj']
    explanation = `Чередование б/бь: бь${after}`
    rule = 'В корне -бит- перед суффиксом -ю- пишется Ь'
  }
  else if (before === 'л') {
    word = 'ль' + after
    atoms = ['root_alternation', 'root_l_lj']
    explanation = `Чередование л/ль: ль${after}`
    rule = 'В корне -лит- перед суффиксом -ю- пишется Ь'
  }

  else if (before === 'вороб') {
    word = 'воробьи'
    atoms = ['root_alternation']
    explanation = 'Ь в суффиксе существительных (воробьи)'
  }
  else if (before === 'сер') {
    word = 'серьёзный'
    atoms = ['suffixes']
    explanation = 'Ь в корне: серьёзный'
  }
  else if (before === 'павил') {
    word = 'павильон'
    atoms = ['suffixes']
  }
  else if (before === 'контр') {
    word = 'контръ' + after
    atoms = ['prefix_other']
    explanation = 'Разделительный Ъ: контръгра'
  }
  else if (before === 'меж') {
    word = 'межъ' + after
    atoms = ['prefix_other']
    explanation = 'Разделительный Ъ: межъязыковой'
  }
  else if (before === 'трёх') {
    word = 'трёхъ' + after
    atoms = ['prefix_other']
    explanation = 'Разделительный Ъ: трёхъядерный'
  }
  else if (before === 'пед') {
    word = 'пед' + after
    atoms = ['prefix_other']
  }

  else if (before === 'д') {
    if (after.startsWith('рассказ') || after.startsWith('гнать') || after.startsWith('бела')) {
      word = 'до' + after
      atoms = ['prefix_other']
    } else {
      word = 'д' + after
      atoms = ['prefix_other']
    }
  }
  else if (before === 'ар') {
    word = 'арь' + after
    atoms = ['prefix_other']
  }
  else if (before === 'порт') {
    word = 'порть' + after
    atoms = ['suffixes']
  }
  else if (before === 'кур') {
    word = 'курь' + after
    atoms = ['suffixes']
  }
  else if (before === '') {
    word = after
    atoms = ['unknown']
  }
  else {
    word = before + after
    atoms = ['unknown']
    explanation = `Не распознано: ${before}..${after}`
  }

  return { word, atoms, explanation, rule, difficulty }
}

const lines = fs.readFileSync(INPUT, 'utf-8').split('\n')
const results = []
const unknowns = []

for (const line of lines) {
  const parsed = parseLine(line)
  if (parsed) {
    results.push(parsed)
    if (parsed.atoms.includes('unknown')) {
      unknowns.push(parsed.rawForm)
    }
  }
}

fs.writeFileSync(OUTPUT, JSON.stringify({
  total: results.length,
  unknowns: unknowns.length,
  words: results,
  unknownList: unknowns,
}, null, 2))

console.log(`Parsed: ${results.length} words`)
console.log(`Unknowns: ${unknowns.length}`)
if (unknowns.length > 0) {
  console.log('Unknown words (first 20):', unknowns.slice(0, 20))
}
