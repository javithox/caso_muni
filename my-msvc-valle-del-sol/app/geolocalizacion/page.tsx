"use client"
import Link from "next/dist/client/link";
import dynamic from "next/dynamic";
import "../estilos/estilo-geolocalizacion.css";

const OpenStreetMapComponent = dynamic(
  () => import("@/app/components/OpenStreetMapComponent"),
  {
    ssr: false,
  }
);

export default function Home() {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        OpenStreetMap
      </h1>
            {/* NAV */}
      <nav>
        <ul className="lista-de-botones">
          <li><Link href="/" className="btn-nav">Home</Link></li>
          <li><Link href="/reportes" className="btn-nav">Reportes</Link></li>
          <li><Link href="/geolocalizacion" className="btn-nav">Geolocalización</Link></li>
          <li><Link href="/iniciarsesion" className="btn-nav">Iniciar Sesión</Link></li>
          <li><Link href="/registrarse" className="btn-nav">Registrarse</ Link></li>
        </ul>
      </nav>

      <OpenStreetMapComponent />
    </main>
  );
}