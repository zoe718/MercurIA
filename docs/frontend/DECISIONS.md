# Frontend Decisions

Este archivo registra decisiones tecnicas y de diseno en formato ADR corto.

## 2026-06-06 - Documentacion viva del frontend

**Decision:** crear `docs/frontend/` como contrato vivo entre frontend y backend.

**Motivo:** el frontend y backend se trabajaran en paralelo, por lo que los endpoints esperados, flujos, componentes y decisiones deben quedar documentados en un lugar estable.

**Impacto:** cada cambio frontend debe actualizar al menos un documento de esta carpeta y resumirse en `CHANGELOG.md`.

## 2026-06-06 - Tema visual inicial

**Decision:** usar [../FRONTEND_THEME.md](../FRONTEND_THEME.md) como fuente de verdad de paleta hasta que exista configuracion Tailwind/CSS.

**Motivo:** ya existe una paleta aprobada para MercurIA y debe mantenerse consistente desde el inicio del frontend.

**Impacto:** cualquier implementacion visual futura debe mapear los tokens `background`, `primary`, `secondary`, `surface`, `text`, `accent`, `success`, `warning` y `danger`.

## 2026-06-06 - Frontend inicial con consola operativa

**Decision:** crear el frontend en `frontend/` con Next.js App Router, React, TypeScript, CSS variables y `lucide-react`.

**Motivo:** el proyecto necesita una primera pantalla usable mientras backend avanza en paralelo. La raiz `/` abre una consola operativa en vez de una landing de marketing.

**Impacto:** los datos viven temporalmente en `frontend/src/data/demo.ts`; cuando el backend este listo, el frontend debe reemplazar esos mocks por un cliente API alineado con `API_CONTRACT.md`.

**Estado:** reemplazada por la decision "Rediseño a landing y mapa full-screen".

## 2026-06-06 - Rediseño a landing y mapa full-screen

**Decision:** reemplazar la consola principal por landing en `/` y mapa operativo full-screen en `/map` usando Mapbox GL JS.

**Motivo:** la experiencia debe sentirse como producto geoespacial real: entrada clara por landing, mapa ocupando toda la pantalla y opciones flotantes dentro del mapa.

**Impacto:** `frontend/src/data/demo.ts` usa coordenadas `lng/lat`; `frontend/src/lib/mapbox.ts` centraliza centro y limites CDMX; los controles nativos de Mapbox se muestran sobre `/map`. El token se carga desde `NEXT_PUBLIC_MAPBOX_TOKEN` en `.env.local`.

## 2026-06-06 - Voronoi por tipo de evento

**Decision:** generar una capa Voronoi en Mapbox desde 18 sitios-semilla simulados y recalcular score/ranking por tipo de evento.

**Motivo:** la planeación necesita visualizar zonas de influencia delimitadas a CDMX y ponderadas por variables distintas para fiestas, festivales, deportivos, culturales, turísticos, religioso y gastronómico.

**Impacto:** `frontend/src/data/voronoi.ts` contiene la simulación actual con Turf; cuando backend exista, debe reemplazarse por `GET /api/map/voronoi?event_type={type}` respetando las propiedades documentadas en `VORONOI.md`.

## 2026-06-06 - Límite oficial CDMX para Voronoi

**Decision:** sustituir el polígono aproximado por el GeoJSON oficial `Límite de la Ciudad de México` y usarlo para el `bbox` e intersección de cada celda Voronoi.

**Motivo:** la capa debe tener exactamente la forma de CDMX y nunca renderizar celdas fuera de la frontera marcada.

**Impacto:** `frontend/src/data/cdmx-boundary.json` queda versionado como fuente local; el backend debe devolver `Polygon | MultiPolygon` ya recortado a esa misma frontera cuando reemplace el mock.

## 2026-06-06 - Override de PostCSS

**Decision:** agregar `overrides.postcss` en `frontend/package.json`.

**Motivo:** `npm audit` reporto una vulnerabilidad moderada transitiva en la version de PostCSS resuelta por Next.js.

**Impacto:** `npm install` resuelve PostCSS a una version parcheada y `npm audit --audit-level=moderate` queda limpio.

## 2026-06-06 - Demo responsive limpia

**Decision:** declarar `viewport` en `frontend/src/app/layout.tsx` y desactivar `devIndicators` en `frontend/next.config.mjs`.

**Motivo:** el frontend debe probarse bien en movil y el indicador flotante de Next.js tapaba controles durante la demo local.

**Impacto:** los breakpoints moviles se aplican correctamente y la vista local en `npm run dev` queda libre de overlays de desarrollo.

## 2026-06-06 - Eventos como edificios 3D resaltados

**Decision:** reemplazar los marcadores circulares de eventos en `/map` por una capa `fill-extrusion` que reutiliza geometrías de edificios de Mapbox cercanas a cada coordenada de evento.

**Motivo:** la señal visual del evento debe sentirse integrada al mapa urbano: el edificio o recinto se eleva y colorea sin perder la forma que Mapbox le asigna.

**Impacto:** `FullScreenMap` agrega una capa base de edificios 3D y una fuente local `event-building-highlights` construida con `queryRenderedFeatures` sobre la capa `building`. El backend no necesita entregar huellas de edificios por ahora, pero si más adelante lo hace debe respetar geometrías reales de recinto/edificio.

## 2026-06-06 - Panel por modo operativo

**Decision:** separar el contenido del panel derecho por modo: `Analizar` muestra derrama del evento seleccionado, `Monitorear` muestra ranking territorial y `Planear` muestra formulario de simulación/carga.

**Motivo:** cada modo tiene una tarea distinta y el panel anterior mezclaba evento, ranking y notificaciones sin jerarquía clara.

**Impacto:** el frontend sigue usando los mismos mocks actuales; no se agregan datos sintéticos nuevos. El ranking se deriva de las celdas Voronoi existentes y el color en `Monitorear` se basa en `estimatedMdp` del giro seleccionado.

## 2026-06-06 - Creación simulada de eventos

**Decision:** permitir que el formulario de `Planear` cree eventos simulados en estado local del frontend.

**Motivo:** la demo debe mostrar que capturar un evento cambia inmediatamente la derrama económica del diagnóstico y el análisis, aunque el backend todavía no exista.

**Impacto:** los eventos creados se agregan al carril inferior, se reflejan en edificios 3D resaltados, se seleccionan automáticamente y actualizan el diagnóstico agregado de `Analizar`. La simulación calcula derrama, empleos, MiPyMEs y sectores desde presupuesto, afluencia, giro y score Voronoi.
