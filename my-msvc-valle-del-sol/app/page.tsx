"use client";
import Registrarse from "./Registrarse/page";
import IniciarSesion from "./IniciarSesion/page";
import Reportes from "./reportes/page";
import Image from "next/image";


import Link from "next/link";
import "../app/estilos/estilo-pagina.css";

export default function Home() {
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
          <li><Link href="/iniciarsesion" className="btn-nav">Iniciar Sesión</Link></li>
          <li><Link href="/registrarse" className="btn-nav">Registrarse</Link></li>
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
          <li>Reportar incendios en tiempo real</li>
          <li>Visualizar ubicaciones</li>
          <li>Apoyar autoridades</li>
        </ul>

        <h2 className="titulo-seccion">Importancia</h2>
        <p>
          La detección temprana reduce daños, protege vidas y evita la propagación del fuego.
        </p>

        {/* BOTÓN */}
        <Link href="/reportes" className="btn-reportar">
          🚨 Reportar Incendio
        </Link>

      </section>

    </main>
  );
}