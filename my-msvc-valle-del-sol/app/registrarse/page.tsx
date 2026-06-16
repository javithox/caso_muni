"use client";


import Link from "next/link";
import "../estilos/estilo-registrarse.css";
import { useState, FormEvent } from "react";


export default function Registrarse() {
  const [nombre, setNombre] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMensaje("");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ nombre, nombreCompleto, email, password })
      });

      const data = await response.json();
      if (response.ok) {
        setMensaje("✅ Registro exitoso. Redirigiendo a iniciar sesión...");
        setTimeout(() => {
          window.location.href = '/iniciarsesion';
        }, 1500);
      } else {
        setMensaje(`❌ ${data?.mensaje || "Error en el registro"}`);
      }
    } catch (error: any) {
      setMensaje(`❌ ${error?.message || "Error en la solicitud"}`);
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
            <form className="form-registro" onSubmit={handleSubmit}>
              <label>Nombre de Usuario</label>
              <input 
                type="text" 
                placeholder="Ingresa tu nombre de usuario" 
                required 
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />

              <label>Nombre Completo</label>
              <input 
                type="text" 
                placeholder="Ingresa tu nombre completo" 
                required 
                value={nombreCompleto}
                onChange={(e) => setNombreCompleto(e.target.value)}
              />

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
                placeholder="Crea una contraseña" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {mensaje && <p style={{ color: mensaje.includes('✅') ? 'green' : 'red' }}>{mensaje}</p>}

              <button type="submit">Registrarse</button>
            </form>
          </section>
        </main>
    );
}