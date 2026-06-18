// Центральный экспорт теории по заданиям ЕГЭ
// Источники: ФИПИ Навигатор 2025, грамота.ру, umschool.net, maximumtest.ru
// Пополнение: агенты добавляют новые разделы — регистрируйте в AGENTS.md!

import type { TheorySection, TheoryRule } from './task4'
export type { TheorySection, TheoryRule }

import task4Theory from './task4'
import task9Theory from './task9'
import task10Theory from './task10'
import task11Theory from './task11'
import task12Theory from './task12'
import task14Theory from './task14'

export { task4Theory, task9Theory, task10Theory, task11Theory, task12Theory, task14Theory }

const allSections: TheorySection[] = [
  task4Theory,
  task9Theory,
  task10Theory,
  task11Theory,
  task12Theory,
  task14Theory,
]

/** Get all rules for a given EGE task number (e.g. '4', '9', '10') */
export function getRulesByTaskNumber(taskNumber: string): TheoryRule[] {
  const section = allSections.find(s => s.taskNumber === taskNumber)
  return section?.rules ?? []
}

/** Get all sections that have rules for a given task */
export function getSectionByTaskNumber(taskNumber: string): TheorySection | undefined {
  return allSections.find(s => s.taskNumber === taskNumber)
}

// ─────────────────────────────────────────
// План пополнения (приоритеты):
// ─────────────────────────────────────────
// [✓] task4.ts — Ударения (орфоэпия) — ФИПИ Навигатор 2025
// [✓] task9.ts — Корни — umschool.net, грамота.ру
// [✓] task10.ts — Приставки — umschool.net, ФИПИ Навигатор
// [✓] task11.ts — Суффиксы — umschool.net, грамота.ру
// [✓] task12.ts — Окончания глаголов, причастий — maximumtest.ru, umschool.net
// [✓] task14.ts — Слитное/раздельное/дефисное — umschool.net, ФИПИ Навигатор
// [ ] task5.ts — Паронимы (ФИПИ Навигатор)
// [ ] task6.ts — Лексические нормы (gramota.ru/справочники)
// [ ] task7.ts — Фразеологизмы (gramota.ru/справочник по фразеологии)
// [ ] task8.ts — Морфологические нормы (gramota.ru/учебник)
// [ ] task13.ts — Пунктуация в сложном предложении (gramota.ru/справочник по пунктуации)
// [ ] task15.ts — Пунктуация (gramota.ru/справочник по пунктуации)
// [ ] task16.ts — Орфография (gramota.ru/правила)
// [ ] task17-21.ts — Стили речи, типы речи, средства выразительности (gramota.ru/учебник)
// [ ] task22-26.ts — Коммуникативные задачи, текст (gramota.ru/учебник)

// Источники для скрапинга:
// - https://gramota.ru/uchenik/ (учебник: правила от азов до тонкостей)
// - https://gramota.ru/spravochniki/pismovnik (письмовник)
// - https://gramota.ru/spravochniki/punktuaciya (справочник по пунктуации)
// - https://gramota.ru/spravochniki/frazeologiya (справочник по фразеологии)
// - https://gramota.ru/uchenik/uprazhneniya (интерактивные упражнения)
// - https://doc.fipi.ru/navigator-podgotovki/navigator-ege/2025/ (ФИПИ Навигатор)
// - https://umschool.net/library/russkij-yazyk/ (umschool.net теория)
// - https://blog.maximumtest.ru/post/ (maximumtest.ru теория)
