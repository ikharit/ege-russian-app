import { Section } from '../../types'
import { task5DooshinQuestions } from '../questions/task5_dooshin'
import { task6DooshinQuestions } from '../questions/task6_dooshin'
import { task9DooshinQuestions } from '../questions/task9_dooshin'
import { task10DooshinQuestions } from '../questions/task10_dooshin'
import { task11DooshinQuestions } from '../questions/task11_dooshin'
import { task12DooshinQuestions } from '../questions/task12_dooshin'
import { task14DooshinQuestions } from '../questions/task14_dooshin'
import { task15DooshinQuestions } from '../questions/task15_dooshin'
import { task16DooshinQuestions } from '../questions/task16_dooshin'
import { task20DooshinQuestions } from '../questions/task20_dooshin'

export const task5DooshinSections: Section[] = [
  {
    id: 'section-task5-dooshin',
    courseId: 'ege-russian-2025',
    title: 'Задание 5. Паронимы (Дощинский)',
    subtitle: 'Паронимы: усложнённые случаи',
    order: 5,
    icon: 'BookOpen',
    color: '#58cc02',
    lessons: [
      {
        id: 'lesson-task5-d-d1',
        sectionId: 'section-task5-dooshin',
        title: 'Задание 5. Дощинский (1–30)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: [],
        questions: task5DooshinQuestions.slice(0, 30)
      },
      {
        id: 'lesson-task5-d-d2',
        sectionId: 'section-task5-dooshin',
        title: 'Задание 5. Дощинский (31–60)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-task5-d-d1'],
        questions: task5DooshinQuestions.slice(30, 60)
      },
      {
        id: 'lesson-task5-d-d3',
        sectionId: 'section-task5-dooshin',
        title: 'Задание 5. Дощинский (61–90)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-task5-d-d2'],
        questions: task5DooshinQuestions.slice(60, 90)
      },
      {
        id: 'lesson-task5-d-d4',
        sectionId: 'section-task5-dooshin',
        title: 'Задание 5. Дощинский (91–120)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-task5-d-d3'],
        questions: task5DooshinQuestions.slice(90, 120)
      },
      {
        id: 'lesson-task5-d-d5',
        sectionId: 'section-task5-dooshin',
        title: 'Задание 5. Дощинский (121–140)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-task5-d-d4'],
        questions: task5DooshinQuestions.slice(120, 140)
      }
    ]
  }
]


export const task6DooshinSections: Section[] = [
  {
    id: 'section-task6-dooshin',
    courseId: 'ege-russian-2025',
    title: 'Задание 6. Лексика (Дощинский)',
    subtitle: 'Лексические нормы: устаревшие, канцеляризмы',
    order: 6,
    icon: 'BookOpen',
    color: '#58cc02',
    lessons: [
      {
        id: 'lesson-task6-d-d1',
        sectionId: 'section-task6-dooshin',
        title: 'Задание 6. Дощинский (1–30)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: [],
        questions: task6DooshinQuestions.slice(0, 30)
      },
      {
        id: 'lesson-task6-d-d2',
        sectionId: 'section-task6-dooshin',
        title: 'Задание 6. Дощинский (31–60)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-task6-d-d1'],
        questions: task6DooshinQuestions.slice(30, 60)
      },
      {
        id: 'lesson-task6-d-d3',
        sectionId: 'section-task6-dooshin',
        title: 'Задание 6. Дощинский (61–90)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-task6-d-d2'],
        questions: task6DooshinQuestions.slice(60, 90)
      },
      {
        id: 'lesson-task6-d-d4',
        sectionId: 'section-task6-dooshin',
        title: 'Задание 6. Дощинский (91–120)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-task6-d-d3'],
        questions: task6DooshinQuestions.slice(90, 120)
      },
      {
        id: 'lesson-task6-d-d5',
        sectionId: 'section-task6-dooshin',
        title: 'Задание 6. Дощинский (121–132)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-task6-d-d4'],
        questions: task6DooshinQuestions.slice(120, 132)
      }
    ]
  }
]


