import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore'
import { getMessaging } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "ege-russian-app.firebaseapp.com",
  projectId: "ege-russian-app",
  storageBucket: "ege-russian-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const messaging = getMessaging(app)

enableIndexedDbPersistence(db).catch((err: { code?: string }) => {
  if (err.code === 'failed-precondition') {
    console.warn('Firebase persistence failed: multiple tabs open')
  } else if (err.code === 'unimplemented') {
    console.warn('Firebase persistence not supported in this browser')
  } else {
    console.warn('Firebase persistence error:', err)
  }
})
