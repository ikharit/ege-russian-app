import { Question } from '../../types'

// Вопросы задания №10 — атомизация приставок (50 вопросов, покрывающих все категории)
export const task10Questions: Question[] = [
  // === ПРЕ- / ПРИ- (словарные) ===
    {
    id: 'q10-atom-1', type: 'text', text: 'Впишите пропущенную букву: пр_исполнен (отваги)',
    correctAnswer: ['е'],
    explanation: 'ПРЕ- = очень (очень исполнен отвагой). Словарное слово, нельзя проверить по корню. Запомнить: преисполнен, премудрый, преследование.', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_dict']
  },
    {
    id: 'q10-atom-2', type: 'text', text: 'Впишите пропущенную букву: пр_мудрый',
    correctAnswer: ['е'],
    explanation: 'ПРЕ- = очень (как в прекрасный, превысокий). Пре- = очень + мудрый. Нельзя проверить по однокоренному слову — это словарное слово.', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_dict']
  },
    {
    id: 'q10-atom-3', type: 'text', text: 'Впишите пропущенную букву: пр_следование (врага)',
    correctAnswer: ['е'],
    explanation: 'ПРЕ- = перед (идти вперёд, быть впереди). Словарное слово, нельзя проверить по корню. Запомнить: преследование, президент, пребывать.', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_dict']
  },
    {
    id: 'q10-atom-4', type: 'text', text: 'Впишите пропущенную букву: пр_мадонна',
    correctAnswer: ['е'],
    explanation: 'ПРЕ- — словарное слово (от итальянской Примадонны, но в русском устоялось с ПРЕ-).', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_dict']
  },
    {
    id: 'q10-atom-5', type: 'text', text: 'Впишите пропущенную букву: пр_града',
    correctAnswer: ['е'],
    explanation: 'ПРЕ- = ПЕРЕ- (как перегородить, перекрыть путь). Преграда — препятствие, заграждение. Словарное слово, нельзя проверить по корню.', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_dict']
  },
  // === ПРЕ- / ПРИ- (проверяемые) ===
    {
    id: 'q10-atom-6', type: 'text', text: 'Впишите пропущенную букву: пр_обрёл',
    correctAnswer: ['и'],
    explanation: 'ПРИ- — приближение. Проверочное: обрести.', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_verif']
  },
    {
    id: 'q10-atom-7', type: 'text', text: 'Впишите пропущенную букву: пр_открыть',
    correctAnswer: ['и'],
    explanation: 'ПРИ- — приближение, неполнота. Проверочное: открыть.', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_verif']
  },
    {
    id: 'q10-atom-8', type: 'text', text: 'Впишите пропущенную букву: пр_вязанный (к дереву)',
    correctAnswer: ['и'],
    explanation: 'ПРИ- — приближение. Проверочное: вязать.', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_verif']
  },
    {
    id: 'q10-atom-9', type: 'text', text: 'Впишите пропущенную букву: пр_клеить (к картону)',
    correctAnswer: ['и'],
    explanation: 'ПРИ- — приближение. Проверочное: клеить.', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_verif']
  },
    {
    id: 'q10-atom-10', type: 'text', text: 'Впишите пропущенную букву: пр_смотреться',
    correctAnswer: ['и'],
    explanation: 'ПРИ- — приближение. Проверочное: смотреть.', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_verif']
  },
  // === ПРЕД- / ПОД- ===
    {
    id: 'q10-atom-11', type: 'text', text: 'Впишите пропущенную букву: пр_дзащита',
    correctAnswer: ['е'],
    explanation: 'ПРЕД- — заранее. Проверочное: защита.', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_pred']
  },
    {
    id: 'q10-atom-12', type: 'text', text: 'Впишите пропущенную букву: пр_дъюбилейный',
    correctAnswer: ['е'],
    explanation: 'ПРЕД- — заранее. Разделительный Ъ перед ю, я, е, ё, у.', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_pred', 'hard_sign']
  },
    {
    id: 'q10-atom-13', type: 'text', text: 'Впишите пропущенную букву: п_дкараулить',
    correctAnswer: ['о'],
    explanation: 'ПОД- — снизу, тайно. Проверочное: караул.', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_pred']
  },
    {
    id: 'q10-atom-14', type: 'text', text: 'Впишите пропущенную букву: п_дножие (горы)',
    correctAnswer: ['о'],
    explanation: 'ПОД- — снизу. Проверочное: нога.', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_pred']
  },
    {
    id: 'q10-atom-15', type: 'text', text: 'Впишите пропущенную букву: п_дправить',
    correctAnswer: ['о'],
    explanation: 'ПОД- — немного, слегка. Проверочное: править.', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_pred']
  },
  // === ВС- / ВЗ- / ВЪ- ===
    {
    id: 'q10-atom-16', type: 'text', text: 'Впишите пропущенную букву: (рожь) в_колосилась',
    correctAnswer: ['л'],
    explanation: 'ВС- перед глухими к, х, п, с, т, ф, ц, ш, щ (всколоситься, вспыхнуть).', xpReward: 10, atoms: ['prefix_z_s', 'z_s_vz_vs']
  },
    {
    id: 'q10-atom-17', type: 'text', text: 'Впишите пропущенную букву: вз_браться (на гору)',
    correctAnswer: ['о'],
    explanation: 'ВЗ- перед звонкими б, д, з, г, ж, в (взобраться, вздремнуть).', xpReward: 10, atoms: ['prefix_z_s', 'z_s_vz_vs']
  },
    {
    id: 'q10-atom-18', type: 'text', text: 'Впишите пропущенную букву: в_пыхнуть',
    correctAnswer: ['с'],
    explanation: 'ВС- перед глухими (вспыхнуть, вскипеть).', xpReward: 10, atoms: ['prefix_z_s', 'z_s_vz_vs']
  },
    {
    id: 'q10-atom-19', type: 'text', text: 'Впишите пропущенную букву: в_езд',
    correctAnswer: ['ъ'],
    explanation: 'Разделительный Ъ после приставки, оканчивающейся на согласную, перед ю, я, е, ё, у.', xpReward: 10, atoms: ['prefix_hard_soft', 'hard_sign']
  },
    {
    id: 'q10-atom-20', type: 'text', text: 'Впишите пропущенную букву: в_езжать',
    correctAnswer: ['ъ'],
    explanation: 'Разделительный Ъ (въезжать, съезд).', xpReward: 10, atoms: ['prefix_hard_soft', 'hard_sign']
  },
  // === РАС- / РАЗ- / РОС- / РОЗ- ===
    {
    id: 'q10-atom-21', type: 'text', text: 'Впишите пропущенную букву: ра_каяние',
    correctAnswer: ['с'],
    explanation: 'РАС- перед глухими к, ч, п, с, т, ф, ц, ш, щ (раскаяние, расширить).', xpReward: 10, atoms: ['prefix_ra_ro', 'ra_ro_vowel']
  },
    {
    id: 'q10-atom-22', type: 'text', text: 'Впишите пропущенную букву: раз_брать',
    correctAnswer: ['о'],
    explanation: 'РАЗ- перед звонкими и гласными (разобрать, разъехаться).', xpReward: 10, atoms: ['prefix_ra_ro', 'ra_ro_vowel']
  },
    {
    id: 'q10-atom-23', type: 'text', text: 'Впишите пропущенную букву: ро_черк',
    correctAnswer: ['с'],
    explanation: 'РОС- перед ч, ш, щ (росчерк, россыпь).', xpReward: 10, atoms: ['prefix_ra_ro', 'ra_ro_vowel']
  },
    {
    id: 'q10-atom-24', type: 'text', text: 'Впишите пропущенную букву: роз_ск (преступника)',
    correctAnswer: ['ы'],
    explanation: 'РОЗ- перед з, с (розыск, рознь).', xpReward: 10, atoms: ['prefix_ra_ro', 'ra_ro_vowel']
  },
    {
    id: 'q10-atom-25', type: 'text', text: 'Впишите пропущенную букву: ра_ширяться',
    correctAnswer: ['с'],
    explanation: 'РАС- перед глухими (расширяться, раскаляться).', xpReward: 10, atoms: ['prefix_ra_ro', 'ra_ro_vowel']
  },
  // === БЕЗ- / БЕС- ===
    {
    id: 'q10-atom-26', type: 'text', text: 'Впишите пропущенную букву: без_скусный',
    correctAnswer: ['ы'],
    explanation: 'БЕЗ- перед звонкими б, в, г, д, з, ж (безыскусный, безграничный).', xpReward: 10, atoms: ['prefix_z_s', 'z_s_deaf']
  },
    {
    id: 'q10-atom-27', type: 'text', text: 'Впишите пропущенную букву: бес_правный',
    correctAnswer: ['п'],
    explanation: 'БЕС- перед глухими п, с, т, к, ф, х, ц, ч, ш, щ (бесправный, бесконечный).', xpReward: 10, atoms: ['prefix_z_s', 'z_s_deaf']
  },
    {
    id: 'q10-atom-28', type: 'text', text: 'Впишите пропущенную букву: бе_вкусный',
    correctAnswer: ['з'],
    explanation: 'БЕЗ- перед звонкими (безвкусный, безбрежный).', xpReward: 10, atoms: ['prefix_z_s', 'z_s_deaf']
  },
    {
    id: 'q10-atom-29', type: 'text', text: 'Впишите пропущенную букву: бе_конечный',
    correctAnswer: ['с'],
    explanation: 'БЕС- перед глухими (бесконечный, бесчестный).', xpReward: 10, atoms: ['prefix_z_s', 'z_s_deaf']
  },
    {
    id: 'q10-atom-30', type: 'text', text: 'Впишите пропущенную букву: бе_звёздный',
    correctAnswer: ['з'],
    explanation: 'БЕЗ- перед звонкими (беззвёздный, безбожный).', xpReward: 10, atoms: ['prefix_z_s', 'z_s_deaf']
  },
  // === ИЗ- / ИС- / ИСПО- ===
    {
    id: 'q10-atom-31', type: 'text', text: 'Впишите пропущенную букву: изра_ходовать',
    correctAnswer: ['с'],
    explanation: 'ИЗ- перед р (израсходовать, изредка).', xpReward: 10, atoms: ['prefix_z_s', 'z_s_iz_is']
  },
    {
    id: 'q10-atom-32', type: 'text', text: 'Впишите пропущенную букву: и_подтишка',
    correctAnswer: ['с'],
    explanation: 'ИС- перед п (исподтишка, исподлобья).', xpReward: 10, atoms: ['prefix_z_s', 'z_s_iz_is']
  },
    {
    id: 'q10-atom-33', type: 'text', text: 'Впишите пропущенную букву: и_следовать',
    correctAnswer: ['с'],
    explanation: 'ИС- перед с (исследовать, исчезнуть).', xpReward: 10, atoms: ['prefix_z_s', 'z_s_iz_is']
  },
    {
    id: 'q10-atom-34', type: 'text', text: 'Впишите пропущенную букву: и_подлобья',
    correctAnswer: ['с'],
    explanation: 'ИС- перед п (исподлобья, исподволь).', xpReward: 10, atoms: ['prefix_z_s', 'z_s_iz_is']
  },
    {
    id: 'q10-atom-35', type: 'text', text: 'Впишите пропущенную букву: и_мельчить',
    correctAnswer: ['з'],
    explanation: 'ИЗ- перед м (измельчить, измучить).', xpReward: 10, atoms: ['prefix_z_s', 'z_s_iz_is']
  },
  // === С- / СЫ- / СУБ- ===
    {
    id: 'q10-atom-36', type: 'text', text: 'Впишите пропущенную букву: с_знова',
    correctAnswer: ['ы'],
    explanation: 'СЫ- после приставки с перед з, с, г, д, в, б (сызнова, сыграть, съесть).', xpReward: 10, atoms: ['prefix_y_i']
  },
    {
    id: 'q10-atom-37', type: 'text', text: 'Впишите пропущенную букву: с_грать',
    correctAnswer: ['ы'],
    explanation: 'СЫ- после приставки с перед г (сыграть, съесть).', xpReward: 10, atoms: ['prefix_y_i']
  },
    {
    id: 'q10-atom-38', type: 'text', text: 'Впишите пропущенную букву: с_едобный',
    correctAnswer: ['ъ'],
    explanation: 'СЪ- с разделительным Ъ (съедобный, съесть).', xpReward: 10, atoms: ['prefix_hard_soft', 'hard_sign']
  },
    {
    id: 'q10-atom-39', type: 'text', text: 'Впишите пропущенную букву: суб_ективный',
    correctAnswer: ['ъ'],
    explanation: 'Разделительный Ъ перед е (субъективный, объективный).', xpReward: 10, atoms: ['prefix_hard_soft', 'hard_sign']
  },
    {
    id: 'q10-atom-40', type: 'text', text: 'Впишите пропущенную букву: с_ёжиться',
    correctAnswer: ['ъ'],
    explanation: 'СЪ- с разделительным Ъ (съёжиться, съесть).', xpReward: 10, atoms: ['prefix_hard_soft', 'hard_sign']
  },
  // === ОБ- / ОБЕЗ- / ОБЕС- / ОБЪ- ===
    {
    id: 'q10-atom-41', type: 'text', text: 'Впишите пропущенную букву: обез_яний',
    correctAnswer: ['ь'],
    explanation: 'Ь в корне (обезьяний, обезьяна).', xpReward: 10, atoms: ['prefix_hard_soft', 'soft_sign']
  },
    {
    id: 'q10-atom-42', type: 'text', text: 'Впишите пропущенную букву: об_ективный',
    correctAnswer: ['ъ'],
    explanation: 'Разделительный Ъ (объективный, объявить).', xpReward: 10, atoms: ['prefix_hard_soft', 'hard_sign']
  },
    {
    id: 'q10-atom-43', type: 'text', text: 'Впишите пропущенную букву: об_явить',
    correctAnswer: ['ъ'],
    explanation: 'Разделительный Ъ (объявить, объезд).', xpReward: 10, atoms: ['prefix_hard_soft', 'hard_sign']
  },
    {
    id: 'q10-atom-44', type: 'text', text: 'Впишите пропущенную букву: обе_цветить',
    correctAnswer: ['с'],
    explanation: 'ОБЕС- перед глухими ц, п, с, т, к (обесцветить, обеспечить).', xpReward: 10, atoms: ['prefix_z_s', 'z_s_deaf']
  },
    {
    id: 'q10-atom-45', type: 'text', text: 'Впишите пропущенную букву: об_ятия',
    correctAnswer: ['ъ'],
    explanation: 'Разделительный Ъ (объятия, объединить).', xpReward: 10, atoms: ['prefix_hard_soft', 'hard_sign']
  },
  // === НЕ- / НИ- / НЕДО- ===
    {
    id: 'q10-atom-46', type: 'text', text: 'Впишите пропущенную букву: не_гибаемый',
    correctAnswer: ['г'],
    explanation: 'НЕ- — отрицание (негибаемый, несокрушимый).', xpReward: 10, atoms: ['prefix_unchangeable']
  },
    {
    id: 'q10-atom-47', type: 'text', text: 'Впишите пропущенную букву: ни_ходить',
    correctAnswer: ['с'],
    explanation: 'НИ- — нисходить (сверху вниз).', xpReward: 10, atoms: ['prefix_unchangeable']
  },
    {
    id: 'q10-atom-48', type: 'text', text: 'Впишите пропущенную букву: нед_считаться',
    correctAnswer: ['о'],
    explanation: 'НЕДО- — недостаток (недосчитаться, недооценить).', xpReward: 10, atoms: ['prefix_unchangeable']
  },
    {
    id: 'q10-atom-49', type: 'text', text: 'Впишите пропущенную букву: непр_глядный',
    correctAnswer: ['и'],
    explanation: 'НЕПРИ- — неприглядный (непривлекательный).', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_verif']
  },
    {
    id: 'q10-atom-50', type: 'text', text: 'Впишите пропущенную букву: непр_емлемый',
    correctAnswer: ['и'],
    explanation: 'НЕПРИ- — неприемлемый (недопустимый).', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_verif']
  },
  // === ЧЕРЕС- / ЧРЕЗ- ===
    {
    id: 'q10-atom-51', type: 'text', text: 'Впишите пропущенную букву: чере_чур',
    correctAnswer: ['с'],
    explanation: 'ЧЕРЕС- (чересчур, чересполосица).', xpReward: 10, atoms: ['prefix_unchangeable']
  },
    {
    id: 'q10-atom-52', type: 'text', text: 'Впишите пропущенную букву: чере_полосица',
    correctAnswer: ['с'],
    explanation: 'ЧЕРЕС- (чересполосица).', xpReward: 10, atoms: ['prefix_unchangeable']
  },
    {
    id: 'q10-atom-53', type: 'text', text: 'Впишите пропущенную букву: чре_вычайное',
    correctAnswer: ['з'],
    explanation: 'ЧРЕЗ- (чрезвычайный, чрезмерный).', xpReward: 10, atoms: ['prefix_unchangeable']
  },
  // === ПРА- / ПРО- ===
    {
    id: 'q10-atom-54', type: 'text', text: 'Впишите пропущенную букву: пр_дедушка',
    correctAnswer: ['а'],
    explanation: 'ПРА- — родство (прадед, прабабка).', xpReward: 10, atoms: ['prefix_pra_pro']
  },
    {
    id: 'q10-atom-55', type: 'text', text: 'Впишите пропущенную букву: прот_тип',
    correctAnswer: ['о'],
    explanation: 'ПРО- — прототип, промежуток.', xpReward: 10, atoms: ['prefix_pra_pro']
  },
  // === Сложные приставки ===
    {
    id: 'q10-atom-56', type: 'text', text: 'Впишите пропущенную букву: сверх_зысканный',
    correctAnswer: ['ъ'],
    explanation: 'Разделительный Ъ (сверхъестественный, трёхъядерный).', xpReward: 10, atoms: ['prefix_hard_soft', 'hard_sign', 'unch_compound']
  },
    {
    id: 'q10-atom-57', type: 'text', text: 'Впишите пропущенную букву: трёх_ядерный',
    correctAnswer: ['ъ'],
    explanation: 'Разделительный Ъ (трёхъядерный, двухъязычный).', xpReward: 10, atoms: ['prefix_hard_soft', 'hard_sign', 'unch_compound']
  },
    {
    id: 'q10-atom-58', type: 'text', text: 'Впишите пропущенную букву: двух_язычный',
    correctAnswer: ['ъ'],
    explanation: 'Разделительный Ъ (двухъязычный, двухъярусный).', xpReward: 10, atoms: ['prefix_hard_soft', 'hard_sign', 'unch_compound']
  },
    {
    id: 'q10-atom-59', type: 'text', text: 'Впишите пропущенную букву: фотооб_ектив',
    correctAnswer: ['ъ'],
    explanation: 'Разделительный Ъ (фотообъектив, аудиообъектив).', xpReward: 10, atoms: ['prefix_hard_soft', 'hard_sign', 'unch_compound']
  },
    {
    id: 'q10-atom-60', type: 'text', text: 'Впишите пропущенную букву: контр_гра',
    correctAnswer: ['г'],
    explanation: 'КОНТР- (контргра, контрбуция).', xpReward: 10, atoms: ['prefix_unchangeable', 'unch_compound']
  },
  // === Десять дополнительных смешанных ===
    {
    id: 'q10-atom-61', type: 'text', text: 'Впишите пропущенную букву: пред_стория',
    correctAnswer: ['ы'],
    explanation: 'ПРЕДЫ- (предыстория, предупреждение).', xpReward: 10, atoms: ['prefix_unchangeable']
  },
    {
    id: 'q10-atom-62', type: 'text', text: 'Впишите пропущенную букву: меж_языковой',
    correctAnswer: ['ъ'],
    explanation: 'МЕЖЪ- с разделительным Ъ (межъязыковой, межинститутский).', xpReward: 10, atoms: ['prefix_hard_soft', 'hard_sign', 'unch_compound']
  },
    {
    id: 'q10-atom-63', type: 'text', text: 'Впишите пропущенную букву: зас_лонить',
    correctAnswer: ['л'],
    explanation: 'ЗАС- перед глухими л (заслонить, заскорузлый).', xpReward: 10, atoms: ['prefix_z_s', 'z_s_deaf']
  },
    {
    id: 'q10-atom-64', type: 'text', text: 'Впишите пропущенную букву: во_пламениться',
    correctAnswer: ['с'],
    explanation: 'ВОС- перед глухими п (воспламениться, воспитать).', xpReward: 10, atoms: ['prefix_z_s', 'z_s_vz_vs']
  },
    {
    id: 'q10-atom-65', type: 'text', text: 'Впишите пропущенную букву: от_граться',
    correctAnswer: ['ы'],
    explanation: 'ОТ- (отыграться, отомстить).', xpReward: 10, atoms: ['prefix_unchangeable']
  },
    {
    id: 'q10-atom-66', type: 'text', text: 'Впишите пропущенную букву: на_конец',
    correctAnswer: ['к'],
    explanation: 'НА- (наконец, насчёт).', xpReward: 10, atoms: ['prefix_unchangeable']
  },
    {
    id: 'q10-atom-67', type: 'text', text: 'Впишите пропущенную букву: за_интересованный',
    correctAnswer: ['и'],
    explanation: 'ЗА- (заинтересованный, закаляющийся).', xpReward: 10, atoms: ['prefix_unchangeable']
  },
    {
    id: 'q10-atom-68', type: 'text', text: 'Впишите пропущенную букву: до_бела',
    correctAnswer: ['б'],
    explanation: 'ДО- (добела, дословно, досыта).', xpReward: 10, atoms: ['prefix_unchangeable']
  },
  {
    id: 'q10-atom-69', type: 'text', text: 'Впишите пропущенную букву: пр_европейский (кандидат)',
    correctAnswer: ['о'],
    explanation: 'ПРО- = занимающий сторону чего-либо. Проевропейский — стоящий на стороне Европы. Проверьте: проамериканский, прояпонский.', xpReward: 10, atoms: ['prefix_pre_pri', 'pre_pri_dict']
  },
]