export const task9DooshinSections: Section[] = [
  {
    id: 'section-orth-9-dooshin',
    courseId: 'ege-russian-2025',
    title: 'Задание 9. Корни (Дощинский)',
    subtitle: 'Правописание в корне: Дощинский 2026',
    order: 9,
    icon: 'BookOpen',
    color: '#58cc02',
    lessons: [
      {
        id: 'lesson-orth-9-d-d1',
        sectionId: 'section-orth-9-dooshin',
        title: 'Задание 9. Дощинский (1–30)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: [],
        questions: task9DooshinQuestions.slice(0, 30)
      },
      {
        id: 'lesson-orth-9-d-d2',
        sectionId: 'section-orth-9-dooshin',
        title: 'Задание 9. Дощинский (31–60)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-9-d-d1'],
        questions: task9DooshinQuestions.slice(30, 60)
      },
      {
        id: 'lesson-orth-9-d-d3',
        sectionId: 'section-orth-9-dooshin',
        title: 'Задание 9. Дощинский (61–90)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-9-d-d2'],
        questions: task9DooshinQuestions.slice(60, 90)
      },
      {
        id: 'lesson-orth-9-d-d4',
        sectionId: 'section-orth-9-dooshin',
        title: 'Задание 9. Дощинский (91–120)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-9-d-d3'],
        questions: task9DooshinQuestions.slice(90, 120)
      },
      {
        id: 'lesson-orth-9-d-d5',
        sectionId: 'section-orth-9-dooshin',
        title: 'Задание 9. Дощинский (121–150)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-9-d-d4'],
        questions: task9DooshinQuestions.slice(120, 150)
      },
      {
        id: 'lesson-orth-9-d-d6',
        sectionId: 'section-orth-9-dooshin',
        title: 'Задание 9. Дощинский (151–180)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-9-d-d5'],
        questions: task9DooshinQuestions.slice(150, 180)
      },
      {
        id: 'lesson-orth-9-d-d7',
        sectionId: 'section-orth-9-dooshin',
        title: 'Задание 9. Дощинский (181–210)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-9-d-d6'],
        questions: task9DooshinQuestions.slice(180, 210)
      },
      {
        id: 'lesson-orth-9-d-d8',
        sectionId: 'section-orth-9-dooshin',
        title: 'Задание 9. Дощинский (211–240)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-9-d-d7'],
        questions: task9DooshinQuestions.slice(210, 240)
      },
      {
        id: 'lesson-orth-9-d-d9',
        sectionId: 'section-orth-9-dooshin',
        title: 'Задание 9. Дощинский (241–270)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-9-d-d8'],
        questions: task9DooshinQuestions.slice(240, 270)
      },
      {
        id: 'lesson-orth-9-d-d10',
        sectionId: 'section-orth-9-dooshin',
        title: 'Задание 9. Дощинский (271–300)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-9-d-d9'],
        questions: task9DooshinQuestions.slice(270, 300)
      },
      {
        id: 'lesson-orth-9-d-d11',
        sectionId: 'section-orth-9-dooshin',
        title: 'Задание 9. Дощинский (301–330)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-9-d-d10'],
        questions: task9DooshinQuestions.slice(300, 330)
      },
      {
        id: 'lesson-orth-9-d-d12',
        sectionId: 'section-orth-9-dooshin',
        title: 'Задание 9. Дощинский (331–360)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-9-d-d11'],
        questions: task9DooshinQuestions.slice(330, 360)
      },
      {
        id: 'lesson-orth-9-d-d13',
        sectionId: 'section-orth-9-dooshin',
        title: 'Задание 9. Дощинский (361–390)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-9-d-d12'],
        questions: task9DooshinQuestions.slice(360, 390)
      },
      {
        id: 'lesson-orth-9-d-d14',
        sectionId: 'section-orth-9-dooshin',
        title: 'Задание 9. Дощинский (391–420)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-9-d-d13'],
        questions: task9DooshinQuestions.slice(390, 420)
      },
      {
        id: 'lesson-orth-9-d-d15',
        sectionId: 'section-orth-9-dooshin',
        title: 'Задание 9. Дощинский (421–450)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-9-d-d14'],
        questions: task9DooshinQuestions.slice(420, 450)
      },
      {
        id: 'lesson-orth-9-d-d16',
        sectionId: 'section-orth-9-dooshin',
        title: 'Задание 9. Дощинский (451–480)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-9-d-d15'],
        questions: task9DooshinQuestions.slice(450, 480)
      },
      {
        id: 'lesson-orth-9-d-d17',
        sectionId: 'section-orth-9-dooshin',
        title: 'Задание 9. Дощинский (481–510)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-9-d-d16'],
        questions: task9DooshinQuestions.slice(480, 510)
      },
      {
        id: 'lesson-orth-9-d-d18',
        sectionId: 'section-orth-9-dooshin',
        title: 'Задание 9. Дощинский (511–540)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-9-d-d17'],
        questions: task9DooshinQuestions.slice(510, 540)
      },
      {
        id: 'lesson-orth-9-d-d19',
        sectionId: 'section-orth-9-dooshin',
        title: 'Задание 9. Дощинский (541–570)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-9-d-d18'],
        questions: task9DooshinQuestions.slice(540, 570)
      },
      {
        id: 'lesson-orth-9-d-d20',
        sectionId: 'section-orth-9-dooshin',
        title: 'Задание 9. Дощинский (571–600)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-9-d-d19'],
        questions: task9DooshinQuestions.slice(570, 600)
      },
      {
        id: 'lesson-orth-9-d-d21',
        sectionId: 'section-orth-9-dooshin',
        title: 'Задание 9. Дощинский (601–630)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-9-d-d20'],
        questions: task9DooshinQuestions.slice(600, 630)
      },
      {
        id: 'lesson-orth-9-d-d22',
        sectionId: 'section-orth-9-dooshin',
        title: 'Задание 9. Дощинский (631–660)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-9-d-d21'],
        questions: task9DooshinQuestions.slice(630, 660)
      },
      {
        id: 'lesson-orth-9-d-d23',
        sectionId: 'section-orth-9-dooshin',
        title: 'Задание 9. Дощинский (661–690)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-9-d-d22'],
        questions: task9DooshinQuestions.slice(660, 690)
      },
      {
        id: 'lesson-orth-9-d-d24',
        sectionId: 'section-orth-9-dooshin',
        title: 'Задание 9. Дощинский (691–720)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-9-d-d23'],
        questions: task9DooshinQuestions.slice(690, 720)
      },
      {
        id: 'lesson-orth-9-d-d25',
        sectionId: 'section-orth-9-dooshin',
        title: 'Задание 9. Дощинский (721–750)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-9-d-d24'],
        questions: task9DooshinQuestions.slice(720, 750)
      },
      {
        id: 'lesson-orth-9-d-d26',
        sectionId: 'section-orth-9-dooshin',
        title: 'Задание 9. Дощинский (751–765)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-9-d-d25'],
        questions: task9DooshinQuestions.slice(750, 765)
      }
    ]
  }
]


