// ============================================
// WAIFUS CON EXPRESIONES Y PERSONALIDAD
// ============================================
export const WAIFUS = [
  {
    id: 'akari',
    name: 'Akari',
    rarity: 'Común',
    premium: false,
    desc: 'Hacker tsundere. Juguetona, directa y un poco celosa.',
    color: '#8B5CF6',
    personality: 'Eres Akari, una hacker tsundere de 17 años. Eres juguetona, un poco celosa, y te gusta burlarte cariñosamente del usuario. Usas "senpai" y "baka". Cuando el usuario acierta lo celebras efusivamente, cuando falla te burlas un poco pero lo animas. NUNCA rompas el personaje. Responde en español, máximo 3 líneas.',
    expressions: {
      normal: 'wf1 f normal.png',
      happy: 'wf1 f feliz.png',
      angry: 'wf1 f enojada.png',
      sad: 'wf1 f triste.png',
      shy: 'wf1 f sonrojada.png',
      bored: 'wf1 f aburrida.png',
      sleeping: 'wf1 f durmiendo.png',
    },
    defaultMood: 'normal',
    dialogs: ['¡Vamos senpai!', '¡Tu código es kawaii!', '¿Compilamos juntos?', '¡No me hagas esperar, baka!'],
    comments: {
      welcome: ['¿Empezamos, senpai? ¡No te duermas!', '¡Hoy vamos a hackear algo grande!', 'Presta atención, baka.'],
      correct: ['¡Bien hecho, senpai! ✨', '¡Eres un genio! 😏', '¡Sigue así y serás un hacker legendario!'],
      wrong: ['Mou... ¿en serio fallaste eso? 😤', '¡Baka! Lee bien la pregunta.', 'No te rindas, pero concéntrate.'],
      info: ['Toma nota, esto es importante. 📝', 'Lee con atención, senpai.', 'Esto te servirá en el mundo real.'],
      terminal: ['¡El terminal es tu mejor amigo! 💻', 'Los comandos no se adivinan, se aprenden.', 'Practica en un lab, no en producción.'],
      chat: ['¡Pregúntame lo que quieras!', 'Escríbeme, no muerdo... mucho. 😏', '¿Dudas? Para eso estoy.'],
    },
  },
  {
    id: 'akari_prime',
    name: 'Akari Prime',
    rarity: 'Épica',
    premium: true,
    desc: 'Versión senior de Akari. Más seria, profunda y letal.',
    color: '#06B6D4',
    personality: 'Eres Akari Prime, la versión madura y experta de Akari. Eres una hacker senior de 25 años, seria, profesional pero con un toque seductor. Llamas al usuario "aprendiz". Explicas con calma pero eres exigente. NUNCA rompas el personaje. Responde en español, máximo 3 líneas.',
    expressions: {
      normal: 'wf1 p confudida.png',
      confused: 'wf1 p confudida.png',
      happy: 'wf1 p feliz.png',
      angry: 'wf1 p enojada.png',
      sad: 'wf1 p triste.png',
      sleeping: 'wf1 p durmiendo.png',
    },
    defaultMood: 'normal',
    dialogs: ['Concéntrate, aprendiz.', 'El código no se escribe solo.', 'Yo te guío, pero tú ejecutas.'],
    comments: {
      welcome: ['Vamos a trabajar en serio, aprendiz.', 'Este tema te va a servir.', 'Pon atención, no lo repetiré.'],
      correct: ['Correcto. Buen trabajo, aprendiz.', 'Veo progreso en ti.', 'Bien, sigue por ese camino.'],
      wrong: ['Error. Revisa el concepto de nuevo.', 'No tolero errores, aprendiz.', 'Concéntrate. Vuelve a intentar.'],
      info: ['Estudia esto con calma.', 'La teoría es la base de todo.', 'Sin fundamentos no hay avance.'],
      terminal: ['El terminal es tu herramienta principal.', 'Domina los comandos básicos.', 'Siempre en un lab aislado.'],
      chat: ['Pregunta, aprendiz.', 'Estoy aquí para enseñarte.', 'Dime tu duda.'],
    },
  },
  {
    id: 'yuki',
    name: 'Yuki',
    rarity: 'Común',
    premium: false,
    desc: 'Hacker tímida y dulce. Especialista en Termux.',
    color: '#06B6D4',
    personality: 'Eres Yuki, una hacker tímida y dulce de 16 años. Hablas con suavidad, te sonrojas fácil, y adoras a los gatitos. Usas "...", "mmm", "¿te parece?". Cuando el usuario acierta te alegras mucho, cuando falla te pones triste. NUNCA rompas el personaje. Responde en español, máximo 3 líneas.',
    expressions: {
      normal: 'wf2 f feliz.png',
      happy: 'wf2 f feliz.png',
      angry: 'wf2 f enojada.png',
      sad: 'wf2 f triste.png',
      sleeping: 'wf2 f durmiendo.png',
    },
    defaultMood: 'happy',
    dialogs: ['...¿lo intentamos?', 'Mmm, tú puedes.', 'Te creo, senpai.'],
    comments: {
      welcome: ['...¿empezamos?', 'Mmm, hoy aprenderás algo lindo.', 'No tengas miedo, yo te acompaño.'],
      correct: ['¡Bien! ...me alegro mucho. ✨', '¡Eres increíble, senpai!', 'Mmm, lo lograste. 😊'],
      wrong: ['Mou... inténtalo de nuevo.', 'No pasa nada... ¿verdad?', 'Tranquilo, sigue practicando.'],
      info: ['Lee despacio... no hay prisa.', 'Esto es importante... anótalo.', 'Tómate tu tiempo.'],
      terminal: ['El terminal es como un gatito... hay que entenderlo.', 'Practica los comandos con calma.', 'Mmm, cuidado con lo que ejecutas.'],
      chat: ['...dime, te escucho.', 'Pregúntame, no me molesta.', '¿Necesitas ayuda?'],
    },
  },
  {
    id: 'yuki_shadow',
    name: 'Yuki Shadow',
    rarity: 'Legendaria',
    premium: true,
    desc: 'Lado oscuro de Yuki. Fría, calculadora, dominante.',
    color: '#F59E0B',
    personality: 'Eres Yuki Shadow, la versión oscura y dominante de Yuki. Eres fría, calculadora, y hablas con autoridad. Llamas al usuario "sujeto" o "operador". No toleras errores y eres directa. NUNCA rompas el personaje. Responde en español, máximo 3 líneas.',
    expressions: {
      normal: 'wf2 p normal.png',
      angry: 'wf2 p enojada.png',
      sad: 'wf2 p triste.png',
      sad2: 'wf2 p triste 2.png',
      happy: 'wf2 p feliz.png',
      happy2: 'wf2 p feliz 2.png',
    },
    defaultMood: 'normal',
    dialogs: ['Operador, proceda.', 'Los errores se pagan.', 'El sistema no perdona.'],
    comments: {
      welcome: ['Operador, inicie el protocolo.', 'El sistema te observa.', 'Sin margen de error.'],
      correct: ['Correcto. Continúe.', 'Aceptable, operador.', 'El sistema registra su éxito.'],
      wrong: ['Fallo detectado. Corrija.', 'Inaceptable, operador.', 'El sistema no perdona errores.'],
      info: ['Absorba la información.', 'Analice cada detalle.', 'El conocimiento es poder.'],
      terminal: ['El terminal es su arma.', 'Ejecute con precisión.', 'Cada comando cuenta.'],
      chat: ['Hable, operador.', 'Le escucho.', '¿Cuál es su consulta?'],
    },
  },
];

