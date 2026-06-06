# MercurIA

MercurIA es una plataforma de inteligencia economica para analizar, planear y monitorear eventos en la Ciudad de Mexico con enfoque en derrama economica, MiPyMEs y toma de decision publica.

## Documentacion base

- [Documento maestro de arquitectura](docs/IDEA.md)
- [Paleta y tema frontend](docs/FRONTEND_THEME.md)
- [Documentacion viva del frontend](docs/frontend/README.md)

## Frontend

El frontend vive en `frontend/`. La ruta `/` muestra la landing page y `/map` abre el mapa Mapbox a pantalla completa con datos sinteticos locales mientras el backend se conecta.

Aviso para el equipo frontend: cuando empiecen a consumir endpoints reales, deben levantar el backend al mismo tiempo en `http://localhost:8000`. Mantengan `NEXT_PUBLIC_API_URL=http://localhost:8000` y `NEXT_PUBLIC_MAPBOX_TOKEN` en `frontend/.env.local` para que la app apunte a FastAPI y Mapbox durante desarrollo.

```bash
cd frontend
npm install
npm run dev
```

La app queda disponible en `http://localhost:3000`. El token publico de Mapbox debe vivir en `frontend/.env.local`; `frontend/.env.example` deja la plantilla sin exponer tokens en Git.

## Backend

El backend vive en `backend/`. Expone una API FastAPI compatible con el mock actual del frontend, datos sinteticos JSON, modelo de derrama economica y endpoints de IA con Anthropic.

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --port 8000
```

La API queda disponible en `http://localhost:8000` y la documentacion OpenAPI en `http://localhost:8000/docs`.

Los endpoints no IA funcionan sin configuracion externa. Para narrativa y borradores de notificacion, agrega `ANTHROPIC_API_KEY` en `backend/.env`.

Para desarrollo full-stack, deja este proceso corriendo mientras el frontend corre en `http://localhost:3000`.
