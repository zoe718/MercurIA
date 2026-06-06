# Frontend Changelog

Bitacora cronologica de cambios relacionados con frontend.

## 2026-06-06

- Se crea el frontend inicial en `frontend/` con Next.js App Router, React, TypeScript y CSS variables.
- Se implementa la consola operativa `/` con mapa sintetico de CDMX, modos `Monitorear`, `Analizar` y `Planear`, metricas, sectores, notificaciones y alta demo por documento.
- Se agregan datos sinteticos locales en `frontend/src/data/demo.ts` para avanzar sin backend.
- Se agregan scripts `dev`, `build`, `start` y `typecheck`.
- Se agrega `.gitignore` para dependencias, builds y variables de entorno.
- Se configura viewport responsive y se desactiva el indicador flotante de desarrollo de Next.js para demos limpias.
- Se valida `npm run typecheck`, `npm run build` y `npm audit --audit-level=moderate`.
- Se crea la estructura de documentacion viva en `docs/frontend/`.
- Se agrega contrato inicial de API esperada por pantalla.
- Se documentan flujos base de consola principal, mapa, analisis, alta por documento y notificaciones.
- Se registra inventario inicial de componentes planeados.
- Se registra la decision de mantener documentacion frontend alineada con backend.
- Se referencia la paleta existente en `docs/FRONTEND_THEME.md` como fuente visual inicial.
