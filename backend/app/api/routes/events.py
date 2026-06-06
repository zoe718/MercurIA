from datetime import date

from fastapi import APIRouter, HTTPException

from app.models.schemas import EconomicEvent, EventDetail, EventStatus, EventType, GeoJsonFeatureCollection
from app.services.data_store import filter_events, find_event
from app.services.geo_service import events_geojson

router = APIRouter(prefix="/events", tags=["events"])


@router.get("", response_model=list[EconomicEvent])
def list_events(
    type: EventType | None = None,
    borough: str | None = None,
    status: EventStatus | None = None,
    fromDate: date | None = None,
    toDate: date | None = None,
) -> list[EconomicEvent]:
    return [
        EconomicEvent.model_validate(event.model_dump())
        for event in filter_events(type, borough, status, fromDate, toDate)
    ]


@router.get("/current", response_model=list[EconomicEvent])
def current_events() -> list[EconomicEvent]:
    events = [event for event in filter_events() if event.status in {"activo", "planificado"}]
    return [EconomicEvent.model_validate(event.model_dump()) for event in events]


@router.get("/geojson", response_model=GeoJsonFeatureCollection)
def geojson() -> GeoJsonFeatureCollection:
    return events_geojson()


@router.get("/{eventId}", response_model=EventDetail)
def get_event(eventId: str) -> EventDetail:
    event = find_event(eventId)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event
