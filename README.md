# HackLingo

Aplicación React + Vite para aprender programación y ciberseguridad, con Firebase y Capacitor para Android.

## Ejecutar en desarrollo

```bash
npm ci
npm run dev
```

## Crear la versión web

```bash
npm ci
npm run build
npm run preview
```

## Sincronizar y compilar Android

```bash
npm ci
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```

## Cambios de esta revisión

- Evita el guardado repetitivo del progreso provocado por actualizar el contexto después de cada escritura.
- Maneja mejor la carga/cambio de sesión y evita aplicar progreso si el componente ya se desmontó.
- Bloquea respuestas duplicadas rápidas en los ejercicios y evita mostrar dos grupos de respuestas en preguntas de verdadero/falso.
- Al repetir una lección completada no vuelve a contarla para desbloquear capítulos.
- Unifica el acceso VIP para las funciones y pantallas que dependen de él.
- Reduce y valida las fotos de perfil antes de guardarlas para disminuir problemas de cuota y tamaño del documento.
- Mejora adaptación móvil, foco de teclado, estados deshabilitados y respeto por la preferencia de movimiento reducido.
- Permite ampliar la página en móvil y actualiza los metadatos básicos.

## Antes de publicar

La validación de códigos Premium y la lista VIP todavía están en el cliente. Para una versión pública, valida los códigos y permisos en el backend y aplica reglas estrictas de Firebase/Firestore. AdMob está configurado con identificador de prueba; sustituye la configuración de anuncios de prueba por la configuración aprobada para producción.
