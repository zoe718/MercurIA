# Voronoi Map Contract

Este documento describe la capa Voronoi del mapa de MercurIA. El objetivo es que el frontend y backend compartan la misma idea de datos: sitios-semilla dentro de CDMX, variables por tipo de evento, score económico y celdas recortadas al polígono de la ciudad.

## Comportamiento actual

- La ruta `/map` muestra un diagrama de Voronoi sobre Mapbox.
- El diagrama está recortado a un polígono aproximado de Ciudad de México.
- El selector `Tipo de evento para Voronoi` recalcula score, color, variables y ranking.
- Hay 18 sitios-semilla simulados distribuidos en CDMX.
- Al hacer clic en una celda, el panel muestra nombre, alcaldía, score, fórmula y variables principales.

## Tipos soportados

| Tipo | Fórmula base | Variables clave |
|---|---|---|
| `fiestas` | `aforo × gasto_alimentos_pp × dias_duracion` | `fie_aforo`, `fie_gasto_alimentos`, `fie_dias_duracion`, `fie_radio_conv` |
| `festivales` | `capacidad_recinto × precio_boleto × pct_foraneos × dias` | `fes_capacidad`, `fes_precio_boleto`, `fes_pct_foraneos`, `fes_noches_hospedaje` |
| `deportivos` | `capacidad_sede × ticket_promedio × tipo_competencia_factor` | `dep_capacidad_sede`, `dep_ticket_promedio`, `dep_tipo_competencia`, `dep_pct_turistas` |
| `culturales` | `aforo_real × precio_entrada × frecuencia_funcion × duracion_visita` | `cul_aforo_legal`, `cul_precio_entrada`, `cul_frec_funcion`, `cul_accesibilidad` |
| `turisticos` | `gasto_diario_turista × noches_hospedaje × afluencia_mensual` | `tur_gasto_diario`, `tur_noches_hospedaje`, `tur_ocup_hotelera`, `tur_densidad_pois` |
| `religioso` | `num_peregrinos × gasto_ruta × dias_festividad` | `rel_ruta_km`, `rel_gasto_articulos`, `rel_dias_festividad`, `rel_infra_ruta` |
| `gastronomico` | `ticket_promedio × sesiones_dia × num_expositores × duracion_evento` | `gas_ticket_promedio`, `gas_sesiones_dia`, `gas_num_expositores`, `gas_duracion_perm` |

## Simulación frontend

La implementación actual vive en `frontend/src/data/voronoi.ts`.

- `voronoiSeedSites`: 18 sitios-semilla simulados.
- `voronoiEventProfiles`: configuración por tipo de evento.
- `buildVoronoiGeoJson(type)`: devuelve celdas Voronoi recortadas a CDMX.
- `buildVoronoiPointGeoJson(type)`: devuelve puntos-semilla con score y ranking.
- `cdmxBoundary`: polígono aproximado de CDMX para recorte visual.

## Contrato esperado del backend

Cuando backend esté listo, el frontend puede reemplazar la simulación local por:

```http
GET /api/map/voronoi?event_type=festivales
```

Respuesta esperada:

```ts
FeatureCollection<Polygon, {
  id: string;
  name: string;
  borough: string;
  eventType: string;
  score: number;
  rank: number;
  estimatedMdp: number;
  weightFormula: string;
  topVariables: string[];
}>
```

El backend debe devolver celdas ya recortadas a CDMX. Si todavía no hay datos reales, puede seguir usando semillas simuladas, pero debe conservar el shape de propiedades.
