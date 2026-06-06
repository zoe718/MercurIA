# Frontend Theme

Esta guía define la paleta visual inicial de MercurIA para el frontend. Debe funcionar como contrato de diseño hasta que exista la configuración real de Tailwind/CSS.

## Paleta de colores

| Token | Hex | Descripción |
|---|---:|---|
| `background` | `#FFFFFF` | Blanco puro para el fondo principal |
| `primary` | `#C0C0C0` | Mercurio/plata para identidad principal |
| `secondary` | `#8A9BAE` | Azul plateado para navegación y elementos secundarios |
| `surface` | `#E8ECF0` | Plata suave para superficies de trabajo |
| `text` | `#1A1A2E` | Carbón profundo para texto y datos importantes |
| `accent` | `#4A90D9` | Azul eléctrico para acciones primarias y énfasis |
| `success` | `#22C55E` | Verde viabilidad para confirmaciones y métricas positivas |
| `warning` | `#F59E0B` | Ámbar precaución para supuestos, riesgos o pendientes |
| `danger` | `#EF4444` | Rojo no recomendado para errores y alertas críticas |

## Notas de uso

- Usar `background` como base de pantalla y reservar `surface` para paneles funcionales.
- Usar `text` para lectura principal, métricas y encabezados compactos.
- Usar `accent` para CTAs, foco de formularios, selección activa y links importantes.
- Usar `success`, `warning` y `danger` solo para estados semánticos.
- Evitar que la interfaz se vuelva monocromática: combinar plata, azul plateado y acentos de estado con intención.

## Tokens sugeridos

```ts
export const colors = {
  background: "#FFFFFF",
  primary: "#C0C0C0",
  secondary: "#8A9BAE",
  surface: "#E8ECF0",
  text: "#1A1A2E",
  accent: "#4A90D9",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
};
```
