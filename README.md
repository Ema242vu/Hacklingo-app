# HackLingo Nova

Reconstrucción nueva de HackLingo con React + Vite. El código de la aplicación anterior no se reutiliza: se conservan únicamente las imágenes y vídeos originales seleccionados del ZIP recibido.

## Incluye
- 4 rutas originales: Python Mastery, Hacking Ético, Termux Pro y Kali Linux.
- 80 lecciones (20 por ruta), concepto, ejemplo, consejo y checkpoint.
- Novela visual con decisiones, expresiones de personajes y fondos de vídeo originales.
- Galería de cuatro mentoras, selección y favoritos.
- XP, monedas, corazones, racha, misión diaria, progreso y flashcards.
- Tema claro/oscuro, preferencia para reducir movimiento y diseño responsive.
- Persistencia local con `localStorage`, sin requerir Firebase ni claves de API.
- Avisos para practicar ciberseguridad solo en entornos propios o autorizados.

## Requisitos
Node.js 18 o superior.

## Ejecutar en desarrollo
```bash
npm install
npm run dev
```
Vite mostrará la dirección local que puedes abrir en el navegador.

## Crear la versión de producción
```bash
npm run build
npm run preview
```
La carpeta final se genera en `dist/`.

## Nota sobre pruebas
El código JSX se comprobó sintácticamente. No se pudo completar `npm install` ni ejecutar el build de Vite en el entorno de creación, así que debes ejecutar `npm install` y `npm run build` en un entorno con acceso a npm antes de publicar. Ningún proyecto puede garantizar cero errores en todos los dispositivos sin pruebas de ejecución.
