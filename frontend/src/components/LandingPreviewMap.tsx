"use client";

import { useEffect, useRef } from "react";
import type { Map as MapboxMap, Marker } from "mapbox-gl";
import { CDMX_BOUNDS, CDMX_CENTER, MAPBOX_TOKEN } from "@/lib/mapbox";
import { events } from "@/data/demo";

export function LandingPreviewMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const markerRefs = useRef<Marker[]>([]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    let disposed = false;

    async function initMap() {
      const mapboxgl = (await import("mapbox-gl")).default;

      if (!containerRef.current || disposed) {
        return;
      }

      mapboxgl.accessToken = MAPBOX_TOKEN;

      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [CDMX_CENTER.lng, CDMX_CENTER.lat],
        zoom: 10.65,
        pitch: 49,
        bearing: -18,
        interactive: false,
        attributionControl: false,
        maxBounds: CDMX_BOUNDS,
      });

      mapRef.current = map;

      map.on("load", () => {
        events.slice(0, 5).forEach((event) => {
          const markerNode = document.createElement("div");
          markerNode.className = `landing-marker ${event.status}`;
          const marker = new mapboxgl.Marker({ element: markerNode, anchor: "center" })
            .setLngLat([event.coordinates.lng, event.coordinates.lat])
            .addTo(map);
          markerRefs.current.push(marker);
        });
      });
    }

    initMap();

    return () => {
      disposed = true;
      markerRefs.current.forEach((marker) => marker.remove());
      markerRefs.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="landing-map" aria-hidden="true">
      <div ref={containerRef} className="landing-map-canvas" />
      <div className="landing-map-shade" />
    </div>
  );
}
