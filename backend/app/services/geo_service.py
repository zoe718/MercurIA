from app.models.schemas import GeoJsonFeature, GeoJsonFeatureCollection, HeatmapPoint, MapLayer
from app.services.data_store import get_baselines, get_events


def events_geojson() -> GeoJsonFeatureCollection:
    features = []
    for event in get_events():
        features.append(
            GeoJsonFeature(
                geometry={
                    "type": "Point",
                    "coordinates": [event.coordinates.lng, event.coordinates.lat],
                },
                properties={
                    "id": event.id,
                    "name": event.name,
                    "type": event.type,
                    "status": event.status,
                    "borough": event.borough,
                    "estimatedMdp": event.estimatedMdp,
                    "realMdp": event.realMdp,
                    "venue": event.venue,
                },
            )
        )
    return GeoJsonFeatureCollection(features=features)


def heatmap(metric: str = "derrama") -> list[HeatmapPoint]:
    points = []
    hotel_occupancy = get_baselines().get("hotelOccupancy", {})
    for event in get_events():
        if metric == "ocupacion":
            value = float(hotel_occupancy.get(event.borough, 0.45)) * 100
            weight = round(value / 100, 4)
        else:
            value = {
                "derrama": event.realMdp or event.estimatedMdp,
                "empleo": event.directJobs + event.indirectJobs,
                "negocios": event.benefitedBusinesses,
            }.get(metric, event.realMdp or event.estimatedMdp)
            weight = round(float(value) / 1000, 4)
        points.append(
            HeatmapPoint(
                id=event.id,
                coordinates=event.coordinates,
                weight=weight,
                metric=metric,
                value=float(value),
                borough=event.borough,
            )
        )
    return points


def layers() -> list[MapLayer]:
    return [
        MapLayer(
            id="events",
            label="Eventos",
            type="point",
            endpoint="/api/events/geojson",
            defaultVisible=True,
            description="Marcadores de eventos monitoreados por MercurIA.",
        ),
        MapLayer(
            id="derrama-heatmap",
            label="Heatmap de derrama",
            type="heatmap",
            endpoint="/api/map/heatmap?metric=derrama",
            defaultVisible=True,
            description="Intensidad economica ponderada por derrama estimada o real.",
        ),
        MapLayer(
            id="venue-score",
            label="Score de sedes",
            type="point",
            endpoint="/api/map/venue-score",
            defaultVisible=False,
            description="Zonas recomendadas para planear eventos futuros.",
        ),
        MapLayer(
            id="hotel-occupancy-heatmap",
            label="Heatmap de ocupacion hotelera",
            type="heatmap",
            endpoint="/api/map/heatmap?metric=ocupacion",
            defaultVisible=False,
            description="Intensidad sintetica de ocupacion hotelera por alcaldia para calibrar eventos turisticos.",
        ),
    ]