export const task10DooshinSections: Section[] = [
  {
    id: 'section-orth-10-dooshin',
    courseId: 'ege-russian-2025',
    title: 'Задание 10. Приставки (Дощинский)',
    subtitle: 'Приставки, Ъ и Ь: Дощинский 2026',
    order: 10,
    icon: 'BookOpen',
    color: '#58cc02',
    lessons: [
      {
        id: 'lesson-orth-10-d-d1',
        sectionId: 'section-orth-10-dooshin',
        title: 'Задание 10. Дощинский (1–30)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: [],
        questions: task10DooshinQuestions.slice(0, 30)
      },
      {
        id: 'lesson-orth-10-d-d2',
        sectionId: 'section-orth-10-dooshin',
        title: 'Задание 10. Дощинский (31–60)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-10-d-d1'],
        questions: task10DooshinQuestions.slice(30, 60)
      },
      {
        id: 'lesson-orth-10-d-d3',
        sectionId: 'section-orth-10-dooshin',
        title: 'Задание 10. Дощинский (61–90)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-10-d-d2'],
        questions: task10DooshinQuestions.slice(60, 90)
      },
      {
        id: 'lesson-orth-10-d-d4',
        sectionId: 'section-orth-10-dooshin',
        title: 'Задание 10. Дощинский (91–120)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-10-d-d3'],
        questions: task10DooshinQuestions.slice(90, 120)
      },
      {
        id: 'lesson-orth-10-d-d5',
        sectionId: 'section-orth-10-dooshin',
        title: 'Задание 10. Дощинский (121–150)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-10-d-d4'],
        questions: task10DooshinQuestions.slice(120, 150)
      },
      {
        id: 'lesson-orth-10-d-d6',
        sectionId: 'section-orth-10-dooshin',
        title: 'Задание 10. Дощинский (151–180)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-10-d-d5'],
        questions: task10DooshinQuestions.slice(150, 180)
      },
      {
        id: 'lesson-orth-10-d-d7',
        sectionId: 'section-orth-10-dooshin',
        title: 'Задание 10. Дощинский (181–210)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-10-d-d6'],
        questions: task10DooshinQuestions.slice(180, 210)
      },
      {
        id: 'lesson-orth-10-d-d8',
        sectionId: 'section-orth-10-dooshin',
        title: 'Задание 10. Дощинский (211–240)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-10-d-d7'],
        questions: task10DooshinQuestions.slice(210, 240)
      },
      {
        id: 'lesson-orth-10-d-d9',
        sectionId: 'section-orth-10-dooshin',
        title: 'Задание 10. Дощинский (241–270)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-10-d-d8'],
        questions: task10DooshinQuestions.slice(240, 270)
      },
      {
        id: 'lesson-orth-10-d-d10',
        sectionId: 'section-orth-10-dooshin',
        title: 'Задание 10. Дощинский (271–300)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-10-d-d9'],
        questions: task10DooshinQuestions.slice(270, 300)
      },
      {
        id: 'lesson-orth-10-d-d11',
        sectionId: 'section-orth-10-dooshin',
        title: 'Задание 10. Дощинский (301–330)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-10-d-d10'],
        questions: task10DooshinQuestions.slice(300, 330)
      },
      {
        id: 'lesson-orth-10-d-d12',
        sectionId: 'section-orth-10-dooshin',
        title: 'Задание 10. Дощинский (331–360)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-10-d-d11'],
        questions: task10DooshinQuestions.slice(330, 360)
      },
      {
        id: 'lesson-orth-10-d-d13',
        sectionId: 'section-orth-10-dooshin',
        title: 'Задание 10. Дощинский (361–390)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-10-d-d12'],
        questions: task10DooshinQuestions.slice(360, 390)
      },
      {
        id: 'lesson-orth-10-d-d14',
        sectionId: 'section-orth-10-dooshin',
        title: 'Задание 10. Дощинский (391–420)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-10-d-d13'],
        questions: task10DooshinQuestions.slice(390, 420)
      },
      {
        id: 'lesson-orth-10-d-d15',
        sectionId: 'section-orth-10-dooshin',
        title: 'Задание 10. Дощинский (421–450)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-10-d-d14'],
        questions: task10DooshinQuestions.slice(420, 450)
      },
      {
        id: 'lesson-orth-10-d-d16',
        sectionId: 'section-orth-10-dooshin',
        title: 'Задание 10. Дощинский (451–480)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-10-d-d15'],
        questions: task10DooshinQuestions.slice(450, 480)
      },
      {
        id: 'lesson-orth-10-d-d17',
        sectionId: 'section-orth-10-dooshin',
        title: 'Задание 10. Дощинский (481–510)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-10-d-d16'],
        questions: task10DooshinQuestions.slice(480, 510)
      },
      {
        id: 'lesson-orth-10-d-d18',
        sectionId: 'section-orth-10-dooshin',
        title: 'Задание 10. Дощинский (511–540)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-10-d-d17'],
        questions: task10DooshinQuestions.slice(510, 540)
      },
      {
        id: 'lesson-orth-10-d-d19',
        sectionId: 'section-orth-10-dooshin',
        title: 'Задание 10. Дощинский (541–570)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-10-d-d18'],
        questions: task10DooshinQuestions.slice(540, 570)
      },
      {
        id: 'lesson-orth-10-d-d20',
        sectionId: 'section-orth-10-dooshin',
        title: 'Задание 10. Дощинский (571–600)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-10-d-d19'],
        questions: task10DooshinQuestions.slice(570, 600)
      },
      {
        id: 'lesson-orth-10-d-d21',
        sectionId: 'section-orth-10-dooshin',
        title: 'Задание 10. Дощинский (601–630)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-10-d-d20'],
        questions: task10DooshinQuestions.slice(600, 630)
      },
      {
        id: 'lesson-orth-10-d-d22',
        sectionId: 'section-orth-10-dooshin',
        title: 'Задание 10. Дощинский (631–660)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-10-d-d21'],
        questions: task10DooshinQuestions.slice(630, 660)
      },
      {
        id: 'lesson-orth-10-d-d23',
        sectionId: 'section-orth-10-dooshin',
        title: 'Задание 10. Дощинский (661–690)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-10-d-d22'],
        questions: task10DooshinQuestions.slice(660, 690)
      },
      {
        id: 'lesson-orth-10-d-d24',
        sectionId: 'section-orth-10-dooshin',
        title: 'Задание 10. Дощинский (691–720)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-10-d-d23'],
        questions: task10DooshinQuestions.slice(690, 720)
      },
      {
        id: 'lesson-orth-10-d-d25',
        sectionId: 'section-orth-10-dooshin',
        title: 'Задание 10. Дощинский (721–750)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-10-d-d24'],
        questions: task10DooshinQuestions.slice(720, 750)
      },
      {
        id: 'lesson-orth-10-d-d26',
        sectionId: 'section-orth-10-dooshin',
        title: 'Задание 10. Дощинский (751–771)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-10-d-d25'],
        questions: task10DooshinQuestions.slice(750, 771)
      }
    ]
  }
]


