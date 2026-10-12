import { useState, useEffect, useRef } from 'react'
import { COURSES, COURSE_DATA, WAIFUS, PREMIUM_CODES } from './data/courses.js'
import { THEMES, PREMIUM_FEATURES, DECORATIONS } from './data/themes.js'
import { VIDEO_SCENES, COFFEE_TYPES } from './data/rewards.js'
import { ACHIEVEMENTS } from './data/achievements.js'
import { getAvailableChapter } from './data/story.js'
import {
  initAudio, sClick, sCorrect, sWrong, sLevelUp, sSend, sReceive,
  sEnergy, sOpen, sClose, sUnlock,
  sKawaiiHappy, sKawaiiSad, sKawaiiAngry, sKawaiiSurprise, sKawaiiSleep,
  sAchievement, sCoinDrop, sLove, sChapterUnlock, sChatOpen, sPremiumUnlock,
} from './sounds.js'
import { AdMob, RewardAdPluginEvents } from '@capacitor-community/admob'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './components/Login'
import CharacterBuilder, { Character } from './components/CharacterBuilder'
import VideoScene from './components/VideoScene'
import Profile from './components/Profile'
import Achievements from './components/Achievements'
import StoryMode from './components/StoryMode'
import ChatScreen from './components/ChatScreen'
import Volleyball from './components/Volleyball'
import AdminPanel from './components/AdminPanel'
import './styles.css'

const API_BASE = 'https://hacklingo-backend.vercel.app'
const ADMOB_TEST_ID = 'ca-app-pub-3940256099942544/5224354917'
const ADSTERRA_TAPS_NEEDED = 3
const ADSTERRA_REWARD = 20
const VIP_EMAILS = ['adrianbarrionuevo166@gmail.com', 'gio6play7@gmail.com']

const MOOD_MAP = {
  neutral: ['normal', 'confused', 'happy'],
  happy: ['happy', 'happy2', 'normal'],
  sad: ['sad', 'sad2', 'normal'],
  angry: ['angry', 'normal'],
  shy: ['shy', 'happy', 'normal'],
  bored: ['bored', 'sleeping', 'normal'],
  sleeping: ['sleeping', 'bored', 'normal'],
  confused: ['confused', 'normal'],
}

function getExpr(waifu, mood) {
  const candidates = MOOD_MAP[mood] || ['normal']
  for (const c of candidates) if (waifu.expressions[c]) return waifu.expressions[c]
  return Object.values(waifu.expressions)[0]
}

function pickComment(waifu, key) {
  const arr = waifu.comments?.[key] || ['...']
  return arr[Math.floor(Math.random() * arr.length)]
}

const MOOD_SOUND = {
  happy: sKawaiiHappy, sad: sKawaiiSad, angry: sKawaiiAngry,
  shy: sKawaiiSurprise, sleeping: sKawaiiSleep, bored: sKawaiiSleep,
}

function applyTheme(theme) {
  const root = document.documentElement
  Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v))
}

function shuffleOptions(q) {
  if (!q.options) return null
  const opts = q.options.map((opt, i) => ({ text: opt, correct: i === q.correct }))
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[opts[i], opts[j]] = [opts[j], opts[i]]
  }
  return opts
}

