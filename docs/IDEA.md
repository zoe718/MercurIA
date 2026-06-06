# 🏙️ Derrama Económica CDMX — Documento Maestro de Arquitectura

> **Proyecto:** Hackathon SEDECO + Saptiva AI — Reto 3  
> **Versión:** 1.0 (base generativa — diseñado para iteración)  
> **Propósito:** Blueprint completo para que un agente de IA construya el sistema end-to-end  
> **Estado:** Abierto a modificación en todas sus secciones

---

## Índice

1. [Visión general del producto](#1-visión-general-del-producto)
2. [Rúbrica y cómo ganarla](#2-rúbrica-y-cómo-ganarla)
3. [Arquitectura del sistema](#3-arquitectura-del-sistema)
4. [Estructura de carpetas](#4-estructura-de-carpetas)
5. [Backend — especificación completa](#5-backend--especificación-completa)
6. [Frontend — especificación completa](#6-frontend--especificación-completa)
   - [Paleta de colores frontend](#paleta-de-colores-frontend)
7. [Modelos de IA y lógica de decisión](#7-modelos-de-ia-y-lógica-de-decisión)
8. [Datos sintéticos — esquema y ejemplos](#8-datos-sintéticos--esquema-y-ejemplos)
9. [Variables clave por tipo de evento](#9-variables-clave-por-tipo-de-evento)
10. [APIs externas y fuentes de datos](#10-apis-externas-y-fuentes-de-datos)
11. [Flujo de usuario completo](#11-flujo-de-usuario-completo)
12. [Notificaciones a MiPyMEs](#12-notificaciones-a-mipymes)
13. [Sistema de análisis de derrama](#13-sistema-de-análisis-de-derrama)
14. [Stack tecnológico recomendado](#14-stack-tecnológico-recomendado)
15. [Variables de entorno y configuración](#15-variables-de-entorno-y-configuración)
16. [Criterios de calidad y entregables demo](#16-criterios-de-calidad-y-entregables-demo)

---

## 1. Visión general del producto

**DerramaIQ** es una plataforma de inteligencia económica para la Ciudad de México que permite a SEDECO y sus actores relacionados:

- **Planear** dónde realizar un evento usando análisis geoespacial y mapas de Voronoi
- **Analizar** el impacto económico antes y después de cualquier evento (derrama estimada vs derrama real)
- **Monitorear** todos los eventos activos en la CDMX en tiempo real
- **Notificar** a MiPyMEs por zona y giro económico sobre oportunidades vinculadas a eventos próximos
- **Proyectar** derrama futura usando modelos históricos y variables contextuales

La plataforma responde a la lógica operativa de SEDECO: se mueve entre tres audiencias — **inversionistas grandes**, **MiPyMEs locales** y **tomadores de decisión pública** — y el análisis de eventos es el hilo que las conecta.

---

## 2. Rúbrica y cómo ganarla

| Criterio | Puntaje máximo | Cómo lo cumplimos |
|---|---|---|
| A. Calidad de la solución | 5 pts | UX fluida sin fricción, flujo completo sin ayuda del usuario |
| B. Ejecución técnica | 5 pts | Código limpio, README detallado, IA real integrada (Claude/Anthropic) |
| C. Encaje con SEDECO | 5 pts | Lógica legal correcta, adoptable con poco ajuste, vocabulario institucional |

### Estrategia para 15/15

- **A (UX):** Landing → Mapa → Análisis, flujo de 3 clics máximo para llegar a cualquier función principal. Diseño que cualquier funcionario de SEDECO pueda usar sin capacitación.
- **B (Técnica):** Anthropic Claude como motor de análisis narrativo y categorización de eventos. Mapbox para geoespacial. Python/FastAPI en backend con endpoints bien documentados. README con instrucciones de instalación en < 5 minutos.
- **C (Encaje):** Usar terminología exacta de SEDECO (derrama, MiPyMEs, alcaldías, giros económicos, FONDESO). El sistema debe poder alimentarse con datos reales de INEGI, DATATUR y cartelera CDMX sin cambiar la arquitectura.

---

## 3. Arquitectura del sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js)                        │
│  Landing → Mapa CDMX → Panel Análisis → Notificaciones          │
└─────────────────────┬───────────────────────────────────────────┘
                       │ HTTP/REST + WebSocket (notif.)
┌─────────────────────▼───────────────────────────────────────────┐
│                     BACKEND (FastAPI / Python)                   │
│                                                                  │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐  │
│  │  API Routes │  │ AI Engine    │  │  GeoSpatial Engine     │  │
│  │  /events    │  │ Claude API   │  │  Voronoi + Clustering  │  │
│  │  /analysis  │  │ Embeddings   │  │  Mapbox Tiling API     │  │
│  │  /notify    │  │ RAG pipeline │  │  INEGI DENUE API       │  │
│  │  /forecast  │  └──────────────┘  └────────────────────────┘  │
│  └─────────────┘                                                 │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                   Data Layer                                 │ │
│  │  PostgreSQL + PostGIS  │  Redis (cache)  │  JSON sintético  │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                       │
┌─────────────────────▼───────────────────────────────────────────┐
│                     DATOS Y APIs EXTERNAS                        │
│  Mapbox GL JS  │  Anthropic API  │  INEGI DENUE  │  DATATUR     │
│  Cartelera CDMX│  INEGI ENAFIN   │  datos.cdmx   │             │
└─────────────────────────────────────────────────────────────────┘
```

### Principios de diseño

- **API-first:** todo lo que hace el frontend, lo hace a través de endpoints documentados del backend
- **Datos sintéticos plausibles como base:** el sistema funciona 100% sin conectar APIs externas para el demo; las fuentes externas son opcionales y se activan con un flag de entorno
- **IA integrada, no decorativa:** Claude genera narrativa de análisis, clasifica eventos, y sugiere zonas óptimas — no es solo un chatbot añadido al final
- **Preparado para producción:** PostGIS para geoespacial real, Redis para cache de consultas pesadas, estructura modular para escalar

---

## 4. Estructura de carpetas

```
derrama-economica-cdmx/
│
├── README.md                        ← Instrucciones de instalación y demo
├── .env.example                     ← Variables de entorno con descripción
├── docker-compose.yml               ← Levanta todo el stack local
│
├── backend/
│   ├── main.py                      ← Entry point FastAPI
│   ├── requirements.txt
│   ├── Dockerfile
│   │
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes/
│   │   │   ├── events.py            ← CRUD eventos + alta por documento
│   │   │   ├── analysis.py          ← Derrama antes/después + proyecciones
│   │   │   ├── map.py               ← GeoJSON, Voronoi, heatmaps
│   │   │   ├── notifications.py     ← Envío a MiPyMEs
│   │   │   └── forecast.py          ← Proyecciones futuras
│   │   └── middleware/
│   │       ├── auth.py              ← API key simple para demo
│   │       └── cors.py
│   │
│   ├── core/
│   │   ├── config.py                ← Settings desde .env
│   │   ├── database.py              ← Conexión PostgreSQL + PostGIS
│   │   └── redis_client.py
│   │
│   ├── models/
│   │   ├── event.py                 ← Pydantic schemas + SQLAlchemy ORM
│   │   ├── analysis.py
│   │   ├── pyme.py
│   │   ├── notification.py
│   │   └── forecast.py
│   │
│   ├── services/
│   │   ├── ai/
│   │   │   ├── claude_service.py    ← Integración Anthropic API
│   │   │   ├── embeddings.py        ← Vectorización de eventos
│   │   │   ├── narrative.py         ← Generación de análisis narrativo
│   │   │   └── event_classifier.py ← Clasificación por giro y tipo
│   │   │
│   │   ├── geo/
│   │   │   ├── voronoi.py           ← Cálculo de zonas Voronoi
│   │   │   ├── clustering.py        ← K-means para zonas óptimas
│   │   │   ├── heatmap.py           ← Generación de capas de calor
│   │   │   └── venue_scorer.py      ← Score de idoneidad de sede
│   │   │
│   │   ├── economic/
│   │   │   ├── derrama_model.py     ← Modelo de estimación de derrama
│   │   │   ├── multiplier.py        ← Multiplicador económico por sector
│   │   │   ├── employment.py        ← Estimación de empleo directo/indirecto
│   │   │   └── sector_impact.py     ← Impacto por giro económico
│   │   │
│   │   ├── data_ingestion/
│   │   │   ├── document_parser.py   ← Parse PDF/Word/CSV para alta de eventos
│   │   │   ├── inegi_client.py      ← Cliente INEGI DENUE API
│   │   │   ├── datatur_client.py    ← Cliente DATATUR hotelería
│   │   │   └── synthetic_loader.py  ← Carga datos sintéticos para demo
│   │   │
│   │   └── notification/
│   │       ├── pyme_matcher.py      ← Match evento → MiPyMEs relevantes
│   │       └── sender.py            ← Envío email/webhook
│   │
│   └── data/
│       ├── synthetic/
│       │   ├── events.json          ← 15 eventos sintéticos históricos
│       │   ├── pymes.json           ← 50 MiPyMEs sintéticas por alcaldía
│       │   ├── hotel_occupancy.json ← Ocupación hotelera simulada
│       │   └── economic_baselines.json ← Líneas base por zona y giro
│       └── geo/
│           ├── cdmx_alcaldias.geojson
│           └── cdmx_boundary.geojson
│
└── frontend/
    ├── package.json
    ├── next.config.js
    ├── Dockerfile
    ├── tailwind.config.js
    │
    ├── public/
    │   ├── logo.svg
    │   └── assets/
    │
    └── src/
        ├── app/
        │   ├── layout.tsx
        │   ├── page.tsx             ← Landing page
        │   ├── map/
        │   │   └── page.tsx         ← Mapa principal CDMX
        │   ├── analysis/
        │   │   └── [eventId]/
        │   │       └── page.tsx     ← Análisis antes/después de evento
        │   └── notifications/
        │       └── page.tsx         ← Panel de notificaciones a MiPyMEs
        │
        ├── components/
        │   ├── landing/
        │   │   ├── Hero.tsx
        │   │   ├── StatsBar.tsx     ← Métricas clave (derrama acumulada, eventos, etc.)
        │   │   └── HowItWorks.tsx
        │   │
        │   ├── map/
        │   │   ├── CDMXMap.tsx      ← Componente principal Mapbox
        │   │   ├── EventLayer.tsx   ← Capa de eventos actuales
        │   │   ├── VoronoiLayer.tsx ← Capa de zonas Voronoi
        │   │   ├── HeatmapLayer.tsx ← Capa de calor económico
        │   │   ├── MapFilters.tsx   ← Panel de filtros (tipo evento, fecha, alcaldía)
        │   │   ├── MapModeSelector.tsx ← Selector: Planear / Analizar / Monitorear
        │   │   ├── EventPopup.tsx   ← Popup al hacer clic en evento
        │   │   └── VenueScoreCard.tsx ← Card de score de sede sugerida
        │   │
        │   ├── analysis/
        │   │   ├── DerramaChart.tsx ← Gráfica antes/después
        │   │   ├── SectorBreakdown.tsx ← Desglose por giro
        │   │   ├── EmploymentCard.tsx
        │   │   ├── AIInsights.tsx   ← Narrativa generada por Claude
        │   │   └── ForecastPanel.tsx
        │   │
        │   ├── notifications/
        │   │   ├── PymeSelector.tsx
        │   │   ├── MessageComposer.tsx ← Claude genera el mensaje
        │   │   └── NotificationLog.tsx
        │   │
        │   └── shared/
        │       ├── Sidebar.tsx
        │       ├── TopBar.tsx
        │       ├── EventUploader.tsx ← Drag & drop para alta de eventos
        │       └── LoadingStates.tsx
        │
        ├── hooks/
        │   ├── useMapData.ts
        │   ├── useVoronoi.ts
        │   ├── useAnalysis.ts
        │   └── useNotifications.ts
        │
        ├── lib/
        │   ├── api.ts               ← Cliente HTTP hacia el backend
        │   ├── mapbox.ts            ← Configuración y helpers Mapbox
        │   └── formatters.ts        ← Formateo de moneda, fechas, etc.
        │
        └── types/
            ├── event.ts
            ├── analysis.ts
            └── geo.ts
```

---

## 5. Backend — especificación completa

### 5.1 Endpoints principales

#### `/api/events`

```
GET    /api/events                → Lista todos los eventos (con filtros: tipo, alcaldía, fecha)
POST   /api/events                → Alta manual de evento
GET    /api/events/{id}           → Detalle de un evento
PUT    /api/events/{id}           → Actualiza evento
DELETE /api/events/{id}           → Elimina evento
POST   /api/events/upload         → Alta por documento (PDF, CSV, JSON)
GET    /api/events/current        → Eventos activos ahora mismo
GET    /api/events/geojson        → GeoJSON de todos los eventos para Mapbox
```

#### `/api/analysis`

```
GET  /api/analysis/{event_id}              → Análisis completo de un evento
GET  /api/analysis/{event_id}/before       → Métricas pre-evento (estimación)
GET  /api/analysis/{event_id}/after        → Métricas post-evento (real o simulado)
GET  /api/analysis/{event_id}/sectors      → Desglose por giro económico
GET  /api/analysis/{event_id}/employment   → Empleo directo e indirecto
GET  /api/analysis/{event_id}/narrative    → Narrativa generada por Claude
POST /api/analysis/simulate                → Simula derrama de un evento hipotético
```

#### `/api/map`

```
GET  /api/map/voronoi?event_type={type}    → GeoJSON de zonas Voronoi según tipo de evento
GET  /api/map/heatmap?metric={metric}      → Datos de capa de calor (derrama, empleo, ocupación)
GET  /api/map/venue-score                  → Score de idoneidad de sedes para un tipo de evento
GET  /api/map/layers                       → Lista de capas disponibles y sus metadatos
POST /api/map/best-location                → Recibe parámetros de evento y devuelve zonas óptimas
```

#### `/api/notifications`

```
GET  /api/notifications/pymes?zone={zone}&sector={sector}  → MiPyMEs elegibles
POST /api/notifications/send                               → Envía notificación
POST /api/notifications/draft                              → Claude genera borrador de mensaje
GET  /api/notifications/log                                → Historial de notificaciones enviadas
```

#### `/api/forecast`

```
GET  /api/forecast/{event_type}/{alcaldia}  → Proyección de derrama para evento futuro
POST /api/forecast/custom                   → Proyección con parámetros personalizados
```

### 5.2 Schema principal de un Evento

```python
# backend/models/event.py

class EventSchema(BaseModel):
    id: str                          # UUID
    nombre: str
    tipo: EventType                  # deportivo | cultural | gastronómico | cívico | musical | religioso
    subtipo: str                     # ej: "fútbol", "maratón", "festival de cine", "día de muertos"
    fecha_inicio: datetime
    fecha_fin: datetime
    alcaldia: str                    # una de las 16 alcaldías
    lat: float
    lng: float
    venue_nombre: str
    venue_capacidad: int             # aforo máximo del recinto
    afluencia_esperada: int          # visitantes esperados (< venue_capacidad)
    afluencia_real: Optional[int]    # se llena después del evento
    estado: EventState               # planificado | activo | finalizado
    
    # Campos económicos (se rellenan con el modelo de derrama)
    derrama_estimada_mdp: Optional[float]
    derrama_real_mdp: Optional[float]
    empleo_directo: Optional[int]
    empleo_indirecto: Optional[int]
    negocios_beneficiados: Optional[int]
    sectores_activados: Optional[List[str]]  # ["hotelería", "restaurantes", "transporte"]
    
    # Metadatos para IA
    descripcion: Optional[str]
    tags: Optional[List[str]]
    fuente: str                      # "manual" | "documento" | "api_externa" | "sintético"
    
class EventType(str, Enum):
    deportivo = "deportivo"
    cultural = "cultural"
    gastronomico = "gastronomico"
    civico = "civico"
    musical = "musical"
    religioso = "religioso"
    ferial = "ferial"
    tecnologico = "tecnologico"
```

### 5.3 Modelo de derrama económica

```python
# backend/services/economic/derrama_model.py

class DerramaModel:
    """
    Modelo de estimación de derrama económica basado en:
    - Afluencia esperada del evento
    - Tipo de evento (define el perfil de gasto del visitante)
    - Duración en días
    - Alcaldía (define el multiplicador regional)
    - Estacionalidad (mes del año)
    """
    
    # Gasto promedio por visitante según tipo de evento (en pesos)
    GASTO_BASE_VISITANTE = {
        "deportivo_grande":   2800,   # ej: partido FIFA, F1
        "deportivo_mediano":  1200,   # ej: torneo nacional
        "deportivo_pequeño":   450,   # ej: carrera local
        "cultural_grande":    1800,   # ej: festival internacional
        "cultural_mediano":    900,
        "musical_grande":     3200,   # concierto internacional
        "musical_mediano":    1400,
        "gastronomico":       2100,
        "civico":              380,
        "religioso":           420,
        "ferial":             1600,
    }
    
    # Distribución del gasto por sector (% del total)
    DISTRIBUCION_SECTORIAL = {
        "deportivo_grande": {
            "hotelería":      0.28,
            "restaurantes":   0.22,
            "transporte":     0.15,
            "retail":         0.12,
            "entretenimiento":0.10,
            "otros":          0.13,
        },
        "musical_grande": {
            "hotelería":      0.32,
            "restaurantes":   0.20,
            "transporte":     0.12,
            "retail":         0.18,
            "entretenimiento":0.08,
            "otros":          0.10,
        },
        # ... (definir para cada tipo)
    }
    
    # Multiplicador regional por alcaldía (basado en densidad económica INEGI)
    MULTIPLICADOR_ALCALDIA = {
        "Cuauhtémoc":         1.35,
        "Miguel Hidalgo":     1.28,
        "Benito Juárez":      1.22,
        "Álvaro Obregón":     1.10,
        "Coyoacán":           1.08,
        "Iztapalapa":         0.92,
        "Gustavo A. Madero":  0.88,
        "Xochimilco":         0.95,
        # ... todas las 16 alcaldías
    }
    
    # Factor de estacionalidad por mes
    FACTOR_ESTACIONAL = {
        1: 0.75,   # enero (post-fiestas, baja)
        2: 0.80,
        3: 0.90,
        4: 0.95,
        5: 0.92,
        6: 0.88,
        7: 0.85,
        8: 0.88,
        9: 1.10,   # septiembre (Fiestas Patrias, alto)
        10: 1.20,  # octubre (F1, Día de Muertos, muy alto)
        11: 1.15,
        12: 1.18,  # diciembre (Navidad, alto)
    }
    
    # Ratio empleo por cada millón de pesos de derrama
    EMPLEO_POR_MDM = {
        "directo":   12,   # empleos directos por millón de derrama
        "indirecto": 28,   # empleos indirectos por millón de derrama
    }
    
    def estimar_derrama(self, event: EventSchema) -> DerramaResult:
        """
        Calcula derrama total, por sector, empleo generado y negocios beneficiados.
        """
        tipo_key = self._get_tipo_key(event)
        gasto_base = self.GASTO_BASE_VISITANTE[tipo_key]
        multiplicador = self.MULTIPLICADOR_ALCALDIA.get(event.alcaldia, 1.0)
        factor_estacional = self.FACTOR_ESTACIONAL[event.fecha_inicio.month]
        duracion_factor = min(event.duracion_dias * 0.7 + 0.3, 3.0)  # cap en 3x para eventos largos
        
        derrama_base = (
            event.afluencia_esperada 
            * gasto_base 
            * multiplicador 
            * factor_estacional
            * duracion_factor
        ) / 1_000_000  # en millones de pesos
        
        # Distribución sectorial
        distribucion = self.DISTRIBUCION_SECTORIAL.get(tipo_key, self.DISTRIBUCION_SECTORIAL["cultural_mediano"])
        sectores = {sector: derrama_base * pct for sector, pct in distribucion.items()}
        
        # Empleo
        empleo_directo = int(derrama_base * self.EMPLEO_POR_MDM["directo"])
        empleo_indirecto = int(derrama_base * self.EMPLEO_POR_MDM["indirecto"])
        
        # Negocios beneficiados (estimado por DENUE density de la alcaldía)
        negocios = int(derrama_base * 8.5)  # aprox 8.5 negocios por millón
        
        return DerramaResult(
            derrama_total_mdp=round(derrama_base, 2),
            sectores=sectores,
            empleo_directo=empleo_directo,
            empleo_indirecto=empleo_indirecto,
            negocios_beneficiados=negocios,
            confianza=self._calcular_confianza(event),
        )
```

---

## 6. Frontend — especificación completa

### Paleta de colores frontend

Esta paleta es el contrato visual inicial para construir el frontend de MercurIA. Debe usarse como referencia para los tokens de Tailwind/CSS cuando se inicialice la aplicación.

| Token | Color | Uso principal |
|---|---:|---|
| `background` | `#FFFFFF` | Fondo principal blanco puro |
| `primary` | `#C0C0C0` | Mercurio/plata para elementos principales |
| `secondary` | `#8A9BAE` | Azul plateado para navegación, bordes activos y estados secundarios |
| `surface` | `#E8ECF0` | Plata suave para paneles, tablas, filtros y áreas de trabajo |
| `text` | `#1A1A2E` | Carbón profundo para texto principal |
| `accent` | `#4A90D9` | Azul eléctrico para CTAs, highlights y foco |
| `success` | `#22C55E` | Verde para viabilidad, confirmaciones y métricas positivas |
| `warning` | `#F59E0B` | Ámbar para precaución, supuestos y datos incompletos |
| `danger` | `#EF4444` | Rojo para alertas, errores y estados no recomendados |

### 6.1 Landing page (`/`)

**Objetivo:** Comunicar el valor de la plataforma en < 10 segundos. Cualquier funcionario de SEDECO debe entender qué hace sin leer.

**Secciones:**

1. **Hero** — Tagline: *"Inteligencia económica para los eventos de la Ciudad de México"*. CTA principal: "Ver mapa de eventos" → lleva al mapa. CTA secundario: "Explorar una derrama" → abre análisis de ejemplo (Fiestas Patrias 2024).

2. **StatsBar animada** — 4 métricas en tiempo real desde el backend:
   - Total de eventos activos este mes
   - Derrama estimada acumulada en lo que va del año (mdp)
   - MiPyMEs notificadas
   - Alcaldías con mayor actividad

3. **HowItWorks** — 3 pasos visuales: Planear → Analizar → Notificar. Cada uno con ícono, título y descripción de 1 línea.

4. **Eventos destacados** — Carousel de los 3 eventos con mayor derrama estimada del mes.

5. **Footer** — Logo SEDECO, logo Saptiva AI, links a fuentes de datos (INEGI, DATATUR, Cartelera CDMX).

**Estilo:** Fondo oscuro (#0A0F1E navy profundo), acentos en verde SEDECO (#00C48C) y ámbar para alertas. Tipografía: Inter para UI, datos en mono. Sin gradientes decorativos. Limpio y gubernamental pero moderno.

---

### 6.2 Mapa principal (`/map`)

Esta es la sección más importante. Tiene **tres modos** accesibles desde un selector prominente en la parte superior.

#### Layout del mapa

```
┌──────────────────────────────────────────────────────────┐
│  [PLANEAR] [ANALIZAR] [MONITOREAR]     Filtros ▾         │  ← TopBar con selector de modo
├────────────┬─────────────────────────────────────────────┤
│            │                                              │
│  Panel     │                                              │
│  lateral   │         MAPA CDMX (Mapbox)                  │
│            │                                              │
│  (cambia   │         Solo CDMX — bounding box fijo       │
│   según    │         No se permite hacer zoom out        │
│   el modo) │         de los límites de la ciudad         │
│            │                                              │
│            │                                              │
└────────────┴─────────────────────────────────────────────┘
```

**Configuración Mapbox obligatoria:**
```javascript
// Restricción a CDMX
const CDMX_BOUNDS = [
  [-99.365, 19.048],  // SW
  [-98.940, 19.593]   // NE
];

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v11',
  center: [-99.133, 19.432],
  zoom: 10,
  minZoom: 9.5,
  maxZoom: 18,
  maxBounds: CDMX_BOUNDS,
});
```

---

#### MODO 1: PLANEAR

**Para:** un organizador que quiere saber dónde hacer un evento.

**Flujo:**
1. Usuario selecciona el modo "Planear" en el selector
2. El panel lateral muestra un formulario:
   - Tipo de evento (dropdown: deportivo, cultural, musical, etc.)
   - Subtipo (se popula según el tipo)
   - Afluencia esperada (slider: 500 → 100,000+)
   - Duración en días (1-7)
   - Fecha tentativa (datepicker)
3. Al hacer clic en "Analizar zonas óptimas":
   - El mapa muestra la capa Voronoi coloreada por score de idoneidad
   - Se activa la capa de calor de negocios beneficiados (DENUE)
   - Se resaltan los recintos disponibles con mayor compatibilidad
4. El usuario puede hacer clic en cualquier zona del Voronoi para ver:
   - Score de idoneidad (0-100)
   - Por qué es buena o mala (narrativa de Claude)
   - Derrama estimada si pusiera el evento ahí
   - Recintos sugeridos en esa zona

**Lógica del Voronoi:**

Las celdas Voronoi se generan a partir de los puntos de interés relevantes para el tipo de evento. Para deportes masivos, los puntos semilla son los estadios y recintos deportivos. Para culturales, los centros culturales y espacios públicos. Las celdas se colorean por `venue_score` que combina:

```python
venue_score = (
    capacidad_relativa     * 0.25 +  # ¿el aforo aguanta la afluencia esperada?
    accesibilidad_transporte * 0.20 + # ¿hay metro, metrobús, tren ligero cerca?
    densidad_comercial     * 0.20 +  # ¿hay negocios que capten el gasto?
    historial_eventos      * 0.15 +  # ¿ya se han hecho eventos similares aquí?
    ocupacion_hotelera     * 0.10 +  # ¿hay hospedaje disponible?
    factor_estacional      * 0.10    # ¿la temporada favorece este tipo de evento?
)
```

**Variables específicas por tipo de evento deportivo:**
- Para fútbol/atletismo masivo: restringe sugerencias a recintos con capacidad > 20,000
- Para maratones: evalúa la ruta completa, no solo el punto de inicio
- Para deportes de invierno (hipotético): evalúa altitud y clima
- Para torneos (múltiples sedes): optimiza distribución geográfica entre sedes

---

#### MODO 2: ANALIZAR (antes y después)

**Para:** un analista de SEDECO que quiere ver el impacto de un evento pasado o proyectar uno futuro.

**Flujo:**
1. Usuario selecciona el modo "Analizar"
2. El panel lateral muestra un selector de evento (buscador + lista de eventos del sistema)
3. Al seleccionar un evento, el mapa muestra:
   - **Radio de impacto:** círculo de 1-5 km alrededor del evento (ajustable)
   - **Heatmap de derrama:** intensidad de actividad económica en la zona antes vs después
   - **Puntos de negocios beneficiados:** marcadores de establecimientos DENUE en el radio
4. En el panel lateral aparece el análisis completo:
   - Derrama estimada (pre-evento, con bandas de confianza)
   - Derrama real/simulada (post-evento)
   - Variación porcentual
   - Empleo generado
   - Desglose sectorial
   - Narrativa de análisis generada por Claude
5. Toggle "Simulación de futuro": activa la proyección para la próxima edición del mismo evento

**Animación antes/después:**
- Un slider temporal en el mapa permite "viajar en el tiempo" entre el estado previo al evento y el pico del evento
- El heatmap de calor se anima mostrando la expansión de la derrama desde el epicentro del evento hacia los negocios de la zona

---

#### MODO 3: MONITOREAR

**Para:** el equipo de SEDECO que quiere ver todo lo que está pasando en la CDMX ahora mismo.

**Flujo:**
1. El mapa muestra todos los eventos activos como marcadores con ícono por tipo
2. Panel de filtros (siempre visible):
   - Por tipo de evento
   - Por alcaldía
   - Por rango de derrama estimada
   - Por fecha (esta semana / este mes / próximos 30 días)
3. Al aplicar filtros, el mapa se actualiza y el panel lateral muestra:
   - Número de eventos que cumplen el filtro
   - Derrama acumulada estimada de los eventos filtrados
   - Ranking de eventos por impacto económico
4. Al hacer clic en cualquier evento del mapa, aparece un popup con:
   - Nombre y tipo del evento
   - Fechas
   - Afluencia esperada
   - Derrama estimada (mdp)
   - Botón "Ver análisis completo" → lleva al modo Analizar para ese evento

**Capas del mapa siempre disponibles en Monitorear:**
- Capa base: límites de alcaldías de la CDMX (GeoJSON oficial INEGI)
- Capa de eventos: marcadores con cluster automático al alejar el zoom
- Capa de derrama: heatmap de intensidad económica agregada
- Capa de MiPyMEs: puntos de establecimientos DENUE (toggle on/off)

---

### 6.3 Alta de eventos por documento

Flujo: cualquier usuario puede cargar un documento (PDF, Word, CSV, imagen) con información de un evento nuevo. El sistema lo procesa con IA y pre-llena el formulario.

```
Drag & drop o selector de archivo
         ↓
Backend: document_parser.py extrae texto
         ↓
Claude API: extrae campos estructurados del texto
         ↓
Frontend muestra formulario pre-llenado para revisión
         ↓
ANTES de guardar → muestra en el mapa Voronoi
la zona recomendada para ese evento
         ↓
Usuario confirma o ajusta y guarda
```

**Prompt para extracción de campos con Claude:**

```python
EXTRACTION_PROMPT = """
Eres un asistente especializado en eventos urbanos de la Ciudad de México.
Extrae la siguiente información del texto proporcionado y devuelve SOLO un JSON válido.
Si un campo no está presente, usa null.

Campos a extraer:
{
  "nombre": "nombre del evento",
  "tipo": "deportivo|cultural|musical|gastronomico|civico|religioso|ferial",
  "subtipo": "descripción más específica",
  "fecha_inicio": "YYYY-MM-DD",
  "fecha_fin": "YYYY-MM-DD",
  "alcaldia": "una de las 16 alcaldías de CDMX",
  "venue_nombre": "nombre del recinto o lugar",
  "afluencia_esperada": número,
  "descripcion": "resumen breve del evento"
}

Texto del documento:
{document_text}
"""
```

---

### 6.4 Sección de notificaciones a MiPyMEs (`/notifications`)

**Objetivo:** SEDECO puede seleccionar un evento próximo y enviar alertas personalizadas a los negocios de la zona que se verían beneficiados.

**Flujo:**
1. Selección de evento (dropdown de eventos con estado "planificado" o "activo")
2. El sistema automáticamente:
   - Identifica los sectores que ese evento activa (del modelo de derrama)
   - Filtra las MiPyMEs del radio del evento que pertenecen a esos sectores
   - Muestra la lista de MiPyMEs elegibles con su giro, alcaldía y contacto
3. El usuario puede ajustar el radio de búsqueda y los sectores incluidos
4. Botón "Generar mensaje con IA": Claude genera un mensaje personalizado que incluye:
   - Nombre del evento
   - Fecha y lugar
   - Derrama estimada para su giro específico
   - Recomendaciones prácticas (preparar inventario, contratar personal temporal, etc.)
5. El usuario revisa y edita el mensaje
6. Botón "Enviar notificaciones" → envía por email o webhook

**Prompt de Claude para generación de mensaje a MiPyME:**

```python
NOTIFICATION_PROMPT = """
Eres el área de comunicación de SEDECO (Secretaría de Desarrollo Económico de la CDMX).
Escribe un mensaje de alerta económica dirigido a dueños de {sector} en {alcaldia}.

Contexto del evento:
- Nombre: {event_name}
- Tipo: {event_type}
- Fecha: {event_date}
- Lugar: {venue_name}
- Afluencia esperada: {afluencia:,} personas
- Derrama estimada en tu sector: ${derrama_sector:.1f} millones de pesos

El mensaje debe:
1. Ser claro y directo (máximo 150 palabras)
2. Mencionar el beneficio concreto para su tipo de negocio
3. Incluir 2-3 recomendaciones prácticas y específicas
4. Tener un tono oficial pero cercano
5. Incluir los datos de contacto de SEDECO al final

No uses lenguaje burocrático ni frases genéricas.
"""
```

---

## 7. Modelos de IA y lógica de decisión

### 7.1 Claude (Anthropic) — usos concretos

| Función | Modelo | Input | Output |
|---|---|---|---|
| Extracción de campos de documento | claude-sonnet-4-20250514 | Texto del documento | JSON estructurado |
| Narrativa de análisis de derrama | claude-sonnet-4-20250514 | Métricas del evento | Párrafo de análisis |
| Generación de mensaje a MiPyMEs | claude-sonnet-4-20250514 | Contexto del evento + sector | Mensaje personalizado |
| Clasificación de tipo de evento | claude-haiku-4-5-20251001 | Descripción corta | Tipo + subtipo |
| Sugerencia de zona óptima | claude-sonnet-4-20250514 | Parámetros del evento | Explicación de la recomendación |
| Detección de conflictos de calendario | claude-haiku-4-5-20251001 | Fecha + zona + eventos existentes | Alerta de solapamiento |

### 7.2 Modelo geoespacial (Python)

Librerías:
- `scipy.spatial.Voronoi` — cálculo de diagramas de Voronoi
- `shapely` — operaciones geométricas (intersección con límites de CDMX, área de celdas)
- `geopandas` — manejo de datos geoespaciales
- `sklearn.cluster.KMeans` — agrupación de zonas para recomendaciones

**Flujo del Voronoi:**
```python
def generate_voronoi_for_event_type(event_type: str, params: dict) -> GeoJSON:
    # 1. Obtener puntos semilla según tipo de evento
    seed_points = get_seed_points(event_type)  # estadios, centros culturales, etc.
    
    # 2. Calcular Voronoi con scipy
    vor = Voronoi(seed_points)
    
    # 3. Recortar con límite de CDMX (shapely intersection)
    cdmx_boundary = load_cdmx_boundary()
    voronoi_polygons = clip_voronoi_to_boundary(vor, cdmx_boundary)
    
    # 4. Calcular score por celda
    for polygon in voronoi_polygons:
        polygon.score = calculate_venue_score(polygon, event_type, params)
    
    # 5. Retornar como GeoJSON con propiedades de score y color
    return polygons_to_geojson(voronoi_polygons)
```

### 7.3 Modelo económico (Python)

Ver `backend/services/economic/derrama_model.py` en la sección anterior.

**Validación del modelo:**
El modelo se valida contra los datos sintéticos históricos: para cada evento del dataset, la estimación no debe desviarse más del 25% del valor "real" simulado. Si la desviación es mayor, se ajustan los coeficientes.

---

## 8. Datos sintéticos — esquema y ejemplos

El demo funciona con 15 eventos históricos sintéticos más 3 eventos activos y 2 planificados. Todos son plausibles para la CDMX.

```json
[
  {
    "id": "evt_001",
    "nombre": "Gran Premio de México Fórmula 1 2024",
    "tipo": "deportivo",
    "subtipo": "automovilismo",
    "fecha_inicio": "2024-10-25",
    "fecha_fin": "2024-10-27",
    "alcaldia": "Gustavo A. Madero",
    "lat": 19.4042,
    "lng": -99.0907,
    "venue_nombre": "Autódromo Hermanos Rodríguez",
    "venue_capacidad": 135000,
    "afluencia_esperada": 410000,
    "afluencia_real": 427000,
    "estado": "finalizado",
    "derrama_estimada_mdp": 15200,
    "derrama_real_mdp": 15847,
    "empleo_directo": 18200,
    "empleo_indirecto": 42600,
    "negocios_beneficiados": 134700,
    "sectores_activados": ["hotelería", "restaurantes", "transporte", "retail", "entretenimiento"],
    "fuente": "sintético"
  },
  {
    "id": "evt_002",
    "nombre": "Festival Día de Muertos Xochimilco 2024",
    "tipo": "cultural",
    "subtipo": "celebración tradicional",
    "fecha_inicio": "2024-11-01",
    "fecha_fin": "2024-11-03",
    "alcaldia": "Xochimilco",
    "lat": 19.2570,
    "lng": -99.1028,
    "venue_nombre": "Trajineras de Xochimilco y zona lacustre",
    "venue_capacidad": 80000,
    "afluencia_esperada": 220000,
    "afluencia_real": 238000,
    "estado": "finalizado",
    "derrama_estimada_mdp": 2800,
    "derrama_real_mdp": 3040,
    "empleo_directo": 3360,
    "empleo_indirecto": 7840,
    "negocios_beneficiados": 25840,
    "sectores_activados": ["restaurantes", "artesanías", "transporte", "hospedaje"],
    "fuente": "sintético"
  },
  {
    "id": "evt_003",
    "nombre": "Fiestas Patrias CDMX 2024",
    "tipo": "civico",
    "subtipo": "celebración nacional",
    "fecha_inicio": "2024-09-13",
    "fecha_fin": "2024-09-16",
    "alcaldia": "Cuauhtémoc",
    "lat": 19.4326,
    "lng": -99.1332,
    "venue_nombre": "Zócalo y Centro Histórico",
    "venue_capacidad": 500000,
    "afluencia_esperada": 3200000,
    "afluencia_real": 3400000,
    "estado": "finalizado",
    "derrama_estimada_mdp": 8100,
    "derrama_real_mdp": 8429,
    "empleo_directo": 10115,
    "empleo_indirecto": 23602,
    "negocios_beneficiados": 71647,
    "sectores_activados": ["restaurantes", "comercio ambulante", "transporte", "retail", "entretenimiento"],
    "fuente": "sintético"
  },
  {
    "id": "evt_004",
    "nombre": "Maratón de la CDMX 2024",
    "tipo": "deportivo",
    "subtipo": "atletismo",
    "fecha_inicio": "2024-08-25",
    "fecha_fin": "2024-08-25",
    "alcaldia": "Cuauhtémoc",
    "lat": 19.4284,
    "lng": -99.1277,
    "venue_nombre": "Ángel de la Independencia — ruta por Reforma",
    "venue_capacidad": 35000,
    "afluencia_esperada": 30000,
    "afluencia_real": 29400,
    "estado": "finalizado",
    "derrama_estimada_mdp": 420,
    "derrama_real_mdp": 411,
    "empleo_directo": 493,
    "empleo_indirecto": 1149,
    "negocios_beneficiados": 3494,
    "sectores_activados": ["restaurantes", "hotelería", "retail deportivo", "transporte"],
    "fuente": "sintético"
  },
  {
    "id": "evt_005",
    "nombre": "Festival Internacional de Cine FICM 2024",
    "tipo": "cultural",
    "subtipo": "cine",
    "fecha_inicio": "2024-10-17",
    "fecha_fin": "2024-10-27",
    "alcaldia": "Cuauhtémoc",
    "lat": 19.4270,
    "lng": -99.1705,
    "venue_nombre": "Cineteca Nacional y salas alternas",
    "venue_capacidad": 3000,
    "afluencia_esperada": 85000,
    "afluencia_real": 91000,
    "estado": "finalizado",
    "derrama_estimada_mdp": 890,
    "derrama_real_mdp": 954,
    "empleo_directo": 1145,
    "empleo_indirecto": 2671,
    "negocios_beneficiados": 8109,
    "sectores_activados": ["restaurantes", "entretenimiento", "hotelería", "transporte"],
    "fuente": "sintético"
  },
  {
    "id": "evt_006",
    "nombre": "Abierto Mexicano de Tenis Acapulco style — CDMX 2025",
    "tipo": "deportivo",
    "subtipo": "tenis",
    "fecha_inicio": "2025-02-24",
    "fecha_fin": "2025-03-02",
    "alcaldia": "Miguel Hidalgo",
    "lat": 19.4317,
    "lng": -99.2097,
    "venue_nombre": "Foro Sol (hipotético sede alternativa)",
    "venue_capacidad": 65000,
    "afluencia_esperada": 120000,
    "afluencia_real": null,
    "estado": "planificado",
    "derrama_estimada_mdp": 2100,
    "derrama_real_mdp": null,
    "empleo_directo": 2520,
    "empleo_indirecto": 5880,
    "negocios_beneficiados": 17850,
    "sectores_activados": ["hotelería", "restaurantes", "transporte", "retail"],
    "fuente": "sintético"
  },
  {
    "id": "evt_007",
    "nombre": "Festival Gastronómico Sabor CDMX 2024",
    "tipo": "gastronomico",
    "subtipo": "festival de comida",
    "fecha_inicio": "2024-11-08",
    "fecha_fin": "2024-11-10",
    "alcaldia": "Benito Juárez",
    "lat": 19.3984,
    "lng": -99.1591,
    "venue_nombre": "Parque de los Venados",
    "venue_capacidad": 25000,
    "afluencia_esperada": 60000,
    "afluencia_real": 67000,
    "estado": "finalizado",
    "derrama_estimada_mdp": 780,
    "derrama_real_mdp": 870,
    "empleo_directo": 1044,
    "empleo_indirecto": 2436,
    "negocios_beneficiados": 7395,
    "sectores_activados": ["restaurantes", "proveedores de alimentos", "retail", "transporte"],
    "fuente": "sintético"
  },
  {
    "id": "evt_008",
    "nombre": "Concierto Coldplay — Foro Sol 2024",
    "tipo": "musical",
    "subtipo": "concierto internacional",
    "fecha_inicio": "2024-10-03",
    "fecha_fin": "2024-10-06",
    "alcaldia": "Iztacalco",
    "lat": 19.3939,
    "lng": -99.0843,
    "venue_nombre": "Foro Sol",
    "venue_capacidad": 65000,
    "afluencia_esperada": 260000,
    "afluencia_real": 274000,
    "estado": "finalizado",
    "derrama_estimada_mdp": 5100,
    "derrama_real_mdp": 5380,
    "empleo_directo": 6456,
    "empleo_indirecto": 15064,
    "negocios_beneficiados": 45730,
    "sectores_activados": ["hotelería", "restaurantes", "transporte", "retail de entretenimiento"],
    "fuente": "sintético"
  },
  {
    "id": "evt_009",
    "nombre": "Tianguis Turístico de la CDMX 2025",
    "tipo": "ferial",
    "subtipo": "turismo y negocios",
    "fecha_inicio": "2025-03-20",
    "fecha_fin": "2025-03-23",
    "alcaldia": "Cuauhtémoc",
    "lat": 19.4362,
    "lng": -99.1413,
    "venue_nombre": "Centro Citibanamex",
    "venue_capacidad": 18000,
    "afluencia_esperada": 40000,
    "afluencia_real": null,
    "estado": "activo",
    "derrama_estimada_mdp": 920,
    "derrama_real_mdp": null,
    "empleo_directo": 1104,
    "empleo_indirecto": 2576,
    "negocios_beneficiados": 7820,
    "sectores_activados": ["hotelería", "restaurantes", "transporte", "turismo"],
    "fuente": "sintético"
  },
  {
    "id": "evt_010",
    "nombre": "Carrera Panamericana CDMX etapa 2025",
    "tipo": "deportivo",
    "subtipo": "automovilismo clásico",
    "fecha_inicio": "2025-11-10",
    "fecha_fin": "2025-11-12",
    "alcaldia": "Álvaro Obregón",
    "lat": 19.3621,
    "lng": -99.2042,
    "venue_nombre": "Ruta urbana zona sur-poniente",
    "venue_capacidad": 200000,
    "afluencia_esperada": 180000,
    "afluencia_real": null,
    "estado": "planificado",
    "derrama_estimada_mdp": 1840,
    "derrama_real_mdp": null,
    "empleo_directo": 2208,
    "empleo_indirecto": 5152,
    "negocios_beneficiados": 15640,
    "sectores_activados": ["restaurantes", "hoteles", "retail", "gasolineras", "talleres"],
    "fuente": "sintético"
  }
]
```

> Los eventos evt_011 a evt_015 completan el dataset histórico con: Festival Cumbre Tajín (cultural, Gustavo A. Madero), Clásico Regio en Azteca (deportivo, Iztapalapa), Vive Latino (musical, Cuauhtémoc), Semana de la Moda CDMX (ferial, Miguel Hidalgo) y Procesión de Semana Santa en Iztapalapa (religioso, Iztapalapa).

---

## 9. Variables clave por tipo de evento

### Deportivo — fútbol / estadio masivo

```python
VARIABLES_FUTBOL = {
    "restriccion_venue": {"capacidad_minima": 20000},
    "radio_impacto_km": 5,
    "factor_turistas_externos": 0.35,  # % visitantes de fuera de CDMX
    "dias_anticipacion_hotel": 1.8,    # promedio de días de reserva anticipada
    "gasto_promedio_visitante": 2400,
    "picos_horarios": ["16h-20h", "19h-23h"],  # según hora del partido
    "sectores_primarios": ["restaurantes", "transporte", "retail deportivo"],
    "sectores_secundarios": ["hotelería", "entretenimiento"],
    "venues_compatibles": ["Estadio Azteca", "Estadio Olímpico Universitario", 
                           "Estadio Azul", "Estadio Ciudad de los Deportes"],
}
```

### Musical — concierto internacional

```python
VARIABLES_CONCIERTO = {
    "restriccion_venue": {"capacidad_minima": 10000},
    "radio_impacto_km": 4,
    "factor_turistas_externos": 0.45,
    "dias_anticipacion_hotel": 2.2,
    "gasto_promedio_visitante": 3200,
    "picos_horarios": ["18h-24h"],
    "sectores_primarios": ["hotelería", "restaurantes", "retail"],
    "sectores_secundarios": ["transporte", "entretenimiento"],
    "venues_compatibles": ["Foro Sol", "Palacio de los Deportes", "Arena CDMX",
                           "Auditorio Nacional", "Zócalo (gratuito)"],
    "multiplicador_redes_sociales": 1.4,  # conciertos generan más gasto por redes
}
```

### Cultural — festival / festividad tradicional

```python
VARIABLES_CULTURAL = {
    "restriccion_venue": {"tipo": "espacio_público"},
    "radio_impacto_km": 3,
    "factor_turistas_externos": 0.28,
    "gasto_promedio_visitante": 900,
    "picos_horarios": ["10h-22h"],
    "sectores_primarios": ["restaurantes", "artesanías", "comercio ambulante"],
    "sectores_secundarios": ["transporte", "hotelería"],
    "variables_especiales": {
        "Día de Muertos": {"multiplicador": 1.8, "alcaldias_principales": ["Iztapalapa", "Xochimilco", "Mixquic"]},
        "Fiestas Patrias": {"multiplicador": 2.1, "alcaldia_principal": "Cuauhtémoc"},
    }
}
```

---

## 10. APIs externas y fuentes de datos

Todas las APIs externas son **opcionales para el demo** — el sistema funciona con datos sintéticos si las API keys no están disponibles. Se activan con flags en `.env`.

| API | Propósito | Clave de entorno | Modo demo |
|---|---|---|---|
| Mapbox GL JS | Visualización de mapas | `MAPBOX_TOKEN` | **Requerida** (free tier suficiente) |
| Anthropic Claude | Análisis narrativo, extracción, notificaciones | `ANTHROPIC_API_KEY` | **Requerida** |
| INEGI DENUE | Directorio de establecimientos | `USE_INEGI_API=true` | Sintético si false |
| DATATUR SECTUR | Ocupación hotelera | `USE_DATATUR_API=true` | Sintético si false |
| Cartelera CDMX | Eventos actuales | `USE_CARTELERA_API=true` | Sintético si false |
| SendGrid / Resend | Envío de notificaciones email | `EMAIL_API_KEY` | Log a consola si vacío |

### Endpoints INEGI DENUE (para producción)

```
Base URL: https://www.inegi.org.mx/servicios/api_denue/v1/consulta/

GET /BuscarAreaAct/{lat}/{lng}/{radio_mt}/{actividad}/{token}
→ Establecimientos por actividad económica en radio geográfico

Actividades relevantes:
- 7211 = hoteles
- 7221 = restaurantes
- 4853 = taxis y transporte
- 4711 = tiendas de abarrotes
- 7111 = artes escénicas
```

---

## 11. Flujo de usuario completo

```
LANDING PAGE
     │
     ├─── CTA "Ver mapa" ──────────────────────────────────────────┐
     │                                                              │
     └─── CTA "Explorar derrama" → abre análisis Fiestas Patrias   │
                                                                    ▼
                                                         MAPA CDMX
                                                              │
                              ┌───────────────────────────────┼───────────────────────┐
                              ▼                               ▼                       ▼
                          PLANEAR                         ANALIZAR               MONITOREAR
                              │                               │                       │
                    Form parámetros               Seleccionar evento          Ver todos los eventos
                    de nuevo evento               (lista o clic en mapa)      con filtros
                              │                               │                       │
                    API → Voronoi                  API → métricas antes/       Heatmap de derrama
                    + scoring de sedes             después + narrativa Claude   agregada
                              │                               │                       │
                    Mapa muestra zonas             Panel con charts +          Clic en evento
                    coloreadas por score           AI insights                 → popup + link
                              │                               │                 a análisis
                    Clic en zona → detalle         Slider temporal              
                    + derrama estimada             animado en mapa              
                              │                               │                       
                    Botón "Dar de alta              Botón "Notificar             Botón "Notificar
                    evento aquí"                   MiPyMEs de zona"            MiPyMEs"
                              │                               │                       │
                              └───────────────────────────────┴───────────────────────┘
                                                              │
                                                    PANEL NOTIFICACIONES
                                                              │
                                              Lista MiPyMEs elegibles por zona
                                                              │
                                              Claude genera mensaje personalizado
                                                              │
                                              Usuario revisa → Enviar
```

---

## 12. Notificaciones a MiPyMEs

### Lógica de matching

```python
def match_pymes_to_event(event: EventSchema, radius_km: float = 3.0) -> List[Pyme]:
    """
    Encuentra MiPyMEs elegibles para notificación basándose en:
    1. Proximidad geográfica al evento (dentro del radio)
    2. Giro económico compatible con los sectores que activa el evento
    3. MiPyMEs que no han sido notificadas en los últimos 7 días (evitar spam)
    """
    sectores_relevantes = SECTOR_TO_GIRO_MAP[event.tipo]
    
    pymes_cercanas = db.query(Pyme).filter(
        ST_DWithin(Pyme.location, event.location, radius_km * 1000),
        Pyme.giro.in_(sectores_relevantes),
        Pyme.ultima_notificacion < datetime.now() - timedelta(days=7)
    ).all()
    
    return pymes_cercanas
```

### Tipos de MiPyME en el dataset sintético

```json
{
  "sectores_representados": [
    "restaurante", "taquería", "hotel boutique", "hostal",
    "transporte privado", "taxi", "comercio de artesanías",
    "tienda de ropa deportiva", "papelería", "farmacia",
    "estacionamiento", "bar", "cafetería", "panadería",
    "agencia de viajes", "tour operador", "renta de bicicletas"
  ]
}
```

---

## 13. Sistema de análisis de derrama

### Flujo completo de un análisis

```python
async def get_full_analysis(event_id: str) -> AnalysisResult:
    event = await db.get_event(event_id)
    
    # 1. Cálculo cuantitativo
    derrama = derrama_model.estimar_derrama(event)
    
    # 2. Si el evento ya ocurrió, comparar estimado vs real
    if event.estado == "finalizado" and event.derrama_real_mdp:
        variacion = ((event.derrama_real_mdp - derrama.derrama_total_mdp) 
                     / derrama.derrama_total_mdp * 100)
        precision = f"{100 - abs(variacion):.1f}%"
    
    # 3. Contexto geoespacial
    negocios_en_radio = await inegi_client.get_establecimientos(
        lat=event.lat, lng=event.lng, radius=3000
    )
    
    # 4. Narrativa con Claude
    narrative = await claude_service.generate_narrative(
        event=event,
        derrama=derrama,
        negocios_count=len(negocios_en_radio),
        context="análisis de impacto económico para SEDECO CDMX"
    )
    
    # 5. Proyección para próxima edición
    forecast = forecast_model.proyectar_siguiente_edicion(event, derrama)
    
    return AnalysisResult(
        event=event,
        derrama=derrama,
        narrative=narrative,
        forecast=forecast,
        negocios_en_radio=len(negocios_en_radio),
    )
```

### Prompt de narrativa Claude

```python
NARRATIVE_PROMPT = """
Eres un analista económico de SEDECO (Secretaría de Desarrollo Económico de la Ciudad de México).
Genera un análisis ejecutivo de máximo 200 palabras sobre el impacto económico del siguiente evento.

Datos del evento:
- Nombre: {event_name}
- Tipo: {event_type}
- Alcaldía: {alcaldia}
- Fecha: {fecha}
- Afluencia: {afluencia:,} personas
- Derrama estimada: ${derrama_estimada:.0f} millones de pesos
- Derrama real: ${derrama_real:.0f} millones de pesos (si disponible)
- Empleo directo generado: {empleo_directo:,} personas
- Empleo indirecto: {empleo_indirecto:,} personas
- Sectores más beneficiados: {sectores}
- Negocios en radio de impacto: {negocios:,}

El análisis debe:
1. Destacar el impacto en términos concretos y comparables
2. Identificar qué sectores se beneficiaron más y por qué
3. Señalar si superó o quedó por debajo de la estimación y qué factor lo explica
4. Terminar con una recomendación para la siguiente edición del evento
5. Usar lenguaje técnico pero accesible para funcionarios públicos

NO uses bullet points. Escribe en prosa, máximo 3 párrafos.
"""
```

---

## 14. Stack tecnológico recomendado

### Backend

| Componente | Tecnología | Justificación |
|---|---|---|
| Framework web | FastAPI (Python) | Async nativo, documentación automática con OpenAPI, ideal para APIs de datos |
| Base de datos | PostgreSQL + PostGIS | PostGIS es el estándar para datos geoespaciales en producción |
| Cache | Redis | Consultas de Voronoi son costosas; cache de 10 min suficiente |
| ORM | SQLAlchemy + GeoAlchemy2 | Soporte nativo para tipos geoespaciales de PostGIS |
| Geoespacial | scipy, shapely, geopandas | Librerías estándar de Python para análisis geoespacial |
| IA | Anthropic Python SDK | `anthropic>=0.34.0` |
| Parsing de docs | pypdf2, python-docx, pandas | Para ingestión de documentos en alta de eventos |
| Servidor | Uvicorn | ASGI server para FastAPI |

### Frontend

| Componente | Tecnología | Justificación |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR para SEO, RSC para performance, TypeScript nativo |
| Mapas | Mapbox GL JS + react-map-gl | El estándar para mapas interactivos de alta calidad |
| Charts | Recharts | Fácil integración con React, suficiente para el caso de uso |
| Estilos | Tailwind CSS | Velocidad de desarrollo, consistencia de diseño |
| Estado | Zustand | Ligero, suficiente para el estado del mapa y filtros |
| HTTP | Axios + React Query | Cache automático de queries, loading states |
| Animaciones | Framer Motion | Para transiciones del slider antes/después en el mapa |

### Infraestructura (demo)

```yaml
# docker-compose.yml
services:
  backend:
    build: ./backend
    ports: ["8000:8000"]
    environment:
      - DATABASE_URL=postgresql://...
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - MAPBOX_TOKEN=${MAPBOX_TOKEN}
    depends_on: [db, redis]
  
  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
      - NEXT_PUBLIC_MAPBOX_TOKEN=${MAPBOX_TOKEN}
  
  db:
    image: postgis/postgis:15-3.3
    environment:
      - POSTGRES_DB=derrama_cdmx
      - POSTGRES_PASSWORD=demo123
  
  redis:
    image: redis:7-alpine
```

---

## 15. Variables de entorno y configuración

```bash
# .env.example

# === REQUERIDAS ===
ANTHROPIC_API_KEY=sk-ant-...
MAPBOX_TOKEN=pk.eyJ1...

# === BASE DE DATOS ===
DATABASE_URL=postgresql://user:password@localhost:5432/derrama_cdmx
REDIS_URL=redis://localhost:6379/0

# === MODO DATOS ===
USE_SYNTHETIC_DATA=true          # true para demo, false para producción
USE_INEGI_API=false              # activa cliente INEGI DENUE
USE_DATATUR_API=false            # activa cliente DATATUR
USE_CARTELERA_API=false          # activa scraper cartelera CDMX
INEGI_API_TOKEN=                 # token INEGI si USE_INEGI_API=true

# === NOTIFICACIONES ===
EMAIL_API_KEY=                   # SendGrid o Resend API key
EMAIL_FROM=derrama@sedeco.cdmx.gob.mx
NOTIFICATION_ENABLED=false       # false en demo → solo log a consola

# === FRONTEND ===
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_MAPBOX_TOKEN=${MAPBOX_TOKEN}
NEXT_PUBLIC_DEMO_MODE=true       # muestra banner "demo con datos sintéticos"

# === CONFIGURACIÓN MODELO ===
VORONOI_CACHE_TTL=600            # segundos que vive el cache de Voronoi
DERRAMA_MODEL_VERSION=1.0        # para tracking de versiones del modelo
CLAUDE_MODEL=claude-sonnet-4-20250514
CLAUDE_MAX_TOKENS=1000
```

---

## 16. Criterios de calidad y entregables demo

### Checklist antes de presentar

**UX (5 pts):**
- [ ] Landing carga en < 2s y el CTA principal es obvio
- [ ] Flujo Landing → Mapa → Análisis sin fricción
- [ ] El mapa NO permite hacer zoom out de CDMX
- [ ] Los tres modos del mapa son claramente diferenciables
- [ ] El Voronoi se actualiza en < 3s al cambiar parámetros
- [ ] El análisis antes/después tiene la animación del slider temporal
- [ ] El flujo de notificaciones se puede completar en < 5 clics

**Técnica (5 pts):**
- [ ] README con instrucciones de instalación en < 5 minutos
- [ ] `docker-compose up` levanta todo el stack sin errores
- [ ] Claude está integrado en al menos 3 funciones distintas (no solo chatbot)
- [ ] Los endpoints del backend tienen documentación OpenAPI en `/docs`
- [ ] El código del modelo de derrama tiene comentarios explicando los coeficientes
- [ ] Los datos sintéticos son plausibles y coherentes con la realidad de CDMX

**Encaje SEDECO (5 pts):**
- [ ] El vocabulario es institucional: "derrama", "MiPyMEs", "alcaldías", "giros económicos"
- [ ] El análisis de Fiestas Patrias 2024 muestra $8,429 mdp (coherente con dato real de SEDECO)
- [ ] El sistema referencia FONDESO, INEGI, DATATUR como fuentes
- [ ] El flujo de notificaciones menciona explícitamente el beneficio para MiPyMEs locales
- [ ] Hay un banner o nota que indica "datos sintéticos plausibles para demostración"

### Script de demo (5 minutos)

1. **0:00-0:45** — Landing page: "El problema: SEDECO no sabe qué eventos generan más derrama ni dónde ubicarlos." CTA → mapa.
2. **0:45-1:45** — Modo Monitorear: "Esto es lo que está pasando ahora en CDMX." Mostrar eventos activos, heatmap de derrama, filtrar por tipo.
3. **1:45-3:00** — Modo Analizar: seleccionar F1 2024. Mostrar before/after en mapa, slider temporal, métricas, narrativa de Claude. "La IA explica por qué el F1 superó la estimación."
4. **3:00-4:00** — Modo Planear: "Un organizador quiere hacer un festival cultural." Ingresar parámetros → Voronoi aparece → hacer clic en zona óptima → ver score y derrama estimada.
5. **4:00-4:30** — Alta por documento: "Subo un PDF de convocatoria." Claude extrae campos automáticamente → previsualización en mapa antes de guardar.
6. **4:30-5:00** — Notificaciones: "Antes del evento, SEDECO notifica a los restaurantes de Cuauhtémoc." Claude genera mensaje personalizado → mostrar borrador → enviar.

---

## Notas para iteración futura

> Esta sección se actualiza en cada iteración del proyecto.

- **v1.1:** Integrar scraper de Cartelera CDMX para poblar eventos automáticamente
- **v1.2:** Conectar API real de INEGI DENUE para densidad comercial exacta
- **v1.3:** Agregar módulo de comparativa inter-alcaldías (¿qué alcaldía tiene mejor ROI por tipo de evento?)
- **v1.4:** Panel de administración para que SEDECO gestione el catálogo de venues con sus variables de capacidad
- **v2.0:** Integrar datos de movilidad (GTFS CDMX, datos de Google Maps Platform) para calcular accesibilidad real al venue

---

*Documento generado para el Hackathon SEDECO + Saptiva AI — Reto 3 Derrama Económica*  
*Diseñado para ser consumido por un agente de IA de construcción de software*  
*Todos los valores y modelos son estimaciones con propósito de demostración*
