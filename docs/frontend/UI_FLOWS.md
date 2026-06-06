# Frontend UI Flows

Este documento describe los flujos que debe soportar el frontend. Cada flujo debe mantenerse alineado con el contrato API y la experiencia definida en [../IDEA.md](../IDEA.md).

## Landing

Objetivo: explicar el valor de MercurIA rapidamente y llevar al usuario al mapa o a un analisis de ejemplo.

Flujo:

1. Usuario entra a `/`.
2. Ve una propuesta clara de inteligencia economica para eventos en CDMX.
3. Puede abrir el mapa principal.
4. Puede explorar una derrama de ejemplo.

## Mapa CDMX

Objetivo: monitorear, analizar y planear eventos sobre una vista geografica de CDMX.

Flujo:

1. Usuario entra a `/map`.
2. Elige modo: `Planear`, `Analizar` o `Monitorear`.
3. Ajusta filtros por tipo de evento, fecha y alcaldia.
4. El mapa actualiza eventos, heatmap, Voronoi o score de sedes segun el modo.
5. Al seleccionar un evento o zona, aparece un panel de detalle.

## Analisis de evento

Objetivo: comparar derrama estimada vs real, sectores beneficiados y narrativa IA.

Flujo:

1. Usuario entra desde el mapa o una lista de eventos.
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
5. Frontend muestra vista previa en mapa antes de guardar.

## Notificaciones

Objetivo: ayudar a SEDECO a avisar a MiPyMEs relevantes antes de un evento.

Flujo:

1. Usuario elige evento o zona.
2. Frontend carga MiPyMEs elegibles por radio, alcaldia y giro.
3. Usuario revisa destinatarios.
4. Backend o mock genera borrador del mensaje.
5. Usuario confirma envio o guarda borrador.
