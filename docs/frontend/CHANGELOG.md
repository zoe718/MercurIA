# Frontend Changelog

Bitacora cronologica de cambios relacionados con frontend.

## 2026-06-06

- Se agrega una capa de símbolos por tipo de evento sobre los edificios/recintos resaltados para ubicar eventos desde lejos.
- Se habilita la creación local de eventos simulados desde `Planear`.
- Los eventos simulados actualizan carril inferior, edificios 3D, diagnóstico agregado y análisis de derrama sin backend.
- Se calcula derrama, empleos, MiPyMEs y sectores simulados desde presupuesto, afluencia, giro y score Voronoi.
- Se escala altura y contorno de edificios 3D resaltados para que sean visibles desde zoom lejano sin perder la geometría de Mapbox.
- Se reestructura el panel derecho por modo: `Analizar` muestra derrama del evento, `Monitorear` muestra ranking de 15 lugares y `Planear` muestra formulario de simulación/carga.
- Se pinta el Voronoi en `Monitorear` por derrama estimada (`estimatedMdp`) del giro seleccionado.
- Se reemplazan los marcadores circulares de eventos en `/map` por edificios 3D resaltados desde geometrías de Mapbox.
- Se agrega una capa base de edificios 3D y una fuente local `event-building-highlights` para elevar/colorizar recintos cercanos a cada evento.
- Se reemplaza el polígono aproximado por el límite oficial CDMX en `frontend/src/data/cdmx-boundary.json`.
- Se recortan las celdas Voronoi estrictamente contra la frontera oficial para que el diagrama no salga de CDMX.
- Se actualiza el lenguaje del mapa a zonas candidatas y score de idoneidad por tipo de evento.
- Se agrega capa Voronoi sobre Mapbox, recortada a CDMX.
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
