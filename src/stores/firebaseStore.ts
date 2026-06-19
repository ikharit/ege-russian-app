import { create } from 'zustand'
import { auth, db } from '../config/firebase'
import { signInAnonymously, onAuthStateChanged, User } from 'firebase/auth'
import {
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { useProgressStore } from './progressStore'
import { useClassStore, ClassRoom, ProgressData } from './classStore'

const OFFLINE_QUEUE_KEY = 'ege-firebase-offline-queue'

interface SyncOperation {
  type: 'progress' | 'class'
  payload: Record<string, unknown>
  timestamp: string
}

interface FirebaseStoreState {
  isOnline: boolean
  isSyncing: boolean
  lastSync: string | null
  firebaseUser: User | null
}

interface FirebaseStoreActions {
  syncProgress: () => Promise<void>
  syncClassData: (classId: string) => Promise<void>
  setupOfflineListener: () => () => void
  initFirebase: () => Promise<void>
  migrateToFirebase: () => Promise<void>
  processOfflineQueue: () => Promise<void>
  setOnline: (online: boolean) => void
  setSyncing: (syncing: boolean) => void
  setLastSync: (ts: string | null) => void
  setFirebaseUser: (user: User | null) => void
}

export type FirebaseStore = FirebaseStoreState & FirebaseStoreActions

function getOfflineQueue(): SyncOperation[] {
  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY)
    return raw ? (JSON.parse(raw) as SyncOperation[]) : []
  } catch {
    return []
  }
}

function saveOfflineQueue(queue: SyncOperation[]): void {
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue))
}

function addToOfflineQueue(op: SyncOperation): void {
  const queue = getOfflineQueue()
  queue.push(op)
  saveOfflineQueue(queue)
}

