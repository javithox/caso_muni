"use client";


import Link from "next/link";
import "../estilos/estilo-registrarse.css";
import { useState, FormEvent } from "react";


export default function Registrarse() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMensaje("");
    try {
      const response = await fetch("http://localhost:8081/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ nombre, email, password })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Error en el registro");
      }
      setMensaje("Registro exitoso");
    } catch (error: any) {
      setMensaje(error?.message || "Error en la solicitud");
    }
  };

  return (
    <main>
          
          <nav style={{ fontSize: "8px"}}>
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