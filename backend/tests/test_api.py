from fastapi.testclient import TestClient

import app.services.anthropic_service as anthropic_module
from app.core.config import Settings
from app.main import app
from app.services.anthropic_service import AnthropicService

client = TestClient(app)


def test_health_responds():
    response = client.get("/api/health")
    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "ok"
    assert payload["demoMode"] is True
    assert payload["modelVersion"] == "derrama-demo-1.0"


def test_events_filter_by_type_borough_and_status():
    response = client.get(
        "/api/events",
        params={"type": "civico", "borough": "Cuauhtemoc", "status": "finalizado"},
    )
    assert response.status_code == 200
    events = response.json()
    assert events
    assert all(event["type"] == "civico" for event in events)
    assert all(event["borough"] == "Cuauhtemoc" for event in events)
    assert all(event["status"] == "finalizado" for event in events)


def test_frontend_event_contract_shape():
    response = client.get("/api/events")
    assert response.status_code == 200
    event = response.json()[0]
    expected_fields = {
        "id",
        "name",
        "type",
        "subtype",
        "borough",
        "venue",
        "date",
        "status",
        "coordinates",
        "expectedAttendance",
        "realAttendance",
        "estimatedMdp",
        "realMdp",
        "directJobs",
        "indirectJobs",
        "benefitedBusinesses",
        "sectors",
        "insight",
    }
    assert expected_fields <= set(event)
    assert {"lng", "lat"} <= set(event["coordinates"])


def test_fiestas_patrias_reference_value_is_stable():
    response = client.get("/api/events/evt-fiestas-2024")
    assert response.status_code == 200
    payload = response.json()
    assert payload["name"] == "Fiestas Patrias CDMX 2024"
    assert payload["realMdp"] == 8429


def test_analysis_calculates_variation_when_ai_is_stubbed(monkeypatch):
    monkeypatch.setattr(
        AnthropicService,
        "generate_analysis_narrative",
        lambda self, event, variation_pct, precision_pct: "Narrativa demo.",
    )
    response = client.get("/api/analysis/evt-fiestas-2024")
    assert response.status_code == 200
    payload = response.json()
    assert payload["variationPct"] == 4.06
    assert payload["precisionPct"] == 95.94
    assert payload["sectors"]
    assert payload["confidenceInterval"]["low"] < payload["confidenceInterval"]["expected"]
    assert payload["confidenceInterval"]["high"] > payload["confidenceInterval"]["expected"]


def test_geojson_is_valid_feature_collection():
    response = client.get("/api/events/geojson")
    assert response.status_code == 200
    payload = response.json()
    assert payload["type"] == "FeatureCollection"
    assert payload["features"]
    feature = payload["features"][0]
    assert feature["type"] == "Feature"
    assert feature["geometry"]["type"] == "Point"
    assert len(feature["geometry"]["coordinates"]) == 2


def test_simulate_returns_confidence_bands():
    response = client.post(
        "/api/analysis/simulate",
        json={
            "name": "Festival cultural hipotetico",
            "type": "cultural",
            "subtype": "festival",
            "borough": "Cuauhtemoc",
            "dateStart": "2026-10-20",
            "dateEnd": "2026-10-22",
            "expectedAttendance": 100000,
        },
    )
    assert response.status_code == 200
    payload = response.json()
    assert payload["event"]["estimatedMdp"] > 0
    assert payload["confidenceInterval"]["low"] < payload["confidenceInterval"]["expected"]
    assert payload["confidenceInterval"]["high"] > payload["confidenceInterval"]["expected"]


def test_ai_endpoint_returns_503_without_anthropic_key(monkeypatch):
    monkeypatch.setattr(
        anthropic_module,
        "get_settings",
        lambda: Settings(anthropic_api_key=None),
    )
    response = client.post(
        "/api/notifications/draft",
        json={"eventId": "evt-fiestas-2024", "sector": "Restaurantes"},
    )
    assert response.status_code == 503
    assert "ANTHROPIC_API_KEY" in response.json()["detail"]
