import { useProgressStore } from '../stores/progressStore'
import { useStudentStore } from '../stores/studentStore'
import { useClassStore } from '../stores/classStore'
import { course } from '../data/courseData'
import { getPredictiveScore } from './predictiveScore'
import { analyzeErrors } from './errorPatternAnalyzer'

export interface ReportData {
  type: 'parent' | 'teacher' | 'student' | 'class'
  studentId?: string
  classId?: string
  dateRange?: { from: string; to: string }
}

function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

function generateStyles(): string {
  return `
    <style>
      @page { size: A4; margin: 15mm; }
      * { box-sizing: border-box; }
      body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 20px; color: #333; background: #fff; line-height: 1.5; }
      .page { max-width: 800px; margin: 0 auto; page-break-after: always; }
      .page:last-child { page-break-after: auto; }
      .header { text-align: center; border-bottom: 3px solid #58cc02; padding-bottom: 15px; margin-bottom: 20px; }
      .header h1 { margin: 0; font-size: 24px; color: #1cb0f6; }
      .header .subtitle { color: #666; font-size: 14px; margin-top: 5px; }
      .header .date { color: #999; font-size: 12px; margin-top: 5px; }
      .section { margin: 20px 0; }
      .section h2 { font-size: 18px; color: #58cc02; border-bottom: 2px solid #e5e5e5; padding-bottom: 8px; margin-bottom: 15px; }
      .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 15px 0; }
      .stat-card { background: #f8f9fa; border-radius: 12px; padding: 15px; text-align: center; border-left: 4px solid #58cc02; }
      .stat-card .value { font-size: 28px; font-weight: bold; color: #58cc02; }
      .stat-card .label { font-size: 12px; color: #666; margin-top: 5px; }
      table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 13px; }
      th { background: #58cc02; color: white; padding: 10px; text-align: left; font-weight: 600; }
      td { padding: 10px; border-bottom: 1px solid #eee; }
      tr:nth-child(even) { background: #f8f9fa; }
      .progress-bar { width: 100%; height: 20px; background: #e5e5e5; border-radius: 10px; overflow: hidden; margin: 10px 0; }
      .progress-bar .fill { height: 100%; background: #58cc02; border-radius: 10px; text-align: center; color: white; font-size: 12px; line-height: 20px; }
      .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
      .badge-green { background: #d4edda; color: #155724; }
      .badge-yellow { background: #fff3cd; color: #856404; }
      .badge-red { background: #f8d7da; color: #721c24; }
      .recommendation { background: #e8f5e9; border-left: 4px solid #58cc02; padding: 12px 15px; margin: 10px 0; border-radius: 0 8px 8px 0; }
      .footer { text-align: center; color: #999; font-size: 11px; margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; }
      @media print {
        body { padding: 0; }
        .no-print { display: none; }
      }
    </style>
  `
}

