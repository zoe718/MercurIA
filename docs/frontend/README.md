# Frontend Documentation

Esta carpeta es el contrato vivo del frontend de MercurIA. Su objetivo es mantener alineado el trabajo de interfaz con el backend mientras ambos avanzan en paralelo.

## Como usar estos documentos

- Actualizar esta documentacion en la misma interaccion en la que cambie el frontend.
- Registrar dependencias del backend antes de asumir que un endpoint o payload existe.
- Mantener los documentos cortos, accionables y faciles de revisar.
- Usar [../FRONTEND_THEME.md](../FRONTEND_THEME.md) como fuente de verdad visual inicial.

## Documentos

- [API_CONTRACT.md](API_CONTRACT.md): datos, endpoints y estados que el frontend espera del backend.
- [UI_FLOWS.md](UI_FLOWS.md): flujos de usuario por pantalla y modo de uso.
- [COMPONENTS.md](COMPONENTS.md): componentes planeados o creados, responsabilidades y props.
- [VORONOI.md](VORONOI.md): contrato de capa Voronoi, variables por tipo de evento y simulación.
- [DECISIONS.md](DECISIONS.md): decisiones tecnicas y de diseno en formato ADR corto.
- [CHANGELOG.md](CHANGELOG.md): bitacora cronologica de cambios frontend.

## Regla de actualizacion

- Si una pantalla consume datos del backend, actualizar `API_CONTRACT.md`.
- Si cambia un flujo de usuario, actualizar `UI_FLOWS.md`.
- Si se crea o modifica un componente reutilizable, actualizar `COMPONENTS.md`.
- Si se elige una libreria, patron o convencion visual relevante, actualizar `DECISIONS.md`.
- Todo cambio frontend debe quedar resumido en `CHANGELOG.md`.
