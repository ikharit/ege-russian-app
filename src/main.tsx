import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// PWA auto-update: reload page when new version is available
// virtual module (types available)
import { registerSW } from 'virtual:pwa-register'

registerSW({
  immediate: true,
  onNeedRefresh() {
    // Auto-reload when new build is available
    window.location.reload()
  },
  onOfflineReady() {
    console.log('[PWA] App ready to work offline')
  },
})

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
    import('./data/sections/dooshinUnified').then(({ dooshinSection }) => {
      import('./data/accentWords').then(({ accentWords }) => {
        const report = runAudit([
          { name: 'dooshin', questions: dooshinSection.lessons.flatMap(l => l.questions) },
          { name: 'accent', questions: accentWords },
        ])
        printAuditReport(report)
      })
    })
  })
}