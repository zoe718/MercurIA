"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ExpressionSpecification, GeoJSONSource, Map as MapboxMap, Marker } from "mapbox-gl";
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
  Send,
  Target,
  Users,
} from "lucide-react";
import { EconomicEvent, EventMode, events, pymeMatches } from "@/data/demo";
import {
  buildVoronoiGeoJson,
  buildVoronoiPointGeoJson,
  cdmxBoundary,
  voronoiEventProfiles,
  type VoronoiCellProperties,
  type VoronoiEventType,
} from "@/data/voronoi";
import { CDMX_BOUNDS, CDMX_CENTER, MAPBOX_TOKEN } from "@/lib/mapbox";

const VORONOI_CELL_SOURCE = "voronoi-cells";
const VORONOI_POINT_SOURCE = "voronoi-seeds";
const VORONOI_FILL_LAYER = "voronoi-cells-fill";
const VORONOI_LINE_LAYER = "voronoi-cells-line";
const VORONOI_SELECTED_LAYER = "voronoi-selected-line";
const VORONOI_POINT_LAYER = "voronoi-seed-points";
const VORONOI_LABEL_LAYER = "voronoi-seed-labels";
const CDMX_BOUNDARY_SOURCE = "cdmx-boundary";

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
  const markerRefs = useRef<Marker[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [mode, setMode] = useState<EventMode>("planear");
  const [voronoiType, setVoronoiType] = useState<VoronoiEventType>("festivales");
  const [selectedEventId, setSelectedEventId] = useState(events[0].id);
  const [selectedCellId, setSelectedCellId] = useState<string | null>(null);

  const selectedEvent = events.find((event) => event.id === selectedEventId) ?? events[0];
  const voronoiCells = useMemo(() => buildVoronoiGeoJson(voronoiType), [voronoiType]);
  const voronoiPoints = useMemo(() => buildVoronoiPointGeoJson(voronoiType), [voronoiType]);
  const topCells = useMemo(
    () =>
      [...voronoiCells.features]
        .sort((a, b) => a.properties.rank - b.properties.rank)
        .slice(0, 5),
    [voronoiCells],
  );
  const selectedCell =
    voronoiCells.features.find((cell) => cell.properties.id === selectedCellId) ??
    topCells[0] ??
    voronoiCells.features[0];
  const activeProfile = voronoiEventProfiles[voronoiType];

  useEffect(() => {
    setSelectedCellId(topCells[0]?.properties.id ?? null);
  }, [topCells, voronoiType]);

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
        zoom: 10.55,
        pitch: 34,
        bearing: -8,
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

        map.addLayer({
          id: VORONOI_FILL_LAYER,
          type: "fill",
          source: VORONOI_CELL_SOURCE,
          paint: {
            "fill-color": voronoiFillColor(activeProfile.color),
            "fill-opacity": 0.46,
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

        map.on("click", VORONOI_FILL_LAYER, (event) => {
          const id = event.features?.[0]?.properties?.id;

          if (typeof id === "string") {
            setSelectedCellId(id);
          }
        });
        map.on("mouseenter", VORONOI_FILL_LAYER, () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", VORONOI_FILL_LAYER, () => {
          map.getCanvas().style.cursor = "";
        });

        setMapReady(true);
      });

      mapRef.current = map;
    }

    initMap();

    return () => {
      disposed = true;
      markerRefs.current.forEach((marker) => marker.remove());
      markerRefs.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function syncMarkers() {
      const mapboxgl = (await import("mapbox-gl")).default;
      const map = mapRef.current;

      if (!map || cancelled) {
        return;
      }

      markerRefs.current.forEach((marker) => marker.remove());
      markerRefs.current = [];

      events.forEach((event) => {
        const markerNode = document.createElement("button");
        markerNode.className = `event-marker ${event.type} ${event.status} ${
          event.id === selectedEvent.id ? "selected" : ""
        }`;
        markerNode.type = "button";
        markerNode.title = event.name;
        markerNode.setAttribute("aria-label", event.name);
        markerNode.addEventListener("click", () => setSelectedEventId(event.id));

        const popup = new mapboxgl.Popup({
          closeButton: false,
          offset: 22,
        }).setHTML(
          `<strong>${event.name}</strong><span>${event.borough} · $${formatNumber(
            event.realMdp ?? event.estimatedMdp,
          )} mdp</span>`,
        );

        const marker = new mapboxgl.Marker({ element: markerNode, anchor: "center" })
          .setLngLat([event.coordinates.lng, event.coordinates.lat])
          .setPopup(popup)
          .addTo(map);

        markerRefs.current.push(marker);
      });
    }

    syncMarkers();

    return () => {
      cancelled = true;
    };
  }, [selectedEvent.id]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map || !mapReady) {
      return;
    }

    (map.getSource(VORONOI_CELL_SOURCE) as GeoJSONSource | undefined)?.setData(voronoiCells);
    (map.getSource(VORONOI_POINT_SOURCE) as GeoJSONSource | undefined)?.setData(voronoiPoints);

    if (map.getLayer(VORONOI_FILL_LAYER)) {
      map.setPaintProperty(VORONOI_FILL_LAYER, "fill-color", voronoiFillColor(activeProfile.color));
    }
  }, [activeProfile.color, mapReady, voronoiCells, voronoiPoints]);

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
      zoom: mode === "planear" ? 10.75 : 12.15,
      pitch: mode === "analizar" ? 50 : 34,
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
        <span className="map-live">CDMX · Voronoi demo · 18 semillas</span>
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
              setMode("planear");
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
        mode={mode}
        selectedCell={selectedCell?.properties}
        topCells={topCells.map((cell) => cell.properties)}
        voronoiType={voronoiType}
      />

      <section className="map-event-rail" aria-label="Eventos en el mapa">
        {events.map((event) => (
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
  mode,
  selectedCell,
  topCells,
  voronoiType,
}: {
  event: EconomicEvent;
  mode: EventMode;
  selectedCell?: VoronoiCellProperties;
  topCells: VoronoiCellProperties[];
  voronoiType: VoronoiEventType;
}) {
  const derrama = event.realMdp ?? event.estimatedMdp;
  const profile = voronoiEventProfiles[voronoiType];

  return (
    <aside className="event-sheet">
      <div className="sheet-eyebrow">
        <span>{statusLabel[event.status]}</span>
        <span>{event.date}</span>
      </div>

      <h1>{event.name}</h1>
      <p>{event.subtype} · {event.venue} · {event.borough}</p>

      <div className="sheet-metrics">
        <Metric icon={CircleDollarSign} label="Derrama" value={`$${formatNumber(derrama)} mdp`} />
        <Metric
          icon={Users}
          label="Afluencia"
          value={formatNumber(event.realAttendance ?? event.expectedAttendance)}
        />
        <Metric
          icon={Building2}
          label="MiPyMEs"
          value={formatNumber(event.benefitedBusinesses)}
        />
      </div>

      <VoronoiBlock cell={selectedCell} profile={profile} />

      {mode === "planear" ? <PlanningBlock cells={topCells} /> : null}
      {mode === "analizar" ? <AnalysisBlock event={event} /> : null}
      {mode === "monitorear" ? <MonitoringBlock /> : null}

      <button className="sheet-action" type="button">
        {mode === "planear" ? "Simular sede" : mode === "analizar" ? "Abrir análisis" : "Notificar MiPyMEs"}
        <ChevronRight size={17} aria-hidden="true" />
      </button>
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
          <h2>Celda Voronoi seleccionada</h2>
          <span>{profile.label} · rank #{cell.rank}</span>
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

function PlanningBlock({ cells }: { cells: VoronoiCellProperties[] }) {
  return (
    <section className="sheet-block">
      <h2>Top zonas para este tipo</h2>
      {cells.slice(0, 4).map((cell) => (
        <article className="compact-row" key={cell.id}>
          <LocateFixed size={16} aria-hidden="true" />
          <div>
            <strong>{cell.name}</strong>
            <span>{cell.borough} · ${formatNumber(cell.estimatedMdp)} mdp simulados</span>
          </div>
          <b>{cell.score}</b>
        </article>
      ))}
    </section>
  );
}

function AnalysisBlock({ event }: { event: EconomicEvent }) {
  return (
    <section className="sheet-block">
      <h2>Lectura económica</h2>
      <p>{event.insight}</p>
      <div className="sector-bars">
        {event.sectors.slice(0, 3).map((sector) => (
          <div key={sector.name}>
            <span>{sector.name}</span>
            <i style={{ width: `${sector.share}%` }} />
            <b>{sector.share}%</b>
          </div>
        ))}
      </div>
    </section>
  );
}

function MonitoringBlock() {
  return (
    <section className="sheet-block">
      <h2>MiPyMEs listas</h2>
      {pymeMatches.slice(0, 3).map((pyme) => (
        <article className="compact-row" key={pyme.id}>
          <Send size={16} aria-hidden="true" />
          <div>
            <strong>{pyme.name}</strong>
            <span>{pyme.sector} · {pyme.distanceKm} km</span>
          </div>
          <b>{pymeStatus[pyme.status]}</b>
        </article>
      ))}
    </section>
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
      <p>Score bajo</p>
      <i />
      <p>Score alto</p>
    </section>
  );
}

function voronoiFillColor(highColor: string): ExpressionSpecification {
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

function formatNumber(value: number) {
  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: 0,
  }).format(value);
}

const statusLabel = {
  activo: "Activo",
  planificado: "Planificado",
  finalizado: "Finalizado",
} satisfies Record<EconomicEvent["status"], string>;

const pymeStatus = {
  lista: "Lista",
  borrador: "Borrador",
  enviada: "Enviada",
} satisfies Record<(typeof pymeMatches)[number]["status"], string>;
