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

    // TILE LAYER esto es para cambiar estilo de mapa
    L.tileLayer(
      "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png",
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
  <div style={{ position: "relative" }}>

    <div
      ref={mapRef}
      className="w-full h-[500px] rounded-xl overflow-hidden"
    />
    <button
      onClick={() => {
        const ubicacion =
          localStorage.getItem(
            "ubicacionIncendio"
          );
          

        if (!ubicacion) {
          alert(
            "Selecciona una ubicación en el mapa"
          );

          return;
        }

        window.location.href =
          "/reportes";

        
        
      }}
      
      disabled={!localStorage.getItem("ubicacionIncendio")}

      style={{
        position: "absolute",

        bottom: "20px",

        right: "20px",

        zIndex: 1000,

        backgroundColor: "#dc2626",

        color: "white",

        padding: "12px 20px",

        border: "none",

        borderRadius: "10px",

        fontWeight: "bold",

        cursor: "pointer",

        boxShadow:
          "0px 4px 10px rgba(0,0,0,0.3)",
      }}
    >
      🔥 Hacer Reporte
    </button>

  </div>
  );
}