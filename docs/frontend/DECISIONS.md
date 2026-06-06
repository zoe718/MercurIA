# Frontend Decisions

Este archivo registra decisiones tecnicas y de diseno en formato ADR corto.

## 2026-06-06 - Documentacion viva del frontend

**Decision:** crear `docs/frontend/` como contrato vivo entre frontend y backend.

**Motivo:** el frontend y backend se trabajaran en paralelo, por lo que los endpoints esperados, flujos, componentes y decisiones deben quedar documentados en un lugar estable.

**Impacto:** cada cambio frontend debe actualizar al menos un documento de esta carpeta y resumirse en `CHANGELOG.md`.

## 2026-06-06 - Tema visual inicial

**Decision:** usar [../FRONTEND_THEME.md](../FRONTEND_THEME.md) como fuente de verdad de paleta hasta que exista configuracion Tailwind/CSS.

**Motivo:** ya existe una paleta aprobada para MercurIA y debe mantenerse consistente desde el inicio del frontend.

**Impacto:** cualquier implementacion visual futura debe mapear los tokens `background`, `primary`, `secondary`, `surface`, `text`, `accent`, `success`, `warning` y `danger`.
