import {
  bbox,
  featureCollection,
  intersect,
  point,
  polygon,
  voronoi,
} from "@turf/turf";
import type { Feature, FeatureCollection, Point, Polygon } from "geojson";

export type VoronoiEventType =
  | "fiestas"
  | "festivales"
  | "deportivos"
  | "culturales"
  | "turisticos"
  | "religioso"
  | "gastronomico";

export type VoronoiCellProperties = {
  id: string;
  name: string;
  borough: string;
  eventType: VoronoiEventType;
  score: number;
  rank: number;
  estimatedMdp: number;
  weightFormula: string;
  topVariables: string[];
};

type SeedSite = {
  id: string;
  name: string;
  borough: string;
  coordinates: [number, number];
  capacity: number;
  populationDensity: number;
  transportAccess: number;
  parking: number;
  hotels: number;
  restaurants: number;
  retail: number;
  safety: number;
  incidents: number;
  tourismPois: number;
  routeServices: number;
  culturalFrequency: number;
  expositors: number;
};

export const voronoiEventProfiles: Record<
  VoronoiEventType,
  {
    label: string;
    description: string;
    formula: string;
    color: string;
    variables: string[];
  }
> = {
  fiestas: {
    label: "Fiestas populares",
    description: "Fiestas barriales, patrias y celebraciones de espacio público.",
    formula: "aforo × gasto_alimentos_pp × dias_duracion",
    color: "#F59E0B",
    variables: ["fie_aforo", "fie_gasto_alimentos", "fie_dias_duracion", "fie_radio_conv"],
  },
  festivales: {
    label: "Festivales",
    description: "Festivales de música, arte y experiencias masivas.",
    formula: "capacidad_recinto × precio_boleto × pct_foraneos × dias",
    color: "#4A90D9",
    variables: ["fes_capacidad", "fes_precio_boleto", "fes_pct_foraneos", "fes_noches_hospedaje"],
  },
  deportivos: {
    label: "Deportivos",
    description: "Partidos, carreras, torneos y competencias de alto aforo.",
    formula: "capacidad_sede × ticket_promedio × tipo_competencia_factor",
    color: "#22C55E",
    variables: ["dep_capacidad_sede", "dep_ticket_promedio", "dep_tipo_competencia", "dep_pct_turistas"],
  },
  culturales: {
    label: "Culturales",
    description: "Museos, teatro, cine, exposiciones y calle cultural.",
    formula: "aforo_real × precio_entrada × frecuencia_funcion × duracion_visita",
    color: "#8A9BAE",
    variables: ["cul_aforo_legal", "cul_precio_entrada", "cul_frec_funcion", "cul_accesibilidad"],
  },
  turisticos: {
    label: "Turísticos",
    description: "Rutas, destinos y eventos con visitantes foráneos.",
    formula: "gasto_diario_turista × noches_hospedaje × afluencia_mensual",
    color: "#1A1A2E",
    variables: ["tur_gasto_diario", "tur_noches_hospedaje", "tur_ocup_hotelera", "tur_densidad_pois"],
  },
  religioso: {
    label: "Religioso",
    description: "Procesiones, peregrinaciones y festividades religiosas.",
    formula: "num_peregrinos × gasto_ruta × dias_festividad",
    color: "#EF4444",
    variables: ["rel_ruta_km", "rel_gasto_articulos", "rel_dias_festividad", "rel_infra_ruta"],
  },
  gastronomico: {
    label: "Gastronómico",
    description: "Ferias gastronómicas, muestras culinarias y experiencias de comida.",
    formula: "ticket_promedio × sesiones_dia × num_expositores × duracion_evento",
    color: "#C0C0C0",
    variables: ["gas_ticket_promedio", "gas_sesiones_dia", "gas_num_expositores", "gas_duracion_perm"],
  },
};

export const cdmxBoundary = polygon(
  [
    [
      [-99.365, 19.315],
      [-99.333, 19.392],
      [-99.318, 19.496],
      [-99.258, 19.564],
      [-99.149, 19.592],
      [-99.032, 19.576],
      [-98.958, 19.505],
      [-98.943, 19.396],
      [-98.974, 19.306],
      [-99.021, 19.238],
      [-99.108, 19.186],
      [-99.216, 19.207],
      [-99.299, 19.253],
      [-99.365, 19.315],
    ],
  ],
  { name: "Ciudad de México" },
);

