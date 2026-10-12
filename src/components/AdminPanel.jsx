import { useState } from 'react'
import { sOpen, sClose, sUnlock } from '../sounds'

const ADMIN_PASSWORD = 'HackLingo2026' // Cámbialo

export default function AdminPanel({ user, onClose, onGiveCoins, onResetProgress, onGiveLove }) {
  const [password, setPassword] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [error, setError] = useState('')
  const [coins, setCoins] = useState(500)
  const [love, setLove] = useState(100)

  const tryUnlock = () => {
    if (password === ADMIN_PASSWORD) { setUnlocked(true); sUnlock() }
    else { setError('❌ Contraseña incorrecta'); sUnlock() }
  }

  if (!unlocked) {
    return (
      <div className="shop-overlay">
        <div className="shop" style={{ maxWidth: 380 }}>
          <h2>🔐 Panel de Admin</h2>
          <p className="shop-sub">Ingresa la contraseña del creador</p>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Contraseña" className="chat-input" style={{ width: '100%', marginBottom: 12 }} />
          {error && <p style={{ color: '#f00', fontSize: 12 }}>{error}</p>}
          <button className="check-btn" style={{ width: '100%' }} onClick={tryUnlock}>DESBLOQUEAR</button>
          <button className="close-shop" style={{ marginTop: 8 }} onClick={onClose}>Cancelar</button>
        </div>
      </div>
    )
  }

  return (
    <div className="shop-overlay">
      <div className="shop" style={{ maxWidth: 500 }}>
        <h2>🔐 Panel de Admin</h2>
        <p className="shop-sub">Herramientas del creador</p>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 700 }}>💰 Dar XP</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input type="number" value={coins} onChange={e => setCoins(parseInt(e.target.value) || 0)}
              className="chat-input" style={{ flex: 1 }} />
            <button className="check-btn" onClick={() => { onGiveCoins(coins); sUnlock() }}>DAR</button>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 700 }}>💕 Dar Amor</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input type="number" value={love} onChange={e => setLove(parseInt(e.target.value) || 0)}
              className="chat-input" style={{ flex: 1 }} />
            <button className="check-btn" onClick={() => { onGiveLove(love); sUnlock() }}>DAR</button>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 700 }}>♻️ Resetear Progreso</label>
          <button className="check-btn" style={{ width: '100%', background: '#e94560' }}
            onClick={() => { if (confirm('¿Resetear TODO el progreso?')) onResetProgress() }}>
            RESETEAR TODO
          </button>
        </div>

        <div style={{ padding: 12, background: 'rgba(0,0,0,.3)', borderRadius: 12, fontSize: 11, opacity: .7 }}>
          <b>👤 Usuario:</b> {user?.email}<br />
          <b>🔑 UID:</b> {user?.uid?.slice(0, 12)}...<br />
        </div>

        <button className="close-shop" style={{ marginTop: 16 }} onClick={onClose}>Cerrar</button>
      </div>
    </div>
  )
}
