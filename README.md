# MercurIA

MercurIA es una plataforma de inteligencia económica para analizar, planear y monitorear eventos en la Ciudad de México con enfoque en derrama económica, MiPyMEs y toma de decisión pública.

## Documentación base

- [Documento maestro de arquitectura](docs/IDEA.md)
- [Paleta y tema frontend](docs/FRONTEND_THEME.md)
- [Documentación viva del frontend](docs/frontend/README.md)

## Frontend

El frontend vive en `frontend/`. La ruta `/` muestra la landing page y `/map` abre el mapa Mapbox a pantalla completa con datos sintéticos locales mientras el backend se construye en paralelo.

```bash
cd frontend
npm install
npm run dev
```

La app queda disponible en `http://localhost:3000`. El token público de Mapbox debe vivir en `frontend/.env.local`; `frontend/.env.example` deja la plantilla sin exponer tokens en Git.
