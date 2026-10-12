import React, {useEffect, useMemo, useState} from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

const MEDIA='/media/gk/';
const courses=[
{id:'python',name:'Python Mastery',short:'PYTHON',emoji:'🐍',color:'#68a7ff',desc:'De cero a automatizar tareas con código.',level:'Principiante → Pro',topics:['Variables y print','Tipos de datos','Condicionales','Bucles for','Bucles while','Funciones','Listas','Diccionarios','Strings avanzados','Excepciones','Archivos','Clases y objetos','Herencia','Módulos','Requests','Sockets','Regex','JSON','CSV','Automatización']},
{id:'hacking',name:'Hacking Ético',short:'CYBERSEC',emoji:'🛡️',color:'#61e6b5',desc:'Reconocimiento, seguridad web y defensa responsable.',level:'Intermedio',topics:['Footprinting','Nmap básico','Nmap avanzado','Enumeración','Vulnerabilidades web','SQL Injection','XSS','CSRF','Metasploit','Payloads','Wireshark','MITM','Criptografía','Hashing','Fuerza bruta','Privilege escalation','Post-explotación','Ingeniería social','Reportes','Bug Bounty']},
{id:'termux',name:'Termux Pro',short:'ANDROID LAB',emoji:'📱',color:'#d5a4ff',desc:'Convierte tu Android en un laboratorio de aprendizaje.',level:'Principiante → Intermedio',topics:['Instalación de Termux','Comandos básicos','pkg y apt','Almacenamiento','Editores','Python en Termux','pip','Git','SSH','Nmap en Termux','Hydra','Scripting bash','Cron jobs','Servidores locales','Ngrok','Web scraping','APIs','Bot de Telegram','Deploy','Proyecto final']},
{id:'kali',name:'Kali Linux',short:'LINUX LAB',emoji:'🐉',color:'#ffb86b',desc:'Domina herramientas de auditoría en entornos autorizados.',level:'Intermedio → Avanzado',topics:['Introducción a Kali','apt en Kali','Nmap en Kali','Metasploit','Burp Suite','Wireshark','Aircrack-ng','Hydra','John the Ripper','Hashcat','SQLmap','Gobuster','Nikto','WPScan','Maltego','BeEF','Privilege escalation','Forensics','Reporte final']}
];
const courseDetails={
'Variables y print':['Las variables guardan datos y print() muestra información en pantalla.','nombre = "Akari"\\nprint(f"Hola, {nombre}!")','Usa nombres descriptivos y recuerda que Python distingue mayúsculas de minúsculas.'],
'Tipos de datos':['Python tiene tipos como int, float, str, bool, list y dict.','edad = 18\\nactivo = True\\nprint(type(edad))','Elige el tipo que represente mejor tu dato.'],
'Condicionales':['if, elif y else permiten tomar decisiones según una condición.','if puntos >= 100:\\n    print("¡Nivel nuevo!")\\nelse:\\n    print("Sigue practicando")','La indentación define el bloque que pertenece a cada condición.'],
'Bucles for':['for repite instrucciones sobre una secuencia o un rango.','for numero in range(3):\\n    print(numero)  # 0, 1, 2','range(3) termina antes de llegar a 3.'],
'Funciones':['Una función agrupa instrucciones reutilizables y puede recibir parámetros.','def saludar(nombre):\\n    return f"Hola, {nombre}"\\n\\nprint(saludar("Yuki"))','Usa return para devolver un resultado y docstrings para documentar.'],
'Comandos básicos':['Los comandos pwd, ls, cd y mkdir te ayudan a navegar por el sistema de archivos.','pwd\\nls\\nmkdir practica\\ncd practica','Practica en tu propia carpeta y verifica dónde estás antes de borrar archivos.'],
'Nmap básico':['Nmap permite descubrir puertos y servicios en sistemas que tienes autorización para evaluar.','nmap -sV 192.0.2.10','192.0.2.0/24 es un rango reservado para documentación: usa laboratorios autorizados.'],
'Hashing':['Un hash transforma datos en una huella de longitud fija; no es cifrado reversible.','sha256sum archivo.txt','Para contraseñas, usa algoritmos lentos especializados como Argon2id o bcrypt.'],
'Instalación de Termux':['Instala Termux desde una fuente oficial mantenida y revisa permisos antes de empezar.','pkg update && pkg upgrade','No ejecutes scripts desconocidos con permisos elevados.'],
'Introducción a Kali':['Kali Linux reúne herramientas para pruebas de seguridad, análisis y formación.','whoami\\nuname -a\\nip addr','Usa las herramientas únicamente en sistemas propios o con autorización explícita.']
};
const waifus=[
{id:'akari',name:'Akari',role:'Mentora hacker',rarity:'Común',premium:false,image:'wf1 f feliz.png',mood:'wf1 f normal.png',color:'#ff80b5',quote:'¡Vamos, senpai! Un reto más y subimos de nivel.',bio:'Energética, competitiva y siempre lista para convertir errores en experiencia.'},
{id:'yuki',name:'Yuki',role:'Guía de Termux',rarity:'Común',premium:false,image:'wf2 f feliz.png',mood:'wf2 f durmiendo.png',color:'#86cfff',quote:'Mmm… vamos paso a paso. Tú puedes.',bio:'Dulce y paciente. Te acompaña en los días de estudio tranquilos.'},
{id:'prime',name:'Akari Prime',role:'Mentora avanzada',rarity:'Épica',premium:true,image:'wf1 p feliz.png',mood:'wf1 p confudida.png',color:'#b8a0ff',quote:'Analiza el problema. Después, ejecuta con precisión.',bio:'Serena, estratégica y experta en descomponer problemas difíciles.'},
{id:'shadow',name:'Yuki Shadow',role:'Analista de seguridad',rarity:'Legendaria',premium:true,image:'wf2 p feliz.png',mood:'wf2 p normal.png',color:'#ffbe6a',quote:'Operador, tu constancia será tu mejor herramienta.',bio:'Reservada y metódica. Te reta a pensar como defensor.'}
];
const lessons={
'Tipos de datos':['int, float, str, bool, list y dict representan distintos tipos de información.','dato = "HackLingo"\\nprint(type(dato))','¿Qué tipo de dato representa True o False?',['str','bool','list','float'],1,'bool representa valores verdadero/falso.'],
'Condicionales':['Una condición evalúa una expresión y ejecuta un bloque si se cumple.','if nivel >= 2:\\n    desbloquear()','¿Qué palabra se ejecuta cuando el if no se cumple?',['for','else','def','return'],1,'else cubre el caso alternativo.'],
'Bucles for':['for itera sobre elementos de una secuencia o un rango.','for i in range(3):\\n    print(i)','¿Qué números produce range(3)?',['1, 2, 3','0, 1, 2','0, 1, 2, 3','Solo 3'],1,'El límite final no se incluye.'],
'Funciones':['Una función reutiliza lógica mediante parámetros y retorno opcional.','def doble(n):\\n    return n * 2','¿Qué palabra devuelve un valor?',['print','yield siempre','return','import'],2,'return devuelve el resultado al punto de llamada.'],
'Hashing':['El hashing genera una huella; no permite recuperar directamente el dato original.','sha256("mensaje") → huella','¿Cuál es la característica del hash criptográfico?',['Es reversible con una clave','Siempre tiene longitud fija según algoritmo','Oculta datos como cifrado reversible','No cambia nunca aunque cambie la entrada'],1,'Un pequeño cambio en la entrada cambia mucho la huella.'],
'Comandos básicos':['pwd muestra la ruta actual, ls lista archivos y cd cambia de directorio.','pwd\\nls -la\\ncd practica','¿Qué comando muestra la carpeta actual?',['ls','pwd','cd','mkdir'],1,'pwd significa print working directory.'],
'Nmap básico':['Un escaneo de servicios ayuda a conocer qué servicios están expuestos en un objetivo autorizado.','nmap -sV 192.0.2.10','¿Qué añade la opción -sV?',['Borra servicios','Detecta versiones de servicios','Cifra el disco','Crea usuarios'],1,'Limita los escaneos a sistemas de laboratorio o con permiso.'],
'Introducción a Kali':['Kali es una distribución para pruebas de seguridad y formación profesional.','whoami\\nuname -a','¿Cuál es una práctica responsable?',['Escanear cualquier red','Probar solo con permiso','Compartir contraseñas','Desactivar registros'],1,'La autorización y el alcance definido son imprescindibles.']
};
const allLessons=Object.fromEntries(courses.map(c=>[c.id,c.topics.map((title,i)=>({id:c.id+'-'+i,title,index:i}))]));
const safeRead=(key,fallback)=>{try{const x=localStorage.getItem(key);return x?JSON.parse(x):fallback}catch{return fallback}};
const safeWrite=(key,val)=>{try{localStorage.setItem(key,JSON.stringify(val))}catch{}};

