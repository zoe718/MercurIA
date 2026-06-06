# Frontend UI Flows

Este documento describe los flujos que debe soportar el frontend. Cada flujo debe mantenerse alineado con el contrato API y la experiencia definida en [../IDEA.md](../IDEA.md).

## Consola principal (`/`)

Objetivo: abrir directamente una vista operativa para monitorear, analizar y planear eventos con datos sinteticos mientras el backend se integra.

Flujo:

1. Usuario entra a `/`.
2. Revisa metricas principales de derrama, eventos, MiPyMEs y alertas.
3. Cambia el modo entre `Monitorear`, `Analizar` y `Planear`.
4. Filtra por tipo de evento.
5. Selecciona un evento desde el mapa sintetico o la tira de eventos.
6. Revisa detalle economico, sectores, narrativa simulada y MiPyMEs relacionadas.

## Mapa CDMX

Objetivo: monitorear, analizar y planear eventos sobre una vista geografica de CDMX.

Flujo:

1. Usuario usa el mapa dentro de `/`.
2. Elige modo: `Planear`, `Analizar` o `Monitorear`.
3. Ajusta filtros por tipo de evento, fecha y alcaldia.
4. El mapa actualiza eventos y scores de sede con datos sinteticos.
5. Al seleccionar un evento o zona, aparece un panel de detalle.

## Analisis de evento

Objetivo: comparar derrama estimada vs real, sectores beneficiados y narrativa IA.

Flujo:

1. Usuario selecciona un evento desde el mapa o la tira de eventos.
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
