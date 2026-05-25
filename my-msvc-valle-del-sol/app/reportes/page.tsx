"use client";

import { useState } from "react";
import Link from "next/link";
import { useEffect } from "react";

export default function Reportes() {
  const [ubicacion, setUbicacion] =
  useState<any>(null);

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
  const ubicacionGuardada =
    localStorage.getItem(
      "ubicacionIncendio"
    );

  if (ubicacionGuardada) {
    setUbicacion(
      JSON.parse(ubicacionGuardada)
    );
  }
}, []);

  const [latitud, setLatitud] =
    useState("");

  const [longitud, setLongitud] =
    useState("");

  const enviarReporte = async () => {
    const reporte = {
      titulo,
      descripcion,
      ubicacion,
    };


    console.log(reporte);

    localStorage.setItem(
      "reporteIncendio",
      JSON.stringify(reporte)
    );
     localStorage.removeItem(
    "ubicacionIncendio"
    );
      // LIMPIAR FORMULARIO
      setTitulo("");
      setDescripcion("");
      setUbicacion(null);


    alert("Reporte enviado");
    window.location.href ="/geolocalizacion";
  
    };

  return (
    <main>
      <h1>🔥 Reportar Incendio</h1>

      <nav>
        <ul className="lista-de-botones">
          <li>
            <Link href="/" className="btn-nav">
              Home
            </Link>
          </li>

          <li>
            <Link
              href="/reportes"
              className="btn-nav"
            >
              Reportes
            </Link>
          </li>

          <li>
            <Link
              href="/geolocalizacion"
              className="btn-nav"
            >
              Geolocalización
            </Link>
          </li>

          <li>
            <Link
              href="/iniciarsesion"
              className="btn-nav"
            >
              Iniciar Sesión
            </Link>
          </li>

          <li>
            <Link
              href="/registrarse"
              className="btn-nav"
            >
              Registrarse
            </Link>
          </li>
        </ul>
      </nav>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "400px",
        }}
      />
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) =>
            setTitulo(e.target.value)
          }
        />

        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />

        {ubicacion && (
          <div
            style={{
              marginTop: "15px",
              padding: "10px",
              border: "1px solid gray",
              borderRadius: "8px",
            }}
          >
            <h3>
              📍 Ubicación seleccionada
            </h3>

            <p>
              <strong>Latitud:</strong>{" "}
              {ubicacion.lat}
            </p>

            <p>
              <strong>Longitud:</strong>{" "}
              {ubicacion.lng}
            </p>
          </div>
        )}

        <button onClick={enviarReporte}>
          Enviar Reporte
        </button>
    </main>
  );
}
