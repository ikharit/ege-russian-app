const DB_NAME = 'ege-russian-cache'
const DB_VERSION = 1

let db: IDBDatabase | null = null

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (db) return resolve(db)
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      db = request.result
      resolve(db)
    }
    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result
      if (!database.objectStoreNames.contains('questions')) {
        database.createObjectStore('questions', { keyPath: 'taskNumber' })
      }
      if (!database.objectStoreNames.contains('progress')) {
        database.createObjectStore('progress', { keyPath: 'id' })
      }
      if (!database.objectStoreNames.contains('theory')) {
        database.createObjectStore('theory', { keyPath: 'taskNumber' })
      }
    }
  })
}

export async function cacheQuestions(taskNumber: string, questions: any[]) {
  const database = await openDB()
  const tx = database.transaction('questions', 'readwrite')
  const store = tx.objectStore('questions')
  store.put({ taskNumber, questions, cachedAt: Date.now() })
  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function getCachedQuestions(taskNumber: string): Promise<any[] | null> {
  const database = await openDB()
  const tx = database.transaction('questions', 'readonly')
  const store = tx.objectStore('questions')
  const request = store.get(taskNumber)
  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      const result = request.result
      resolve(result ? result.questions : null)
    }
    request.onerror = () => reject(request.error)
  })
}

export async function cacheProgress(progress: any) {
  const database = await openDB()
  const tx = database.transaction('progress', 'readwrite')
  const store = tx.objectStore('progress')
  store.put({ id: 'main', progress, cachedAt: Date.now() })
  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function getCachedProgress(): Promise<any | null> {
  const database = await openDB()
  const tx = database.transaction('progress', 'readonly')
  const store = tx.objectStore('progress')
  const request = store.get('main')
  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      const result = request.result
      resolve(result ? result.progress : null)
    }
    request.onerror = () => reject(request.error)
  })
}

export async function cacheTheory(taskNumber: string, content: string) {
  const database = await openDB()
  const tx = database.transaction('theory', 'readwrite')
  const store = tx.objectStore('theory')
  store.put({ taskNumber, content, cachedAt: Date.now() })
  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function getCachedTheory(taskNumber: string): Promise<string | null> {
  const database = await openDB()
  const tx = database.transaction('theory', 'readonly')
  const store = tx.objectStore('theory')
  const request = store.get(taskNumber)
  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      const result = request.result
      resolve(result ? result.content : null)
    }
    request.onerror = () => reject(request.error)
  })
}

export function isOnline(): boolean {
  return navigator.onLine
}

export async function syncProgressIfOnline(progress: any) {
  await cacheProgress(progress)
  if (isOnline()) {
    // Could trigger sync with Supabase here
  }
}
