"use client";


import Link from "next/link";
import "../estilos/estilo-registrarse.css";


export default function Registrarse() {
    return(
        <main>
          
          <nav>
            <ul className="lista-de-botones">
              <li><Link href="/" className="btn-nav">Home</Link></li>
              <li><Link href="/reportes" className="btn-nav">Reportes</Link></li>
              <li><Link href="/geolocalizacion" className="btn-nav">Geolocalización</Link></li>
              <li><Link href="/iniciarsesion" className="btn-nav">Iniciar Sesión</Link></li>
              <li><Link href="/registrarse" className="btn-nav">Registrarse</Link></li>
            </ul>
          </nav>
          <h1 className="titulo-pagina">Registrarse</h1>
          <section className="form-container">
            <form className="form-registro">
              <label>Nombre</label>
              <input type="text" placeholder="Ingresa tu nombre" required />

              <label>Email</label>
              <input type="email" placeholder="Ingresa tu email" required />

              <label>Contraseña</label>
              <input type="password" placeholder="Crea una contraseña" required />

              <button type="submit">Registrarse</button>
            </form>
          </section>
        </main>
    );
}