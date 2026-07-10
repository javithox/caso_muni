"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Importar el componente del mapa dinámicamente para evitar problemas con SSR
const OpenStreetMapComponent = dynamic(
  () => import("../components/MapaReportes"),
  { ssr: false, loading: () => <div>Cargando mapa...</div> }
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

export default function Mapa() {
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
    <main style={{ padding: "20px" }}>
      <h1>🔥 Mapa de Reportes de Incendios</h1>

      <nav style={{ fontSize: "8px", marginBottom: "20px" }}>
        <ul className="lista-de-botones">
          <li>
            <Link href="/" className="btn-nav">
              Home
            </Link>
          </li>
          <li>
            <Link href="/reportes" className="btn-nav">
              Crear Reporte
            </Link>
          </li>
          <li>
            <Link href="/mapa" className="btn-nav">
              Ver Mapa
            </Link>
          </li>
          <li>
            <Link href="/geolocalizacion" className="btn-nav">
              Geolocalización
            </Link>
          </li>
          <li>
            <Link href="/iniciarsesion" className="btn-nav">
              Iniciar Sesión
            </Link>
          </li>
          <li>
            <Link href="/registrarse" className="btn-nav">
              Registrarse
            </Link>
          </li>
        </ul>
      </nav>

      {error && (
        <div style={{ color: "red", padding: "10px", marginBottom: "10px" }}>
          ⚠️ {error}
        </div>
      )}

      {cargando && <div>Cargando reportes...</div>}

      {!cargando && reportes.length === 0 && (
        <div style={{ padding: "20px", color: "#666" }}>
          No hay reportes aún. <Link href="/reportes">Crea uno</Link>
        </div>
      )}

      {!cargando && reportes.length > 0 && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <h2>
              📊 Total de Reportes: <strong>{reportes.length}</strong>
            </h2>
            <button
              onClick={cargarReportes}
              style={{
                padding: "8px 16px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              🔄 Actualizar
            </button>
          </div>

          {/* Componente del Mapa */}
          <div style={{ marginBottom: "30px", borderRadius: "8px", overflow: "hidden" }}>
            <OpenStreetMapComponent reportes={reportes} />
          </div>

          {/* Lista de Reportes */}
          <div style={{ marginTop: "30px" }}>
            <h2>📋 Lista de Reportes</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "15px",
              }}
            >
              {reportes.map((reporte) => (
                <div
                  key={reporte.id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "15px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <h3>{reporte.titulo}</h3>
                  <p>
                    <strong>Descripción:</strong> {reporte.descripcion}
                  </p>
                  <p>
                    <strong>Ubicación:</strong> {reporte.latitud.toFixed(4)},{" "}
                    {reporte.longitud.toFixed(4)}
                  </p>
                  <p>
                    <strong>Estado:</strong> {reporte.estado}
                  </p>
                  <p>
                    <strong>Severidad:</strong> {reporte.severidad}/10
                  </p>
                  <p style={{ fontSize: "12px", color: "#999" }}>
                    <strong>Fecha:</strong>{" "}
                    {new Date(reporte.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </main>
  );
}