export const task11DooshinSections: Section[] = [
  {
    id: 'section-orth-11-dooshin',
    courseId: 'ege-russian-2025',
    title: 'Задание 11. Суффиксы (Дощинский)',
    subtitle: 'Суффиксы: Дощинский 2026',
    order: 11,
    icon: 'BookOpen',
    color: '#58cc02',
    lessons: [
      {
        id: 'lesson-orth-11-d-d1',
        sectionId: 'section-orth-11-dooshin',
        title: 'Задание 11. Дощинский (1–30)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: [],
        questions: task11DooshinQuestions.slice(0, 30)
      },
      {
        id: 'lesson-orth-11-d-d2',
        sectionId: 'section-orth-11-dooshin',
        title: 'Задание 11. Дощинский (31–60)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-11-d-d1'],
        questions: task11DooshinQuestions.slice(30, 60)
      },
      {
        id: 'lesson-orth-11-d-d3',
        sectionId: 'section-orth-11-dooshin',
        title: 'Задание 11. Дощинский (61–90)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-11-d-d2'],
        questions: task11DooshinQuestions.slice(60, 90)
      },
      {
        id: 'lesson-orth-11-d-d4',
        sectionId: 'section-orth-11-dooshin',
        title: 'Задание 11. Дощинский (91–120)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-11-d-d3'],
        questions: task11DooshinQuestions.slice(90, 120)
      },
      {
        id: 'lesson-orth-11-d-d5',
        sectionId: 'section-orth-11-dooshin',
        title: 'Задание 11. Дощинский (121–150)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-11-d-d4'],
        questions: task11DooshinQuestions.slice(120, 150)
      },
      {
        id: 'lesson-orth-11-d-d6',
        sectionId: 'section-orth-11-dooshin',
        title: 'Задание 11. Дощинский (151–180)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-11-d-d5'],
        questions: task11DooshinQuestions.slice(150, 180)
      },
      {
        id: 'lesson-orth-11-d-d7',
        sectionId: 'section-orth-11-dooshin',
        title: 'Задание 11. Дощинский (181–210)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-11-d-d6'],
        questions: task11DooshinQuestions.slice(180, 210)
      },
      {
        id: 'lesson-orth-11-d-d8',
        sectionId: 'section-orth-11-dooshin',
        title: 'Задание 11. Дощинский (211–240)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-11-d-d7'],
        questions: task11DooshinQuestions.slice(210, 240)
      },
      {
        id: 'lesson-orth-11-d-d9',
        sectionId: 'section-orth-11-dooshin',
        title: 'Задание 11. Дощинский (241–270)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-11-d-d8'],
        questions: task11DooshinQuestions.slice(240, 270)
      },
      {
        id: 'lesson-orth-11-d-d10',
        sectionId: 'section-orth-11-dooshin',
        title: 'Задание 11. Дощинский (271–300)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-11-d-d9'],
        questions: task11DooshinQuestions.slice(270, 300)
      },
      {
        id: 'lesson-orth-11-d-d11',
        sectionId: 'section-orth-11-dooshin',
        title: 'Задание 11. Дощинский (301–330)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-11-d-d10'],
        questions: task11DooshinQuestions.slice(300, 330)
      },
      {
        id: 'lesson-orth-11-d-d12',
        sectionId: 'section-orth-11-dooshin',
        title: 'Задание 11. Дощинский (331–360)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-11-d-d11'],
        questions: task11DooshinQuestions.slice(330, 360)
      },
      {
        id: 'lesson-orth-11-d-d13',
        sectionId: 'section-orth-11-dooshin',
        title: 'Задание 11. Дощинский (361–390)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-11-d-d12'],
        questions: task11DooshinQuestions.slice(360, 390)
      },
      {
        id: 'lesson-orth-11-d-d14',
        sectionId: 'section-orth-11-dooshin',
        title: 'Задание 11. Дощинский (391–420)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-11-d-d13'],
        questions: task11DooshinQuestions.slice(390, 420)
      },
      {
        id: 'lesson-orth-11-d-d15',
        sectionId: 'section-orth-11-dooshin',
        title: 'Задание 11. Дощинский (421–450)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-11-d-d14'],
        questions: task11DooshinQuestions.slice(420, 450)
      },
      {
        id: 'lesson-orth-11-d-d16',
        sectionId: 'section-orth-11-dooshin',
        title: 'Задание 11. Дощинский (451–480)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-11-d-d15'],
        questions: task11DooshinQuestions.slice(450, 480)
      },
      {
        id: 'lesson-orth-11-d-d17',
        sectionId: 'section-orth-11-dooshin',
        title: 'Задание 11. Дощинский (481–510)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-11-d-d16'],
        questions: task11DooshinQuestions.slice(480, 510)
      },
      {
        id: 'lesson-orth-11-d-d18',
        sectionId: 'section-orth-11-dooshin',
        title: 'Задание 11. Дощинский (511–540)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-11-d-d17'],
        questions: task11DooshinQuestions.slice(510, 540)
      },
      {
        id: 'lesson-orth-11-d-d19',
        sectionId: 'section-orth-11-dooshin',
        title: 'Задание 11. Дощинский (541–546)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-orth-11-d-d18'],
        questions: task11DooshinQuestions.slice(540, 546)
      }
    ]
  }
]


