// ============================================
// OPCIONES DE PERSONAJE — Basado en PNGs
// ============================================
export const HAIR_STYLES = [
  { id: 'pelo1', name: 'Estilo 1', file: 'pelo 1' },
  { id: 'pelo2', name: 'Estilo 2', file: 'pelo 2' },
  { id: 'pelo3', name: 'Estilo 3', file: 'pelo 3' },
  { id: 'pelo4', name: 'Estilo 4', file: 'pelo 4' },
]

export const EYE_STYLES = [
  { id: 'ojos1', name: 'Estilo 1', file: 'ojos 1' },
  { id: 'ojos2', name: 'Estilo 2', file: 'ojos 2' },
]

export const DEFAULT_CHARACTER = {
  hairStyle: 'pelo1',
  eyeStyle: 'ojos1',
  name: 'Hacker',
}

// Genera la ruta de la imagen combinada
export function getCharacterImage(hairId, eyeId) {
  const hair = HAIR_STYLES.find(h => h.id === hairId)
  const eyes = EYE_STYLES.find(e => e.id === eyeId)
  if (!hair || !eyes) return '/gk/base.png'
  return `/gk/base con ${hair.file} y con ${eyes.file}.png`
}
