"use client";

import Link from "next/link";
import "../estilos/estilo-pagina.css";

export default function Registrarse() {
    return(
        <main>
          <h1 className="titulo-pagina">Registrarse</h1>
          <nav>
            <ul className="lista-de-botones">
              <li><Link href="/" className="btn-nav">Home</Link></li>
              <li><Link href="/reportes" className="btn-nav">Reportes</Link></li>
              <li><Link href="/geolocalizacion" className="btn-nav">Geolocalización</Link></li>
              <li><Link href="/iniciarsesion" className="btn-nav">Iniciar Sesión</Link></li>
              <li><Link href="/registrarse" className="btn-nav">Registrarse</Link></li>
            </ul>
          </nav>
          {/* Aquí puedes agregar el formulario de registro o contenido adicional */}
        </main>
    );
}