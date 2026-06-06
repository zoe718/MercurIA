from typing import TypedDict

from app.models.schemas import GeoJsonFeature, GeoJsonFeatureCollection, VoronoiEventType


class SeedSite(TypedDict):
    id: str
    name: str
    borough: str
    lng: float
    lat: float
    capacity: int
    transportAccess: float
    hotels: int
    restaurants: int
    retail: int
    tourismPois: int
    routeServices: int
    culturalFrequency: int
    expositors: int


PROFILES: dict[VoronoiEventType, dict[str, object]] = {
    "fiestas": {
        "formula": "aforo x gasto_alimentos_pp x dias_duracion",
        "variables": ["fie_aforo", "fie_gasto_alimentos", "fie_dias_duracion", "fie_radio_conv"],
    },
    "festivales": {
        "formula": "capacidad_recinto x precio_boleto x pct_foraneos x dias",
        "variables": ["fes_capacidad", "fes_precio_boleto", "fes_pct_foraneos", "fes_noches_hospedaje"],
    },
    "deportivos": {
        "formula": "capacidad_sede x ticket_promedio x tipo_competencia_factor",
        "variables": ["dep_capacidad_sede", "dep_ticket_promedio", "dep_tipo_competencia", "dep_pct_turistas"],
    },
    "culturales": {
        "formula": "aforo_real x precio_entrada x frecuencia_funcion x duracion_visita",
        "variables": ["cul_aforo_legal", "cul_precio_entrada", "cul_frec_funcion", "cul_accesibilidad"],
    },
    "turisticos": {
        "formula": "gasto_diario_turista x noches_hospedaje x afluencia_mensual",
        "variables": ["tur_gasto_diario", "tur_noches_hospedaje", "tur_ocup_hotelera", "tur_densidad_pois"],
    },
    "religioso": {
        "formula": "num_peregrinos x gasto_ruta x dias_festividad",
        "variables": ["rel_ruta_km", "rel_gasto_articulos", "rel_dias_festividad", "rel_infra_ruta"],
    },
    "gastronomico": {
        "formula": "ticket_promedio x sesiones_dia x num_expositores x duracion_evento",
        "variables": ["gas_ticket_promedio", "gas_sesiones_dia", "gas_num_expositores", "gas_duracion_perm"],
    },
}

