import { initializeApp } from 'firebase/app'
import { getAuth, setPersistence, indexedDBLocalPersistence } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCv9HVAlFaErjnncku9dFfcL1x664RCF9Q",
  authDomain: "aprende-97487.firebaseapp.com",
  projectId: "aprende-97487",
  storageBucket: "aprende-97487.firebasestorage.app",
  messagingSenderId: "678435140057",
  appId: "1:678435140057:web:28c87aed799caed50ca9c8"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

// Persistencia en IndexedDB (funciona bien en Android WebView)
setPersistence(auth, indexedDBLocalPersistence).catch(console.error)