export const task12DooshinSections: Section[] = [
  {
    id: 'section-gram-12-dooshin',
    courseId: 'ege-russian-2025',
    title: 'Задание 12. Окончания (Дощинский)',
    subtitle: 'Окончания глаголов и причастий: Дощинский 2026',
    order: 12,
    icon: 'BookOpen',
    color: '#58cc02',
    lessons: [
      {
        id: 'lesson-gram-12-d-d1',
        sectionId: 'section-gram-12-dooshin',
        title: 'Задание 12. Дощинский (1–30)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: [],
        questions: task12DooshinQuestions.slice(0, 30)
      },
      {
        id: 'lesson-gram-12-d-d2',
        sectionId: 'section-gram-12-dooshin',
        title: 'Задание 12. Дощинский (31–60)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-12-d-d1'],
        questions: task12DooshinQuestions.slice(30, 60)
      },
      {
        id: 'lesson-gram-12-d-d3',
        sectionId: 'section-gram-12-dooshin',
        title: 'Задание 12. Дощинский (61–90)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-12-d-d2'],
        questions: task12DooshinQuestions.slice(60, 90)
      },
      {
        id: 'lesson-gram-12-d-d4',
        sectionId: 'section-gram-12-dooshin',
        title: 'Задание 12. Дощинский (91–120)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-12-d-d3'],
        questions: task12DooshinQuestions.slice(90, 120)
      },
      {
        id: 'lesson-gram-12-d-d5',
        sectionId: 'section-gram-12-dooshin',
        title: 'Задание 12. Дощинский (121–150)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-12-d-d4'],
        questions: task12DooshinQuestions.slice(120, 150)
      },
      {
        id: 'lesson-gram-12-d-d6',
        sectionId: 'section-gram-12-dooshin',
        title: 'Задание 12. Дощинский (151–180)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-12-d-d5'],
        questions: task12DooshinQuestions.slice(150, 180)
      },
      {
        id: 'lesson-gram-12-d-d7',
        sectionId: 'section-gram-12-dooshin',
        title: 'Задание 12. Дощинский (181–210)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-12-d-d6'],
        questions: task12DooshinQuestions.slice(180, 210)
      },
      {
        id: 'lesson-gram-12-d-d8',
        sectionId: 'section-gram-12-dooshin',
        title: 'Задание 12. Дощинский (211–240)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-12-d-d7'],
        questions: task12DooshinQuestions.slice(210, 240)
      },
      {
        id: 'lesson-gram-12-d-d9',
        sectionId: 'section-gram-12-dooshin',
        title: 'Задание 12. Дощинский (241–270)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-12-d-d8'],
        questions: task12DooshinQuestions.slice(240, 270)
      },
      {
        id: 'lesson-gram-12-d-d10',
        sectionId: 'section-gram-12-dooshin',
        title: 'Задание 12. Дощинский (271–300)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-12-d-d9'],
        questions: task12DooshinQuestions.slice(270, 300)
      },
      {
        id: 'lesson-gram-12-d-d11',
        sectionId: 'section-gram-12-dooshin',
        title: 'Задание 12. Дощинский (301–330)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-12-d-d10'],
        questions: task12DooshinQuestions.slice(300, 330)
      },
      {
        id: 'lesson-gram-12-d-d12',
        sectionId: 'section-gram-12-dooshin',
        title: 'Задание 12. Дощинский (331–360)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-12-d-d11'],
        questions: task12DooshinQuestions.slice(330, 360)
      },
      {
        id: 'lesson-gram-12-d-d13',
        sectionId: 'section-gram-12-dooshin',
        title: 'Задание 12. Дощинский (361–390)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-12-d-d12'],
        questions: task12DooshinQuestions.slice(360, 390)
      },
      {
        id: 'lesson-gram-12-d-d14',
        sectionId: 'section-gram-12-dooshin',
        title: 'Задание 12. Дощинский (391–420)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-12-d-d13'],
        questions: task12DooshinQuestions.slice(390, 420)
      },
      {
        id: 'lesson-gram-12-d-d15',
        sectionId: 'section-gram-12-dooshin',
        title: 'Задание 12. Дощинский (421–450)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-12-d-d14'],
        questions: task12DooshinQuestions.slice(420, 450)
      },
      {
        id: 'lesson-gram-12-d-d16',
        sectionId: 'section-gram-12-dooshin',
        title: 'Задание 12. Дощинский (451–480)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-12-d-d15'],
        questions: task12DooshinQuestions.slice(450, 480)
      },
      {
        id: 'lesson-gram-12-d-d17',
        sectionId: 'section-gram-12-dooshin',
        title: 'Задание 12. Дощинский (481–510)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-12-d-d16'],
        questions: task12DooshinQuestions.slice(480, 510)
      },
      {
        id: 'lesson-gram-12-d-d18',
        sectionId: 'section-gram-12-dooshin',
        title: 'Задание 12. Дощинский (511–540)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-12-d-d17'],
        questions: task12DooshinQuestions.slice(510, 540)
      },
      {
        id: 'lesson-gram-12-d-d19',
        sectionId: 'section-gram-12-dooshin',
        title: 'Задание 12. Дощинский (541–570)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-12-d-d18'],
        questions: task12DooshinQuestions.slice(540, 570)
      },
      {
        id: 'lesson-gram-12-d-d20',
        sectionId: 'section-gram-12-dooshin',
        title: 'Задание 12. Дощинский (571–594)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-12-d-d19'],
        questions: task12DooshinQuestions.slice(570, 594)
      }
    ]
  }
]