SEED_SITES: list[SeedSite] = [
    {"id": "seed-zocalo", "name": "Zocalo Centro Historico", "borough": "Cuauhtemoc", "lng": -99.1332, "lat": 19.4326, "capacity": 240000, "transportAccess": 9.4, "hotels": 9200, "restaurants": 1400, "retail": 1900, "tourismPois": 190, "routeServices": 84, "culturalFrequency": 26, "expositors": 360},
    {"id": "seed-foro-sol", "name": "Foro Sol / Ciudad Deportiva", "borough": "Iztacalco", "lng": -99.0843, "lat": 19.3939, "capacity": 65000, "transportAccess": 8.8, "hotels": 1800, "restaurants": 520, "retail": 620, "tourismPois": 42, "routeServices": 56, "culturalFrequency": 12, "expositors": 140},
    {"id": "seed-azteca", "name": "Estadio Azteca", "borough": "Coyoacan", "lng": -99.1505, "lat": 19.3029, "capacity": 83000, "transportAccess": 7.9, "hotels": 1300, "restaurants": 390, "retail": 480, "tourismPois": 35, "routeServices": 44, "culturalFrequency": 10, "expositors": 110},
    {"id": "seed-cu", "name": "Ciudad Universitaria", "borough": "Coyoacan", "lng": -99.187, "lat": 19.332, "capacity": 72000, "transportAccess": 8.2, "hotels": 900, "restaurants": 430, "retail": 390, "tourismPois": 70, "routeServices": 48, "culturalFrequency": 22, "expositors": 150},
    {"id": "seed-chapultepec", "name": "Bosque de Chapultepec", "borough": "Miguel Hidalgo", "lng": -99.1813, "lat": 19.4204, "capacity": 180000, "transportAccess": 8.6, "hotels": 8700, "restaurants": 760, "retail": 950, "tourismPois": 210, "routeServices": 68, "culturalFrequency": 30, "expositors": 240},
    {"id": "seed-basilica", "name": "Basilica de Guadalupe", "borough": "Gustavo A. Madero", "lng": -99.117, "lat": 19.4847, "capacity": 120000, "transportAccess": 8.1, "hotels": 1100, "restaurants": 680, "retail": 920, "tourismPois": 80, "routeServices": 95, "culturalFrequency": 14, "expositors": 180},
    {"id": "seed-xochimilco", "name": "Embarcadero Xochimilco", "borough": "Xochimilco", "lng": -99.103, "lat": 19.257, "capacity": 54000, "transportAccess": 6.7, "hotels": 540, "restaurants": 360, "retail": 260, "tourismPois": 120, "routeServices": 42, "culturalFrequency": 16, "expositors": 130},
    {"id": "seed-coyoacan", "name": "Centro de Coyoacan", "borough": "Coyoacan", "lng": -99.1626, "lat": 19.3498, "capacity": 46000, "transportAccess": 7.6, "hotels": 700, "restaurants": 820, "retail": 610, "tourismPois": 135, "routeServices": 38, "culturalFrequency": 28, "expositors": 180},
    {"id": "seed-arena", "name": "Arena CDMX", "borough": "Azcapotzalco", "lng": -99.175, "lat": 19.496, "capacity": 22300, "transportAccess": 7.5, "hotels": 620, "restaurants": 340, "retail": 520, "tourismPois": 24, "routeServices": 35, "culturalFrequency": 11, "expositors": 120},
    {"id": "seed-citibanamex", "name": "Centro Citibanamex", "borough": "Miguel Hidalgo", "lng": -99.2197, "lat": 19.4401, "capacity": 48000, "transportAccess": 7.3, "hotels": 6400, "restaurants": 540, "retail": 740, "tourismPois": 95, "routeServices": 46, "culturalFrequency": 18, "expositors": 620},
    {"id": "seed-iztapalapa", "name": "Cerro de la Estrella", "borough": "Iztapalapa", "lng": -99.0939, "lat": 19.344, "capacity": 220000, "transportAccess": 7.4, "hotels": 360, "restaurants": 560, "retail": 820, "tourismPois": 46, "routeServices": 76, "culturalFrequency": 12, "expositors": 150},
    {"id": "seed-revolucion", "name": "Monumento a la Revolucion", "borough": "Cuauhtemoc", "lng": -99.154, "lat": 19.436, "capacity": 85000, "transportAccess": 9.1, "hotels": 6200, "restaurants": 970, "retail": 1120, "tourismPois": 150, "routeServices": 64, "culturalFrequency": 24, "expositors": 260},
    {"id": "seed-santa-maria", "name": "Santa Maria la Ribera", "borough": "Cuauhtemoc", "lng": -99.1582, "lat": 19.4471, "capacity": 36000, "transportAccess": 8.4, "hotels": 1800, "restaurants": 420, "retail": 560, "tourismPois": 65, "routeServices": 36, "culturalFrequency": 17, "expositors": 110},
    {"id": "seed-ajusco", "name": "Ajusco / Tlalpan", "borough": "Tlalpan", "lng": -99.207, "lat": 19.246, "capacity": 38000, "transportAccess": 5.9, "hotels": 420, "restaurants": 210, "retail": 160, "tourismPois": 92, "routeServices": 26, "culturalFrequency": 6, "expositors": 80},
    {"id": "seed-bicentenario", "name": "Parque Bicentenario", "borough": "Azcapotzalco", "lng": -99.202, "lat": 19.469, "capacity": 52000, "transportAccess": 7.9, "hotels": 800, "restaurants": 310, "retail": 420, "tourismPois": 54, "routeServices": 32, "culturalFrequency": 12, "expositors": 130},
    {"id": "seed-jamaica", "name": "Mercado Jamaica / La Viga", "borough": "Venustiano Carranza", "lng": -99.124, "lat": 19.407, "capacity": 60000, "transportAccess": 8.6, "hotels": 800, "restaurants": 720, "retail": 1300, "tourismPois": 58, "routeServices": 48, "culturalFrequency": 11, "expositors": 310},
    {"id": "seed-san-angel", "name": "San Angel", "borough": "Alvaro Obregon", "lng": -99.1908, "lat": 19.346, "capacity": 42000, "transportAccess": 7.2, "hotels": 860, "restaurants": 520, "retail": 360, "tourismPois": 105, "routeServices": 31, "culturalFrequency": 20, "expositors": 150},
    {"id": "seed-tlahuac", "name": "Bosque de Tlahuac", "borough": "Tlahuac", "lng": -99.012, "lat": 19.291, "capacity": 58000, "transportAccess": 6.4, "hotels": 180, "restaurants": 260, "retail": 340, "tourismPois": 35, "routeServices": 39, "culturalFrequency": 8, "expositors": 95},
]

