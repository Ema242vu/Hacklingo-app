import { ACHIEVEMENTS, getRarity, RARITIES } from '../data/achievements'
import { sOpen, sClose } from '../sounds'

export default function Achievements({ unlockedIds, stats, onClose }) {
  const unlocked = unlockedIds || []
  const grouped = Object.keys(RARITIES).sort((a, b) => RARITIES[a].order - RARITIES[b].order)

  return (
    <div className="profile-overlay">
      <div className="profile-header">
        <button className="profile-close" onClick={() => { sClose(); onClose() }}>✕</button>
        <h1>🏆 Logros ({unlocked.length}/{ACHIEVEMENTS.length})</h1>
      </div>
      <div className="profile-body">
        {grouped.map(rarity => {
          const list = ACHIEVEMENTS.filter(a => a.rarity === rarity)
          const r = RARITIES[rarity]
          return (
            <div key={rarity} className="achievement-group">
              <div className="achievement-group-title" style={{ color: r.color }}>
                {r.emoji} {r.name} ({list.filter(a => unlocked.includes(a.id)).length}/{list.length})
              </div>
              <div className="achievement-list">
                {list.map(a => {
                  const isUnlocked = unlocked.includes(a.id)
                  return (
                    <div key={a.id} className={`achievement-item ${isUnlocked ? 'unlocked' : 'locked'}`}
                      style={{ borderColor: isUnlocked ? r.color : 'rgba(255,255,255,.08)' }}>
                      <div className="achievement-icon" style={{ background: isUnlocked ? r.color : 'rgba(0,0,0,.3)' }}>
                        {isUnlocked ? a.icon : '🔒'}
                      </div>
                      <div className="achievement-info">
                        <b>{a.name}</b>
                        <small>{a.desc}</small>
                      </div>
                      {isUnlocked && <span className="achievement-check">✓</span>}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
