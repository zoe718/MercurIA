# Frontend Changelog

Bitacora cronologica de cambios relacionados con frontend.

## 2026-06-06

- Se agrega capa Voronoi sobre Mapbox, recortada a un polígono aproximado de CDMX.
- Se simulan 18 sitios-semilla y scores por tipo de evento.
- Se agrega selector `Tipo de evento para Voronoi` con perfiles `fiestas`, `festivales`, `deportivos`, `culturales`, `turisticos`, `religioso` y `gastronomico`.
- Se agrega panel de celda con score, ranking, fórmula y variables principales.
- Se documenta el contrato Voronoi en `docs/frontend/VORONOI.md`.
- Se rediseña el frontend: `/` ahora es landing page y `/map` es mapa Mapbox full-screen.
- Se integra `mapbox-gl` con token publico de demo y configuracion en `frontend/src/lib/mapbox.ts`.
- Se reemplaza el mapa sintetico SVG por Mapbox GL JS con marcadores, popups, controles nativos, geolocate, fullscreen, escala y navegacion.
- Se mueven las opciones del mapa a controles flotantes sobre el mapa.
- Se actualizan eventos y scores para usar coordenadas `lng/lat`.
- Se crea el frontend inicial en `frontend/` con Next.js App Router, React, TypeScript y CSS variables.
- Se implemento una primera consola operativa, posteriormente reemplazada por landing + mapa full-screen.
- Se agregan datos sinteticos locales en `frontend/src/data/demo.ts` para avanzar sin backend.
- Se agregan scripts `dev`, `build`, `start` y `typecheck`.
- Se agrega `.gitignore` para dependencias, builds y variables de entorno.
- Se configura viewport responsive y se desactiva el indicador flotante de desarrollo de Next.js para demos limpias.
- Se valida `npm run typecheck`, `npm run build` y `npm audit --audit-level=moderate`.
- Se crea la estructura de documentacion viva en `docs/frontend/`.
- Se agrega contrato inicial de API esperada por pantalla.
- Se documentan flujos base de landing, mapa, analisis, alta por documento y notificaciones.
- Se registra inventario inicial de componentes planeados.
- Se registra la decision de mantener documentacion frontend alineada con backend.
- Se referencia la paleta existente en `docs/FRONTEND_THEME.md` como fuente visual inicial.
