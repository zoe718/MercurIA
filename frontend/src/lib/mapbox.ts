export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

export const CDMX_CENTER = {
  lng: -99.1332,
  lat: 19.4326,
};

export const CDMX_BOUNDS: [[number, number], [number, number]] = [
  [-99.37, 19.18],
  [-98.93, 19.62],
];
