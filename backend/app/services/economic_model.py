from datetime import date
from math import ceil

from app.core.config import get_settings
from app.models.schemas import (
    ConfidenceInterval,
    Coordinates,
    EconomicEvent,
    EventDetail,
    SectorImpact,
    SimulationRequest,
)
from app.services.data_store import get_baselines


GASTO_BASE = {
    "deportivo": 2400,
    "cultural": 900,
    "musical": 3200,
    "ferial": 1800,
    "gastronomico": 2100,
    "religioso": 420,
    "civico": 380,
    "tecnologico": 2600,
}

SECTOR_DISTRIBUTION = {
    "deportivo": {
        "Hoteleria": 0.28,
        "Restaurantes": 0.22,
        "Transporte": 0.16,
        "Retail": 0.14,
        "Entretenimiento": 0.08,
        "Otros": 0.12,
    },
    "cultural": {
        "Restaurantes": 0.30,
        "Comercio local": 0.24,
        "Transporte": 0.17,
        "Hoteleria": 0.12,
        "Entretenimiento": 0.09,
        "Otros": 0.08,
    },
    "musical": {
        "Hoteleria": 0.32,
        "Restaurantes": 0.20,
        "Transporte": 0.15,
        "Retail": 0.14,
        "Entretenimiento": 0.09,
        "Otros": 0.10,
    },
    "ferial": {
        "Hoteleria": 0.36,
        "Restaurantes": 0.19,
        "Turismo": 0.18,
        "Transporte": 0.13,
        "Servicios": 0.08,
        "Otros": 0.06,
    },
    "gastronomico": {
        "Restaurantes": 0.46,
        "Proveedores": 0.18,
        "Retail": 0.14,
        "Transporte": 0.12,
        "Otros": 0.10,
    },
    "religioso": {
        "Comercio local": 0.38,
        "Alimentos": 0.29,
        "Transporte": 0.19,
        "Servicios": 0.08,
        "Otros": 0.06,
    },
    "civico": {
        "Restaurantes": 0.34,
        "Comercio local": 0.24,
        "Transporte": 0.18,
        "Hoteleria": 0.11,
        "Entretenimiento": 0.08,
        "Otros": 0.05,
    },
    "tecnologico": {
        "Hoteleria": 0.30,
        "Servicios": 0.23,
        "Restaurantes": 0.18,
        "Transporte": 0.12,
        "Retail": 0.08,
        "Otros": 0.09,
    },
}

FACTOR_ESTACIONAL = {
    1: 0.75,
    2: 0.80,
    3: 0.90,
    4: 0.95,
    5: 0.92,
    6: 0.88,
    7: 0.85,
    8: 0.88,
    9: 1.10,
    10: 1.20,
    11: 1.15,
    12: 1.18,
}


def duration_days(start: date, end: date) -> int:
    return max((end - start).days + 1, 1)


def duration_factor(days: int) -> float:
    return min(days * 0.7 + 0.3, 3.0)


def borough_multiplier(borough: str) -> float:
    return float(get_baselines()["boroughMultipliers"].get(borough, 1.0))


def estimate_mdp(
    event_type: str,
    borough: str,
    attendance: int,
    start: date,
    end: date,
) -> float:
    base = GASTO_BASE[event_type]
    total = (
        attendance
        * base
        * borough_multiplier(borough)
        * FACTOR_ESTACIONAL[start.month]
        * duration_factor(duration_days(start, end))
    ) / 1_000_000
    return round(total, 2)


def sector_breakdown(event_type: str, total_mdp: float) -> list[SectorImpact]:
    distribution = SECTOR_DISTRIBUTION[event_type]
    return [
        SectorImpact(name=name, share=round(pct * 100), amount=round(total_mdp * pct, 2))
        for name, pct in distribution.items()
    ]


def confidence_interval(expected_mdp: float, confidence: float) -> ConfidenceInterval:
    uncertainty = max(0.08, 0.28 - confidence * 0.18)
    return ConfidenceInterval(
        low=round(expected_mdp * (1 - uncertainty), 2),
        expected=round(expected_mdp, 2),
        high=round(expected_mdp * (1 + uncertainty), 2),
    )


def jobs_for_mdp(total_mdp: float) -> tuple[int, int]:
    return int(total_mdp * 1.2), int(total_mdp * 2.8)


def businesses_for_mdp(total_mdp: float) -> int:
    return int(total_mdp * 8.5)


def forecast_for_event(event: EventDetail) -> dict[str, object]:
    baseline = event.realMdp or event.estimatedMdp
    growth = 1.08 if event.type in {"musical", "ferial", "tecnologico"} else 1.05
    next_year = event.dateStart.year + 1
    expected = round(baseline * growth, 2)
    return {
        "nextEditionYear": next_year,
        "estimatedMdp": expected,
        "confidenceInterval": confidence_interval(expected, event.confidence),
        "expectedAttendance": ceil((event.realAttendance or event.expectedAttendance) * 1.04),
        "recommendation": (
            "Preparar notificaciones sectoriales 10 dias antes y reforzar comercios "
            f"de {event.borough} vinculados a {event.type}."
        ),
    }


def simulate_event(payload: SimulationRequest) -> EconomicEvent:
    end = payload.dateEnd or payload.dateStart
    estimated = estimate_mdp(
        payload.type,
        payload.borough,
        payload.expectedAttendance,
        payload.dateStart,
        end,
    )
    direct, indirect = jobs_for_mdp(estimated)
    venue = payload.venue or f"Sede propuesta en {payload.borough}"
    coordinates = payload.coordinates or Coordinates(lng=-99.1332, lat=19.4326)
    return EconomicEvent(
        id="sim-demo",
        name=payload.name,
        type=payload.type,
        subtype=payload.subtype,
        borough=payload.borough,
        venue=venue,
        date=payload.dateStart.strftime("%b %Y"),
        status="planificado",
        coordinates=coordinates,
        expectedAttendance=payload.expectedAttendance,
        estimatedMdp=estimated,
        directJobs=direct,
        indirectJobs=indirect,
        benefitedBusinesses=businesses_for_mdp(estimated),
        sectors=sector_breakdown(payload.type, estimated),
        insight=(
            f"Simulacion con modelo {get_settings().model_version}: la oportunidad "
            f"principal esta en {payload.borough} para giros vinculados a {payload.type}."
        ),
    )
