<h1>MercurIA</h1>
<p>Plataforma de inteligencia económica para analizar, planear y monitorear eventos en la Ciudad de México con enfoque en derrama económica, MiPyMEs y toma de decisión pública.</p>

<p>
  <img src="https://img.shields.io/badge/Framework-Next.js_14-000000?style=for-the-badge&amp;logo=nextdotjs&amp;logoColor=white&amp;labelColor=000000">
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&amp;logo=react&amp;logoColor=0B0F1A&amp;labelColor=61DAFB">
  <img src="https://img.shields.io/badge/Lenguaje-TypeScript-3178C6?style=for-the-badge&amp;logo=typescript&amp;logoColor=white&amp;labelColor=3178C6">
  <img src="https://img.shields.io/badge/Estilos-Tailwind_CSS-06B6D4?style=for-the-badge&amp;logo=tailwindcss&amp;logoColor=white&amp;labelColor=06B6D4">
</p>

<p>
  <img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&amp;logo=fastapi&amp;logoColor=white&amp;labelColor=009688">
  <img src="https://img.shields.io/badge/Lenguaje-Python-3776AB?style=for-the-badge&amp;logo=python&amp;logoColor=white&amp;labelColor=3776AB">
  <img src="https://img.shields.io/badge/Mapas-Mapbox_GL-4264FB?style=for-the-badge&amp;logo=mapbox&amp;logoColor=white&amp;labelColor=4264FB">
  <img src="https://img.shields.io/badge/IA-Anthropic_Claude-D4A017?style=for-the-badge&amp;logo=anthropic&amp;logoColor=white&amp;labelColor=191919">
  <img src="https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&amp;logo=vercel&amp;logoColor=white&amp;labelColor=000000">
</p>

## Tabla de contenido

1. <a>Descripcion del proyecto</a>
1. <a>Tecnologias usadas</a>
1. <a>Requisitos previos</a>
1. <a>Instalacion</a>
1. <a>Variables de entorno</a>
1. <a>Scripts disponibles</a>
1. <a>Como correr en local</a>
1. <a>Como generar build de produccion</a>
1. <a>Como hacer deploy</a>
1. <a>Estructura del proyecto</a>
1. <a>Integracion entre frontend y backend</a>
1. <a>Solucion de problemas comunes</a>
1. <a>Contacto del proyecto</a>

## Descripcion del proyecto

MercurIA centraliza la inteligencia económica de eventos urbanos para:

- **Planear** dónde realizar un evento usando análisis geoespacial y mapas de Voronoi coloreados por score de idoneidad.
- **Analizar** el impacto económico antes y después de cualquier evento (derrama estimada vs. real).
- **Monitorear** todos los eventos activos en la CDMX en tiempo real con capas de calor de derrama.
- **Notificar** a MiPyMEs por zona y giro económico sobre oportunidades vinculadas a eventos próximos.
- **Proyectar** derrama futura usando modelos históricos y variables contextuales generadas con Claude.

El objetivo es ofrecer a SEDECO y a organizadores de eventos una interfaz única para análisis operativo y toma de decisiones económicas en tiempo real.

## Tecnologias usadas

|Categoria         |Stack                                      |
|------------------|-------------------------------------------|
|Framework frontend|Next.js 14 (App Router)                    |
|Libreria UI       |React                                      |
|Tipado            |TypeScript                                 |
|Estilos           |Tailwind CSS                               |
|Mapas             |Mapbox GL JS                               |
|Graficas          |Recharts                                   |
|Estado global     |Zustand                                    |
|HTTP / Cache      |Axios + React Query                        |
|Animaciones       |Framer Motion                              |
|Framework backend |FastAPI (Python)                           |
|Base de datos     |PostgreSQL + PostGIS                       |
|Cache             |Redis                                      |
|ORM               |SQLAlchemy + GeoAlchemy2                   |
|Geoespacial       |scipy, shapely, geopandas                  |
|IA                |Anthropic Claude (claude-sonnet-4-20250514)|
|Servidor ASGI     |Uvicorn                                    |
|Gestor de paquetes|npm (frontend) / pip (backend)             |

## Requisitos previos

- Node.js &gt;= 18 (recomendado LTS actual).
- npm &gt;= 9.
- Python &gt;= 3.10.
- Git.
- Token de Mapbox (requerido para el mapa).
- API Key de Anthropic (requerida para funciones de IA).
- Backend disponible en `http://localhost:8000` para endpoints REST.

## Instalacion

```bash
git clone https://github.com/zoe718/MercurIA.git
cd MercurIA
```

### Frontend

```bash
cd frontend
npm install
```

### Backend

```bash
cd backend
python -m venv .venv

# En Windows:
.\.venv\Scripts\Activate.ps1

# En macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
```

## Variables de entorno (`.env`)

### Frontend — `frontend/.env.local`

