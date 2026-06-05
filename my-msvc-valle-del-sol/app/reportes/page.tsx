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
  try {
    if (!ubicacion) {
      alert("Seleccione una ubicación");
      return;
    }

const response = await fetch(
  "http://localhost:8081/api/reportes",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      titulo,
      descripcion,
      latitud: ubicacion.lat,
      longitud: ubicacion.lng,
      severidad: 3,
      usuarioId: 1,
    }),
  }
);

const data = await response.json();

console.log("STATUS:", response.status);
console.log("RESPUESTA:", data);

if (!response.ok) {
  throw new Error(
    data.message || JSON.stringify(data)
  );
}

    alert("Reporte enviado correctamente");
  } catch (error) {
    console.error(error);
    alert("Error enviando reporte");
  }

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