export const voronoiSeedSites: SeedSite[] = [
  {
    id: "seed-zocalo",
    name: "Zócalo Centro Histórico",
    borough: "Cuauhtémoc",
    coordinates: [-99.1332, 19.4326],
    capacity: 240000,
    populationDensity: 16800,
    transportAccess: 9.4,
    parking: 1200,
    hotels: 9200,
    restaurants: 1400,
    retail: 1900,
    safety: 8.1,
    incidents: 34,
    tourismPois: 190,
    routeServices: 84,
    culturalFrequency: 26,
    expositors: 360,
  },
  {
    id: "seed-foro-sol",
    name: "Foro Sol / Ciudad Deportiva",
    borough: "Iztacalco",
    coordinates: [-99.0843, 19.3939],
    capacity: 65000,
    populationDensity: 15200,
    transportAccess: 8.8,
    parking: 7200,
    hotels: 1800,
    restaurants: 520,
    retail: 620,
    safety: 8.4,
    incidents: 18,
    tourismPois: 42,
    routeServices: 56,
    culturalFrequency: 12,
    expositors: 140,
  },
  {
    id: "seed-azteca",
    name: "Estadio Azteca",
    borough: "Coyoacán",
    coordinates: [-99.1505, 19.3029],
    capacity: 83000,
    populationDensity: 11600,
    transportAccess: 7.9,
    parking: 8800,
    hotels: 1300,
    restaurants: 390,
    retail: 480,
    safety: 8,
    incidents: 12,
    tourismPois: 35,
    routeServices: 44,
    culturalFrequency: 10,
    expositors: 110,
  },
  {
    id: "seed-cu",
    name: "Ciudad Universitaria",
    borough: "Coyoacán",
    coordinates: [-99.187, 19.332],
    capacity: 72000,
    populationDensity: 9800,
    transportAccess: 8.2,
    parking: 5200,
    hotels: 900,
    restaurants: 430,
    retail: 390,
    safety: 8.7,
    incidents: 9,
    tourismPois: 70,
    routeServices: 48,
    culturalFrequency: 22,
    expositors: 150,
  },
  {
    id: "seed-chapultepec",
    name: "Bosque de Chapultepec",
    borough: "Miguel Hidalgo",
    coordinates: [-99.1813, 19.4204],
    capacity: 180000,
    populationDensity: 9900,
    transportAccess: 8.6,
    parking: 3500,
    hotels: 8700,
    restaurants: 760,
    retail: 950,
    safety: 8.6,
    incidents: 15,
    tourismPois: 210,
    routeServices: 68,
    culturalFrequency: 30,
    expositors: 240,
  },
  {
    id: "seed-basilica",
    name: "Basílica de Guadalupe",
    borough: "Gustavo A. Madero",
    coordinates: [-99.117, 19.4847],
    capacity: 120000,
    populationDensity: 14100,
    transportAccess: 8.1,
    parking: 2600,
    hotels: 1100,
    restaurants: 680,
    retail: 920,
    safety: 7.9,
    incidents: 22,
    tourismPois: 80,
    routeServices: 95,
    culturalFrequency: 14,
    expositors: 180,
  },
  {
    id: "seed-xochimilco",
    name: "Embarcadero Xochimilco",
    borough: "Xochimilco",
    coordinates: [-99.103, 19.257],
    capacity: 54000,
    populationDensity: 7200,
    transportAccess: 6.7,
    parking: 1900,
    hotels: 540,
    restaurants: 360,
    retail: 260,
    safety: 7.4,
    incidents: 16,
    tourismPois: 120,
    routeServices: 42,
    culturalFrequency: 16,
    expositors: 130,
  },
  {
    id: "seed-coyoacan",
    name: "Centro de Coyoacán",
    borough: "Coyoacán",
    coordinates: [-99.1626, 19.3498],
    capacity: 46000,
    populationDensity: 13200,
    transportAccess: 7.6,
    parking: 900,
    hotels: 700,
    restaurants: 820,
    retail: 610,
    safety: 8.3,
    incidents: 11,
    tourismPois: 135,
    routeServices: 38,
    culturalFrequency: 28,
    expositors: 180,
  },
  {
    id: "seed-arena",
    name: "Arena CDMX",
    borough: "Azcapotzalco",
    coordinates: [-99.175, 19.496],
    capacity: 22300,
    populationDensity: 11800,
    transportAccess: 7.5,
    parking: 5000,
    hotels: 620,
    restaurants: 340,
    retail: 520,
    safety: 7.8,
    incidents: 13,
    tourismPois: 24,
    routeServices: 35,
    culturalFrequency: 11,
    expositors: 120,
  },
  {
    id: "seed-citibanamex",
    name: "Centro Citibanamex",
    borough: "Miguel Hidalgo",
    coordinates: [-99.2197, 19.4401],
    capacity: 48000,
    populationDensity: 8700,
    transportAccess: 7.3,
    parking: 7600,
    hotels: 6400,
    restaurants: 540,
    retail: 740,
    safety: 8.5,
    incidents: 8,
    tourismPois: 95,
    routeServices: 46,
    culturalFrequency: 18,
    expositors: 620,
  },
  {
    id: "seed-iztapalapa",
    name: "Cerro de la Estrella",
    borough: "Iztapalapa",
    coordinates: [-99.0939, 19.344],
    capacity: 220000,
    populationDensity: 17400,
    transportAccess: 7.4,
    parking: 1200,
    hotels: 360,
    restaurants: 560,
    retail: 820,
    safety: 7.2,
    incidents: 28,
    tourismPois: 46,
    routeServices: 76,
    culturalFrequency: 12,
    expositors: 150,
  },
  {
    id: "seed-revolucion",
    name: "Monumento a la Revolución",
    borough: "Cuauhtémoc",
    coordinates: [-99.154, 19.436],
    capacity: 85000,
    populationDensity: 15600,
    transportAccess: 9.1,
    parking: 1300,
    hotels: 6200,
    restaurants: 970,
    retail: 1120,
    safety: 8.2,
    incidents: 20,
    tourismPois: 150,
    routeServices: 64,
    culturalFrequency: 24,
    expositors: 260,
  },
  {
    id: "seed-santa-maria",
    name: "Santa María la Ribera",
    borough: "Cuauhtémoc",
    coordinates: [-99.1582, 19.4471],
    capacity: 36000,
    populationDensity: 14900,
    transportAccess: 8.4,
    parking: 650,
    hotels: 1800,
    restaurants: 420,
    retail: 560,
    safety: 7.8,
    incidents: 17,
    tourismPois: 65,
    routeServices: 36,
    culturalFrequency: 17,
    expositors: 110,
  },
  {
    id: "seed-ajusco",
    name: "Ajusco / Tlalpan",
    borough: "Tlalpan",
    coordinates: [-99.207, 19.246],
    capacity: 38000,
    populationDensity: 5200,
    transportAccess: 5.9,
    parking: 2100,
    hotels: 420,
    restaurants: 210,
    retail: 160,
    safety: 7.1,
    incidents: 10,
    tourismPois: 92,
    routeServices: 26,
    culturalFrequency: 6,
    expositors: 80,
  },
  {
    id: "seed-bicentenario",
    name: "Parque Bicentenario",
    borough: "Azcapotzalco",
    coordinates: [-99.202, 19.469],
    capacity: 52000,
    populationDensity: 10900,
    transportAccess: 7.9,
    parking: 1700,
    hotels: 800,
    restaurants: 310,
    retail: 420,
    safety: 8.1,
    incidents: 9,
    tourismPois: 54,
    routeServices: 32,
    culturalFrequency: 12,
    expositors: 130,
  },
  {
    id: "seed-jamaica",
    name: "Mercado Jamaica / La Viga",
    borough: "Venustiano Carranza",
    coordinates: [-99.124, 19.407],
    capacity: 60000,
    populationDensity: 16000,
    transportAccess: 8.6,
    parking: 900,
    hotels: 800,
    restaurants: 720,
    retail: 1300,
    safety: 7.5,
    incidents: 26,
    tourismPois: 58,
    routeServices: 48,
    culturalFrequency: 11,
    expositors: 310,
  },
  {
    id: "seed-san-angel",
    name: "San Ángel",
    borough: "Álvaro Obregón",
    coordinates: [-99.1908, 19.346],
    capacity: 42000,
    populationDensity: 9600,
    transportAccess: 7.2,
    parking: 1100,
    hotels: 860,
    restaurants: 520,
    retail: 360,
    safety: 8.4,
    incidents: 8,
    tourismPois: 105,
    routeServices: 31,
    culturalFrequency: 20,
    expositors: 150,
  },
  {
    id: "seed-tlahuac",
    name: "Bosque de Tláhuac",
    borough: "Tláhuac",
    coordinates: [-99.012, 19.291],
    capacity: 58000,
    populationDensity: 8200,
    transportAccess: 6.4,
    parking: 1300,
    hotels: 180,
    restaurants: 260,
    retail: 340,
    safety: 7,
    incidents: 18,
    tourismPois: 35,
    routeServices: 39,
    culturalFrequency: 8,
    expositors: 95,
  },
];