Copia la plantilla:

```bash
cp frontend/.env.example frontend/.env.local
```

|Variable                  |Requerida|Ejemplo                |Descripcion                                |
|--------------------------|---------|-----------------------|-------------------------------------------|
|`NEXT_PUBLIC_MAPBOX_TOKEN`|Si       |`pk.xxxxxxxxx`         |Token para el mapa principal de CDMX.      |
|`NEXT_PUBLIC_API_URL`     |Si       |`http://localhost:8000`|URL base del backend FastAPI.              |
|`NEXT_PUBLIC_DEMO_MODE`   |No       |`true`                 |Muestra banner de datos sintéticos en demo.|

### Backend — `backend/.env`

Copia la plantilla:

```bash
cp backend/.env.example backend/.env
```

|Variable              |Requerida|Ejemplo                                         |Descripcion                                  |
|----------------------|---------|------------------------------------------------|---------------------------------------------|
|`ANTHROPIC_API_KEY`   |Si       |`sk-ant-xxxxxxxxx`                              |API key de Anthropic para funciones de IA.   |
|`MAPBOX_TOKEN`        |Si       |`pk.xxxxxxxxx`                                  |Token de Mapbox para geoespacial en backend. |
|`DATABASE_URL`        |No       |`postgresql://user:pass@localhost:5432/mercuria`|Conexion a PostgreSQL + PostGIS.             |
|`REDIS_URL`           |No       |`redis://localhost:6379/0`                      |Conexion a Redis para cache de Voronoi.      |
|`USE_SYNTHETIC_DATA`  |No       |`true`                                          |`true` para demo sin APIs externas.          |
|`USE_INEGI_API`       |No       |`false`                                         |Activa cliente INEGI DENUE.                  |
|`USE_DATATUR_API`     |No       |`false`                                         |Activa cliente DATATUR de hotelería.         |
|`EMAIL_API_KEY`       |No       |`SG.xxxxxxxxx`                                  |SendGrid o Resend para notificaciones reales.|
|`NOTIFICATION_ENABLED`|No       |`false`                                         |`false` en demo → solo log a consola.        |

Valores de referencia:

- Frontend local: `http://localhost:3000`
- Backend local: `http://localhost:8000`
- Documentacion OpenAPI: `http://localhost:8000/docs`

## Scripts disponibles

### Frontend

|Script |Comando        |Descripcion                         |
|-------|---------------|------------------------------------|
|`dev`  |`npm run dev`  |Inicia entorno de desarrollo.       |
|`build`|`npm run build`|Genera build de produccion.         |
|`start`|`npm run start`|Sirve la build de produccion.       |
|`lint` |`npm run lint` |Ejecuta analisis estatico de codigo.|

### Backend

|Script|Comando                                    |Descripcion                            |
|------|-------------------------------------------|---------------------------------------|
|`dev` |`uvicorn app.main:app --reload --port 8000`|Inicia servidor con recarga automatica.|
|`prod`|`uvicorn app.main:app --port 8000`         |Inicia servidor sin recarga.           |

## Como correr en local

### Opcion 1 — Sin Docker (desarrollo)

**Terminal 1 — Backend:**

```bash
cd backend
source .venv/bin/activate   # o .\.venv\Scripts\Activate.ps1 en Windows
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 — Frontend:**

```bash
cd frontend
npm run dev
```

Abre en el navegador:

```
http://localhost:3000       ← App principal
http://localhost:8000/docs  ← Documentacion OpenAPI del backend
```

### Opcion 2 — Con Docker Compose

```bash
docker-compose up --build
```

Esto levanta el frontend, el backend, PostgreSQL + PostGIS y Redis en un solo comando.

## Como generar build de produccion

### Frontend

```bash
cd frontend
npm run build
npm run start
```

Para cambiar el puerto:

```bash
PORT=4000 npm run start
```

### Backend

```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## Como hacer deploy

### Opcion recomendada — Vercel (frontend) + servidor propio (backend)

**Frontend en Vercel:**

```bash
npm install -g vercel
cd frontend
vercel
```

Configura en la plataforma:

- Root Directory: `frontend/`
- Build Command: `npm run build`
- Output: gestionado por Next.js
- Variables de entorno: las mismas de `frontend/.env.local`

**Backend en servidor propio:**

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Opcion alternativa — Docker completo

