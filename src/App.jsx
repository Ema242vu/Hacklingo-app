import React, {useEffect, useMemo, useState, useRef} from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { AdMob, RewardAdPluginEvents } from '@capacitor-community/admob';

const MEDIA='/media/gk/';
const ADMOB_REWARD_ID = 'ca-app-pub-5959908767381687/3537670693';
const courses=[
{id:'python',name:'Python Mastery',short:'PYTHON',emoji:'🐍',color:'#68a7ff',desc:'De cero a automatizar tareas con código.',level:'Principiante → Pro',topics:['Variables y print','Tipos de datos','Condicionales','Bucles for','Bucles while','Funciones','Listas','Diccionarios','Strings avanzados','Excepciones','Archivos','Clases y objetos','Herencia','Módulos','Requests','Sockets','Regex','JSON','CSV','Automatización']},
{id:'hacking',name:'Hacking Ético',short:'CYBERSEC',emoji:'🛡️',color:'#61e6b5',desc:'Reconocimiento, seguridad web y defensa responsable.',level:'Intermedio',topics:['Footprinting','Nmap básico','Nmap avanzado','Enumeración','Vulnerabilidades web','SQL Injection','XSS','CSRF','Metasploit','Payloads','Wireshark','MITM','Criptografía','Hashing','Fuerza bruta','Privilege escalation','Post-explotación','Ingeniería social','Reportes','Bug Bounty']},
{id:'termux',name:'Termux Pro',short:'ANDROID LAB',emoji:'📱',color:'#d5a4ff',desc:'Convierte tu Android en un laboratorio de aprendizaje.',level:'Principiante → Intermedio',topics:['Instalación de Termux','Comandos básicos','pkg y apt','Almacenamiento','Editores','Python en Termux','pip','Git','SSH','Nmap en Termux','Hydra','Scripting bash','Cron jobs','Servidores locales','Ngrok','Web scraping','APIs','Bot de Telegram','Deploy','Proyecto final']},
{id:'kali',name:'Kali Linux',short:'LINUX LAB',emoji:'🐉',color:'#ffb86b',desc:'Domina herramientas de auditoría en entornos autorizados.',level:'Intermedio → Avanzado',topics:['Introducción a Kali','apt en Kali','Nmap en Kali','Metasploit','Burp Suite','Wireshark','Aircrack-ng','Hydra','John the Ripper','Hashcat','SQLmap','Gobuster','Nikto','WPScan','Maltego','BeEF','Privilege escalation','Forensics','Reporte final']}
];
const bonusCurricula = {"python": ["Entorno virtual con venv", "Instalar dependencias con pip", "Gestión de requirements.txt", "Anotaciones de tipo", "Docstrings y ayuda", "Ámbito local y global", "Parámetros posicionales", "Parámetros con nombre", "Args y kwargs", "Funciones lambda", "Comprensiones de listas", "Comprensiones de diccionarios", "Tuplas y desempaquetado", "Conjuntos y operaciones", "Ordenar con key", "Enumerate y zip", "Iteradores y next", "Generadores con yield", "Decoradores básicos", "Context managers", "Dataclasses", "Propiedades de clases", "Métodos estáticos y de clase", "Composición frente a herencia", "Polimorfismo práctico", "Protocolos y duck typing", "Manejo de fechas", "Pathlib para rutas", "Lectura segura de JSON", "Validación de JSON", "CSV con DictReader", "Escritura atómica de archivos", "Logging profesional", "Argumentos con argparse", "Variables de entorno", "Secretos y configuración", "Pruebas con unittest", "Fixtures y pytest", "Mocks y dependencias", "Depuración con pdb", "Complejidad Big O", "Búsqueda lineal y binaria", "Ordenamiento básico", "Pilas y colas", "Listas enlazadas conceptuales", "Recursión y caso base", "Memoización", "Expresiones regulares por grupos", "Unicode y codificación", "HTTP y códigos de estado", "Timeouts en requests", "Reintentos con backoff", "Sesiones HTTP", "Consumo de APIs paginadas", "Asyncio introductorio", "Programación concurrente", "Hilos frente a procesos", "SQLite desde Python", "Consultas parametrizadas", "Transacciones en SQLite", "Modelo cliente-servidor", "Sockets con timeout", "Serialización segura", "Seguridad al ejecutar subprocess", "Evitar eval y exec", "Gestión de excepciones propias", "Empaquetar un módulo", "Crear CLI reutilizable", "Documentación README", "Git branching básico", "Resolver conflictos Git", "Revisión de código", "Perfilado con cProfile", "Optimización basada en mediciones", "Proyecto: gestor de tareas"], "hacking": ["Alcance y reglas de compromiso", "Modelo de amenazas", "Superficie de ataque", "Ciclo de una auditoría", "Reconocimiento pasivo", "DNS y registros comunes", "WHOIS y privacidad", "Certificados TLS públicos", "Cabeceras HTTP", "Métodos HTTP", "Códigos de estado HTTP", "Cookies seguras", "Sesiones y expiración", "Autenticación frente a autorización", "Control de acceso horizontal", "Control de acceso vertical", "Principio de mínimo privilegio", "Validación de entradas", "Codificación de salida", "Consultas parametrizadas", "XSS reflejado y almacenado", "XSS basado en DOM", "Protección CSRF", "CORS explicado", "CSP y defensa web", "SSRF y mitigaciones", "Path traversal", "Subida segura de archivos", "Deserialización insegura", "XXE y parsers XML", "IDOR y pruebas seguras", "Rate limiting", "Gestión de contraseñas", "MFA y factores", "Almacenamiento de secretos", "TLS y certificados", "Hash frente a cifrado", "HMAC e integridad", "Firmas digitales", "Gestión de claves", "Principios OWASP ASVS", "OWASP Top 10 actual", "Threat modeling STRIDE", "Registro de eventos seguro", "SIEM y alertas", "Indicadores de compromiso", "Respuesta a incidentes", "Triage de vulnerabilidades", "CVSS y severidad", "Prueba de concepto responsable", "Divulgación coordinada", "Bug bounty: scope", "Evitar pruebas destructivas", "Laboratorios CTF", "Máquinas vulnerables aisladas", "Escaneo con límites", "Interpretar falsos positivos", "Validación manual de hallazgos", "Seguridad de APIs REST", "Tokens JWT seguros", "OAuth 2.0 conceptos", "OpenID Connect conceptos", "Seguridad de dependencias", "SBOM introductorio", "SAST frente a DAST", "Revisión de código segura", "Hardening de Linux", "Permisos Unix", "Firewall y segmentación", "Copias de seguridad", "Plan de recuperación", "Reporte ejecutivo", "Reporte técnico reproducible", "Ética y privacidad", "Simulación de incidente"], "termux": ["Actualizar repositorios con seguridad", "Buscar paquetes con pkg", "Eliminar paquetes sin datos", "Variables de entorno Android", "Rutas y directorios Linux", "Permisos de archivos chmod", "Propietario y grupos", "Redirección de salida", "Pipes en la terminal", "grep para filtrar texto", "find para localizar archivos", "sed para transformar texto", "awk para procesar columnas", "tar para archivar", "gzip y compresión", "sha256sum para verificar", "curl básico", "wget y descargas", "curl con cabeceras", "JSON con jq", "Python venv en Termux", "Estructura de un proyecto Python", "Crear script ejecutable", "Shebang y PATH", "Argumentos de Bash", "Variables y comillas Bash", "Condiciones en Bash", "Bucles en Bash", "Funciones Bash", "Códigos de salida", "set -euo pipefail", "Logs de scripts", "Programar tareas con termux-job-scheduler", "Notificaciones con Termux:API", "Portapapeles con Termux:API", "Acceso a sensores con permisos", "Git clone y ramas", "SSH: generar clave", "SSH: copiar clave pública", "Verificar huella SSH", "Servidor SSH local", "SFTP para transferencias", "rsync básico", "Servidor HTTP local seguro", "Probar localhost", "Puertos y procesos locales", "ip y rutas de red", "DNS con herramientas básicas", "Ping y diagnóstico", "Traceroute conceptual", "Nmap en laboratorio local", "Capturar errores de comandos", "Instalar Node.js", "npm y package.json", "Crear proyecto Vite", "Variables de entorno Vite", "Compilar app web", "Servir carpeta dist", "GitHub desde móvil", "Tokens de acceso seguros", "No guardar secretos en Git", "Automatizar backups", "Rotación de logs", "SQLite desde Python", "Consumir API pública", "Manejo de respuestas HTTP", "Scraping respetuoso", "robots.txt y límites", "Parsear HTML con BeautifulSoup", "Bot Telegram: comandos", "Bot Telegram: manejo de errores", "Webhook frente a polling", "Publicar proyecto estático", "Diagnóstico de dependencias", "Espacio y almacenamiento"], "kali": ["Máquina virtual y snapshots", "Actualizar Kali de forma segura", "Repositorios y firmas APT", "Usuarios y sudo", "Permisos Linux para auditoría", "Procesos y servicios", "Systemd básico", "Logs con journalctl", "Redes: IP y máscara", "Puerta de enlace y rutas", "DNS y resolución", "TCP frente a UDP", "Puertos comunes", "Wireshark: filtros de captura", "Wireshark: filtros de visualización", "PCAP y análisis offline", "Nmap: descubrimiento controlado", "Nmap: detección de servicios", "Nmap: salida XML", "Nmap: límites de velocidad", "NSE en laboratorio", "Enumeración SMB autorizada", "Enumeración DNS propia", "Enumeración HTTP propia", "Burp: proxy local", "Burp: historial HTTP", "Burp: Repeater", "Burp: Intruder en laboratorio", "Burp: comparar respuestas", "Certificados en proxy local", "OWASP Juice Shop local", "DVWA en contenedor aislado", "Docker para laboratorios", "Red interna de laboratorio", "Metasploitable en VM aislada", "Metasploit: estructura de módulos", "Metasploit: sesiones de laboratorio", "Validar parches tras una prueba", "Hashcat: formatos de hash", "John: reglas y diccionarios propios", "Auditoría de contraseñas propias", "Aircrack-ng: conceptos Wi-Fi", "WPA2 y WPA3", "Canales y bandas Wi-Fi", "Evitar interferir redes reales", "Gobuster en localhost", "Nikto en aplicación de prueba", "WPScan en WordPress propio", "SQLmap en entorno vulnerable local", "Validar SQLi manualmente", "Análisis estático de código", "YARA: reglas introductorias", "Autopsy: caso de práctica", "Volatility: memoria de muestra", "Hash de evidencias", "Cadena de custodia", "Metadatos de archivos", "Recuperación de archivos borrados", "Logs de autenticación", "Detectar persistencia sospechosa", "Hardening SSH", "Firewall UFW", "Fail2ban conceptual", "Actualizaciones y CVE", "CVSS y priorización", "Contenedores seguros", "Secretos en repositorios", "Plan de respuesta a incidentes", "Estructura de reporte profesional", "Recomendaciones accionables", "Retest después de corregir", "Proyecto: laboratorio integral"]};
courses.forEach(c => { c.topics.push(...(bonusCurricula[c.id] || [])); });

