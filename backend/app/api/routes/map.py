from fastapi import APIRouter

from app.models.schemas import HeatmapPoint, MapLayer, VenueScore
from app.services.data_store import get_venue_scores
from app.services.geo_service import heatmap, layers

router = APIRouter(prefix="/map", tags=["map"])


@router.get("/venue-score", response_model=list[VenueScore])
def venue_score(eventType: str | None = None) -> list[VenueScore]:
    scores = get_venue_scores()
    if eventType:
        scores = [score for score in scores if eventType in score.compatibleTypes]
    return scores


@router.get("/heatmap", response_model=list[HeatmapPoint])
def map_heatmap(metric: str = "derrama") -> list[HeatmapPoint]:
    return heatmap(metric)


@router.get("/layers", response_model=list[MapLayer])
def map_layers() -> list[MapLayer]:
    return layers()
