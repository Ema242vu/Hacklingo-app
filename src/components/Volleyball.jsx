import { useEffect, useRef, useState } from 'react'
import { sBallHit, sNetMiss, sPoint, sWarning, sClose, sKawaiiAngry } from '../sounds'

const GAME_LIMIT_MS = 10 * 60 * 1000 // 10 minutos

export default function Volleyball({ waifu, onClose, onFinish }) {
  const canvasRef = useRef(null)
  const [score, setScore] = useState({ you: 0, her: 0 })
  const [phase, setPhase] = useState('playing') // playing | warning | end
  const [timeLeft, setTimeLeft] = useState(GAME_LIMIT_MS)
  const stateRef = useRef(null)
  const startTimeRef = useRef(Date.now())

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const W = canvas.width = canvas.clientWidth
    const H = canvas.height = canvas.clientHeight

    // Estado del juego
    const st = {
      ball: { x: W / 2, y: H / 2, vx: 3, vy: 2, r: 12 },
      you: { x: W / 2, y: H - 40, w: 90, h: 14 },
      her: { x: W / 2, y: 30, w: 90, h: 14, targetX: W / 2, speed: 2.5 },
      net: { x: W / 2, y: 0, h: H, w: 4 },
      ground: H - 20,
      score: { you: 0, her: 0 },
      playing: true,
    }
    stateRef.current = st

    // Control jugador
    const onMove = (e) => {
      if (!st.playing) return
      const rect = canvas.getBoundingClientRect()
      const cx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left
      st.you.x = Math.max(st.you.w / 2, Math.min(W - st.you.w / 2, cx))
    }
    canvas.addEventListener('touchmove', onMove, { passive: true })
    canvas.addEventListener('mousemove', onMove)

    let lastTime = performance.now()
    let raf

    function resetBall(dir) {
      st.ball.x = W / 2
      st.ball.y = H / 2
      st.ball.vx = (Math.random() > 0.5 ? 1 : -1) * 3
      st.ball.vy = dir === 'you' ? 3 : -3
    }

    function loop(now) {
      const dt = Math.min(50, now - lastTime) / 16
      lastTime = now

      ctx.clearRect(0, 0, W, H)

      // Fondo playa
      const grad = ctx.createLinearGradient(0, 0, 0, H)
      grad.addColorStop(0, '#87CEEB')
      grad.addColorStop(0.5, '#FFE5B4')
      grad.addColorStop(1, '#E8B888')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, H)

      // Sol
      ctx.fillStyle = 'rgba(255, 220, 100, 0.7)'
      ctx.beginPath()
      ctx.arc(W - 60, 60, 35, 0, Math.PI * 2)
      ctx.fill()

      // Arena (rectángulo)
      ctx.fillStyle = 'rgba(255, 200, 120, 0.5)'
      ctx.fillRect(20, 20, W - 40, H - 40)
      ctx.strokeStyle = 'rgba(0,0,0,0.2)'
      ctx.lineWidth = 2
      ctx.strokeRect(20, 20, W - 40, H - 40)

      // Red
      ctx.fillStyle = '#333'
      ctx.fillRect(st.net.x - st.net.w / 2, 60, st.net.w, H - 120)
      // Puntos de la red
      ctx.strokeStyle = '#555'
      ctx.lineWidth = 1
      for (let y = 70; y < H - 60; y += 12) {
        ctx.beginPath()
        ctx.moveTo(st.net.x - 15, y)
        ctx.lineTo(st.net.x + 15, y)
        ctx.stroke()
      }

      // IA (her)
      if (st.ball.vy < 0 && st.ball.y < H / 2) {
        st.her.targetX = st.ball.x
      } else {
        st.her.targetX = W / 2
      }
      st.her.x += (st.her.targetX - st.her.x) * 0.08
      st.her.x = Math.max(st.her.w / 2, Math.min(W - st.her.w / 2, st.her.x))
      ctx.fillStyle = '#E94E77'
      ctx.fillRect(st.her.x - st.her.w / 2, st.her.y, st.her.w, st.her.h)
      ctx.font = 'bold 18px sans-serif'
      ctx.fillStyle = '#fff'
      ctx.textAlign = 'center'
      ctx.fillText(waifu.name, st.her.x, st.her.y - 8)

      // Jugador
      ctx.fillStyle = '#4A90E2'
      ctx.fillRect(st.you.x - st.you.w / 2, st.you.y, st.you.w, st.you.h)
      ctx.fillStyle = '#fff'
      ctx.fillText('Tú', st.you.x, st.you.y - 8)

      // Física bola
      if (st.playing) {
        st.ball.x += st.ball.vx * dt
        st.ball.y += st.ball.vy * dt

        // Rebotes laterales
        if (st.ball.x - st.ball.r < 20 || st.ball.x + st.ball.r > W - 20) {
          st.ball.vx *= -1
          st.ball.x = Math.max(20 + st.ball.r, Math.min(W - 20 - st.ball.r, st.ball.x))
        }

        // Colisión red
        if (Math.abs(st.ball.x - st.net.x) < st.ball.r + st.net.w / 2 && st.ball.y > 60 && st.ball.y < H - 60) {
          st.ball.vx *= -1
          st.ball.x = st.ball.x < st.net.x ? st.net.x - st.ball.r - 3 : st.net.x + st.ball.r + 3
        }

        // Colisión jugador
        if (st.ball.vy > 0 && st.ball.y + st.ball.r > st.you.y && st.ball.y - st.ball.r < st.you.y + st.you.h &&
            st.ball.x > st.you.x - st.you.w / 2 - st.ball.r && st.ball.x < st.you.x + st.you.w / 2 + st.ball.r) {
          st.ball.vy = -Math.abs(st.ball.vy) * 1.05
          st.ball.vx += (st.ball.x - st.you.x) * 0.05
          sBallHit()
        }

        // Colisión IA
        if (st.ball.vy < 0 && st.ball.y - st.ball.r < st.her.y + st.her.h && st.ball.y + st.ball.r > st.her.y &&
            st.ball.x > st.her.x - st.her.w / 2 - st.ball.r && st.ball.x < st.her.x + st.her.w / 2 + st.ball.r) {
          st.ball.vy = Math.abs(st.ball.vy) * 1.02
          st.ball.vx += (st.ball.x - st.her.x) * 0.05
          sBallHit()
        }

        // Punto para la IA (bola cae en tu lado)
        if (st.ball.y - st.ball.r > H - 20) {
          st.score.her++
          setScore({ ...st.score })
          sNetMiss()
          if (st.score.her >= 7) endGame('her')
          else resetBall('you')
        }
        // Punto para ti (bola cae en lado IA)
        if (st.ball.y + st.ball.r < 20) {
          st.score.you++
          setScore({ ...st.score })
          sPoint()
          if (st.score.you >= 7) endGame('you')
          else resetBall('her')
        }
      }

      // Bola
      ctx.fillStyle = '#FFD700'
      ctx.beginPath()
      ctx.arc(st.ball.x, st.ball.y, st.ball.r, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#B8860B'
      ctx.lineWidth = 2
      ctx.stroke()
      // Líneas del balón
      ctx.beginPath()
      ctx.arc(st.ball.x, st.ball.y, st.ball.r * 0.6, 0, Math.PI * 2)
      ctx.stroke()

      // Marcador
      ctx.fillStyle = 'rgba(0,0,0,0.6)'
      ctx.fillRect(W / 2 - 50, 5, 100, 40)
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 22px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`${st.score.you} - ${st.score.her}`, W / 2, 32)

      raf = requestAnimationFrame(loop)
    }

    function endGame(winner) {
      st.playing = false
      setPhase('end')
      if (onFinish) onFinish({ winner, scoreYou: st.score.you, scoreHer: st.score.her })
    }

    raf = requestAnimationFrame(loop)

    // Timer
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      const left = GAME_LIMIT_MS - elapsed
      setTimeLeft(left)
      if (left <= 60000 && left > 59000) sWarning()
      if (left <= 0) {
        clearInterval(interval)
        st.playing = false
        setPhase('warning')
        sKawaiiAngry()
        setTimeout(() => { setPhase('end'); if (onFinish) onFinish({ winner: 'timeout', scoreYou: st.score.you, scoreHer: st.score.her }) }, 4000)
      }
    }, 1000)

    return () => {
      cancelAnimationFrame(raf)
      clearInterval(interval)
      canvas.removeEventListener('touchmove', onMove)
      canvas.removeEventListener('mousemove', onMove)
    }
  }, [])

  const mm = Math.floor(timeLeft / 60000)
  const ss = Math.floor((timeLeft % 60000) / 1000)

  return (
    <div className="volleyball-overlay">
      <div className="vb-header">
        <button className="profile-close" onClick={() => { sClose(); onClose() }}>✕</button>
        <div className="vb-timer">⏱️ {mm}:{ss.toString().padStart(2, '0')}</div>
      </div>
      <canvas ref={canvasRef} className="vb-canvas" />
      {phase === 'warning' && (
        <div className="vb-warning">
          <h2>😤 {waifu.name} dice:</h2>
          <p>¡Ey! Llevas 10 minutos jugando. ¡Ve a estudiar!</p>
        </div>
      )}
      {phase === 'end' && (
        <div className="vb-end">
          <h2>🏐 Fin del partido</h2>
          <p>{score.you} - {score.her}</p>
          <button className="check-btn" onClick={() => { sClose(); onClose() }}>Volver</button>
        </div>
      )}
    </div>
  )
}
