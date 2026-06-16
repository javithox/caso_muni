"use client";
import Registrarse from "./registrarse/page";
import IniciarSesion from "./iniciarsesion/page";
import Reportes from "./reportes/page";
import Image from "next/image";
import { useEffect, useState } from "react";

import Link from "next/link";
import "../app/estilos/estilo-pagina.css";

export default function Home() {
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
  }, []);

  const handleCerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuario(null);
  };

  return (
    <main>

      {/* TÍTULO */}
      <h1 className="titulo-pagina">Valle del Sol</h1>

      {/* NAV */}
      <nav className="nav_botones">
        <ul className="lista-de-botones">
          <li><Link href="/" className="btn-nav">Home</Link></li>
          <li><Link href="/reportes" className="btn-nav">Reportes</Link></li>
          <li><Link href="/geolocalizacion" className="btn-nav">Geolocalización</Link></li>
          {usuario ? (
            <>
              <li><Link href="/perfil" className="btn-nav">👤 Mi Perfil</Link></li>
              <li><button onClick={handleCerrarSesion} style={{
                padding: "10px 20px",
                backgroundColor: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}>Cerrar Sesión</button></li>
            </>
          ) : (
            <>
              <li><Link href="/iniciarsesion" className="btn-nav">Iniciar Sesión</Link></li>
              <li><Link href="/registrarse" className="btn-nav">Registrarse</Link></li>
            </>
          )}
        </ul>
      </nav>

      {/* CONTENIDO */}
      <section className="home">

        <h1 className="titulo-seccion">
          Sistema de Reporte de Incendios Forestales
        </h1>

        <p>
          Los incendios forestales representan una de las principales emergencias en Chile.
          Este sistema permite reportar focos de incendio en tiempo real, ayudando a una respuesta rápida.
        </p>

        <h2 className="titulo-seccion">Problemática</h2>
        <p>
          El aumento de incendios está relacionado con el cambio climático,
          altas temperaturas y la acción humana.
        </p>

        <h2 className="titulo-seccion">Objetivo</h2>
        <ul>
          <li>Reportar incendios en tiempo real para los reportes</li>
          <li>Visualizar ubicaciones en tiempo real para ubicar las flamas de fuego</li>
          <li>Apoyar autoridades a la busqueda de inscendios para que sea una comunidad contra inscendios segura</li>
        </ul>

        <h2 className="titulo-seccion">Importancia</h2>
        <p>
          La detección temprana del fuego reduce daños, protege vidas que pueden estar en riesgo y evita la peligrosa propagación del fuego.
        </p>

        {/* BOTÓN */}
        <Link href="/reportes" className="btn-reportar">
          🚨 Reportar Incendio
        </Link>

      </section>

    </main>
  );
}