export const useFirebaseStore = create<FirebaseStore>((set, get) => ({
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  isSyncing: false,
  lastSync: null,
  firebaseUser: null,

  setOnline: (online: boolean) => set({ isOnline: online }),
  setSyncing: (syncing: boolean) => set({ isSyncing: syncing }),
  setLastSync: (ts: string | null) => set({ lastSync: ts }),
  setFirebaseUser: (user: User | null) => set({ firebaseUser: user }),

  initFirebase: async () => {
    try {
      const userCredential = await signInAnonymously(auth)
      get().setFirebaseUser(userCredential.user)

      onAuthStateChanged(auth, (user) => {
        get().setFirebaseUser(user)
      })
    } catch (err) {
      console.warn('Firebase anonymous auth failed:', err)
    }
  },

  syncProgress: async () => {
    const { firebaseUser, isOnline } = get()
    if (!firebaseUser || !isOnline) {
      // Queue for later
      const progress = useProgressStore.getState()
      addToOfflineQueue({
        type: 'progress',
        payload: {
          userStats: progress.userStats,
          lessonProgress: progress.lessonProgress,
          atomProgress: progress.atomProgress,
          wrongAnswers: progress.wrongAnswers,
          achievements: progress.achievements,
          taskStats: progress.taskStats,
          dailyQuestProgress: progress.dailyQuestProgress,
          theoryTestsCompleted: progress.theoryTestsCompleted,
          leaderboardRanks: progress.leaderboardRanks,
          teacherStudents: progress.teacherStudents,
          isTeacher: progress.isTeacher,
        },
        timestamp: new Date().toISOString(),
      })
      return
    }

    get().setSyncing(true)
    try {
      const progress = useProgressStore.getState()
      const docRef = doc(db, 'users', firebaseUser.uid, 'progress', 'main')
      await setDoc(
        docRef,
        {
          userStats: progress.userStats,
          lessonProgress: progress.lessonProgress,
          atomProgress: progress.atomProgress,
          wrongAnswers: progress.wrongAnswers,
          achievements: progress.achievements,
          taskStats: progress.taskStats,
          dailyQuestProgress: progress.dailyQuestProgress,
          theoryTestsCompleted: progress.theoryTestsCompleted,
          leaderboardRanks: progress.leaderboardRanks,
          teacherStudents: progress.teacherStudents,
          isTeacher: progress.isTeacher,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )
      get().setLastSync(new Date().toISOString())
    } catch (err) {
      console.error('Firebase syncProgress error:', err)
    } finally {
      get().setSyncing(false)
    }
  },

  syncClassData: async (classId: string) => {
    const { firebaseUser, isOnline } = get()
    if (!firebaseUser || !isOnline) {
      const classStore = useClassStore.getState()
      const classRoom = classStore.getClassById(classId)
      if (classRoom) {
        addToOfflineQueue({
          type: 'class',
          payload: { classId, classRoom },
          timestamp: new Date().toISOString(),
        })
      }
      return
    }

    get().setSyncing(true)
    try {
      const classStore = useClassStore.getState()
      const classRoom = classStore.getClassById(classId)
      if (!classRoom) return

      const docRef = doc(db, 'classes', classId)
      await setDoc(
        docRef,
        {
          ...classRoom,
          updatedAt: serverTimestamp(),
          updatedBy: firebaseUser.uid,
        },
        { merge: true }
      )
      get().setLastSync(new Date().toISOString())
    } catch (err) {
      console.error('Firebase syncClassData error:', err)
    } finally {
      get().setSyncing(false)
    }
  },

  setupOfflineListener: () => {
    const handleOnline = () => {
      get().setOnline(true)
      get().processOfflineQueue().catch(() => {})
    }
    const handleOffline = () => {
      get().setOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  },

  processOfflineQueue: async () => {
    const queue = getOfflineQueue()
    if (queue.length === 0) return
    const { firebaseUser, isOnline } = get()
    if (!firebaseUser || !isOnline) return

    get().setSyncing(true)
    try {
      const remaining: SyncOperation[] = []
      for (const op of queue) {
        try {
          if (op.type === 'progress') {
            const docRef = doc(db, 'users', firebaseUser.uid, 'progress', 'main')
            await setDoc(docRef, { ...op.payload, updatedAt: serverTimestamp() }, { merge: true })
          } else if (op.type === 'class') {
            const classId = op.payload.classId as string
            const docRef = doc(db, 'classes', classId)
            await setDoc(docRef, { ...op.payload.classRoom, updatedAt: serverTimestamp(), updatedBy: firebaseUser.uid }, { merge: true })
          }
        } catch {
          remaining.push(op)
        }
      }
      saveOfflineQueue(remaining)
      if (remaining.length === 0) {
        get().setLastSync(new Date().toISOString())
      }
    } catch (err) {
      console.error('Firebase processOfflineQueue error:', err)
    } finally {
      get().setSyncing(false)
    }
  },

  migrateToFirebase: async () => {
    const { firebaseUser, isOnline } = get()
    if (!firebaseUser || !isOnline) {
      console.warn('Cannot migrate: offline or no user')
      return
    }

    get().setSyncing(true)
    try {
      const progress = useProgressStore.getState()
      const classStore = useClassStore.getState()

      // Migrate progress
      const progressDoc = doc(db, 'users', firebaseUser.uid, 'progress', 'main')
      await setDoc(
        progressDoc,
        {
          userStats: progress.userStats,
          lessonProgress: progress.lessonProgress,
          atomProgress: progress.atomProgress,
          wrongAnswers: progress.wrongAnswers,
          achievements: progress.achievements,
          taskStats: progress.taskStats,
          dailyQuestProgress: progress.dailyQuestProgress,
          theoryTestsCompleted: progress.theoryTestsCompleted,
          leaderboardRanks: progress.leaderboardRanks,
          teacherStudents: progress.teacherStudents,
          isTeacher: progress.isTeacher,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )

      // Migrate classes
      for (const classRoom of Object.values(classStore.classes)) {
        const classDoc = doc(db, 'classes', classRoom.id)
        await setDoc(
          classDoc,
          {
            ...classRoom,
            updatedAt: serverTimestamp(),
            updatedBy: firebaseUser.uid,
          },
          { merge: true }
        )
      }

      get().setLastSync(new Date().toISOString())
      console.log('Migration to Firebase completed')
    } catch (err) {
      console.error('Firebase migration error:', err)
    } finally {
      get().setSyncing(false)
    }
  },
}))

export function subscribeToClass(
  classId: string,
  onUpdate: (data: ClassRoom | null) => void
): () => void {
  const docRef = doc(db, 'classes', classId)
  const unsubscribe = onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as ClassRoom & { updatedAt?: Timestamp; updatedBy?: string }
        onUpdate(data)
      } else {
        onUpdate(null)
      }
    },
    (err) => {
      console.error('Firebase subscribeToClass error:', err)
      onUpdate(null)
    }
  )
  return unsubscribe
}
