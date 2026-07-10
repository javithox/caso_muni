"use client";


import Link from "next/link";
import "../estilos/estilo-registrarse.css";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/hooks/useSession";


export default function Registrarse() {
  const [nombre, setNombre] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const { login } = useSession();
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMensaje("");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ nombreCompleto, nombre, email, password })
      });

      const data = await response.json();
      if (response.ok) {
        // Guardar sesión automáticamente después del registro
        const token = data.token || 'token-' + Date.now();
        const usuario = data.usuario || { email, nombre: nombreCompleto };
        login(usuario, token);
        setMensaje("✅ Registro exitoso. Redirigiendo a tu perfil...");
        setTimeout(() => {
          router.push('/perfil');
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
          <h1 className="titulo-pagina">Registrarse</h1>
          <section className="form-container">
            <form className="form-registro" onSubmit={handleSubmit}>
              
              <label>Nombre Completo</label>
              <input 
                type="text" 
                placeholder="Ingresa tu nombre completo" 
                required 
                value={nombreCompleto}
                onChange={(e) => setNombreCompleto(e.target.value)}
              />
              <label>Nombre de Usuario</label>
              <input 
                type="text" 
                placeholder="Ingresa tu nombre de usuario" 
                required 
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
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