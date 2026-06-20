import React from 'react'

export interface ReportPreviewData {
  type: 'parent' | 'teacher' | 'student' | 'class'

  // Common
  studentName: string
  studentEmoji: string
  date: string
  footerText: string

  // Stats
  level: number
  xp: number
  streak: number
  accuracy: number
  predictedScore: number
  lessonsCompleted: number
  totalLessons: number
  daysToExam: number

  // Activity
  activityHistory: { date: string; xp: number; accuracy: number }[]

  // Weak topics
  weakTopics: { task: string; errorType: string; count: number; recommendation: string }[]

  // Comparison
  speedPercentile: number
  accuracyPercentile: number
  efficiencyPercentile: number
  streakPercentile: number

  // Recommendations
  recommendations: string[]

  // Weekly schedule
  weeklySchedule: { day: string; title: string; duration: number }[]

  // Teacher
  className: string
  teacherName: string
  students: {
    name: string
    emoji: string
    level: number
    xp: number
    accuracy: number
    lessonsCompleted: number
    streak: number
    predictedScore: number
  }[]
  classWeakTopics: { task: string; studentCount: number; errorPercent: number }[]
  homework: { title: string; deadline: string; completed: number; total: number; status: string }[]

  // Student portfolio
  achievements: { id: string; title: string; description: string; date?: string }[]
  examResults: { variant: string; date: string; primaryScore: number; secondaryScore: number }[]
  taskStats: { taskNum: number; total: number; correct: number; accuracy: number; avgTime: number }[]
  srsItems: { lesson: string; nextReview: string; interval: string }[]
  smartPath: { title: string; description: string; priority: number; sectionColor: string }[]

  // Knowledge map
  knowledgeMap: { section: string; completed: number; total: number; color: string }[]
}

const DUO_GREEN = '#58CC02'
const DUO_BLUE = '#1CB0F6'
const DUO_YELLOW = '#FFC800'
const DUO_RED = '#FF4B4B'
const DUO_PURPLE = '#CE82FF'

interface ReportPageProps {
  children: React.ReactNode
  pageNum: number
  totalPages: number
}

function ReportPage({ children, pageNum, totalPages }: ReportPageProps) {
  return (
    <div
      className="report-page"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '20mm',
        position: 'relative',
        backgroundColor: '#fff',
        breakAfter: 'page',
        boxSizing: 'border-box',
        fontFamily: 'Helvetica, Arial, sans-serif',
        color: '#333',
        fontSize: '11pt',
        lineHeight: 1.5,
      }}
    >
      {children}
      <div
        style={{
          position: 'absolute',
          bottom: '10mm',
          left: '20mm',
          right: '20mm',
          fontSize: '9pt',
          color: '#999',
          display: 'flex',
          justifyContent: 'space-between',
          borderTop: '1px solid #eee',
          paddingTop: '4mm',
        }}
      >
        <span>Сгенерировано {new Date().toLocaleDateString('ru-RU')} | ЕГЭ Русский — Подготовка</span>
        <span>
          Страница {pageNum} из {totalPages}
        </span>
      </div>
    </div>
  )
}

function ProgressBar({
  value,
  max,
  color = DUO_GREEN,
  height = 16,
}: {
  value: number
  max: number
  color?: string
  height?: number
}) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  return (
    <div
      style={{
        width: '100%',
        height: `${height}px`,
        backgroundColor: '#f0f0f0',
        borderRadius: `${height / 2}px`,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: '100%',
          backgroundColor: color,
          borderRadius: `${height / 2}px`,
          transition: 'width 0.3s',
        }}
      />
    </div>
  )
}

