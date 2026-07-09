"use client";
import Image from "next/image";
import Link from "next/link";
import "./estilos/estilo-pagina.css";

export default function Home() {
  return (
    <main>

      {/* TÍTULO */}
      <h1 className="titulo-pagina">Valle del Sol</h1>

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