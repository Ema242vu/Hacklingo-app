export const STORY_CHAPTERS = [
  { id: 1, title: 'El Inicio', emoji: '🌱', requiredLessons: 0, desc: 'Conoces a tu waifu en el campus virtual.', scenario: 'akari', dialog: ['¡Hola! Soy Akari, tu nueva tutora. Vamos a hackear el sistema educativo juntos. 😏', 'Pero primero... demuéstrame que eres digno. Completa 20 lecciones y te contaré mi secreto.'] },
  { id: 2, title: 'Primer Contacto', emoji: '💻', requiredLessons: 20, desc: 'Descubres un mensaje oculto en el código.', scenario: 'yuki', dialog: ['...encontré algo raro en el servidor del colegio.', 'No deberías investigar solo... ¿te ayudo?'] },
  { id: 3, title: 'La Sombra', emoji: '🌑', requiredLessons: 40, desc: 'Alguien está observando tus pasos.', scenario: 'akari', dialog: ['Senpai, ten cuidado. Hay alguien siguiendo nuestro progreso...', 'Y no es amigable. 😰'] },
  { id: 4, title: 'El Rival', emoji: '⚔️', requiredLessons: 60, desc: 'Aparece un hacker rival.', scenario: 'yuki', dialog: ['Ese chico del grupo contrario... dijo que era mejor que tú.', '...no me gustó cómo te miró. 💢'] },
  { id: 5, title: 'La Confesión', emoji: '💕', requiredLessons: 80, desc: 'Algo cambia entre ustedes.', scenario: 'akari', dialog: ['Oye... no es por nada, pero...', 'Solo quiero que sepas que me gusta pasar tiempo contigo. ////'] },
  { id: 6, title: 'El Enemigo', emoji: '👿', requiredLessons: 100, desc: 'Un hacker oscuro quiere destruir el sistema.', scenario: 'akari', dialog: ['¡Tenemos un problema! El sistema está siendo atacado.', '¡Necesito tu ayuda para defenderlo!'] },
  { id: 7, title: 'La Tormenta', emoji: '⛈️', requiredLessons: 120, desc: 'El servidor colapsa.', scenario: 'yuki', dialog: ['...todo se está cayendo. Tengo miedo.', 'Pero... contigo me siento más fuerte.'] },
  { id: 8, title: 'Cara a Cara', emoji: '🔥', requiredLessons: 140, desc: 'Encuentras al hacker oscuro.', scenario: 'akari', dialog: ['Eres tú... el que ha estado detrás de todo.', '¡Senpai! ¡Dame la orden y acabo con él! 🔥'] },
  { id: 9, title: 'La Batalla Final', emoji: '⚡', requiredLessons: 160, desc: 'El enfrentamiento definitivo.', scenario: 'akari', dialog: ['Todo depende de este momento.', 'Confío en ti, senpai. ¡Vamos!'] },
  { id: 10, title: 'Un Nuevo Comienzo', emoji: '🌸', requiredLessons: 180, desc: 'Después de la tormenta, la calma.', scenario: 'yuki', dialog: ['...lo logramos. Gracias por no dejarme sola.', '¿Seguimos juntos, verdad? 💕'] },
]

export function getAvailableChapter(completed) {
  let available = null
  for (const ch of STORY_CHAPTERS) {
    if (completed >= ch.requiredLessons) available = ch
  }
  return available
}
