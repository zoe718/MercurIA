from fastapi import APIRouter

from app.core.config import get_settings
from app.models.schemas import HealthResponse

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    settings = get_settings()
    return HealthResponse(
        status="ok",
        appName=settings.app_name,
        version=settings.app_version,
        demoMode=settings.demo_mode,
        modelVersion=settings.model_version,
        anthropicConfigured=settings.anthropic_configured,
    )
