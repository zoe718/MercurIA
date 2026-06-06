"use client";

import Link from "next/link";
import { ArrowRight, Building2, MapPinned, RadioTower, Sparkles } from "lucide-react";
import { LandingPreviewMap } from "@/components/LandingPreviewMap";
import { events, metrics } from "@/data/demo";

export function LandingPage() {
  const featuredEvent = events[0];

  return (
    <main className="landing">
      <LandingPreviewMap />

      <header className="landing-nav">
        <Link className="wordmark" href="/">
          MercurIA
        </Link>
        <nav aria-label="Secciones principales">
          <a href="#indicadores">Indicadores</a>
          <Link href="/map">Mapa</Link>
        </nav>
      </header>

      <section className="landing-hero" aria-labelledby="landing-title">
        <p className="kicker">Inteligencia económica · CDMX</p>
        <h1 id="landing-title">MercurIA</h1>
        <p className="hero-lede">
          Decisiones geoespaciales para estimar derrama, ubicar eventos y activar MiPyMEs antes de que la ciudad se mueva.
        </p>
        <div className="hero-actions">
          <Link className="primary-link" href="/map">
            Abrir mapa
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <a className="secondary-link" href="#indicadores">
            Ver señales
          </a>
        </div>
      </section>

      <section className="landing-signal" id="indicadores" aria-label="Indicadores principales">
        <article>
          <RadioTower size={18} aria-hidden="true" />
          <span>Evento referencia</span>
          <strong>{featuredEvent.name}</strong>
        </article>
        <article>
          <MapPinned size={18} aria-hidden="true" />
          <span>Zona activa</span>
          <strong>{featuredEvent.borough}</strong>
        </article>
        <article>
          <Building2 size={18} aria-hidden="true" />
          <span>Negocios beneficiados</span>
          <strong>{formatNumber(featuredEvent.benefitedBusinesses)}</strong>
        </article>
        <article>
          <Sparkles size={18} aria-hidden="true" />
          <span>{metrics[0].label}</span>
          <strong>{metrics[0].value}</strong>
        </article>
      </section>
    </main>
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: 0,
  }).format(value);
}