export const task14DooshinSections: Section[] = [
  {
    id: 'section-gram-14-dooshin',
    courseId: 'ege-russian-2025',
    title: 'Задание 14. Слитное/раздельное (Дощинский)',
    subtitle: 'Слитное, раздельное, дефисное: Дощинский 2026',
    order: 14,
    icon: 'BookOpen',
    color: '#58cc02',
    lessons: [
      {
        id: 'lesson-gram-14-d-d1',
        sectionId: 'section-gram-14-dooshin',
        title: 'Задание 14. Дощинский (1–30)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: [],
        questions: task14DooshinQuestions.slice(0, 30)
      },
      {
        id: 'lesson-gram-14-d-d2',
        sectionId: 'section-gram-14-dooshin',
        title: 'Задание 14. Дощинский (31–60)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-14-d-d1'],
        questions: task14DooshinQuestions.slice(30, 60)
      },
      {
        id: 'lesson-gram-14-d-d3',
        sectionId: 'section-gram-14-dooshin',
        title: 'Задание 14. Дощинский (61–90)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-14-d-d2'],
        questions: task14DooshinQuestions.slice(60, 90)
      },
      {
        id: 'lesson-gram-14-d-d4',
        sectionId: 'section-gram-14-dooshin',
        title: 'Задание 14. Дощинский (91–120)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-14-d-d3'],
        questions: task14DooshinQuestions.slice(90, 120)
      },
      {
        id: 'lesson-gram-14-d-d5',
        sectionId: 'section-gram-14-dooshin',
        title: 'Задание 14. Дощинский (121–150)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-14-d-d4'],
        questions: task14DooshinQuestions.slice(120, 150)
      },
      {
        id: 'lesson-gram-14-d-d6',
        sectionId: 'section-gram-14-dooshin',
        title: 'Задание 14. Дощинский (151–180)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-14-d-d5'],
        questions: task14DooshinQuestions.slice(150, 180)
      },
      {
        id: 'lesson-gram-14-d-d7',
        sectionId: 'section-gram-14-dooshin',
        title: 'Задание 14. Дощинский (181–210)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-14-d-d6'],
        questions: task14DooshinQuestions.slice(180, 210)
      },
      {
        id: 'lesson-gram-14-d-d8',
        sectionId: 'section-gram-14-dooshin',
        title: 'Задание 14. Дощинский (211–240)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-14-d-d7'],
        questions: task14DooshinQuestions.slice(210, 240)
      },
      {
        id: 'lesson-gram-14-d-d9',
        sectionId: 'section-gram-14-dooshin',
        title: 'Задание 14. Дощинский (241–270)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-14-d-d8'],
        questions: task14DooshinQuestions.slice(240, 270)
      },
      {
        id: 'lesson-gram-14-d-d10',
        sectionId: 'section-gram-14-dooshin',
        title: 'Задание 14. Дощинский (271–300)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-14-d-d9'],
        questions: task14DooshinQuestions.slice(270, 300)
      },
      {
        id: 'lesson-gram-14-d-d11',
        sectionId: 'section-gram-14-dooshin',
        title: 'Задание 14. Дощинский (301–330)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-14-d-d10'],
        questions: task14DooshinQuestions.slice(300, 330)
      },
      {
        id: 'lesson-gram-14-d-d12',
        sectionId: 'section-gram-14-dooshin',
        title: 'Задание 14. Дощинский (331–360)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-14-d-d11'],
        questions: task14DooshinQuestions.slice(330, 360)
      },
      {
        id: 'lesson-gram-14-d-d13',
        sectionId: 'section-gram-14-dooshin',
        title: 'Задание 14. Дощинский (361–390)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-14-d-d12'],
        questions: task14DooshinQuestions.slice(360, 390)
      },
      {
        id: 'lesson-gram-14-d-d14',
        sectionId: 'section-gram-14-dooshin',
        title: 'Задание 14. Дощинский (391–420)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-14-d-d13'],
        questions: task14DooshinQuestions.slice(390, 420)
      },
      {
        id: 'lesson-gram-14-d-d15',
        sectionId: 'section-gram-14-dooshin',
        title: 'Задание 14. Дощинский (421–450)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-14-d-d14'],
        questions: task14DooshinQuestions.slice(420, 450)
      },
      {
        id: 'lesson-gram-14-d-d16',
        sectionId: 'section-gram-14-dooshin',
        title: 'Задание 14. Дощинский (451–480)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-14-d-d15'],
        questions: task14DooshinQuestions.slice(450, 480)
      },
      {
        id: 'lesson-gram-14-d-d17',
        sectionId: 'section-gram-14-dooshin',
        title: 'Задание 14. Дощинский (481–510)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-14-d-d16'],
        questions: task14DooshinQuestions.slice(480, 510)
      },
      {
        id: 'lesson-gram-14-d-d18',
        sectionId: 'section-gram-14-dooshin',
        title: 'Задание 14. Дощинский (511–540)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-14-d-d17'],
        questions: task14DooshinQuestions.slice(510, 540)
      },
      {
        id: 'lesson-gram-14-d-d19',
        sectionId: 'section-gram-14-dooshin',
        title: 'Задание 14. Дощинский (541–570)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-14-d-d18'],
        questions: task14DooshinQuestions.slice(540, 570)
      },
      {
        id: 'lesson-gram-14-d-d20',
        sectionId: 'section-gram-14-dooshin',
        title: 'Задание 14. Дощинский (571–600)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-14-d-d19'],
        questions: task14DooshinQuestions.slice(570, 600)
      },
      {
        id: 'lesson-gram-14-d-d21',
        sectionId: 'section-gram-14-dooshin',
        title: 'Задание 14. Дощинский (601–630)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-14-d-d20'],
        questions: task14DooshinQuestions.slice(600, 630)
      },
      {
        id: 'lesson-gram-14-d-d22',
        sectionId: 'section-gram-14-dooshin',
        title: 'Задание 14. Дощинский (631–660)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-14-d-d21'],
        questions: task14DooshinQuestions.slice(630, 660)
      },
      {
        id: 'lesson-gram-14-d-d23',
        sectionId: 'section-gram-14-dooshin',
        title: 'Задание 14. Дощинский (661–690)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-14-d-d22'],
        questions: task14DooshinQuestions.slice(660, 690)
      },
      {
        id: 'lesson-gram-14-d-d24',
        sectionId: 'section-gram-14-dooshin',
        title: 'Задание 14. Дощинский (691–720)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-14-d-d23'],
        questions: task14DooshinQuestions.slice(690, 720)
      },
      {
        id: 'lesson-gram-14-d-d25',
        sectionId: 'section-gram-14-dooshin',
        title: 'Задание 14. Дощинский (721–750)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-14-d-d24'],
        questions: task14DooshinQuestions.slice(720, 750)
      },
      {
        id: 'lesson-gram-14-d-d26',
        sectionId: 'section-gram-14-dooshin',
        title: 'Задание 14. Дощинский (751–780)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-14-d-d25'],
        questions: task14DooshinQuestions.slice(750, 780)
      },
      {
        id: 'lesson-gram-14-d-d27',
        sectionId: 'section-gram-14-dooshin',
        title: 'Задание 14. Дощинский (781–810)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-14-d-d26'],
        questions: task14DooshinQuestions.slice(780, 810)
      },
      {
        id: 'lesson-gram-14-d-d28',
        sectionId: 'section-gram-14-dooshin',
        title: 'Задание 14. Дощинский (811–840)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-14-d-d27'],
        questions: task14DooshinQuestions.slice(810, 840)
      },
      {
        id: 'lesson-gram-14-d-d29',
        sectionId: 'section-gram-14-dooshin',
        title: 'Задание 14. Дощинский (841–860)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-gram-14-d-d28'],
        questions: task14DooshinQuestions.slice(840, 860)
      }
    ]
  }
]


