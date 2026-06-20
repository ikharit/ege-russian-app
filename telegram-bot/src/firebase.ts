import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

let db: ReturnType<typeof getFirestore> | null = null

export function initFirebase() {
  if (db) return db

  try {
    const projectId = process.env.FIREBASE_PROJECT_ID
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH

    if (serviceAccountPath) {
      const serviceAccount = require(serviceAccountPath) as ServiceAccount
      initializeApp({
        credential: cert(serviceAccount),
      })
    } else if (projectId) {
      initializeApp({
        projectId,
      })
    } else {
      console.warn('Firebase not configured. Using local JSON fallback.')
      return null
    }

    db = getFirestore()
    console.log('Firebase initialized successfully')
    return db
  } catch (error) {
    console.error('Firebase init error:', error)
    return null
  }
}

export function getDb() {
  return db
}

export async function getUserProgress(userId: string): Promise<Record<string, unknown> | null> {
  if (!db) return null
  try {
    const doc = await db.collection('users').doc(userId).get()
    return doc.exists ? (doc.data() as Record<string, unknown>) : null
  } catch {
    return null
  }
}

export async function updateUserProgress(userId: string, data: Record<string, unknown>): Promise<void> {
  if (!db) return
  try {
    await db.collection('users').doc(userId).update(data)
  } catch {
    // Silently fail if offline
  }
}
