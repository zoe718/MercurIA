# Frontend Components

Este registro documenta componentes planeados o creados. Debe actualizarse cuando cambie la responsabilidad, props o dependencia de un componente reutilizable.

## Estado actual

El frontend esta inicializado en `frontend/` con landing en `/` y mapa Mapbox full-screen en `/map`. Los componentes usan datos de `frontend/src/data/demo.ts` y configuracion de mapa en `frontend/src/lib/mapbox.ts`.

## Componentes planeados

| Componente | Responsabilidad | Datos/props esperadas | Estado |
|---|---|---|---|
| `LandingPage` | Landing con CTA al mapa e indicadores compactos | Eventos y metricas demo | Implementado |
| `LandingPreviewMap` | Mapa Mapbox no interactivo como escena visual de `/` | Token Mapbox, eventos demo | Implementado |
| `FullScreenMap` | Experiencia Mapbox full-screen con modos, filtros, edificios 3D resaltados, símbolos por tipo, eventos simulados y panel flotante | Eventos, scores y celdas Voronoi demo | Implementado |
| `EventSheet` | Contenedor del panel derecho que delega contenido según modo | Evento, modo, celda seleccionada y ranking | Implementado |
| `AnalysisPanel` | Diagnóstico agregado, derrama, afluencia, MiPyMEs, variación y sectores del evento seleccionado | Evento seleccionado y lista local de eventos | Implementado |
| `MonitoringRankingPanel` | Lista los 15 lugares mejor rankeados por giro y derrama estimada | Celdas Voronoi rankeadas | Implementado |
| `PlanningPanel` | Formulario de planeación con documento, alcaldía, giro, presupuesto, afluencia y fecha | Celdas Voronoi y tipo activo | Implementado |
| `VoronoiBlock` | Detalle de zona candidata Voronoi seleccionada | Score de idoneidad, fórmula, ranking y variables | Implementado |
| `VoronoiLegend` | Leyenda compacta de idoneidad por tipo de evento | Color y etiqueta del perfil activo | Implementado |
| `AnalysisBlock` | Narrativa y sectores para modo Analizar | Evento seleccionado | Implementado |

## Convenciones

- Los componentes deben usar tokens de color de [../FRONTEND_THEME.md](../FRONTEND_THEME.md).
- Los componentes de datos deben exponer estados `loading`, `empty`, `error` y `demo`.
- Los componentes reutilizables deben documentarse aqui antes de crecer en complejidad.
- Los controles principales del mapa deben vivir sobre el mapa, no en una pantalla de dashboard separada.
- La capa Voronoi debe renderizarse como source/layers de Mapbox, recortada al límite oficial CDMX y no como SVG externo.
- Los eventos en el mapa deben señalarse resaltando edificios o recintos 3D de Mapbox cuando exista geometría cercana, evitando pines circulares sobre la ciudad.
- Los eventos deben tener un símbolo diferenciable por tipo sobre su ubicación para que puedan leerse desde zoom lejano.
- En `Monitorear`, el color del Voronoi debe comunicar derrama estimada (`estimatedMdp`) para el giro seleccionado.
- En `Planear`, crear un evento debe actualizar el estado local compartido para que `Analizar`, el carril inferior y edificios 3D reflejen el cambio sin backend.
