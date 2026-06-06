"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ExpressionSpecification, GeoJSONSource, Map as MapboxMap } from "mapbox-gl";
import type { Feature, FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import {
  Activity,
  ArrowLeft,
  BarChart3,
  Building2,
  ChevronRight,
  CircleDollarSign,
  Filter,
  LocateFixed,
  MapPinned,
  Target,
  Users,
} from "lucide-react";
import { EconomicEvent, EventMode, events as fallbackEvents } from "@/data/demo";
import {
  VORONOI_SEED_COUNT,
  buildVoronoiGeoJson,
  buildVoronoiPointGeoJson,
  cdmxBoundary,
  voronoiSeedSites,
  voronoiEventProfiles,
  type VoronoiCellProperties,
  type VoronoiEventType,
} from "@/data/voronoi";
import { CDMX_BOUNDS, CDMX_CENTER, MAPBOX_TOKEN } from "@/lib/mapbox";
import { fetchEvents } from "@/lib/api";

const VORONOI_CELL_SOURCE = "voronoi-cells";
const VORONOI_POINT_SOURCE = "voronoi-seeds";
const VORONOI_FILL_LAYER = "voronoi-cells-fill";
const VORONOI_LINE_LAYER = "voronoi-cells-line";
const VORONOI_SELECTED_LAYER = "voronoi-selected-line";
const VORONOI_POINT_LAYER = "voronoi-seed-points";
const VORONOI_LABEL_LAYER = "voronoi-seed-labels";
const CDMX_BOUNDARY_SOURCE = "cdmx-boundary";
const BASE_3D_BUILDINGS_LAYER = "mercuria-base-3d-buildings";
const EVENT_BUILDING_SOURCE = "event-building-highlights";
const EVENT_BUILDING_LAYER = "event-building-highlights-extrusion";
const EVENT_BUILDING_HALO_LAYER = "event-building-highlights-halo";
const EVENT_SYMBOL_SOURCE = "event-location-symbols";
const EVENT_SYMBOL_LAYER = "event-location-symbols-layer";

const modeOptions: Array<{
  id: EventMode;
  label: string;
  icon: typeof Activity;
}> = [
  { id: "monitorear", label: "Monitorear", icon: Activity },
  { id: "analizar", label: "Analizar", icon: BarChart3 },
  { id: "planear", label: "Planear", icon: Target },
];

const voronoiTypeOptions = Object.keys(voronoiEventProfiles) as VoronoiEventType[];

export function FullScreenMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mode, setMode] = useState<EventMode>("planear");
  const [voronoiType, setVoronoiType] = useState<VoronoiEventType>("festivales");
  const [allEvents, setAllEvents] = useState<EconomicEvent[]>(fallbackEvents);
  const [selectedEventId, setSelectedEventId] = useState(fallbackEvents[0].id);
  const [selectedCellId, setSelectedCellId] = useState<string | null>(null);

  const selectedEvent = allEvents.find((event) => event.id === selectedEventId) ?? allEvents[0];
  const voronoiCells = useMemo(() => buildVoronoiGeoJson(voronoiType), [voronoiType]);
  const voronoiPoints = useMemo(() => buildVoronoiPointGeoJson(voronoiType), [voronoiType]);
  const rankedCells = useMemo(
    () =>
      [...voronoiCells.features]
        .sort((a, b) => a.properties.rank - b.properties.rank)
        .slice(0, 15),
    [voronoiCells],
  );
  const selectedCell =
    voronoiCells.features.find((cell) => cell.properties.id === selectedCellId) ??
    rankedCells[0] ??
    voronoiCells.features[0];
  const activeProfile = voronoiEventProfiles[voronoiType];

  useEffect(() => {
    setSelectedCellId(rankedCells[0]?.properties.id ?? null);
  }, [rankedCells, voronoiType]);

  useEffect(() => {
    let cancelled = false;

    async function loadEvents() {
      const backendEvents = await fetchEvents();

      if (!cancelled && backendEvents?.length) {
        setAllEvents(backendEvents);
      }
    }

    loadEvents();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!allEvents.some((event) => event.id === selectedEventId)) {
      setSelectedEventId(allEvents[0].id);
    }
  }, [allEvents, selectedEventId]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    let disposed = false;

    async function initMap() {
      const mapboxgl = (await import("mapbox-gl")).default;

      if (!containerRef.current || disposed) {
        return;
      }

      mapboxgl.accessToken = MAPBOX_TOKEN;

      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [CDMX_CENTER.lng, CDMX_CENTER.lat],
        zoom: 11.15,
        pitch: 52,
        bearing: -16,
        maxBounds: CDMX_BOUNDS,
        attributionControl: true,
      });

      map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");
      map.addControl(new mapboxgl.FullscreenControl(), "top-right");
      map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          showAccuracyCircle: false,
          trackUserLocation: false,
        }),
        "top-right",
      );
      map.addControl(new mapboxgl.ScaleControl({ unit: "metric" }), "bottom-right");

      map.on("load", () => {
        if (map.getSource("composite") && !map.getLayer(BASE_3D_BUILDINGS_LAYER)) {
          map.addLayer({
            id: BASE_3D_BUILDINGS_LAYER,
            type: "fill-extrusion",
            source: "composite",
            "source-layer": "building",
            minzoom: 9,
            paint: {
              "fill-extrusion-color": "#E5EAF0",
              "fill-extrusion-opacity": 0.58,
              "fill-extrusion-height": [
                "interpolate",
                ["linear"],
                ["zoom"],
                9,
                0,
                11,
                10,
                13,
                ["coalesce", ["get", "height"], 14],
              ],
              "fill-extrusion-base": [
                "interpolate",
                ["linear"],
                ["zoom"],
                10,
                0,
                13,
                ["coalesce", ["get", "min_height"], 0],
              ],
            },
          });
        }

        map.addSource(CDMX_BOUNDARY_SOURCE, {
          type: "geojson",
          data: cdmxBoundary,
        });
        map.addSource(VORONOI_CELL_SOURCE, {
          type: "geojson",
          data: buildVoronoiGeoJson(voronoiType),
        });
        map.addSource(VORONOI_POINT_SOURCE, {
          type: "geojson",
          data: buildVoronoiPointGeoJson(voronoiType),
        });
        map.addSource(EVENT_BUILDING_SOURCE, {
          type: "geojson",
          data: emptyEventBuildings(),
        });
        map.addSource(EVENT_SYMBOL_SOURCE, {
          type: "geojson",
          data: buildEventSymbolGeoJson(allEvents),
        });

        map.addLayer({
          id: VORONOI_FILL_LAYER,
          type: "fill",
          source: VORONOI_CELL_SOURCE,
          paint: {
            "fill-color": voronoiFillColor(activeProfile.color, mode),
            "fill-opacity": mode === "monitorear" ? 0.58 : 0.42,
          },
        });
        map.addLayer({
          id: VORONOI_LINE_LAYER,
          type: "line",
          source: VORONOI_CELL_SOURCE,
          paint: {
            "line-color": "rgba(26, 26, 46, 0.38)",
            "line-width": 1.2,
          },
        });
        map.addLayer({
          id: VORONOI_SELECTED_LAYER,
          type: "line",
          source: VORONOI_CELL_SOURCE,
          filter: ["==", ["get", "id"], selectedCellId ?? ""],
          paint: {
            "line-color": "#1A1A2E",
            "line-width": 3,
          },
        });
        map.addLayer({
          id: VORONOI_POINT_LAYER,
          type: "circle",
          source: VORONOI_POINT_SOURCE,
          paint: {
            "circle-color": "#FFFFFF",
            "circle-radius": ["interpolate", ["linear"], ["get", "score"], 0, 4, 100, 9],
            "circle-stroke-color": "#1A1A2E",
            "circle-stroke-width": 2,
          },
        });
        map.addLayer({
          id: VORONOI_LABEL_LAYER,
          type: "symbol",
          source: VORONOI_POINT_SOURCE,
          layout: {
            "text-field": ["to-string", ["get", "rank"]],
            "text-size": 11,
            "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
            "text-offset": [0, 0],
          },
          paint: {
            "text-color": "#1A1A2E",
          },
        });
        map.addLayer({
          id: "cdmx-boundary-line",
          type: "line",
          source: CDMX_BOUNDARY_SOURCE,
          paint: {
            "line-color": "#1A1A2E",
            "line-width": 2.2,
            "line-opacity": 0.72,
          },
        });
        map.addLayer({
          id: EVENT_BUILDING_LAYER,
          type: "fill-extrusion",
          source: EVENT_BUILDING_SOURCE,
          paint: {
            "fill-extrusion-color": [
              "match",
              ["get", "status"],
              "activo",
              "#22C55E",
              "planificado",
              "#F59E0B",
              "finalizado",
              "#4A90D9",
              "#EF4444",
            ],
            "fill-extrusion-opacity": 0.96,
            "fill-extrusion-height": eventBuildingHeightExpression(selectedEventId),
            "fill-extrusion-base": ["coalesce", ["get", "baseHeight"], 0],
            "fill-extrusion-vertical-gradient": true,
          },
        });
        map.addLayer({
          id: EVENT_BUILDING_HALO_LAYER,
          type: "line",
          source: EVENT_BUILDING_SOURCE,
          paint: {
            "line-color": [
              "match",
              ["get", "status"],
              "activo",
              "#15803D",
              "planificado",
              "#B45309",
              "finalizado",
              "#1D4ED8",
              "#1A1A2E",
            ],
            "line-width": eventBuildingLineWidthExpression(selectedEventId),
            "line-opacity": 0.95,
          },
        });
        map.addLayer({
          id: EVENT_SYMBOL_LAYER,
          type: "symbol",
          source: EVENT_SYMBOL_SOURCE,
          layout: {
            "text-field": ["get", "icon"],
            "text-size": [
              "interpolate",
              ["linear"],
              ["zoom"],
              9,
              24,
              12,
              32,
              15,
              26,
            ],
            "text-allow-overlap": true,
            "text-ignore-placement": true,
            "text-offset": [0, -1.15],
          },
          paint: {
            "text-color": [
              "match",
              ["get", "type"],
              "deportivo",
              "#16A34A",
              "cultural",
              "#4A90D9",
              "musical",
              "#F59E0B",
              "ferial",
              "#8A9BAE",
              "gastronomico",
              "#EF4444",
              "religioso",
              "#1A1A2E",
              "civico",
              "#B45309",
              "tecnologico",
              "#7C3AED",
              "#4A90D9",
            ],
            "text-halo-color": "#FFFFFF",
            "text-halo-width": 2.4,
          },
        });

        map.on("click", VORONOI_FILL_LAYER, (event) => {
          const id = event.features?.[0]?.properties?.id;

          if (typeof id === "string") {
            setSelectedCellId(id);
          }
        });
        map.on("click", EVENT_BUILDING_LAYER, (event) => {
          const eventId = event.features?.[0]?.properties?.eventId;

          if (typeof eventId === "string") {
            setSelectedEventId(eventId);
          }
        });
        map.on("click", EVENT_SYMBOL_LAYER, (event) => {
          const eventId = event.features?.[0]?.properties?.eventId;

          if (typeof eventId === "string") {
            setSelectedEventId(eventId);
          }
        });
        map.on("mouseenter", VORONOI_FILL_LAYER, () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseenter", EVENT_BUILDING_LAYER, () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseenter", EVENT_SYMBOL_LAYER, () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", VORONOI_FILL_LAYER, () => {
          map.getCanvas().style.cursor = "";
        });
        map.on("mouseleave", EVENT_BUILDING_LAYER, () => {
          map.getCanvas().style.cursor = "";
        });
        map.on("mouseleave", EVENT_SYMBOL_LAYER, () => {
          map.getCanvas().style.cursor = "";
        });

        map.once("idle", () => {
          syncEventBuildings(map, allEvents, selectedEventId);
          setMapReady(true);
        });
      });

      mapRef.current = map;
    }

    initMap();

    return () => {
      disposed = true;
      mapRef.current?.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;

    if (!map || !mapReady) {
      return;
    }

    syncEventBuildings(map, allEvents, selectedEvent.id);

    if (map.getLayer(EVENT_BUILDING_LAYER)) {
      map.setPaintProperty(EVENT_BUILDING_LAYER, "fill-extrusion-height", eventBuildingHeightExpression(selectedEvent.id));
    }

    if (map.getLayer(EVENT_BUILDING_HALO_LAYER)) {
      map.setPaintProperty(EVENT_BUILDING_HALO_LAYER, "line-width", eventBuildingLineWidthExpression(selectedEvent.id));
    }

    (map.getSource(EVENT_SYMBOL_SOURCE) as GeoJSONSource | undefined)?.setData(buildEventSymbolGeoJson(allEvents));
  }, [allEvents, mapReady, selectedEvent.id]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map || !mapReady) {
      return;
    }

    const sync = () => syncEventBuildings(map, allEvents, selectedEvent.id);

    map.on("moveend", sync);
    map.on("zoomend", sync);

    return () => {
      map.off("moveend", sync);
      map.off("zoomend", sync);
    };
  }, [allEvents, mapReady, selectedEvent.id]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map || !mapReady) {
      return;
    }

    (map.getSource(VORONOI_CELL_SOURCE) as GeoJSONSource | undefined)?.setData(voronoiCells);
    (map.getSource(VORONOI_POINT_SOURCE) as GeoJSONSource | undefined)?.setData(voronoiPoints);

    if (map.getLayer(VORONOI_FILL_LAYER)) {
      map.setPaintProperty(VORONOI_FILL_LAYER, "fill-color", voronoiFillColor(activeProfile.color, mode));
      map.setPaintProperty(VORONOI_FILL_LAYER, "fill-opacity", mode === "monitorear" ? 0.58 : 0.42);
    }
  }, [activeProfile.color, mapReady, mode, voronoiCells, voronoiPoints]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map || !mapReady || !map.getLayer(VORONOI_SELECTED_LAYER)) {
      return;
    }

    map.setFilter(VORONOI_SELECTED_LAYER, ["==", ["get", "id"], selectedCell?.properties.id ?? ""]);
  }, [mapReady, selectedCell]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map || !selectedEvent) {
      return;
    }

    map.flyTo({
      center: [selectedEvent.coordinates.lng, selectedEvent.coordinates.lat],
      zoom: mode === "monitorear" ? 11.05 : mode === "planear" ? 11.4 : 12.35,
      pitch: mode === "monitorear" ? 48 : mode === "planear" ? 52 : 58,
      bearing: mode === "analizar" ? -22 : -16,
      duration: 850,
      essential: true,
    });
  }, [selectedEvent, mode]);

  return (
    <main className="map-screen">
      <div ref={containerRef} className="mapbox-stage" />

      <header className="map-topbar">
        <Link className="back-link" href="/">
          <ArrowLeft size={17} aria-hidden="true" />
          MercurIA
        </Link>
        <span className="map-live">CDMX · límite oficial · {VORONOI_SEED_COUNT} semillas</span>
      </header>

      <section className="map-tools" aria-label="Controles de análisis del mapa">
        <div className="map-mode-control">
          {modeOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                className={option.id === mode ? "active" : ""}
                key={option.id}
                onClick={() => setMode(option.id)}
                type="button"
              >
                <Icon size={16} aria-hidden="true" />
                {option.label}
              </button>
            );
          })}
        </div>

        <label className="map-filter-control">
          <Filter size={16} aria-hidden="true" />
          <select
            aria-label="Tipo de evento para Voronoi"
            value={voronoiType}
            onChange={(event) => {
              setVoronoiType(event.target.value as VoronoiEventType);
            }}
          >
            {voronoiTypeOptions.map((option) => (
              <option key={option} value={option}>
                {voronoiEventProfiles[option].label}
              </option>
            ))}
          </select>
        </label>
      </section>

      <VoronoiLegend profileColor={activeProfile.color} profileLabel={activeProfile.label} />

      <EventSheet
        event={selectedEvent}
        events={allEvents}
        mode={mode}
        selectedCell={selectedCell?.properties}
        rankedCells={rankedCells.map((cell) => cell.properties)}
        onSelectCell={setSelectedCellId}
        onCreateEvent={(event) => {
          setAllEvents((currentEvents) => [event, ...currentEvents]);
          setSelectedEventId(event.id);
          setMode("analizar");
        }}
        voronoiType={voronoiType}
      />

      <section className="map-event-rail" aria-label="Eventos en el mapa">
        {allEvents.map((event) => (
          <button
            className={event.id === selectedEvent.id ? "active" : ""}
            key={event.id}
            onClick={() => setSelectedEventId(event.id)}
            type="button"
          >
            <span className={`rail-dot ${event.status}`} />
            <strong>{event.name}</strong>
            <small>{event.borough}</small>
          </button>
        ))}
      </section>
    </main>
  );
}

