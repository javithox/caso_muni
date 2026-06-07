"use client"
import Link from "next/dist/client/link";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import "../estilos/estilo-geolocalizacion.css";

const OpenStreetMapComponent = dynamic(
  () => import("@/app/components/OpenStreetMapComponent"),
  {
    ssr: false,
  }
);

const MapaReportes = dynamic(
  () => import("@/app/components/MapaReportes"),
  { ssr: false, loading: () => <div>Cargando mapa de reportes...</div> }
);

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

export default function Home() {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarReportes();
  }, []);

  const cargarReportes = async () => {
    try {
      setCargando(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";
      const response = await fetch(`${API_URL}/api/reportes`);

      if (!response.ok) {
        throw new Error(`Error al cargar reportes: ${response.status}`);
      }

      const datos = await response.json();
      setReportes(datos);
      setError("");
    } catch (err: any) {
      console.error("Error:", err);
      setError(`No se pudieron cargar los reportes: ${err.message}`);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="p-4">
      {/* NAV */}
      <nav style={{ fontSize: "8px" }}>
        <h1 className="text-2xl font-bold mb-4" style={{ backgroundColor: "#334155", color: "white", padding: "10px", borderRadius: "5px" }}>
          🔥 Geolocalización - Valle del Sol
        </h1>
        <ul className="lista-de-botones">
          <li><Link href="/" className="btn-nav">Home</Link></li>
          <li><Link href="/reportes" className="btn-nav">Reportes</Link></li>
          <li><Link href="/geolocalizacion" className="btn-nav">Geolocalización</Link></li>
          <li><Link href="/iniciarsesion" className="btn-nav">Iniciar Sesión</Link></li>
          <li><Link href="/registrarse" className="btn-nav">Registrarse</Link></li>
        </ul>
      </nav>

      {/* SECCIÓN 1: Seleccionar Ubicación */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ marginTop: "20px", marginBottom: "10px", color: "#334155" }}>
          📍 Selecciona la ubicación del incendio
        </h2>
        <p style={{ color: "#666", marginBottom: "15px" }}>
          Haz clic en el mapa para marcar la ubicación del incendio, luego ve a crear el reporte.
        </p>
        <OpenStreetMapComponent />
      </div>

      {/* SEPARADOR */}
      <div style={{ borderTop: "3px solid #334155", margin: "40px 0", padding: "20px 0" }}>
        <h2 style={{ textAlign: "center", color: "#334155" }}>📊 REPORTES GUARDADOS EN LA BASE DE DATOS</h2>
      </div>

      {/* SECCIÓN 2: Mapa de Reportes */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "10px", color: "#334155" }}>
          🗺️ Mapa interactivo con todos los reportes
        </h2>

        {error && (
          <div style={{ color: "red", padding: "10px", marginBottom: "10px", backgroundColor: "#ffe0e0", borderRadius: "4px" }}>
            ⚠️ {error}
          </div>
        )}

        {cargando && (
          <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
            ⏳ Cargando reportes desde la base de datos...
          </div>
        )}

        {!cargando && reportes.length === 0 && (
          <div style={{ padding: "20px", color: "#666", backgroundColor: "#f0f0f0", borderRadius: "4px", textAlign: "center" }}>
            ℹ️ No hay reportes guardados aún. <Link href="/reportes" style={{ color: "blue", textDecoration: "underline" }}>Crea uno aquí</Link>
          </div>
        )}

        {!cargando && reportes.length > 0 && (
          <>
            <div style={{ marginBottom: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, color: "#334155" }}>
                📍 Total de reportes: <strong>{reportes.length}</strong>
              </h3>
              <button
                onClick={cargarReportes}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                🔄 Actualizar
              </button>
            </div>

            {/* Mapa con Reportes */}
            <div style={{ marginBottom: "30px", borderRadius: "8px", overflow: "hidden", border: "2px solid #ddd" }}>
              <MapaReportes reportes={reportes} />
            </div>
          </>
        )}
      </div>

      {/* SECCIÓN 3: Lista de Reportes */}
      {!cargando && reportes.length > 0 && (
        <div style={{ marginBottom: "40px" }}>
          <h2 style={{ marginBottom: "15px", color: "#334155" }}>
            📋 Detalles de reportes guardados
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "15px",
            }}
          >
            {reportes.map((reporte) => {
              let severidadColor = "#ff6b6b"; // Rojo para alta
              if (reporte.severidad <= 3) severidadColor = "#51cf66"; // Verde
              else if (reporte.severidad <= 6) severidadColor = "#ffa94d"; // Naranja

              return (
                <div
                  key={reporte.id}
                  style={{
                    border: `3px solid ${severidadColor}`,
                    borderRadius: "8px",
                    padding: "15px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <h3 style={{ margin: "0 0 10px 0", color: severidadColor }}>
                    {reporte.titulo}
                  </h3>
                  <p style={{ margin: "5px 0", fontSize: "14px" }}>
                    <strong>📝 Descripción:</strong> {reporte.descripcion}
                  </p>
                  <p style={{ margin: "5px 0", fontSize: "14px" }}>
                    <strong>📍 Ubicación:</strong> {reporte.latitud.toFixed(4)}, {reporte.longitud.toFixed(4)}
                  </p>
                  <p style={{ margin: "5px 0", fontSize: "14px" }}>
                    <strong>🚨 Severidad:</strong> {reporte.severidad}/10
                  </p>
                  <p style={{ margin: "5px 0", fontSize: "14px" }}>
                    <strong>📊 Estado:</strong> {reporte.estado}
                  </p>
                  <p style={{ margin: "5px 0", fontSize: "12px", color: "#999" }}>
                    <strong>⏰ Fecha:</strong> {new Date(reporte.createdAt).toLocaleString()}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}