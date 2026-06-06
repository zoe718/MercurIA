"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as MapboxMap, Marker } from "mapbox-gl";
import {
  Activity,
  ArrowLeft,
  BarChart3,
  Building2,
  CalendarClock,
  ChevronRight,
  CircleDollarSign,
  FileUp,
  Filter,
  LocateFixed,
  MapPinned,
  Send,
  Target,
  Users,
} from "lucide-react";
import {
  EconomicEvent,
  EventMode,
  EventType,
  events,
  pymeMatches,
  venueScores,
} from "@/data/demo";
import { CDMX_BOUNDS, CDMX_CENTER, MAPBOX_TOKEN } from "@/lib/mapbox";

const modeOptions: Array<{
  id: EventMode;
  label: string;
  icon: typeof Activity;
}> = [
  { id: "monitorear", label: "Monitorear", icon: Activity },
  { id: "analizar", label: "Analizar", icon: BarChart3 },
  { id: "planear", label: "Planear", icon: Target },
];

const typeOptions: Array<"todos" | EventType> = [
  "todos",
  "deportivo",
  "cultural",
  "musical",
  "ferial",
  "gastronomico",
  "religioso",
];

export function FullScreenMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const markerRefs = useRef<Marker[]>([]);
  const scoreMarkerRefs = useRef<Marker[]>([]);
  const [mode, setMode] = useState<EventMode>("monitorear");
  const [eventType, setEventType] = useState<"todos" | EventType>("todos");
  const [selectedEventId, setSelectedEventId] = useState(events[0].id);

  const filteredEvents = useMemo(() => {
    return eventType === "todos"
      ? events
      : events.filter((event) => event.type === eventType);
  }, [eventType]);

  const selectedEvent =
    filteredEvents.find((event) => event.id === selectedEventId) ??
    filteredEvents[0] ??
    events[0];

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
        zoom: 10.85,
        pitch: 43,
        bearing: -10,
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

      mapRef.current = map;
    }

    initMap();

    return () => {
      disposed = true;
      markerRefs.current.forEach((marker) => marker.remove());
      markerRefs.current = [];
      scoreMarkerRefs.current.forEach((marker) => marker.remove());
      scoreMarkerRefs.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
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

      filteredEvents.forEach((event) => {
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
  }, [filteredEvents, selectedEvent.id]);

  useEffect(() => {
    let cancelled = false;

    async function syncScoreMarkers() {
      const mapboxgl = (await import("mapbox-gl")).default;
      const map = mapRef.current;

      if (!map || cancelled) {
        return;
      }

      scoreMarkerRefs.current.forEach((marker) => marker.remove());
      scoreMarkerRefs.current = [];

      if (mode !== "planear") {
        return;
      }

      venueScores.forEach((score) => {
        const markerNode = document.createElement("div");
        markerNode.className = "score-marker";
        markerNode.textContent = String(score.score);

        const marker = new mapboxgl.Marker({ element: markerNode, anchor: "center" })
          .setLngLat([score.coordinates.lng, score.coordinates.lat])
          .addTo(map);

        scoreMarkerRefs.current.push(marker);
      });
    }

    syncScoreMarkers();

    return () => {
      cancelled = true;
    };
  }, [mode]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map || !selectedEvent) {
      return;
    }

    map.flyTo({
      center: [selectedEvent.coordinates.lng, selectedEvent.coordinates.lat],
      zoom: mode === "planear" ? 10.95 : 12.15,
      pitch: mode === "analizar" ? 50 : 42,
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
        <span className="map-live">CDMX · datos demo</span>
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
            aria-label="Filtrar por tipo de evento"
            value={eventType}
            onChange={(event) => {
              const nextType = event.target.value as "todos" | EventType;
              setEventType(nextType);
              const nextEvent =
                nextType === "todos" ? events[0] : events.find((item) => item.type === nextType);
              if (nextEvent) {
                setSelectedEventId(nextEvent.id);
              }
            }}
          >
            {typeOptions.map((option) => (
              <option key={option} value={option}>
                {option === "todos" ? "Todos los tipos" : capitalize(option)}
              </option>
            ))}
          </select>
        </label>
      </section>

      <EventSheet event={selectedEvent} mode={mode} />

      <section className="map-event-rail" aria-label="Eventos en el mapa">
        {filteredEvents.map((event) => (
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

function EventSheet({ event, mode }: { event: EconomicEvent; mode: EventMode }) {
  const derrama = event.realMdp ?? event.estimatedMdp;

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

      {mode === "planear" ? <PlanningBlock /> : null}
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

function PlanningBlock() {
  return (
    <section className="sheet-block">
      <h2>Zonas con mayor score</h2>
      {venueScores.map((score) => (
        <article className="compact-row" key={score.zone}>
          <LocateFixed size={16} aria-hidden="true" />
          <div>
            <strong>{score.zone}</strong>
            <span>{score.borough} · ${formatNumber(score.estimatedMdp)} mdp</span>
          </div>
          <b>{score.score}</b>
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

function formatNumber(value: number) {
  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: 0,
  }).format(value);
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
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
