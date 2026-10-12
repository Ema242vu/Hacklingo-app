import { createContext, useContext, useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState({ xp: 1240, energy: 100, streak: 7, completed: [] })

  useEffect(() => {
    let active = true
    let authRequest = 0
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!active) return
      const requestId = ++authRequest
      setLoading(true)
      setUser(u)
      if (!u) {
        setProgress({ xp: 1240, energy: 100, streak: 7, completed: [] })
        setLoading(false)
        return
      }
      try {
          const ref = doc(db, 'usuarios', u.uid)
          const snap = await getDoc(ref)
          if (!active || requestId !== authRequest) return
          if (snap.exists()) {
            setProgress({ xp: 1240, energy: 100, streak: 7, completed: [], ...snap.data() })
          } else {
            // Crear documento nuevo
            const initial = { xp: 1240, energy: 100, streak: 7, completed: [], email: u.email }
            await setDoc(ref, initial)
            if (active && requestId === authRequest) setProgress(initial)
          }
        } catch (e) {
          console.error('Error cargando progreso:', e)
          if (active && requestId === authRequest) setProgress({ xp: 1240, energy: 100, streak: 7, completed: [] })
        } finally {
          if (active && requestId === authRequest) setLoading(false)
        }
    })
    return () => { active = false; unsub() }
  }, [])

  const saveProgress = async (data) => {
    if (!user) return
    try {
      await setDoc(doc(db, 'usuarios', user.uid), data, { merge: true })
    } catch (e) {
      console.error('Error guardando:', e)
    }
  }

  const logout = () => signOut(auth)

  return (
    <AuthContext.Provider value={{ user, loading, progress, saveProgress, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
