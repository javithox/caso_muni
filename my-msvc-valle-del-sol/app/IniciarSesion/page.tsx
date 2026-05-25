"use client";
import Link from "next/link";
import "../estilos/estilo-iniciar-sesion.css";

export default function IniciarSesion() {
  return (
    <main>

      {/* TÍTULO */}
      <h1 className="titulo-pagina">Iniciar Sesión</h1>

      {/* NAV */}
      <nav style={{ fontSize: "8px"}}>
        <ul className="lista-de-botones">
          <li><Link href="/" className="btn-nav">Home</Link></li>
          <li><Link href="/reportes" className="btn-nav">Reportes</Link></li>
          <li><Link href="/geolocalizacion" className="btn-nav">Geolocalización</Link></li>
          <li><Link href="/iniciarsesion" className="btn-nav">Iniciar Sesión</Link></li>
          <li><Link href="/registrarse" className="btn-nav">Registrarse</Link></li>
        </ul>
      </nav>

      {/* FORMULARIO */}
      <section className="form-container">

        <form className="form-login">

          <label>Email</label>
          <input type="email" placeholder="Ingresa tu email" required />

          <label>Contraseña</label>
          <input type="password" placeholder="Ingresa tu contraseña" required />

          <button type="submit">Ingresar</button>

        </form>

      </section>

    </main>
  );
}