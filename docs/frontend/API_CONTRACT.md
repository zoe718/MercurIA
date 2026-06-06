# Frontend API Contract

Este documento registra lo que el frontend necesita del backend. Es una guia de coordinacion, no reemplaza la documentacion OpenAPI del backend cuando exista.

## Estado actual

- Frontend: pendiente de inicializar.
- Backend: pendiente de inicializar.
- Fuente base: [../IDEA.md](../IDEA.md).
- Tema visual: [../FRONTEND_THEME.md](../FRONTEND_THEME.md).

## Pantallas y datos esperados

| Pantalla | Datos requeridos | Endpoint esperado | Estado |
|---|---|---|---|
| Landing | Metricas resumen, eventos destacados | `GET /api/events/current`, `GET /api/analysis/summary` | Pendiente |
| Mapa CDMX | Eventos GeoJSON, capas, heatmap, Voronoi | `GET /api/events/geojson`, `GET /api/map/layers`, `GET /api/map/heatmap`, `GET /api/map/voronoi` | Pendiente |
| Analisis de evento | Detalle, antes/despues, sectores, empleo, narrativa IA | `GET /api/events/{id}`, `GET /api/analysis/{event_id}` | Pendiente |
| Alta por documento | Resultado de extraccion y vista previa | `POST /api/events/upload` | Pendiente |
| Notificaciones | MiPyMEs elegibles, borrador IA, historial | `GET /api/notifications/pymes`, `POST /api/notifications/draft`, `GET /api/notifications/log` | Pendiente |

## Estados de UI requeridos

- `loading`: mientras se consulta backend o mocks.
- `empty`: cuando no hay eventos, MiPyMEs o resultados para el filtro actual.
- `error`: cuando falla la consulta o el backend no esta disponible.
- `demo`: cuando los datos provienen de mocks o sinteticos.
- `success`: cuando una accion se completa, como guardar evento o enviar notificacion.

## Mocks temporales

Mientras el backend no exista, el frontend puede usar datos sinteticos locales basados en `docs/IDEA.md`. Cada mock debe declarar que endpoint reemplaza y debe eliminarse o aislarse cuando el endpoint real este disponible.

## Cambios pendientes

- Definir payload final de `GET /api/analysis/{event_id}`.
- Definir estructura de GeoJSON para eventos y capas.
- Definir shape de respuesta para notificaciones y borradores generados por IA.
