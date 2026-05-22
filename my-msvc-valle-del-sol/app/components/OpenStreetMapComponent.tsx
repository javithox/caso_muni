"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

// Arregla iconos en Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function OpenStreetMapComponent() {
  const posicion: [number, number] = [-33.4489, -70.6693];

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden">
      <MapContainer
        center={posicion}
        zoom={13}
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={posicion}>
          <Popup>
            Santiago de Chile
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}