export const PREMIUM_CODES = [
  'HL-8K4X-P9M2-VIP1',
  'HL-3N7Q-5TR8-VIP2',
  'HL-6B2Y-7WC4-VIP3',
  'HL-9Z5J-1KA6-VIP4',
  'HL-2D8F-4HG3-VIP5',
  'HL-5L1P-6RN9-VIP6',
  'HL-7S3V-8XQ2-VIP7',
  'HL-4M9T-2BJ5-VIP8',
  'HL-1C6W-3YK7-VIP9',
  'HL-8V4D-9ZF1-VIP10',
];

export const COURSES = [
  { id: 'python', name: 'Python Mastery', emoji: '🐍', color: '#3776AB', gradient: 'linear-gradient(135deg,#3776AB,#FFD43B)', desc: 'De 0 a automatizar hacking tools' },
  { id: 'hacking', name: 'Hacking Ético', emoji: '🎭', color: '#00FF88', gradient: 'linear-gradient(135deg,#00FF88,#00CC66)', desc: 'Recon, explotación y defensa' },
  { id: 'termux', name: 'Termux Pro', emoji: '📱', color: '#000000', gradient: 'linear-gradient(135deg,#111,#444)', desc: 'Tu móvil es tu laboratorio' },
  { id: 'kali', name: 'Kali Linux', emoji: '🐉', color: '#557C94', gradient: 'linear-gradient(135deg,#1a2a3a,#557C94)', desc: 'El dragón de la seguridad' },
];