const courseDetails={
'Variables y print':['Las variables guardan datos y print() muestra información en pantalla.','nombre = "Akari"\\nprint(f"Hola, {nombre}!")','Usa nombres descriptivos y recuerda que Python distingue mayúsculas de minúsculas.'],
'Tipos de datos':['Python tiene tipos como int, float, str, bool, list y dict.','edad = 18\\nactivo = True\\nprint(type(edad))','Elige el tipo que represente mejor tu dato.'],
'Condicionales':['if, elif y else permiten tomar decisiones según una condición.','if puntos >= 100:\\n    print("¡Nivel nuevo!")\\nelse:\\n    print("Sigue practicando")','La indentación define el bloque que pertenece a cada condición.'],
'Bucles for':['for repite instrucciones sobre una secuencia o un rango.','for numero in range(3):\\n    print(numero)  # 0, 1, 2','range(3) termina antes de llegar a 3.'],
'Bucles while':['while repite mientras la condición sea verdadera.','i = 0\\nwhile i < 3:\\n    print(i)\\n    i += 1','Asegúrate de que la condición cambie para evitar bucles infinitos.'],
'Funciones':['Una función agrupa instrucciones reutilizables y puede recibir parámetros.','def saludar(nombre):\\n    return f"Hola, {nombre}"\\n\\nprint(saludar("Yuki"))','Usa return para devolver un resultado y docstrings para documentar.'],
'Listas':['Las listas guardan elementos ordenados y mutables.','frutas = ["manzana", "pera"]\\nfrutas.append("uva")','Accede por índice empezando desde 0.'],
'Diccionarios':['Los diccionarios guardan pares clave-valor.','usuario = {"nombre": "Akari", "nivel": 5}','Usa .get() para evitar errores si la clave no existe.'],
'Strings avanzados':['Los strings tienen métodos como split, join, upper y replace.','texto = "hola mundo"\\nprint(texto.upper())','Los f-strings hacen el formateo más legible.'],
'Excepciones':['try/except captura errores para que el programa no se detenga.','try:\\n    x = 1/0\\nexcept ZeroDivisionError:\\n    print("Error")','Captura excepciones específicas, no todas.'],
'Archivos':['open() permite leer y escribir archivos.','with open("nota.txt", "w") as f:\\n    f.write("Hola")','Usa with para cerrar el archivo automáticamente.'],
'Clases y objetos':['Las clases definen plantillas para crear objetos.','class Perro:\\n    def __init__(self, nombre):\\n        self.nombre = nombre','__init__ es el constructor de la clase.'],
'Herencia':['Una clase hija hereda atributos y métodos de la clase padre.','class Gato(Animal):\\n    pass','Usa super() para llamar al constructor del padre.'],
'Módulos':['Los módulos agrupan código reutilizable.','import math\\nprint(math.pi)','Puedes crear tus propios módulos con archivos .py.'],
'Requests':['La librería requests hace peticiones HTTP fácilmente.','import requests\\nr = requests.get("https://api.github.com")','Revisa el status_code antes de usar la respuesta.'],
'Sockets':['Los sockets permiten comunicación entre procesos por red.','import socket\\ns = socket.socket()','Úsalos solo en sistemas propios o con permiso.'],
'Regex':['Las expresiones regulares buscan patrones en texto.','import re\\nre.findall(r"\\\\d+", "abc123")','Prueba tus regex en regex101.com antes de usarlas.'],
'JSON':['JSON es un formato de datos ligero y legible.','import json\\ndatos = json.loads(\'{"a": 1}\')','json.dumps() convierte objetos a string JSON.'],
'CSV':['CSV guarda datos tabulares separados por comas.','import csv\\nwith open("datos.csv") as f:\\n    lector = csv.reader(f)','Usa csv.DictReader para trabajar con columnas por nombre.'],
'Automatización':['Automatiza tareas repetitivas con scripts.','import os\\nfor archivo in os.listdir("."):\\n    print(archivo)','Empieza automatizando tareas pequeñas y cotidianas.'],
'Footprinting':['El footprinting recolecta información pública de un objetivo autorizado.','whois ejemplo.com','Solo sobre dominios propios o con permiso escrito.'],
'Nmap básico':['Nmap permite descubrir puertos y servicios en sistemas que tienes autorización para evaluar.','nmap -sV 192.0.2.10','192.0.2.0/24 es un rango reservado para documentación: usa laboratorios autorizados.'],
'Nmap avanzado':['Los scripts NSE amplían las capacidades de Nmap.','nmap --script vuln 192.0.2.10','Usa -sS para escaneos sigilosos en entornos controlados.'],
'Enumeración':['La enumeración lista usuarios, recursos y servicios disponibles.','enum4linux 192.0.2.10','Documenta todo lo que encuentres para el reporte.'],
'Vulnerabilidades web':['Identifica fallos como inyección, XSS o control de acceso roto.','# Revisa OWASP Top 10','Solo en aplicaciones que tú controlas o con permiso.'],
'SQL Injection':['La inyección SQL manipula consultas de base de datos.','\' OR \'1\'=\'1','Usa consultas parametrizadas para prevenirlo.'],
'XSS':['Cross-Site Scripting inyecta JavaScript malicioso.','<script>alert(1)</script>','Escapa la salida del usuario para prevenirlo.'],
'CSRF':['CSRF fuerza acciones no deseadas en sesiones autenticadas.','# Verifica tokens anti-CSRF','Los tokens únicos por formulario ayudan a prevenirlo.'],
'Metasploit':['Metasploit es un framework para pruebas de penetración.','msfconsole\\nsearch tipo','Úsalo solo en laboratorios autorizados.'],
'Payloads':['Los payloads ejecutan código en el objetivo.','# Genera con msfvenom','Nunca los ejecutes en sistemas ajenos.'],
'Wireshark':['Wireshark captura y analiza tráfico de red.','# Filtra por http','Respeta la privacidad de las redes ajenas.'],
'MITM':['Man-in-the-Middle intercepta comunicaciones.','# Requiere configuración avanzada','Solo en redes propias o con permiso explícito.'],
'Criptografía':['La criptografía protege información mediante claves.','# Simétrica vs asimétrica','Usa algoritmos modernos como AES y RSA.'],
'Hashing':['Un hash transforma datos en una huella de longitud fija; no es cifrado reversible.','sha256sum archivo.txt','Para contraseñas, usa algoritmos lentos especializados como Argon2id o bcrypt.'],
'Fuerza bruta':['Prueba sistemáticamente combinaciones de credenciales.','hydra -l admin -P lista.txt 192.0.2.10 ssh','Solo en sistemas propios o con autorización.'],
'Privilege escalation':['Escalar privilegios permite obtener acceso administrativo.','# Revisa sudo -l','Busca configuraciones débiles en el sistema objetivo.'],
'Post-explotación':['La post-explotación mantiene el acceso y recolecta información.','# Persistencia y limpieza','Documenta todo el proceso para el reporte.'],
'Ingeniería social':['La ingeniería social manipula personas para obtener información.','# Phishing simulado','Úsala solo en entrenamientos con consentimiento.'],
'Reportes':['Un buen reporte explica hallazgos, riesgos y soluciones.','# Estructura: resumen, hallazgos, riesgo, fix','Incluye evidencias y pasos de reproducción.'],
'Bug Bounty':['Programas de recompensas por reportar vulnerabilidades éticamente.','# Revisa HackerOne','Sigue las reglas del programa al pie de la letra.'],
'Instalación de Termux':['Instala Termux desde una fuente oficial mantenida y revisa permisos antes de empezar.','pkg update && pkg upgrade','No ejecutes scripts desconocidos con permisos elevados.'],
'Comandos básicos':['Los comandos pwd, ls, cd y mkdir te ayudan a navegar por el sistema de archivos.','pwd\\nls\\nmkdir practica\\ncd practica','Practica en tu propia carpeta y verifica dónde estás antes de borrar archivos.'],
'pkg y apt':['pkg y apt instalan paquetes en Termux.','pkg install python','Actualiza antes de instalar: pkg update.'],
'Almacenamiento':['termux-setup-storage da acceso a carpetas del teléfono.','termux-setup-storage','Acepta los permisos cuando el sistema los solicite.'],
'Editores':['nano y vim permiten editar archivos en la terminal.','nano archivo.txt','Guarda con Ctrl+O y sal con Ctrl+X en nano.'],
'Python en Termux':['Puedes ejecutar Python directamente en Termux.','python script.py','Instala con pkg install python.'],
'pip':['pip instala librerías de Python.','pip install requests','Usa virtualenv para aislar proyectos.'],
'Git':['Git controla versiones de tu código.','git init\\ngit add .\\ngit commit -m "inicio"','Configura tu nombre y correo antes del primer commit.'],
'SSH':['SSH permite conectarte a servidores remotos.','ssh usuario@servidor','Usa claves SSH en lugar de contraseñas.'],
'Nmap en Termux':['Nmap funciona en Termux para escaneos básicos.','pkg install nmap\\nnmap -sV 192.0.2.10','Solo escanea redes propias o con autorización.'],
'Hydra':['Hydra prueba credenciales contra servicios.','hydra -l admin -P lista ssh://192.0.2.10','Solo en laboratorios de práctica.'],
'Scripting bash':['Los scripts bash automatizan tareas del sistema.','#!/bin/bash\\necho "Hola"','Dale permisos con chmod +x script.sh.'],
'Cron jobs':['Cron programa tareas recurrentes.','crontab -e','Verifica la sintaxis antes de guardar.'],
'Servidores locales':['Puedes levantar servidores web localmente.','python -m http.server 8000','Accede desde el navegador en localhost:8000.'],
'Ngrok':['Ngrok expone tu servidor local a internet.','ngrok http 8000','Cierra los túneles cuando termines.'],
'Web scraping':['Extrae datos de sitios web con Python.','import requests\\nfrom bs4 import BeautifulSoup','Respeta robots.txt y términos de uso.'],
'APIs':['Las APIs permiten comunicarte con servicios externos.','requests.get("https://api.github.com/users/torvalds")','Lee la documentación antes de usarlas.'],
'Bot de Telegram':['Puedes crear bots de Telegram con Python.','from telegram import Bot','Sigue las políticas de uso de Telegram.'],
'Deploy':['El deploy publica tu app en un servidor.','# Vercel, Render, Railway...','Prueba en local antes de desplegar.'],
'Proyecto final':['Aplica todo lo aprendido en un proyecto propio.','# Idea: bot que consulte APIs','Documenta tu proyecto paso a paso.'],
'Introducción a Kali':['Kali Linux reúne herramientas para pruebas de seguridad, análisis y formación.','whoami\\nuname -a\\nip addr','Usa las herramientas únicamente en sistemas propios o con autorización explícita.'],
'apt en Kali':['apt gestiona paquetes en Kali Linux.','sudo apt update && sudo apt upgrade','Actualiza antes de instalar nuevas herramientas.'],
'Nmap en Kali':['Nmap viene preinstalado en Kali.','nmap -A 192.0.2.10','Solo escanea objetivos autorizados.'],
'Burp Suite':['Burp Suite analiza y modifica tráfico HTTP.','# Configura proxy en 127.0.0.1:8080','Úsalo solo en apps que controlas.'],
'Aircrack-ng':['Aircrack-ng audita redes WiFi.','airmon-ng start wlan0','Nunca ataques redes ajenas.'],
'John the Ripper':['John crackea hashes de contraseñas.','john --wordlist=rockyou.txt hash.txt','Úsalo solo con hashes propios.'],
'Hashcat':['Hashcat crackea hashes con GPU.','hashcat -m 0 hash.txt rockyou.txt','Requiere hardware compatible.'],
'SQLmap':['SQLmap automatiza detección de SQL injection.','sqlmap -u "http://ejemplo.com?id=1"','Solo en apps con permiso escrito.'],
'Gobuster':['Gobuster enumera directorios y subdominios.','gobuster dir -u http://ejemplo.com -w lista.txt','Úsalo en dominios propios.'],
'Nikto':['Nikto escanea vulnerabilidades web comunes.','nikto -h http://ejemplo.com','Solo en sitios autorizados.'],
'WPScan':['WPScan analiza vulnerabilidades de WordPress.','wpscan --url http://ejemplo.com','Úsalo solo en tu propio WP.'],
'Maltego':['Maltego visualiza relaciones entre entidades.','# Requiere cuenta','Úsalo para OSINT ético.'],
'BeEF':['BeEF explota vulnerabilidades del navegador.','# Solo en laboratorio','Nunca en navegadores ajenos.'],
'Forensics':['El análisis forense investiga incidentes tras un ataque.','# Usa Autopsy, Volatility','Documenta toda la cadena de custodia.'],
'Reporte final':['Consolida todos los hallazgos en un reporte profesional.','# Resumen ejecutivo + técnico','Incluye evidencias y recomendaciones.']
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
'Bucles while':['while repite mientras la condición sea verdadera.','i = 0\\nwhile i < 3:\\n    i += 1','¿Qué pasa si la condición nunca cambia?',['El bucle termina solo','Se crea un bucle infinito','Python da error','Se ejecuta una vez'],1,'Por eso debes modificar la variable de control.'],
'Funciones':['Una función reutiliza lógica mediante parámetros y retorno opcional.','def doble(n):\\n    return n * 2','¿Qué palabra devuelve un valor?',['print','yield siempre','return','import'],2,'return devuelve el resultado al punto de llamada.'],
'Listas':['Las listas guardan elementos ordenados y mutables.','frutas = ["manzana", "pera"]','¿Cómo añades un elemento al final?',['frutas.add("uva")','frutas.append("uva")','frutas.push("uva")','frutas.insert("uva")'],1,'append() añade al final de la lista.'],
'Diccionarios':['Los diccionarios guardan pares clave-valor.','usuario = {"nombre": "Akari"}','¿Cómo accedes al valor de "nombre"?',['usuario[0]','usuario.nombre','usuario["nombre"]','usuario->nombre'],2,'Se accede por la clave entre corchetes.'],
'Strings avanzados':['Los strings tienen métodos para transformar texto.','texto.upper()','¿Qué hace .upper()?',['Divide el texto','Convierte a mayúsculas','Cuenta caracteres','Invierte el texto'],1,'upper() convierte todo a mayúsculas.'],
'Excepciones':['try/except captura errores para evitar que el programa se detenga.','try:\\n    x = 1/0\\nexcept ZeroDivisionError:\\n    print("Error")','¿Qué captura ese except?',['Error genérico','Solo división por cero','Solo errores de sintaxis','Nada'],1,'Captura específicamente ZeroDivisionError.'],
'Archivos':['open() permite leer y escribir archivos.','with open("nota.txt", "w") as f:','¿Qué modo abre el archivo para escribir?',['w','r','a','x'],0,'"w" abre en modo escritura.'],
'Clases y objetos':['Las clases definen plantillas para crear objetos.','class Perro:\\n    def __init__(self, nombre):','¿Qué es __init__?',['Un método cualquiera','El constructor de la clase','Una variable global','Un decorador'],1,'__init__ se ejecuta al crear el objeto.'],
'Herencia':['Una clase hija hereda atributos y métodos del padre.','class Gato(Animal):','¿Qué significa esto?',['Gato es igual a Animal','Gato hereda de Animal','Animal hereda de Gato','Son clases separadas'],1,'Los paréntesis indican herencia.'],
'Módulos':['Los módulos agrupan código reutilizable.','import math','¿Qué hace import?',['Borra el módulo','Trae el módulo al programa','Renombra variables','Cierra el archivo'],1,'import carga el módulo para usarlo.'],
'Requests':['La librería requests hace peticiones HTTP fácilmente.','import requests','¿Qué método hace una petición GET?',['requests.post()','requests.get()','requests.put()','requests.delete()'],1,'get() hace una petición de lectura.'],
'Sockets':['Los sockets permiten comunicación entre procesos por red.','import socket','¿Qué necesitas para comunicarte?',['Solo IP','IP y puerto','Solo puerto','Nada'],1,'Se necesita IP y puerto.'],
'Regex':['Las expresiones regulares buscan patrones en texto.','re.findall(r"\\\\d+", "abc123")','¿Qué busca \\\\d+?',['Letras','Dígitos','Espacios','Símbolos'],1,'\\\\d representa dígitos.'],
'JSON':['JSON es un formato de datos ligero y legible.','json.loads(\'{"a": 1}\')','¿Qué convierte JSON a objeto?',['json.dumps()','json.loads()','json.parse()','json.string()'],1,'loads() parsea un string JSON.'],
'CSV':['CSV guarda datos tabulares separados por comas.','import csv','¿Qué módulo lo maneja?',['json','csv','os','sys'],1,'El módulo csv se especializa en esto.'],
'Automatización':['Automatiza tareas repetitivas con scripts.','import os','¿Qué hace os.listdir()?',['Borra archivos','Lista archivos','Crea carpetas','Renombra'],1,'Lista el contenido del directorio.'],
'Footprinting':['El footprinting recolecta información pública de un objetivo autorizado.','whois ejemplo.com','¿Qué hace whois?',['Escanea puertos','Consulta datos de dominio','Abre shell','Cifra archivos'],1,'whois da info del registro del dominio.'],
'Nmap básico':['Nmap permite descubrir puertos y servicios.','nmap -sV 192.0.2.10','¿Qué añade la opción -sV?',['Borra servicios','Detecta versiones','Cifra el disco','Crea usuarios'],1,'-sV detecta versiones de servicios.'],
'Nmap avanzado':['Los scripts NSE amplían las capacidades de Nmap.','nmap --script vuln','¿Qué hace --script vuln?',['Escaneo básico','Busca vulnerabilidades conocidas','Cifra el tráfico','Borra puertos'],1,'vuln ejecuta scripts de vulnerabilidades.'],
'Enumeración':['La enumeración lista usuarios, recursos y servicios.','enum4linux 192.0.2.10','¿Qué enumera típicamente?',['Solo puertos','Usuarios y recursos SMB','Solo webs','Solo bases de datos'],1,'Enumera recursos SMB y usuarios.'],
'Vulnerabilidades web':['Identifica fallos como inyección, XSS o control de acceso roto.','# OWASP Top 10','¿Cuál es una vulnerabilidad común?',['CSS mal escrito','Inyección SQL','HTML largo','Imágenes grandes'],1,'La inyección SQL es una de las más críticas.'],
'SQL Injection':['La inyección SQL manipula consultas de base de datos.','\' OR \'1\'=\'1','¿Cómo se previene?',['Más usuarios','Consultas parametrizadas','Menos tablas','Servidores lentos'],1,'Las consultas parametrizadas evitan inyección.'],
'XSS':['Cross-Site Scripting inyecta JavaScript malicioso.','<script>alert(1)</script>','¿Cómo se previene?',['Más CSS','Escapando la salida','Menos JS','Servidores lentos'],1,'Escapar la salida evita la ejecución.'],
'CSRF':['CSRF fuerza acciones no deseadas en sesiones autenticadas.','# Verifica tokens anti-CSRF','¿Qué ayuda a prevenirlo?',['Más usuarios','Tokens únicos por formulario','Servidores lentos','Más CSS'],1,'Los tokens impiden peticiones forjadas.'],
'Metasploit':['Metasploit es un framework para pentesting.','msfconsole','¿Dónde se usa?',['En cualquier sistema','Solo en laboratorios autorizados','Solo en webs','Solo en móviles'],1,'Solo en entornos autorizados.'],
'Payloads':['Los payloads ejecutan código en el objetivo.','# msfvenom','¿Cómo se generan?',['Con Python','Con msfvenom','Con nmap','Con curl'],1,'msfvenom genera payloads.'],
'Wireshark':['Wireshark captura y analiza tráfico de red.','# Filtra por http','¿Qué hace?',['Cifra tráfico','Analiza paquetes','Borra paquetes','Crea redes'],1,'Analiza el tráfico capturado.'],
'MITM':['Man-in-the-Middle intercepta comunicaciones.','# Requiere configuración','¿En qué red se usa éticamente?',['En cualquier red','Solo en propias o con permiso','Solo en móviles','Solo en WiFi público'],1,'Requiere autorización explícita.'],
'Criptografía':['La criptografía protege información mediante claves.','# AES/RSA','¿Cuál es simétrica?',['RSA','AES','ECC','DSA'],1,'AES es simétrica (misma clave).'],
'Hashing':['El hashing genera una huella; no permite recuperar directamente el dato.','sha256sum archivo.txt','¿Qué característica tiene?',['Es reversible con clave','Longitud fija según algoritmo','Oculta datos reversiblemente','No cambia nunca'],1,'Un pequeño cambio en la entrada cambia la huella.'],
'Fuerza bruta':['Prueba sistemáticamente combinaciones de credenciales.','hydra -l admin -P lista ssh://192.0.2.10','¿En qué sistemas se usa éticamente?',['En cualquier sitio','Solo propios o con autorización','Solo en webs','Solo en bancos'],1,'Solo en sistemas autorizados.'],
'Privilege escalation':['Escalar privilegios permite obtener acceso administrativo.','sudo -l','¿Qué muestra sudo -l?',['Usuarios online','Comandos permitidos con sudo','Archivos borrados','Redes activas'],1,'Lista los comandos que puedes usar con sudo.'],
'Post-explotación':['La post-explotación mantiene el acceso y recolecta información.','# Persistencia','¿Qué se hace primero?',['Cerrar sesión','Documentar todo','Borrar logs','Reiniciar'],1,'Documentar todo es esencial para el reporte.'],
'Ingeniería social':['La ingeniería social manipula personas para obtener información.','# Phishing simulado','¿Cuándo es ética?',['Siempre','Solo en entrenamientos con consentimiento','Nunca','En cualquier empresa'],1,'Requiere consentimiento explícito.'],
'Reportes':['Un buen reporte explica hallazgos, riesgos y soluciones.','# Resumen ejecutivo','¿Qué debe incluir?',['Solo capturas','Hallazgos + riesgos + fixes','Solo el nombre','Solo fechas'],1,'Un reporte completo explica todo.'],
'Bug Bounty':['Programas de recompensas por reportar vulnerabilidades éticamente.','# HackerOne','¿Qué regla es clave?',['Ignorar reglas','Seguir el scope del programa','Publicar antes de reportar','Vender datos'],1,'Seguir el scope del programa es obligatorio.'],
'Instalación de Termux':['Instala Termux desde una fuente oficial mantenida.','pkg update && pkg upgrade','¿Qué hace pkg upgrade?',['Borra paquetes','Actualiza paquetes','Crea paquetes','Lista paquetes'],1,'Actualiza los paquetes instalados.'],
'Comandos básicos':['pwd, ls, cd y mkdir te ayudan a navegar por el sistema.','pwd','¿Qué comando muestra la carpeta actual?',['ls','pwd','cd','mkdir'],1,'pwd significa print working directory.'],
'pkg y apt':['pkg y apt instalan paquetes en Termux.','pkg install python','¿Qué comando instala paquetes?',['apt-get install','pkg install','pkg add','apt add'],1,'pkg install es el comando en Termux.'],
'Almacenamiento':['termux-setup-storage da acceso a carpetas del teléfono.','termux-setup-storage','¿Qué hace?',['Borra archivos','Solicita acceso al almacenamiento','Formatea el teléfono','Crea usuarios'],1,'Solicita permisos de almacenamiento.'],
'Editores':['nano y vim permiten editar archivos en la terminal.','nano archivo.txt','¿Cómo guardas en nano?',['Ctrl+X','Ctrl+O','Ctrl+C','Ctrl+S'],1,'Ctrl+O escribe el archivo.'],
'Python en Termux':['Puedes ejecutar Python directamente en Termux.','python script.py','¿Qué comando ejecuta Python?',['python script.py','run python','python3-run','exec py'],0,'python script.py ejecuta el archivo.'],
'pip':['pip instala librerías de Python.','pip install requests','¿Qué hace pip?',['Instala paquetes de Python','Borra Python','Crea scripts','Compila código'],0,'pip instala y gestiona paquetes.'],
'Git':['Git controla versiones de tu código.','git commit -m "inicio"','¿Qué guarda git commit?',['Solo un archivo','Los cambios en el repositorio','La RAM','Los usuarios'],1,'Registra los cambios del staging area.'],
'SSH':['SSH permite conectarte a servidores remotos.','ssh usuario@servidor','¿Qué es más seguro?',['Contraseñas simples','Claves SSH','Sin contraseña','Compartir usuario'],1,'Las claves SSH son más seguras.'],
'Nmap en Termux':['Nmap funciona en Termux para escaneos básicos.','pkg install nmap','¿Qué escaneos son éticos?',['Cualquier red','Solo propios o con permiso','Redes públicas','Redes ajenas'],1,'Solo en redes propias o con permiso.'],
'Hydra':['Hydra prueba credenciales contra servicios.','hydra -l admin -P lista','¿Dónde se usa?',['En cualquier lado','Solo en laboratorios','Solo en webs','Solo en bancos'],1,'Solo en laboratorios autorizados.'],
'Scripting bash':['Los scripts bash automatizan tareas del sistema.','#!/bin/bash','¿Qué hace el shebang?',['Comenta','Indica el intérprete','Borra el script','Lo ejecuta como admin'],1,'El shebang indica el intérprete.'],
'Cron jobs':['Cron programa tareas recurrentes.','crontab -e','¿Qué hace?',['Lista usuarios','Edita las tareas programadas','Borra cron','Reinicia el sistema'],1,'Abre el editor de crontab.'],
'Servidores locales':['Puedes levantar servidores web localmente.','python -m http.server 8000','¿Qué puerto usa por defecto?',['80','8000','443','3000'],1,'El ejemplo usa el puerto 8000.'],
'Ngrok':['Ngrok expone tu servidor local a internet.','ngrok http 8000','¿Qué hace?',['Borra el servidor','Crea un túnel público','Cifra el disco','Crea usuarios'],1,'Crea un túnel temporal a tu localhost.'],
'Web scraping':['Extrae datos de sitios web con Python.','BeautifulSoup','¿Qué se debe respetar?',['Nada','robots.txt y términos de uso','Solo el diseño','Solo la velocidad'],1,'Respeta robots.txt y términos.'],
'APIs':['Las APIs permiten comunicarte con servicios externos.','requests.get("https://api.github.com")','¿Qué devuelve?',['Una imagen','Un objeto con la respuesta','Un PDF','Un video'],1,'Devuelve un objeto con status y datos.'],
'Bot de Telegram':['Puedes crear bots de Telegram con Python.','from telegram import Bot','¿Qué necesitas?',['Solo Python','Un token del BotFather','Un servidor','Solo WiFi'],1,'Necesitas el token del BotFather.'],
'Deploy':['El deploy publica tu app en un servidor.','# Vercel/Render/Railway','¿Cuándo se debe hacer?',['Antes de probar','Después de probar en local','Sin probar','Solo los viernes'],1,'Primero prueba en local.'],
'Proyecto final':['Aplica todo lo aprendido en un proyecto propio.','# Idea: bot que consulte APIs','¿Qué es clave?',['No documentar','Documentar paso a paso','Copiar código','No probar'],1,'Documentar facilita aprender y explicar.'],
'Introducción a Kali':['Kali Linux reúne herramientas para pruebas de seguridad, formación.','whoami','¿Qué muestra whoami?',['La IP','El usuario actual','La ruta','El sistema'],1,'Muestra el usuario actual.'],
'apt en Kali':['apt gestiona paquetes en Kali Linux.','sudo apt update','¿Qué hace?',['Borra todo','Actualiza el índice de paquetes','Formatea','Crea usuarios'],1,'Actualiza la lista de paquetes disponibles.'],
'Nmap en Kali':['Nmap viene preinstalado en Kali.','nmap -A 192.0.2.10','¿Qué hace -A?',['Escaneo agresivo con detección','Borra','Cifra','Crea'],0,'-A habilita detección agresiva.'],
'Burp Suite':['Burp Suite analiza y modifica tráfico HTTP.','# Proxy 127.0.0.1:8080','¿Dónde se configura el proxy?',['En el navegador','En el kernel','En la BIOS','En la RAM'],0,'Se configura en el navegador.'],
'Aircrack-ng':['Aircrack-ng audita redes WiFi.','airmon-ng start wlan0','¿Qué hace?',['Borra la red','Activa modo monitor','Cifra el WiFi','Desconecta'],1,'Activa modo monitor para capturar.'],
'John the Ripper':['John crackea hashes de contraseñas.','john hash.txt','¿Qué necesita?',['Una imagen','El hash y una wordlist','Un PDF','Solo WiFi'],1,'Necesita el hash y una lista de palabras.'],
'Hashcat':['Hashcat crackea hashes con GPU.','hashcat -m 0 hash.txt rockyou.txt','¿Qué es -m 0?',['Modo MD5','Borra','Cifra','Crea'],0,'-m 0 indica el tipo MD5.'],
'SQLmap':['SQLmap automatiza detección de SQL injection.','sqlmap -u "url?id=1"','¿Cuándo usarlo?',['En cualquier sitio','Con permiso escrito','En bancos','En redes WiFi'],1,'Solo con autorización escrita.'],
'Gobuster':['Gobuster enumera directorios y subdominios.','gobuster dir -u url -w lista','¿Qué hace?',['Borra archivos','Enumera rutas','Cifra','Crea usuarios'],1,'Enumera rutas del servidor.'],
'Nikto':['Nikto escanea vulnerabilidades web comunes.','nikto -h url','¿Dónde se usa?',['En cualquier sitio','En sitios autorizados','En bancos','En WiFi público'],1,'Solo en sitios propios o autorizados.'],
'WPScan':['WPScan analiza vulnerabilidades de WordPress.','wpscan --url url','¿En qué CMS?',['Joomla','WordPress','Drupal','Magento'],1,'Es específico para WordPress.'],
'Maltego':['Maltego visualiza relaciones entre entidades.','# OSINT','¿Qué hace?',['Cifra','Mapea relaciones','Borra datos','Escanea puertos'],1,'Mapea relaciones entre entidades.'],
'BeEF':['BeEF explota vulnerabilidades del navegador.','# Laboratorio','¿Dónde se usa?',['En cualquier navegador','Solo en laboratorio','En bancos','En WiFi público'],1,'Solo en entornos de laboratorio.'],
'Forensics':['El análisis forense investiga incidentes tras un ataque.','# Autopsy/Volatility','¿Qué es clave?',['Borrar todo','Cadena de custodia','Ignorar evidencias','Publicar online'],1,'Mantener la cadena de custodia es clave.'],
'Reporte final':['Consolida todos los hallazgos en un reporte profesional.','# Resumen + hallazgos','¿Qué debe incluir?',['Solo capturas','Resumen, hallazgos, riesgo, fix','Solo fechas','Solo nombres'],1,'Un reporte profesional incluye todo.']
};

