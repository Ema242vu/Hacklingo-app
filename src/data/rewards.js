export const COFFEE_TYPES = [
  { id: 'latte', name: 'Latte', emoji: '☕', loveBonus: 8 },
  { id: 'frappe', name: 'Frappé', emoji: '🧋', loveBonus: 10 },
  { id: 'matcha', name: 'Matcha', emoji: '🍵', loveBonus: 12 },
  { id: 'mocha', name: 'Mocha', emoji: '🍫', loveBonus: 9 },
]

export const LOVE_LEVELS = [
  { min: 0, name: 'Desconocida', emoji: '💔', color: '#666' },
  { min: 20, name: 'Conocida', emoji: '🤝', color: '#8B7355' },
  { min: 40, name: 'Amiga', emoji: '😊', color: '#4A90E2' },
  { min: 60, name: 'Cercana', emoji: '💕', color: '#E94E77' },
  { min: 80, name: 'Enamorada', emoji: '💖', color: '#FF1493' },
  { min: 95, name: 'Obsesionada', emoji: '💘', color: '#FF0066' },
]

export function getLoveLevel(love) {
  let level = LOVE_LEVELS[0]
  for (const l of LOVE_LEVELS) if (love >= l.min) level = l
  return level
}

// Frases según emoción y contexto
export const VIDEO_SCENES = {
  akari: {
    id: 'akari',
    video: '/gk/Akari.mp4',
    name: 'Akari',
    askCoffee: [
      'Oye senpai... ¿me invitas un café? Estoy agotada de enseñarte. ☕',
      'Mmm... después de esa lección, un cafecito me vendría genial. ¿Me lo das? 🥺',
      'No es que necesite café, pero... bueno, sí lo necesito. ¿Me invitas? 😏',
    ],
    happy: [
      '¡Sí! ¡Sabía que eras el mejor senpai! 💕',
      '¡Gracias! Ahora sí puedo seguir enseñándote. ✨',
      'Mmm... qué rico. Eres un amor. 💖',
    ],
    sad: [
      'Tsk... eres un tacaño. 😤',
      'Baka... pensé que te importaba. 💢',
      'Olvídalo, no necesito tu café. Idiota. 😔',
    ],
    lessonComplete: [
      '¡Bien hecho senpai! Aunque podrías hacerlo mejor. ✨',
      'Otra lección dominada. ¿Ves? No eres tan inútil. 😏',
      '¡Sigue así y llegarás lejos! Pero invítame algo después. 💕',
    ],
  },
  yuki: {
    id: 'yuki',
    video: '/gk/Yuki.mp4',
    name: 'Yuki',
    askCoffee: [
      '...¿un café? Si quieres... no es obligatorio... ☕',
      'Mmm... tengo sueño... ¿me traerías un café? 🥺',
      '...perdón por pedir, pero ¿me invitas un café? 💕',
    ],
    happy: [
      '...gracias. Eres muy amable. 💕',
      '¡Qué rico! ...me alegra tenerte. 😊',
      'Mmm... te quiero mucho, senpai. 💖',
    ],
    sad: [
      '...está bien, no importa. 😢',
      'Mmm... no pasa nada. Supongo. 💔',
      '...olvídalo. Yo me lo compro. 😔',
    ],
    lessonComplete: [
      '...lo lograste. Estoy orgullosa de ti. ✨',
      'Bien hecho... ¿seguimos? 😊',
      'Eres bueno... pero practica más. 💕',
    ],
  },
}

export const COFFEE_CHANCE = 0.4 // 40% probabilidad de que pida café
