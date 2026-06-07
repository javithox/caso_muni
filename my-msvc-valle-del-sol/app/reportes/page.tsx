"use client";

import { useState } from "react";
import Link from "next/link";
import { useEffect } from "react";

export default function Reportes() {
  const [ubicacion, setUbicacion] =
  useState<any>(null);

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  console.log("API_URL:", API_URL);

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

  if (!ubicacion) {

    alert(
      "Selecciona una ubicación"
    );

    return;
  }

  const reporte = {

    titulo,

    descripcion,

    latitud: ubicacion.lat,

    longitud: ubicacion.lng,

    ubicacionId:
      crypto.randomUUID(),

    direccion:
      "Ubicación seleccionada",

    placeMapsId: "",

    estado: "PENDIENTE",

    reportadoPor:
      "Usuario",

    contactoEmergencia: "",

    nivelSeveridad: 3,

  };

  try {

    const response =
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reportes`,
        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            reporte
          ),
        }
      );

    if (!response.ok) {

      throw new Error(
        "Error enviando reporte"
      );
    }

    const data =
      await response.json();

    console.log(
      "Reporte guardado:",
      data
    );

    // LIMPIAR UBICACIÓN
    localStorage.removeItem(
      "ubicacionIncendio"
    );

    // LIMPIAR FORMULARIO
    setTitulo("");

    setDescripcion("");

    setUbicacion(null);

    alert(
      "🔥 Reporte enviado"
    );

    window.location.href =
      "/geolocalizacion";

  } catch (error) {

    console.error(error);

    alert(
      "Error conectando backend"
    );
  }
};

  return (
    <main>
      <h1 style={{bottom:'100px'}}>🔥 Reportar Incendio</h1>

      <nav style={{ fontSize: "8px"}}>
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
        <input style={{boxShadow:'2px 2px 2px 2px', margin:'10px'}}
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) =>
            setTitulo(e.target.value)
          }
        />

        <textarea style={{boxShadow:'2px 2px 2px 2px', margin:'10px'}}
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

        <button onClick={enviarReporte} style={{backgroundColor:"red", borderRadius:'7%',boxShadow:'5px 5px 5px 5px' ,fontSize:'20px', margin:'10px'}}>
          Enviar Reporte
        </button>
    </main>
  );
}
