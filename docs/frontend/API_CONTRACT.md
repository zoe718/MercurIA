# Frontend API Contract

Este documento registra lo que el frontend necesita del backend. Es una guia de coordinacion, no reemplaza la documentacion OpenAPI del backend.

## Estado actual

- Frontend: inicializado en `frontend/` con Next.js, landing en `/`, mapa Mapbox full-screen en `/map` y datos demo locales.
- Backend: inicializado en `backend/` con FastAPI, datos sinteticos JSON, OpenAPI y contrato publico camelCase.
- Fuente base: [../IDEA.md](../IDEA.md).
- Tema visual: [../FRONTEND_THEME.md](../FRONTEND_THEME.md).
- Mock actual: `frontend/src/data/demo.ts`.
- Mapbox: token publico local en `frontend/.env.local`; plantilla sin token real en `frontend/.env.example`.

## Backend local

Aviso para frontend: este backend debe correr al mismo tiempo que Next.js cuando se conecten los endpoints reales. El frontend debe usar `NEXT_PUBLIC_API_URL=http://localhost:8000` en `frontend/.env.local`.

```bash
cd backend
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --port 8000
```

OpenAPI: `http://localhost:8000/docs`.

Los endpoints con IA (`GET /api/analysis/{eventId}` y `POST /api/notifications/draft`) requieren `ANTHROPIC_API_KEY`. Sin llave devuelven `503`; el resto del backend sigue funcionando.

## Pantallas y datos esperados

| Pantalla | Datos requeridos | Endpoint esperado | Estado |
|---|---|---|---|
| Landing `/` | Metricas resumen, evento destacado y marcadores de referencia | `GET /api/events/current`, `GET /api/analysis/summary` | Backend listo |
| Mapa `/map` | Eventos con `lng/lat`, capas, heatmap, scores de sede | `GET /api/events/geojson`, `GET /api/map/layers`, `GET /api/map/heatmap`, `GET /api/map/venue-score` | Backend listo |
| Analisis de evento | Detalle, antes/despues, sectores, empleo, narrativa IA | `GET /api/events/{eventId}`, `GET /api/analysis/{eventId}` | Backend listo; requiere Anthropic para narrativa |
| Alta por documento | Resultado de extraccion y vista previa | `POST /api/events/upload` | Pendiente |
| Notificaciones | MiPyMEs elegibles, borrador IA, historial | `GET /api/notifications/pymes`, `POST /api/notifications/draft`, `GET /api/notifications/log` | Backend listo; draft requiere Anthropic |

## Shape publico de evento

`GET /api/events` devuelve una lista compatible con `EconomicEvent` de `frontend/src/data/demo.ts`:

```ts
{
  id: string;
  name: string;
  type: "deportivo" | "cultural" | "musical" | "ferial" | "gastronomico" | "religioso" | "civico" | "tecnologico";
  subtype: string;
  borough: string;
  venue: string;
  date: string;
  status: "activo" | "planificado" | "finalizado";
  coordinates: { lng: number; lat: number };
  expectedAttendance: number;
  realAttendance?: number | null;
  estimatedMdp: number;
  realMdp?: number | null;
  directJobs: number;
  indirectJobs: number;
  benefitedBusinesses: number;
  sectors: Array<{ name: string; share: number; amount: number }>;
  insight: string;
}
```

`GET /api/events/{eventId}` extiende ese shape con:

- `dateStart`
- `dateEnd`
- `venueCapacity`
- `source`
- `confidence`
- `modelVersion`
- `dataProvenance`
- `tags`
- `activatedSectors`

## Endpoints implementados

- `GET /api/health`
- `GET /api/events`
- `GET /api/events/current`
- `GET /api/events/{eventId}`
- `GET /api/events/geojson`
- `GET /api/analysis/summary`
- `GET /api/analysis/{eventId}`
- `POST /api/analysis/simulate`
- `GET /api/map/venue-score`
- `GET /api/map/heatmap`
- `GET /api/map/layers`
- `GET /api/notifications/pymes`
- `POST /api/notifications/draft`
- `GET /api/notifications/log`

## Estados de UI requeridos

- `loading`: mientras se consulta backend o mocks.
- `empty`: cuando no hay eventos, MiPyMEs o resultados para el filtro actual.
- `error`: cuando falla la consulta o el backend no esta disponible.
- `demo`: cuando los datos provienen de mocks o sinteticos.
- `success`: cuando una accion se completa, como guardar evento o enviar notificacion.

## Cambios pendientes

- Conectar el frontend al backend reemplazando los mocks locales de `frontend/src/data/demo.ts`.
- Implementar `POST /api/events/upload` para alta por documento.
- Agregar Voronoi real cuando se integre capa geoespacial avanzada.
