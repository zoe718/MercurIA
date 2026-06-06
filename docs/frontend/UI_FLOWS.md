# Frontend UI Flows

Este documento describe los flujos que debe soportar el frontend. Cada flujo debe mantenerse alineado con el contrato API y la experiencia definida en [../IDEA.md](../IDEA.md).

## Landing (`/`)

Objetivo: presentar MercurIA con una escena real de mapa CDMX y llevar al usuario al mapa operativo.

Flujo:

1. Usuario entra a `/`.
2. Ve MercurIA sobre un mapa Mapbox de CDMX con marcadores demo.
3. Revisa indicadores compactos de evento, zona, MiPyMEs y derrama.
4. Usa el CTA para entrar a `/map`.

## Mapa CDMX

Objetivo: monitorear, analizar y planear eventos sobre una vista geografica de CDMX.

Flujo:

1. Usuario entra a `/map`.
2. Elige modo: `Planear`, `Analizar` o `Monitorear`.
3. Ajusta el tipo de evento Voronoi desde controles flotantes sobre el mapa.
4. El mapa Mapbox recalcula celdas Voronoi, color, score y ranking.
5. Al seleccionar una celda, el panel muestra fórmula y variables usadas.
6. Al seleccionar un evento, el mapa vuela a la ubicacion y actualiza el panel flotante.

## Analisis de evento

Objetivo: comparar derrama estimada vs real, sectores beneficiados y narrativa IA.

Flujo:

1. Usuario selecciona un evento desde el mapa o la tira inferior de eventos.
2. La pantalla carga datos del evento y metricas de analisis.
3. Usuario revisa graficas, empleo, sectores y narrativa.
4. Puede pasar al flujo de notificaciones para MiPyMEs relacionadas.

## Alta de eventos por documento

Objetivo: capturar eventos rapidamente desde PDF, Word, CSV, imagen o JSON.

Flujo:

1. Usuario sube un documento.
2. Frontend muestra estado de procesamiento.
3. Backend o mock devuelve campos extraidos.
4. Usuario revisa y corrige el formulario.
5. Frontend muestra vista previa futura sobre `/map` antes de guardar.

## Notificaciones

Objetivo: ayudar a SEDECO a avisar a MiPyMEs relevantes antes de un evento.

Flujo:

1. Usuario elige evento o zona.
2. Frontend carga MiPyMEs elegibles por radio, alcaldia y giro.
3. Usuario revisa destinatarios.
4. Backend o mock genera borrador del mensaje.
5. Usuario confirma envio o guarda borrador.