export const task15DooshinSections: Section[] = [
  {
    id: 'section-nnn-15-dooshin',
    courseId: 'ege-russian-2025',
    title: 'Задание 15. Н/НН (Дощинский)',
    subtitle: 'Н / НН: Дощинский 2026',
    order: 15,
    icon: 'BookOpen',
    color: '#58cc02',
    lessons: [
      {
        id: 'lesson-nnn-15-d-d1',
        sectionId: 'section-nnn-15-dooshin',
        title: 'Задание 15. Дощинский (1–30)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: [],
        questions: task15DooshinQuestions.slice(0, 30)
      },
      {
        id: 'lesson-nnn-15-d-d2',
        sectionId: 'section-nnn-15-dooshin',
        title: 'Задание 15. Дощинский (31–60)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-nnn-15-d-d1'],
        questions: task15DooshinQuestions.slice(30, 60)
      },
      {
        id: 'lesson-nnn-15-d-d3',
        sectionId: 'section-nnn-15-dooshin',
        title: 'Задание 15. Дощинский (61–61)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-nnn-15-d-d2'],
        questions: task15DooshinQuestions.slice(60, 61)
      }
    ]
  }
]


export const task16DooshinSections: Section[] = [
  {
    id: 'section-punct-16-dooshin',
    courseId: 'ege-russian-2025',
    title: 'Задание 16. Пунктуация (Дощинский)',
    subtitle: 'Однородные члены, придаточные: Дощинский 2026',
    order: 16,
    icon: 'BookOpen',
    color: '#58cc02',
    lessons: [
      {
        id: 'lesson-punct-16-d-d1',
        sectionId: 'section-punct-16-dooshin',
        title: 'Задание 16. Дощинский (1–30)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: [],
        questions: task16DooshinQuestions.slice(0, 30)
      },
      {
        id: 'lesson-punct-16-d-d2',
        sectionId: 'section-punct-16-dooshin',
        title: 'Задание 16. Дощинский (31–60)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-punct-16-d-d1'],
        questions: task16DooshinQuestions.slice(30, 60)
      },
      {
        id: 'lesson-punct-16-d-d3',
        sectionId: 'section-punct-16-dooshin',
        title: 'Задание 16. Дощинский (61–90)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-punct-16-d-d2'],
        questions: task16DooshinQuestions.slice(60, 90)
      },
      {
        id: 'lesson-punct-16-d-d4',
        sectionId: 'section-punct-16-dooshin',
        title: 'Задание 16. Дощинский (91–120)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-punct-16-d-d3'],
        questions: task16DooshinQuestions.slice(90, 120)
      },
      {
        id: 'lesson-punct-16-d-d5',
        sectionId: 'section-punct-16-dooshin',
        title: 'Задание 16. Дощинский (121–150)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-punct-16-d-d4'],
        questions: task16DooshinQuestions.slice(120, 150)
      },
      {
        id: 'lesson-punct-16-d-d6',
        sectionId: 'section-punct-16-dooshin',
        title: 'Задание 16. Дощинский (151–180)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-punct-16-d-d5'],
        questions: task16DooshinQuestions.slice(150, 180)
      },
      {
        id: 'lesson-punct-16-d-d7',
        sectionId: 'section-punct-16-dooshin',
        title: 'Задание 16. Дощинский (181–210)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-punct-16-d-d6'],
        questions: task16DooshinQuestions.slice(180, 210)
      },
      {
        id: 'lesson-punct-16-d-d8',
        sectionId: 'section-punct-16-dooshin',
        title: 'Задание 16. Дощинский (211–240)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-punct-16-d-d7'],
        questions: task16DooshinQuestions.slice(210, 240)
      },
      {
        id: 'lesson-punct-16-d-d9',
        sectionId: 'section-punct-16-dooshin',
        title: 'Задание 16. Дощинский (241–270)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-punct-16-d-d8'],
        questions: task16DooshinQuestions.slice(240, 270)
      },
      {
        id: 'lesson-punct-16-d-d10',
        sectionId: 'section-punct-16-dooshin',
        title: 'Задание 16. Дощинский (271–300)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-punct-16-d-d9'],
        questions: task16DooshinQuestions.slice(270, 300)
      },
      {
        id: 'lesson-punct-16-d-d11',
        sectionId: 'section-punct-16-dooshin',
        title: 'Задание 16. Дощинский (301–301)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-punct-16-d-d10'],
        questions: task16DooshinQuestions.slice(300, 301)
      }
    ]
  }
]


