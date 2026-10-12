import { STORY_CHAPTERS } from '../data/story'
import { sOpen, sClose, sChapterUnlock, sClick } from '../sounds'

export default function StoryMode({ completed, chapterReached, onClose, onPlayChapter }) {
  return (
    <div className="profile-overlay">
      <div className="profile-header">
        <button className="profile-close" onClick={() => { sClose(); onClose() }}>✕</button>
        <h1>📖 Modo Historia</h1>
      </div>
      <div className="profile-body">
        <p style={{ textAlign: 'center', opacity: .7, fontSize: 13, marginBottom: 16 }}>
          Completa lecciones para desbloquear la historia
        </p>
        <div className="story-list">
          {STORY_CHAPTERS.map(ch => {
            const unlocked = completed >= ch.requiredLessons
            const played = chapterReached >= ch.id
            return (
              <div key={ch.id} className={`story-chapter ${unlocked ? 'unlocked' : 'locked'} ${played ? 'played' : ''}`}>
                <div className="story-chapter-emoji">{unlocked ? ch.emoji : '🔒'}</div>
                <div className="story-chapter-info">
                  <b>{ch.title}</b>
                  <small>{ch.desc}</small>
                  <span className="story-req">
                    {unlocked ? (played ? '✓ Completado' : `${ch.requiredLessons}+ lecciones` ) : `Requiere ${ch.requiredLessons} lecciones`}
                  </span>
                </div>
                {unlocked && (
                  <button className="story-play-btn" onClick={() => { sClick(); onPlayChapter(ch) }}>
                    {played ? 'Releer' : '▶'}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