```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

## Estructura del proyecto

```text
MercurIA/
├── frontend/
│   ├── public/
│   │   └── assets/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx               ← Landing page
│   │   │   ├── map/
│   │   │   │   └── page.tsx           ← Mapa principal CDMX
│   │   │   ├── analysis/
│   │   │   │   └── [eventId]/
│   │   │   │       └── page.tsx       ← Análisis de evento
│   │   │   └── notifications/
│   │   │       └── page.tsx           ← Panel de notificaciones
│   │   ├── components/
│   │   │   ├── landing/
│   │   │   ├── map/
│   │   │   ├── analysis/
│   │   │   ├── notifications/
│   │   │   └── shared/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── types/
│   ├── .env.example
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── main.py                    ← Entry point FastAPI
│   │   ├── api/
│   │   │   └── routes/
│   │   │       ├── events.py
│   │   │       ├── analysis.py
│   │   │       ├── map.py
│   │   │       ├── notifications.py
│   │   │       └── forecast.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   └── redis_client.py
│   │   ├── models/
│   │   ├── services/
│   │   │   ├── ai/
│   │   │   │   ├── claude_service.py
│   │   │   │   └── narrative.py
│   │   │   ├── geo/
│   │   │   │   ├── voronoi.py
│   │   │   │   └── heatmap.py
│   │   │   └── economic/
│   │   │       └── derrama_model.py
│   │   └── data/
│   │       ├── synthetic/
│   │       └── geo/
│   ├── .env.example
│   └── requirements.txt
│
├── docs/
│   ├── IDEA.md
│   └── FRONTEND_THEME.md
├── .gitignore
├── docker-compose.yml
└── README.md
```

## Integracion entre frontend y backend

URL base del backend:

```
http://localhost:8000
```

Endpoints principales utilizados por el frontend:

|Tipo|Endpoint                                   |Descripcion                                |
|----|-------------------------------------------|-------------------------------------------|
|REST|`GET /api/events`                          |Lista de todos los eventos con filtros     |
|REST|`GET /api/events/geojson`                  |GeoJSON de eventos para Mapbox             |
|REST|`GET /api/events/current`                  |Eventos activos en este momento            |
|REST|`POST /api/events/upload`                  |Alta de evento por documento (PDF/CSV)     |
|REST|`GET /api/analysis/{event_id}`             |Análisis completo de un evento             |
|REST|`GET /api/analysis/{event_id}/narrative`   |Narrativa generada por Claude              |
|REST|`POST /api/analysis/simulate`              |Simulacion de derrama hipotetica           |
|REST|`GET /api/map/voronoi`                     |GeoJSON de zonas Voronoi por tipo de evento|
|REST|`GET /api/map/heatmap`                     |Capa de calor de derrama o empleo          |
|REST|`POST /api/map/best-location`              |Zonas optimas para un evento dado          |
|REST|`GET /api/notifications/pymes`             |MiPyMEs elegibles por zona y sector        |
|REST|`POST /api/notifications/draft`            |Claude genera borrador de mensaje          |
|REST|`POST /api/notifications/send`             |Envia notificacion a MiPyMEs               |
|REST|`GET /api/forecast/{event_type}/{alcaldia}`|Proyeccion de derrama futura               |

## Solucion de problemas comunes

### 1) Puerto ocupado

Sintoma: el servidor no inicia porque el puerto ya esta en uso.

Solucion (frontend):

```bash
PORT=4000 npm run dev
```

Solucion (backend):

```bash
uvicorn app.main:app --reload --port 8001
```

### 2) Variable de entorno faltante

Sintoma: error relacionado con token de Mapbox o con la API key de Anthropic.

Solucion:

```bash
# frontend/.env.local
NEXT_PUBLIC_MAPBOX_TOKEN=<TU_TOKEN_MAPBOX>
NEXT_PUBLIC_API_URL=http://localhost:8000

# backend/.env
ANTHROPIC_API_KEY=<TU_ANTHROPIC_API_KEY>
MAPBOX_TOKEN=<TU_TOKEN_MAPBOX>
```

Reinicia ambos servidores despues de cambiar variables.

### 3) Error CORS con backend

Sintoma: fallan llamadas a la API desde el navegador.

Solucion:

- Verifica que el backend permita el origen `http://localhost:3000`.
- Confirma que `NEXT_PUBLIC_API_URL` en el frontend apunte a la URL correcta del backend.
- Si usas Docker, asegurate de que los contenedores esten en la misma red.

### 4) Python: modulo no encontrado

Sintoma: `ModuleNotFoundError` al iniciar el backend.

Solucion:

```bash
cd backend
source .venv/bin/activate   # activa el entorno virtual
pip install -r requirements.txt
```

### 5) El mapa no renderiza

Sintoma: el mapa aparece en blanco o muestra error de token.

Solucion:

- Verifica que `NEXT_PUBLIC_MAPBOX_TOKEN` este definido en `frontend/.env.local`.
- El token debe comenzar con `pk.`.
- Reinicia `npm run dev` despues de agregar la variable.

## Contacto del proyecto

Para soporte tecnico o coordinacion de despliegues:

- Equipo: `<TEAM_NAME>`
- Email: `<CONTACT_EMAIL>`
- Repositorio: `https://github.com/zoe718/MercurIA`
- Demo en produccion: `https://mercur-ia.vercel.app`
