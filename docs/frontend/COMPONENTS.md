# Frontend Components

Este registro documenta componentes planeados o creados. Debe actualizarse cuando cambie la responsabilidad, props o dependencia de un componente reutilizable.

## Estado actual

El frontend esta inicializado en `frontend/` con una consola operativa en `/`. Los componentes viven por ahora en `frontend/src/components/MercuriaDashboard.tsx` y usan datos de `frontend/src/data/demo.ts`.

## Componentes planeados

| Componente | Responsabilidad | Datos/props esperadas | Estado |
|---|---|---|---|
| `MercuriaDashboard` | Consola principal con estado de modo, filtro y evento seleccionado | Datos demo locales | Implementado |
| `MetricCard` | Tarjetas resumen de derrama, eventos, MiPyMEs y alertas | `label`, `value`, `trend`, `tone` | Implementado |
| `CDMXMap` | Mapa sintetico con zonas, scores y pines seleccionables | Eventos, modo, evento seleccionado, callback | Implementado |
| `EventSummary` | Detalle economico del evento seleccionado | Evento seleccionado | Implementado |
| `ModePanel` | Contenido contextual para Monitorear, Analizar o Planear | Modo actual y evento | Implementado |
| `DerramaChart` | Comparacion estimada vs real/proyeccion | Evento seleccionado | Implementado |
| `SectorBreakdown` | Desglose por giro economico | Sectores del evento | Implementado |
| `NotificationPanel` | Lista de MiPyMEs relacionadas y estado de mensaje | Mocks de MiPyMEs | Implementado |
| `EventUploader` | Superficie visual de alta por documento | Sin backend todavia | Implementado demo |
| `AppShell` | Layout principal con navegacion y area de trabajo | Usuario/demo mode, rutas activas | Integrado en `MercuriaDashboard` |
| `TopBar` | Acciones globales, busqueda y estado demo | Titulo, busqueda, estado demo | Integrado en `MercuriaDashboard` |
| `MapFilters` | Filtro por tipo de evento | Valor actual y callback | Integrado en `MercuriaDashboard` |
| `MapModeSelector` | Selector Planear/Analizar/Monitorear | Modo actual y callback | Integrado en `MercuriaDashboard` |

## Convenciones

- Los componentes deben usar tokens de color de [../FRONTEND_THEME.md](../FRONTEND_THEME.md).
- Los componentes de datos deben exponer estados `loading`, `empty`, `error` y `demo`.
- Los componentes reutilizables deben documentarse aqui antes de crecer en complejidad.
