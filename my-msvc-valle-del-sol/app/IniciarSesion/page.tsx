"use client";
import Link from "next/link";
import "../estilos/estilo-iniciar-sesion.css";
import { useState, FormEvent } from "react";
import { useSession } from "@/app/hooks/useSession";
import { useRouter } from "next/navigation";

export default function IniciarSesion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useSession();
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
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
        // Usar el contexto para guardar sesión
        const token = data.token || 'token-' + Date.now();
        const usuario = data.usuario || { email, nombre: email.split('@')[0] };
        login(usuario, token);
        // Redirigir a perfil
        router.push('/perfil');
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