import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
import { PushNotifications } from '@capacitor/push-notifications'
import { SplashScreen } from '@capacitor/splash-screen'
import { StatusBar, Style } from '@capacitor/status-bar'
import { Keyboard } from '@capacitor/keyboard'
import { App } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'

const isNative = Capacitor.isNativePlatform()

/**
 * Initialize mobile-specific features on app start
 */
export async function initMobile() {
  if (!isNative) return

  // Hide splash screen after delay (already configured in capacitor.config.json)
  await SplashScreen.hide()

  // Set status bar style (light content on dark background, or dark on light)
  const isDark = document.documentElement.classList.contains('dark')
  await StatusBar.setStyle({ style: isDark ? Style.Dark : Style.Light })
  await StatusBar.setBackgroundColor({ color: isDark ? '#1f2937' : '#ffffff' })

  // Configure keyboard
  await Keyboard.setScroll({ isDisabled: false })

  // Register push notifications
  await registerPushNotifications()

  // App state listener (background/foreground)
  App.addListener('appStateChange', ({ isActive }) => {
    if (isActive) {
      // App came to foreground — check heart restore, sync data
      console.log('App is active')
    }
  })

  // Back button handler (Android)
  App.addListener('backButton', ({ canGoBack }) => {
    if (!canGoBack) {
      App.exitApp()
    }
  })
}

// ── Haptics ────────────────────────────────────────────────

export async function hapticsImpact(style: 'light' | 'medium' | 'heavy' = 'medium') {
  if (!isNative) {
    // Fallback to Vibration API on web
    if (navigator.vibrate) {
      navigator.vibrate(style === 'light' ? 10 : style === 'medium' ? 20 : 30)
    }
    return
  }
  const map: Record<string, ImpactStyle> = {
    light: ImpactStyle.Light,
    medium: ImpactStyle.Medium,
    heavy: ImpactStyle.Heavy,
  }
  await Haptics.impact({ style: map[style] || ImpactStyle.Medium })
}

export async function hapticsNotification(type: 'success' | 'warning' | 'error') {
  if (!isNative) {
    if (navigator.vibrate) {
      const pattern = type === 'success' ? [10, 50, 10] : type === 'warning' ? [20, 30, 20] : [50, 30, 50]
      navigator.vibrate(pattern)
    }
    return
  }
  const map: Record<string, NotificationType> = {
    success: NotificationType.Success,
    warning: NotificationType.Warning,
    error: NotificationType.Error,
  }
  await Haptics.notification({ type: map[type] || NotificationType.Success })
}

export async function hapticsVibrate(duration = 20) {
  if (!isNative) {
    if (navigator.vibrate) navigator.vibrate(duration)
    return
  }
  await Haptics.vibrate({ duration })
}

// ── Push Notifications ───────────────────────────────────

async function registerPushNotifications() {
  try {
    // Request permission
    const permStatus = await PushNotifications.checkPermissions()
    if (permStatus.receive === 'prompt') {
      await PushNotifications.requestPermissions()
    }

    if (permStatus.receive !== 'granted') {
      console.log('Push notification permission not granted')
      return
    }

    // Register with FCM / APNs
    await PushNotifications.register()

    // Listeners
    PushNotifications.addListener('registration', (token) => {
      console.log('Push registration token:', token.value)
      // TODO: Send token to backend
    })

    PushNotifications.addListener('registrationError', (err) => {
      console.error('Push registration error:', err.error)
    })

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push received:', notification)
      // Show in-app notification or update badge
    })

    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      console.log('Push action performed:', action)
      // Handle notification tap (e.g., navigate to specific screen)
    })

    // Get delivered notifications (for badge count)
    const delivered = await PushNotifications.getDeliveredNotifications()
    console.log('Delivered notifications:', delivered)
  } catch (e) {
    console.error('Push notification setup failed:', e)
  }
}

/**
 * Schedule a local push notification (reminder)
 */
export async function scheduleLocalNotification(options: {
  title: string
  body: string
  id: number
  at: Date
  extra?: Record<string, string>
}) {
  if (!isNative) return

  // Capacitor Local Notifications plugin needed
  // For now, skip — add @capacitor/local-notifications if needed
  console.log('Local notification scheduled:', options)
}

// ── Status Bar ───────────────────────────────────────────

export async function setStatusBarColor(color: string, isDark = false) {
  if (!isNative) return
  await StatusBar.setBackgroundColor({ color })
  await StatusBar.setStyle({ style: isDark ? Style.Dark : Style.Light })
}

// ── Keyboard ─────────────────────────────────────────────

export async function hideKeyboard() {
  if (!isNative) return
  await Keyboard.hide()
}

export async function showKeyboard() {
  if (!isNative) return
  await Keyboard.show()
}

// ── App Info ─────────────────────────────────────────────

export function getPlatform() {
  return Capacitor.getPlatform() // 'ios', 'android', or 'web'
}

export function isNativePlatform() {
  return isNative
}
