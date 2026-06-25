import { Question } from '../../types'

// Вопросы задания №10 — атомизация приставок (50 вопросов, покрывающих все категории)
export const task10Questions: Question[] = [
  // === ПРЕ- / ПРИ- (словарные) ===
  {
    id: 'q10-atom-1', type: 'text', text: 'Впишите пропущенную букву: пр_исполнен(отваги)',
    explanation: 'ПРЕ- (заранее, вперёд) — словарное слово. Проверить нельзя, запомнить: преисполнен, премудрый, преследование.', difficulty: 'hard', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_dict']
  },
  {
    id: 'q10-atom-2', type: 'text', text: 'Впишите пропущенную букву: пр_мудрый',
    explanation: 'ПРЕ- — словарное слово, нельзя проверить.', difficulty: 'hard', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_dict']
  },
  {
    id: 'q10-atom-3', type: 'text', text: 'Впишите пропущенную букву: пр_следование(врага)',
    explanation: 'ПРЕ- — словарное слово.', difficulty: 'hard', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_dict']
  },
  {
    id: 'q10-atom-4', type: 'text', text: 'Впишите пропущенную букву: пр_мадонна',
    explanation: 'ПРЕ- — словарное слово (от итальянской Примадонны, но в русском устоялось с ПРЕ-).', difficulty: 'hard', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_dict']
  },
  {
    id: 'q10-atom-5', type: 'text', text: 'Впишите пропущенную букву: пр_града',
    explanation: 'ПРЕ- — словарное слово (преграда, препятствие).', difficulty: 'hard', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_dict']
  },
  // === ПРЕ- / ПРИ- (проверяемые) ===
  {
    id: 'q10-atom-6', type: 'text', text: 'Впишите пропущенную букву: пр_обрёл',
    explanation: 'ПРИ- — приближение. Проверочное: обрести.', difficulty: 'medium', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_verif']
  },
  {
    id: 'q10-atom-7', type: 'text', text: 'Впишите пропущенную букву: пр_открыть',
    explanation: 'ПРИ- — приближение, неполнота. Проверочное: открыть.', difficulty: 'medium', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_verif']
  },
  {
    id: 'q10-atom-8', type: 'text', text: 'Впишите пропущенную букву: пр_вязанный(к дереву)',
    explanation: 'ПРИ- — приближение. Проверочное: вязать.', difficulty: 'medium', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_verif']
  },
  {
    id: 'q10-atom-9', type: 'text', text: 'Впишите пропущенную букву: пр_клеить(к картону)',
    explanation: 'ПРИ- — приближение. Проверочное: клеить.', difficulty: 'easy', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_verif']
  },
  {
    id: 'q10-atom-10', type: 'text', text: 'Впишите пропущенную букву: пр_смотреться',
    explanation: 'ПРИ- — приближение. Проверочное: смотреть.', difficulty: 'easy', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_verif']
  },
  // === ПРЕД- / ПОД- ===
  {
    id: 'q10-atom-11', type: 'text', text: 'Впишите пропущенную букву: пр_дзащита',
    explanation: 'ПРЕД- — заранее. Проверочное: защита.', difficulty: 'medium', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_pred']
  },
  {
    id: 'q10-atom-12', type: 'text', text: 'Впишите пропущенную букву: пр_дъюбилейный',
    explanation: 'ПРЕД- — заранее. Разделительный Ъ перед ю, я, е, ё, у.', difficulty: 'medium', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_pred', 'hard_sign']
  },
  {
    id: 'q10-atom-13', type: 'text', text: 'Впишите пропущенную букву: п_дкараулить',
    explanation: 'ПОД- — снизу, тайно. Проверочное: караул.', difficulty: 'medium', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_pred']
  },
  {
    id: 'q10-atom-14', type: 'text', text: 'Впишите пропущенную букву: п_дножие(горы)',
    explanation: 'ПОД- — снизу. Проверочное: нога.', difficulty: 'easy', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_pred']
  },
  {
    id: 'q10-atom-15', type: 'text', text: 'Впишите пропущенную букву: п_дправить',
    explanation: 'ПОД- — немного, слегка. Проверочное: править.', difficulty: 'easy', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_pred']
  },
  // === ВС- / ВЗ- / ВЪ- ===
  {
    id: 'q10-atom-16', type: 'text', text: 'Впишите пропущенную букву: (рожь)',
    explanation: 'ВС- перед глухими к, х, п, с, т, ф, ц, ш, щ (всколоситься, вспыхнуть).', difficulty: 'hard', xpReward: 10, atoms: ['prefix_z_s', 'z_s_vz_vs']
  },
  {
    id: 'q10-atom-17', type: 'text', text: 'Впишите пропущенную букву: вз_браться(на гору)',
    explanation: 'ВЗ- перед звонкими б, д, з, г, ж, в (взобраться, вздремнуть).', difficulty: 'hard', xpReward: 10, atoms: ['prefix_z_s', 'z_s_vz_vs']
  },
  {
    id: 'q10-atom-18', type: 'text', text: 'Впишите пропущенную букву: в_пыхнуть',
    explanation: 'ВС- перед глухими (вспыхнуть, вскипеть).', difficulty: 'hard', xpReward: 10, atoms: ['prefix_z_s', 'z_s_vz_vs']
  },
  {
    id: 'q10-atom-19', type: 'text', text: 'Впишите пропущенную букву: в_езд',
    explanation: 'Разделительный Ъ после приставки, оканчивающейся на согласную, перед ю, я, е, ё, у.', difficulty: 'medium', xpReward: 10, atoms: ['prefix_hard_soft', 'hard_sign']
  },
  {
    id: 'q10-atom-20', type: 'text', text: 'Впишите пропущенную букву: в_езжать',
    explanation: 'Разделительный Ъ (въезжать, съезд).', difficulty: 'medium', xpReward: 10, atoms: ['prefix_hard_soft', 'hard_sign']
  },
  // === РАС- / РАЗ- / РОС- / РОЗ- ===
  {
    id: 'q10-atom-21', type: 'text', text: 'Впишите пропущенную букву: ра_каяние',
    explanation: 'РАС- перед глухими к, ч, п, с, т, ф, ц, ш, щ (раскаяние, расширить).', difficulty: 'hard', xpReward: 10, atoms: ['prefix_ra_ro', 'ra_ro_vowel']
  },
  {
    id: 'q10-atom-22', type: 'text', text: 'Впишите пропущенную букву: раз_брать',
    explanation: 'РАЗ- перед звонкими и гласными (разобрать, разъехаться).', difficulty: 'hard', xpReward: 10, atoms: ['prefix_ra_ro', 'ra_ro_vowel']
  },
  {
    id: 'q10-atom-23', type: 'text', text: 'Впишите пропущенную букву: ро_черк',
    explanation: 'РОС- перед ч, ш, щ (росчерк, россыпь).', difficulty: 'hard', xpReward: 10, atoms: ['prefix_ra_ro', 'ra_ro_vowel']
  },
  {
    id: 'q10-atom-24', type: 'text', text: 'Впишите пропущенную букву: роз_ск(преступника)',
    explanation: 'РОЗ- перед з, с (розыск, рознь).', difficulty: 'hard', xpReward: 10, atoms: ['prefix_ra_ro', 'ra_ro_vowel']
  },
  {
    id: 'q10-atom-25', type: 'text', text: 'Впишите пропущенную букву: ра_ширяться',
    explanation: 'РАС- перед глухими (расширяться, раскаляться).', difficulty: 'hard', xpReward: 10, atoms: ['prefix_ra_ro', 'ra_ro_vowel']
  },
  // === БЕЗ- / БЕС- ===
  {
    id: 'q10-atom-26', type: 'text', text: 'Впишите пропущенную букву: без_скусный',
    explanation: 'БЕЗ- перед звонкими б, в, г, д, з, ж (безыскусный, безграничный).', difficulty: 'medium', xpReward: 10, atoms: ['prefix_z_s', 'z_s_deaf']
  },
  {
    id: 'q10-atom-27', type: 'text', text: 'Впишите пропущенную букву: бес_правный',
    explanation: 'БЕС- перед глухими п, с, т, к, ф, х, ц, ч, ш, щ (бесправный, бесконечный).', difficulty: 'medium', xpReward: 10, atoms: ['prefix_z_s', 'z_s_deaf']
  },
  {
    id: 'q10-atom-28', type: 'text', text: 'Впишите пропущенную букву: бе_вкусный',
    explanation: 'БЕЗ- перед звонкими (безвкусный, безбрежный).', difficulty: 'easy', xpReward: 10, atoms: ['prefix_z_s', 'z_s_deaf']
  },
  {
    id: 'q10-atom-29', type: 'text', text: 'Впишите пропущенную букву: бе_конечный',
    explanation: 'БЕС- перед глухими (бесконечный, бесчестный).', difficulty: 'easy', xpReward: 10, atoms: ['prefix_z_s', 'z_s_deaf']
  },
  {
    id: 'q10-atom-30', type: 'text', text: 'Впишите пропущенную букву: бе_звёздный',
    explanation: 'БЕЗ- перед звонкими (беззвёздный, безбожный).', difficulty: 'easy', xpReward: 10, atoms: ['prefix_z_s', 'z_s_deaf']
  },
  // === ИЗ- / ИС- / ИСПО- ===
  {
    id: 'q10-atom-31', type: 'text', text: 'Впишите пропущенную букву: изра_ходовать',
    explanation: 'ИЗ- перед р (израсходовать, изредка).', difficulty: 'hard', xpReward: 10, atoms: ['prefix_z_s', 'z_s_iz_is']
  },
  {
    id: 'q10-atom-32', type: 'text', text: 'Впишите пропущенную букву: и_подтишка',
    explanation: 'ИС- перед п (исподтишка, исподлобья).', difficulty: 'hard', xpReward: 10, atoms: ['prefix_z_s', 'z_s_iz_is']
  },
  {
    id: 'q10-atom-33', type: 'text', text: 'Впишите пропущенную букву: и_следовать',
    explanation: 'ИС- перед с (исследовать, исчезнуть).', difficulty: 'hard', xpReward: 10, atoms: ['prefix_z_s', 'z_s_iz_is']
  },
  {
    id: 'q10-atom-34', type: 'text', text: 'Впишите пропущенную букву: и_подлобья',
    explanation: 'ИС- перед п (исподлобья, исподволь).', difficulty: 'hard', xpReward: 10, atoms: ['prefix_z_s', 'z_s_iz_is']
  },
  {
    id: 'q10-atom-35', type: 'text', text: 'Впишите пропущенную букву: и_мельчить',
    explanation: 'ИЗ- перед м (измельчить, измучить).', difficulty: 'medium', xpReward: 10, atoms: ['prefix_z_s', 'z_s_iz_is']
  },
  // === С- / СЫ- / СУБ- ===
  {
    id: 'q10-atom-36', type: 'text', text: 'Впишите пропущенную букву: с_знова',
    explanation: 'СЫ- после приставки с перед з, с, г, д, в, б (сызнова, сыграть, съесть).', difficulty: 'hard', xpReward: 10, atoms: ['prefix_y_i']
  },
  {
    id: 'q10-atom-37', type: 'text', text: 'Впишите пропущенную букву: с_грать',
    explanation: 'СЫ- после приставки с перед г (сыграть, съесть).', difficulty: 'hard', xpReward: 10, atoms: ['prefix_y_i']
  },
  {
    id: 'q10-atom-38', type: 'text', text: 'Впишите пропущенную букву: с_едобный',
    explanation: 'СЪ- с разделительным Ъ (съедобный, съесть).', difficulty: 'medium', xpReward: 10, atoms: ['prefix_hard_soft', 'hard_sign']
  },
  {
    id: 'q10-atom-39', type: 'text', text: 'Впишите пропущенную букву: суб_ективный',
    explanation: 'Разделительный Ъ перед е (субъективный, объективный).', difficulty: 'medium', xpReward: 10, atoms: ['prefix_hard_soft', 'hard_sign']
  },
  {
    id: 'q10-atom-40', type: 'text', text: 'Впишите пропущенную букву: с_ёжиться',
    explanation: 'СЪ- с разделительным Ъ (съёжиться, съесть).', difficulty: 'medium', xpReward: 10, atoms: ['prefix_hard_soft', 'hard_sign']
  },
  // === ОБ- / ОБЕЗ- / ОБЕС- / ОБЪ- ===
  {
    id: 'q10-atom-41', type: 'text', text: 'Впишите пропущенную букву: обез_яний',
    explanation: 'Ь в корне (обезьяний, обезьяна).', difficulty: 'hard', xpReward: 10, atoms: ['prefix_hard_soft', 'soft_sign']
  },
  {
    id: 'q10-atom-42', type: 'text', text: 'Впишите пропущенную букву: об_ективный',
    explanation: 'Разделительный Ъ (объективный, объявить).', difficulty: 'medium', xpReward: 10, atoms: ['prefix_hard_soft', 'hard_sign']
  },
  {
    id: 'q10-atom-43', type: 'text', text: 'Впишите пропущенную букву: об_явить',
    explanation: 'Разделительный Ъ (объявить, объезд).', difficulty: 'medium', xpReward: 10, atoms: ['prefix_hard_soft', 'hard_sign']
  },
  {
    id: 'q10-atom-44', type: 'text', text: 'Впишите пропущенную букву: обе_цветить',
    explanation: 'ОБЕС- перед глухими ц, п, с, т, к (обесцветить, обеспечить).', difficulty: 'hard', xpReward: 10, atoms: ['prefix_z_s', 'z_s_deaf']
  },
  {
    id: 'q10-atom-45', type: 'text', text: 'Впишите пропущенную букву: об_ятия',
    explanation: 'Разделительный Ъ (объятия, объединить).', difficulty: 'medium', xpReward: 10, atoms: ['prefix_hard_soft', 'hard_sign']
  },
  // === НЕ- / НИ- / НЕДО- ===
  {
    id: 'q10-atom-46', type: 'text', text: 'Впишите пропущенную букву: не_гибаемый',
    explanation: 'НЕ- — отрицание (негибаемый, несокрушимый).', difficulty: 'easy', xpReward: 10, atoms: ['prefix_unchangeable']
  },
  {
    id: 'q10-atom-47', type: 'text', text: 'Впишите пропущенную букву: ни_ходить',
    explanation: 'НИ- — нисходить (сверху вниз).', difficulty: 'medium', xpReward: 10, atoms: ['prefix_unchangeable']
  },
  {
    id: 'q10-atom-48', type: 'text', text: 'Впишите пропущенную букву: нед_считаться',
    explanation: 'НЕДО- — недостаток (недосчитаться, недооценить).', difficulty: 'medium', xpReward: 10, atoms: ['prefix_unchangeable']
  },
  {
    id: 'q10-atom-49', type: 'text', text: 'Впишите пропущенную букву: непр_глядный',
    explanation: 'НЕПРИ- — неприглядный (непривлекательный).', difficulty: 'medium', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_verif']
  },
  {
    id: 'q10-atom-50', type: 'text', text: 'Впишите пропущенную букву: непр_емлемый',
    explanation: 'НЕПРИ- — неприемлемый (недопустимый).', difficulty: 'medium', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_verif']
  },
  // === ЧЕРЕС- / ЧРЕЗ- ===
  {
    id: 'q10-atom-51', type: 'text', text: 'Впишите пропущенную букву: чере_чур',
    explanation: 'ЧЕРЕС- (чересчур, чересполосица).', difficulty: 'medium', xpReward: 10, atoms: ['prefix_unchangeable']
  },
  {
    id: 'q10-atom-52', type: 'text', text: 'Впишите пропущенную букву: чере_полосица',
    explanation: 'ЧЕРЕС- (чересполосица).', difficulty: 'medium', xpReward: 10, atoms: ['prefix_unchangeable']
  },
  {
    id: 'q10-atom-53', type: 'text', text: 'Впишите пропущенную букву: чре_вычайное',
    explanation: 'ЧРЕЗ- (чрезвычайный, чрезмерный).', difficulty: 'medium', xpReward: 10, atoms: ['prefix_unchangeable']
  },
  // === ПРА- / ПРО- ===
  {
    id: 'q10-atom-54', type: 'text', text: 'Впишите пропущенную букву: пр_дедушка',
    explanation: 'ПРА- — родство (прадед, прабабка).', difficulty: 'easy', xpReward: 10, atoms: ['prefix_pra_pro']
  },
  {
    id: 'q10-atom-55', type: 'text', text: 'Впишите пропущенную букву: прот_тип',
    explanation: 'ПРО- — прототип, промежуток.', difficulty: 'easy', xpReward: 10, atoms: ['prefix_pra_pro']
  },
  // === Сложные приставки ===
  {
    id: 'q10-atom-56', type: 'text', text: 'Впишите пропущенную букву: сверх_зысканный',
    explanation: 'Разделительный Ъ (сверхъестественный, трёхъядерный).', difficulty: 'medium', xpReward: 10, atoms: ['prefix_hard_soft', 'hard_sign', 'unch_compound']
  },
  {
    id: 'q10-atom-57', type: 'text', text: 'Впишите пропущенную букву: трёх_ядерный',
    explanation: 'Разделительный Ъ (трёхъядерный, двухъязычный).', difficulty: 'easy', xpReward: 10, atoms: ['prefix_hard_soft', 'hard_sign', 'unch_compound']
  },
  {
    id: 'q10-atom-58', type: 'text', text: 'Впишите пропущенную букву: двух_язычный',
    explanation: 'Разделительный Ъ (двухъязычный, двухъярусный).', difficulty: 'easy', xpReward: 10, atoms: ['prefix_hard_soft', 'hard_sign', 'unch_compound']
  },
  {
    id: 'q10-atom-59', type: 'text', text: 'Впишите пропущенную букву: фотооб_ектив',
    explanation: 'Разделительный Ъ (фотообъектив, аудиообъектив).', difficulty: 'medium', xpReward: 10, atoms: ['prefix_hard_soft', 'hard_sign', 'unch_compound']
  },
  {
    id: 'q10-atom-60', type: 'text', text: 'Впишите пропущенную букву: контр_гра',
    explanation: 'КОНТР- (контргра, контрбуция).', difficulty: 'easy', xpReward: 10, atoms: ['prefix_unchangeable', 'unch_compound']
  },
  // === Десять дополнительных смешанных ===
  {
    id: 'q10-atom-61', type: 'text', text: 'Впишите пропущенную букву: пред_стория',
    explanation: 'ПРЕДЫ- (предыстория, предупреждение).', difficulty: 'easy', xpReward: 10, atoms: ['prefix_unchangeable']
  },
  {
    id: 'q10-atom-62', type: 'text', text: 'Впишите пропущенную букву: меж_языковой',
    explanation: 'МЕЖЪ- с разделительным Ъ (межъязыковой, межинститутский).', difficulty: 'medium', xpReward: 10, atoms: ['prefix_hard_soft', 'hard_sign', 'unch_compound']
  },
  {
    id: 'q10-atom-63', type: 'text', text: 'Впишите пропущенную букву: зас_лонить',
    explanation: 'ЗАС- перед глухими л (заслонить, заскорузлый).', difficulty: 'hard', xpReward: 10, atoms: ['prefix_z_s', 'z_s_deaf']
  },
  {
    id: 'q10-atom-64', type: 'text', text: 'Впишите пропущенную букву: во_пламениться',
    explanation: 'ВОС- перед глухими п (воспламениться, воспитать).', difficulty: 'hard', xpReward: 10, atoms: ['prefix_z_s', 'z_s_vz_vs']
  },
  {
    id: 'q10-atom-65', type: 'text', text: 'Впишите пропущенную букву: от_граться',
    explanation: 'ОТ- (отыграться, отомстить).', difficulty: 'easy', xpReward: 10, atoms: ['prefix_unchangeable']
  },
  {
    id: 'q10-atom-66', type: 'text', text: 'Впишите пропущенную букву: на_конец',
    explanation: 'НА- (наконец, насчёт).', difficulty: 'easy', xpReward: 10, atoms: ['prefix_unchangeable']
  },
  {
    id: 'q10-atom-67', type: 'text', text: 'Впишите пропущенную букву: за_интересованный',
    explanation: 'ЗА- (заинтересованный, закаляющийся).', difficulty: 'easy', xpReward: 10, atoms: ['prefix_unchangeable']
  },
  {
    id: 'q10-atom-68', type: 'text', text: 'Впишите пропущенную букву: до_бела',
    explanation: 'ДО- (добела, дословно, досыта).', difficulty: 'easy', xpReward: 10, atoms: ['prefix_unchangeable']
  },
  {
    id: 'q10-atom-69', type: 'text', text: 'Впишите пропущенную букву: пр_европейские(интересы)',
    explanation: 'ПРЕ- (заранее, вперёд).', difficulty: 'medium', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_dict']
  },
  {
    id: 'q10-atom-70', type: 'text', text: 'Впишите пропущенную букву: пр_студия',
    explanation: 'ПРЕ- (престудия, прессалон).', difficulty: 'hard', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_dict']
  },
]
