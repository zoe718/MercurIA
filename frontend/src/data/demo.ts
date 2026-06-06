export type EventMode = "monitorear" | "analizar" | "planear";

export type EventType =
  | "deportivo"
  | "cultural"
  | "musical"
  | "ferial"
  | "gastronomico"
  | "religioso";

export type EventStatus = "activo" | "planificado" | "finalizado";

export type EconomicEvent = {
  id: string;
  name: string;
  type: EventType;
  subtype: string;
  borough: string;
  venue: string;
  date: string;
  status: EventStatus;
  coordinates: {
    x: number;
    y: number;
  };
  expectedAttendance: number;
  realAttendance?: number;
  estimatedMdp: number;
  realMdp?: number;
  directJobs: number;
  indirectJobs: number;
  benefitedBusinesses: number;
  sectors: Array<{
    name: string;
    share: number;
    amount: number;
  }>;
  insight: string;
};

export type VenueScore = {
  zone: string;
  borough: string;
  score: number;
  estimatedMdp: number;
  reason: string;
};

export type PymeMatch = {
  id: string;
  name: string;
  borough: string;
  sector: string;
  distanceKm: number;
  status: "lista" | "borrador" | "enviada";
};

export const metrics = [
  {
    label: "Derrama estimada 2026",
    value: "$15,840 mdp",
    trend: "+18.4%",
    tone: "success",
  },
  {
    label: "Eventos monitoreados",
    value: "24",
    trend: "8 activos",
    tone: "accent",
  },
  {
    label: "MiPyMEs alcanzables",
    value: "12,460",
    trend: "16 alcaldías",
    tone: "secondary",
  },
  {
    label: "Alertas de oportunidad",
    value: "7",
    trend: "2 críticas",
    tone: "warning",
  },
] as const;

