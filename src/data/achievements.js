export const RARITIES = {
  comun: { name: 'Común', color: '#8B8B8B', emoji: '⚪', order: 1 },
  raro: { name: 'Raro', color: '#4A90E2', emoji: '🔵', order: 2 },
  epico: { name: 'Épico', color: '#A855F7', emoji: '🟣', order: 3 },
  legendario: { name: 'Legendario', color: '#F59E0B', emoji: '🟠', order: 4 },
  super_legendario: { name: 'Super Legendario', color: '#FF0066', emoji: '🔴', order: 5 },
}

export const ACHIEVEMENTS = [
  // COMÚN
  { id: 'first_lesson', name: 'Primer Paso', desc: 'Completa tu primera lección', icon: '👶', rarity: 'comun', check: (s) => s.completed >= 1 },
  { id: 'first_chat', name: 'Primera Conversación', desc: 'Chatea con tu waifu', icon: '💬', rarity: 'comun', check: (s) => s.chatMessages >= 1 },
  { id: 'first_coffee', name: 'Café Inicial', desc: 'Dale el primer café', icon: '☕', rarity: 'comun', check: (s) => s.coffeesGiven >= 1 },
  { id: 'login_3', name: 'Constante', desc: 'Entra 3 días seguidos', icon: '🔥', rarity: 'comun', check: (s) => s.streak >= 3 },
  { id: 'level_5', name: 'Aprendiz', desc: 'Alcanza el nivel 5', icon: '⭐', rarity: 'comun', check: (s) => s.level >= 5 },
  { id: 'coins_100', name: 'Ahorrador', desc: 'Acumula 100 XP', icon: '💰', rarity: 'comun', check: (s) => s.xp >= 100 },
  // RARO
  { id: 'lessons_10', name: 'Estudioso', desc: 'Completa 10 lecciones', icon: '📚', rarity: 'raro', check: (s) => s.completed >= 10 },
  { id: 'chat_25', name: 'Conversador', desc: '25 mensajes al chat', icon: '🗣️', rarity: 'raro', check: (s) => s.chatMessages >= 25 },
  { id: 'love_50', name: 'Amigo Especial', desc: 'Llega a 50 de amor', icon: '💕', rarity: 'raro', check: (s) => s.love >= 50 },
  { id: 'login_7', name: 'Dedicado', desc: 'Racha de 7 días', icon: '🔥', rarity: 'raro', check: (s) => s.streak >= 7 },
  { id: 'level_10', name: 'Intermedio', desc: 'Alcanza el nivel 10', icon: '🌟', rarity: 'raro', check: (s) => s.level >= 10 },
  { id: 'volleyball_win', name: 'Voleibolista', desc: 'Gana un partido de voleibol', icon: '🏐', rarity: 'raro', check: (s) => s.volleyballWins >= 1 },
  // ÉPICO
  { id: 'lessons_50', name: 'Erudito', desc: 'Completa 50 lecciones', icon: '🧠', rarity: 'epico', check: (s) => s.completed >= 50 },
  { id: 'chat_100', name: 'Alma Gemela', desc: '100 mensajes al chat', icon: '💞', rarity: 'epico', check: (s) => s.chatMessages >= 100 },
  { id: 'love_80', name: 'Enamorada', desc: 'Llega a 80 de amor', icon: '💖', rarity: 'epico', check: (s) => s.love >= 80 },
  { id: 'coffee_20', name: 'Barista', desc: '20 cafés entregados', icon: '🧋', rarity: 'epico', check: (s) => s.coffeesGiven >= 20 },
  { id: 'chapter_3', name: 'Aventurero', desc: 'Termina el capítulo 3', icon: '📖', rarity: 'epico', check: (s) => s.chapterReached >= 3 },
  { id: 'volleyball_5', name: 'Campeón', desc: 'Gana 5 partidos', icon: '🏆', rarity: 'epico', check: (s) => s.volleyballWins >= 5 },
  // LEGENDARIO
  { id: 'lessons_150', name: 'Maestro', desc: 'Completa 150 lecciones', icon: '👑', rarity: 'legendario', check: (s) => s.completed >= 150 },
  { id: 'love_100', name: 'Obsesionada', desc: 'Amor al máximo', icon: '💘', rarity: 'legendario', check: (s) => s.love >= 100 },
  { id: 'streak_30', name: 'Imparable', desc: 'Racha de 30 días', icon: '⚡', rarity: 'legendario', check: (s) => s.streak >= 30 },
  { id: 'level_25', name: 'Veterano', desc: 'Alcanza el nivel 25', icon: '🎖️', rarity: 'legendario', check: (s) => s.level >= 25 },
  { id: 'chat_500', name: 'Íntimos', desc: '500 mensajes al chat', icon: '💝', rarity: 'legendario', check: (s) => s.chatMessages >= 500 },
  { id: 'all_courses_50', name: 'Multidisciplinario', desc: '50 lecciones en cada curso', icon: '🌈', rarity: 'legendario', check: (s) => s.allCourses50 },
  // SUPER LEGENDARIO
  { id: 'lessons_all', name: 'Leyenda', desc: 'Completa TODAS las lecciones', icon: '🌌', rarity: 'super_legendario', check: (s) => s.completed >= 800 },
  { id: 'coffee_100', name: 'Donante', desc: '100 cafés entregados', icon: '☕✨', rarity: 'super_legendario', check: (s) => s.coffeesGiven >= 100 },
  { id: 'perfect_lesson', name: 'Perfecto', desc: '10 lecciones sin errores', icon: '💎', rarity: 'super_legendario', check: (s) => s.perfectLessons >= 10 },
  { id: 'chapter_all', name: 'Héroe Legendario', desc: 'Termina la historia completa', icon: '🐉', rarity: 'super_legendario', check: (s) => s.chapterReached >= 10 },
  { id: 'premium_member', name: 'Miembro VIP', desc: 'Desbloquea el Premium', icon: '👑', rarity: 'super_legendario', check: (s) => s.premium },
]

export function getRarity(rarityId) {
  return RARITIES[rarityId] || RARITIES.comun
}
