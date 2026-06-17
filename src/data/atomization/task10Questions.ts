import { Question } from '../../types'

// Вопросы задания №10 — атомизация приставок (50 вопросов, покрывающих все категории)
export const task10Questions: Question[] = [
  // === ПРЕ- / ПРИ- (словарные) ===
  {
    id: 'q10-atom-1', type: 'single', text: 'Вставьте пропущенную букву: пр.исполнен (отваги)',
    options: ['преисполнен', 'приисполнен'], correctAnswer: ['преисполнен'],
    explanation: 'ПРЕ- (заранее, вперёд) — словарное слово. Проверить нельзя, запомнить: преисполнен, премудрый, преследование.', difficulty: 'hard', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_dict']
  },
  {
    id: 'q10-atom-2', type: 'single', text: 'Вставьте пропущенную букву: пр.мудрый',
    options: ['премудрый', 'примудрый'], correctAnswer: ['премудрый'],
    explanation: 'ПРЕ- — словарное слово, нельзя проверить.', difficulty: 'hard', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_dict']
  },
  {
    id: 'q10-atom-3', type: 'single', text: 'Вставьте пропущенную букву: пр.следование (врага)',
    options: ['преследование', 'приследование'], correctAnswer: ['преследование'],
    explanation: 'ПРЕ- — словарное слово.', difficulty: 'hard', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_dict']
  },
  {
    id: 'q10-atom-4', type: 'single', text: 'Вставьте пропущенную букву: пр.мадонна',
    options: ['премадонна', 'примадонна'], correctAnswer: ['премадонна'],
    explanation: 'ПРЕ- — словарное слово (от итальянской Примадонны, но в русском устоялось с ПРЕ-).', difficulty: 'hard', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_dict']
  },
  {
    id: 'q10-atom-5', type: 'single', text: 'Вставьте пропущенную букву: пр.града',
    options: ['преграда', 'приграда'], correctAnswer: ['преграда'],
    explanation: 'ПРЕ- — словарное слово (преграда, препятствие).', difficulty: 'hard', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_dict']
  },
  // === ПРЕ- / ПРИ- (проверяемые) ===
  {
    id: 'q10-atom-6', type: 'single', text: 'Вставьте пропущенную букву: пр.обрёл',
    options: ['приобрёл', 'преобрёл'], correctAnswer: ['приобрёл'],
    explanation: 'ПРИ- — приближение. Проверочное: обрести.', difficulty: 'medium', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_verif']
  },
  {
    id: 'q10-atom-7', type: 'single', text: 'Вставьте пропущенную букву: пр.открыть',
    options: ['приоткрыть', 'преоткрыть'], correctAnswer: ['приоткрыть'],
    explanation: 'ПРИ- — приближение, неполнота. Проверочное: открыть.', difficulty: 'medium', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_verif']
  },
  {
    id: 'q10-atom-8', type: 'single', text: 'Вставьте пропущенную букву: пр.вязанный (к дереву)',
    options: ['привязанный', 'превязанный'], correctAnswer: ['привязанный'],
    explanation: 'ПРИ- — приближение. Проверочное: вязать.', difficulty: 'medium', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_verif']
  },
  {
    id: 'q10-atom-9', type: 'single', text: 'Вставьте пропущенную букву: пр.клеить (к картону)',
    options: ['приклеить', 'преклеить'], correctAnswer: ['приклеить'],
    explanation: 'ПРИ- — приближение. Проверочное: клеить.', difficulty: 'easy', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_verif']
  },
  {
    id: 'q10-atom-10', type: 'single', text: 'Вставьте пропущенную букву: пр.смотреться',
    options: ['присмотреться', 'пресмотреться'], correctAnswer: ['присмотреться'],
    explanation: 'ПРИ- — приближение. Проверочное: смотреть.', difficulty: 'easy', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_verif']
  },
  // === ПРЕД- / ПОД- ===
  {
    id: 'q10-atom-11', type: 'single', text: 'Вставьте пропущенную букву: пр.дзащита',
    options: ['предзащита', 'придзащита'], correctAnswer: ['предзащита'],
    explanation: 'ПРЕД- — заранее. Проверочное: защита.', difficulty: 'medium', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_pred']
  },
  {
    id: 'q10-atom-12', type: 'single', text: 'Вставьте пропущенную букву: пр.дъюбилейный',
    options: ['предъюбилейный', 'придъюбилейный'], correctAnswer: ['предъюбилейный'],
    explanation: 'ПРЕД- — заранее. Разделительный Ъ перед ю, я, е, ё, у.', difficulty: 'medium', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_pred', 'hard_sign']
  },
  {
    id: 'q10-atom-13', type: 'single', text: 'Вставьте пропущенную букву: п.дкараулить',
    options: ['подкараулить', 'поткараулить'], correctAnswer: ['подкараулить'],
    explanation: 'ПОД- — снизу, тайно. Проверочное: караул.', difficulty: 'medium', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_pred']
  },
  {
    id: 'q10-atom-14', type: 'single', text: 'Вставьте пропущенную букву: п.дножие (горы)',
    options: ['подножие', 'потножие'], correctAnswer: ['подножие'],
    explanation: 'ПОД- — снизу. Проверочное: нога.', difficulty: 'easy', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_pred']
  },
  {
    id: 'q10-atom-15', type: 'single', text: 'Вставьте пропущенную букву: п.дправить',
    options: ['подправить', 'потправить'], correctAnswer: ['подправить'],
    explanation: 'ПОД- — немного, слегка. Проверочное: править.', difficulty: 'easy', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_pred']
  },
  // === ВС- / ВЗ- / ВЪ- ===
  {
    id: 'q10-atom-16', type: 'single', text: 'Вставьте пропущенную букву: (рожь) в.колосилась',
    options: ['всколосилась', 'взколосилась'], correctAnswer: ['всколосилась'],
    explanation: 'ВС- перед глухими к, х, п, с, т, ф, ц, ш, щ (всколоситься, вспыхнуть).', difficulty: 'hard', xpReward: 10, atoms: ['prefix_z_s', 'z_s_vz_vs']
  },
  {
    id: 'q10-atom-17', type: 'single', text: 'Вставьте пропущенную букву: вз.браться (на гору)',
    options: ['взобраться', 'всобраться'], correctAnswer: ['взобраться'],
    explanation: 'ВЗ- перед звонкими б, д, з, г, ж, в (взобраться, вздремнуть).', difficulty: 'hard', xpReward: 10, atoms: ['prefix_z_s', 'z_s_vz_vs']
  },
  {
    id: 'q10-atom-18', type: 'single', text: 'Вставьте пропущенную букву: в.пыхнуть',
    options: ['вспыхнуть', 'взпыхнуть'], correctAnswer: ['вспыхнуть'],
    explanation: 'ВС- перед глухими (вспыхнуть, вскипеть).', difficulty: 'hard', xpReward: 10, atoms: ['prefix_z_s', 'z_s_vz_vs']
  },
  {
    id: 'q10-atom-19', type: 'single', text: 'Вставьте пропущенную букву: в.езд',
    options: ['въезд', 'вьезд'], correctAnswer: ['въезд'],
    explanation: 'Разделительный Ъ после приставки, оканчивающейся на согласную, перед ю, я, е, ё, у.', difficulty: 'medium', xpReward: 10, atoms: ['prefix_hard_soft', 'hard_sign']
  },
  {
    id: 'q10-atom-20', type: 'single', text: 'Вставьте пропущенную букву: в.езжать',
    options: ['въезжать', 'вьезжать'], correctAnswer: ['въезжать'],
    explanation: 'Разделительный Ъ (въезжать, съезд).', difficulty: 'medium', xpReward: 10, atoms: ['prefix_hard_soft', 'hard_sign']
  },
  // === РАС- / РАЗ- / РОС- / РОЗ- ===
  {
    id: 'q10-atom-21', type: 'single', text: 'Вставьте пропущенную букву: ра.каяние',
    options: ['раскаяние', 'разкаяние'], correctAnswer: ['раскаяние'],
    explanation: 'РАС- перед глухими к, ч, п, с, т, ф, ц, ш, щ (раскаяние, расширить).', difficulty: 'hard', xpReward: 10, atoms: ['prefix_ra_ro', 'ra_ro_vowel']
  },
  {
    id: 'q10-atom-22', type: 'single', text: 'Вставьте пропущенную букву: раз.брать',
    options: ['разобрать', 'расобрать'], correctAnswer: ['разобрать'],
    explanation: 'РАЗ- перед звонкими и гласными (разобрать, разъехаться).', difficulty: 'hard', xpReward: 10, atoms: ['prefix_ra_ro', 'ra_ro_vowel']
  },
  {
    id: 'q10-atom-23', type: 'single', text: 'Вставьте пропущенную букву: ро.черк',
    options: ['росчерк', 'розчерк'], correctAnswer: ['росчерк'],
    explanation: 'РОС- перед ч, ш, щ (росчерк, россыпь).', difficulty: 'hard', xpReward: 10, atoms: ['prefix_ra_ro', 'ra_ro_vowel']
  },
  {
    id: 'q10-atom-24', type: 'single', text: 'Вставьте пропущенную букву: роз.ск (преступника)',
    options: ['розыск', 'росыск'], correctAnswer: ['розыск'],
    explanation: 'РОЗ- перед з, с (розыск, рознь).', difficulty: 'hard', xpReward: 10, atoms: ['prefix_ra_ro', 'ra_ro_vowel']
  },
  {
    id: 'q10-atom-25', type: 'single', text: 'Вставьте пропущенную букву: ра.ширяться',
    options: ['расширяться', 'разширяться'], correctAnswer: ['расширяться'],
    explanation: 'РАС- перед глухими (расширяться, раскаляться).', difficulty: 'hard', xpReward: 10, atoms: ['prefix_ra_ro', 'ra_ro_vowel']
  },
  // === БЕЗ- / БЕС- ===
  {
    id: 'q10-atom-26', type: 'single', text: 'Вставьте пропущенную букву: без.скусный',
    options: ['безыскусный', 'бесыскусный'], correctAnswer: ['безыскусный'],
    explanation: 'БЕЗ- перед звонкими б, в, г, д, з, ж (безыскусный, безграничный).', difficulty: 'medium', xpReward: 10, atoms: ['prefix_z_s', 'z_s_deaf']
  },
  {
    id: 'q10-atom-27', type: 'single', text: 'Вставьте пропущенную букву: бес.правный',
    options: ['бесправный', 'безправный'], correctAnswer: ['бесправный'],
    explanation: 'БЕС- перед глухими п, с, т, к, ф, х, ц, ч, ш, щ (бесправный, бесконечный).', difficulty: 'medium', xpReward: 10, atoms: ['prefix_z_s', 'z_s_deaf']
  },
  {
    id: 'q10-atom-28', type: 'single', text: 'Вставьте пропущенную букву: бе.вкусный',
    options: ['безвкусный', 'бесвкусный'], correctAnswer: ['безвкусный'],
    explanation: 'БЕЗ- перед звонкими (безвкусный, безбрежный).', difficulty: 'easy', xpReward: 10, atoms: ['prefix_z_s', 'z_s_deaf']
  },
  {
    id: 'q10-atom-29', type: 'single', text: 'Вставьте пропущенную букву: бе.конечный',
    options: ['бесконечный', 'безконечный'], correctAnswer: ['бесконечный'],
    explanation: 'БЕС- перед глухими (бесконечный, бесчестный).', difficulty: 'easy', xpReward: 10, atoms: ['prefix_z_s', 'z_s_deaf']
  },
  {
    id: 'q10-atom-30', type: 'single', text: 'Вставьте пропущенную букву: бе.звёздный',
    options: ['беззвёздный', 'бесзвёздный'], correctAnswer: ['беззвёздный'],
    explanation: 'БЕЗ- перед звонкими (беззвёздный, безбожный).', difficulty: 'easy', xpReward: 10, atoms: ['prefix_z_s', 'z_s_deaf']
  },
  // === ИЗ- / ИС- / ИСПО- ===
  {
    id: 'q10-atom-31', type: 'single', text: 'Вставьте пропущенную букву: изра.ходовать',
    options: ['израсходовать', 'исрасходовать'], correctAnswer: ['израсходовать'],
    explanation: 'ИЗ- перед р (израсходовать, изредка).', difficulty: 'hard', xpReward: 10, atoms: ['prefix_z_s', 'z_s_iz_is']
  },
  {
    id: 'q10-atom-32', type: 'single', text: 'Вставьте пропущенную букву: и.подтишка',
    options: ['исподтишка', 'изподтишка'], correctAnswer: ['исподтишка'],
    explanation: 'ИС- перед п (исподтишка, исподлобья).', difficulty: 'hard', xpReward: 10, atoms: ['prefix_z_s', 'z_s_iz_is']
  },
  {
    id: 'q10-atom-33', type: 'single', text: 'Вставьте пропущенную букву: и.следовать',
    options: ['исследовать', 'изследовать'], correctAnswer: ['исследовать'],
    explanation: 'ИС- перед с (исследовать, исчезнуть).', difficulty: 'hard', xpReward: 10, atoms: ['prefix_z_s', 'z_s_iz_is']
  },
  {
    id: 'q10-atom-34', type: 'single', text: 'Вставьте пропущенную букву: и.подлобья',
    options: ['исподлобья', 'изподлобья'], correctAnswer: ['исподлобья'],
    explanation: 'ИС- перед п (исподлобья, исподволь).', difficulty: 'hard', xpReward: 10, atoms: ['prefix_z_s', 'z_s_iz_is']
  },
  {
    id: 'q10-atom-35', type: 'single', text: 'Вставьте пропущенную букву: и.мельчить',
    options: ['измельчить', 'исмельчить'], correctAnswer: ['измельчить'],
    explanation: 'ИЗ- перед м (измельчить, измучить).', difficulty: 'medium', xpReward: 10, atoms: ['prefix_z_s', 'z_s_iz_is']
  },
  // === С- / СЫ- / СУБ- ===
  {
    id: 'q10-atom-36', type: 'single', text: 'Вставьте пропущенную букву: с.знова',
    options: ['сызнова', 'сизнова'], correctAnswer: ['сызнова'],
    explanation: 'СЫ- после приставки с перед з, с, г, д, в, б (сызнова, сыграть, съесть).', difficulty: 'hard', xpReward: 10, atoms: ['prefix_y_i']
  },
  {
    id: 'q10-atom-37', type: 'single', text: 'Вставьте пропущенную букву: с.грать',
    options: ['сыграть', 'сиграть'], correctAnswer: ['сыграть'],
    explanation: 'СЫ- после приставки с перед г (сыграть, съесть).', difficulty: 'hard', xpReward: 10, atoms: ['prefix_y_i']
  },
  {
    id: 'q10-atom-38', type: 'single', text: 'Вставьте пропущенную букву: с.едобный',
    options: ['съедобный', 'седобный'], correctAnswer: ['съедобный'],
    explanation: 'СЪ- с разделительным Ъ (съедобный, съесть).', difficulty: 'medium', xpReward: 10, atoms: ['prefix_hard_soft', 'hard_sign']
  },
  {
    id: 'q10-atom-39', type: 'single', text: 'Вставьте пропущенную букву: суб.ективный',
    options: ['субъективный', 'субективный'], correctAnswer: ['субъективный'],
    explanation: 'Разделительный Ъ перед е (субъективный, объективный).', difficulty: 'medium', xpReward: 10, atoms: ['prefix_hard_soft', 'hard_sign']
  },
  {
    id: 'q10-atom-40', type: 'single', text: 'Вставьте пропущенную букву: с.ёжиться',
    options: ['съёжиться', 'сёжиться'], correctAnswer: ['съёжиться'],
    explanation: 'СЪ- с разделительным Ъ (съёжиться, съесть).', difficulty: 'medium', xpReward: 10, atoms: ['prefix_hard_soft', 'hard_sign']
  },
  // === ОБ- / ОБЕЗ- / ОБЕС- / ОБЪ- ===
  {
    id: 'q10-atom-41', type: 'single', text: 'Вставьте пропущенную букву: обез.яний',
    options: ['обезьяний', 'обезяний'], correctAnswer: ['обезьяний'],
    explanation: 'Ь в корне (обезьяний, обезьяна).', difficulty: 'hard', xpReward: 10, atoms: ['prefix_hard_soft', 'soft_sign']
  },
  {
    id: 'q10-atom-42', type: 'single', text: 'Вставьте пропущенную букву: об.ективный',
    options: ['объективный', 'обективный'], correctAnswer: ['объективный'],
    explanation: 'Разделительный Ъ (объективный, объявить).', difficulty: 'medium', xpReward: 10, atoms: ['prefix_hard_soft', 'hard_sign']
  },
  {
    id: 'q10-atom-43', type: 'single', text: 'Вставьте пропущенную букву: об.явить',
    options: ['объявить', 'обявить'], correctAnswer: ['объявить'],
    explanation: 'Разделительный Ъ (объявить, объезд).', difficulty: 'medium', xpReward: 10, atoms: ['prefix_hard_soft', 'hard_sign']
  },
  {
    id: 'q10-atom-44', type: 'single', text: 'Вставьте пропущенную букву: обе.цветить',
    options: ['обесцветить', 'обезцветить'], correctAnswer: ['обесцветить'],
    explanation: 'ОБЕС- перед глухими ц, п, с, т, к (обесцветить, обеспечить).', difficulty: 'hard', xpReward: 10, atoms: ['prefix_z_s', 'z_s_deaf']
  },
  {
    id: 'q10-atom-45', type: 'single', text: 'Вставьте пропущенную букву: об.ятия',
    options: ['объятия', 'обятия'], correctAnswer: ['объятия'],
    explanation: 'Разделительный Ъ (объятия, объединить).', difficulty: 'medium', xpReward: 10, atoms: ['prefix_hard_soft', 'hard_sign']
  },
  // === НЕ- / НИ- / НЕДО- ===
  {
    id: 'q10-atom-46', type: 'single', text: 'Вставьте пропущенную букву: не.гибаемый',
    options: ['негибаемый', 'нигибаемый'], correctAnswer: ['негибаемый'],
    explanation: 'НЕ- — отрицание (негибаемый, несокрушимый).', difficulty: 'easy', xpReward: 10, atoms: ['prefix_unchangeable']
  },
  {
    id: 'q10-atom-47', type: 'single', text: 'Вставьте пропущенную букву: ни.ходить',
    options: ['нисходить', 'несходить'], correctAnswer: ['нисходить'],
    explanation: 'НИ- — нисходить (сверху вниз).', difficulty: 'medium', xpReward: 10, atoms: ['prefix_unchangeable']
  },
  {
    id: 'q10-atom-48', type: 'single', text: 'Вставьте пропущенную букву: нед.считаться',
    options: ['недосчитаться', 'недосчётаться'], correctAnswer: ['недосчитаться'],
    explanation: 'НЕДО- — недостаток (недосчитаться, недооценить).', difficulty: 'medium', xpReward: 10, atoms: ['prefix_unchangeable']
  },
  {
    id: 'q10-atom-49', type: 'single', text: 'Вставьте пропущенную букву: непр.глядный',
    options: ['неприглядный', 'непроглядный'], correctAnswer: ['неприглядный'],
    explanation: 'НЕПРИ- — неприглядный (непривлекательный).', difficulty: 'medium', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_verif']
  },
  {
    id: 'q10-atom-50', type: 'single', text: 'Вставьте пропущенную букву: непр.емлемый',
    options: ['неприемлемый', 'непреемлемый'], correctAnswer: ['неприемлемый'],
    explanation: 'НЕПРИ- — неприемлемый (недопустимый).', difficulty: 'medium', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_verif']
  },
  // === ЧЕРЕС- / ЧРЕЗ- ===
  {
    id: 'q10-atom-51', type: 'single', text: 'Вставьте пропущенную букву: чере.чур',
    options: ['чересчур', 'чресчур'], correctAnswer: ['чересчур'],
    explanation: 'ЧЕРЕС- (чересчур, чересполосица).', difficulty: 'medium', xpReward: 10, atoms: ['prefix_unchangeable']
  },
  {
    id: 'q10-atom-52', type: 'single', text: 'Вставьте пропущенную букву: чере.полосица',
    options: ['чересполосица', 'чресполосица'], correctAnswer: ['чересполосица'],
    explanation: 'ЧЕРЕС- (чересполосица).', difficulty: 'medium', xpReward: 10, atoms: ['prefix_unchangeable']
  },
  {
    id: 'q10-atom-53', type: 'single', text: 'Вставьте пропущенную букву: чре.вычайное',
    options: ['чрезвычайное', 'черезвычайное'], correctAnswer: ['чрезвычайное'],
    explanation: 'ЧРЕЗ- (чрезвычайный, чрезмерный).', difficulty: 'medium', xpReward: 10, atoms: ['prefix_unchangeable']
  },
  // === ПРА- / ПРО- ===
  {
    id: 'q10-atom-54', type: 'single', text: 'Вставьте пропущенную букву: пр.дедушка',
    options: ['прадедушка', 'продедушка'], correctAnswer: ['прадедушка'],
    explanation: 'ПРА- — родство (прадед, прабабка).', difficulty: 'easy', xpReward: 10, atoms: ['prefix_pra_pro']
  },
  {
    id: 'q10-atom-55', type: 'single', text: 'Вставьте пропущенную букву: прот.тип',
    options: ['прототип', 'пратотип'], correctAnswer: ['прототип'],
    explanation: 'ПРО- — прототип, промежуток.', difficulty: 'easy', xpReward: 10, atoms: ['prefix_pra_pro']
  },
  // === Сложные приставки ===
  {
    id: 'q10-atom-56', type: 'single', text: 'Вставьте пропущенную букву: сверх.зысканный',
    options: ['сверхъзысканный', 'сверхзысканный'], correctAnswer: ['сверхъзысканный'],
    explanation: 'Разделительный Ъ (сверхъестественный, трёхъядерный).', difficulty: 'medium', xpReward: 10, atoms: ['prefix_hard_soft', 'hard_sign', 'unch_compound']
  },
  {
    id: 'q10-atom-57', type: 'single', text: 'Вставьте пропущенную букву: трёх.ядерный',
    options: ['трёхъядерный', 'трёхядерный'], correctAnswer: ['трёхъядерный'],
    explanation: 'Разделительный Ъ (трёхъядерный, двухъязычный).', difficulty: 'easy', xpReward: 10, atoms: ['prefix_hard_soft', 'hard_sign', 'unch_compound']
  },
  {
    id: 'q10-atom-58', type: 'single', text: 'Вставьте пропущенную букву: двух.язычный',
    options: ['двухъязычный', 'двухязычный'], correctAnswer: ['двухъязычный'],
    explanation: 'Разделительный Ъ (двухъязычный, двухъярусный).', difficulty: 'easy', xpReward: 10, atoms: ['prefix_hard_soft', 'hard_sign', 'unch_compound']
  },
  {
    id: 'q10-atom-59', type: 'single', text: 'Вставьте пропущенную букву: фотооб.ектив',
    options: ['фотообъектив', 'фотообектив'], correctAnswer: ['фотообъектив'],
    explanation: 'Разделительный Ъ (фотообъектив, аудиообъектив).', difficulty: 'medium', xpReward: 10, atoms: ['prefix_hard_soft', 'hard_sign', 'unch_compound']
  },
  {
    id: 'q10-atom-60', type: 'single', text: 'Вставьте пропущенную букву: контр.гра',
    options: ['контргра', 'контръгра'], correctAnswer: ['контргра'],
    explanation: 'КОНТР- (контргра, контрбуция).', difficulty: 'easy', xpReward: 10, atoms: ['prefix_unchangeable', 'unch_compound']
  },
  // === Десять дополнительных смешанных ===
  {
    id: 'q10-atom-61', type: 'single', text: 'Вставьте пропущенную букву: пред.стория',
    options: ['предистория', 'предыстория'], correctAnswer: ['предыстория'],
    explanation: 'ПРЕДЫ- (предыстория, предупреждение).', difficulty: 'easy', xpReward: 10, atoms: ['prefix_unchangeable']
  },
  {
    id: 'q10-atom-62', type: 'single', text: 'Вставьте пропущенную букву: меж.языковой',
    options: ['межъязыковой', 'межязыковой'], correctAnswer: ['межъязыковой'],
    explanation: 'МЕЖЪ- с разделительным Ъ (межъязыковой, межинститутский).', difficulty: 'medium', xpReward: 10, atoms: ['prefix_hard_soft', 'hard_sign', 'unch_compound']
  },
  {
    id: 'q10-atom-63', type: 'single', text: 'Вставьте пропущенную букву: зас.лонить',
    options: ['заслонить', 'зазлонить'], correctAnswer: ['заслонить'],
    explanation: 'ЗАС- перед глухими л (заслонить, заскорузлый).', difficulty: 'hard', xpReward: 10, atoms: ['prefix_z_s', 'z_s_deaf']
  },
  {
    id: 'q10-atom-64', type: 'single', text: 'Вставьте пропущенную букву: во.пламениться',
    options: ['воспламениться', 'возпламениться'], correctAnswer: ['воспламениться'],
    explanation: 'ВОС- перед глухими п (воспламениться, воспитать).', difficulty: 'hard', xpReward: 10, atoms: ['prefix_z_s', 'z_s_vz_vs']
  },
  {
    id: 'q10-atom-65', type: 'single', text: 'Вставьте пропущенную букву: от.граться',
    options: ['отыграться', 'отиграться'], correctAnswer: ['отыграться'],
    explanation: 'ОТ- (отыграться, отомстить).', difficulty: 'easy', xpReward: 10, atoms: ['prefix_unchangeable']
  },
  {
    id: 'q10-atom-66', type: 'single', text: 'Вставьте пропущенную букву: на.конец',
    options: ['наконец', 'ноконец'], correctAnswer: ['наконец'],
    explanation: 'НА- (наконец, насчёт).', difficulty: 'easy', xpReward: 10, atoms: ['prefix_unchangeable']
  },
  {
    id: 'q10-atom-67', type: 'single', text: 'Вставьте пропущенную букву: за.интересованный',
    options: ['заинтересованный', 'засинтересованный'], correctAnswer: ['заинтересованный'],
    explanation: 'ЗА- (заинтересованный, закаляющийся).', difficulty: 'easy', xpReward: 10, atoms: ['prefix_unchangeable']
  },
  {
    id: 'q10-atom-68', type: 'single', text: 'Вставьте пропущенную букву: до.бела',
    options: ['добела', 'добьела'], correctAnswer: ['добела'],
    explanation: 'ДО- (добела, дословно, досыта).', difficulty: 'easy', xpReward: 10, atoms: ['prefix_unchangeable']
  },
  {
    id: 'q10-atom-69', type: 'single', text: 'Вставьте пропущенную букву: пр.европейские (интересы)',
    options: ['преевропейские', 'приевропейские'], correctAnswer: ['преевропейские'],
    explanation: 'ПРЕ- (заранее, вперёд).', difficulty: 'medium', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_dict']
  },
  {
    id: 'q10-atom-70', type: 'single', text: 'Вставьте пропущенную букву: пр.студия',
    options: ['пристудия', 'престудия'], correctAnswer: ['престудия'],
    explanation: 'ПРЕ- (престудия, прессалон).', difficulty: 'hard', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_dict']
  },
]