function generateQuizForLesson(lessonTitle, courseName, courseId){
  if(lessons[lessonTitle]) return lessons[lessonTitle];
  const t=(lessonTitle||'').toLowerCase();
  let question, options, correct, explanation, example;
  if(courseId==='python'){
    if(/prueba|pytest|unittest|mock/.test(t)){question=`Al probar ${lessonTitle.toLowerCase()}, ¿qué práctica mejora la fiabilidad?`;options=['Probar solo el caso ideal','Cubrir casos normales, límites y errores','Eliminar las aserciones','Depender de datos reales siempre'];correct=1;explanation='Las pruebas útiles cubren comportamiento esperado, límites y fallos previsibles.';example='assert sumar(2, 3) == 5';}
    else if(/archivo|json|csv|sqlite|base de datos|serializ/.test(t)){question=`Al trabajar con ${lessonTitle.toLowerCase()}, ¿qué opción es más segura?`;options=['Concatenar datos externos en consultas','Validar datos y usar APIs/consultas parametrizadas','Suponer que el archivo siempre existe','Ignorar errores de codificación'];correct=1;explanation='Validación, manejo explícito de errores y consultas parametrizadas reducen fallos y vulnerabilidades.';example='cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))';}
    else if(/async|concurr|hilo|proceso/.test(t)){question=`¿Qué debes evaluar al elegir una estrategia para ${lessonTitle.toLowerCase()}?`;options=['Que siempre use más hilos','Si la tarea espera I/O o consume CPU','Que no tenga manejo de errores','Que comparta toda la memoria'];correct=1;explanation='I/O concurrente y trabajo intensivo de CPU tienen necesidades diferentes; mide antes de optimizar.';example='async def obtener():\\n    ...';}
    else if(/git|document|proyecto|cli|empaquet|módulo/.test(t)){question=`¿Qué hábito profesional ayuda con ${lessonTitle.toLowerCase()}?`;options=['Guardar secretos en el repositorio','Documentar uso y cambios reproducibles','No revisar dependencias','Hacer cambios sin probar'];correct=1;explanation='Documentación, control de versiones y pasos reproducibles facilitan mantener el software.';example='README.md · requirements.txt · pruebas';}
    else {question=`En ${lessonTitle.toLowerCase()}, ¿cuál es el enfoque más sólido?`;options=['Usar la primera solución sin probar','Entender el comportamiento y comprobarlo con un ejemplo','Ignorar casos límite','Optimizar sin medir'];correct=1;explanation='Comprender, experimentar con ejemplos pequeños y verificar resultados hace el aprendizaje transferible.';example='# Prueba primero con una entrada pequeña';}
  } else if(courseId==='hacking'){
    if(/sql|inyección|sqli/.test(t)){question='¿Qué control previene mejor la inyección SQL?';options=['Ocultar el botón de enviar','Consultas parametrizadas y validación adecuada','Cambiar el nombre de la tabla','Confiar en el navegador'];correct=1;explanation='Las consultas parametrizadas separan el código SQL de los valores suministrados.';example='Usa una aplicación de laboratorio local para comprobarlo.';}
    else if(/xss|salida|csp|cabecera|cookie|csrf|cors|web|http|api|ssrf|path traversal|archivo/.test(t)){question=`¿Cuál es la primera práctica defensiva relevante para ${lessonTitle.toLowerCase()}?`;options=['Confiar en todos los datos del cliente','Validar entradas, aplicar controles del servidor y probar en laboratorio','Desactivar registros','Probar sitios al azar'];correct=1;explanation='Los controles deben aplicarse en el servidor y verificarse únicamente dentro del alcance autorizado.';example='Laboratorio propio + evidencia mínima + recomendación de corrección';}
    else if(/alcance|ética|permiso|bug bounty|divulgación|reporte|incidente/.test(t)){question=`Para ${lessonTitle.toLowerCase()}, ¿qué acción es profesional?`;options=['Ampliar pruebas fuera del alcance','Respetar autorización, alcance y documentar evidencias','Publicar datos privados','Borrar registros'];correct=1;explanation='La autorización, la minimización del impacto y la divulgación responsable son requisitos centrales.';example='Define alcance, ventana de prueba y contacto antes de empezar.';}
    else {question=`¿Cómo se practica ${lessonTitle.toLowerCase()} de forma responsable?`;options=['En sistemas aleatorios','En laboratorio propio o con autorización explícita','Sin registrar resultados','Evitando validar hallazgos'];correct=1;explanation='El laboratorio aislado y el permiso explícito permiten aprender sin afectar a terceros.';example='Registra objetivo autorizado, método, evidencia y mitigación.';}
  } else if(courseId==='termux'){
    if(/git|proyecto|node|vite|npm|publicar|compilar/.test(t)){question=`¿Qué paso conviene antes de publicar ${lessonTitle.toLowerCase()}?`;options=['Subir claves privadas','Probar la compilación y revisar secretos/dependencias','Borrar el README','Ignorar los errores'];correct=1;explanation='Una compilación comprobada y la ausencia de secretos reducen errores de despliegue.';example='npm run build';}
    else if(/bash|script|comando|chmod|permiso|ruta|archivo|backup|copia/.test(t)){question=`¿Qué precaución es clave en ${lessonTitle.toLowerCase()}?`;options=['Ejecutar comandos sin revisar la ruta','Verificar rutas, permisos y salida antes de operaciones destructivas','Usar sudo en todo','Ignorar códigos de salida'];correct=1;explanation='Comprueba el directorio actual y las rutas antes de modificar o borrar archivos.';example='pwd && ls';}
    else {question=`¿Cuál es una buena práctica para ${lessonTitle.toLowerCase()} en Termux?`;options=['Instalar scripts desconocidos sin leerlos','Practicar en tu dispositivo y comprobar permisos/salidas','Compartir tokens en el código','Ignorar actualizaciones'];correct=1;explanation='Trabaja en tu propio entorno, revisa permisos y conserva una forma de recuperar tus datos.';example='Consulta la ayuda del comando antes de ejecutarlo.';}
  } else {
    if(/wireshark|pcap|forense|evidencia|memoria|logs/.test(t)){question=`Al estudiar ${lessonTitle.toLowerCase()}, ¿qué preserva la calidad del análisis?`;options=['Modificar la evidencia original','Trabajar con copias y documentar la cadena de custodia','Compartir datos sensibles','Omitir marcas de tiempo'];correct=1;explanation='La integridad de las evidencias y la documentación permiten reproducir y confiar en el análisis.';example='Calcula hashes de las muestras y registra cada transferencia.';}
    else if(/burp|nmap|gobuster|nikto|sqlmap|metasploit|escaneo|enumeración/.test(t)){question=`¿Cuál es la condición para practicar ${lessonTitle.toLowerCase()}?`;options=['Escanear redes públicas sin permiso','Usar un laboratorio aislado o un objetivo autorizado','Aumentar velocidad sin límites','Ignorar el alcance'];correct=1;explanation='Limita las pruebas a sistemas propios o autorizados y ajusta la intensidad para evitar impactos.';example='Usa localhost o una máquina vulnerable aislada.';}
    else {question=`¿Qué resultado demuestra un buen aprendizaje de ${lessonTitle.toLowerCase()}?`;options=['Ejecutar herramientas sin comprenderlas','Explicar el hallazgo, validar evidencia y proponer mitigación','Cambiar sistemas ajenos','Omitir documentación'];correct=1;explanation='Un análisis profesional valida los hallazgos y los convierte en acciones correctivas claras.';example='Hallazgo → evidencia → impacto → corrección → retest.';}
  }
  const variants=[
    {q:question,o:options,c:correct,e:explanation,x:example},
    {q:`¿Qué error debes evitar al aplicar ${lessonTitle.toLowerCase()}?`,o:['Verificar el resultado','Documentar el procedimiento','Actuar sin entender riesgos ni validar resultados','Practicar en un entorno controlado'],c:2,e:'La práctica segura exige comprender el alcance, validar los resultados y documentar lo aprendido.',x:example},
    {q:`¿Qué evidencia indica que comprendiste ${lessonTitle.toLowerCase()}?`,o:['Puedes explicar el concepto y justificar una decisión','Solo recuerdas el nombre','Copiaste un comando sin revisarlo','No puedes reproducir el resultado'],c:0,e:'Explicar por qué funciona y reproducirlo en condiciones controladas demuestra comprensión.',x:example}
  ];
  const seed=[...t].reduce((a,ch)=>a+ch.charCodeAt(0),0)%variants.length, v=variants[seed];
  return [`${lessonTitle} es una competencia de ${courseName}. Aprende el objetivo, practica con un ejemplo pequeño y comprueba el resultado.`,v.x,v.q,v.o,v.c,v.e];
}

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
const bannerOptions=[{id:'playa',label:'Playa',img:'escenario playa.jpg'}];

