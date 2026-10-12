const AudioCtx = window.AudioContext || window.webkitAudioContext
let ctx

export function initAudio() {
  if (!ctx) {
    try { ctx = new AudioCtx() } catch (e) {}
  }
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {})
  }
}

function getCtx() {
  initAudio()
  return ctx
}

function tone(freq, dur, type = 'sine', vol = 0.1, delay = 0, slideTo = null) {
  try {
    const c = getCtx()
    if (!c) return
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.type = type
    osc.frequency.value = freq
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, c.currentTime + delay + dur)
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

/* ==========================================
   SONIDOS DE INTERFAZ
   ========================================== */
export function sClick() {
  tone(800, 0.05, 'sine', 0.06)
  tone(1200, 0.08, 'sine', 0.04, 0.05)
}

export function sOpen() {
  tone(600, 0.1, 'sine', 0.08)
  tone(900, 0.12, 'sine', 0.08, 0.08)
  tone(1200, 0.15, 'sine', 0.06, 0.16)
}

export function sClose() {
  tone(900, 0.08, 'sine', 0.07)
  tone(600, 0.12, 'sine', 0.07, 0.06)
}

export function sSend() {
  tone(1100, 0.05, 'triangle', 0.07)
  tone(1400, 0.08, 'triangle', 0.05, 0.04)
}

export function sReceive() {
  tone(1400, 0.06, 'sine', 0.05)
  tone(1100, 0.08, 'sine', 0.05, 0.05)
}

export function sUnlock() {
  tone(700, 0.12, 'sine', 0.1)
  tone(1000, 0.12, 'sine', 0.1, 0.1)
  tone(1400, 0.2, 'sine', 0.1, 0.2)
}

export function sCoin() {
  tone(1500, 0.05, 'square', 0.06)
  tone(2000, 0.08, 'square', 0.06, 0.04)
}

export function sLevelUp() {
  [700, 900, 1100, 1400, 1800].forEach((f, i) => tone(f, 0.15, 'sine', 0.1, i * 0.08))
}

/* ==========================================
   SONIDOS KAWAII (MELODÍAS TIPO ANIME)
   ========================================== */
export function sKawaiiHappy() {
  tone(1200, 0.08, 'sine', 0.09)
  tone(1500, 0.08, 'sine', 0.09, 0.08)
  tone(1800, 0.12, 'sine', 0.09, 0.16)
  tone(2000, 0.18, 'sine', 0.08, 0.28)
}

export function sKawaiiSad() {
  tone(900, 0.15, 'sine', 0.08, 0, 600)
  tone(600, 0.25, 'sine', 0.07, 0.15)
}

export function sKawaiiAngry() {
  tone(400, 0.1, 'sawtooth', 0.08)
  tone(300, 0.15, 'sawtooth', 0.08, 0.1)
}

export function sKawaiiSurprise() {
  tone(600, 0.06, 'sine', 0.1, 0, 2000)
  tone(1800, 0.1, 'sine', 0.08, 0.07)
}

export function sKawaiiSleep() {
  tone(400, 0.2, 'sine', 0.06)
  tone(350, 0.3, 'sine', 0.05, 0.25)
}

export function sCorrect() {
  tone(1000, 0.08, 'sine', 0.1)
  tone(1300, 0.08, 'sine', 0.1, 0.08)
  tone(1600, 0.12, 'sine', 0.1, 0.16)
  tone(2000, 0.2, 'sine', 0.1, 0.28)
}

export function sWrong() {
  tone(500, 0.12, 'sine', 0.08, 0, 400)
  tone(350, 0.2, 'sine', 0.08, 0.12, 250)
}

export function sEnergy() {
  tone(1300, 0.1, 'triangle', 0.1)
  tone(1700, 0.1, 'triangle', 0.1, 0.1)
  tone(2100, 0.15, 'triangle', 0.1, 0.2)
  tone(2600, 0.2, 'triangle', 0.08, 0.35)
}

/* ==========================================
   SONIDOS DE PROGRESO / LOGROS
   ========================================== */
export function sAchievement() {
  [523, 659, 784, 1046, 1318, 1568].forEach((f, i) => tone(f, 0.15, 'sine', 0.12, i * 0.09))
}

export function sCoinDrop() {
  tone(2000, 0.05, 'square', 0.08)
  tone(2500, 0.05, 'square', 0.06, 0.05)
  tone(3000, 0.1, 'square', 0.05, 0.1)
}

export function sPoint() {
  [900, 1200, 1500].forEach((f, i) => tone(f, 0.1, 'sine', 0.12, i * 0.08))
}

export function sLove() {
  [800, 1000, 1200, 1500, 1800].forEach((f, i) => tone(f, 0.15, 'sine', 0.1, i * 0.07))
}

export function sWarning() {
  tone(400, 0.15, 'square', 0.08)
  tone(400, 0.15, 'square', 0.08, 0.2)
  tone(400, 0.15, 'square', 0.08, 0.4)
}

export function sChapterUnlock() {
  [600, 750, 900, 1100, 1300, 1600, 2000].forEach((f, i) => tone(f, 0.2, 'sine', 0.1, i * 0.12))
}

/* ==========================================
   SONIDOS DE VOLEIBOL
   ========================================== */
export function sBallHit() {
  tone(200, 0.08, 'square', 0.15)
  tone(400, 0.05, 'sine', 0.1, 0.02)
}

export function sNetMiss() {
  tone(180, 0.2, 'sawtooth', 0.1, 0, 100)
}

/* ==========================================
   SONIDOS DE CHAT
   ========================================== */
export function sChatOpen() {
  tone(700, 0.08, 'sine', 0.08)
  tone(1000, 0.1, 'sine', 0.08, 0.07)
  tone(1400, 0.12, 'sine', 0.06, 0.15)
}

export function sChatClose() {
  tone(1400, 0.08, 'sine', 0.06)
  tone(1000, 0.1, 'sine', 0.06, 0.07)
  tone(700, 0.12, 'sine', 0.08, 0.15)
}

export function sTyping() {
  tone(1800, 0.02, 'square', 0.03)
}

/* ==========================================
   SONIDO DE PREMIUM DESBLOQUEADO
   ========================================== */
export function sPremiumUnlock() {
  [523, 659, 784, 1046, 1318, 1568, 2093].forEach((f, i) => tone(f, 0.22, 'sine', 0.12, i * 0.11))
  setTimeout(() => {
    [1568, 2093, 2637].forEach((f, i) => tone(f, 0.3, 'triangle', 0.1, i * 0.15))
  }, 900)
}
