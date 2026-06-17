"use client";
import Link from "next/link";
import "../estilos/estilo-iniciar-sesion.css";
import { useState, FormEvent } from "react";

export default function IniciarSesion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        // Guardar token y datos del usuario
        localStorage.setItem('token', data.token || 'token-' + Date.now());
        localStorage.setItem('usuario', JSON.stringify(data.usuario || { email, nombre: email.split('@')[0] }));
        // Redirigir a perfil
        window.location.href = '/perfil';
      } else {
        setError(data?.message || "Error al iniciar sesión.");
      }
    } catch (error) {
      console.error(error);
      setError("No se pudo conectar con el servidor.");
    }
  };

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

        <form className="form-login" onSubmit={handleSubmit}>

          <label>Email</label>
          <input 
            type="email" 
            placeholder="Ingresa tu email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Contraseña</label>
          <input 
            type="password" 
            placeholder="Ingresa tu contraseña" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button type="submit">Ingresar</button>

        </form>

      </section>

    </main>
  );
}