export function buildVoronoiGeoJson(
  eventType: VoronoiEventType,
): FeatureCollection<Polygon, VoronoiCellProperties> {
  const scoredSeeds = voronoiSeedSites
    .map((site) => ({ site, score: scoreSeed(site, eventType) }))
    .sort((a, b) => b.score - a.score);
  const maxScore = Math.max(...scoredSeeds.map(({ score }) => score));
  const rankById = new Map(scoredSeeds.map(({ site }, index) => [site.id, index + 1]));
  const points = featureCollection(
    scoredSeeds.map(({ site, score }) =>
      point(site.coordinates, {
        id: site.id,
        name: site.name,
        borough: site.borough,
        eventType,
        rawScore: score,
        score: Math.round((score / maxScore) * 100),
        rank: rankById.get(site.id) ?? 99,
        estimatedMdp: Math.round(score / 1_000_000),
        weightFormula: voronoiEventProfiles[eventType].formula,
        topVariables: voronoiEventProfiles[eventType].variables,
      }),
    ),
  );

  const diagram = voronoi(points, {
    bbox: bbox(cdmxBoundary) as [number, number, number, number],
  });
  const clippedFeatures = diagram.features
    .map((cell) => {
      if (!cell.geometry) {
        return null;
      }

      const clipped = intersect(
        featureCollection([cell as Feature<Polygon>, cdmxBoundary as Feature<Polygon>]),
      );

      if (!clipped || !clipped.geometry) {
        return null;
      }

      return {
        type: "Feature" as const,
        geometry: clipped.geometry,
        properties: cell.properties as VoronoiCellProperties,
      };
    })
    .filter((cell): cell is Feature<Polygon, VoronoiCellProperties> => Boolean(cell));

  return featureCollection(clippedFeatures);
}

