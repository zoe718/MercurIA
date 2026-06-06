from datetime import date
from typing import Any, Literal

from pydantic import BaseModel, Field


EventType = Literal[
    "deportivo",
    "cultural",
    "musical",
    "ferial",
    "gastronomico",
    "religioso",
    "civico",
    "tecnologico",
]
EventStatus = Literal["activo", "planificado", "finalizado"]


class Coordinates(BaseModel):
    lng: float
    lat: float


class SectorImpact(BaseModel):
    name: str
    share: float
    amount: float


class DataProvenance(BaseModel):
    sourceType: Literal["synthetic", "manual", "external"]
    sourceName: str
    capturedAt: str
    reliability: float = Field(ge=0, le=1)
    notes: str


class EconomicEvent(BaseModel):
    id: str
    name: str
    type: EventType
    subtype: str
    borough: str
    venue: str
    date: str
    status: EventStatus
    coordinates: Coordinates
    expectedAttendance: int
    realAttendance: int | None = None
    estimatedMdp: float
    realMdp: float | None = None
    directJobs: int
    indirectJobs: int
    benefitedBusinesses: int
    sectors: list[SectorImpact]
    insight: str


class EventDetail(EconomicEvent):
    dateStart: date
    dateEnd: date
    venueCapacity: int
    source: str
    confidence: float = Field(ge=0, le=1)
    modelVersion: str
    dataProvenance: DataProvenance
    tags: list[str] = []
    activatedSectors: list[str] = []


class HealthResponse(BaseModel):
    status: Literal["ok"]
    appName: str
    version: str
    demoMode: bool
    modelVersion: str
    anthropicConfigured: bool


class SummaryMetric(BaseModel):
    label: str
    value: str
    trend: str
    tone: Literal["success", "accent", "secondary", "warning", "danger"]


class AnalysisSummary(BaseModel):
    metrics: list[SummaryMetric]
    totalEstimatedMdp: float
    activeEvents: int
    reachablePymes: int
    topBoroughs: list[str]
    source: Literal["synthetic"]


class ConfidenceInterval(BaseModel):
    low: float
    expected: float
    high: float


class ForecastResult(BaseModel):
    nextEditionYear: int
    estimatedMdp: float
    confidenceInterval: ConfidenceInterval
    expectedAttendance: int
    recommendation: str


class FullAnalysis(BaseModel):
    event: EventDetail
    estimatedMdp: float
    actualMdp: float | None
    variationPct: float | None
    precisionPct: float | None
    confidenceInterval: ConfidenceInterval
    directJobs: int
    indirectJobs: int
    benefitedBusinesses: int
    sectors: list[SectorImpact]
    narrative: str
    forecast: ForecastResult
    modelVersion: str


class SimulationRequest(BaseModel):
    name: str = "Evento hipotetico"
    type: EventType
    subtype: str = "simulacion"
    borough: str
    dateStart: date
    dateEnd: date | None = None
    expectedAttendance: int = Field(gt=0)
    venue: str | None = None
    venueCapacity: int | None = None
    coordinates: Coordinates | None = None


class SimulationResponse(BaseModel):
    event: EconomicEvent
    confidenceInterval: ConfidenceInterval
    modelVersion: str
    assumptions: list[str]


class GeoJsonFeature(BaseModel):
    type: Literal["Feature"] = "Feature"
    geometry: dict[str, Any]
    properties: dict[str, Any]


class GeoJsonFeatureCollection(BaseModel):
    type: Literal["FeatureCollection"] = "FeatureCollection"
    features: list[GeoJsonFeature]


class VenueScore(BaseModel):
    zone: str
    borough: str
    score: int
    estimatedMdp: float
    coordinates: Coordinates
    reason: str
    capacity: int
    compatibleTypes: list[EventType]


class HeatmapPoint(BaseModel):
    id: str
    coordinates: Coordinates
    weight: float
    metric: str
    value: float
    borough: str


class MapLayer(BaseModel):
    id: str
    label: str
    type: Literal["point", "heatmap", "polygon", "line"]
    endpoint: str
    defaultVisible: bool
    description: str


class PymeMatch(BaseModel):
    id: str
    name: str
    borough: str
    sector: str
    distanceKm: float
    status: Literal["lista", "borrador", "enviada"]
    email: str


class NotificationDraftRequest(BaseModel):
    eventId: str
    sector: str
    borough: str | None = None
    pymeIds: list[str] = []


class NotificationDraftResponse(BaseModel):
    eventId: str
    sector: str
    message: str
    generatedBy: Literal["anthropic"]


class NotificationLogItem(BaseModel):
    id: str
    eventId: str
    sector: str
    sentAt: str
    recipients: int
    status: Literal["sent", "draft", "failed"]
