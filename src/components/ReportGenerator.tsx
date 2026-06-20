import { useState, useCallback } from 'react'
import { X, FileText, Share2, Mail, Loader2, CheckCircle, Calendar } from 'lucide-react'
import { ReportPreview } from './ReportPreview'
import {
  generatePDF,
  buildParentReportData,
  buildTeacherReportData,
  buildStudentReportData,
  buildClassComparisonReportData,
  type ReportOptions,
} from '../utils/pdfGenerator'
import { useProgressStore } from '../stores/progressStore'

interface ReportGeneratorProps {
  isOpen: boolean
  onClose: () => void
  options: ReportOptions
}

type PeriodType = 'all' | 'month' | 'week'

export function ReportGenerator({ isOpen, onClose, options }: ReportGeneratorProps) {
  const [activeTab, setActiveTab] = useState<ReportOptions['type']>(options.type)
  const [period, setPeriod] = useState<PeriodType>('all')
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeRecommendations, setIncludeRecommendations] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [generated, setGenerated] = useState(false)

  const examDate = useProgressStore((s) => s.examDate)

  const getPeriodLabel = (p: PeriodType): string => {
    switch (p) {
      case 'all':
        return 'За всё время'
      case 'month':
        return 'За месяц'
      case 'week':
        return 'За неделю'
    }
  }

  const buildData = useCallback(() => {
    switch (activeTab) {
      case 'parent':
        return buildParentReportData(options.studentId || 'default')
      case 'teacher':
        return buildTeacherReportData(options.classId || '')
      case 'student':
        return buildStudentReportData()
      case 'class':
        return buildClassComparisonReportData(options.classId || '')
      default:
        return buildStudentReportData()
    }
  }, [activeTab, options.studentId, options.classId])

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const data = buildData()
      const filename = `report_${activeTab}_${new Date().toISOString().split('T')[0]}.pdf`
      await generatePDF(<ReportPreview data={data} />, filename)
      setGenerated(true)
      setTimeout(() => setGenerated(false), 3000)
    } catch (e) {
      console.error('PDF generation failed:', e)
      alert('Ошибка генерации PDF: ' + (e instanceof Error ? e.message : 'Unknown error'))
    } finally {
      setIsGenerating(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Отчёт о прогрессе',
          text: `Посмотри мой отчёт по подготовке к ЕГЭ! До экзамена ${examDate ? Math.ceil((new Date(examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : '?'} дней.`,
        })
      } catch {
        // User cancelled
      }
    } else {
      alert('Web Share API не поддерживается в этом браузере')
    }
  }

  const handleEmail = () => {
    const subject = encodeURIComponent('Отчёт о прогрессе — ЕГЭ Русский')
    const body = encodeURIComponent(
      `Привет!\n\nВот мой отчёт по подготовке к ЕГЭ по русскому языку.\n\nДата: ${new Date().toLocaleDateString('ru-RU')}\n\nСгенерировано в приложении «ЕГЭ Русский — Подготовка».`
    )
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank')
  }

  const previewData = buildData()

  const tabs = [
    { key: 'parent' as const, label: 'Родительский', icon: '👨‍👩‍👧' },
    { key: 'teacher' as const, label: 'Учительский', icon: '👨‍🏫' },
    { key: 'student' as const, label: 'Портфолио', icon: '🎓' },
    { key: 'class' as const, label: 'Сравнение', icon: '📊' },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-duo-green" />
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Генератор отчётов</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-2 bg-gray-50 dark:bg-gray-900 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key)
                setGenerated(false)
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-duo-green text-white shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Period selector */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">
              Период
            </label>
            <div className="flex gap-2">
              {(['all', 'month', 'week'] as PeriodType[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${
                    period === p
                      ? 'bg-duo-blue text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {getPeriodLabel(p)}
                </button>
              ))}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeCharts}
                onChange={(e) => setIncludeCharts(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-duo-green focus:ring-duo-green"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Включить графики</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeRecommendations}
                onChange={(e) => setIncludeRecommendations(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-duo-green focus:ring-duo-green"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Включить рекомендации</span>
            </label>
          </div>

          {/* Preview toggle */}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="w-full py-2 rounded-lg text-sm font-bold text-duo-blue bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 transition-colors"
          >
            {showPreview ? 'Скрыть предпросмотр' : 'Показать предпросмотр'}
          </button>

          {/* Preview */}
          {showPreview && (
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white">
              <div className="p-2 bg-gray-50 dark:bg-gray-900 text-xs text-gray-500 font-bold text-center">
                Предпросмотр (1-2 страницы)
              </div>
              <div className="overflow-auto max-h-80">
                <div style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: '200%' }}>
                  <ReportPreview data={previewData} />
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                generated
                  ? 'bg-duo-green text-white'
                  : 'bg-duo-green text-white hover:bg-duo-green/90'
              } ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isGenerating ? (
                <Loader2 size={18} className="animate-spin" />
              ) : generated ? (
                <CheckCircle size={18} />
              ) : (
                <FileText size={18} />
              )}
              {isGenerating ? 'Генерация...' : generated ? 'Сохранено!' : 'Сгенерировать PDF'}
            </button>

            <div className="flex gap-2">
              <button
                onClick={handleShare}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
              >
                <Share2 size={16} />
                Поделиться
              </button>
              <button
                onClick={handleEmail}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
              >
                <Mail size={16} />
                Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