function AppContent() {
  const { user, loading, progress, saveProgress, logout } = useAuth()

  const [courseId, setCourseId] = useState('python')
  const [lesson, setLesson] = useState(null)
  const [qIdx, setQIdx] = useState(0)
  const [xp, setXp] = useState(progress.xp ?? 1240)
  const [energy, setEnergy] = useState(progress.energy ?? 100)
  const [streak, setStreak] = useState(progress.streak ?? 7)
  const [level, setLevel] = useState(progress.level ?? 1)
  const [mood, setMood] = useState('neutral')
  const [waifuComment, setWaifuComment] = useState('')
  const [selectedWaifu, setSelectedWaifu] = useState(WAIFUS[0])
  const [chatInput, setChatInput] = useState('')
  const [chatLog, setChatLog] = useState([])
  const [completed, setCompleted] = useState(progress.completed || [])
  const [love, setLove] = useState(progress.love ?? 30)
  const [coffee, setCoffee] = useState(progress.coffee ?? 0)
  const [stats, setStats] = useState({
    chatMessages: progress.chatMessages || 0,
    coffeesGiven: progress.coffeesGiven || 0,
    volleyballWins: progress.volleyballWins || 0,
    perfectLessons: progress.perfectLessons || 0,
    chapterReached: progress.chapterReached || 0,
  })
  const [unlockedAchievements, setUnlockedAchievements] = useState(progress.achievements || [])

  const [showShop, setShowShop] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showThemes, setShowThemes] = useState(false)
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [showEnergyModal, setShowEnergyModal] = useState(false)
  const [showPremiumInfo, setShowPremiumInfo] = useState(false)
  const [showMiniChat, setShowMiniChat] = useState(false)
  const [showCharBuilder, setShowCharBuilder] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [showStory, setShowStory] = useState(false)
  const [showChatScreen, setShowChatScreen] = useState(false)
  const [showVolleyball, setShowVolleyball] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)

  const [showVideoScene, setShowVideoScene] = useState(false)
  const [currentScene, setCurrentScene] = useState(null)
  const [currentChapter, setCurrentChapter] = useState(null)

  const [premiumCodeInput, setPremiumCodeInput] = useState('')
  const [premiumError, setPremiumError] = useState('')
  const [premiumUnlocked, setPremiumUnlocked] = useState(() => localStorage.getItem('premiumUnlocked') === 'true')
  const [pendingPremiumWaifu, setPendingPremiumWaifu] = useState(null)

  const [isThinking, setIsThinking] = useState(false)
  const [adsterraTaps, setAdsterraTaps] = useState(() => Math.max(0, Math.min(ADSTERRA_TAPS_NEEDED - 1, Number.parseInt(localStorage.getItem('adsterraTaps') || '0', 10) || 0)))
  const [admobReady, setAdmobReady] = useState(false)
  const [toast, setToast] = useState('')
  const [achievementToast, setAchievementToast] = useState(null)

  const [themeId, setThemeId] = useState(() => localStorage.getItem('themeId') || 'sakura_dream')
  const [previewTheme, setPreviewTheme] = useState(null)
  const [currentDecoration, setCurrentDecoration] = useState([])

  const [waifuSize, setWaifuSize] = useState(() => parseFloat(localStorage.getItem('waifuSize') || '1.2'))
  const [waifuX, setWaifuX] = useState(() => parseFloat(localStorage.getItem('waifuX') || '78'))
  const [waifuY, setWaifuY] = useState(() => parseFloat(localStorage.getItem('waifuY') || '62'))

  const [userCharacter, setUserCharacter] = useState(() => {
    try {
      const saved = localStorage.getItem('userCharacter')
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })
  const [userPhoto, setUserPhoto] = useState(() => localStorage.getItem('userPhoto') || null)

  const [shuffledOpts, setShuffledOpts] = useState(null)

  const lessons = COURSE_DATA[courseId] || []
  const course = COURSES.find(c => c.id === courseId) || COURSES[0]
  const q = lesson?.questions[qIdx]
  const commentTimeout = useRef(null)
  const saveTimeout = useRef(null)
  const answerLockRef = useRef(false)

  const isVipUser = premiumUnlocked || (user?.email && VIP_EMAILS.includes(user.email))

  // FIX: Energía infinita VIP
  useEffect(() => {
    if (isVipUser && energy < 99999) setEnergy(99999)
  }, [isVipUser])

  // APLICAR TEMA
  useEffect(() => {
    const theme = THEMES.find(t => t.id === themeId) || THEMES[0]
    applyTheme(theme)
    localStorage.setItem('themeId', themeId)
    const deco = DECORATIONS[theme.decoration] || []
    setCurrentDecoration(deco)
  }, [themeId])

  // PREVIEW TEMA
  useEffect(() => {
    if (previewTheme) {
      const theme = THEMES.find(t => t.id === previewTheme)
      if (theme) {
        applyTheme(theme)
        const deco = DECORATIONS[theme.decoration] || []
        setCurrentDecoration(deco)
      }
    } else {
      const theme = THEMES.find(t => t.id === themeId) || THEMES[0]
      applyTheme(theme)
      const deco = DECORATIONS[theme.decoration] || []
      setCurrentDecoration(deco)
    }
  }, [previewTheme, themeId])

  // SYNC PROGRESO
  useEffect(() => {
    if (progress.completed) setCompleted(progress.completed)
    if (progress.xp !== undefined) setXp(progress.xp)
    if (progress.energy !== undefined && !isVipUser) setEnergy(progress.energy)
    if (progress.streak !== undefined) setStreak(progress.streak)
    if (progress.level !== undefined) setLevel(progress.level)
    if (progress.themeId) setThemeId(progress.themeId)
    if (progress.userCharacter) setUserCharacter(progress.userCharacter)
    if (progress.love !== undefined) setLove(progress.love)
    if (progress.coffee !== undefined) setCoffee(progress.coffee)
    if (progress.userPhoto) setUserPhoto(progress.userPhoto)
    if (progress.achievements) setUnlockedAchievements(progress.achievements)
    if (progress.stats) setStats(prev => ({ ...prev, ...progress.stats }))
  }, [progress])

  // GUARDAR
  useEffect(() => {
    if (!user) return
    clearTimeout(saveTimeout.current)
    saveTimeout.current = setTimeout(() => {
      saveProgress({
        xp, energy, streak, level, completed, themeId, userCharacter, love, coffee, userPhoto,
        achievements: unlockedAchievements, stats,
      })
    }, 2000)
  }, [xp, energy, streak, level, completed, themeId, userCharacter, love, coffee, userPhoto, unlockedAchievements, stats, user])

  useEffect(() => () => {
    clearTimeout(saveTimeout.current)
    clearTimeout(commentTimeout.current)
  }, [])

  // AUDIO
  useEffect(() => {
    const unlock = () => {
      initAudio()
      document.removeEventListener('touchstart', unlock)
      document.removeEventListener('click', unlock)
    }
    document.addEventListener('touchstart', unlock, { passive: true })
    document.addEventListener('click', unlock)
    return () => {
      document.removeEventListener('touchstart', unlock)
      document.removeEventListener('click', unlock)
    }
  }, [])

  // ADMOB
  useEffect(() => {
    const initAdMob = async () => {
      try {
        await AdMob.initialize({ requestTrackingAuthorization: true, testingDevices: [], initializeForTesting: true })
        setAdmobReady(true)
      } catch (e) { console.error(e) }
    }
    initAdMob()
  }, [])

  useEffect(() => { localStorage.setItem('waifuSize', waifuSize) }, [waifuSize])
  useEffect(() => { localStorage.setItem('waifuX', waifuX) }, [waifuX])
  useEffect(() => { localStorage.setItem('waifuY', waifuY) }, [waifuY])

  useEffect(() => {
    setChatLog([{ from: 'waifu', text: `¡Hola! Soy ${selectedWaifu.name}. ¿Qué hackeamos hoy? 💖` }])
    setMood(selectedWaifu.defaultMood || 'neutral')
  }, [selectedWaifu])

  useEffect(() => {
    answerLockRef.current = false
    if (q && q.options && q.type !== 'truefalse') setShuffledOpts(shuffleOptions(q))
    else setShuffledOpts(null)
  }, [qIdx, lesson?.id])

  // VERIFICAR LOGROS
  useEffect(() => {
    const state = {
      completed: completed.length,
      chatMessages: stats.chatMessages,
      coffeesGiven: stats.coffeesGiven,
      streak, level, xp, love,
      volleyballWins: stats.volleyballWins,
      perfectLessons: stats.perfectLessons,
      chapterReached: stats.chapterReached,
      premium: premiumUnlocked,
      allCourses50: ['python', 'hacking', 'termux', 'kali'].every(c =>
        completed.filter(id => id.startsWith(c)).length >= 50
      ),
    }
    ACHIEVEMENTS.forEach(a => {
      if (!unlockedAchievements.includes(a.id) && a.check(state)) {
        setUnlockedAchievements(prev => [...prev, a.id])
        sAchievement()
        setAchievementToast(a)
        setTimeout(() => setAchievementToast(null), 3500)
      }
    })
  }, [completed.length, stats, streak, level, xp, love, premiumUnlocked])

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const sayComment = (key, moodSet = null) => {
    const text = pickComment(selectedWaifu, key)
    setWaifuComment(text)
    if (moodSet) {
      setMood(moodSet)
      const snd = MOOD_SOUND[moodSet]; if (snd) snd()
    }
    clearTimeout(commentTimeout.current)
    commentTimeout.current = setTimeout(() => setWaifuComment(''), 4500)
  }

  const isLessonUnlocked = (i) => i === 0 || completed.includes(lessons[i - 1].id)

  const startLesson = (ls, idx) => {
    answerLockRef.current = false
    if (!isLessonUnlocked(idx)) { sWrong(); sayComment('wrong', 'angry'); showToast('🔒 Completa la anterior'); return }
    if (!isVipUser && energy < ls.energyCost) { sWrong(); sayComment('wrong', 'sad'); showToast('⚡ Sin energía'); setShowEnergyModal(true); return }
    sOpen(); setLesson(ls); setQIdx(0); setMood('happy')
    if (!isVipUser) setEnergy(e => e - ls.energyCost)
    sayComment('welcome', 'happy')
  }

  const handleChat = async () => {
    if (!chatInput.trim() || isThinking || !user) return
    const userMsg = chatInput
    sSend()
    setChatLog(l => [...l, { from: 'user', text: userMsg }])
    setChatInput(''); setIsThinking(true); setMood('neutral')
    setStats(s => ({ ...s, chatMessages: s.chatMessages + 1 }))
    try {
      const token = await user.getIdToken()
      const r = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ mensaje: userMsg, waifu: selectedWaifu.name, personalidad: selectedWaifu.personality }),
      })
      if (!r.ok) throw new Error('HTTP ' + r.status)
      const d = await r.json()
      const reply = d.respuesta || '...'
      sReceive()
      setChatLog(l => [...l, { from: 'waifu', text: reply }])
      const lower = reply.toLowerCase()
      let newMood = 'happy'
      if (lower.includes('baka') || lower.includes('error')) newMood = 'angry'
      else if (lower.includes('...') || lower.includes('triste')) newMood = 'sad'
      setMood(newMood)
      const snd = MOOD_SOUND[newMood]; if (snd) snd()
    } catch (e) {
      setChatLog(l => [...l, { from: 'waifu', text: '⚠ Error de conexión con mi cerebro IA.' }])
      setMood('sad'); sKawaiiSad()
    } finally { setIsThinking(false) }
  }

  const nextQuestion = (correct = true) => {
    if (answerLockRef.current || !lesson) return
    answerLockRef.current = true
    if (correct) { sCorrect(); setXp(x => x + 5); sayComment('correct', 'happy') }
    else { sWrong(); if (!isVipUser) setEnergy(e => Math.max(0, e - 2)); sayComment('wrong', 'sad') }
    if (qIdx + 1 < lesson.questions.length) { setQIdx(i => i + 1) }
    else {
      sLevelUp()
      const alreadyCompleted = completed.includes(lesson.id)
      setCompleted(c => alreadyCompleted ? c : [...new Set([...c, lesson.id])])
      setXp(x => { const nx = x + lesson.xp; setLevel(Math.max(level, Math.floor(nx / 500) + 1)); return nx })
      setLesson(null); setMood('happy'); showToast(alreadyCompleted ? '✨ ¡Lección repetida!' : '🎉 ¡Lección completada!')
      const newCompleted = completed.length + (alreadyCompleted ? 0 : 1)
      const newChapter = getAvailableChapter(newCompleted)
      if (newChapter && newChapter.id > stats.chapterReached) {
        setStats(s => ({ ...s, chapterReached: newChapter.id }))
        sChapterUnlock()
        setTimeout(() => { setCurrentChapter(newChapter); setCurrentScene(VIDEO_SCENES[newChapter.scenario]); setShowVideoScene(true) }, 1200)
        return
      }
      setTimeout(() => {
        if (Math.random() < 0.4) {
          const key = selectedWaifu.id.startsWith('akari') ? 'akari' : 'yuki'
          setCurrentScene(VIDEO_SCENES[key]); setCurrentChapter(null); setShowVideoScene(true)
        }
      }, 900)
    }
  }

  const handleVideoFinish = ({ loveDelta, coffeeDelta }) => {
    setLove(l => Math.max(0, Math.min(100, l + loveDelta)))
    setCoffee(c => Math.max(0, c + coffeeDelta))
    if (loveDelta > 0) { sLove(); showToast(`💕 Amor +${loveDelta}`) }
    else if (loveDelta < 0) showToast(`💔 Amor ${loveDelta}`)
    if (coffeeDelta > 0) { sCoinDrop(); showToast(`☕ +${coffeeDelta} café`) }
    setShowVideoScene(false); setCurrentScene(null); setCurrentChapter(null)
  }

  const handleVolleyballFinish = ({ winner }) => {
    if (winner === 'you') { setStats(s => ({ ...s, volleyballWins: s.volleyballWins + 1 })); setLove(l => Math.min(100, l + 5)); setXp(x => x + 50); showToast('🏐 ¡Ganaste! +50 XP, +5 amor') }
    else if (winner === 'timeout') showToast('⏰ Se acabó. ¡A estudiar!')
    else { setLove(l => Math.max(0, l - 2)); setXp(x => x + 50); showToast('😤 Perdiste... +50 XP igual') }
  }

  const conseguirEnergia = () => {
    sClick()
    if (isVipUser) { showToast('⚡ ¡Energía infinita VIP!'); return }
    if (energy >= 100) { showToast('⚡ Energía llena'); return }
    setShowEnergyModal(true)
  }

  const confirmarVerAnuncio = async () => {
    if (!admobReady) { showToast('⚠ AdMob no listo'); return }
    try {
      const listener = await AdMob.addListener(RewardAdPluginEvents.Rewarded, () => {
        const newTaps = adsterraTaps + 1
        setAdsterraTaps(newTaps); localStorage.setItem('adsterraTaps', newTaps)
        if (newTaps >= ADSTERRA_TAPS_NEEDED) {
          sEnergy(); setEnergy(e => Math.min(100, e + ADSTERRA_REWARD))
          setAdsterraTaps(0); localStorage.setItem('adsterraTaps', 0)
          showToast(`⚡ +${ADSTERRA_REWARD} energía`); sayComment('correct', 'happy'); setShowEnergyModal(false)
        } else showToast(`⚡ ${newTaps}/${ADSTERRA_TAPS_NEEDED}`)
        listener.remove()
      })
      await AdMob.prepareRewardVideoAd({ adId: ADMOB_TEST_ID, isTesting: true })
      await AdMob.showRewardVideoAd()
    } catch (e) { showToast('⚠ Error con el anuncio') }
  }

  const selectWaifu = (w) => {
    sClick()
    if (w.premium && !isVipUser) { setPendingPremiumWaifu(w); setShowPremiumModal(true); setPremiumError(''); setPremiumCodeInput(''); return }
    setSelectedWaifu(w); setShowShop(false); sayComment('welcome', 'happy')
  }

  const validatePremiumCode = () => {
    const code = premiumCodeInput.trim().toUpperCase()
    if (PREMIUM_CODES.includes(code)) {
      sPremiumUnlock(); setPremiumUnlocked(true); localStorage.setItem('premiumUnlocked', 'true')
      setEnergy(99999); setShowPremiumModal(false)
      if (pendingPremiumWaifu) { setSelectedWaifu(pendingPremiumWaifu); setShowShop(false) }
      setPendingPremiumWaifu(null)
      showToast('🎉 ¡Código VIP válido! Energía infinita')
    } else { sWrong(); setPremiumError('❌ Código inválido'); setMood('angry'); sKawaiiAngry() }
  }

  const selectTheme = (t) => {
    sClick()
    if (t.premium && !isVipUser) { showToast('👑 Tema VIP. Desbloquea con código.'); return }
    setThemeId(t.id); setPreviewTheme(null); showToast(`🎨 Tema: ${t.name}`)
  }

  const handleUploadPhoto = () => {
    const input = document.createElement('input')
    input.type = 'file'; input.accept = 'image/*'
    input.onchange = (e) => {
      const file = e.target.files[0]; if (!file) return
      if (!file.type.startsWith('image/')) { showToast('⚠ Elige una imagen válida'); return }
      if (file.size > 12 * 1024 * 1024) { showToast('⚠ La imagen debe pesar menos de 12 MB'); return }
      const reader = new FileReader()
      reader.onerror = () => showToast('⚠ No pude leer esa imagen')
      reader.onload = (ev) => {
        const source = new Image()
        source.onerror = () => showToast('⚠ La imagen no es válida')
        source.onload = () => {
          const maxSide = 640
          const scale = Math.min(1, maxSide / Math.max(source.width, source.height))
          const canvas = document.createElement('canvas')
          canvas.width = Math.max(1, Math.round(source.width * scale))
          canvas.height = Math.max(1, Math.round(source.height * scale))
          const ctx = canvas.getContext('2d')
          if (!ctx) { showToast('⚠ No pude procesar la imagen'); return }
          ctx.drawImage(source, 0, 0, canvas.width, canvas.height)
          const compressed = canvas.toDataURL('image/jpeg', 0.78)
          try { localStorage.setItem('userPhoto', compressed) } catch { showToast('⚠ No hay espacio para guardar la foto'); return }
          setUserPhoto(compressed)
          saveProgress({ userPhoto: compressed })
          showToast('📷 Foto actualizada')
        }
        source.src = ev.target.result
      }
      reader.readAsDataURL(file)
    }
    input.click()
  }

  const adminGiveCoins = (a) => { setXp(x => x + a); showToast(`💰 +${a} XP`) }
  const adminGiveLove = (a) => { setLove(l => Math.min(100, l + a)); showToast(`💕 +${a} amor`) }
  const adminResetProgress = () => {
    setXp(0); setEnergy(100); setStreak(1); setLevel(1); setCompleted([]); setLove(30); setCoffee(0)
    setUnlockedAchievements([])
    setStats({ chatMessages: 0, coffeesGiven: 0, volleyballWins: 0, perfectLessons: 0, chapterReached: 0 })
    showToast('♻️ Progreso reseteado')
  }

  const waifuImg = (w) => `/gk/${getExpr(w, mood)}`

  if (loading) return <div className="loading-screen">Cargando...</div>
  if (!user) return <Login />

  return (
    <div className="app">
      <div className="anime-bg"></div>
      <div className="decorations">
        {currentDecoration.map((emoji, i) => <span key={i} className={`deco deco-${i}`}>{emoji}</span>)}
      </div>

      <header className="topbar">
        <div className="logo">⚡ HACKLINGO</div>
        <div className="stats">
          <span className="stat">🔥 {streak}</span>
          <span className="stat energy" onClick={conseguirEnergia} style={{ cursor: 'pointer' }}>⚡ {isVipUser ? '∞' : energy}</span>
          <span className="stat">⭐ {xp}</span>
          {isVipUser && <span className="stat stat-vip">👑</span>}
          <button className="profile-btn" onClick={() => { sOpen(); setShowProfile(true) }}>
            {userPhoto ? <img src={userPhoto} alt="" /> : userCharacter ? <Character config={userCharacter} /> : '👤'}
          </button>
        </div>
      </header>

      {toast && <div className="toast">{toast}</div>}
      {achievementToast && (
        <div className="achievement-toast">
          <div className="ach-icon">{achievementToast.icon}</div>
          <div><b>¡Logro!</b><p>{achievementToast.name}</p></div>
        </div>
      )}

      {showProfile && (
        <Profile
          user={user} userCharacter={userCharacter} xp={xp} energy={isVipUser ? 99999 : energy}
          streak={streak} completed={completed} love={love} coffee={coffee}
          premiumUnlocked={isVipUser} userPhoto={userPhoto} unlockedAchievements={unlockedAchievements}
          chapterReached={stats.chapterReached} volleyballWins={stats.volleyballWins}
          onUploadPhoto={handleUploadPhoto} onClose={() => setShowProfile(false)}
          onOpenCharBuilder={() => { setShowProfile(false); setShowCharBuilder(true) }}
          onOpenThemes={() => { setShowProfile(false); setShowThemes(true) }}
          onOpenSettings={() => { setShowProfile(false); setShowSettings(true) }}
          onOpenPremium={() => { setShowProfile(false); setShowPremiumInfo(true) }}
          onOpenAchievements={() => { setShowProfile(false); setShowAchievements(true) }}
          onOpenStory={() => { setShowProfile(false); setShowStory(true) }}
          onOpenChat={() => { setShowProfile(false); setShowChatScreen(true) }}
          onOpenVolleyball={() => { setShowProfile(false); setShowVolleyball(true) }}
          onOpenAdmin={() => { setShowProfile(false); setShowAdmin(true) }}
          onLogout={logout}
        />
      )}

      {showAchievements && <Achievements unlockedIds={unlockedAchievements} stats={{ ...stats, completed: completed.length, xp, level, streak, love, premium: isVipUser }} onClose={() => setShowAchievements(false)} />}
      {showStory && <StoryMode completed={completed.length} chapterReached={stats.chapterReached} onClose={() => setShowStory(false)} onPlayChapter={(ch) => { setShowStory(false); setCurrentChapter(ch); setCurrentScene(VIDEO_SCENES[ch.scenario]); setShowVideoScene(true) }} />}
      {showChatScreen && <ChatScreen waifu={selectedWaifu} user={user} onClose={() => setShowChatScreen(false)} onMessage={() => setStats(s => ({ ...s, chatMessages: s.chatMessages + 1 }))} />}
      {showVolleyball && <Volleyball waifu={selectedWaifu} onClose={() => setShowVolleyball(false)} onFinish={handleVolleyballFinish} />}
      {showAdmin && <AdminPanel user={user} onClose={() => setShowAdmin(false)} onGiveCoins={adminGiveCoins} onGiveLove={adminGiveLove} onResetProgress={adminResetProgress} />}
      {showVideoScene && currentScene && <VideoScene scene={currentScene} userCoffee={coffee} love={love} chapter={currentChapter} onFinish={handleVideoFinish} />}
      {showCharBuilder && <CharacterBuilder initial={userCharacter} onClose={() => setShowCharBuilder(false)} onSave={(config) => { setUserCharacter(config); localStorage.setItem('userCharacter', JSON.stringify(config)); setShowCharBuilder(false); showToast('✅ ¡Guardado!'); saveProgress({ userCharacter: config }) }} />}

      {showPremiumInfo && (
        <div className="shop-overlay">
          <div className="shop premium-showcase">
            <h2 className="gold-title">👑 HackLingo Premium</h2>
            <p className="shop-sub">Todo lo que incluye el acceso VIP</p>
            <div className="premium-grid">
              {PREMIUM_FEATURES.map((f, i) => (
                <div key={i} className="premium-feature">
                  <div className="premium-icon">{f.icon}</div>
                  <div><h4>{f.title}</h4><p>{f.desc}</p></div>
                </div>
              ))}
            </div>
            <div className="premium-cta-box">
              {isVipUser ? <div className="premium-active">✅ ¡Ya eres VIP!</div> : <button onClick={() => { setShowPremiumInfo(false); setShowPremiumModal(true) }} className="premium-cta">🔑 INGRESAR CÓDIGO</button>}
            </div>
            <button onClick={() => { sClose(); setShowPremiumInfo(false) }} className="close-shop">Cerrar</button>
          </div>
        </div>
      )}

      {showThemes && (
        <div className="shop-overlay">
          <div className="shop" style={{ maxWidth: 520 }}>
            <h2>🎨 Personalización Visual</h2>
            <p className="shop-sub">Se ve en vivo antes de aplicar</p>
            <div className="theme-grid">
              {THEMES.map(t => {
                const locked = t.premium && !isVipUser
                const active = themeId === t.id
                return (
                  <div key={t.id} className={`theme-card ${active ? 'active' : ''} ${locked ? 'locked' : ''} ${t.premium ? 'premium' : ''}`} onClick={() => selectTheme(t)}>
                    <div className="theme-preview">{t.preview.map((c, i) => <div key={i} className="theme-dot" style={{ background: c }} />)}</div>
                    <div className="theme-info"><span className="theme-emoji">{t.emoji}</span><b>{t.name}</b>{t.premium && <span className="premium-tag">VIP</span>}{locked && <span className="lock">🔒</span>}{active && <span className="check-mark">✓</span>}</div>
                  </div>
                )
              })}
            </div>
            <button onClick={() => { sClose(); setShowThemes(false) }} className="close-shop">Cerrar</button>
          </div>
        </div>
      )}

      {showEnergyModal && (
        <div className="shop-overlay">
          <div className="shop" style={{ maxWidth: 380 }}>
            <h2>⚡ Conseguir Energía</h2>
            <p className="shop-sub">Mira el anuncio para ganar energía</p>
            <div className="energy-progress">{[0, 1, 2].map(i => <div key={i} className={`energy-tap ${i < adsterraTaps ? 'filled' : ''}`}>{i < adsterraTaps ? '✓' : '⚡'}</div>)}</div>
            <p style={{ textAlign: 'center', fontSize: 13, margin: '12px 0' }}>{adsterraTaps}/{ADSTERRA_TAPS_NEEDED} anuncios</p>
            <button onClick={confirmarVerAnuncio} className="check-btn" style={{ width: '100%' }}>{admobReady ? `VER ANUNCIO (${adsterraTaps}/${ADSTERRA_TAPS_NEEDED})` : 'CARGANDO...'}</button>
            <button onClick={() => { sClose(); setShowEnergyModal(false) }} className="close-shop" style={{ marginTop: 8 }}>Cerrar</button>
          </div>
        </div>
      )}

      {showShop && (
        <div className="shop-overlay">
          <div className="shop">
            <h2>💎 Tienda de Waifus</h2>
            <p className="shop-sub">{isVipUser ? '✅ Premium activo' : '🔒 Código requerido para premium'}</p>
            <div className="waifu-grid">
              {WAIFUS.map(w => {
                const isActive = selectedWaifu.id === w.id
                const needsCode = w.premium && !isVipUser
                return (
                  <div key={w.id} className={`waifu-card ${isActive ? 'active' : ''} ${w.rarity}`}>
                    <img src={waifuImg(w)} alt={w.name} className="waifu-card-img" />
                    <div className="waifu-card-info">
                      <b>{w.name} <span className="rarity-badge">{w.rarity}</span> {w.premium && '👑'}</b>
                      <small>{w.desc}</small>
                      <button onClick={() => selectWaifu(w)} className={needsCode ? 'buy-btn' : 'equip-btn'}>
                        {needsCode ? '🔒 Código' : (isActive ? 'Equipada ✓' : 'Equipar')}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
            <button onClick={() => { sClose(); setShowShop(false) }} className="close-shop">Cerrar</button>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="shop-overlay">
          <div className="shop" style={{ maxWidth: 420 }}>
            <h2>⚙️ Ajustes Waifu</h2>
            <div className="setting-row"><label>Tamaño: <b>{waifuSize.toFixed(2)}x</b></label><input type="range" min="0.5" max="2.5" step="0.05" value={waifuSize} onChange={e => setWaifuSize(parseFloat(e.target.value))} className="slider" /></div>
            <div className="setting-row"><label>Pos X: <b>{waifuX}%</b></label><input type="range" min="0" max="100" value={waifuX} onChange={e => setWaifuX(parseFloat(e.target.value))} className="slider" /></div>
            <div className="setting-row"><label>Pos Y: <b>{waifuY}%</b></label><input type="range" min="0" max="100" value={waifuY} onChange={e => setWaifuY(parseFloat(e.target.value))} className="slider" /></div>
            <button onClick={() => { sClose(); setShowSettings(false) }} className="check-btn" style={{ width: '100%' }}>GUARDAR</button>
          </div>
        </div>
      )}

      {showPremiumModal && (
        <div className="shop-overlay">
          <div className="shop" style={{ maxWidth: 400 }}>
            <h2>👑 Código Premium</h2>
            <p className="shop-sub">Ingresa uno de los 10 códigos</p>
            <input value={premiumCodeInput} onChange={e => setPremiumCodeInput(e.target.value)} placeholder="HL-XXXX-XXXX-VIPX" className="chat-input" style={{ width: '100%', marginBottom: 12, textAlign: 'center', letterSpacing: 2 }} />
            {premiumError && <p style={{ color: '#f00', fontSize: 12 }}>{premiumError}</p>}
            <button onClick={validatePremiumCode} className="check-btn" style={{ width: '100%' }}>VALIDAR</button>
            <button onClick={() => { sClose(); setShowPremiumModal(false); setPendingPremiumWaifu(null) }} className="close-shop" style={{ marginTop: 8 }}>Cancelar</button>
          </div>
        </div>
      )}

      <div className="course-selector">
        {COURSES.map(c => (
          <button key={c.id} onClick={() => { sClick(); setCourseId(c.id) }} className={`course-chip ${courseId === c.id ? 'active' : ''}`} style={{ '--grad': c.gradient }}>
            <span>{c.emoji}</span><b>{c.name}</b><small>{completed.filter(id => id.startsWith(c.id)).length}/200</small>
          </button>
        ))}
      </div>

      <div className="main">
        <div className="course-header" style={{ background: course.gradient }}>
          <h1>{course.emoji} {course.name}</h1>
          <p>{course.desc} • {completed.filter(id => id.startsWith(courseId)).length}/200</p>
          <div className="waifu-mini-preview"><img src={waifuImg(selectedWaifu)} alt="waifu" /><span>{selectedWaifu.name} te acompaña</span></div>
        </div>

        <div className="duolingo-path">
          {lessons.slice(0, 50).map((ls, i) => {
            const done = completed.includes(ls.id)
            const unlocked = isLessonUnlocked(i)
            const offset = (i % 4 === 1 ? 40 : i % 4 === 2 ? -40 : i % 4 === 3 ? 20 : 0)
            return (
              <div key={ls.id} className="path-node-wrapper" style={{ marginLeft: `${offset}px` }}>
                <button onClick={() => startLesson(ls, i)} className={`path-node ${done ? 'done' : ''} ${!unlocked ? 'locked' : ''}`} disabled={!unlocked}>
                  <span className="node-num">{unlocked ? ls.num : '🔒'}</span>
                  {done && <span className="check">✓</span>}
                </button>
                <div className="node-label"><b>{ls.title}</b><small>⚡{ls.energyCost} • {ls.xp} XP</small></div>
              </div>
            )
          })}
        </div>
      </div>

      {lesson && (
        <div className="lesson-overlay">
          <div className="lesson-header">
            <button onClick={() => { sClose(); setLesson(null); setQIdx(0); setMood('neutral') }} className="close-btn">✕</button>
            <div className="progress-bar"><div style={{ width: `${(qIdx / lesson.questions.length) * 100}%` }}></div></div>
            <span className="progress-text">{qIdx + 1}/{lesson.questions.length}</span>
            <div className="energy-mini">⚡{isVipUser ? '∞' : energy}</div>
          </div>
          <div className="lesson-with-waifu">
            <div className="waifu-lesson-side">
              <img src={waifuImg(selectedWaifu)} alt="waifu" className={`waifu-lesson-img mood-${mood}`} />
              <div className="waifu-bubble-lesson">{waifuComment || (q?.isChat ? pickComment(selectedWaifu, 'chat') : `Pista: ${selectedWaifu.dialogs[0]}`)}</div>
            </div>
            <div className="lesson-card">
              {q?.isInfo || q?.type === 'explain' ? (
                <>
                  <div className="detail-box"><h2>📚 {lesson.title}</h2><pre className="detail-text">{q.q}</pre></div>
                  <button onClick={() => { sClick(); sayComment('info', 'neutral'); nextQuestion(true) }} className="check-btn" disabled={answerLockRef.current}>ENTENDIDO ⚡</button>
                </>
              ) : q?.isChat ? (
                <>
                  <h2 className="question-text">💬 Chat con {selectedWaifu.name}</h2>
                  <div className="chat-log">{chatLog.map((m, i) => <div key={i} className={`chat-msg ${m.from}`}>{m.text}</div>)}{isThinking && <div className="chat-msg waifu">...</div>}</div>
                  <div className="chat-input-row"><input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleChat()} placeholder="Escribe..." className="chat-input" /><button onClick={handleChat} className="send-btn">Enviar</button></div>
                  <button onClick={() => { sClick(); nextQuestion(true) }} className="next-btn" disabled={answerLockRef.current}>Continuar</button>
                </>
              ) : (
                <>
                  <div className="lesson-type">{q?.type?.toUpperCase?.() || 'RETO'}</div>
                  <h2 className="question-text">{q.q}</h2>
                  {q.terminal && <div className="terminal-box">{q.terminal}</div>}
                  {shuffledOpts && <div className="options-grid">{shuffledOpts.map((opt, i) => <button key={`${qIdx}-${i}`} onClick={() => nextQuestion(opt.correct)} className="option-btn" disabled={answerLockRef.current}>{opt.text}</button>)}</div>}
                  {q.type === 'truefalse' && <div className="options-grid"><button onClick={() => nextQuestion(q.correct === true)} className="option-btn" disabled={answerLockRef.current}>Verdadero ✅</button><button onClick={() => nextQuestion(q.correct === false)} className="option-btn" disabled={answerLockRef.current}>Falso ❌</button></div>}
                  {q.type === 'order' && <div>{q.items.map((it, i) => <div key={i} className="order-item">{i + 1}. {it}</div>)}<button onClick={() => nextQuestion(true)} className="check-btn" disabled={answerLockRef.current}>CONTINUAR</button></div>}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <button className="mini-chat-toggle" onClick={() => { sChatOpen(); setShowMiniChat(!showMiniChat) }}>{showMiniChat ? '✕' : '💬'}</button>

      {showMiniChat && (
        <div className="mini-chat" style={{ right: `${Math.max(10, 100 - waifuX)}%`, bottom: '60%' }}>
          <div className="mini-chat-header"><img src={waifuImg(selectedWaifu)} alt="" className="mini-chat-avatar" /><b>{selectedWaifu.name}</b></div>
          <div className="mini-chat-log">{chatLog.slice(-4).map((m, i) => <div key={i} className={`mini-msg ${m.from}`}>{m.text}</div>)}</div>
          <div className="mini-chat-input"><input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleChat()} placeholder="Dime algo..." /><button onClick={handleChat}>➤</button></div>
        </div>
      )}

      <div className="waifu-float" style={{ left: `${waifuX}%`, top: `${waifuY}%`, transform: `translate(-50%, -50%) scale(${waifuSize})` }}>
        <div className="waifu-glow" />
        <img src={waifuImg(selectedWaifu)} alt="waifu" className="waifu-img-3d" />
        {waifuComment && <div className="waifu-bubble">{waifuComment}</div>}
      </div>
    </div>
  )
}

export default function App() {
  return <AuthProvider><AppContent /></AuthProvider>
}
