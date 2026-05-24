"use client";

import { useEffect, useRef } from "react";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

export default function OpenStreetMapComponent() {

  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {

    if (!mapRef.current) return;

    // Evita doble inicialización
    if ((mapRef.current as any)._leaflet_id) {
      (mapRef.current as any)._leaflet_id = null;
    }

    const map = L.map(mapRef.current).setView(
      [-33.4489, -70.6693],
      13
    );

    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "&copy; OpenStreetMap contributors",
      }
    ).addTo(map);

    L.marker([-33.4489, -70.6693])
      .addTo(map)
      .bindPopup("Santiago de Chile");

    return () => {
      map.remove();
    };

  }, []);

  return (
    <div
      ref={mapRef}
      className="w-full h-[500px] rounded-xl overflow-hidden"
    />
  );
}