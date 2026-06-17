"use client";

import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Reporte {
  id: number;
  titulo: string;
  descripcion: string;
  latitud: number;
  longitud: number;
  estado: string;
  severidad: number;
  createdAt: string;
}

interface MapaReportesProps {
  reportes: Reporte[];
}

export default function MapaReportes({ reportes }: MapaReportesProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    // Inicializar el mapa solo si el contenedor existe
    if (!mapContainer.current || map.current) return;

    // Crear el mapa centrado en un punto inicial
    map.current = L.map(mapContainer.current).setView([20.5, -102.3], 6);

    // Agregar capas de tiles
    L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map.current);

    return () => {
      // Limpiar el mapa
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Actualizar marcadores cuando cambien los reportes
  useEffect(() => {
    if (!map.current) return;

    // Limpiar marcadores anteriores
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Agregar nuevos marcadores
    reportes.forEach((reporte) => {
      // Seleccionar icono según severidad
      let iconColor = "red";
      if (reporte.severidad <= 3) iconColor = "green";
      else if (reporte.severidad <= 6) iconColor = "orange";
      else iconColor = "red";

      const customIcon = L.icon({
        iconUrl: `https://cdn-icons-png.flaticon.com/512/785/785116.png`,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });

      const marker = L.marker([reporte.latitud, reporte.longitud], {
        icon: customIcon,
      }).addTo(map.current!);

      // Popup con información del reporte
      marker.bindPopup(`
        <div style="font-family: Arial, sans-serif; width: 250px;">
          <h3 style="margin: 0 0 10px 0; color: ${iconColor};">${reporte.titulo}</h3>
          <p style="margin: 5px 0;"><strong>📍 Ubicación:</strong> ${reporte.latitud.toFixed(4)}, ${reporte.longitud.toFixed(4)}</p>
          <p style="margin: 5px 0;"><strong>📝 Descripción:</strong> ${reporte.descripcion}</p>
          <p style="margin: 5px 0;"><strong>🚨 Severidad:</strong> ${reporte.severidad}/10</p>
          <p style="margin: 5px 0;"><strong>📊 Estado:</strong> ${reporte.estado}</p>
          <p style="margin: 5px 0; font-size: 12px; color: #666;"><strong>⏰ Fecha:</strong> ${new Date(
            reporte.createdAt
          ).toLocaleString()}</p>
        </div>
      `);

      markersRef.current.push(marker);
    });

    // Si hay reportes, ajustar la vista para mostrar todos
    if (reportes.length > 0) {
      const group = new L.FeatureGroup(markersRef.current);
      map.current.fitBounds(group.getBounds(), { padding: [50, 50] });
    }
  }, [reportes]);

  return (
    <div
      ref={mapContainer}
      style={{
        width: "100%",
        height: "500px",
        borderRadius: "8px",
        border: "2px solid #ddd",
      }}
    />
  );
}