const avatarOptions=[
{id:'base',label:'Base',img:'base.png'},
{id:'p1',label:'Pelo 1',img:'base con pelo 1.png'},
{id:'p1o1',label:'P1 + Ojos 1',img:'base con pelo 1 y con ojos 1.png'},
{id:'p1o2',label:'P1 + Ojos 2',img:'base con pelo 1 y con ojos 2.png'},
{id:'p2',label:'Pelo 2',img:'base con pelo 2.png'},
{id:'p2o1',label:'P2 + Ojos 1',img:'base con pelo 2 y con ojos 1.png'},
{id:'p2o2',label:'P2 + Ojos 2',img:'base con pelo 2 y con ojos 2.png'},
{id:'p3',label:'Pelo 3',img:'base con pelo 3.png'},
{id:'p3o1',label:'P3 + Ojos 1',img:'base con pelo 3 y con ojos 1.png'},
{id:'p3o2',label:'P3 + Ojos 2',img:'base con pelo 3 y con ojos 2.png'},
{id:'p4',label:'Pelo 4',img:'base con pelo 4.png'},
{id:'p4o1',label:'P4 + Ojos 1',img:'base con pelo 4 y con ojos 1.png'},
{id:'p4o2',label:'P4 + Ojos 2',img:'base con pelo 4 y con ojos 2.png'},
];
const bannerOptions=[
{id:'playa',label:'Playa',img:'escenario playa.jpg'},
];

