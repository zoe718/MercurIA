from fastapi import APIRouter

from app.models.schemas import GeoJsonFeatureCollection, HeatmapPoint, MapLayer, VenueScore, VoronoiEventType
from app.services.data_store import get_venue_scores
from app.services.geo_service import heatmap, layers
from app.services.voronoi_service import build_voronoi

router = APIRouter(prefix="/map", tags=["map"])


@router.get("/venue-score", response_model=list[VenueScore])
def venue_score(eventType: str | None = None) -> list[VenueScore]:
    scores = get_venue_scores()
    if eventType:
        scores = [score for score in scores if eventType in score.compatibleTypes]
    return scores


@router.get("/voronoi", response_model=GeoJsonFeatureCollection)
def voronoi(event_type: VoronoiEventType = "festivales") -> GeoJsonFeatureCollection:
    return build_voronoi(event_type)


@router.get("/heatmap", response_model=list[HeatmapPoint])
def map_heatmap(metric: str = "derrama") -> list[HeatmapPoint]:
    return heatmap(metric)


@router.get("/layers", response_model=list[MapLayer])
def map_layers() -> list[MapLayer]:
    return layers()
