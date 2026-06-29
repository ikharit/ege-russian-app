import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// PWA registration — non-blocking, with user-controlled update
import { registerSW } from 'virtual:pwa-register'

// Track if update is available
let updateAvailable = false
let updateServiceWorker: (() => Promise<void>) | null = null

const swRegistration = registerSW({
  onNeedRefresh() {
    updateAvailable = true
    console.log('[PWA] Update available')
    // Dispatch custom event so UI can show update button
    window.dispatchEvent(new CustomEvent('pwa-update-available'))
  },
  onOfflineReady() {
    console.log('[PWA] App ready to work offline')
  },
  onRegisterError(error) {
    console.error('[PWA] Registration error:', error)
  },
})

// Store the update function for UI access
updateServiceWorker = swRegistration ? () => swRegistration(false) : null

// @ts-ignore — expose for PWAUpdateToast component
window.__updateServiceWorker = updateServiceWorker

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)

// Dev-mode audit: validate all questions on startup
if (import.meta.env.DEV) {
  import('./utils/auditRunner').then(({ runAudit, printAuditReport }) => {
    import('./data/accentWords').then(({ accentWords }) => {
      const report = runAudit([
        { name: 'accent', questions: accentWords },
      ])
      printAuditReport(report)
    })
  })
}

// Safety net: if root is empty after 10s, show a friendly error
setTimeout(() => {
  const root = document.getElementById('root')
  if (root && root.children.length === 0) {
    root.innerHTML = `
      <div style="font-family:system-ui,sans-serif;max-width:400px;margin:80px auto;text-align:center;padding:20px">
        <h2 style="color:#333">⏳ Загрузка...</h2>
        <p style="color:#666;font-size:14px;margin:12px 0">
          Если приложение не загружается, попробуйте:
        </p>
        <ol style="text-align:left;color:#666;font-size:14px;line-height:1.6">
          <li>Обновить страницу (pull-to-refresh)</li>
          <li>Очистить кэш браузера</li>
          <li>В Chrome: Settings → Site Settings → Storage → Clear</li>
          <li>Если ничего не помогает — удалить ярлык с домашнего экрана и добавить заново</li>
        </ol>
        <button onclick="location.reload()" 
          style="margin-top:20px;padding:10px 24px;background:#58cc02;color:#fff;border:none;border-radius:12px;font-size:16px;font-weight:bold;cursor:pointer">
          🔄 Перезагрузить
        </button>
      </div>
    `
  }
}, 10000)

// @ts-ignore — type for global window
declare global {
  interface Window {
    __updateServiceWorker?: (() => Promise<void>) | null
  }
}