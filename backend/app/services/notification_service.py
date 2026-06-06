from math import asin, cos, radians, sin, sqrt

from app.models.schemas import EventDetail, PymeMatch
from app.services.data_store import get_pymes


SECTOR_ALIASES = {
    "Hoteleria": {"Hoteleria", "Turismo"},
    "Restaurantes": {"Restaurantes", "Alimentos"},
    "Transporte": {"Transporte"},
    "Retail": {"Retail", "Comercio local"},
    "Comercio local": {"Comercio local", "Retail", "Artesanias"},
    "Alimentos": {"Alimentos", "Restaurantes"},
    "Turismo": {"Turismo", "Hoteleria"},
}


PYME_COORDS = {
    "Cuauhtemoc": (-99.1332, 19.4326),
    "Iztacalco": (-99.0843, 19.3939),
    "Miguel Hidalgo": (-99.1917, 19.4260),
    "Iztapalapa": (-99.0939, 19.3440),
    "Xochimilco": (-99.1028, 19.2570),
    "Benito Juarez": (-99.1591, 19.3984),
    "Gustavo A. Madero": (-99.1180, 19.4825),
    "Coyoacan": (-99.1617, 19.3467),
    "Alvaro Obregon": (-99.2042, 19.3621),
}


def _distance_km(a_lng: float, a_lat: float, b_lng: float, b_lat: float) -> float:
    radius = 6371
    d_lat = radians(b_lat - a_lat)
    d_lng = radians(b_lng - a_lng)
    lat1 = radians(a_lat)
    lat2 = radians(b_lat)
    value = sin(d_lat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(d_lng / 2) ** 2
    return 2 * radius * asin(sqrt(value))


def match_pymes(event: EventDetail, radius_km: float = 3.0, sector: str | None = None) -> list[PymeMatch]:
    requested = {sector} if sector else set()
    if not requested:
        for item in event.sectors[:4]:
            requested |= SECTOR_ALIASES.get(item.name, {item.name})

    matches = []
    for pyme in get_pymes():
        lng, lat = PYME_COORDS.get(pyme.borough, (event.coordinates.lng, event.coordinates.lat))
        distance = _distance_km(event.coordinates.lng, event.coordinates.lat, lng, lat)
        sector_match = pyme.sector in requested or sector is None
        borough_match = pyme.borough == event.borough or distance <= radius_km
        if sector_match and borough_match:
            matches.append(pyme.model_copy(update={"distanceKm": round(distance, 1)}))

    return sorted(matches, key=lambda item: item.distanceKm)