function MiniBarChart({
  data,
  maxValue,
  color = DUO_GREEN,
  showLabels = true,
}: {
  data: { label: string; value: number }[]
  maxValue: number
  color?: string
  showLabels?: boolean
}) {
  const safeMax = maxValue > 0 ? maxValue : 1
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '100px' }}>
      {data.map((d, i) => (
        <div
          key={i}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
        >
          <div
            style={{
              width: '100%',
              backgroundColor: color,
              borderRadius: '3px 3px 0 0',
              height: `${Math.max(4, (d.value / safeMax) * 100)}%`,
              minHeight: '4px',
            }}
          />
          {showLabels && (
            <span style={{ fontSize: '7pt', color: '#666', textAlign: 'center', whiteSpace: 'nowrap' }}>
              {d.label}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

function ReportTable({
  headers,
  rows,
  compact = false,
}: {
  headers: string[]
  rows: React.ReactNode[][]
  compact?: boolean
}) {
  return (
    <table
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: compact ? '9pt' : '10pt',
        marginTop: '8px',
      }}
    >
      <thead>
        <tr style={{ backgroundColor: DUO_GREEN, color: '#fff' }}>
          {headers.map((h, i) => (
            <th
              key={i}
              style={{
                padding: compact ? '6px' : '8px',
                textAlign: 'left',
                border: '1px solid #E0E0E0',
                fontWeight: 'bold',
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#f5f5f5' }}>
            {row.map((cell, j) => (
              <td
                key={j}
                style={{
                  padding: compact ? '6px' : '8px',
                  border: '1px solid #E0E0E0',
                  color: '#333',
                }}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function PercentileBadge({ value, label }: { value: number; label: string }) {
  const color = value >= 80 ? DUO_GREEN : value >= 60 ? DUO_YELLOW : value >= 40 ? '#f5a623' : DUO_RED
  return (
    <div style={{ textAlign: 'center', padding: '8px' }}>
      <div style={{ fontSize: '24pt', fontWeight: 'bold', color }}>{value}%</div>
      <div style={{ fontSize: '9pt', color: '#666' }}>{label}</div>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontSize: '16pt',
        fontWeight: 'bold',
        color: DUO_GREEN,
        marginBottom: '12px',
        marginTop: '0',
        borderBottom: `2px solid ${DUO_GREEN}`,
        paddingBottom: '4px',
      }}
    >
      {children}
    </h2>
  )
}

function CoverPage({
  title,
  subtitle,
  emoji,
  date,
  extra,
}: {
  title: string
  subtitle: string
  emoji: string
  date: string
  extra?: React.ReactNode
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '64pt', marginBottom: '24px' }}>{emoji}</div>
      <h1
        style={{
          fontSize: '24pt',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '8px',
        }}
      >
        {title}
      </h1>
      <p style={{ fontSize: '14pt', color: '#666', marginBottom: '24px' }}>{subtitle}</p>
      <div style={{ fontSize: '11pt', color: '#999', marginBottom: '16px' }}>📚 ЕГЭ Русский — Подготовка</div>
      <div style={{ fontSize: '10pt', color: '#999' }}>{date}</div>
      {extra && <div style={{ marginTop: '24px' }}>{extra}</div>}
    </div>
  )
}

export function ReportPreview({ data }: { data: ReportPreviewData }) {
  switch (data.type) {
    case 'parent':
      return <ParentReport data={data} />
    case 'teacher':
      return <TeacherReport data={data} />
    case 'student':
      return <StudentReport data={data} />
    case 'class':
      return <ClassReport data={data} />
    default:
      return null
  }
}

function ParentReport({ data }: { data: ReportPreviewData }) {
  const totalPages = 5
  const activityData = data.activityHistory.slice(-14).map((h) => ({
    label: h.date.slice(5),
    value: h.xp,
  }))
  const maxActivity = Math.max(1, ...activityData.map((d) => d.value))

  const accuracyData = data.activityHistory.slice(-14).map((h) => ({
    label: h.date.slice(5),
    value: h.accuracy,
  }))
  const maxAccuracy = 100

  return (
    <>
      {/* Page 1: Cover + Summary */}
      <ReportPage pageNum={1} totalPages={totalPages}>
        <CoverPage
          title={`Отчёт о прогрессе: ${data.studentName}`}
          subtitle={`${data.studentEmoji} Родительский отчёт`}
          emoji="📚"
          date={data.date}
          extra={
            <div style={{ marginTop: '16px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  textAlign: 'left',
                  maxWidth: '400px',
                  margin: '0 auto',
                }}
              >
                <div style={{ padding: '8px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                  <div style={{ fontSize: '9pt', color: '#666' }}>Уровень</div>
                  <div style={{ fontSize: '16pt', fontWeight: 'bold', color: DUO_GREEN }}>{data.level}</div>
                </div>
                <div style={{ padding: '8px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                  <div style={{ fontSize: '9pt', color: '#666' }}>XP</div>
                  <div style={{ fontSize: '16pt', fontWeight: 'bold', color: DUO_YELLOW }}>{data.xp}</div>
                </div>
                <div style={{ padding: '8px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                  <div style={{ fontSize: '9pt', color: '#666' }}>Streak</div>
                  <div style={{ fontSize: '16pt', fontWeight: 'bold', color: DUO_RED }}>{data.streak} дн.</div>
                </div>
                <div style={{ padding: '8px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                  <div style={{ fontSize: '9pt', color: '#666' }}>Точность</div>
                  <div style={{ fontSize: '16pt', fontWeight: 'bold', color: DUO_BLUE }}>{data.accuracy}%</div>
                </div>
              </div>
              <div style={{ marginTop: '12px', padding: '8px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                <div style={{ fontSize: '9pt', color: '#666' }}>Предсказанный балл</div>
                <div style={{ fontSize: '20pt', fontWeight: 'bold', color: DUO_PURPLE }}>
                  {data.predictedScore} / 100
                </div>
              </div>
              <div style={{ marginTop: '12px' }}>
                <div style={{ fontSize: '9pt', color: '#666', marginBottom: '4px' }}>
                  Уроки: {data.lessonsCompleted} / {data.totalLessons}
                </div>
                <ProgressBar value={data.lessonsCompleted} max={data.totalLessons} />
              </div>
              <div style={{ marginTop: '12px', fontSize: '12pt', color: '#666' }}>
                До экзамена: <strong>{data.daysToExam} дней</strong>
              </div>
            </div>
          }
        />
      </ReportPage>

      {/* Page 2: Activity */}
      <ReportPage pageNum={2} totalPages={totalPages}>
        <SectionTitle>График активности</SectionTitle>
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '11pt', color: '#666', marginBottom: '8px' }}>XP по дням</h3>
          {activityData.length > 0 ? (
            <MiniBarChart data={activityData} maxValue={maxActivity} color={DUO_GREEN} />
          ) : (
            <p style={{ color: '#999', fontSize: '10pt' }}>Нет данных об активности</p>
          )}
        </div>
        <div>
          <h3 style={{ fontSize: '11pt', color: '#666', marginBottom: '8px' }}>Точность по дням</h3>
          {accuracyData.length > 0 ? (
            <MiniBarChart data={accuracyData} maxValue={maxAccuracy} color={DUO_BLUE} />
          ) : (
            <p style={{ color: '#999', fontSize: '10pt' }}>Нет данных о точности</p>
          )}
        </div>
      </ReportPage>

      {/* Page 3: Weak topics */}
      <ReportPage pageNum={3} totalPages={totalPages}>
        <SectionTitle>Слабые темы</SectionTitle>
        {data.weakTopics.length > 0 ? (
          <>
            <p style={{ fontSize: '10pt', color: '#666', marginBottom: '12px' }}>
              Топ-5 ошибок по частоте и уверенности:
            </p>
            <ReportTable
              headers={['Задание', 'Тип ошибки', 'Количество', 'Рекомендация']}
              rows={data.weakTopics.slice(0, 5).map((wt) => [
                wt.task,
                wt.errorType,
                wt.count,
                wt.recommendation,
              ])}
            />
          </>
        ) : (
          <p style={{ color: '#999', fontSize: '10pt' }}>Пока нет выявленных слабых тем. Продолжай практику!</p>
        )}
      </ReportPage>

      {/* Page 4: Comparison */}
      <ReportPage pageNum={4} totalPages={totalPages}>
        <SectionTitle>Сравнение с другими учениками</SectionTitle>
        <p style={{ fontSize: '10pt', color: '#666', marginBottom: '16px' }}>
          Ты сравниваешься с {data.students.length > 1 ? data.students.length - 1 : 0} другими учениками:
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '16px',
          }}
        >
          <PercentileBadge value={data.speedPercentile} label="Скорость" />
          <PercentileBadge value={data.accuracyPercentile} label="Точность" />
          <PercentileBadge value={data.efficiencyPercentile} label="Эффективность" />
          <PercentileBadge value={data.streakPercentile} label="Стрик" />
        </div>
        <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
          <p style={{ fontSize: '12pt', fontWeight: 'bold', color: '#333' }}>
            {data.speedPercentile > 50
              ? `Ты быстрее ${data.speedPercentile}% учеников`
              : `Ты медленнее ${100 - data.speedPercentile}% учеников — есть куда расти!`}
          </p>
        </div>
      </ReportPage>

      {/* Page 5: Recommendations */}
      <ReportPage pageNum={5} totalPages={totalPages}>
        <SectionTitle>Рекомендации</SectionTitle>
        {data.recommendations.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {data.recommendations.map((rec, i) => (
              <div
                key={i}
                style={{
                  padding: '10px',
                  backgroundColor: '#f0f9e6',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${DUO_GREEN}`,
                  fontSize: '10pt',
                }}
              >
                {rec}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#999', fontSize: '10pt' }}>Рекомендаций пока нет. Продолжай регулярную практику!</p>
        )}
        {data.weeklySchedule.length > 0 && (
          <>
            <h3 style={{ fontSize: '12pt', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
              Недельный график занятий
            </h3>
            <ReportTable
              headers={['День', 'Занятие', 'Минут']}
              rows={data.weeklySchedule.map((s) => [s.day, s.title, s.duration])}
              compact
            />
          </>
        )}
      </ReportPage>
    </>
  )
}

function TeacherReport({ data }: { data: ReportPreviewData }) {
  const totalPages = 6
  const avgXP =
    data.students.length > 0
      ? Math.round(data.students.reduce((s, st) => s + st.xp, 0) / data.students.length)
      : 0
  const avgAccuracy =
    data.students.length > 0
      ? Math.round(data.students.reduce((s, st) => s + st.accuracy, 0) / data.students.length)
      : 0
  const avgPredicted =
    data.students.length > 0
      ? Math.round(data.students.reduce((s, st) => s + st.predictedScore, 0) / data.students.length)
      : 0

  return (
    <>
      {/* Page 1: Cover + Class Summary */}
      <ReportPage pageNum={1} totalPages={totalPages}>
        <CoverPage
          title={`Отчёт по классу: ${data.className}`}
          subtitle={`Учитель: ${data.teacherName}`}
          emoji="🏫"
          date={data.date}
          extra={
            <div style={{ marginTop: '16px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  textAlign: 'left',
                  maxWidth: '400px',
                  margin: '0 auto',
                }}
              >
                <div style={{ padding: '8px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                  <div style={{ fontSize: '9pt', color: '#666' }}>Учеников</div>
                  <div style={{ fontSize: '16pt', fontWeight: 'bold', color: DUO_GREEN }}>{data.students.length}</div>
                </div>
                <div style={{ padding: '8px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                  <div style={{ fontSize: '9pt', color: '#666' }}>Средний XP</div>
                  <div style={{ fontSize: '16pt', fontWeight: 'bold', color: DUO_YELLOW }}>{avgXP}</div>
                </div>
                <div style={{ padding: '8px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                  <div style={{ fontSize: '9pt', color: '#666' }}>Средняя точность</div>
                  <div style={{ fontSize: '16pt', fontWeight: 'bold', color: DUO_BLUE }}>{avgAccuracy}%</div>
                </div>
                <div style={{ padding: '8px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                  <div style={{ fontSize: '9pt', color: '#666' }}>Средний балл</div>
                  <div style={{ fontSize: '16pt', fontWeight: 'bold', color: DUO_PURPLE }}>{avgPredicted}</div>
                </div>
              </div>
            </div>
          }
        />
      </ReportPage>

      {/* Page 2-3: Student Progress */}
      <ReportPage pageNum={2} totalPages={totalPages}>
        <SectionTitle>Прогресс по ученикам</SectionTitle>
        <p style={{ fontSize: '10pt', color: '#666', marginBottom: '8px' }}>
          Сортировка по XP (убывание):
        </p>
        <ReportTable
          headers={['#', 'Имя', 'Уровень', 'XP', 'Точность', 'Уроки', 'Streak', 'Балл']}
          rows={data.students
            .sort((a, b) => b.xp - a.xp)
            .slice(0, 10)
            .map((st, i) => [
              i + 1,
              `${st.emoji} ${st.name}`,
              st.level,
              st.xp,
              `${st.accuracy}%`,
              st.lessonsCompleted,
              `${st.streak} дн.`,
              st.predictedScore,
            ])}
          compact
        />
      </ReportPage>

      {/* Page 4: Class Weak Topics */}
      <ReportPage pageNum={3} totalPages={totalPages}>
        <SectionTitle>Слабые темы класса</SectionTitle>
        {data.classWeakTopics.length > 0 ? (
          <>
            <p style={{ fontSize: '10pt', color: '#666', marginBottom: '8px' }}>
              Общие ошибки (агрегированные по всем ученикам):
            </p>
            <ReportTable
              headers={['Задание', 'Учеников с ошибками', '% ошибок']}
              rows={data.classWeakTopics.map((wt) => [
                wt.task,
                wt.studentCount,
                `${wt.errorPercent}%`,
              ])}
            />
          </>
        ) : (
          <p style={{ color: '#999', fontSize: '10pt' }}>Нет общих слабых тем. Класс молодец!</p>
        )}
      </ReportPage>

      {/* Page 5: Homework */}
      <ReportPage pageNum={4} totalPages={totalPages}>
        <SectionTitle>Домашние задания</SectionTitle>
        {data.homework.length > 0 ? (
          <ReportTable
            headers={['Название', 'Дедлайн', 'Сдавшие', 'Не сдавшие', 'Статус']}
            rows={data.homework.map((hw) => [
              hw.title,
              hw.deadline,
              hw.completed,
              hw.total - hw.completed,
              hw.status,
            ])}
          />
        ) : (
          <p style={{ color: '#999', fontSize: '10pt' }}>Нет домашних заданий</p>
        )}
      </ReportPage>

      {/* Page 6: Recommendations */}
      <ReportPage pageNum={5} totalPages={totalPages}>
        <SectionTitle>Рекомендации для класса</SectionTitle>
        {data.recommendations.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data.recommendations.map((rec, i) => (
              <div
                key={i}
                style={{
                  padding: '10px',
                  backgroundColor: '#f0f9e6',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${DUO_GREEN}`,
                  fontSize: '10pt',
                }}
              >
                {rec}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#999', fontSize: '10pt' }}>Рекомендаций пока нет</p>
        )}
        {data.classWeakTopics.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            <h3 style={{ fontSize: '11pt', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
              На что обратить внимание на уроке
            </h3>
            <p style={{ fontSize: '10pt', color: '#666' }}>
              Классу нужно повторить: {data.classWeakTopics.slice(0, 3).map((w) => w.task).join(', ')}
            </p>
          </div>
        )}
      </ReportPage>
    </>
  )
}

function StudentReport({ data }: { data: ReportPreviewData }) {
  const totalPages = 6

  return (
    <>
      {/* Page 1: Cover + Achievements */}
      <ReportPage pageNum={1} totalPages={totalPages}>
        <CoverPage
          title={`Моё портфолио: ${data.studentName}`}
          subtitle={`${data.studentEmoji} Личный отчёт`}
          emoji={data.studentEmoji}
          date={data.date}
          extra={
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '14pt', fontWeight: 'bold', color: DUO_GREEN, marginBottom: '8px' }}>
                Достижения: {data.achievements.length}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', maxWidth: '400px' }}>
                {data.achievements.slice(0, 12).map((ach) => (
                  <span
                    key={ach.id}
                    style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      backgroundColor: '#f0f9e6',
                      borderRadius: '12px',
                      fontSize: '8pt',
                      color: '#333',
                    }}
                  >
                    🏆 {ach.title}
                  </span>
                ))}
                {data.achievements.length > 12 && (
                  <span style={{ fontSize: '8pt', color: '#999' }}>+{data.achievements.length - 12} ещё</span>
                )}
              </div>
            </div>
          }
        />
      </ReportPage>

      {/* Page 2: Exam Results */}
      <ReportPage pageNum={2} totalPages={totalPages}>
        <SectionTitle>Пройденные варианты</SectionTitle>
        {data.examResults.length > 0 ? (
          <>
            <ReportTable
              headers={['Вариант', 'Дата', 'Первичный балл', 'Тестовый балл']}
              rows={data.examResults.map((er) => [
                er.variant,
                er.date,
                er.primaryScore,
                er.secondaryScore,
              ])}
            />
            {data.examResults.length > 1 && (
              <div style={{ marginTop: '16px' }}>
                <h3 style={{ fontSize: '11pt', color: '#666', marginBottom: '8px' }}>Динамика</h3>
                <MiniBarChart
                  data={data.examResults.map((er, i) => ({ label: `В${i + 1}`, value: er.secondaryScore }))}
                  maxValue={100}
                  color={DUO_PURPLE}
                />
              </div>
            )}
          </>
        ) : (
          <p style={{ color: '#999', fontSize: '10pt' }}>Пока нет пройденных вариантов</p>
        )}
      </ReportPage>

      {/* Page 3: Task Stats */}
      <ReportPage pageNum={3} totalPages={totalPages}>
        <SectionTitle>Статистика по заданиям</SectionTitle>
        {data.taskStats.length > 0 ? (
          <ReportTable
            headers={['Задание', 'Всего попыток', 'Правильных', 'Точность', 'Среднее время']}
            rows={data.taskStats.map((ts) => [
              `Задание ${ts.taskNum}`,
              ts.total,
              ts.correct,
              `${ts.accuracy}%`,
              `${ts.avgTime}с`,
            ])}
            compact
          />
        ) : (
          <p style={{ color: '#999', fontSize: '10pt' }}>Пока нет данных по заданиям</p>
        )}
      </ReportPage>

      {/* Page 4: Knowledge Map */}
      <ReportPage pageNum={4} totalPages={totalPages}>
        <SectionTitle>Карта знаний</SectionTitle>
        {data.knowledgeMap.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.knowledgeMap.map((km, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '10pt', fontWeight: 'bold', color: '#333' }}>{km.section}</span>
                  <span style={{ fontSize: '10pt', color: '#666' }}>
                    {km.completed} / {km.total}
                  </span>
                </div>
                <ProgressBar value={km.completed} max={km.total} color={km.color} height={12} />
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#999', fontSize: '10pt' }}>Карта знаний в процессе формирования</p>
        )}
      </ReportPage>

      {/* Page 5: SRS */}
      <ReportPage pageNum={5} totalPages={totalPages}>
        <SectionTitle>Интервальное повторение (SRS)</SectionTitle>
        {data.srsItems.length > 0 ? (
          <ReportTable
            headers={['Урок', 'Следующее повторение', 'Интервал']}
            rows={data.srsItems.map((srs) => [srs.lesson, srs.nextReview, srs.interval])}
          />
        ) : (
          <p style={{ color: '#999', fontSize: '10pt' }}>Нет данных о повторениях</p>
        )}
      </ReportPage>

      {/* Page 6: Smart Path */}
      <ReportPage pageNum={6} totalPages={totalPages}>
        <SectionTitle>Smart Path — рекомендации</SectionTitle>
        {data.smartPath.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {data.smartPath.map((sp, i) => (
              <div
                key={i}
                style={{
                  padding: '12px',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${sp.sectionColor || DUO_GREEN}`,
                }}
              >
                <div style={{ fontSize: '11pt', fontWeight: 'bold', color: '#333' }}>{sp.title}</div>
                <div style={{ fontSize: '9pt', color: '#666', marginTop: '4px' }}>{sp.description}</div>
                <div style={{ fontSize: '8pt', color: '#999', marginTop: '4px' }}>Приоритет: {sp.priority}%</div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#999', fontSize: '10pt' }}>Рекомендаций пока нет</p>
        )}
      </ReportPage>
    </>
  )
}

function ClassReport({ data }: { data: ReportPreviewData }) {
  const totalPages = 3
  const avgXP =
    data.students.length > 0
      ? Math.round(data.students.reduce((s, st) => s + st.xp, 0) / data.students.length)
      : 0
  const avgPredicted =
    data.students.length > 0
      ? Math.round(data.students.reduce((s, st) => s + st.predictedScore, 0) / data.students.length)
      : 0

  const scoreDistribution = [
    { label: '0-30', value: data.students.filter((s) => s.predictedScore <= 30).length },
    { label: '31-50', value: data.students.filter((s) => s.predictedScore > 30 && s.predictedScore <= 50).length },
    { label: '51-70', value: data.students.filter((s) => s.predictedScore > 50 && s.predictedScore <= 70).length },
    { label: '71-85', value: data.students.filter((s) => s.predictedScore > 70 && s.predictedScore <= 85).length },
    { label: '86-100', value: data.students.filter((s) => s.predictedScore > 85).length },
  ]
  const maxDist = Math.max(1, ...scoreDistribution.map((d) => d.value))

  const xpDistribution = [
    { label: '0-100', value: data.students.filter((s) => s.xp <= 100).length },
    { label: '101-500', value: data.students.filter((s) => s.xp > 100 && s.xp <= 500).length },
    { label: '501-1k', value: data.students.filter((s) => s.xp > 500 && s.xp <= 1000).length },
    { label: '1k+', value: data.students.filter((s) => s.xp > 1000).length },
  ]
  const maxXpDist = Math.max(1, ...xpDistribution.map((d) => d.value))

  const sortedByScore = [...data.students].sort((a, b) => b.predictedScore - a.predictedScore)
  const leader = sortedByScore[0]
  const laggards = sortedByScore.slice(-3).filter((s) => s.predictedScore < 50)

  return (
    <>
      {/* Page 1: Cover + Summary Table */}
      <ReportPage pageNum={1} totalPages={totalPages}>
        <CoverPage
          title={`Сравнительный отчёт: ${data.className}`}
          subtitle={`Учитель: ${data.teacherName}`}
          emoji="📊"
          date={data.date}
          extra={
            <div style={{ marginTop: '16px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  textAlign: 'left',
                  maxWidth: '400px',
                  margin: '0 auto',
                }}
              >
                <div style={{ padding: '8px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                  <div style={{ fontSize: '9pt', color: '#666' }}>Учеников</div>
                  <div style={{ fontSize: '16pt', fontWeight: 'bold', color: DUO_GREEN }}>{data.students.length}</div>
                </div>
                <div style={{ padding: '8px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                  <div style={{ fontSize: '9pt', color: '#666' }}>Средний XP</div>
                  <div style={{ fontSize: '16pt', fontWeight: 'bold', color: DUO_YELLOW }}>{avgXP}</div>
                </div>
                <div style={{ padding: '8px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                  <div style={{ fontSize: '9pt', color: '#666' }}>Средний балл</div>
                  <div style={{ fontSize: '16pt', fontWeight: 'bold', color: DUO_PURPLE }}>{avgPredicted}</div>
                </div>
                <div style={{ padding: '8px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                  <div style={{ fontSize: '9pt', color: '#666' }}>Лидер</div>
                  <div style={{ fontSize: '14pt', fontWeight: 'bold', color: DUO_BLUE }}>
                    {leader ? `${leader.emoji} ${leader.name}` : '—'}
                  </div>
                </div>
              </div>
            </div>
          }
        />
      </ReportPage>

      {/* Page 2: Metrics table */}
      <ReportPage pageNum={2} totalPages={totalPages}>
        <SectionTitle>Метрики по ученикам</SectionTitle>
        <ReportTable
          headers={['Имя', 'XP', 'Уровень', 'Точность', 'Уроки', 'Балл']}
          rows={data.students.map((st) => [
            `${st.emoji} ${st.name}`,
            st.xp,
            st.level,
            `${st.accuracy}%`,
            st.lessonsCompleted,
            st.predictedScore,
          ])}
          compact
        />
      </ReportPage>

      {/* Page 3: Charts + Analysis */}
      <ReportPage pageNum={3} totalPages={totalPages}>
        <SectionTitle>Распределение и анализ</SectionTitle>
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '11pt', color: '#666', marginBottom: '8px' }}>Распределение по баллам</h3>
          <MiniBarChart data={scoreDistribution} maxValue={maxDist} color={DUO_PURPLE} />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '11pt', color: '#666', marginBottom: '8px' }}>Распределение по XP</h3>
          <MiniBarChart data={xpDistribution} maxValue={maxXpDist} color={DUO_YELLOW} />
        </div>
        <div style={{ padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '11pt', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>Анализ</h3>
          {leader && (
            <p style={{ fontSize: '10pt', color: '#666', marginBottom: '4px' }}>
              <strong>Лидер:</strong> {leader.name} ({leader.predictedScore} баллов, {leader.xp} XP)
            </p>
          )}
          {laggards.length > 0 ? (
            <p style={{ fontSize: '10pt', color: '#666' }}>
              <strong>Отстают:</strong> {laggards.map((s) => `${s.name} (${s.predictedScore})`).join(', ')}
            </p>
          ) : (
            <p style={{ fontSize: '10pt', color: DUO_GREEN }}>Все ученики на хорошем уровне!</p>
          )}
        </div>
      </ReportPage>
    </>
  )
}