export const task20DooshinSections: Section[] = [
  {
    id: 'section-punct-20-dooshin',
    courseId: 'ege-russian-2025',
    title: 'Задание 20. Пунктуация (Дощинский)',
    subtitle: 'Сложное предложение: Дощинский 2026',
    order: 20,
    icon: 'BookOpen',
    color: '#58cc02',
    lessons: [
      {
        id: 'lesson-punct-20-d-d1',
        sectionId: 'section-punct-20-dooshin',
        title: 'Задание 20. Дощинский (1–30)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: [],
        questions: task20DooshinQuestions.slice(0, 30)
      },
      {
        id: 'lesson-punct-20-d-d2',
        sectionId: 'section-punct-20-dooshin',
        title: 'Задание 20. Дощинский (31–60)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-punct-20-d-d1'],
        questions: task20DooshinQuestions.slice(30, 60)
      },
      {
        id: 'lesson-punct-20-d-d3',
        sectionId: 'section-punct-20-dooshin',
        title: 'Задание 20. Дощинский (61–90)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-punct-20-d-d2'],
        questions: task20DooshinQuestions.slice(60, 90)
      },
      {
        id: 'lesson-punct-20-d-d4',
        sectionId: 'section-punct-20-dooshin',
        title: 'Задание 20. Дощинский (91–120)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-punct-20-d-d3'],
        questions: task20DooshinQuestions.slice(90, 120)
      },
      {
        id: 'lesson-punct-20-d-d5',
        sectionId: 'section-punct-20-dooshin',
        title: 'Задание 20. Дощинский (121–150)',
        type: 'practice',
        description: 'Вопросы из сборника Дощинского-2026',
        xpReward: 60,
        prerequisites: ['lesson-punct-20-d-d4'],
        questions: task20DooshinQuestions.slice(120, 150)
      }
    ]
  }
]


