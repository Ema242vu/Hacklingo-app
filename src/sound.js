const AudioCtx = window.AudioContext || window.webkitAudioContext
let ctx

// Inicializar al primer clic del usuario
export function initAudio() {
  if (!ctx) {
    try {
      ctx = new AudioCtx()
    } catch (e) {}
  }
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().then(() => {
      console.log('AudioContext resumed')
    }).catch(() => {})
  }
}

function getCtx() {
  initAudio()
  return ctx
}

// ...resto del código igual
// Sonidos generados con Web Audio API (sin archivos externos)
const AudioCtx = window.AudioContext || window.webkitAudioContext
let ctx
function getCtx() {
  if (!ctx) ctx = new AudioCtx()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function tone(freq, dur, type = 'sine', vol = 0.1, delay = 0) {
  try {
    const c = getCtx()
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.type = type
    osc.frequency.value = freq
    const t = c.currentTime + delay
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(vol, t + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur)
    osc.connect(gain)
    gain.connect(c.destination)
    osc.start(t)
    osc.stop(t + dur + 0.02)
  } catch (e) {}
}

export function sClick() { tone(600, 0.08, 'square', 0.05) }
export function sCorrect() {
  tone(523, 0.12, 'sine', 0.15)
  tone(659, 0.12, 'sine', 0.15, 0.1)
  tone(784, 0.2, 'sine', 0.15, 0.2)
}
export function sWrong() {
  tone(300, 0.15, 'sawtooth', 0.12)
  tone(200, 0.28, 'sawtooth', 0.12, 0.14)
}
export function sLevelUp() {
  [523, 659, 784, 1046, 1318].forEach((f, i) => tone(f, 0.22, 'sine', 0.15, i * 0.11))
}
export function sSend() { tone(880, 0.06, 'sine', 0.08) }
export function sReceive() { tone(660, 0.08, 'sine', 0.08) }
export function sEnergy() {
  tone(440, 0.1, 'triangle', 0.1)
  tone(660, 0.15, 'triangle', 0.1, 0.1)
  tone(880, 0.2, 'triangle', 0.1, 0.22)
}
export function sOpen() { tone(700, 0.1, 'sine', 0.1); tone(900, 0.12, 'sine', 0.1, 0.08) }
export function sClose() { tone(700, 0.1, 'sine', 0.1); tone(500, 0.12, 'sine', 0.1, 0.08) }
export function sUnlock() {
  tone(523, 0.15, 'sine', 0.12)
  tone(784, 0.15, 'sine', 0.12, 0.12)
  tone(1046, 0.25, 'sine', 0.12, 0.24)
}
export function sCoin() { tone(1200, 0.06, 'square', 0.08); tone(1600, 0.08, 'square', 0.08, 0.05) }