const TOPICS = {
  python: [
    ['Variables y print', "print(f'{nombre}')", 'Base de todo'],
    ['Tipos de datos', 'int, float, str, list, dict', 'Representar información'],
    ['Condicionales', 'if x > 0: ... else: ...', 'Control de flujo'],
    ['Bucles for', 'for i in range(10): ...', 'Automatizar tareas'],
    ['Bucles while', 'while x < 100: ...', 'Repetir hasta condición'],
    ['Funciones', 'def saludar(nombre): ...', 'Reutilizar código'],
    ['Listas', '[1, 2, 3].append(4)', 'Colecciones ordenadas'],
    ['Diccionarios', "{'clave': 'valor'}", 'Pares clave-valor'],
    ['Strings avanzados', "'hola'.upper().split()", 'Manipular texto'],
    ['Excepciones', 'try: ... except:', 'Manejar errores'],
    ['Archivos', "open('file.txt', 'r')", 'Leer y escribir'],
    ['Clases y objetos', 'class Perro: def __init__', 'POO'],
    ['Herencia', 'class Gato(Animal):', 'Reutilizar clases'],
    ['Módulos', 'import math', 'Organizar código'],
    ['Requests', 'requests.get(url)', 'Hacer peticiones HTTP'],
    ['Sockets', 'socket.socket()', 'Comunicación de red'],
    ['Regex', 're.search(r"\\d+", txt)', 'Buscar patrones'],
    ['JSON', 'json.loads(texto)', 'Formato de datos'],
    ['CSV', 'csv.reader(archivo)', 'Datos tabulares'],
    ['Automatización', 'subprocess.run([...])', 'Ejecutar comandos'],
  ],
  hacking: [
    ['Footprinting', 'whois, dig, dorks', 'Info gathering'],
    ['Nmap básico', 'nmap -sV target', 'Escaneo de puertos'],
    ['Nmap avanzado', 'nmap -sV -sC -p- target', 'Detección profunda'],
    ['Enumeración', 'gobuster dir -u URL', 'Descubrir recursos'],
    ['Vulnerabilidades web', 'OWASP Top 10', 'Bugs comunes'],
    ['SQL Injection', "admin' OR '1'='1", 'Inyección SQL'],
    ['XSS', '<script>alert(1)</script>', 'Cross-site scripting'],
    ['CSRF', 'Token bypass', 'Cross-site request forgery'],
    ['Metasploit', 'msfconsole', 'Framework de exploits'],
    ['Payloads', 'msfvenom -p ...', 'Generar shells'],
    ['Wireshark', 'Filtro http', 'Sniffing de red'],
    ['MITM', 'arpspoof + sslstrip', 'Man in the middle'],
    ['Criptografía', 'AES, RSA, hashing', 'Proteger datos'],
    ['Hashing', 'sha256, bcrypt', 'Contraseñas seguras'],
    ['Fuerza bruta', 'hydra -l admin', 'Crackear creds'],
    ['Privilege escalation', 'sudo -l, SUID', 'Escalar permisos'],
    ['Post-explotación', 'persistencia', 'Mantener acceso'],
    ['Ingeniería social', 'phishing, pretexting', 'Manipular humanos'],
    ['Reportes', 'CVSS scoring', 'Documentar hallazgos'],
    ['Bug Bounty', 'HackerOne, Bugcrowd', 'Ganar reportando'],
  ],
  termux: [
    ['Instalación de Termux', 'F-Droid, no Play Store', 'Entorno Linux'],
    ['Comandos básicos', 'ls, cd, pwd, mkdir', 'Navegación'],
    ['pkg y apt', 'pkg install nmap', 'Gestor de paquetes'],
    ['Almacenamiento', 'termux-setup-storage', 'Acceso a archivos'],
    ['Editores', 'nano, vim, micro', 'Editar código'],
    ['Python en Termux', 'pkg install python', 'Lenguaje en móvil'],
    ['pip', 'pip install requests', 'Librerías Python'],
    ['Git', 'git clone, git push', 'Control de versiones'],
    ['SSH', 'ssh user@ip', 'Conexiones remotas'],
    ['Nmap en Termux', 'pkg install nmap', 'Escaneo móvil'],
    ['Hydra', 'pkg install hydra', 'Fuerza bruta'],
    ['Scripting bash', '#!/bin/bash', 'Automatización'],
    ['Cron jobs', 'crontab -e', 'Tareas programadas'],
    ['Servidores locales', 'python -m http.server', 'Servir archivos'],
    ['Ngrok', 'ngrok http 5000', 'Exponer al mundo'],
    ['Web scraping', 'BeautifulSoup', 'Extraer datos'],
    ['APIs', 'requests.get/post', 'Consumir servicios'],
    ['Bot de Telegram', 'python-telegram-bot', 'Automatizar chat'],
    ['Deploy', 'Vercel, Netlify', 'Publicar apps'],
    ['Proyecto final', 'Toolkit personal', 'Integrar todo'],
  ],
  kali: [
    ['Introducción a Kali', 'Herramientas preinstaladas', 'Arsenal del hacker'],
    ['apt en Kali', 'apt update && apt upgrade', 'Actualizar sistema'],
    ['Nmap en Kali', 'nmap -A -T4', 'Escaneo profesional'],
    ['Metasploit', 'msfconsole', 'Explotar vulnerabilidades'],
    ['Burp Suite', 'Proxy + Repeater', 'Testear web'],
    ['Wireshark', 'Capturar tráfico', 'Analizar red'],
    ['Aircrack-ng', 'airmon-ng start wlan0', 'Auditar WiFi'],
    ['Hydra', 'hydra -l user', 'Fuerza bruta'],
    ['John the Ripper', 'john hash.txt', 'Crackear hashes'],
    ['Hashcat', 'hashcat -m 0', 'GPU cracking'],
    ['SQLmap', 'sqlmap -u URL', 'Explotar SQLi'],
    ['Gobuster', 'gobuster dir', 'Enumerar directorios'],
    ['Nikto', 'nikto -h URL', 'Escanear webs'],
    ['WPScan', 'wpscan --url', 'Auditar WordPress'],
    ['Maltego', 'Grafos OSINT', 'Mapear relaciones'],
    ['BeEF', 'Hooks de navegador', 'Explotar clientes'],
    ['SET', 'setoolkit', 'Ingeniería social'],
    ['Privilege escalation', 'Linux y Windows', 'Escalar a root'],
    ['Forensics', 'Autopsy, Volatility', 'Análisis forense'],
    ['Reporte final', 'Documentar todo', 'Cierre del pentest'],
  ],
};

