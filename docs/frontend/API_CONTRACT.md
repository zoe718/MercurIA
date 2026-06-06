# Frontend API Contract

Este documento registra lo que el frontend necesita del backend. Es una guia de coordinacion, no reemplaza la documentacion OpenAPI del backend.

## Estado actual

- Frontend: inicializado en `frontend/` con Next.js, landing en `/`, mapa Mapbox full-screen en `/map`, capa Voronoi local y datos demo locales como fallback. Landing y mapa ya consumen backend cuando `NEXT_PUBLIC_API_URL` esta disponible.
- Backend: inicializado en `backend/` con FastAPI, datos sinteticos JSON, OpenAPI y contrato publico camelCase.
- Fuente base: [../IDEA.md](../IDEA.md).
- Tema visual: [../FRONTEND_THEME.md](../FRONTEND_THEME.md).
- Mock actual: `frontend/src/data/demo.ts`.
- Voronoi local actual: `frontend/src/data/voronoi.ts`.
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
| Mapa `/map` | Eventos con `lng/lat`, capas, heatmap, scores de sede, Voronoi por tipo de evento | `GET /api/events`, `GET /api/events/geojson`, `GET /api/map/layers`, `GET /api/map/heatmap`, `GET /api/map/venue-score`, `GET /api/map/voronoi?event_type={type}` | Backend listo; eventos conectados con fallback local; frontend aun usa mock local para Voronoi |
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

## Shape publico de Voronoi

`GET /api/map/voronoi?event_type=festivales` devuelve:

```ts
FeatureCollection<Polygon | MultiPolygon, {
  id: string;
  name: string;
  borough: string;
  eventType: "fiestas" | "festivales" | "deportivos" | "culturales" | "turisticos" | "religioso" | "gastronomico";
  score: number;
  rank: number;
  estimatedMdp: number;
  weightFormula: string;
  topVariables: string[];
}>
```

El frontend actual genera celdas reales con Turf y las recorta al limite oficial CDMX. El backend ya expone un endpoint sintetico compatible con el mismo shape; antes de reemplazar la simulacion local por backend, validar visualmente que la geometria cumpla el nivel de precision esperado.

## Heatmap

`GET /api/map/heatmap?metric={metric}` acepta:

- `derrama`: valor en mdp reales o estimados.
- `empleo`: empleos directos + indirectos.
- `negocios`: negocios beneficiados.
- `ocupacion`: porcentaje sintetico de ocupacion hotelera por alcaldia, calibrado para demo con referencia metodologica DATATUR.

Cada punto devuelve `coordinates`, `weight`, `metric`, `value` y `borough`.

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
- `GET /api/map/voronoi`
- `GET /api/map/heatmap` con metricas `derrama`, `empleo`, `negocios`, `ocupacion`
- `GET /api/map/layers`
- `GET /api/notifications/pymes`
- `POST /api/notifications/draft`
- `GET /api/notifications/log`

## Mocks temporales

Mientras el frontend termina de conectarse por completo al backend, mantiene mocks basados en `docs/IDEA.md`.

- `metrics`: indicadores resumen para la landing.
- `events`: eventos con coordenadas `lng/lat` para Mapbox, derrama, afluencia, empleo, negocios beneficiados, sectores e insight IA simulado.
- `pymeMatches`: MiPyMEs elegibles para el panel de notificaciones.
- `cdmxBoundary`: limite oficial CDMX en `frontend/src/data/cdmx-boundary.json`, obtenido desde la capa publica `Limite de la Ciudad de Mexico`.
- `voronoiSeedSites`: 18 sitios-semilla simulados para generar celdas Voronoi dentro de CDMX.
- `voronoiEventProfiles`: formulas y variables por tipo de evento.

## Estados de UI requeridos

- `loading`: mientras se consulta backend o mocks.
- `empty`: cuando no hay eventos, MiPyMEs o resultados para el filtro actual.
- `error`: cuando falla la consulta o el backend no esta disponible.
- `demo`: cuando los datos provienen de mocks o sinteticos.
- `success`: cuando una accion se completa, como guardar evento o enviar notificacion.

## Cambios pendientes

- Completar conexion de paneles secundarios al backend y conservar `frontend/src/data/demo.ts` solo como fallback offline.
- Evaluar si `frontend/src/data/voronoi.ts` debe seguir generando geometria real con Turf o consumir `GET /api/map/voronoi?event_type={type}`.
- Implementar `POST /api/events/upload` para alta por documento.
