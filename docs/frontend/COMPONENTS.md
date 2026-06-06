# Frontend Components

Este registro documenta componentes planeados o creados. Debe actualizarse cuando cambie la responsabilidad, props o dependencia de un componente reutilizable.

## Estado actual

El frontend esta inicializado en `frontend/` con landing en `/` y mapa Mapbox full-screen en `/map`. Los componentes usan datos de `frontend/src/data/demo.ts` y configuracion de mapa en `frontend/src/lib/mapbox.ts`.

## Componentes planeados

| Componente | Responsabilidad | Datos/props esperadas | Estado |
|---|---|---|---|
| `LandingPage` | Landing con CTA al mapa e indicadores compactos | Eventos y metricas demo | Implementado |
| `LandingPreviewMap` | Mapa Mapbox no interactivo como escena visual de `/` | Token Mapbox, eventos demo | Implementado |
| `FullScreenMap` | Experiencia Mapbox full-screen con modos, filtros, marcadores y panel flotante | Eventos, scores y MiPyMEs demo | Implementado |
| `EventSheet` | Panel flotante del evento seleccionado | Evento seleccionado y modo actual | Implementado |
| `VoronoiBlock` | Detalle de zona candidata Voronoi seleccionada | Score de idoneidad, fórmula, ranking y variables | Implementado |
| `VoronoiLegend` | Leyenda compacta de idoneidad por tipo de evento | Color y etiqueta del perfil activo | Implementado |
| `PlanningBlock` | Scores de zonas para modo Planear | `venueScores` | Implementado |
| `AnalysisBlock` | Narrativa y sectores para modo Analizar | Evento seleccionado | Implementado |
| `MonitoringBlock` | MiPyMEs listas para modo Monitorear | `pymeMatches` | Implementado |

## Convenciones

- Los componentes deben usar tokens de color de [../FRONTEND_THEME.md](../FRONTEND_THEME.md).
- Los componentes de datos deben exponer estados `loading`, `empty`, `error` y `demo`.
- Los componentes reutilizables deben documentarse aqui antes de crecer en complejidad.
- Los controles principales del mapa deben vivir sobre el mapa, no en una pantalla de dashboard separada.
- La capa Voronoi debe renderizarse como source/layers de Mapbox, recortada al límite oficial CDMX y no como SVG externo.
