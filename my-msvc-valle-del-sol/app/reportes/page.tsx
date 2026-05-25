"use client";

import { useState } from "react";
import Link from "next/link";
import { useEffect } from "react";

export default function Reportes() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [latitud, setLatitud] =
    useState("");

  const [longitud, setLongitud] =
    useState("");

  const enviarReporte = async () => {
    const reporte = {
      titulo,
      descripcion,

      ubicacion: {
        lat: parseFloat(latitud),
        lng: parseFloat(longitud),
      },
    };

    console.log(reporte);

    localStorage.setItem(
      "reporteIncendio",
      JSON.stringify(reporte)
    );

    alert("Reporte enviado");
  };
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
      >
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
          onChange={(e) =>
            setDescripcion(e.target.value)
          }
        />

        <input
          type="number"
          step="any"
          placeholder="Latitud"
          value={latitud}
          onChange={(e) =>
            setLatitud(e.target.value)
          }
        />

        <input
          type="number"
          step="any"
          placeholder="Longitud"
          value={longitud}
          onChange={(e) =>
            setLongitud(e.target.value)
          }
        />

        <button onClick={enviarReporte}>
          Enviar Reporte
        </button>
      </div>
    </main>
  );
}

function setUbicacion(arg0: any) {
  throw new Error("Function not implemented.");
}
