import { useState, useRef, useEffect } from 'react'
import { sSend, sReceive, sChatOpen, sChatClose, sTyping, sKawaiiHappy, sKawaiiSad } from '../sounds'
import { WAIFUS } from '../data/courses'

const API_BASE = 'https://hacklingo-backend.vercel.app'

const SCENARIOS = {
  akari: '/gk/Akari escenario.mp4',
  akari_prime: '/gk/Akari escenario.mp4',
  yuki: '/gk/yuki escenario.mp4',
  yuki_shadow: '/gk/yuki escenario.mp4',
}

export default function ChatScreen({ waifu, user, onClose, onMessage }) {
  const [messages, setMessages] = useState([
    { from: 'waifu', text: `¡Hola! Soy ${waifu.name}. ¿De qué quieres hablar? 💕` },
  ])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const logRef = useRef(null)

  useEffect(() => { sChatOpen() }, [])
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [messages])

  const send = async () => {
    if (!input.trim() || isThinking || !user) return
    const userMsg = input.trim()
    sSend()
    setMessages(m => [...m, { from: 'user', text: userMsg }])
    setInput('')
    setIsThinking(true)
    if (onMessage) onMessage()

    try {
      const token = await user.getIdToken()
      const r = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          mensaje: userMsg,
          waifu: waifu.name,
          personalidad: waifu.personality,
        }),
      })
      if (!r.ok) throw new Error('HTTP ' + r.status)
      const d = await r.json()
      sReceive()
      setMessages(m => [...m, { from: 'waifu', text: d.respuesta || '...' }])
      const lower = (d.respuesta || '').toLowerCase()
      if (lower.includes('baka') || lower.includes('error')) sKawaiiSad()
      else sKawaiiHappy()
    } catch (e) {
      setMessages(m => [...m, { from: 'waifu', text: '⚠ Error de conexión con mi cerebro IA.' }])
      sKawaiiSad()
    } finally {
      setIsThinking(false)
    }
  }

  const scenario = SCENARIOS[waifu.id] || SCENARIOS.akari

  return (
    <div className="chat-screen">
      {/* Video de fondo */}
      <video src={scenario} autoPlay muted loop playsInline className="chat-bg-video" />
      <div className="chat-vignette" />

      {/* Header */}
      <div className="chat-header">
        <button className="chat-back" onClick={() => { sChatClose(); onClose() }}>←</button>
        <div className="chat-header-info">
          <div className="chat-header-avatar">
            <img src={`/gk/${Object.values(waifu.expressions)[0]}`} alt="" />
          </div>
          <div>
            <b>{waifu.name}</b>
            <small>{isThinking ? 'escribiendo...' : 'en línea'}</small>
          </div>
        </div>
      </div>

      {/* Mensajes */}
      <div className="chat-messages" ref={logRef}>
        {messages.map((m, i) => (
          <div key={i} className={`chat-bubble-wrap ${m.from}`}>
            {m.from === 'waifu' && (
              <div className="chat-mini-avatar">
                <img src={`/gk/${Object.values(waifu.expressions)[0]}`} alt="" />
              </div>
            )}
            <div className={`chat-bubble ${m.from}`}>
              <p>{m.text}</p>
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="chat-bubble-wrap waifu">
            <div className="chat-mini-avatar">
              <img src={`/gk/${Object.values(waifu.expressions)[0]}`} alt="" />
            </div>
            <div className="chat-bubble waifu typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="chat-input-wrap">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder={`Escribe a ${waifu.name}...`}
          className="chat-main-input"
        />
        <button className="chat-send-btn" onClick={send}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M2 21l21-9L2 3v7l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