CDMX_BOUNDS = {
    "min_lng": -99.365,
    "max_lng": -98.94,
    "min_lat": 19.048,
    "max_lat": 19.593,
}


def build_voronoi(event_type: VoronoiEventType = "festivales") -> GeoJsonFeatureCollection:
    scored = sorted(
        ((site, _score_seed(site, event_type)) for site in SEED_SITES),
        key=lambda item: item[1],
        reverse=True,
    )
    max_score = max(score for _, score in scored)
    rank_by_id = {site["id"]: index + 1 for index, (site, _) in enumerate(scored)}
    score_by_id = {site["id"]: score for site, score in scored}
    profile = PROFILES[event_type]

    features = []
    for site in SEED_SITES:
        score = round(score_by_id[site["id"]] / max_score * 100)
        features.append(
            GeoJsonFeature(
                geometry={
                    "type": "Polygon",
                    "coordinates": [_cell_polygon(site["lng"], site["lat"])],
                },
                properties={
                    "id": site["id"],
                    "name": site["name"],
                    "borough": site["borough"],
                    "eventType": event_type,
                    "score": score,
                    "rank": rank_by_id[site["id"]],
                    "estimatedMdp": round(score_by_id[site["id"]] / 1_000_000),
                    "weightFormula": profile["formula"],
                    "topVariables": profile["variables"],
                },
            )
        )

    return GeoJsonFeatureCollection(features=features)


def _cell_polygon(lng: float, lat: float) -> list[list[float]]:
    dx = 0.026
    dy = 0.021
    min_lng = max(CDMX_BOUNDS["min_lng"], lng - dx)
    max_lng = min(CDMX_BOUNDS["max_lng"], lng + dx)
    min_lat = max(CDMX_BOUNDS["min_lat"], lat - dy)
    max_lat = min(CDMX_BOUNDS["max_lat"], lat + dy)
    return [
        [min_lng, min_lat],
        [max_lng, min_lat],
        [max_lng, max_lat],
        [min_lng, max_lat],
        [min_lng, min_lat],
    ]


def _score_seed(site: SeedSite, event_type: VoronoiEventType) -> float:
    access_multiplier = 0.75 + site["transportAccess"] / 25

    if event_type == "fiestas":
        aforo = site["capacity"] * 0.72
        gasto_alimentos = 210 + site["restaurants"] * 0.16 + site["retail"] * 0.05
        return aforo * gasto_alimentos * 3 * access_multiplier
    if event_type == "festivales":
        ticket = 780 + site["culturalFrequency"] * 24
        pct_foraneos = 0.18 + min(site["hotels"] / 12000, 0.42)
        dias = 3 if site["capacity"] > 60000 else 2
        return site["capacity"] * ticket * pct_foraneos * dias * access_multiplier
    if event_type == "deportivos":
        ticket = 520 + site["capacity"] * 0.0009
        factor = 2.2 if site["capacity"] > 70000 else 1.65 if site["capacity"] > 45000 else 1.2
        turistas = 1 + min(site["hotels"] / 9000, 0.5)
        return site["capacity"] * ticket * factor * turistas * access_multiplier
    if event_type == "culturales":
        real_aforo = site["capacity"] * 0.46
        entrada = 120 + site["tourismPois"] * 1.8
        horas = 1.35 + site["culturalFrequency"] / 40
        return real_aforo * entrada * max(site["culturalFrequency"], 1) * horas
    if event_type == "turisticos":
        gasto_diario = 1150 + site["restaurants"] * 0.32 + site["tourismPois"] * 7
        noches = 1.15 + min(site["hotels"] / 9000, 2.1)
        visitantes = site["tourismPois"] * 1800 + site["hotels"] * 8
        return gasto_diario * noches * visitantes * access_multiplier
    if event_type == "religioso":
        peregrinos = site["capacity"] * (1.8 if site["routeServices"] > 70 else 0.95)
        gasto_ruta = 95 + site["retail"] * 0.08 + site["restaurants"] * 0.11
        dias = 4 if site["routeServices"] > 70 else 2
        return peregrinos * gasto_ruta * dias

    ticket = 360 + site["restaurants"] * 0.2
    sesiones = 4 if site["transportAccess"] > 8 else 3
    expositores = site["expositors"] + site["restaurants"] * 0.18
    duracion = 4 if site["capacity"] > 70000 else 3
    return ticket * sesiones * expositores * duracion * access_multiplier * 120
