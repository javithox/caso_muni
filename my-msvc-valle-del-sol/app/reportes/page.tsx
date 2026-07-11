"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import "../estilos/estilo-geolocalizacion.css";
import { useSession } from "@/app/hooks/useSession";
import { useRouter } from "next/navigation";

// Simple type for report objects. Adjust fields as needed.
type Reporte = Record<string, any>;

const OpenStreetMapComponent = dynamic(
  () => import("@/app/components/OpenStreetMapComponent"),
  { ssr: false, loading: () => <div>Cargando mapa...</div> }
);

const MapaReportes = dynamic(
  () => import("@/app/components/MapaReportes"),
  { ssr: false, loading: () => <div>Cargando mapa de reportes...</div> }
);

export default function Reportes() {
  const { usuario } = useSession();
  const router = useRouter();
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [ubicacion, setUbicacion] = useState<any>(null);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [enviandoReporte, setEnviandoReporte] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://caso-muni.onrender.com:8081";

  // Cargar reportes
  useEffect(() => {
    cargarReportes();
  }, []);

  const cargarReportes = async () => {
    try {
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

  // Cargar ubicación guardada
  useEffect(() => {
    const ubicacionGuardada = localStorage.getItem("ubicacionIncendio");
    if (ubicacionGuardada) {
      setUbicacion(JSON.parse(ubicacionGuardada));
    }
  }, []);

  const enviarReporte = async () => {
    if (!usuario) {
      alert("⚠️ Debes iniciar sesión para reportar un incendio");
      router.push("/iniciarsesion");
      return;
    }

    if (!ubicacion) {
      alert("Selecciona una ubicación");
      return;
    }

    if (!titulo || !descripcion) {
      alert("Por favor completa el título y la descripción");
      return;
    }

    setEnviandoReporte(true);

    const reporte = {
      titulo,
      descripcion,
      latitud: ubicacion.lat,
      longitud: ubicacion.lng,
      ubicacionId: crypto.randomUUID(),
      direccion: "Ubicación seleccionada",
      placeMapsId: "",
      estado: "PENDIENTE",
      reportadoPor: usuario.email || usuario.nombre || "Usuario",
      contactoEmergencia: usuario.telefono || "",
      nivelSeveridad: 3,
    };

    try {
      const response = await fetch(`${API_URL}/api/reportes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(reporte),
      });

      if (!response.ok) {
        throw new Error("Error enviando reporte");
      }

      const data = await response.json();
      console.log("Reporte guardado:", data);

      // Limpiar datos
      localStorage.removeItem("ubicacionIncendio");
      setTitulo("");
      setDescripcion("");
      setUbicacion(null);

      alert("🔥 Reporte guardado en la base de datos!");
      
      // Recargar reportes
      await cargarReportes();
    } catch (error) {
      console.error(error);
      alert("Error conectando backend");
    } finally {
      setEnviandoReporte(false);
    }
  };

  return (
    <main>
      <h1 style={{ marginTop: "20px", marginBottom: "20px", color: "#334155" }}>
        🔥 Reportar Incendio
      </h1>

      {/* SECCIÓN 1: Seleccionar Ubicación */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ marginTop: "20px", marginBottom: "10px", color: "#334155", backgroundColor: "#fcfcfc", padding: "10px" }}>
          📍 Selecciona la ubicación del incendio
        </h2>
        <OpenStreetMapComponent />
      </div>

      {/* SECCIÓN 2: Información del Reporte */}
      {usuario && (
        <div style={{ maxWidth: "400px", margin: "20px auto", padding: "20px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
          <h2 style={{ color: "#334155", marginBottom: "15px" }}>ℹ️ Información del Reporte</h2>
          
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Título:</label>
            <input
              type="text"
              placeholder="Ej: Incendio en Cerro Verde"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #cbd5e1",
                borderRadius: "4px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Descripción:</label>
            <textarea
              placeholder="Describe el incendio, extensión aproximada, dirección del viento, etc."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #cbd5e1",
                borderRadius: "4px",
                minHeight: "100px",
                boxSizing: "border-box"
              }}
            />
          </div>

          {ubicacion && (
            <div style={{ marginBottom: "15px", padding: "10px", backgroundColor: "#e0f2fe", border: "1px solid #0284c7", borderRadius: "8px" }}>
              <h3>📍 Ubicación seleccionada</h3>
              <p><strong>Latitud:</strong> {ubicacion.lat.toFixed(4)}</p>
              <p><strong>Longitud:</strong> {ubicacion.lng.toFixed(4)}</p>
            </div>
          )}

          <button
            onClick={enviarReporte}
            disabled={enviandoReporte}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: enviandoReporte ? "#9ca3af" : "#dc2626",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: enviandoReporte ? "not-allowed" : "pointer",
              fontSize: "16px",
              fontWeight: "bold"
            }}
          >
            {enviandoReporte ? "Enviando..." : "🚨 Enviar Reporte"}
          </button>
        </div>
      )}

      {!usuario && (
        <div style={{ maxWidth: "400px", margin: "20px auto", padding: "20px", backgroundColor: "#fef3c7", borderRadius: "8px", border: "1px solid #fcd34d" }}>
          <h2 style={{ color: "#92400e" }}>⚠️ Sesión Requerida</h2>
          <p>Necesitas iniciar sesión para reportar un incendio.</p>
          <Link href="/iniciarsesion" className="btn-nav" style={{ display: "inline-block", marginTop: "10px", padding: "10px 20px", backgroundColor: "#2563eb", color: "white", borderRadius: "4px", textDecoration: "none" }}>
            Iniciar Sesión
          </Link>
        </div>
      )}
    </main>
  );
}

