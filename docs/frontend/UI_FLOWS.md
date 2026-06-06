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
4. El mapa Mapbox recalcula zonas candidatas Voronoi, color, derrama estimada, idoneidad y ranking.
5. Al seleccionar una zona candidata, el panel muestra fórmula y variables usadas.
6. El diagrama permanece recortado al límite oficial de CDMX; ninguna celda debe salir de la frontera marcada.
7. Los eventos se representan como edificios o recintos 3D resaltados con la geometría de Mapbox, no como pines circulares; la altura y contorno aumentan al ver el mapa desde lejos.
8. Al seleccionar un evento, el mapa vuela a la ubicacion y actualiza el panel flotante.

## Monitoreo territorial

Objetivo: comparar zonas por giro económico y derrama estimada.

Flujo:

1. Usuario entra a modo `Monitorear`.
2. Elige un giro/tipo desde el filtro Voronoi.
3. El mapa pinta la intensidad de cada celda por `estimatedMdp`.
4. El panel derecho muestra los 15 lugares mejor rankeados y la razón resumida del ranking.
5. Usuario selecciona una fila del ranking y el mapa resalta la celda correspondiente.

## Analisis de evento

Objetivo: comparar derrama estimada vs real, sectores beneficiados y narrativa IA.

Flujo:

1. Usuario selecciona un evento desde el mapa o la tira inferior de eventos.
2. El panel derecho muestra diagnóstico agregado de todos los eventos locales, derrama real o estimada, variación, afluencia, MiPyMEs y sectores.
3. Usuario revisa lectura económica y narrativa.
4. Puede pasar al flujo de notificaciones para MiPyMEs relacionadas cuando exista backend.

## Alta de eventos por documento

Objetivo: capturar eventos rapidamente desde PDF, Word, CSV, imagen o JSON.

Flujo:

1. Usuario sube un documento.
2. Usuario puede capturar alcaldía, giro económico, tipo de evento, presupuesto, afluencia y fecha tentativa.
3. Frontend muestra una zona candidata y tres recomendaciones derivadas del Voronoi actual.
4. Usuario crea un evento simulado.
5. Frontend agrega el evento al estado local, lo muestra en el carril inferior, lo representa como edificio 3D y cambia a `Analizar`.
6. El diagnóstico agregado y la derrama del evento se recalculan inmediatamente.
7. Cuando exista backend, el documento alimentará extracción y simulación real antes de guardar.

## Notificaciones

Objetivo: ayudar a SEDECO a avisar a MiPyMEs relevantes antes de un evento.

Flujo:

1. Usuario elige evento o zona.
2. Frontend carga MiPyMEs elegibles por radio, alcaldia y giro.
3. Usuario revisa destinatarios.
4. Backend o mock genera borrador del mensaje.
5. Usuario confirma envio o guarda borrador.
