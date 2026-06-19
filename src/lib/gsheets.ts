// Google Sheets integration for bidirectional sync
// Requires a Google Apps Script Web App endpoint

const GAS_WEB_APP_URL = localStorage.getItem('gas-web-app-url') || ''

export function setGASWebAppURL(url: string) {
  localStorage.setItem('gas-web-app-url', url)
}

export function getGASWebAppURL(): string {
  return GAS_WEB_APP_URL
}

export interface StudentResult {
  name: string
  date: string
  taskNumber: string
  score: number
  total: number
  accuracy: number
  notes?: string
}

export async function writeStudentResults(results: StudentResult[]): Promise<{ success: boolean; message: string }> {
  const url = getGASWebAppURL()
  if (!url) {
    return { success: false, message: 'Google Apps Script URL не настроен. Добавьте URL в настройках.' }
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'writeResults', data: results }),
    })

    if (!response.ok) {
      return { success: false, message: `Ошибка HTTP: ${response.status}` }
    }

    const data = await response.json()
    return { success: data.success || true, message: data.message || 'Данные записаны' }
  } catch (error) {
    return { success: false, message: `Ошибка сети: ${error}` }
  }
}

export async function readHomeworkData(): Promise<any[]> {
  const url = getGASWebAppURL()
  if (!url) {
    console.warn('[GSheets] URL не настроен')
    return []
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'readHomework' }),
    })

    if (!response.ok) return []
    const data = await response.json()
    return data.homework || []
  } catch {
    return []
  }
}

// Export current student results to CSV for manual upload
export function exportResultsToCSV(results: StudentResult[]): string {
  const header = 'Имя,Дата,Задание,Правильно,Всего,Точность,Примечания\n'
  const rows = results.map(r =>
    `${r.name},${r.date},${r.taskNumber},${r.score},${r.total},${r.accuracy}%,${r.notes || ''}`
  ).join('\n')
  return header + rows
}

export function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
