import { useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { auth } from '../firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { sClick, sCorrect, sWrong } from '../sounds'

const googleProvider = new GoogleAuthProvider()

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const traducirError = (code) => {
    const errores = {
      'auth/email-already-in-use': 'Ese correo ya está registrado.',
      'auth/invalid-email': 'Correo inválido.',
      'auth/weak-password': 'Contraseña muy débil (mínimo 6).',
      'auth/user-not-found': 'Usuario no encontrado.',
      'auth/wrong-password': 'Contraseña incorrecta.',
      'auth/invalid-credential': 'Correo o contraseña incorrectos.',
      'auth/popup-closed-by-user': 'Cerraste la ventana de Google.',
      'auth/network-request-failed': 'Sin conexión a internet.',
    }
    return errores[code] || 'Error: ' + code
  }

  const handleEmailAuth = async () => {
    if (!email.trim() || password.length < 6) {
      setError('Correo válido y contraseña de 6+ caracteres.')
      sWrong()
      return
    }
    sClick()
    setError('')
    setLoading(true)
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
      sCorrect()
    } catch (e) {
      sWrong()
      setError(traducirError(e.code))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    sClick()
    setError('')
    setLoading(true)
    try {
      await signInWithPopup(auth, googleProvider)
      sCorrect()
    } catch (e) {
      sWrong()
      setError(traducirError(e.code))
    } finally {
      setLoading(false)
    }
  }

  // Solo mostrar Google en web (no en APK)
  const showGoogleButton = !Capacitor.isNativePlatform()

  return (
    <div className="login-screen">
      <div className="login-box">
        <h1>⚡ HACKLINGO</h1>
        <p className="login-sub">
          {isRegister ? 'Crea tu cuenta y empieza a hackear' : 'Inicia sesión para continuar'}
        </p>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Contraseña (mínimo 6)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          autoComplete={isRegister ? 'new-password' : 'current-password'}
          onKeyDown={(e) => e.key === 'Enter' && handleEmailAuth()}
        />

        {error && <p className="login-error">{error}</p>}

        <button
          onClick={handleEmailAuth}
          className="login-btn"
          disabled={loading}
        >
          {loading ? '...' : (isRegister ? 'CREAR CUENTA' : 'INICIAR SESIÓN')}
        </button>

        {showGoogleButton && (
          <>
            <div className="login-divider"><span>o</span></div>
            <button
              onClick={handleGoogle}
              className="login-google"
              disabled={loading}
            >
              <svg width="18" height="18" viewBox="0 0 48 48" style={{ marginRight: 8, verticalAlign: 'middle' }}>
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 18.9 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.1-11.3-7.6l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.6l6.2 5.2C40.9 35.6 44 30.3 44 24c0-1.2-.1-2.4-.4-3.5z"/>
              </svg>
              Continuar con Google
            </button>
          </>
        )}

        <button
          onClick={() => { sClick(); setIsRegister(!isRegister); setError('') }}
          className="login-toggle"
        >
          {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
        </button>

        {!showGoogleButton && (
          <p style={{ fontSize: 11, opacity: 0.5, textAlign: 'center', marginTop: 4 }}>
            Usa correo y contraseña para crear tu cuenta
          </p>
        )}
      </div>
    </div>
  )
}