export const events: EconomicEvent[] = [
  {
    id: "evt-f1-2024",
    name: "Gran Premio CDMX 2024",
    type: "deportivo",
    subtype: "automovilismo internacional",
    borough: "Iztacalco",
    venue: "Autódromo Hermanos Rodríguez",
    date: "Oct 2024",
    status: "finalizado",
    coordinates: { x: 70, y: 53 },
    expectedAttendance: 395000,
    realAttendance: 404958,
    estimatedMdp: 7900,
    realMdp: 8429,
    directJobs: 10115,
    indirectJobs: 23600,
    benefitedBusinesses: 71646,
    sectors: [
      { name: "Hotelería", share: 31, amount: 2613 },
      { name: "Restaurantes", share: 23, amount: 1939 },
      { name: "Transporte", share: 16, amount: 1349 },
      { name: "Retail", share: 12, amount: 1011 },
    ],
    insight:
      "El evento superó la estimación por alta ocupación hotelera, visitantes externos y consumo extendido en restaurantes cercanos a Iztacalco y Cuauhtémoc.",
  },
  {
    id: "evt-fiestas-2025",
    name: "Fiestas Patrias Zócalo 2025",
    type: "cultural",
    subtype: "celebración cívica y cultural",
    borough: "Cuauhtémoc",
    venue: "Zócalo capitalino",
    date: "Sep 2025",
    status: "planificado",
    coordinates: { x: 49, y: 43 },
    expectedAttendance: 250000,
    estimatedMdp: 1260,
    directJobs: 1512,
    indirectJobs: 3528,
    benefitedBusinesses: 10710,
    sectors: [
      { name: "Restaurantes", share: 34, amount: 428 },
      { name: "Comercio local", share: 24, amount: 302 },
      { name: "Transporte", share: 18, amount: 227 },
      { name: "Hotelería", share: 11, amount: 139 },
    ],
    insight:
      "El potencial se concentra en restaurantes, comercio local y movilidad nocturna. La recomendación es preparar comunicación a MiPyMEs del Centro Histórico con 10 días de anticipación.",
  },
  {
    id: "evt-coldplay-2024",
    name: "Concierto internacional Foro Sol",
    type: "musical",
    subtype: "concierto internacional",
    borough: "Iztacalco",
    venue: "Foro Sol",
    date: "Oct 2024",
    status: "finalizado",
    coordinates: { x: 73, y: 57 },
    expectedAttendance: 260000,
    realAttendance: 274000,
    estimatedMdp: 5100,
    realMdp: 5380,
    directJobs: 6456,
    indirectJobs: 15064,
    benefitedBusinesses: 45730,
    sectors: [
      { name: "Hotelería", share: 32, amount: 1722 },
      { name: "Restaurantes", share: 20, amount: 1076 },
      { name: "Transporte", share: 15, amount: 807 },
      { name: "Retail", share: 14, amount: 753 },
    ],
    insight:
      "La derrama creció por estancias de más de una noche y compra de mercancía. Hay oportunidad de coordinar promociones por corredor hotelero y rutas de transporte.",
  },
  {
    id: "evt-tianguis-2025",
    name: "Tianguis Turístico CDMX 2025",
    type: "ferial",
    subtype: "turismo y negocios",
    borough: "Miguel Hidalgo",
    venue: "Centro Citibanamex",
    date: "Mar 2025",
    status: "activo",
    coordinates: { x: 36, y: 34 },
    expectedAttendance: 40000,
    estimatedMdp: 920,
    directJobs: 1104,
    indirectJobs: 2576,
    benefitedBusinesses: 7820,
    sectors: [
      { name: "Hotelería", share: 36, amount: 331 },
      { name: "Restaurantes", share: 19, amount: 175 },
      { name: "Turismo", share: 18, amount: 166 },
      { name: "Transporte", share: 13, amount: 120 },
    ],
    insight:
      "El perfil de negocio favorece hoteles, movilidad ejecutiva y restaurantes de alta rotación. Conviene activar MiPyMEs con paquetes para visitantes profesionales.",
  },
  {
    id: "evt-procesion-2025",
    name: "Procesión Semana Santa Iztapalapa",
    type: "religioso",
    subtype: "tradición comunitaria",
    borough: "Iztapalapa",
    venue: "Ruta Cerro de la Estrella",
    date: "Abr 2025",
    status: "activo",
    coordinates: { x: 64, y: 73 },
    expectedAttendance: 1800000,
    estimatedMdp: 680,
    directJobs: 816,
    indirectJobs: 1904,
    benefitedBusinesses: 5780,
    sectors: [
      { name: "Comercio local", share: 38, amount: 258 },
      { name: "Alimentos", share: 29, amount: 197 },
      { name: "Transporte", share: 19, amount: 129 },
      { name: "Servicios", share: 8, amount: 54 },
    ],
    insight:
      "El impacto se distribuye en comercios pequeños y alimentos. La prioridad operativa es ordenar abastecimiento, horarios y rutas de acceso para negocios de barrio.",
  },
];

export const venueScores: VenueScore[] = [
  {
    zone: "Corredor Centro Histórico",
    borough: "Cuauhtémoc",
    score: 92,
    estimatedMdp: 1480,
    reason: "Alta densidad de restaurantes, transporte y comercio local.",
  },
  {
    zone: "Ciudad Deportiva - Foro Sol",
    borough: "Iztacalco",
    score: 88,
    estimatedMdp: 2360,
    reason: "Gran capacidad de recinto y derrama extendida en hotelería.",
  },
  {
    zone: "Chapultepec - Polanco",
    borough: "Miguel Hidalgo",
    score: 84,
    estimatedMdp: 1720,
    reason: "Buena conectividad, oferta hotelera y gasto promedio alto.",
  },
];

export const pymeMatches: PymeMatch[] = [
  {
    id: "pyme-001",
    name: "Hotel Reforma Boutique",
    borough: "Cuauhtémoc",
    sector: "Hotelería",
    distanceKm: 1.2,
    status: "lista",
  },
  {
    id: "pyme-002",
    name: "Taquería Circuito",
    borough: "Iztacalco",
    sector: "Restaurantes",
    distanceKm: 0.8,
    status: "borrador",
  },
  {
    id: "pyme-003",
    name: "Movilidad Ejecutiva MX",
    borough: "Miguel Hidalgo",
    sector: "Transporte",
    distanceKm: 2.4,
    status: "lista",
  },
  {
    id: "pyme-004",
    name: "Artesanías Centro",
    borough: "Cuauhtémoc",
    sector: "Comercio local",
    distanceKm: 0.6,
    status: "enviada",
  },
];