function App(){
 const [user,setUser]=useState(null);
 const [email,setEmail]=useState('');
 const [password,setPassword]=useState('');
 const [isRegister,setIsRegister]=useState(false);
 const [loadingAuth,setLoadingAuth]=useState(true);
 const [admobReady,setAdmobReady]=useState(false);

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
  const [bond,setBond]=useState(()=>safeRead('hl_nova_bond',{akari:12,yuki:8,prime:0,shadow:0}));
  useEffect(()=>{safeWrite('hl_nova_bond',bond)},[bond]);
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

 // Firebase auth
 useEffect(()=>{
   const unsubscribe = onAuthStateChanged(auth, (u)=>{setUser(u);setLoadingAuth(false);});
   return () => unsubscribe();
 }, []);

 // AdMob init
 useEffect(()=>{
   let mounted = true;
   const initAdMob = async () => {
     try {
       await AdMob.initialize({requestTrackingAuthorization:true, testingDevices:[]});
       if(mounted) setAdmobReady(true);
       try { await AdMob.prepareRewardVideoAd({adId: ADMOB_REWARD_ID}); } catch(e) {}
     } catch(e) {
       console.log('AdMob no disponible:', e);
     }
   };
   initAdMob();
   return () => { mounted = false; };
 }, []);

 useEffect(()=>{safeWrite('hl_nova_progress',progress)},[progress]);
 useEffect(()=>{safeWrite('hl_nova_settings',settings)},[settings]);
 useEffect(()=>{safeWrite('hl_nova_name',name)},[name]);
 useEffect(()=>{safeWrite('hl_nova_premium',isPremium)},[isPremium]);
 useEffect(()=>{safeWrite('hl_nova_premium_until',premiumUntil)},[premiumUntil]);
 useEffect(()=>{safeWrite('hl_nova_avatar',avatar)},[avatar]);
 useEffect(()=>{if(premiumUntil&&Date.now()>premiumUntil){setIsPremium(false);setPremiumUntil(0)}},[premiumUntil]);

 const audioCtxRef = useRef(null);
 const playSound = (type) => {
   if(!settings.sound) return;
   try {
     if(!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
     const ctx = audioCtxRef.current;
     if(ctx.state === 'suspended') ctx.resume();
     const now = ctx.currentTime;
     const config = {
       click: {freq: 520, dur: 0.06, type: 'sine', vol: 0.06},
       correct: {freq: 660, dur: 0.18, type: 'triangle', vol: 0.08, ramp: 880},
       wrong: {freq: 220, dur: 0.22, type: 'sawtooth', vol: 0.06, ramp: 160},
       levelup: {freq: 440, dur: 0.3, type: 'sine', vol: 0.1, ramp: 880},
       tap: {freq: 380, dur: 0.04, type: 'square', vol: 0.04}
     }[type] || {freq: 400, dur: 0.08, type: 'sine', vol: 0.05};
     const osc = ctx.createOscillator();
     const gain = ctx.createGain();
     osc.type = config.type;
     osc.frequency.setValueAtTime(config.freq, now);
     if(config.ramp) osc.frequency.exponentialRampToValueAtTime(config.ramp, now + config.dur);
     gain.gain.setValueAtTime(config.vol, now);
     gain.gain.exponentialRampToValueAtTime(0.001, now + config.dur);
     osc.connect(gain); gain.connect(ctx.destination);
     osc.start(now); osc.stop(now + config.dur);
   } catch(e) { /* silent */ }
 };

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
 const quiz = lessons[lesson] || generateQuizForLesson(lesson, course.name, course.id);
 const flashcards=[
 ['Variable','Un nombre que referencia un valor.','nombre = "Akari"'],
 ['Bucle','Repite instrucciones mientras recorre datos o se cumple una condición.','for item in lista:'],
 ['Hash','Huella de datos; no es cifrado reversible.','SHA-256'],
 ['Permiso','Autorización explícita para evaluar un sistema.','Define alcance antes de probar.'],
 ['Función','Bloque reutilizable que puede recibir argumentos.','def saludar(nombre):']
 ];
 const [flashIndex,setFlashIndex]=useState(0),[flashFlip,setFlashFlip]=useState(false);
 const showToast=(t)=>{setToast(t);setTimeout(()=>setToast(''),2500)};

 function navigate(p){ playSound('tap'); setPage(p);setFeedback('');setSelected(null);setQuizStep(-1);setShowExplanation(false);window.scrollTo({top:0,behavior:'smooth'}) }
 function startLesson(c,i){ playSound('click'); setActiveCourse(c);setLessonIndex(i);setQuizStep(-1);setSelected(null);setFeedback('');setShowExplanation(false);navigate('lesson') }
 function nextLesson(){ playSound('tap'); if(lessonIndex<course.topics.length-1){setLessonIndex(i=>i+1);setSelected(null);setFeedback('');setShowExplanation(false)}else{navigate('courses');showToast('¡Curso recorrido! Sigue repasando para dominarlo.')}}
 function answerQuiz(i){
   if(feedback)return;
   setSelected(i);
   const ok=i===quiz[4];
   if(ok){ playSound('correct'); } else { playSound('wrong'); }
   setFeedback(ok?'correct':'wrong');
   setShowExplanation(true);
   const id=course.id+'-'+lessonIndex;
   if(ok){
     setProgress(p=>({...p,xp:p.xp+25,coins:p.coins+8,done:p.done.includes(id)?p.done:[...p.done,id],answers:p.answers+1,perfect:p.perfect+1,hearts:isPremium?p.hearts:Math.min(10,p.hearts+1)}));
   }else{
     setProgress(p=>({...p,answers:p.answers+1,hearts:isPremium?p.hearts:Math.max(0,p.hearts-1)}));
   }
 }
 function claimDaily(){
   if(dailyClaimed===new Date().toDateString()){showToast('Ya reclamaste la recompensa de hoy ✨');return}
   playSound('levelup');
   setDailyClaimed(new Date().toDateString());
   safeWrite('hl_nova_daily',new Date().toDateString());
   setProgress(p=>({...p,xp:p.xp+50,coins:p.coins+20,hearts:isPremium?p.hearts:Math.min(10,(p.hearts||0)+10),streak:p.streak+1}));
   showToast('Misión diaria: +50 XP, +20 monedas y +10 corazones ❤️');
 }

 async function watchAdForHearts(){
   if(isPremium){ playSound('levelup'); showToast('Eres Premium: corazones ilimitados 👑'); return; }
   if(progress.hearts >= 10){ showToast('Ya tienes el máximo de corazones (10) ❤️'); return; }
   playSound('tap');
   showToast('Cargando anuncio... 📺');
   try {
     await AdMob.prepareRewardVideoAd({ adId: ADMOB_REWARD_ID });
     await AdMob.showRewardVideoAd();
     playSound('levelup');
     setProgress(p=>({...p,hearts:Math.min(10,(p.hearts||0)+5)}));
     showToast('¡+5 corazones! ❤️ Gracias por ver el anuncio');
     try { await AdMob.prepareRewardVideoAd({ adId: ADMOB_REWARD_ID }); } catch(e) {}
   } catch(e) {
     console.log('AdMob error:', e);
     if(!admobReady){
       setProgress(p=>({...p,hearts:Math.min(10,(p.hearts||0)+5)}));
       playSound('levelup');
       showToast('Modo prueba: +5 corazones ❤️ (AdMob no disponible)');
     } else {
       playSound('wrong');
       showToast('Anuncio no disponible. Intenta más tarde.');
     }
   }
 }

 function toggleFavorite(id){ playSound('tap'); setProgress(p=>({...p,favorites:p.favorites.includes(id)?p.favorites.filter(x=>x!==id):[...p.favorites,id]}))}
 function activatePremium(days){
   playSound('levelup');
   const until=Date.now()+(days*24*60*60*1000);
   setIsPremium(true);
   setPremiumUntil(until);
   setProgress(p=>({...p,hearts:999}));
   showToast(`¡Premium activado por ${days} días! 👑`);
 }
 function redeemCode(){
   const codes={'NOVA7':7,'NOVA30':30,'NOVA60':60,'HACKLINGO2026':30,'SENPAI':7};
   const upper=(codeInput||'').toUpperCase().trim();
   if(codes[upper]){ activatePremium(codes[upper]); setCodeInput(''); }
   else{ playSound('wrong'); showToast('Código inválido ❌'); }
 }
 const handleAuth = async (e) => {
   e.preventDefault();
   if(!email || !password){ showToast('Completa todos los campos'); return; }
   try {
     if(isRegister){ await createUserWithEmailAndPassword(auth, email, password); showToast('¡Cuenta creada! Bienvenido'); }
     else { await signInWithEmailAndPassword(auth, email, password); showToast('¡Sesión iniciada!'); }
     playSound('levelup');
   } catch (error) {
     playSound('wrong');
     let msg = error.message;
     if(msg.includes('email-already-in-use')) msg = 'Ese correo ya está registrado';
     else if(msg.includes('invalid-credential') || msg.includes('wrong-password')) msg = 'Correo o contraseña incorrectos';
     else if(msg.includes('weak-password')) msg = 'La contraseña debe tener al menos 6 caracteres';
     else if(msg.includes('invalid-email')) msg = 'Correo electrónico inválido';
     showToast('Error: ' + msg);
   }
 };
 const handleLogout = async () => { await signOut(auth); showToast('Sesión cerrada'); };

 const filteredCourses=courses.filter(c=>(c.name+' '+c.desc+' '+c.short).toLowerCase().includes(search.toLowerCase())&&(tab==='Todos'||(tab==='En progreso'&&c.topics.some((_,i)=>completed.has(c.id+'-'+i)))||(tab==='Sin empezar'&&!c.topics.some((_,i)=>completed.has(c.id+'-'+i)))));
 const scenes=[
  {who:'Akari',img:'wf1 f feliz.png',place:'Laboratorio de neón',text:`¡Senpai, llegaste justo a tiempo! El servidor de la academia tiene un reto nuevo. Si resolvemos el primer desafío, desbloquearemos el siguiente capítulo. ¿Listo?`,choices:[['¡Vamos a resolverlo!','brave'],['Primero quiero revisar mis notas','calm']]},
  {who:'Yuki',img:'wf2 f feliz.png',place:'Pasillo de la academia',text:'Mmm… encontré una pista en los registros. La pista no es la respuesta, pero nos puede orientar. ¿Qué hacemos con ella?',choices:[['Analizar la pista con calma','careful'],['Probar una hipótesis en el laboratorio','bold']]},
  {who:'Akari Prime',img:'wf1 p feliz.png',place:'Sala de análisis',text:'Buen trabajo. El objetivo de una auditoría es entender el riesgo y comunicarlo con claridad. Antes de cerrar el caso, debemos documentar qué observamos y cómo reproducirlo de forma segura.',choices:[['Escribir un reporte claro','report'],['Repasar el concepto una vez más','review']]},
  {who:'Akari',img:'wf1 f sonrojada.png',place:'Terraza al atardecer',text:'¡Lo logramos! No fue magia: fue curiosidad, práctica y trabajo en equipo. La próxima misión será más difícil, pero ya sabes cómo empezar. ¿Seguimos aprendiendo juntos?',choices:[['¡Siguiente capítulo!','next'],['Guardar este final por hoy','end']]}
 ];
 function chooseStory(key){ playSound('tap'); setStoryRoute(r=>[...r,key]);setProgress(p=>({...p,xp:p.xp+10,coins:p.coins+3}));if(storyStep<scenes.length-1)setStoryStep(s=>s+1);else{setStoryStep(0);showToast('Ruta guardada. +10 XP');}}
 const currentScene=scenes[storyStep];
 const navItems=[['home','⌂','Inicio'],['courses','▤','Cursos'],['story','♡','Novela'],['practice','✦','Práctica'],['waifus','♧','Waifus']];
 const activeWaifuObj=waifus.find(w=>w.id===activeWaifu)||waifus[0];
 const avatarLook=avatarOptions.find(a=>a.id===avatar.look)||avatarOptions[0];
 const avatarBanner=bannerOptions.find(b=>b.id===avatar.banner)||bannerOptions[0];

 if(loadingAuth){
   return <div className="app" style={{display:'grid',placeItems:'center',height:'100vh'}}>
     <div style={{textAlign:'center'}}>
       <div className="brand-mark" style={{margin:'0 auto 15px',width:'50px',height:'50px',fontSize:'28px'}}>H<span>✦</span></div>
       <h1 style={{fontFamily:'Space Grotesk'}}>HackLingo Nova</h1>
       <p style={{color:'#9392a8',marginTop:'8px'}}>Cargando...</p>
     </div>
   </div>;
 }

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
             <input type="email" placeholder="tu@correo.com" value={email} onChange={e=>setEmail(e.target.value)} required style={{width:'100%',padding:'13px 14px',borderRadius:'10px',border:'1px solid #39364a',background:'#11111a',color:'#fff',fontSize:'12px',outline:'none'}}/>
           </div>
           <div>
             <label style={{fontSize:'10px',color:'#a79bbf',display:'block',marginBottom:'6px',letterSpacing:'1px',fontWeight:700}}>CONTRASEÑA</label>
             <input type="password" placeholder="Mínimo 6 caracteres" value={password} onChange={e=>setPassword(e.target.value)} required style={{width:'100%',padding:'13px 14px',borderRadius:'10px',border:'1px solid #39364a',background:'#11111a',color:'#fff',fontSize:'12px',outline:'none'}}/>
           </div>
           <button type="submit" className="btn primary" style={{padding:'14px',marginTop:'10px',fontSize:'12px'}}>
             {isRegister ? 'Crear cuenta' : 'Iniciar sesión'} →
           </button>
         </form>
         <button onClick={()=>setIsRegister(!isRegister)} className="text-link" style={{display:'block',margin:'18px auto 0',textAlign:'center',fontSize:'11px'}}>
           {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate gratis'}
         </button>
         <div style={{marginTop:'25px',padding:'12px',background:'#1b1b28',borderRadius:'10px',border:'1px solid #2b2a3b'}}>
           <p style={{fontSize:'9px',color:'#7e7b92',lineHeight:'1.6',margin:0,textAlign:'center'}}>🔒 Tus datos se guardan de forma segura en Firebase</p>
         </div>
       </div>
     </div>
   );
 }

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
    <div className="hero-art"><div className="hero-orbit orbit-one"></div><div className="hero-orbit orbit-two"></div><div className="hero-glow"></div><img src={MEDIA+activeWaifuObj.image} alt={activeWaifuObj.name} className="hero-waifu"/><div className="speech-card"><span className="speech-icon">✦</span><div><b>¡Hey, {name}!</b><p>{activeWaifuObj.quote}</p></div></div><div className="hero-level"><span>LVL</span><b>{Math.floor(progress.xp/100)+1}</b><small>APRENDIZ</small></div></div>
   </section>
   <section className="stats-grid"><div className="stat-card"><div className="stat-top"><span className="stat-icon purple">⚡</span><span className="stat-trend">+25 por lección</span></div><div className="stat-number">{progress.xp.toLocaleString()}<small> XP</small></div><div className="stat-caption">Experiencia total</div><div className="stat-bar"><i style={{width:(progress.xp%100)+'%'}}/></div><div className="stat-foot">Siguiente nivel <b>{100-progress.xp%100} XP</b></div></div>
    <div className="stat-card"><div className="stat-top"><span className="stat-icon orange">🔥</span><span className="stat-trend">¡Sigue así!</span></div><div className="stat-number">{progress.streak}<small> días</small></div><div className="stat-caption">Racha de aprendizaje</div><div className="week-dots">{['L','M','X','J','V','S','D'].map((d,i)=><span key={d} className={i<Math.min(7,progress.streak)?'checked':''}>{i<Math.min(7,progress.streak)?'✓':d}</span>)}</div></div>
    <div className="stat-card"><div className="stat-top"><span className="stat-icon mint">◈</span><span className="stat-trend">De todos los cursos</span></div><div className="stat-number">{pct}<small>%</small></div><div className="stat-caption">Progreso de academia</div><div className="progress-track"><i style={{width:pct+'%'}}/></div><div className="stat-foot">{completed.size} de {total} lecciones</div></div>
    <div className="stat-card daily-card"><div className="stat-top"><span className="stat-icon pink">✦</span><span className="daily-tag">DIARIA</span></div><div className="daily-title">Un paso cada día</div><div className="stat-caption">Completa una misión y gana recompensas.</div><button className="btn small-btn" onClick={claimDaily}>{dailyClaimed===new Date().toDateString()?'✓ Reclamada':'+ Reclamar 50 XP'}</button></div></section>
   <section className="section-block"><div className="section-heading"><div><div className="eyebrow">TU CAMINO</div><h2>Rutas de aprendizaje <span className="count-pill">04</span></h2></div><button className="text-link" onClick={()=>navigate('courses')}>Ver todos <span>↗</span></button></div><div className="course-grid">{courses.map((c,i)=>{let done=c.topics.filter((_,j)=>completed.has(c.id+'-'+j)).length;return <article className="course-card" key={c.id} style={{'--course':c.color,'--delay':i*50+'ms'}}><div className="course-card-top"><div className="course-emoji">{c.emoji}</div><span className="course-label">{c.short}</span><button className="dots-button" onClick={()=>{setActiveCourse(c.id);navigate('courses')}}>•••</button></div><h3>{c.name}</h3><p>{c.desc}</p><div className="course-progress-line"><span>Progreso</span><b>{Math.round(done/c.topics.length*100)}%</b></div><div className="progress-track"><i style={{width:(done/c.topics.length*100)+'%'}}/></div><div className="course-card-foot"><span>{done}/{c.topics.length} lecciones</span><button className="circle-arrow" onClick={()=>startLesson(c.id,Math.max(0,c.topics.findIndex((_,j)=>!completed.has(c.id+'-'+j))))}>↗</button></div></article>})}</div></section>
   <section className="bottom-grid"><div className="panel recent-panel"><div className="section-heading compact"><div><div className="eyebrow">RETOMA EL RITMO</div><h2>Continúa tu camino</h2></div><span className="panel-icon">⌁</span></div>{courses.slice(0,3).map(c=>{let idx=Math.max(0,c.topics.findIndex((_,i)=>!completed.has(c.id+'-'+i)));return <button className="continue-row" key={c.id} onClick={()=>startLesson(c.id,idx)}><span className="continue-emoji" style={{'--course':c.color}}>{c.emoji}</span><span className="continue-info"><b>{c.name}</b><small>{c.topics[idx]} · Lección {idx+1}</small></span><span className="continue-arrow">→</span></button>})}</div>
    <div className="panel mentor-panel"><div className="mentor-bg"></div><div className="mentor-content"><span className="mentor-tag">TU MENTORA</span><h2>Aprender es mejor<br/>en compañía.</h2><p>{activeWaifuObj.name} está lista para tu próxima misión.</p><button className="btn mentor-btn" onClick={()=>navigate('waifus')}>Cambiar mentora <span>↗</span></button></div><img src={MEDIA+activeWaifuObj.image} alt={activeWaifuObj.name} /></div></section>
  </div>}
  {page==='courses'&&<div className="page-enter"><div className="page-title-row"><div><div className="eyebrow">CATÁLOGO COMPLETO</div><h1>Tus <span className="gradient-text">rutas.</span></h1><p className="muted">{courses.length} rutas, {total} lecciones para convertir curiosidad en habilidades reales.</p></div><div className="search-box"><span>⌕</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar una ruta…"/></div></div><div className="filter-row">{['Todos','En progreso','Sin empezar'].map(t=><button key={t} className={'filter-chip '+(tab===t?'selected':'')} onClick={()=>setTab(t)}>{t}</button>)}</div><div className="catalog-grid">{filteredCourses.map(c=>{let done=c.topics.filter((_,i)=>completed.has(c.id+'-'+i)).length;return <article className="catalog-card" key={c.id} style={{'--course':c.color}}><div className="catalog-head"><div className="course-emoji large">{c.emoji}</div><span className="level-tag">{c.level}</span></div><h2>{c.name}</h2><p>{c.desc}</p><div className="catalog-meta"><span>▤ {c.topics.length} lecciones</span><span>◷ 2–4 h</span></div><div className="progress-track"><i style={{width:done/c.topics.length*100+'%'}}/></div><div className="catalog-foot"><span>{done} completadas</span><button className="btn primary small-btn" onClick={()=>{setActiveCourse(c.id);setLessonIndex(Math.max(0,c.topics.findIndex((_,i)=>!completed.has(c.id+'-'+i))));navigate('course-detail')}}>Explorar ruta ↗</button></div></article>})}</div>
  {activeCourse&&<div className="section-block lesson-list-block"><div className="section-heading"><div><div className="eyebrow">PLAN DE ESTUDIO</div><h2>{course.name} <span className="count-pill">{course.topics.length} módulos</span></h2></div><span className="muted">{course.topics.filter((_,i)=>completed.has(course.id+'-'+i)).length} completados</span></div><div className="lesson-list">{course.topics.map((t,i)=>{let done=completed.has(course.id+'-'+i);return <button key={t} className="lesson-row" onClick={()=>startLesson(course.id,i)}><span className={'lesson-number '+(done?'is-done':'')}>{done?'✓':String(i+1).padStart(2,'0')}</span><span className="lesson-row-info"><b>{t}</b><small>{done?'Lección completada':'Concepto + ejemplo + reto rápido'}</small></span><span className="lesson-xp">+25 XP</span><span className="continue-arrow">↗</span></button>})}</div></div>}</div>}
  {(page==='lesson'||page==='course-detail')&&<div className="page-enter lesson-page"><button className="back-link" onClick={()=>navigate('courses')}>← Volver a las rutas</button><div className="lesson-layout"><section className="lesson-main panel"><div className="lesson-topline"><span className="course-label" style={{color:course.color}}>{course.emoji} {course.name.toUpperCase()}</span><span className="lesson-counter">LECCIÓN {lessonIndex+1} / {course.topics.length}</span></div><div className="lesson-progress"><i style={{width:(lessonIndex+1)/course.topics.length*100+'%'}}/></div><h1>{lesson}</h1><p className="muted">{info[0]}</p><div className="concept-box"><div className="concept-heading"><span>✦</span><b>CONCEPTO CLAVE</b></div><p>{info[0]}</p></div><div className="code-box"><div className="code-top"><span><i></i><i></i><i></i></span><small>ejemplo_practico</small><button onClick={()=>{navigator.clipboard?.writeText(info[1].replace(/\\n/g,'\n'));showToast('Ejemplo copiado')}}>Copiar código ⧉</button></div><pre>{info[1].replace(/\\n/g,'\n')}</pre></div><div className="tip-box"><span>💡</span><p><b>Consejo de Akari</b><br/>{info[2]}</p></div><div className="quiz-box"><div className="quiz-kicker">CHECKPOINT · 1 PREGUNTA</div><h2>{quiz[2]}</h2><div className="answer-list">{quiz[3].map((a,i)=><button key={a} disabled={!!feedback} className={'answer-option '+(selected===i?(i===quiz[4]?'answer-correct':'answer-wrong'):'')+((feedback&&i===quiz[4])?' answer-correct':'')} onClick={()=>answerQuiz(i)}><span>{String.fromCharCode(65+i)}</span>{a}{feedback&&i===quiz[4]&&<b className="answer-mark">✓</b>}{selected===i&&feedback==='wrong'&&<b className="answer-mark">×</b>}</button>)}</div>{showExplanation&&<div className={'feedback-box '+(feedback==='correct'?'good':'bad')}><b>{feedback==='correct'?'¡Correcto! +25 XP':'Casi, sigue aprendiendo'}</b><p>{quiz[5]}</p><button className="btn primary small-btn" onClick={nextLesson}>{lessonIndex===course.topics.length-1?'Terminar ruta':'Siguiente lección'} →</button></div>}</div></section><aside className="lesson-aside"><div className="panel mentor-mini"><img src={MEDIA+activeWaifuObj.image} alt={activeWaifuObj.name}/><div className="eyebrow">TU MENTORA</div><h3>{activeWaifuObj.name}</h3><p>"{feedback==='correct'?'¡Sabía que podías hacerlo!':feedback==='wrong'?'No te rindas, revisa el concepto y prueba otra vez.':'Una idea a la vez. ¡Tú puedes!'}"</p><button className="text-link" onClick={()=>navigate('waifus')}>Cambiar mentora ↗</button></div><div className="panel lesson-checklist"><h3>En esta lección</h3><div>✓ <span>Lee el concepto</span></div><div>◉ <span>Revisa el ejemplo</span></div><div>○ <span>Supera el checkpoint</span></div><small>Tu avance se guarda automáticamente.</small></div><div className="safety-note">🛡️ <span>En ciberseguridad, practica siempre en laboratorios propios o con permiso.</span></div></aside></div></div>}
  {page==='story'&&<div className="page-enter story-page"><div className="story-head"><div><div className="eyebrow">HACKLINGO ORIGINAL</div><h1>Neon <span className="gradient-text">Academy.</span></h1><p className="muted">Una novela visual donde cada decisión acompaña tu progreso.</p></div><div className="chapter-pill">CAPÍTULO 01 <span>◆</span></div></div><div className="visual-novel">
    {/* FIX: Solo el video, sin PNG superpuesta */}
    <div className="vn-scene-bg">
      <video key={storyStep} className="scene-video" src={MEDIA+(storyStep%2===0?'Akari escenario.mp4':'Yuki escenario.mp4')} autoPlay muted loop playsInline onError={(e)=>{e.target.style.display='none'}}/>
      <div className="scene-grid"></div>
      <div className="scene-glow"></div>
      <div className="vn-vignette"></div>
      <div className="scene-nameplate">⌁ {currentScene.place}</div>
      <div className="vn-side-label">HACKLINGO <span>STORY MODE</span></div>
      <div className="vn-chapter-tag">EPISODIO 01 <b>·</b> UNA NUEVA MISIÓN</div>
    </div>
    <div className="vn-dialog"><div className="vn-speaker"><span className="speaker-dot"></span>{currentScene.who}<small>{storyStep+1} / {scenes.length}</small></div><p>{currentScene.text}</p><div className="vn-choices">{currentScene.choices.map(([txt,key],i)=><button key={key} onClick={()=>chooseStory(key)}><span>{String(i+1).padStart(2,'0')}</span>{txt}<b>↗</b></button>)}</div><div className="vn-foot"><span>✦ Las decisiones desbloquean pequeñas variaciones.</span><button onClick={()=>{setStoryStep(0);setStoryRoute([])}}>Reiniciar capítulo ↺</button></div></div></div><div className="story-bottom-cards"><div className="panel story-tip"><span className="stat-icon purple">✧</span><div><b>Aprende dentro de la historia</b><p>Gana XP por cada decisión y vuelve a jugar para explorar otra ruta.</p></div></div><div className="panel story-tip"><span className="stat-icon mint">▤</span><div><b>Tu historial de ruta</b><p>{storyRoute.length?`${storyRoute.length} decisiones tomadas.`:'Aún no has tomado decisiones.'}</p></div></div></div></div>}
  {page==='practice'&&<div className="page-enter"><div className="page-title-row"><div><div className="eyebrow">ENTRENAMIENTO RÁPIDO</div><h1>Zona de <span className="gradient-text">práctica.</span></h1><p className="muted">Sesiones cortas para consolidar conceptos sin presión.</p></div><div className="practice-score"><span>⚡</span><b>{progress.xp} XP</b></div></div><div className="practice-grid"><button className="practice-card" onClick={()=>{setFlashIndex(0);setFlashFlip(false);navigate('flashcards')}}><div className="practice-icon purple">▣</div><span className="practice-label">MEMORIA ACTIVA</span><h2>Tarjetas de estudio</h2><p>Repasa términos clave y ejemplos breves.</p><div className="practice-card-foot"><span>5 tarjetas iniciales</span><b>→</b></div></button><button className="practice-card" onClick={()=>startLesson('python',Math.floor(Math.random()*courses[0].topics.length))}><div className="practice-icon mint">⚡</div><span className="practice-label">RETO ALEATORIO</span><h2>Un reto sorpresa</h2><p>Salta a una lección para practicar algo nuevo.</p><div className="practice-card-foot"><span>+25 XP al acertar</span><b>→</b></div></button><button className="practice-card" onClick={()=>navigate('courses')}><div className="practice-icon orange">⌘</div><span className="practice-label">LABORATORIO</span><h2>Entrena tus bases</h2><p>Elige un módulo y practica paso a paso.</p><div className="practice-card-foot"><span>{total} lecciones</span><b>→</b></div></button><button className="practice-card" onClick={()=>watchAdForHearts()}><div className="practice-icon pink">❤️</div><span className="practice-label">CORAZONES GRATIS</span><h2>Ver anuncio</h2><p>Gana 5 corazones viendo un anuncio corto.</p><div className="practice-card-foot"><span>{isPremium?'Ilimitados':'+5 corazones'}</span><b>→</b></div></button></div><div className="panel practice-reminder"><span>🛡️</span><div><b>Regla de oro del laboratorio</b><p>En los módulos de ciberseguridad, trabaja en entornos propios, CTF o laboratorios con autorización.</p></div></div></div>}
  {page==='flashcards'&&<div className="page-enter flash-page"><button className="back-link" onClick={()=>navigate('practice')}>← Volver a práctica</button><div className="center-title"><div className="eyebrow">MEMORIA ACTIVA</div><h1>Flashcards <span className="gradient-text">lab.</span></h1><p className="muted">Toca la tarjeta para revelar la respuesta.</p></div><button className={'flashcard '+(flashFlip?'flipped':'')} onClick={()=>{playSound('tap');setFlashFlip(!flashFlip)}}><span className="flash-count">{flashIndex+1} / {flashcards.length}</span><span className="flash-icon">{flashFlip?'✧':'▤'}</span><span className="flash-label">{flashFlip?'RESPUESTA':'CONCEPTO'}</span><strong>{flashFlip?flashcards[flashIndex][1]:flashcards[flashIndex][0]}</strong><code>{flashFlip?flashcards[flashIndex][2]:'Toca para voltear ↻'}</code></button><div className="flash-controls"><button className="btn ghost" onClick={()=>{setFlashIndex(i=>(i-1+flashcards.length)%flashcards.length);setFlashFlip(false)}}>← Anterior</button><button className="btn primary" onClick={()=>{setFlashIndex(i=>(i+1)%flashcards.length);setFlashFlip(false)}}>Siguiente →</button></div></div>}
  {page==='waifus'&&<div className="page-enter"><div className="page-title-row"><div><div className="eyebrow">TU EQUIPO DE APOYO</div><h1>Conoce a tus <span className="gradient-text">mentoras.</span></h1><p className="muted">Cada una tiene una personalidad y una forma distinta de acompañar tu aprendizaje.</p></div><div className="collection-pill">♡ {progress.favorites.length} favoritas</div></div><div className="waifu-grid">{waifus.map(w=>{let chosen=activeWaifu===w.id;const locked=w.premium&&!isPremium;return <article key={w.id} className={'waifu-card '+(chosen?'waifu-selected':'')+(locked?' waifu-locked':'')} style={{'--waifu':w.color}}><div className="waifu-art"><div className="waifu-halo"></div><img src={MEDIA+w.image} alt={w.name}/><span className="rarity">{w.rarity}</span>{w.premium&&<span className="premium-tag">👑 PREMIUM</span>}<button className={'favorite-btn '+(progress.favorites.includes(w.id)?'favorited':'')} onClick={()=>toggleFavorite(w.id)} aria-label="Favorito">{progress.favorites.includes(w.id)?'♥':'♡'}</button></div><div className="waifu-info"><span className="waifu-role">{w.role}</span><h2>{w.name}</h2><p>{w.bio}</p><blockquote>"{w.quote}"</blockquote><div className="bond-meter"><div><span>Vínculo emocional</span><b>♡ {bond[w.id]||0}/100</b></div><div className="bond-track"><i style={{width:(bond[w.id]||0)+'%'}}/></div><small>{(bond[w.id]||0)>=70?'Confía plenamente en ti ✨':(bond[w.id]||0)>=35?'Se alegra de estudiar contigo':'Estudia y responde retos para fortalecer el vínculo'}</small>{!locked&&<button className="btn ghost small-btn bond-gift" onClick={()=>{setActiveWaifu(w.id);setBond(b=>({...b,[w.id]:Math.min(100,(b[w.id]||0)+3)}));setProgress(p=>({...p,coins:Math.max(0,p.coins-2)}));playSound('tap');showToast(`${w.name}: ¡gracias por compartir este momento! +3 vínculo`)}} disabled={progress.coins<2}>☕ Compartir un momento · 2 monedas</button>}{locked&&<div className="bond-gift-locked">🔒 Vínculo bloqueado (Premium)</div>}</div><div className="waifu-actions"><button className="btn primary small-btn" onClick={()=>{if(locked){playSound('wrong');showToast('Esta mentora es Premium 👑');return;}playSound('correct');setActiveWaifu(w.id);showToast(`${w.name} será tu mentora`)}}>{chosen?'✓ Seleccionada':(locked?'🔒 Premium':'Elegir mentora')}</button><button className="btn ghost small-btn" onClick={()=>{if(locked){playSound('wrong');showToast('Necesitas Premium 👑');return;}setActiveWaifu(w.id);navigate('lesson')}}>Estudiar juntas ↗</button></div></div></article>})}</div><div className="panel waifu-note"><span>✦</span><div><b>Un equipo que crece contigo</b><p>Las mentoras son compañeras narrativas. Las funciones de progreso y estudio trabajan sin conexión externa.</p></div></div></div>}
  {page==='profile'&&<div className="page-enter profile-page"><div className="page-title-row"><div><div className="eyebrow">TU IDENTIDAD</div><h1>Mi <span className="gradient-text">perfil.</span></h1><p className="muted">Personaliza tu experiencia y revisa tu progreso.</p></div></div>
  <div className="panel" style={{padding:'15px 20px',marginBottom:'15px',display:'flex',alignItems:'center',gap:'12px',flexWrap:'wrap'}}>
    <span style={{fontSize:'20px'}}>📧</span>
    <div style={{flex:1,minWidth:'150px'}}><b style={{fontSize:'11px',display:'block'}}>Sesión activa</b><small style={{fontSize:'10px',color:'#9392a8'}}>{user.email}</small></div>
    <button className="btn ghost small-btn" onClick={handleLogout} style={{color:'#f0a5b8',borderColor:'#674052'}}>Cerrar sesión</button>
  </div>
  <div className="profile-layout"><section className="panel profile-main"><div className="profile-cover" style={{backgroundImage:`url(${MEDIA+avatarBanner.img})`,backgroundSize:'cover',backgroundPosition:'center'}}><div className="profile-avatar" style={{backgroundImage:`url(${MEDIA+avatarLook.img})`,backgroundSize:'cover',backgroundPosition:'center'}}/><div className="profile-level">{isPremium?'👑 PREMIUM':'NIVEL '+(Math.floor(progress.xp/100)+1)}</div></div><div className="profile-form"><label htmlFor="playername">Nombre de aprendiz</label><div className="name-edit"><input id="playername" value={name} maxLength={24} onChange={e=>setName(e.target.value)} placeholder="Tu nombre"/><span>{name.length}/24</span></div><p className="muted tiny">Tu nombre se guarda automáticamente.</p><div className="profile-stats"><div><b>{progress.xp}</b><small>XP TOTAL</small></div><div><b>{completed.size}</b><small>LECCIONES</small></div><div><b>{isPremium?'∞':progress.hearts}</b><small>CORAZONES</small></div></div></div></section><section className="panel settings-panel"><div className="section-heading compact"><div><div className="eyebrow">PREFERENCIAS</div><h2>Configuración</h2></div><span>⚙</span></div><div className="setting-row"><div><b>Tema claro</b><small>Cambia la apariencia general.</small></div><button className={'toggle '+(settings.theme==='light'?'on':'')} onClick={()=>setSettings(s=>({...s,theme:s.theme==='light'?'dark':'light'}))}><i/></button></div><div className="setting-row"><div><b>Reducir animaciones</b><small>Movimiento más discreto.</small></div><button className={'toggle '+(settings.reduceMotion?'on':'')} onClick={()=>setSettings(s=>({...s,reduceMotion:!s.reduceMotion}))}><i/></button></div><div className="setting-row"><div><b>Efectos de sonido</b><small>Sonidos al interactuar.</small></div><button className={'toggle '+(settings.sound?'on':'')} onClick={()=>setSettings(s=>({...s,sound:!s.sound}))}><i/></button></div><button className="btn ghost reset-btn" onClick={()=>{if(confirm('¿Reiniciar el progreso? No se puede deshacer.')){setProgress({xp:0,done:[],streak:0,lastDay:'',hearts:10,heartsAt:Date.now(),coins:0,favorites:[],answers:0,perfect:0});showToast('Progreso reiniciado')}}}>Reiniciar progreso local</button></section></div>
  <div className="panel avatar-panel"><div className="section-heading compact"><div><div className="eyebrow">PERSONALIZACIÓN</div><h2>Tu avatar</h2></div><span>✦</span></div><div className="avatar-editor"><div className="avatar-preview"><img src={MEDIA+avatarBanner.img} alt="Banner" className="avatar-banner"/><img src={MEDIA+avatarLook.img} alt="Avatar" className="avatar-base"/></div><div className="avatar-controls"><div><b>Apariencia</b><div className="avatar-options">{avatarOptions.map(a=><button key={a.id} className={'avatar-opt '+(avatar.look===a.id?'active':'')} onClick={()=>setAvatar(v=>({...v,look:a.id}))}>{a.label}</button>)}</div></div><div><b>Fondo</b><div className="avatar-options">{bannerOptions.map(b=><button key={b.id} className={'avatar-opt '+(avatar.banner===b.id?'active':'')} onClick={()=>setAvatar(v=>({...v,banner:b.id}))}>{b.label}</button>)}</div></div></div></div></div>
  <div className="panel premium-panel"><div className="section-heading compact"><div><div className="eyebrow">MEMBRESÍA</div><h2>HackLingo Premium</h2></div><span>👑</span></div>{isPremium?<div className="premium-active"><b>¡Eres Premium! 🎉</b><p>Corazones infinitos, todas las mentoras y ventajas exclusivas.</p><small>Vence: {new Date(premiumUntil).toLocaleDateString()}</small></div>:<div className="premium-offer"><p>Activa Premium y desbloquea:</p><ul><li>❤️ Corazones infinitos</li><li>👑 Akari Prime y Yuki Shadow</li><li>⚡ Sin límites de práctica</li></ul><div className="code-redeem"><input type="text" placeholder="Ingresa tu código" value={codeInput} onChange={e=>setCodeInput(e.target.value)} maxLength={20}/><button className="btn primary small-btn" onClick={redeemCode}>Canjear</button></div><small>Códigos: NOVA7, NOVA30, NOVA60, SENPAI</small></div>}</div>
  <div className="panel data-note"><span>🔒</span><div><b>Privacidad y guardado local</b><p>Tu progreso, favoritos y preferencias se guardan en el almacenamiento local. El email se guarda en Firebase.</p></div></div></div>}
  </div>
  <footer className="footer"><span>HACKLINGO <b>NOVA</b> <i>© 2026</i></span><span>Aprende con curiosidad. Practica con responsabilidad. <span className="footer-heart">♥</span></span></footer>
 </main>
 <nav className="mobile-nav">{navItems.map(([id,ic,label])=><button key={id} className={page===id?'active':''} onClick={()=>navigate(id)}><span>{ic}</span><small>{label}</small></button>)}</nav>
 {toast&&<div className="toast"><span>✦</span>{toast}</div>}
 </div>
}
export default App;