export function buildVoronoiPointGeoJson(
  eventType: VoronoiEventType,
): FeatureCollection<Point, VoronoiCellProperties> {
  const cells = buildVoronoiGeoJson(eventType);
  const propertiesById = new Map(cells.features.map((cell) => [cell.properties.id, cell.properties]));

  return featureCollection(
    voronoiSeedSites.map((site) => {
      const properties = propertiesById.get(site.id);
      return point(site.coordinates, {
        id: site.id,
        name: site.name,
        borough: site.borough,
        eventType,
        score: properties?.score ?? 0,
        rank: properties?.rank ?? 99,
        estimatedMdp: properties?.estimatedMdp ?? 0,
        weightFormula: voronoiEventProfiles[eventType].formula,
        topVariables: voronoiEventProfiles[eventType].variables,
      });
    }),
  );
}

function scoreSeed(site: SeedSite, eventType: VoronoiEventType) {
  const safetyMultiplier = 0.82 + site.safety / 50 - site.incidents / 500;
  const accessMultiplier = 0.75 + site.transportAccess / 25;

  switch (eventType) {
    case "fiestas": {
      const aforo = site.capacity * 0.72;
      const gastoAlimentos = 210 + site.restaurants * 0.16 + site.retail * 0.05;
      const dias = site.populationDensity > 14000 ? 3 : 2;
      return aforo * gastoAlimentos * dias * safetyMultiplier;
    }
    case "festivales": {
      const ticket = 780 + site.culturalFrequency * 24;
      const pctForaneos = 0.18 + Math.min(site.hotels / 12000, 0.42);
      const dias = site.capacity > 60000 ? 3 : 2;
      return site.capacity * ticket * pctForaneos * dias * accessMultiplier;
    }
    case "deportivos": {
      const ticket = 520 + site.parking * 0.035;
      const competitionFactor = site.capacity > 70000 ? 2.2 : site.capacity > 45000 ? 1.65 : 1.2;
      const tourists = 1 + Math.min(site.hotels / 9000, 0.5);
      return site.capacity * ticket * competitionFactor * tourists * accessMultiplier;
    }
    case "culturales": {
      const realAforo = site.capacity * 0.46;
      const entry = 120 + site.tourismPois * 1.8;
      const visitHours = 1.35 + site.culturalFrequency / 40;
      return realAforo * entry * site.culturalFrequency * visitHours * safetyMultiplier;
    }
    case "turisticos": {
      const dailySpend = 1150 + site.restaurants * 0.32 + site.tourismPois * 7;
      const nights = 1.15 + Math.min(site.hotels / 9000, 2.1);
      const monthlyVisitors = site.tourismPois * 1800 + site.hotels * 8;
      return dailySpend * nights * monthlyVisitors * accessMultiplier;
    }
    case "religioso": {
      const pilgrims = site.capacity * (site.routeServices > 70 ? 1.8 : 0.95);
      const routeSpend = 95 + site.retail * 0.08 + site.restaurants * 0.11;
      const days = site.routeServices > 70 ? 4 : 2;
      return pilgrims * routeSpend * days * safetyMultiplier;
    }
    case "gastronomico": {
      const ticket = 360 + site.restaurants * 0.2;
      const sessions = site.transportAccess > 8 ? 4 : 3;
      const expositors = site.expositors + site.restaurants * 0.18;
      const durationDays = site.capacity > 70000 ? 4 : 3;
      return ticket * sessions * expositors * durationDays * accessMultiplier * 120;
    }
  }
}
