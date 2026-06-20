importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "ege-russian-app.firebaseapp.com",
  projectId: "ege-russian-app",
  storageBucket: "ege-russian-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || payload.data?.title || 'ЕГЭ Русский'
  const notificationBody = payload.notification?.body || payload.data?.body || ''
  const iconUrl = payload.notification?.icon || '/icon-192x192.png'
  const badgeUrl = payload.data?.badge || '/badge-72x72.png'

  self.registration.showNotification(notificationTitle, {
    body: notificationBody,
    icon: iconUrl,
    badge: badgeUrl,
    data: payload.data,
    tag: payload.data?.tag || payload.messageId,
    requireInteraction: false,
    actions: [
      { action: 'open', title: 'Открыть' },
      { action: 'dismiss', title: 'Закрыть' }
    ]
  })
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'dismiss') {
    return
  }

  const urlToOpen = event.notification.data?.url || '/'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(urlToOpen)
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen)
      }
    })
  )
})

// Keep the service worker alive for FCM
self.addEventListener('push', (event) => {
  if (!event.data) return
  try {
    const payload = event.data.json()
    console.log('[FCM SW] Push received:', payload)
  } catch {
    console.log('[FCM SW] Push received (non-JSON)')
  }
})
