"use client";

import { useEffect, useRef } from "react";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdn-icons-png.flaticon.com/512/785/785116.png",

  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/785/785116.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});


export default function OpenStreetMapComponent() {
  const mapRef = useRef<HTMLDivElement | null>(
    null
  );

  useEffect(() => {
    if (!mapRef.current) return;

    // EVITA ERROR DOBLE MAPA
    if ((mapRef.current as any)._leaflet_id) {
      (mapRef.current as any)._leaflet_id =
        null;
    }

    // CREAR MAPA
    const map = L.map(mapRef.current).setView(
      [-33.4489, -70.6693],
      13
    );

    // TILE LAYER
    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          "&copy; OpenStreetMap contributors",
      }
    ).addTo(map);

    // VARIABLE DEL MARCADOR
    let marker: L.Marker | null = null;

    // EVENTO CLICK EN MAPA
    map.on("click", (e: any) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      // ELIMINA MARCADOR ANTERIOR
      if (marker) {
        map.removeLayer(marker);
      }

      // CREA NUEVO MARCADOR
      marker = L.marker([lat, lng]).addTo(
        map
      );

      // POPUP
      marker
        .bindPopup(
          `
          <b>🔥 Incendio Reportado</b>
          <br/>
          Latitud: ${lat.toFixed(6)}
          <br/>
          Longitud: ${lng.toFixed(6)}
        `
        )
        .openPopup();

      // GUARDAR EN LOCALSTORAGE
      localStorage.setItem(
        "ubicacionIncendio",
        JSON.stringify({
          lat,
          lng,
        })
      );

      console.log(
        "Ubicación guardada:",
        lat,
        lng
      );
      
    });
    
    // LIMPIEZA
    return () => {
      map.remove();
    };
    
  }, []);
    // REDIRIGIR AL FORMULARIO
  

  return (
    <div
      ref={mapRef}
      className="w-full h-[500px] rounded-xl overflow-hidden"
    />
  );
}