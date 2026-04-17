"use client";

export default function IniciarSesion() {
    return(
        <div>
          <h1>iniciar sesion</h1>
          <ul className="lista de botones">
            <a href="/" className="btn-nav">Home</a>
            <a href="/reportes" className="btn-nav">Reportes</a>
            <a href="/geolocalizacion" className="btn-nav">Geolocalización</a>
            <a href="/iniciarSesion" className="btn-nav">Iniciar Sesion</a>
            <a href="/registrarse" className="btn-nav">Registrarse</a>
          </ul>
        </div>

    );
}