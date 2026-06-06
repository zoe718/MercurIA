# Frontend Components

Este registro documenta componentes planeados o creados. Debe actualizarse cuando cambie la responsabilidad, props o dependencia de un componente reutilizable.

## Estado actual

El frontend aun no esta inicializado. Los componentes listados aqui son planeados y se basan en `docs/IDEA.md`.

## Componentes planeados

| Componente | Responsabilidad | Datos/props esperadas | Estado |
|---|---|---|---|
| `AppShell` | Layout principal con navegacion y area de trabajo | Usuario/demo mode, rutas activas | Planeado |
| `TopBar` | Acciones globales, busqueda y estado demo | Titulo, acciones, estado API | Planeado |
| `Sidebar` | Navegacion entre mapa, analisis y notificaciones | Ruta activa, contadores opcionales | Planeado |
| `CDMXMap` | Render del mapa y capas geoespaciales | Eventos GeoJSON, capas activas, modo | Planeado |
| `MapFilters` | Filtros por tipo, alcaldia y fecha | Valores actuales, callbacks de cambio | Planeado |
| `MapModeSelector` | Selector Planear/Analizar/Monitorear | Modo actual, callback | Planeado |
| `EventPopup` | Resumen de evento seleccionado | Evento, CTA a analisis | Planeado |
| `VenueScoreCard` | Resultado de idoneidad de sede/zona | Score, derrama estimada, razones | Planeado |
| `DerramaChart` | Grafica de derrama estimada vs real | Series de datos y moneda | Planeado |
| `SectorBreakdown` | Impacto por giro economico | Sectores, porcentajes, montos | Planeado |
| `AIInsights` | Narrativa generada por IA | Texto, modelo, estado demo | Planeado |
| `EventUploader` | Alta por documento | Archivo, progreso, resultado extraido | Planeado |
| `PymeSelector` | Seleccion de MiPyMEs elegibles | Lista, filtros, seleccion | Planeado |
| `MessageComposer` | Borrador y edicion de mensaje | Mensaje, destinatarios, evento | Planeado |
| `NotificationLog` | Historial de notificaciones | Registros, filtros | Planeado |

## Convenciones

- Los componentes deben usar tokens de color de [../FRONTEND_THEME.md](../FRONTEND_THEME.md).
- Los componentes de datos deben exponer estados `loading`, `empty`, `error` y `demo`.
- Los componentes reutilizables deben documentarse aqui antes de crecer en complejidad.