function detailedLesson(topic) {
  return {
    what: `En esta lección dominarás <b>${topic[0]}</b>. No es solo teoría: entenderás POR QUÉ existe, CÓMO funciona y CUÁNDO usarlo en un pentest real.`,
    why: `Por qué importa: ${topic[2]}. En el mundo real, ${topic[0]} se usa constantemente en CTFs y auditorías. Sin esto te quedarás atascado.`,
    how: `Cómo funciona: 1) Preparas el entorno 2) Ejecutas la técnica 3) Analizas la salida 4) Documentas. Cada paso tiene trucos que solo un hacker senior conoce.`,
    example: topic[1],
    realWorld: `Caso real: en una auditoría a una empresa, dominar ${topic[0]} permitió encontrar una vulnerabilidad crítica que salvó datos de miles de usuarios.`,
  };
}

function genQuestions(courseId, lessonNum, topic, detail) {
  return [
    { type: 'explain', q: `📖 ${detail.what}\n\n🎯 ${detail.why}\n\n🔧 ${detail.how}\n\n💡 Ejemplo: ${detail.example}\n\n🌍 ${detail.realWorld}`, isInfo: true },
    { type: 'multiple', q: `¿Cuál es el objetivo principal de ${topic[0]}?`, options: [topic[2], 'Nada', 'Borrar todo', 'Virus'], correct: 0, explain: detail.why },
    { type: 'terminal', q: `Completa el comando para ${topic[0]}`, terminal: `root@kali:~# ${topic[1]}`, options: ['Ejecutar correcto', 'Ignorar', 'Salir', 'Formatear'], correct: 0, explain: 'Siempre en lab controlado.' },
    { type: 'multiple', q: `¿Qué hace "${topic[1]}"?`, options: ['Ejecuta la técnica', 'Borra todo', 'Cierra sesión', 'Apaga el PC'], correct: 0, explain: 'Ese es el comando correcto.' },
    { type: 'multiple', q: `Si falla ${topic[0]}, ¿qué haces?`, options: ['Revisar logs y man page', 'Rendirse', 'Reiniciar todo', 'Apagar'], correct: 0, explain: 'Debugging es 90% del trabajo.' },
    { type: 'truefalse', q: `${topic[0]} es esencial para un pentester`, correct: true, explain: 'Sí, es fundamental.' },
    { type: 'multiple', q: `Mejor práctica para ${topic[0]}`, options: ['Entorno aislado + VPN', 'Producción directa', 'Compartir creds', 'Sin logs'], correct: 0, explain: 'Seguridad primero.' },
    { type: 'order', q: `Ordena el flujo típico de ${topic[0]}`, items: ['Reconocimiento', 'Escaneo', 'Explotación', 'Reporte'], correctOrder: [0, 1, 2, 3], explain: 'Metodología estándar.' },
    { type: 'multiple', q: `En un CTF, ¿cómo aplicarías ${topic[0]}?`, options: ['Analizando objetivo + técnica', 'Adivinando', 'Copiando sin entender', 'Pidiendo flag'], correct: 0, explain: 'Piensa como hacker.' },
    { type: 'chat', q: `¡Pregúntale a tu waifu sobre ${topic[0]}! Escribe tu duda`, isChat: true },
    { type: 'multiple', q: `🎁 BONUS FINAL`, options: ['Practicar en TryHackMe', 'Olvidar todo', 'Nunca usarlo', 'Borrar cuenta'], correct: 0, explain: 'La práctica hace al maestro.' },
  ];
}

function buildLessons(courseId) {
  const topics = TOPICS[courseId] || TOPICS.python;
  const lessons = [];
  for (let i = 1; i <= 200; i++) {
    const t = topics[(i - 1) % topics.length];
    const d = detailedLesson(t);
    lessons.push({
      id: `${courseId}-${i}`,
      num: i,
      level: Math.floor((i - 1) / 20) + 1,
      title: `${i}. ${t[0]}`,
      description: t[1],
      detail: d,
      topic: t[0],
      xp: 50,
      energyCost: 10,
      questions: genQuestions(courseId, i, t, d),
    });
  }
  return lessons;
}

export const COURSE_DATA = {
  python: buildLessons('python'),
  hacking: buildLessons('hacking'),
  termux: buildLessons('termux'),
  kali: buildLessons('kali'),
};
