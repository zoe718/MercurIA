from fastapi import APIRouter, HTTPException

from app.models.schemas import NotificationDraftRequest, NotificationDraftResponse, NotificationLogItem, PymeMatch
from app.services.anthropic_service import AnthropicService
from app.services.data_store import find_event
from app.services.notification_service import match_pymes

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("/pymes", response_model=list[PymeMatch])
def pymes(eventId: str, radiusKm: float = 3.0, sector: str | None = None) -> list[PymeMatch]:
    event = find_event(eventId)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return match_pymes(event, radiusKm, sector)


@router.post("/draft", response_model=NotificationDraftResponse)
def draft(payload: NotificationDraftRequest) -> NotificationDraftResponse:
    event = find_event(payload.eventId)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    message = AnthropicService().generate_notification_draft(event, payload.sector, payload.borough)
    return NotificationDraftResponse(
        eventId=payload.eventId,
        sector=payload.sector,
        message=message,
        generatedBy="anthropic",
    )


@router.get("/log", response_model=list[NotificationLogItem])
def notification_log() -> list[NotificationLogItem]:
    return [
        NotificationLogItem(
            id="notif-001",
            eventId="evt-fiestas-2024",
            sector="Restaurantes",
            sentAt="2024-09-06T10:00:00-06:00",
            recipients=1240,
            status="sent",
        ),
        NotificationLogItem(
            id="notif-002",
            eventId="evt-tianguis-2026",
            sector="Hoteleria",
            sentAt="2026-03-10T09:30:00-06:00",
            recipients=860,
            status="draft",
        ),
    ]
