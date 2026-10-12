import { useState } from 'react'
import { sClick, sOpen, sClose } from '../sounds'
import { Character } from './CharacterBuilder'
import { getLoveLevel } from '../data/rewards'

export default function Profile({
  user,
  userCharacter,
  xp,
  energy,
  streak,
  completed,
  love,
  coffee,
  premiumUnlocked,
  userPhoto,
  unlockedAchievements,
  chapterReached,
  volleyballWins,
  onUploadPhoto,
  onClose,
  onOpenCharBuilder,
  onOpenThemes,
  onOpenSettings,
  onOpenPremium,
  onOpenAchievements,
  onOpenStory,
  onOpenChat,
  onOpenVolleyball,
  onOpenAdmin,
  onLogout,
}) {
  const loveLevel = getLoveLevel(love)
  const totalLessons = completed.length
  const achievementsCount = unlockedAchievements?.length || 0

  return (
    <div className="profile-overlay">
      <div className="profile-header">
        <button className="profile-close" onClick={() => { sClose(); onClose() }}>✕</button>
        <h1>👤 Mi Perfil</h1>
      </div>

      <div className="profile-body">
        {/* FOTO + INFO */}
        <div className="profile-top">
          <div className="profile-photo-wrap" onClick={onUploadPhoto}>
            {userPhoto ? (
              <img src={userPhoto} alt="Foto de perfil" className="profile-photo" />
            ) : userCharacter ? (
              <div className="profile-photo">
                <Character config={userCharacter} />
              </div>
            ) : (
              <div className="profile-photo placeholder">📷</div>
            )}
            <span className="profile-photo-edit">✏️</span>
          </div>
          <div className="profile-info">
            <h2>{user?.email?.split('@')[0] || 'Hacker'}</h2>
            <p>{user?.email}</p>
            <div className="profile-badges">
              {premiumUnlocked && <span className="badge vip">👑 VIP</span>}
              <span className="badge">🔥 {streak} días</span>
            </div>
          </div>
        </div>

        {/* AMOR */}
        <div className="profile-love">
          <div className="love-header">
            <span>{loveLevel.emoji} {loveLevel.name}</span>
            <span className="love-value" style={{ color: loveLevel.color }}>{love}/100</span>
          </div>
          <div className="love-bar">
            <div className="love-bar-fill" style={{ width: `${love}%`, background: loveLevel.color }} />
          </div>
          <p className="love-hint">
            {love < 40 ? 'Invítale café para subir su amor 💕' :
             love < 70 ? 'Cada vez le gustas más 💖' :
             '¡Está enamorada de ti! 💘'}
          </p>
        </div>

        {/* STATS */}
        <div className="profile-stats">
          <div className="pstat">
            <span className="pstat-emoji">⭐</span>
            <b>{xp}</b>
            <small>XP</small>
          </div>
          <div className="pstat">
            <span className="pstat-emoji">⚡</span>
            <b>{premiumUnlocked ? '∞' : `${energy}/100`}</b>
            <small>Energía</small>
          </div>
          <div className="pstat">
            <span className="pstat-emoji">📚</span>
            <b>{totalLessons}</b>
            <small>Lecciones</small>
          </div>
          <div className="pstat">
            <span className="pstat-emoji">🏆</span>
            <b>{achievementsCount}</b>
            <small>Logros</small>
          </div>
          <div className="pstat">
            <span className="pstat-emoji">☕</span>
            <b>{coffee}</b>
            <small>Cafés</small>
          </div>
          <div className="pstat">
            <span className="pstat-emoji">🏐</span>
            <b>{volleyballWins || 0}</b>
            <small>Voley</small>
          </div>
        </div>

        {/* PROGRESO HISTORIA */}
        <div className="profile-story-progress">
          <div className="story-progress-label">
            <span>📖 Historia</span>
            <span>Cap. {chapterReached || 0}/10</span>
          </div>
          <div className="story-progress-bar">
            <div style={{ width: `${((chapterReached || 0) / 10) * 100}%` }} />
          </div>
        </div>

        {/* MENÚ */}
        <div className="profile-menu">
          <div className="profile-menu-title">🎮 Contenido</div>
          <button className="profile-item" onClick={() => { sOpen(); onOpenChat() }}>
            <span className="pi-icon" style={{ background: 'linear-gradient(135deg,#E94E77,#A82842)' }}>💬</span>
            <div><b>Chat con Waifu</b><small>Habla con voz y video</small></div>
            <span className="pi-arrow">›</span>
          </button>
          <button className="profile-item" onClick={() => { sOpen(); onOpenStory() }}>
            <span className="pi-icon" style={{ background: 'linear-gradient(135deg,#A855F7,#6B21A8)' }}>📖</span>
            <div><b>Modo Historia</b><small>{chapterReached || 0}/10 capítulos</small></div>
            <span className="pi-arrow">›</span>
          </button>
          <button className="profile-item" onClick={() => { sOpen(); onOpenVolleyball() }}>
            <span className="pi-icon" style={{ background: 'linear-gradient(135deg,#00B8FF,#008F70)' }}>🏐</span>
            <div><b>Voleibol en la Playa</b><small>Minijuego + recompensas</small></div>
            <span className="pi-arrow">›</span>
          </button>
          <button className="profile-item" onClick={() => { sOpen(); onOpenAchievements() }}>
            <span className="pi-icon" style={{ background: 'linear-gradient(135deg,#F59E0B,#C87F0A)' }}>🏆</span>
            <div><b>Logros</b><small>{achievementsCount}/29 desbloqueados</small></div>
            <span className="pi-arrow">›</span>
          </button>

          <div className="profile-menu-title" style={{ marginTop: 16 }}>🎨 Personalización</div>
          <button className="profile-item" onClick={() => { sOpen(); onOpenCharBuilder() }}>
            <span className="pi-icon" style={{ background: '#8B5CF6' }}>🎭</span>
            <div><b>Mi Personaje</b><small>Personaliza tu avatar</small></div>
            <span className="pi-arrow">›</span>
          </button>
          <button className="profile-item" onClick={() => { sOpen(); onOpenThemes() }}>
            <span className="pi-icon" style={{ background: '#EC4899' }}>🎨</span>
            <div><b>Temas Anime</b><small>12 estilos visuales</small></div>
            <span className="pi-arrow">›</span>
          </button>
          <button className="profile-item" onClick={() => { sOpen(); onOpenSettings() }}>
            <span className="pi-icon" style={{ background: '#06B6D4' }}>⚙️</span>
            <div><b>Ajustes de Waifu</b><small>Tamaño y posición</small></div>
            <span className="pi-arrow">›</span>
          </button>

          <div className="profile-menu-title" style={{ marginTop: 16 }}>⚙️ Cuenta</div>
          <button className="profile-item premium-item" onClick={() => { sOpen(); onOpenPremium() }}>
            <span className="pi-icon" style={{ background: 'linear-gradient(135deg,#f39c12,#c87f0a)' }}>👑</span>
            <div><b>{premiumUnlocked ? 'Premium Activo' : 'Premium'}</b><small>{premiumUnlocked ? 'Eres miembro VIP' : 'Desbloquea todo'}</small></div>
            <span className="pi-arrow">›</span>
          </button>
          <button className="profile-item" onClick={() => { sOpen(); onOpenAdmin() }}>
            <span className="pi-icon" style={{ background: '#333' }}>🔐</span>
            <div><b>Panel Admin</b><small>Solo creador</small></div>
            <span className="pi-arrow">›</span>
          </button>
          <button className="profile-item" onClick={onLogout}>
            <span className="pi-icon" style={{ background: '#e94560' }}>🚪</span>
            <div><b>Cerrar Sesión</b><small>Salir de tu cuenta</small></div>
            <span className="pi-arrow">›</span>
          </button>
        </div>

        <p className="profile-version">HackLingo v3.0 • Hecho con 💖</p>
      </div>
    </div>
  )
}
