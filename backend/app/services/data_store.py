import json
from datetime import date
from functools import lru_cache
from pathlib import Path
from typing import Any

from app.models.schemas import EventDetail, EventStatus, EventType, PymeMatch, VenueScore

DATA_DIR = Path(__file__).resolve().parents[1] / "data" / "synthetic"


def _read_json(filename: str) -> Any:
    return json.loads((DATA_DIR / filename).read_text(encoding="utf-8"))


@lru_cache
def get_events() -> list[EventDetail]:
    return [EventDetail.model_validate(item) for item in _read_json("events.json")]


@lru_cache
def get_pymes() -> list[PymeMatch]:
    return [PymeMatch.model_validate(item) for item in _read_json("pymes.json")]


@lru_cache
def get_venue_scores() -> list[VenueScore]:
    return [VenueScore.model_validate(item) for item in _read_json("venues.json")]


@lru_cache
def get_baselines() -> dict[str, Any]:
    return _read_json("economic_baselines.json")


def find_event(event_id: str) -> EventDetail | None:
    return next((event for event in get_events() if event.id == event_id), None)


def filter_events(
    event_type: EventType | None = None,
    borough: str | None = None,
    status: EventStatus | None = None,
    from_date: date | None = None,
    to_date: date | None = None,
) -> list[EventDetail]:
    events = get_events()
    if event_type:
        events = [event for event in events if event.type == event_type]
    if borough:
        normalized = borough.casefold()
        events = [event for event in events if event.borough.casefold() == normalized]
    if status:
        events = [event for event in events if event.status == status]
    if from_date:
        events = [event for event in events if event.dateEnd >= from_date]
    if to_date:
        events = [event for event in events if event.dateStart <= to_date]
    return events
