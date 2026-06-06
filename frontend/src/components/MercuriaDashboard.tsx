"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  Bell,
  Building2,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  FileUp,
  Filter,
  LineChart,
  Map as MapIcon,
  MapPinned,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  EconomicEvent,
  EventMode,
  EventType,
  events,
  metrics,
  pymeMatches,
  venueScores,
} from "@/data/demo";

const modeOptions: Array<{
  id: EventMode;
  label: string;
  icon: typeof Activity;
}> = [
  { id: "monitorear", label: "Monitorear", icon: Activity },
  { id: "analizar", label: "Analizar", icon: BarChart3 },
  { id: "planear", label: "Planear", icon: MapPinned },
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

const navItems = [
  { label: "Mapa", icon: MapIcon },
  { label: "Análisis", icon: LineChart },
  { label: "MiPyMEs", icon: Building2 },
  { label: "Alertas", icon: Bell },
];

export function MercuriaDashboard() {
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

  const totalRealOrEstimated = filteredEvents.reduce(
    (sum, event) => sum + (event.realMdp ?? event.estimatedMdp),
    0,
  );

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="Navegación principal">
        <div className="brand-mark" aria-label="MercurIA">
          M
        </div>
        <nav className="icon-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button className="icon-button" key={item.label} title={item.label}>
                <Icon size={19} aria-hidden="true" />
                <span className="sr-only">{item.label}</span>
              </button>
            );
          })}
        </nav>
        <button className="icon-button status-ok" title="Demo activo">
          <ShieldCheck size={19} aria-hidden="true" />
          <span className="sr-only">Demo activo</span>
        </button>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Consola operativa</p>
            <h1>MercurIA</h1>
          </div>
          <div className="topbar-actions">
            <label className="search-box">
              <Search size={16} aria-hidden="true" />
              <input aria-label="Buscar evento o alcaldía" placeholder="Buscar evento o alcaldía" />
            </label>
            <span className="demo-pill">
              <Sparkles size={15} aria-hidden="true" />
              Datos sintéticos
            </span>
          </div>
        </header>

        <section className="metrics-grid" aria-label="Métricas principales">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </section>

        <section className="control-bar" aria-label="Controles del mapa">
          <div className="segmented-control">
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

          <div className="filter-group">
            <Filter size={16} aria-hidden="true" />
            <select
              aria-label="Filtrar por tipo de evento"
              value={eventType}
              onChange={(event) => setEventType(event.target.value as "todos" | EventType)}
            >
              {typeOptions.map((option) => (
                <option key={option} value={option}>
                  {option === "todos" ? "Todos los tipos" : capitalize(option)}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="main-grid">
          <section className="panel map-panel" aria-label="Mapa económico CDMX">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Mapa CDMX</p>
                <h2>{modeCopy[mode].title}</h2>
              </div>
              <span className="panel-total">${formatNumber(totalRealOrEstimated)} mdp</span>
            </div>

            <CDMXMap
              events={filteredEvents}
              mode={mode}
              selectedEventId={selectedEvent.id}
              onSelect={setSelectedEventId}
            />

            <div className="event-strip">
              {filteredEvents.map((event) => (
                <button
                  className={event.id === selectedEvent.id ? "event-chip selected" : "event-chip"}
                  key={event.id}
                  onClick={() => setSelectedEventId(event.id)}
                  type="button"
                >
                  <span className={`status-dot ${event.status}`} />
                  {event.name}
                </button>
              ))}
            </div>
          </section>

          <aside className="panel insight-panel" aria-label="Detalle del evento seleccionado">
            <EventSummary event={selectedEvent} />
            <ModePanel mode={mode} event={selectedEvent} />
          </aside>
        </section>

        <section className="secondary-grid">
          <DerramaChart event={selectedEvent} />
          <SectorBreakdown event={selectedEvent} />
          <NotificationPanel />
          <EventUploader />
        </section>
      </section>
    </main>
  );
}

function MetricCard({
  label,
  value,
  trend,
  tone,
}: {
  label: string;
  value: string;
  trend: string;
  tone: "success" | "accent" | "secondary" | "warning";
}) {
  return (
    <article className={`metric-card ${tone}`}>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
      <span>{trend}</span>
    </article>
  );
}

function CDMXMap({
  events: mapEvents,
  mode,
  selectedEventId,
  onSelect,
}: {
  events: EconomicEvent[];
  mode: EventMode;
  selectedEventId: string;
  onSelect: (eventId: string) => void;
}) {
  return (
    <div className={`map-canvas ${mode}`}>
      <svg className="cdmx-shape" viewBox="0 0 760 520" role="img" aria-label="Mapa sintético de CDMX">
        <path
          className="zone zone-north"
          d="M236 42L376 22L512 55L595 133L574 238L445 218L328 248L214 192L178 96Z"
        />
        <path
          className="zone zone-west"
          d="M112 162L214 192L328 248L300 372L176 414L76 326L58 236Z"
        />
        <path
          className="zone zone-center"
          d="M328 248L445 218L574 238L626 338L528 446L394 428L300 372Z"
        />
        <path
          className="zone zone-south"
          d="M176 414L300 372L394 428L528 446L482 500L302 502L154 472Z"
        />
        <path
          className="city-ring"
          d="M236 42L376 22L512 55L595 133L574 238L626 338L528 446L482 500L302 502L154 472L76 326L58 236L112 162L178 96Z"
        />
      </svg>

      <div className="map-grid" aria-hidden="true" />
      {venueScores.map((score) => (
        <div
          className="score-zone"
          key={score.zone}
          style={{
            left: `${score.zone.includes("Centro") ? 45 : score.zone.includes("Deportiva") ? 68 : 30}%`,
            top: `${score.zone.includes("Centro") ? 44 : score.zone.includes("Deportiva") ? 58 : 32}%`,
          }}
        >
          {score.score}
        </div>
      ))}

      {mapEvents.map((event) => (
        <button
          className={`map-pin ${event.type} ${event.status} ${
            event.id === selectedEventId ? "active" : ""
          }`}
          key={event.id}
          onClick={() => onSelect(event.id)}
          style={{ left: `${event.coordinates.x}%`, top: `${event.coordinates.y}%` }}
          title={event.name}
          type="button"
        >
          <span className="pin-core" />
          <span className="sr-only">{event.name}</span>
        </button>
      ))}

      <div className="map-legend">
        <span><i className="legend-finalizado" /> Finalizado</span>
        <span><i className="legend-activo" /> Activo</span>
        <span><i className="legend-planificado" /> Planificado</span>
      </div>
    </div>
  );
}

function EventSummary({ event }: { event: EconomicEvent }) {
  const derrama = event.realMdp ?? event.estimatedMdp;

  return (
    <section className="event-summary">
      <div className="summary-heading">
        <span className={`status-badge ${event.status}`}>{statusLabel[event.status]}</span>
        <span>{event.date}</span>
      </div>
      <h2>{event.name}</h2>
      <p>{event.subtype} en {event.venue}, {event.borough}</p>

      <div className="summary-stats">
        <div>
          <CircleDollarSign size={17} aria-hidden="true" />
          <span>Derrama</span>
          <strong>${formatNumber(derrama)} mdp</strong>
        </div>
        <div>
          <Users size={17} aria-hidden="true" />
          <span>Afluencia</span>
          <strong>{formatNumber(event.realAttendance ?? event.expectedAttendance)}</strong>
        </div>
        <div>
          <Building2 size={17} aria-hidden="true" />
          <span>Negocios</span>
          <strong>{formatNumber(event.benefitedBusinesses)}</strong>
        </div>
      </div>
    </section>
  );
}

function ModePanel({ mode, event }: { mode: EventMode; event: EconomicEvent }) {
  if (mode === "planear") {
    return (
      <section className="mode-panel">
        <div className="mini-header">
          <Target size={17} aria-hidden="true" />
          <h3>Zonas sugeridas</h3>
        </div>
        <div className="venue-list">
          {venueScores.map((score) => (
            <article className="venue-card" key={score.zone}>
              <div>
                <strong>{score.zone}</strong>
                <span>{score.borough}</span>
              </div>
              <b>{score.score}</b>
              <p>{score.reason}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (mode === "analizar") {
    return (
      <section className="mode-panel ai-panel">
        <div className="mini-header">
          <Sparkles size={17} aria-hidden="true" />
          <h3>Lectura IA</h3>
        </div>
        <p>{event.insight}</p>
        <button className="text-action" type="button">
          Abrir análisis completo
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </section>
    );
  }

  return (
    <section className="mode-panel">
      <div className="mini-header">
        <Activity size={17} aria-hidden="true" />
        <h3>Monitoreo activo</h3>
      </div>
      <div className="watch-list">
        {events
          .filter((item) => item.status !== "finalizado")
          .map((item) => (
            <article key={item.id}>
              <span className={`status-dot ${item.status}`} />
              <div>
                <strong>{item.name}</strong>
                <small>{item.borough} · ${formatNumber(item.estimatedMdp)} mdp</small>
              </div>
            </article>
          ))}
      </div>
    </section>
  );
}

function DerramaChart({ event }: { event: EconomicEvent }) {
  const real = event.realMdp ?? event.estimatedMdp;
  const max = Math.max(event.estimatedMdp, real);

  return (
    <section className="panel chart-panel">
      <div className="panel-header compact">
        <div>
          <p className="eyebrow">Antes / después</p>
          <h2>Derrama</h2>
        </div>
        <TrendingUp size={18} aria-hidden="true" />
      </div>
      <div className="chart-bars">
        <BarRow label="Estimada" value={event.estimatedMdp} max={max} />
        <BarRow label={event.realMdp ? "Real" : "Proyección"} value={real} max={max} highlight />
      </div>
    </section>
  );
}

function BarRow({
  label,
  value,
  max,
  highlight = false,
}: {
  label: string;
  value: number;
  max: number;
  highlight?: boolean;
}) {
  return (
    <div className="bar-row">
      <span>{label}</span>
      <div className="bar-track">
        <div
          className={highlight ? "bar-fill highlight" : "bar-fill"}
          style={{ width: `${Math.max(8, (value / max) * 100)}%` }}
        />
      </div>
      <strong>${formatNumber(value)}</strong>
    </div>
  );
}

function SectorBreakdown({ event }: { event: EconomicEvent }) {
  const maxAmount = Math.max(...event.sectors.map((sector) => sector.amount));

  return (
    <section className="panel sectors-panel">
      <div className="panel-header compact">
        <div>
          <p className="eyebrow">Giros económicos</p>
          <h2>Sectores activados</h2>
        </div>
      </div>
      <div className="sector-list">
        {event.sectors.map((sector) => (
          <div className="sector-row" key={sector.name}>
            <div>
              <strong>{sector.name}</strong>
              <span>{sector.share}% del impacto</span>
            </div>
            <div className="sector-meter">
              <span style={{ width: `${(sector.amount / maxAmount) * 100}%` }} />
            </div>
            <b>${formatNumber(sector.amount)} mdp</b>
          </div>
        ))}
      </div>
    </section>
  );
}

function NotificationPanel() {
  return (
    <section className="panel notification-panel">
      <div className="panel-header compact">
        <div>
          <p className="eyebrow">MiPyMEs</p>
          <h2>Notificaciones</h2>
        </div>
        <button className="icon-action" title="Enviar borrador" type="button">
          <Send size={17} aria-hidden="true" />
          <span className="sr-only">Enviar borrador</span>
        </button>
      </div>
      <div className="notification-list">
        {pymeMatches.map((pyme) => (
          <article key={pyme.id}>
            <div>
              <strong>{pyme.name}</strong>
              <span>{pyme.sector} · {pyme.borough} · {pyme.distanceKm} km</span>
            </div>
            <span className={`pyme-status ${pyme.status}`}>{pymeStatus[pyme.status]}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function EventUploader() {
  return (
    <section className="panel uploader-panel">
      <div className="panel-header compact">
        <div>
          <p className="eyebrow">Alta rápida</p>
          <h2>Documento de evento</h2>
        </div>
        <FileUp size={18} aria-hidden="true" />
      </div>
      <div className="upload-box">
        <CalendarClock size={24} aria-hidden="true" />
        <strong>Convocatoria o cartelera</strong>
        <span>PDF, Word, CSV, imagen o JSON</span>
        <button type="button">
          <CheckCircle2 size={16} aria-hidden="true" />
          Simular extracción
        </button>
      </div>
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

const modeCopy: Record<EventMode, { title: string }> = {
  monitorear: { title: "Eventos y derrama en tiempo real" },
  analizar: { title: "Impacto económico por evento" },
  planear: { title: "Zonas óptimas para nuevos eventos" },
};

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