function EventSheet({
  event,
  events,
  mode,
  selectedCell,
  rankedCells,
  onSelectCell,
  onCreateEvent,
  voronoiType,
}: {
  event: EconomicEvent;
  events: EconomicEvent[];
  mode: EventMode;
  selectedCell?: VoronoiCellProperties;
  rankedCells: VoronoiCellProperties[];
  onSelectCell: (cellId: string) => void;
  onCreateEvent: (event: EconomicEvent) => void;
  voronoiType: VoronoiEventType;
}) {
  const profile = voronoiEventProfiles[voronoiType];

  return (
    <aside className="event-sheet">
      {mode === "analizar" ? <AnalysisPanel event={event} events={events} /> : null}
      {mode === "monitorear" ? (
        <MonitoringRankingPanel
          cells={rankedCells}
          onSelectCell={onSelectCell}
          profile={profile}
          selectedCellId={selectedCell?.id}
        />
      ) : null}
      {mode === "planear" ? (
        <PlanningPanel
          cells={rankedCells}
          onSelectCell={onSelectCell}
          onCreateEvent={onCreateEvent}
          profile={profile}
          selectedCell={selectedCell}
          voronoiType={voronoiType}
        />
      ) : null}
    </aside>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CircleDollarSign;
  label: string;
  value: string;
}) {
  return (
    <article>
      <Icon size={17} aria-hidden="true" />
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function VoronoiBlock({
  cell,
  profile,
}: {
  cell?: VoronoiCellProperties;
  profile: (typeof voronoiEventProfiles)[VoronoiEventType];
}) {
  if (!cell) {
    return null;
  }

  return (
    <section className="sheet-block voronoi-block">
      <div className="voronoi-block-heading">
        <MapPinned size={17} aria-hidden="true" />
        <div>
          <h2>Zona candidata Voronoi</h2>
          <span>{profile.label} · idoneidad #{cell.rank}</span>
        </div>
        <b>{cell.score}</b>
      </div>
      <strong>{cell.name}</strong>
      <p>{profile.description}</p>
      <code>{cell.weightFormula}</code>
      <div className="variable-tags">
        {cell.topVariables.map((variable) => (
          <span key={variable}>{variable}</span>
        ))}
      </div>
    </section>
  );
}

function AnalysisPanel({ event, events }: { event: EconomicEvent; events: EconomicEvent[] }) {
  const derrama = event.realMdp ?? event.estimatedMdp;
  const variance = event.realMdp ? ((event.realMdp - event.estimatedMdp) / event.estimatedMdp) * 100 : null;
  const portfolio = buildPortfolioDiagnosis(events);
  const share = portfolio.totalMdp > 0 ? (derrama / portfolio.totalMdp) * 100 : 0;

  return (
    <>
      <div className="sheet-eyebrow">
        <span>{statusLabel[event.status]}</span>
        <span>{event.date}</span>
      </div>

      <h1>{event.name}</h1>
      <p>{event.subtype} · {event.venue} · {event.borough}</p>

      <div className="sheet-metrics analysis-metrics">
        <Metric icon={CircleDollarSign} label="Derrama real/estimada" value={`$${formatNumber(derrama)} mdp`} />
        <Metric icon={Users} label="Afluencia" value={formatNumber(event.realAttendance ?? event.expectedAttendance)} />
        <Metric icon={Building2} label="MiPyMEs beneficiadas" value={formatNumber(event.benefitedBusinesses)} />
      </div>

      <section className="sheet-block">
        <h2>Diagnóstico simulado</h2>
        <div className="economic-summary">
          <article>
            <span>Derrama total</span>
            <strong>${formatNumber(portfolio.totalMdp)} mdp</strong>
          </article>
          <article>
            <span>Eventos</span>
            <strong>{formatNumber(portfolio.eventCount)}</strong>
          </article>
          <article>
            <span>Aporte actual</span>
            <strong>{share.toFixed(1)}%</strong>
          </article>
        </div>
      </section>

      <section className="sheet-block">
        <h2>Derrama por evento</h2>
        <div className="economic-summary">
          <article>
            <span>Estimada</span>
            <strong>${formatNumber(event.estimatedMdp)} mdp</strong>
          </article>
          <article>
            <span>{event.realMdp ? "Real" : "Proyectada"}</span>
            <strong>${formatNumber(derrama)} mdp</strong>
          </article>
          <article>
            <span>Variación</span>
            <strong>{variance === null ? "Pendiente" : `${variance > 0 ? "+" : ""}${variance.toFixed(1)}%`}</strong>
          </article>
        </div>
      </section>

      <AnalysisBlock event={event} />

      <button className="sheet-action" type="button">
        Abrir análisis completo
        <ChevronRight size={17} aria-hidden="true" />
      </button>
    </>
  );
}

function AnalysisBlock({ event }: { event: EconomicEvent }) {
  return (
    <section className="sheet-block">
      <h2>Lectura económica</h2>
      <p>{event.insight}</p>
      <div className="sector-bars">
        {event.sectors.slice(0, 3).map((sector, index) => (
          <div key={`${sector.name}-${index}`}>
            <span>{sector.name}</span>
            <i style={{ width: `${sector.share}%` }} />
            <b>{sector.share}%</b>
          </div>
        ))}
      </div>
    </section>
  );
}

function MonitoringRankingPanel({
  cells,
  onSelectCell,
  profile,
  selectedCellId,
}: {
  cells: VoronoiCellProperties[];
  onSelectCell: (cellId: string) => void;
  profile: (typeof voronoiEventProfiles)[VoronoiEventType];
  selectedCellId?: string;
}) {
  return (
    <>
      <div className="sheet-eyebrow">
        <span>Monitoreo territorial</span>
        <span>{profile.label}</span>
      </div>

      <h1>Ranking de derrama</h1>
      <p>Los 15 lugares con mayor potencial para el giro seleccionado, ordenados por score económico y derrama simulada.</p>

      <section className="sheet-block ranking-list">
        {cells.map((cell) => (
          <button
            className={cell.id === selectedCellId ? "ranking-row active" : "ranking-row"}
            key={cell.id}
            onClick={() => onSelectCell(cell.id)}
            type="button"
          >
            <b>#{cell.rank}</b>
            <div>
              <strong>{cell.name}</strong>
              <span>{cell.borough} · ${formatNumber(cell.estimatedMdp)} mdp</span>
              <p>{rankingReason(cell, profile)}</p>
            </div>
            <em>{cell.score}</em>
          </button>
        ))}
      </section>
    </>
  );
}

function PlanningPanel({
  cells,
  onSelectCell,
  onCreateEvent,
  profile,
  selectedCell,
  voronoiType,
}: {
  cells: VoronoiCellProperties[];
  onSelectCell: (cellId: string) => void;
  onCreateEvent: (event: EconomicEvent) => void;
  profile: (typeof voronoiEventProfiles)[VoronoiEventType];
  selectedCell?: VoronoiCellProperties;
  voronoiType: VoronoiEventType;
}) {
  const boroughs = Array.from(new Set(cells.map((cell) => cell.borough))).sort((a, b) => a.localeCompare(b, "es"));
  const targetCell = selectedCell ?? cells[0];

  return (
    <>
      <div className="sheet-eyebrow">
        <span>Planeación</span>
        <span>{profile.label}</span>
      </div>

      <h1>Simular nueva oportunidad</h1>
      <p>Sube un documento o captura variables base para estimar dónde conviene activar el evento o negocio.</p>

      <form
        className="planning-form"
        onSubmit={(formEvent) => {
          formEvent.preventDefault();

          if (!targetCell) {
            return;
          }

          const formData = new FormData(formEvent.currentTarget);
          const budget = Number(formData.get("budget") ?? 0);
          const expectedAttendance = Number(formData.get("attendance") ?? 0);
          const businessTurn = String(formData.get("businessTurn") ?? businessTurnOptions[0]);
          const borough = String(formData.get("borough") ?? targetCell.borough);
          const eventType = String(formData.get("eventType") ?? voronoiType) as VoronoiEventType;
          const eventDate = String(formData.get("eventDate") ?? "");
          const createdEvent = buildSimulatedEvent({
            businessTurn,
            borough,
            budget,
            cell: targetCell,
            eventDate,
            eventType,
            expectedAttendance,
          });

          onCreateEvent(createdEvent);
        }}
      >
        <label className="file-drop">
          <span>Documento base</span>
          <strong>PDF, Word, CSV o JSON</strong>
          <input aria-label="Subir documento de evento" type="file" />
        </label>

        <div className="field-grid">
          <label className="form-field">
            <span>Alcaldía objetivo</span>
            <select defaultValue={targetCell?.borough ?? boroughs[0]} name="borough">
              {boroughs.map((borough) => (
                <option key={borough} value={borough}>
                  {borough}
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            <span>Giro económico</span>
            <select defaultValue={businessTurnOptions[0]} name="businessTurn">
              {businessTurnOptions.map((turn) => (
                <option key={turn} value={turn}>
                  {turn}
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            <span>Tipo de evento</span>
            <select defaultValue={voronoiType} name="eventType">
              {voronoiTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {voronoiEventProfiles[option].label}
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            <span>Presupuesto</span>
            <input defaultValue="2500000" min="0" name="budget" step="50000" type="number" />
          </label>

          <label className="form-field">
            <span>Afluencia esperada</span>
            <input defaultValue="45000" min="0" name="attendance" step="500" type="number" />
          </label>

          <label className="form-field">
            <span>Fecha tentativa</span>
            <input name="eventDate" type="date" />
          </label>
        </div>

        <button className="sheet-action" type="submit">
          Crear evento simulado
          <ChevronRight size={17} aria-hidden="true" />
        </button>
      </form>

      <VoronoiBlock cell={selectedCell} profile={profile} />

      <section className="sheet-block">
        <h2>Zonas sugeridas</h2>
        {cells.slice(0, 3).map((cell) => (
          <button className="compact-row interactive" key={cell.id} onClick={() => onSelectCell(cell.id)} type="button">
            <LocateFixed size={16} aria-hidden="true" />
            <div>
              <strong>{cell.name}</strong>
              <span>{cell.borough} · ${formatNumber(cell.estimatedMdp)} mdp simulados</span>
            </div>
            <b>{cell.score}</b>
          </button>
        ))}
      </section>

    </>
  );
}

function VoronoiLegend({
  profileColor,
  profileLabel,
}: {
  profileColor: string;
  profileLabel: string;
}) {
  return (
    <section className="voronoi-legend" aria-label="Leyenda del Voronoi">
      <div>
        <span style={{ backgroundColor: profileColor }} />
        <strong>{profileLabel}</strong>
      </div>
      <p>Menor idoneidad</p>
      <i />
      <p>Mayor idoneidad</p>
    </section>
  );
}

function voronoiFillColor(highColor: string, mode: EventMode): ExpressionSpecification {
  if (mode === "monitorear") {
    return [
      "interpolate",
      ["linear"],
      ["get", "estimatedMdp"],
      0,
      "rgba(255, 255, 255, 0.2)",
      80,
      "rgba(232, 236, 240, 0.42)",
      180,
      highColor,
      420,
      "#1A1A2E",
    ] as ExpressionSpecification;
  }

  return [
    "interpolate",
    ["linear"],
    ["get", "score"],
    0,
    "rgba(255, 255, 255, 0.28)",
    45,
    "rgba(192, 192, 192, 0.38)",
    100,
    highColor,
  ] as ExpressionSpecification;
}

function eventBuildingHeightExpression(selectedEventId: string): ExpressionSpecification {
  return [
    "interpolate",
    ["linear"],
    ["zoom"],
    9,
    eventBuildingScaledHeight(selectedEventId, 18),
    10.5,
    eventBuildingScaledHeight(selectedEventId, 13),
    12,
    eventBuildingScaledHeight(selectedEventId, 8),
    14,
    eventBuildingScaledHeight(selectedEventId, 3.8),
    16,
    eventBuildingScaledHeight(selectedEventId, 1.5),
  ] as ExpressionSpecification;
}

function eventBuildingLineWidthExpression(selectedEventId: string): ExpressionSpecification {
  return [
    "interpolate",
    ["linear"],
    ["zoom"],
    9,
    eventBuildingScaledLineWidth(selectedEventId, 12),
    11,
    eventBuildingScaledLineWidth(selectedEventId, 8),
    13,
    eventBuildingScaledLineWidth(selectedEventId, 4),
    15,
    eventBuildingScaledLineWidth(selectedEventId, 2),
  ] as ExpressionSpecification;
}

function eventBuildingScaledHeight(selectedEventId: string, zoomScale: number) {
  return [
    "*",
    ["coalesce", ["get", "height"], 42],
    ["case", ["==", ["get", "eventId"], selectedEventId], 1.35, 1],
    zoomScale,
  ];
}

function eventBuildingScaledLineWidth(selectedEventId: string, zoomScale: number) {
  return [
    "*",
    ["case", ["==", ["get", "eventId"], selectedEventId], 1.3, 1],
    zoomScale,
  ];
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: 0,
  }).format(value);
}

type EventBuildingProperties = {
  eventId: string;
  eventName: string;
  status: EconomicEvent["status"];
  height: number;
  baseHeight: number;
};

type EventSymbolProperties = {
  eventId: string;
  icon: string;
  name: string;
  type: EconomicEvent["type"];
};

function emptyEventBuildings(): FeatureCollection<Geometry, EventBuildingProperties> {
  return {
    type: "FeatureCollection",
    features: [],
  };
}

function buildEventSymbolGeoJson(visibleEvents: EconomicEvent[]): FeatureCollection<Geometry, EventSymbolProperties> {
  return {
    type: "FeatureCollection",
    features: visibleEvents.map((event) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [event.coordinates.lng, event.coordinates.lat],
      },
      properties: {
        eventId: event.id,
        icon: eventIconByType[event.type],
        name: event.name,
        type: event.type,
      },
    })),
  };
}

function syncEventBuildings(map: MapboxMap, visibleEvents: EconomicEvent[], selectedEventId: string) {
  const source = map.getSource(EVENT_BUILDING_SOURCE) as GeoJSONSource | undefined;

  if (!source || !map.getLayer(BASE_3D_BUILDINGS_LAYER)) {
    return;
  }

  const highlightedBuildings = visibleEvents
    .map((event) => getEventBuildingFeature(map, event, event.id === selectedEventId))
    .filter((feature): feature is Feature<Geometry, EventBuildingProperties> => Boolean(feature));

  source.setData({
    type: "FeatureCollection",
    features: highlightedBuildings,
  });
}

function getEventBuildingFeature(
  map: MapboxMap,
  event: EconomicEvent,
  isSelected: boolean,
): Feature<Geometry, EventBuildingProperties> | null {
  const screenPoint = map.project([event.coordinates.lng, event.coordinates.lat]);
  const searchRadii = isSelected ? [28, 56, 96, 150, 220] : [18, 42, 76, 130, 190];

  for (const radius of searchRadii) {
    const candidates = map.queryRenderedFeatures(
      [
        [screenPoint.x - radius, screenPoint.y - radius],
        [screenPoint.x + radius, screenPoint.y + radius],
      ],
      { layers: [BASE_3D_BUILDINGS_LAYER] },
    );
    const building = candidates
      .filter((candidate) => candidate.geometry?.type === "Polygon" || candidate.geometry?.type === "MultiPolygon")
      .sort((a, b) => readBuildingHeight(b.properties) - readBuildingHeight(a.properties))[0];

    if (building?.geometry) {
      const height = Math.max(readBuildingHeight(building.properties), isSelected ? 72 : 54);

      return {
        type: "Feature",
        geometry: building.geometry as Geometry,
        properties: {
          eventId: event.id,
          eventName: event.name,
          status: event.status,
          height,
          baseHeight: readBuildingBaseHeight(building.properties),
        },
      };
    }
  }

  return null;
}

function readBuildingHeight(properties: GeoJsonProperties | null | undefined) {
  const value = properties?.height ?? properties?.render_height ?? properties?.levels;
  const parsedValue = Number(value);

  if (Number.isFinite(parsedValue) && parsedValue > 0) {
    return properties?.levels === value ? parsedValue * 3.2 : parsedValue;
  }

  return 18;
}

function readBuildingBaseHeight(properties: GeoJsonProperties | null | undefined) {
  const parsedValue = Number(properties?.min_height);

  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : 0;
}

function rankingReason(
  cell: VoronoiCellProperties,
  profile: (typeof voronoiEventProfiles)[VoronoiEventType],
) {
  const leadingVariables = cell.topVariables.slice(0, 2).join(" + ");

  return `Rank #${cell.rank} por ${leadingVariables}, score ${cell.score} y derrama estimada de $${formatNumber(
    cell.estimatedMdp,
  )} mdp para ${profile.label.toLowerCase()}.`;
}

function buildPortfolioDiagnosis(portfolioEvents: EconomicEvent[]) {
  return portfolioEvents.reduce(
    (summary, event) => ({
      eventCount: summary.eventCount + 1,
      totalAttendance: summary.totalAttendance + (event.realAttendance ?? event.expectedAttendance),
      totalMdp: summary.totalMdp + (event.realMdp ?? event.estimatedMdp),
    }),
    {
      eventCount: 0,
      totalAttendance: 0,
      totalMdp: 0,
    },
  );
}

function buildSimulatedEvent({
  borough,
  budget,
  businessTurn,
  cell,
  eventDate,
  eventType,
  expectedAttendance,
}: {
  borough: string;
  budget: number;
  businessTurn: string;
  cell: VoronoiCellProperties;
  eventDate: string;
  eventType: VoronoiEventType;
  expectedAttendance: number;
}): EconomicEvent {
  const scoreFactor = 0.82 + cell.score / 100;
  const attendanceSpendMdp = (expectedAttendance * averageSpendByType[eventType]) / 1_000_000;
  const budgetMdp = budget / 1_000_000;
  const estimatedMdp = Math.max(12, Math.round((attendanceSpendMdp + budgetMdp * 1.8 + cell.estimatedMdp * 0.28) * scoreFactor));
  const directJobs = Math.max(18, Math.round(estimatedMdp * 1.24));
  const indirectJobs = Math.max(32, Math.round(directJobs * 2.35));
  const benefitedBusinesses = Math.max(120, Math.round(estimatedMdp * 8.5));
  const seed = voronoiSeedSites.find((site) => site.id === cell.id);
  const [lng, lat] = seed?.coordinates ?? [CDMX_CENTER.lng, CDMX_CENTER.lat];
  const displayDate = eventDate ? new Intl.DateTimeFormat("es-MX", { month: "short", year: "numeric" }).format(new Date(eventDate)) : "Simulado";

  return {
    id: `evt-sim-${Date.now()}`,
    name: `Simulación ${businessTurn} - ${cell.name}`,
    type: mapVoronoiTypeToEventType(eventType),
    subtype: `${voronoiEventProfiles[eventType].label.toLowerCase()} · ${businessTurn}`,
    borough,
    venue: cell.name,
    date: displayDate,
    status: "planificado",
    coordinates: { lng, lat },
    expectedAttendance,
    estimatedMdp,
    directJobs,
    indirectJobs,
    benefitedBusinesses,
    sectors: buildSimulatedSectors(estimatedMdp, businessTurn),
    insight: `Evento simulado creado desde Planear. La derrama estimada sube a $${formatNumber(
      estimatedMdp,
    )} mdp por afluencia esperada de ${formatNumber(expectedAttendance)} personas, presupuesto operativo de $${formatNumber(
      budget,
    )} y score territorial ${cell.score} en ${cell.name}.`,
  };
}

function buildSimulatedSectors(estimatedMdp: number, businessTurn: string): EconomicEvent["sectors"] {
  const primary = normalizeBusinessTurn(businessTurn);
  const fallbackSectors = ["Restaurantes", "Hotelería", "Transporte", "Comercio local", "Turismo"];
  const uniqueSectorNames = [primary, ...fallbackSectors].filter(
    (sector, index, sectors) => sectors.indexOf(sector) === index,
  );
  const shares = [36, 22, 17, 13];

  return uniqueSectorNames.slice(0, 4).map((name, index) => ({
    name,
    share: shares[index],
    amount: Math.round((estimatedMdp * shares[index]) / 100),
  }));
}

function normalizeBusinessTurn(turn: string) {
  return turn === "Servicios profesionales" ? "Servicios" : turn;
}

function mapVoronoiTypeToEventType(eventType: VoronoiEventType): EconomicEvent["type"] {
  const typeMap: Record<VoronoiEventType, EconomicEvent["type"]> = {
    culturales: "cultural",
    deportivos: "deportivo",
    festivales: "musical",
    fiestas: "cultural",
    gastronomico: "gastronomico",
    religioso: "religioso",
    turisticos: "ferial",
  };

  return typeMap[eventType];
}

const averageSpendByType: Record<VoronoiEventType, number> = {
  culturales: 920,
  deportivos: 1450,
  festivales: 1850,
  fiestas: 640,
  gastronomico: 1250,
  religioso: 420,
  turisticos: 2100,
};

const businessTurnOptions = [
  "Restaurantes",
  "Hotelería",
  "Comercio local",
  "Transporte",
  "Turismo",
  "Entretenimiento",
  "Servicios profesionales",
  "Artesanías",
] as const;

const eventIconByType = {
  deportivo: "◆",
  cultural: "✦",
  musical: "★",
  ferial: "▣",
  gastronomico: "✚",
  religioso: "✹",
  civico: "✸",
  tecnologico: "⬢",
} satisfies Record<EconomicEvent["type"], string>;

const statusLabel = {
  activo: "Activo",
  planificado: "Planificado",
  finalizado: "Finalizado",
} satisfies Record<EconomicEvent["status"], string>;
