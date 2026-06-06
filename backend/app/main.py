from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import analysis, events, health, map, notifications
from app.core.config import get_settings


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title="MercurIA API",
        version=settings.app_version,
        description="Backend demo robusto para derrama economica de eventos CDMX.",
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(health.router, prefix="/api")
    app.include_router(events.router, prefix="/api")
    app.include_router(analysis.router, prefix="/api")
    app.include_router(map.router, prefix="/api")
    app.include_router(notifications.router, prefix="/api")
    return app


app = create_app()