function App(){
 // ========== FIREBASE STATES ==========
 const [user,setUser]=useState(null);
 const [email,setEmail]=useState('');
 const [password,setPassword]=useState('');
 const [isRegister,setIsRegister]=useState(false);
 const [loadingAuth,setLoadingAuth]=useState(true);

 // ========== ESTADOS EXISTENTES ==========
 const [page,setPage]=useState('home');
 const [progress,setProgress]=useState(()=>safeRead('hl_nova_progress',{xp:120,done:[],streak:3,lastDay:'',hearts:10,heartsAt:Date.now(),favorites:['akari'],answers:0,perfect:0}));
 const [activeCourse,setActiveCourse]=useState('python');
 const [lessonIndex,setLessonIndex]=useState(0);
 const [quizStep,setQuizStep]=useState(-1);
 const [selected,setSelected]=useState(null);
 const [feedback,setFeedback]=useState('');
 const [showExplanation,setShowExplanation]=useState(false);
 const [storyStep,setStoryStep]=useState(0);
 const [storyRoute,setStoryRoute]=useState([]);
 const [mood,setMood]=useState('image');
 const [activeWaifu,setActiveWaifu]=useState('akari');
 const [search,setSearch]=useState('');
 const [toast,setToast]=useState('');
 const [tab,setTab]=useState('Todos');
 const [dailyClaimed,setDailyClaimed]=useState(()=>safeRead('hl_nova_daily',''));
 const [settings,setSettings]=useState(()=>safeRead('hl_nova_settings',{sound:true,reduceMotion:false,theme:'dark'}));
 const [name,setName]=useState(()=>safeRead('hl_nova_name','Senpai'));
 const [showProfile,setShowProfile]=useState(false);
 const [isPremium,setIsPremium]=useState(()=>safeRead('hl_nova_premium',false));
 const [premiumUntil,setPremiumUntil]=useState(()=>safeRead('hl_nova_premium_until',0));
 const [codeInput,setCodeInput]=useState('');
 const [avatar,setAvatar]=useState(()=>safeRead('hl_nova_avatar',{look:'p1o1',banner:'playa'}));

 // ========== FIREBASE AUTH EFFECT ==========
 useEffect(()=>{
   const unsubscribe = onAuthStateChanged(auth, (u)=>{
     setUser(u);
     setLoadingAuth(false);
   });
   return () => unsubscribe();
 }, []);

 // ========== EFFECTS EXISTENTES ==========
 useEffect(()=>{safeWrite('hl_nova_progress',progress)},[progress]);
 useEffect(()=>{safeWrite('hl_nova_settings',settings)},[settings]);
 useEffect(()=>{safeWrite('hl_nova_name',name)},[name]);
 useEffect(()=>{safeWrite('hl_nova_premium',isPremium)},[isPremium]);
 useEffect(()=>{safeWrite('hl_nova_premium_until',premiumUntil)},[premiumUntil]);
 useEffect(()=>{safeWrite('hl_nova_avatar',avatar)},[avatar]);
 useEffect(()=>{if(premiumUntil&&Date.now()>premiumUntil){setIsPremium(false);setPremiumUntil(0)}},[premiumUntil]);

 const completed=new Set(progress.done);
 const total= courses.reduce((n,c)=>n+c.topics.length,0);
 const pct=Math.round(completed.size/total*100);
 const course=courses.find(c=>c.id===activeCourse)||courses[0];
 const lesson=course.topics[lessonIndex]||course.topics[0];
 const info=courseDetails[lesson]||[
 `${lesson} es una habilidad importante dentro de ${course.name}. Aprende el concepto, revisa el ejemplo y prueba primero en un entorno de práctica seguro.`,
 `# Objetivo: ${lesson}\\n# 1. Investiga el concepto\\n# 2. Practica en un entorno aislado\\n# 3. Documenta el resultado`,
 'La práctica deliberada, la documentación y los permisos adecuados son parte del aprendizaje profesional.'
 ];
 const quiz=lessons[lesson]||[info[0],info[1],`¿Cuál es la mejor forma de aprender ${lesson.toLowerCase()}?`,['Memorizar sin practicar','Practicar en un entorno seguro y revisar resultados','Ejecutar cualquier comando de internet','Ignorar los errores'],1,'Practicar con un objetivo claro y revisar los resultados ayuda a aprender con seguridad.'];
 const flashcards=[
 ['Variable','Un nombre que referencia un valor.','nombre = "Akari"'],
 ['Bucle','Repite instrucciones mientras recorre datos o se cumple una condición.','for item in lista:'],
 ['Hash','Huella de datos; no es cifrado reversible.','SHA-256'],
 ['Permiso','Autorización explícita para evaluar un sistema.','Define alcance antes de probar.'],
 ['Función','Bloque reutilizable que puede recibir argumentos.','def saludar(nombre):']
 ];
 const [flashIndex,setFlashIndex]=useState(0),[flashFlip,setFlashFlip]=useState(false);
 const showToast=(t)=>{setToast(t);setTimeout(()=>setToast(''),2500)};
 function navigate(p){setPage(p);setFeedback('');setSelected(null);setQuizStep(-1);setShowExplanation(false);window.scrollTo({top:0,behavior:'smooth'})}
 function startLesson(c,i){setActiveCourse(c);setLessonIndex(i);setQuizStep(-1);setSelected(null);setFeedback('');setShowExplanation(false);navigate('lesson')}
 function finishLesson(correct){
   const id=course.id+'-'+lessonIndex;
   if(correct){
    setProgress(p=>({...p,xp:p.xp+25,coins:p.coins+8,done:p.done.includes(id)?p.done:[...p.done,id],answers:p.answers+1,perfect:p.perfect+1,hearts:isPremium?p.hearts:Math.min(10,p.hearts+1)}));
    showToast('¡Lección completada! +25 XP · +8 monedas');
   }else{setProgress(p=>({...p,answers:p.answers+1,hearts:isPremium?p.hearts:Math.max(0,p.hearts-1)}));showToast('¡Sigue practicando! Puedes repetir la lección.')}
   setFeedback(correct?'correct':'wrong');setShowExplanation(true);
 }
 function answerQuiz(i){
   if(feedback)return;
   setSelected(i);
   const ok=i===quiz[4];
   setFeedback(ok?'correct':'wrong');
   setShowExplanation(true);
   if(ok){
     const id=course.id+'-'+lessonIndex;
     setProgress(p=>({...p,xp:p.xp+25,coins:p.coins+8,done:p.done.includes(id)?p.done:[...p.done,id],answers:p.answers+1,perfect:p.perfect+1,hearts:isPremium?p.hearts:Math.min(10,p.hearts+1)}));
   }else{
     setProgress(p=>({...p,answers:p.answers+1,hearts:isPremium?p.hearts:Math.max(0,p.hearts-1)}));
   }
 }
 function nextLesson(){if(lessonIndex<course.topics.length-1){setLessonIndex(i=>i+1);setSelected(null);setFeedback('');setShowExplanation(false)}else{navigate('courses');showToast('¡Curso recorrido! Sigue repasando para dominarlo.')}}
 function claimDaily(){
   if(dailyClaimed===new Date().toDateString()){showToast('Ya reclamaste la recompensa de hoy ✨');return}
   setDailyClaimed(new Date().toDateString());
   safeWrite('hl_nova_daily',new Date().toDateString());
   setProgress(p=>({...p,xp:p.xp+50,coins:p.coins+20,hearts:isPremium?p.hearts:Math.min(10,(p.hearts||0)+10),streak:p.streak+1}));
   showToast('Misión diaria: +50 XP, +20 monedas y +10 corazones ❤️');
 }
 function toggleFavorite(id){setProgress(p=>({...p,favorites:p.favorites.includes(id)?p.favorites.filter(x=>x!==id):[...p.favorites,id]}))}
 function activatePremium(days){
   const until=Date.now()+(days*24*60*60*1000);
   setIsPremium(true);
   setPremiumUntil(until);
   showToast(`¡Premium activado por ${days} días! 👑`);
 }
 function redeemCode(){
   const codes={'NOVA7':7,'NOVA30':30,'NOVA60':60,'HACKLINGO2026':30,'SENPAI':7};
   const upper=(codeInput||'').toUpperCase().trim();
   if(codes[upper]){
     activatePremium(codes[upper]);
     setCodeInput('');
   }else{
     showToast('Código inválido ❌');
   }
 }

 // ========== FIREBASE AUTH FUNCTIONS ==========
 const handleAuth = async (e) => {
   e.preventDefault();
   if(!email || !password){
     showToast('Completa todos los campos');
     return;
   }
   try {
     if(isRegister){
       await createUserWithEmailAndPassword(auth, email, password);
       showToast('¡Cuenta creada! Bienvenido a HackLingo');
     } else {
       await signInWithEmailAndPassword(auth, email, password);
       showToast('¡Sesión iniciada!');
     }
   } catch (error) {
     let msg = error.message;
     if(msg.includes('email-already-in-use')) msg = 'Ese correo ya está registrado';
     else if(msg.includes('invalid-credential') || msg.includes('wrong-password')) msg = 'Correo o contraseña incorrectos';
     else if(msg.includes('weak-password')) msg = 'La contraseña debe tener al menos 6 caracteres';
     else if(msg.includes('invalid-email')) msg = 'Correo electrónico inválido';
     showToast('Error: ' + msg);
   }
 };

 const handleLogout = async () => {
   try {
     await signOut(auth);
     showToast('Sesión cerrada');
   } catch (error) {
     showToast('Error al cerrar sesión');
   }
 };

 const filteredCourses=courses.filter(c=>(c.name+' '+c.desc+' '+c.short).toLowerCase().includes(search.toLowerCase())&&(tab==='Todos'||(tab==='En progreso'&&c.topics.some((_,i)=>completed.has(c.id+'-'+i)))||(tab==='Sin empezar'&&!c.topics.some((_,i)=>completed.has(c.id+'-'+i)))));
 const scenes=[
  {who:'Akari',img:'wf1 f feliz.png',place:'Laboratorio de neón',text:`¡Senpai, llegaste justo a tiempo! El servidor de la academia tiene un reto nuevo. Si resolvemos el primer desafío, desbloquearemos el siguiente capítulo. ¿Listo?`,choices:[['¡Vamos a resolverlo!','brave'],['Primero quiero revisar mis notas','calm']]},
  {who:'Yuki',img:'wf2 f feliz.png',place:'Pasillo de la academia',text:'Mmm… encontré una pista en los registros. La pista no es la respuesta, pero nos puede orientar. ¿Qué hacemos con ella?',choices:[['Analizar la pista con calma','careful'],['Probar una hipótesis en el laboratorio','bold']]},
  {who:'Akari Prime',img:'wf1 p feliz.png',place:'Sala de análisis',text:'Buen trabajo. El objetivo de una auditoría es entender el riesgo y comunicarlo con claridad. Antes de cerrar el caso, debemos documentar qué observamos y cómo reproducirlo de forma segura.',choices:[['Escribir un reporte claro','report'],['Repasar el concepto una vez más','review']]},
  {who:'Akari',img:'wf1 f sonrojada.png',place:'Terraza al atardecer',text:'¡Lo logramos! No fue magia: fue curiosidad, práctica y trabajo en equipo. La próxima misión será más difícil, pero ya sabes cómo empezar. ¿Seguimos aprendiendo juntos?',choices:[['¡Siguiente capítulo!','next'],['Guardar este final por hoy','end']]}
 ];
 function chooseStory(key){setStoryRoute(r=>[...r,key]);setProgress(p=>({...p,xp:p.xp+10,coins:p.coins+3}));if(storyStep<scenes.length-1)setStoryStep(s=>s+1);else{setStoryStep(0);showToast('Ruta guardada. +10 XP');}}
 const currentScene=scenes[storyStep];
 const navItems=[['home','⌂','Inicio'],['courses','▤','Cursos'],['story','♡','Novela'],['practice','✦','Práctica'],['waifus','♧','Waifus']];
 const activeWaifuObj=waifus.find(w=>w.id===activeWaifu)||waifus[0];
 const avatarLook=avatarOptions.find(a=>a.id===avatar.look)||avatarOptions[0];
 const avatarBanner=bannerOptions.find(b=>b.id===avatar.banner)||bannerOptions[0];

 // ========== PANTALLA DE CARGA ==========
 if(loadingAuth){
   return <div className="app" style={{display:'grid',placeItems:'center',height:'100vh'}}>
     <div style={{textAlign:'center'}}>
       <div className="brand-mark" style={{margin:'0 auto 15px',width:'50px',height:'50px',fontSize:'28px'}}>H<span>✦</span></div>
       <h1 style={{fontFamily:'Space Grotesk'}}>HackLingo Nova</h1>
       <p style={{color:'#9392a8',marginTop:'8px'}}>Cargando...</p>
     </div>
   </div>;
 }

 // ========== PANTALLA DE LOGIN ==========
 if(!user){
   return (
     <div className="app" style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',padding:'20px'}}>
       <div className="panel" style={{maxWidth:'420px',width:'100%',padding:'35px 30px'}}>
         <div className="brand" style={{justifyContent:'center',marginBottom:'25px'}}>
           <div className="brand-mark">H<span>✦</span></div>
           <div><b>HACKLINGO</b><small>NOVA ACADEMY</small></div>
         </div>
         <h2 style={{textAlign:'center',marginBottom:'8px',fontFamily:'Space Grotesk',fontSize:'24px'}}>{isRegister ? 'Crear cuenta' : 'Iniciar sesión'}</h2>
         <p style={{textAlign:'center',color:'#9392a8',fontSize:'11px',marginBottom:'25px'}}>
           {isRegister ? 'Únete a la academia y empieza a aprender' : 'Bienvenido de vuelta, aprendiz'}
         </p>
         <form onSubmit={handleAuth} style={{display:'grid',gap:'12px'}}>
           <div>
             <label style={{fontSize:'10px',color:'#a79bbf',display:'block',marginBottom:'6px',letterSpacing:'1px',fontWeight:700}}>CORREO ELECTRÓNICO</label>
             <input 
               type="email" 
               placeholder="tu@correo.com" 
               value={email} 
               onChange={e=>setEmail(e.target.value)} 
               required 
               style={{width:'100%',padding:'13px 14px',borderRadius:'10px',border:'1px solid #39364a',background:'#11111a',color:'#fff',fontSize:'12px',outline:'none'}}
             />
           </div>
           <div>
             <label style={{fontSize:'10px',color:'#a79bbf',display:'block',marginBottom:'6px',letterSpacing:'1px',fontWeight:700}}>CONTRASEÑA</label>
             <input 
               type="password" 
               placeholder="Mínimo 6 caracteres" 
               value={password} 
               onChange={e=>setPassword(e.target.value)} 
               required 
               style={{width:'100%',padding:'13px 14px',borderRadius:'10px',border:'1px solid #39364a',background:'#11111a',color:'#fff',fontSize:'12px',outline:'none'}}
             />
           </div>
           <button type="submit" className="btn primary" style={{padding:'14px',marginTop:'10px',fontSize:'12px'}}>
             {isRegister ? 'Crear cuenta' : 'Iniciar sesión'} →
           </button>
         </form>
         <button onClick={()=>setIsRegister(!isRegister)} className="text-link" style={{display:'block',margin:'18px auto 0',textAlign:'center',fontSize:'11px'}}>
           {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate gratis'}
         </button>
         <div style={{marginTop:'25px',padding:'12px',background:'#1b1b28',borderRadius:'10px',border:'1px solid #2b2a3b'}}>
           <p style={{fontSize:'9px',color:'#7e7b92',lineHeight:'1.6',margin:0,textAlign:'center'}}>
             🔒 Tus datos se guardan de forma segura en Firebase
           </p>
         </div>
       </div>
     </div>
   );
 }

 // ========== APP PRINCIPAL (usuario logueado) ==========
 return <div className={`app ${settings.theme==='light'?'light':''} ${settings.reduceMotion?'reduce-motion':''}`}>
 <aside className="sidebar">
  <div className="brand"><div className="brand-mark">H<span>✦</span></div><div><b>HACKLINGO</b><small>NOVA ACADEMY</small></div></div>
  <div className="side-label">TU ESPACIO</div>
  {navItems.map(([id,ic,label])=><button key={id} className={`nav-item ${page===id?'active':''}`} onClick={()=>navigate(id)}><span className="nav-ico">{ic}</span>{label}{id==='courses'&&<span className="nav-count">{completed.size}</span>}</button>)}
  <div className="side-label side-label-gap">PROGRESO</div>
  <div className="sidebar-stats"><div className="mini-stat"><span>⚡</span><div><b>{progress.xp} XP</b><small>Experiencia</small></div></div><div className="mini-stat"><span>🔥</span><div><b>{progress.streak} días</b><small>Racha actual</small></div></div></div>
  <div className="sidebar-bottom"><div className="mini-profile"><div className="avatar-small" style={{backgroundImage:`url(${MEDIA+avatarBanner.img})`,backgroundSize:'cover',backgroundPosition:'center'}}>S</div><div><b>{name||'Senpai'}</b><small>{isPremium?'👑 Premium':'Aprendiz novato'}</small></div><button className="icon-button" onClick={()=>navigate('profile')} aria-label="Perfil">⚙</button></div></div>
 </aside>
 <main className="main">
  <header className="topbar"><div className="mobile-brand"><div className="brand-mark">H<span>✦</span></div><b>HACKLINGO <em>NOVA</em></b></div><div className="crumb"><span>Academia</span><i>/</i><b>{({home:'Panel de control',courses:'Rutas de aprendizaje',lesson:'Lección interactiva',story:'Novela visual',practice:'Zona de práctica',waifus:'Compañeras',profile:'Mi perfil'})[page]||'Academia'}</b></div><div className="top-actions">{isPremium&&<div className="premium-badge">👑 PREMIUM</div>}<div className="currency"><span>🪙</span><b>{progress.coins}</b></div><div className="currency"><span>❤️</span><b>{isPremium?'∞':progress.hearts}</b></div><button className="profile-button" onClick={()=>navigate('profile')}><span className="avatar-small" style={{backgroundImage:`url(${MEDIA+avatarBanner.img})`,backgroundSize:'cover',backgroundPosition:'center'}}>S</span><span>{name}</span><span>⌄</span></button></div></header>
  <div className="content">
  {page==='home'&&<div className="home-page">
   <section className="welcome-row"><div><div className="eyebrow"><span className="live-dot"></span> ACADEMIA ONLINE <span className="eyebrow-line"></span> TEMPORADA 01</div><h1>Tu próxima versión<br/>empieza <span className="gradient-text">hoy.</span></h1><p className="muted lead">Aprende programación y ciberseguridad, sube de nivel y escribe tu historia junto a tus mentoras.</p><div className="hero-actions"><button className="btn primary" onClick={()=>startLesson('python',Math.max(0,allLessons.python.findIndex(l=>!completed.has(l.id))))}>▶ Continuar aprendiendo <span>↗</span></button><button className="btn ghost" onClick={()=>navigate('story')}>♡ Ir a la novela</button></div><div className="hero-meta"><span>✦ <b>{completed.size}</b> lecciones completadas</span><span>◷ 10 min al día</span><span>⌁ Progreso guardado</span></div></div>
    <div className="hero-art"><div className="hero-orbit orbit-one"></div><div className="hero-orbit orbit-two"></div><div className="hero-glow"></div><img src={MEDIA+'wf1 f feliz.png'} alt="Akari, tu mentora" className="hero-waifu"/><div className="speech-card"><span className="speech-icon">✦</span><div><b>¡Hey, {name}!</b><p>¿Listo para romper tus límites?</p></div></div><div className="hero-level"><span>LVL</span><b>{Math.floor(progress.xp/100)+1}</b><small>APRENDIZ</small></div></div>
   </section>
   <section className="stats-grid"><div className="stat-card"><div className="stat-top"><span className="stat-icon purple">⚡</span><span className="stat-trend">+25 por lección</span></div><div className="stat-number">{progress.xp.toLocaleString()}<small> XP</small></div><div className="stat-caption">Experiencia total</div><div className="stat-bar"><i style={{width:(progress.xp%100)+'%'}}/></div><div className="stat-foot">Siguiente nivel <b>{100-progress.xp%100} XP</b></div></div>
    <div className="stat-card"><div className="stat-top"><span className="stat-icon orange">🔥</span><span className="stat-trend">¡Sigue así!</span></div><div className="stat-number">{progress.streak}<small> días</small></div><div className="stat-caption">Racha de aprendizaje</div><div className="week-dots">{['L','M','X','J','V','S','D'].map((d,i)=><span key={d} className={i<Math.min(7,progress.streak)?'checked':''}>{i<Math.min(7,progress.streak)?'✓':d}</span>)}</div></div>
    <div className="stat-card"><div className="stat-top"><span className="stat-icon mint">◈</span><span className="stat-trend">De todos los cursos</span></div><div className="stat-number">{pct}<small>%</small></div><div className="stat-caption">Progreso de academia</div><div className="progress-track"><i style={{width:pct+'%'}}/></div><div className="stat-foot">{completed.size} de {total} lecciones</div></div>
    <div className="stat-card daily-card"><div className="stat-top"><span className="stat-icon pink">✦</span><span className="daily-tag">DIARIA</span></div><div className="daily-title">Un paso cada día</div><div className="stat-caption">Completa una misión y gana recompensas.</div><button className="btn small-btn" onClick={claimDaily}>{dailyClaimed===new Date().toDateString()?'✓ Reclamada':'+ Reclamar 50 XP'}</button></div></section>
   <section className="section-block"><div className="section-heading"><div><div className="eyebrow">TU CAMINO</div><h2>Rutas de aprendizaje <span className="count-pill">04</span></h2></div><button className="text-link" onClick={()=>navigate('courses')}>Ver todos <span>↗</span></button></div><div className="course-grid">{courses.map((c,i)=>{let done=c.topics.filter((_,j)=>completed.has(c.id+'-'+j)).length;return <article className="course-card" key={c.id} style={{'--course':c.color,'--delay':i*50+'ms'}}><div className="course-card-top"><div className="course-emoji">{c.emoji}</div><span className="course-label">{c.short}</span><button className="dots-button" onClick={()=>{setActiveCourse(c.id);navigate('courses')}}>•••</button></div><h3>{c.name}</h3><p>{c.desc}</p><div className="course-progress-line"><span>Progreso</span><b>{Math.round(done/c.topics.length*100)}%</b></div><div className="progress-track"><i style={{width:(done/c.topics.length*100)+'%'}}/></div><div className="course-card-foot"><span>{done}/{c.topics.length} lecciones</span><button className="circle-arrow" onClick={()=>startLesson(c.id,Math.max(0,c.topics.findIndex((_,j)=>!completed.has(c.id+'-'+j))))}>↗</button></div></article>})}</div></section>
   <section className="bottom-grid"><div className="panel recent-panel"><div className="section-heading compact"><div><div className="eyebrow">RETOMA EL RITMO</div><h2>Continúa tu camino</h2></div><span className="panel-icon">⌁</span></div>{courses.slice(0,3).map(c=>{let idx=Math.max(0,c.topics.findIndex((_,i)=>!completed.has(c.id+'-'+i)));return <button className="continue-row" key={c.id} onClick={()=>startLesson(c.id,idx)}><span className="continue-emoji" style={{'--course':c.color}}>{c.emoji}</span><span className="continue-info"><b>{c.name}</b><small>{c.topics[idx]} · Lección {idx+1}</small></span><span className="continue-arrow">→</span></button>})}</div>
    <div className="panel mentor-panel"><div className="mentor-bg"></div><div className="mentor-content"><span className="mentor-tag">TU MENTORA</span><h2>Aprender es mejor<br/>en compañía.</h2><p>Akari está lista para tu próxima misión.</p><button className="btn mentor-btn" onClick={()=>{setActiveWaifu('akari');navigate('waifus')}}>Conocer mentoras <span>↗</span></button></div><img src={MEDIA+'wf1 f sonrojada.png'} alt="Akari" /></div></section>
  </div>}
  {page==='courses'&&<div className="page-enter"><div className="page-title-row"><div><div className="eyebrow">CATÁLOGO COMPLETO</div><h1>Tus <span className="gradient-text">rutas.</span></h1><p className="muted">Cuatro rutas, 80 lecciones para convertir curiosidad en habilidades reales.</p></div><div className="search-box"><span>⌕</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar una ruta…"/></div></div><div className="filter-row">{['Todos','En progreso','Sin empezar'].map(t=><button key={t} className={'filter-chip '+(tab===t?'selected':'')} onClick={()=>setTab(t)}>{t}</button>)}</div><div className="catalog-grid">{filteredCourses.map(c=>{let done=c.topics.filter((_,i)=>completed.has(c.id+'-'+i)).length;return <article className="catalog-card" key={c.id} style={{'--course':c.color}}><div className="catalog-head"><div className="course-emoji large">{c.emoji}</div><span className="level-tag">{c.level}</span></div><h2>{c.name}</h2><p>{c.desc}</p><div className="catalog-meta"><span>▤ {c.topics.length} lecciones</span><span>◷ 2–4 h</span></div><div className="progress-track"><i style={{width:done/c.topics.length*100+'%'}}/></div><div className="catalog-foot"><span>{done} completadas</span><button className="btn primary small-btn" onClick={()=>{setActiveCourse(c.id);setLessonIndex(Math.max(0,c.topics.findIndex((_,i)=>!completed.has(c.id+'-'+i))));navigate('course-detail')}}>Explorar ruta ↗</button></div></article>})}</div>
  {activeCourse&&<div className="section-block lesson-list-block"><div className="section-heading"><div><div className="eyebrow">PLAN DE ESTUDIO</div><h2>{course.name} <span className="count-pill">{course.topics.length} módulos</span></h2></div><span className="muted">{course.topics.filter((_,i)=>completed.has(course.id+'-'+i)).length} completados</span></div><div className="lesson-list">{course.topics.map((t,i)=>{let done=completed.has(course.id+'-'+i);return <button key={t} className="lesson-row" onClick={()=>startLesson(course.id,i)}><span className={'lesson-number '+(done?'is-done':'')}>{done?'✓':String(i+1).padStart(2,'0')}</span><span className="lesson-row-info"><b>{t}</b><small>{done?'Lección completada':'Concepto + ejemplo + reto rápido'}</small></span><span className="lesson-xp">+25 XP</span><span className="continue-arrow">↗</span></button>})}</div></div>}</div>}
  {(page==='lesson'||page==='course-detail')&&<div className="page-enter lesson-page"><button className="back-link" onClick={()=>navigate('courses')}>← Volver a las rutas</button><div className="lesson-layout"><section className="lesson-main panel"><div className="lesson-topline"><span className="course-label" style={{color:course.color}}>{course.emoji} {course.name.toUpperCase()}</span><span className="lesson-counter">LECCIÓN {lessonIndex+1} / {course.topics.length}</span></div><div className="lesson-progress"><i style={{width:(lessonIndex+1)/course.topics.length*100+'%'}}/></div><h1>{lesson}</h1><p className="muted">{info[0]}</p><div className="concept-box"><div className="concept-heading"><span>✦</span><b>CONCEPTO CLAVE</b></div><p>{info[0]}</p></div><div className="code-box"><div className="code-top"><span><i></i><i></i><i></i></span><small>ejemplo_practico</small><button onClick={()=>{navigator.clipboard?.writeText(info[1].replace(/\\n/g,'\n'));showToast('Ejemplo copiado')}}>Copiar código ⧉</button></div><pre>{info[1].replace(/\\n/g,'\n')}</pre></div><div className="tip-box"><span>💡</span><p><b>Consejo de Akari</b><br/>{info[2]}</p></div><div className="quiz-box"><div className="quiz-kicker">CHECKPOINT · 1 PREGUNTA</div><h2>{quiz[2]}</h2><div className="answer-list">{quiz[3].map((a,i)=><button key={a} disabled={!!feedback} className={'answer-option '+(selected===i?(i===quiz[4]?'answer-correct':'answer-wrong'):'')+((feedback&&i===quiz[4])?' answer-correct':'')} onClick={()=>answerQuiz(i)}><span>{String.fromCharCode(65+i)}</span>{a}{feedback&&i===quiz[4]&&<b className="answer-mark">✓</b>}{selected===i&&feedback==='wrong'&&<b className="answer-mark">×</b>}</button>)}</div>{showExplanation&&<div className={'feedback-box '+(feedback==='correct'?'good':'bad')}><b>{feedback==='correct'?'¡Correcto! +25 XP':'Casi, sigue aprendiendo'}</b><p>{quiz[5]}</p><button className="btn primary small-btn" onClick={nextLesson}>{lessonIndex===course.topics.length-1?'Terminar ruta':'Siguiente lección'} →</button></div>}</div></section><aside className="lesson-aside"><div className="panel mentor-mini"><img src={MEDIA+activeWaifuObj.image} alt={activeWaifuObj.name}/><div className="eyebrow">TU MENTORA</div><h3>{activeWaifuObj.name}</h3><p>"{feedback==='correct'?'¡Sabía que podías hacerlo!':feedback==='wrong'?'No te rindas, revisa el concepto y prueba otra vez.':'Una idea a la vez. ¡Tú puedes!'}"</p><button className="text-link" onClick={()=>navigate('waifus')}>Cambiar mentora ↗</button></div><div className="panel lesson-checklist"><h3>En esta lección</h3><div>✓ <span>Lee el concepto</span></div><div>◉ <span>Revisa el ejemplo</span></div><div>○ <span>Supera el checkpoint</span></div><small>Tu avance se guarda automáticamente en este dispositivo.</small></div><div className="safety-note">🛡️ <span>En ciberseguridad, practica siempre en laboratorios propios o con permiso.</span></div></aside></div></div>}
  {page==='story'&&<div className="page-enter story-page"><div className="story-head"><div><div className="eyebrow">HACKLINGO ORIGINAL</div><h1>Neon <span className="gradient-text">Academy.</span></h1><p className="muted">Una novela visual donde cada decisión acompaña tu progreso.</p></div><div className="chapter-pill">CAPÍTULO 01 <span>◆</span></div></div><div className="visual-novel"><div className="vn-scene-bg"><video className="scene-video" src={MEDIA+(storyStep%2===0?'Akari escenario.mp4':'Yuki escenario.mp4')} autoPlay muted loop playsInline aria-hidden="true"/><div className="scene-grid"></div><div className="scene-glow"></div><div className="scene-nameplate">⌁ {currentScene.place}</div><div className="vn-side-label">HACKLINGO <span>STORY MODE</span></div><div className="vn-chapter-tag">EPISODIO 01 <b>·</b> UNA NUEVA MISIÓN</div></div><div className="vn-dialog"><div className="vn-speaker"><span className="speaker-dot"></span>{currentScene.who}<small>{storyStep+1} / {scenes.length}</small></div><p>{currentScene.text}</p><div className="vn-choices">{currentScene.choices.map(([txt,key],i)=><button key={key} onClick={()=>chooseStory(key)}><span>{String(i+1).padStart(2,'0')}</span>{txt}<b>↗</b></button>)}</div><div className="vn-foot"><span>✦ Las decisiones desbloquean pequeñas variaciones de diálogo.</span><button onClick={()=>{setStoryStep(0);setStoryRoute([])}}>Reiniciar capítulo ↺</button></div></div></div><div className="story-bottom-cards"><div className="panel story-tip"><span className="stat-icon purple">✧</span><div><b>Aprende dentro de la historia</b><p>Gana XP por cada decisión y vuelve a jugar para explorar otra ruta.</p></div></div><div className="panel story-tip"><span className="stat-icon mint">▤</span><div><b>Tu historial de ruta</b><p>{storyRoute.length?`${storyRoute.length} decisiones tomadas en esta sesión.`:'Aún no has tomado decisiones en este capítulo.'}</p></div></div></div></div>}
  {page==='practice'&&<div className="page-enter"><div className="page-title-row"><div><div className="eyebrow">ENTRENAMIENTO RÁPIDO</div><h1>Zona de <span className="gradient-text">práctica.</span></h1><p className="muted">Sesiones cortas para consolidar conceptos sin presión.</p></div><div className="practice-score"><span>⚡</span><b>{progress.xp} XP</b></div></div><div className="practice-grid"><button className="practice-card" onClick={()=>{setFlashIndex(0);setFlashFlip(false);navigate('flashcards')}}><div className="practice-icon purple">▣</div><span className="practice-label">MEMORIA ACTIVA</span><h2>Tarjetas de estudio</h2><p>Repasa términos clave y ejemplos breves.</p><div className="practice-card-foot"><span>5 tarjetas iniciales</span><b>→</b></div></button><button className="practice-card" onClick={()=>startLesson('python',Math.floor(Math.random()*courses[0].topics.length))}><div className="practice-icon mint">⚡</div><span className="practice-label">RETO ALEATORIO</span><h2>Un reto sorpresa</h2><p>Salta a una lección para practicar algo nuevo.</p><div className="practice-card-foot"><span>+25 XP al acertar</span><b>→</b></div></button><button className="practice-card" onClick={()=>navigate('courses')}><div className="practice-icon orange">⌘</div><span className="practice-label">LABORATORIO</span><h2>Entrena tus bases</h2><p>Elige un módulo y practica paso a paso.</p><div className="practice-card-foot"><span>80 lecciones disponibles</span><b>→</b></div></button><button className="practice-card" onClick={()=>{setActiveWaifu('yuki');navigate('waifus')}}><div className="practice-icon pink">♡</div><span className="practice-label">PAUSA CON COMPAÑÍA</span><h2>Visita a las mentoras</h2><p>Conoce personajes y cambia el ánimo de estudio.</p><div className="practice-card-foot"><span>4 compañeras</span><b>→</b></div></button></div><div className="panel practice-reminder"><span>🛡️</span><div><b>Regla de oro del laboratorio</b><p>En los módulos de ciberseguridad, trabaja en entornos propios, CTF o laboratorios con autorización. El aprendizaje responsable también es una habilidad.</p></div></div></div>}
  {page==='flashcards'&&<div className="page-enter flash-page"><button className="back-link" onClick={()=>navigate('practice')}>← Volver a práctica</button><div className="center-title"><div className="eyebrow">MEMORIA ACTIVA</div><h1>Flashcards <span className="gradient-text">lab.</span></h1><p className="muted">Toca la tarjeta para revelar la respuesta.</p></div><button className={'flashcard '+(flashFlip?'flipped':'')} onClick={()=>setFlashFlip(!flashFlip)}><span className="flash-count">{flashIndex+1} / {flashcards.length}</span><span className="flash-icon">{flashFlip?'✧':'▤'}</span><span className="flash-label">{flashFlip?'RESPUESTA':'CONCEPTO'}</span><strong>{flashFlip?flashcards[flashIndex][1]:flashcards[flashIndex][0]}</strong><code>{flashFlip?flashcards[flashIndex][2]:'Toca para voltear ↻'}</code></button><div className="flash-controls"><button className="btn ghost" onClick={()=>{setFlashIndex(i=>(i-1+flashcards.length)%flashcards.length);setFlashFlip(false)}}>← Anterior</button><button className="btn primary" onClick={()=>{setFlashIndex(i=>(i+1)%flashcards.length);setFlashFlip(false)}}>Siguiente →</button></div></div>}
  {page==='waifus'&&<div className="page-enter"><div className="page-title-row"><div><div className="eyebrow">TU EQUIPO DE APOYO</div><h1>Conoce a tus <span className="gradient-text">mentoras.</span></h1><p className="muted">Cada una tiene una personalidad y una forma distinta de acompañar tu aprendizaje.</p></div><div className="collection-pill">♡ {progress.favorites.length} favoritas</div></div><div className="waifu-grid">{waifus.map(w=>{let chosen=activeWaifu===w.id;const locked=w.premium&&!isPremium;return <article key={w.id} className={'waifu-card '+(chosen?'waifu-selected':'')+(locked?' waifu-locked':'')} style={{'--waifu':w.color}}><div className="waifu-art"><div className="waifu-halo"></div><img src={MEDIA+w.image} alt={w.name}/><span className="rarity">{w.rarity}</span>{w.premium&&<span className="premium-tag">👑 PREMIUM</span>}<button className={'favorite-btn '+(progress.favorites.includes(w.id)?'favorited':'')} onClick={()=>toggleFavorite(w.id)} aria-label="Favorito">{progress.favorites.includes(w.id)?'♥':'♡'}</button></div><div className="waifu-info"><span className="waifu-role">{w.role}</span><h2>{w.name}</h2><p>{w.bio}</p><blockquote>"{w.quote}"</blockquote><div className="waifu-actions"><button className="btn primary small-btn" onClick={()=>{if(locked){showToast('Esta mentora es Premium. Activa tu membresía 👑');return;}setActiveWaifu(w.id);showToast(`${w.name} será tu mentora seleccionada`)}}>{chosen?'✓ Seleccionada':(locked?'🔒 Premium':'Elegir mentora')}</button><button className="btn ghost small-btn" onClick={()=>{if(locked){showToast('Necesitas Premium para estudiar con ella 👑');return;}setActiveWaifu(w.id);navigate('lesson')}}>Estudiar juntas ↗</button></div></div></article>})}</div><div className="panel waifu-note"><span>✦</span><div><b>Un equipo que crece contigo</b><p>Las mentoras son compañeras narrativas. Las funciones de progreso y estudio trabajan sin necesidad de conexión a un servicio de chat externo.</p></div></div></div>}
  {page==='profile'&&<div className="page-enter profile-page"><div className="page-title-row"><div><div className="eyebrow">TU IDENTIDAD</div><h1>Mi <span className="gradient-text">perfil.</span></h1><p className="muted">Personaliza tu experiencia y revisa tu progreso.</p></div></div>
  {/* INFO DE USUARIO FIREBASE */}
  <div className="panel" style={{padding:'15px 20px',marginBottom:'15px',display:'flex',alignItems:'center',gap:'12px',flexWrap:'wrap'}}>
    <span style={{fontSize:'20px'}}>📧</span>
    <div style={{flex:1,minWidth:'150px'}}>
      <b style={{fontSize:'11px',display:'block'}}>Sesión activa</b>
      <small style={{fontSize:'10px',color:'#9392a8'}}>{user.email}</small>
    </div>
    <button className="btn ghost small-btn" onClick={handleLogout} style={{color:'#f0a5b8',borderColor:'#674052'}}>Cerrar sesión</button>
  </div>
  <div className="profile-layout"><section className="panel profile-main"><div className="profile-cover" style={{backgroundImage:`url(${MEDIA+avatarBanner.img})`,backgroundSize:'cover',backgroundPosition:'center'}}><div className="profile-avatar" style={{backgroundImage:`url(${MEDIA+avatarLook.img})`,backgroundSize:'cover',backgroundPosition:'center'}}/><div className="profile-level">{isPremium?'👑 PREMIUM':'NIVEL '+(Math.floor(progress.xp/100)+1)}</div></div><div className="profile-form"><label htmlFor="playername">Nombre de aprendiz</label><div className="name-edit"><input id="playername" value={name} maxLength={24} onChange={e=>setName(e.target.value)} placeholder="Tu nombre"/><span>{name.length}/24</span></div><p className="muted tiny">Tu nombre se guarda automáticamente en este dispositivo.</p><div className="profile-stats"><div><b>{progress.xp}</b><small>XP TOTAL</small></div><div><b>{completed.size}</b><small>LECCIONES</small></div><div><b>{isPremium?'∞':progress.hearts}</b><small>CORAZONES</small></div></div></div></section><section className="panel settings-panel"><div className="section-heading compact"><div><div className="eyebrow">PREFERENCIAS</div><h2>Configuración</h2></div><span>⚙</span></div><div className="setting-row"><div><b>Tema claro</b><small>Cambia la apariencia general.</small></div><button className={'toggle '+(settings.theme==='light'?'on':'')} onClick={()=>setSettings(s=>({...s,theme:s.theme==='light'?'dark':'light'}))}><i/></button></div><div className="setting-row"><div><b>Reducir animaciones</b><small>Movimiento más discreto.</small></div><button className={'toggle '+(settings.reduceMotion?'on':'')} onClick={()=>setSettings(s=>({...s,reduceMotion:!s.reduceMotion}))}><i/></button></div><div className="setting-row"><div><b>Efectos de sonido</b><small>Preferencia guardada para futuras versiones.</small></div><button className={'toggle '+(settings.sound?'on':'')} onClick={()=>setSettings(s=>({...s,sound:!s.sound}))}><i/></button></div><button className="btn ghost reset-btn" onClick={()=>{if(confirm('¿Reiniciar el progreso de este dispositivo? Esta acción no se puede deshacer.')){setProgress({xp:0,done:[],streak:0,lastDay:'',hearts:10,heartsAt:Date.now(),coins:0,favorites:[],answers:0,perfect:0});showToast('Progreso reiniciado')}}}>Reiniciar progreso local</button><button className="btn ghost reset-btn" onClick={handleLogout} style={{color:'#f0a5b8',borderColor:'#674052',marginTop:'10px'}}>Cerrar sesión</button></section></div>
  <div className="panel avatar-panel"><div className="section-heading compact"><div><div className="eyebrow">PERSONALIZACIÓN</div><h2>Tu avatar</h2></div><span>✦</span></div><div className="avatar-editor"><div className="avatar-preview"><img src={MEDIA+avatarBanner.img} alt="Banner" className="avatar-banner"/><img src={MEDIA+avatarLook.img} alt="Avatar" className="avatar-base"/></div><div className="avatar-controls"><div><b>Apariencia</b><div className="avatar-options">{avatarOptions.map(a=><button key={a.id} className={'avatar-opt '+(avatar.look===a.id?'active':'')} onClick={()=>setAvatar(v=>({...v,look:a.id}))}>{a.label}</button>)}</div></div><div><b>Fondo</b><div className="avatar-options">{bannerOptions.map(b=><button key={b.id} className={'avatar-opt '+(avatar.banner===b.id?'active':'')} onClick={()=>setAvatar(v=>({...v,banner:b.id}))}>{b.label}</button>)}</div></div></div></div></div>
  <div className="panel premium-panel"><div className="section-heading compact"><div><div className="eyebrow">MEMBRESÍA</div><h2>HackLingo Premium</h2></div><span>👑</span></div>{isPremium?<div className="premium-active"><b>¡Eres Premium! 🎉</b><p>Corazones infinitos, acceso a todas las mentoras y ventajas exclusivas.</p><small>Vence: {new Date(premiumUntil).toLocaleDateString()}</small></div>:<div className="premium-offer"><p>Activa Premium y desbloquea:</p><ul><li>❤️ Corazones infinitos</li><li>👑 Akari Prime y Yuki Shadow</li><li>⚡ Sin límites de práctica</li></ul><div className="code-redeem"><input type="text" placeholder="Ingresa tu código" value={codeInput} onChange={e=>setCodeInput(e.target.value)} maxLength={20}/><button className="btn primary small-btn" onClick={redeemCode}>Canjear</button></div><small>Códigos de prueba: NOVA7 (7 días), NOVA30 (30 días), NOVA60 (60 días)</small></div>}</div>
  <div className="panel data-note"><span>🔒</span><div><b>Privacidad y guardado local</b><p>Tu progreso, favoritos y preferencias se guardan en el almacenamiento local de este navegador. No se envían a un servidor en esta versión.</p></div></div></div>}
  </div>
  <footer className="footer"><span>HACKLINGO <b>NOVA</b> <i>© 2026</i></span><span>Aprende con curiosidad. Practica con responsabilidad. <span className="footer-heart">♥</span></span></footer>
 </main>
 <nav className="mobile-nav">{navItems.map(([id,ic,label])=><button key={id} className={page===id?'active':''} onClick={()=>navigate(id)}><span>{ic}</span><small>{label}</small></button>)}</nav>
 {toast&&<div className="toast"><span>✦</span>{toast}</div>}
 </div>
}
export default App;
