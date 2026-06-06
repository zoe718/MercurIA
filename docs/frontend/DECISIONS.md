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

## 2026-06-06 - Override de PostCSS

**Decision:** agregar `overrides.postcss` en `frontend/package.json`.

**Motivo:** `npm audit` reporto una vulnerabilidad moderada transitiva en la version de PostCSS resuelta por Next.js.

**Impacto:** `npm install` resuelve PostCSS a una version parcheada y `npm audit --audit-level=moderate` queda limpio.

## 2026-06-06 - Demo responsive limpia

**Decision:** declarar `viewport` en `frontend/src/app/layout.tsx` y desactivar `devIndicators` en `frontend/next.config.mjs`.

**Motivo:** el frontend debe probarse bien en movil y el indicador flotante de Next.js tapaba controles durante la demo local.

**Impacto:** los breakpoints moviles se aplican correctamente y la vista local en `npm run dev` queda libre de overlays de desarrollo.
