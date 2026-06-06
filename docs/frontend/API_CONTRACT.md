# Frontend API Contract

Este documento registra lo que el frontend necesita del backend. Es una guia de coordinacion, no reemplaza la documentacion OpenAPI del backend cuando exista.

## Estado actual

- Frontend: inicializado en `frontend/` con Next.js y datos demo locales.
- Backend: pendiente de inicializar.
- Fuente base: [../IDEA.md](../IDEA.md).
- Tema visual: [../FRONTEND_THEME.md](../FRONTEND_THEME.md).
- Mock actual: `frontend/src/data/demo.ts`.

## Pantallas y datos esperados

| Pantalla | Datos requeridos | Endpoint esperado | Estado |
|---|---|---|---|
| Consola `/` | Metricas resumen, eventos destacados, alertas | `GET /api/events/current`, `GET /api/analysis/summary` | Mock local |
| Mapa CDMX | Eventos GeoJSON, capas, heatmap, Voronoi | `GET /api/events/geojson`, `GET /api/map/layers`, `GET /api/map/heatmap`, `GET /api/map/voronoi` | Mock local |
| Analisis de evento | Detalle, antes/despues, sectores, empleo, narrativa IA | `GET /api/events/{id}`, `GET /api/analysis/{event_id}` | Mock local |
| Alta por documento | Resultado de extraccion y vista previa | `POST /api/events/upload` | Pendiente |
| Notificaciones | MiPyMEs elegibles, borrador IA, historial | `GET /api/notifications/pymes`, `POST /api/notifications/draft`, `GET /api/notifications/log` | Mock local |

## Estados de UI requeridos

- `loading`: mientras se consulta backend o mocks.
- `empty`: cuando no hay eventos, MiPyMEs o resultados para el filtro actual.
- `error`: cuando falla la consulta o el backend no esta disponible.
- `demo`: cuando los datos provienen de mocks o sinteticos.
- `success`: cuando una accion se completa, como guardar evento o enviar notificacion.

## Mocks temporales

Mientras el backend no exista, el frontend usa datos sinteticos locales basados en `docs/IDEA.md`. Cada mock debe declarar que endpoint reemplaza y debe eliminarse o aislarse cuando el endpoint real este disponible.

El mock actual incluye:

- `metrics`: tarjetas resumen para la consola.
- `events`: eventos con ubicacion porcentual para el mapa sintetico, derrama, afluencia, empleo, negocios beneficiados, sectores e insight IA simulado.
- `venueScores`: zonas sugeridas para modo Planear.
- `pymeMatches`: MiPyMEs elegibles para el panel de notificaciones.

## Cambios pendientes

- Definir payload final de `GET /api/analysis/{event_id}`.
- Definir estructura de GeoJSON para eventos y capas.
- Definir shape de respuesta para notificaciones y borradores generados por IA.