export function generateParentReportHTML(studentId: string): string {
  const studentStore = useStudentStore.getState()
  const progressStore = useProgressStore.getState()
  const profile = studentStore.profiles.find(p => p.id === studentId)
  const stats = studentStore.getProfileStats(studentId)
  const progress = progressStore

  if (!profile || !stats) return '<p>Нет данных</p>'

  const totalLessons = course.sections.reduce((sum, s) => sum + s.lessons.length, 0)
  const completedLessons = Object.values(progress.lessonProgress).filter((l: any) => l.status === 'completed').length
  const completedPercent = Math.round((completedLessons / totalLessons) * 100)
  
  const predictive = getPredictiveScore(progress)
  const errorAnalysis = analyzeErrors((progress.wrongAnswers || []) as any)
  const topErrors = errorAnalysis.patterns.slice(0, 5)
  
  const today = new Date().toLocaleDateString('ru-RU')
  const examDate = progress.examDate || '2027-06-01'
  const daysToExam = Math.max(0, Math.ceil((new Date(examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))

  const errorRows = topErrors.length > 0
    ? topErrors.map(e => `
      <tr>
        <td>Задание ${e.taskNumber}</td>
        <td>${escapeHtml(e.errorType)}</td>
        <td>${e.frequency}</td>
        <td>${Math.round(e.confidence * 100)}%</td>
      </tr>
    `).join('')
    : '<tr><td colspan="4" style="text-align:center;color:#999">Пока нет ошибок — отлично! 🎉</td></tr>'

  return `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Отчёт — ${escapeHtml(profile.name)}</title>
  ${generateStyles()}
</head>
<body>
  <div class="page">
    <div class="header">
      <h1>📊 Отчёт о прогрессе</h1>
      <div class="subtitle">${escapeHtml(profile.name)}</div>
      <div class="date">Сгенерировано: ${today}</div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="value">${stats.level}</div>
        <div class="label">Уровень</div>
      </div>
      <div class="stat-card">
        <div class="value">${stats.xp}</div>
        <div class="label">XP</div>
      </div>
      <div class="stat-card">
        <div class="value">${stats.streak || 0} 🔥</div>
        <div class="label">Стрик (дней)</div>
      </div>
      <div class="stat-card">
        <div class="value">${stats.accuracy}%</div>
        <div class="label">Точность</div>
      </div>
    </div>

    <div class="section">
      <h2>🎯 Прогресс по курсу</h2>
      <div class="progress-bar">
        <div class="fill" style="width: ${completedPercent}%">${completedPercent}%</div>
      </div>
      <p>Пройдено <strong>${completedLessons}</strong> из <strong>${totalLessons}</strong> уроков</p>
    </div>

    <div class="section">
      <h2>📝 Предсказание на ЕГЭ</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="value">${predictive.predictedSecondary}</div>
          <div class="label">Тестовый балл</div>
        </div>
        <div class="stat-card">
          <div class="value">${predictive.confidence}%</div>
          <div class="label">Уверенность</div>
        </div>
        <div class="stat-card">
          <div class="value">${daysToExam}</div>
          <div class="label">Дней до экзамена</div>
        </div>
      </div>
      <p>Для <strong>80+</strong> нужно: ${predictive.neededForExcellent > 0 ? `ещё ${predictive.neededForExcellent} XP` : 'всё готово! 🎉'}</p>
    </div>
  </div>

  <div class="page">
    <div class="section">
      <h2>🧠 Слабые места</h2>
      <table>
        <thead>
          <tr><th>Задание</th><th>Тип ошибки</th><th>Количество</th><th>Уверенность</th></tr>
        </thead>
        <tbody>
          ${errorRows}
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2>💡 Рекомендации</h2>
      ${errorAnalysis.recommendations.slice(0, 5).map(r => `<div class="recommendation">${escapeHtml(r)}</div>`).join('')}
      ${errorAnalysis.recommendations.length === 0 ? '<div class="recommendation">Отлично! Ошибок почти нет. Продолжай в том же духе! 🌟</div>' : ''}
    </div>

    <div class="footer">
      📚 ЕГЭ Русский — Подготовка | Сгенерировано ${today}
    </div>
  </div>
</body>
</html>
  `
}

export function generateTeacherReportHTML(classId: string): string {
  const classStore = useClassStore.getState()
  const studentStore = useStudentStore.getState()
  const cls = classStore.classes[classId]
  
  if (!cls) return '<p>Класс не найден</p>'

  const today = new Date().toLocaleDateString('ru-RU')
  const students = cls.students || []
  
  const studentRows = students.map(s => {
    const stats = studentStore.getProfileStats(s.id)
    const progress = useProgressStore.getState()
    const completed = Object.values(progress.lessonProgress).filter((l: any) => l.status === 'completed').length
    return `
      <tr>
        <td>${escapeHtml(s.name)}</td>
        <td>${stats?.level || 1}</td>
        <td>${stats?.xp || 0}</td>
        <td>${stats?.accuracy || 0}%</td>
        <td>${completed}</td>
        <td>${stats?.streak || 0}</td>
      </tr>
    `
  }).join('')

  const homeworkRows = (cls.homework || []).map(hw => {
    const status = new Date(hw.deadline) < new Date() ? '❌ Просрочено' : '⏳ В процессе'
    return `
      <tr>
        <td>${escapeHtml(hw.taskTitle)}</td>
        <td>${new Date(hw.deadline).toLocaleDateString('ru-RU')}</td>
        <td>-</td>
        <td>${status}</td>
      </tr>
    `
  }).join('')

  return `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Отчёт по классу — ${escapeHtml(cls.name)}</title>
  ${generateStyles()}
</head>
<body>
  <div class="page">
    <div class="header">
      <h1>🏫 Отчёт по классу</h1>
      <div class="subtitle">${escapeHtml(cls.name)} | Учитель: ${escapeHtml(cls.teacherName)}</div>
      <div class="date">Сгенерировано: ${today}</div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="value">${students.length}</div>
        <div class="label">Учеников</div>
      </div>
      <div class="stat-card">
        <div class="value">${Math.round(students.reduce((sum, s) => sum + (studentStore.getProfileStats(s.id)?.xp || 0), 0) / Math.max(students.length, 1))}</div>
        <div class="label">Средний XP</div>
      </div>
      <div class="stat-card">
        <div class="value">${(cls.homework || []).length}</div>
        <div class="label">Домашних заданий</div>
      </div>
    </div>

    <div class="section">
      <h2>👥 Прогресс учеников</h2>
      <table>
        <thead>
          <tr><th>Имя</th><th>Уровень</th><th>XP</th><th>Точность</th><th>Уроки</th><th>Стрик</th></tr>
        </thead>
        <tbody>
          ${studentRows || '<tr><td colspan="6" style="text-align:center;color:#999">Нет учеников</td></tr>'}
        </tbody>
      </table>
    </div>
  </div>

  <div class="page">
    <div class="section">
      <h2>📚 Домашние задания</h2>
      <table>
        <thead>
          <tr><th>Название</th><th>Дедлайн</th><th>Сдавших</th><th>Статус</th></tr>
        </thead>
        <tbody>
          ${homeworkRows || '<tr><td colspan="4" style="text-align:center;color:#999">Нет домашних заданий</td></tr>'}
        </tbody>
      </table>
    </div>

    <div class="footer">
      📚 ЕГЭ Русский — Подготовка | Сгенерировано ${today}
    </div>
  </div>
</body>
</html>
  `
}

export function generateStudentPortfolioHTML(): string {
  const progress = useProgressStore.getState()
  const stats = progress.userStats
  const achievements = progress.achievements || []
  const examResults = progress.examResults || []
  const today = new Date().toLocaleDateString('ru-RU')

  const achievementList = achievements.map(a => {
    const ach = getAchievementById(a)
    return `<span class="badge badge-green">${ach ? ach.title : a}</span>`
  }).join(' ')

  const examRows = examResults.map((r: any) => `
    <tr>
      <td>${r.variantId}</td>
      <td>${new Date(r.date).toLocaleDateString('ru-RU')}</td>
      <td>${r.primaryScore}</td>
      <td>${r.secondaryScore}</td>
    </tr>
  `).join('')

  return `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Моё портфолио</title>
  ${generateStyles()}
</head>
<body>
  <div class="page">
    <div class="header">
      <h1>📖 Моё портфолио</h1>
      <div class="subtitle">${escapeHtml(stats.name || 'Ученик')}</div>
      <div class="date">${today}</div>
    </div>

    <div class="stats-grid">
      <div class="stat-card"><div class="value">${stats.level}</div><div class="label">Уровень</div></div>
      <div class="stat-card"><div class="value">${stats.xp}</div><div class="label">XP</div></div>
      <div class="stat-card"><div class="value">${stats.streak || 0} 🔥</div><div class="label">Стрик</div></div>
      <div class="stat-card"><div class="value">${achievements.length}</div><div class="label">Достижений</div></div>
    </div>

    <div class="section">
      <h2>🏆 Достижения</h2>
      <p>${achievementList || 'Пока нет достижений — продолжай учиться!'}</p>
    </div>
  </div>

  <div class="page">
    <div class="section">
      <h2>📝 Пройденные варианты</h2>
      <table>
        <thead><tr><th>Вариант</th><th>Дата</th><th>Первичный</th><th>Тестовый</th></tr></thead>
        <tbody>${examRows || '<tr><td colspan="4" style="text-align:center;color:#999">Пока не пройдено ни одного варианта</td></tr>'}</tbody>
      </table>
    </div>

    <div class="footer">
      📚 ЕГЭ Русский — Подготовка | Сгенерировано ${today}
    </div>
  </div>
</body>
</html>
  `
}

function getAchievementById(id: string) {
  // Import dynamically to avoid circular dependency
  try {
    const { achievements } = require('../data/achievements')
    return achievements.find((a: any) => a.id === id)
  } catch {
    return null
  }
}

export function openReportInNewTab(html: string) {
  const blob = new Blob([html], { type: 'text/html; charset=utf-8' })
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank')
}
