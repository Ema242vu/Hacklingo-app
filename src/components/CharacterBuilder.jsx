import { useState } from 'react'
import { sClick, sCorrect } from '../sounds'
import {
  HAIR_STYLES, EYE_STYLES, DEFAULT_CHARACTER, getCharacterImage,
} from '../data/characterOptions'

// Componente ligero para mostrar el personaje
export function Character({ config }) {
  if (!config) return null
  const src = getCharacterImage(config.hairStyle, config.eyeStyle)
  return (
    <img
      src={src}
      alt={config.name || 'Personaje'}
      style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
      draggable={false}
    />
  )
}

export default function CharacterBuilder({ initial, onSave, onClose }) {
  const [config, setConfig] = useState(initial || DEFAULT_CHARACTER)
  const [tab, setTab] = useState('hair')

  const update = (key, value) => {
    sClick()
    setConfig(c => ({ ...c, [key]: value }))
  }

  const tabs = [
    { id: 'hair', name: 'Pelo', emoji: '💇' },
    { id: 'eyes', name: 'Ojos', emoji: '👁️' },
  ]

  const currentSrc = getCharacterImage(config.hairStyle, config.eyeStyle)

  return (
    <div className="shop-overlay">
      <div className="char-builder">
        <div className="char-builder-header">
          <h2>🎭 Crea tu Personaje</h2>
          <button className="char-close" onClick={() => { sClick(); onClose && onClose() }}>✕</button>
        </div>

        <div className="char-builder-body">
          {/* Preview */}
          <div className="char-preview">
            <div className="char-preview-inner">
              <img src={currentSrc} alt="Preview" draggable={false} />
            </div>
            <p className="char-preview-name">{config.name}</p>
          </div>

          {/* Opciones */}
          <div className="char-options">
            <div className="char-tabs">
              {tabs.map(t => (
                <button
                  key={t.id}
                  className={`char-tab ${tab === t.id ? 'active' : ''}`}
                  onClick={() => { sClick(); setTab(t.id) }}
                >
                  <span>{t.emoji}</span>
                  <small>{t.name}</small>
                </button>
              ))}
            </div>

            <div className="char-tab-content">
              {tab === 'hair' && (
                <>
                  <p className="char-label">Elige el peinado</p>
                  <div className="char-grid">
                    {HAIR_STYLES.map(h => {
                      const previewSrc = getCharacterImage(h.id, config.eyeStyle)
                      return (
                        <button
                          key={h.id}
                          className={`char-style-card ${config.hairStyle === h.id ? 'active' : ''}`}
                          onClick={() => update('hairStyle', h.id)}
                        >
                          <div className="char-style-preview">
                            <img src={previewSrc} alt={h.name} draggable={false} />
                          </div>
                          <small>{h.name}</small>
                        </button>
                      )
                    })}
                  </div>
                </>
              )}

              {tab === 'eyes' && (
                <>
                  <p className="char-label">Elige los ojos</p>
                  <div className="char-grid">
                    {EYE_STYLES.map(e => {
                      const previewSrc = getCharacterImage(config.hairStyle, e.id)
                      return (
                        <button
                          key={e.id}
                          className={`char-style-card ${config.eyeStyle === e.id ? 'active' : ''}`}
                          onClick={() => update('eyeStyle', e.id)}
                        >
                          <div className="char-style-preview">
                            <img src={previewSrc} alt={e.name} draggable={false} />
                          </div>
                          <small>{e.name}</small>
                        </button>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="char-builder-footer">
          <input
            className="char-name-input"
            placeholder="Nombre de tu personaje"
            value={config.name}
            onChange={e => setConfig(c => ({ ...c, name: e.target.value }))}
            maxLength={20}
          />
          <button className="char-save-btn" onClick={() => { sCorrect(); onSave && onSave(config) }}>
            💾 GUARDAR
          </button>
        </div>
      </div>
    </div>
  )
}
