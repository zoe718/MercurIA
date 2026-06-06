# MercurIA Backend

Backend FastAPI demo para analizar derrama economica de eventos en CDMX.

## Instalacion

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
```

Para endpoints con IA, llena `ANTHROPIC_API_KEY` en `.env`.

## Desarrollo

```bash
uvicorn app.main:app --reload --port 8000
```

OpenAPI queda disponible en `http://localhost:8000/docs`.

## Verificacion

```bash
pytest
python -m compileall app tests
```

## Contrato principal

- La API publica responde en camelCase para mantener compatibilidad con el frontend.
- Los datos son sinteticos plausibles para demo.
- `Fiestas Patrias CDMX 2024` conserva `realMdp = 8429`.
- Los endpoints no IA funcionan sin llave de Anthropic.
- Los endpoints IA devuelven `503` claro si falta `ANTHROPIC_API_KEY`.
