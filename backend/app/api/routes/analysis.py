from fastapi import APIRouter, HTTPException

from app.core.config import get_settings
from app.models.schemas import (
    AnalysisSummary,
    FullAnalysis,
    SimulationRequest,
    SimulationResponse,
    SummaryMetric,
)
from app.services.anthropic_service import AnthropicService
from app.services.data_store import find_event, get_events, get_pymes
from app.services.economic_model import confidence_interval, forecast_for_event, simulate_event

router = APIRouter(prefix="/analysis", tags=["analysis"])


@router.get("/summary", response_model=AnalysisSummary)
def summary() -> AnalysisSummary:
    events = get_events()
    total_estimated = round(sum(event.realMdp or event.estimatedMdp for event in events), 2)
    active_events = sum(1 for event in events if event.status == "activo")
    reachable_pymes = len(get_pymes())
    borough_totals: dict[str, float] = {}
    for event in events:
        borough_totals[event.borough] = borough_totals.get(event.borough, 0) + (
            event.realMdp or event.estimatedMdp
        )
    top_boroughs = [
        item[0] for item in sorted(borough_totals.items(), key=lambda item: item[1], reverse=True)[:4]
    ]
    return AnalysisSummary(
        metrics=[
            SummaryMetric(
                label="Derrama historica y proyectada",
                value=f"${total_estimated:,.0f} mdp",
                trend="+18.4%",
                tone="success",
            ),
            SummaryMetric(label="Eventos monitoreados", value=str(len(events)), trend=f"{active_events} activos", tone="accent"),
            SummaryMetric(label="MiPyMEs alcanzables", value=f"{reachable_pymes:,}", trend="demo sintetico", tone="secondary"),
            SummaryMetric(label="Alcaldias con mayor actividad", value=str(len(top_boroughs)), trend=", ".join(top_boroughs[:2]), tone="warning"),
        ],
        totalEstimatedMdp=total_estimated,
        activeEvents=active_events,
        reachablePymes=reachable_pymes,
        topBoroughs=top_boroughs,
        source="synthetic",
    )


@router.get("/{eventId}", response_model=FullAnalysis)
def full_analysis(eventId: str) -> FullAnalysis:
    event = find_event(eventId)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    actual = event.realMdp
    variation = None
    precision = None
    if actual is not None:
        variation = round(((actual - event.estimatedMdp) / event.estimatedMdp) * 100, 2)
        precision = round(max(0, 100 - abs(variation)), 2)
    narrative = AnthropicService().generate_analysis_narrative(event, variation, precision)
    return FullAnalysis(
        event=event,
        estimatedMdp=event.estimatedMdp,
        actualMdp=actual,
        variationPct=variation,
        precisionPct=precision,
        confidenceInterval=confidence_interval(event.realMdp or event.estimatedMdp, event.confidence),
        directJobs=event.directJobs,
        indirectJobs=event.indirectJobs,
        benefitedBusinesses=event.benefitedBusinesses,
        sectors=event.sectors,
        narrative=narrative,
        forecast=forecast_for_event(event),
        modelVersion=get_settings().model_version,
    )


@router.post("/simulate", response_model=SimulationResponse)
def simulate(payload: SimulationRequest) -> SimulationResponse:
    event = simulate_event(payload)
    return SimulationResponse(
        event=event,
        confidenceInterval=confidence_interval(event.estimatedMdp, 0.72),
        modelVersion=get_settings().model_version,
        assumptions=[
            "Datos sinteticos plausibles para demostracion.",
            "No incluye aun datos reales de INEGI, DATATUR ni Cartelera CDMX.",
            "La precision mejora cuando el evento tenga afluencia real y ventas observadas.",
        ],
    )
