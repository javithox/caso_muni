"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "../estilos/estilo-pagina.css";
import { useSession } from "@/app/hooks/useSession";
import { useRouter } from "next/navigation";

interface Usuario {
  id?: number;
  nombreCompleto: string;
  email: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  rol: string;
  activo: boolean;
  fechaCreacion: string;
  ultimoIngreso: string;
  verificado: boolean;
}

export default function Perfil() {
  const { usuario, isLoading, actualizarUsuario } = useSession();
  const router = useRouter();
  const [datosUsuario, setDatosUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(false);
  const [datos, setDatos] = useState<Partial<Usuario>>({});
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [passwordConfirmar, setPasswordConfirmar] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (!isLoading && !usuario) {
      router.push("/iniciarsesion");
    } else if (!isLoading && usuario) {
      cargarPerfil();
    }
  }, [usuario, isLoading, router]);

  const cargarPerfil = async () => {
    try {
      if (!usuario?.id) {
        setDatosUsuario(usuario as Usuario);
        setDatos(usuario || {});
        setCargando(false);
        return;
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";
      
      const response = await fetch(`${API_URL}/api/auth/perfil/${usuario.id}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (response.ok) {
        const datosResponse = await response.json();
        setDatosUsuario(datosResponse);
        setDatos(datosResponse);
      } else {
        setDatosUsuario(usuario as Usuario);
        setDatos(usuario || {});
      }
    } catch (err) {
      console.error("Error:", err);
      setDatosUsuario(usuario as Usuario);
      setDatos(usuario || {});
    } finally {
      setCargando(false);
    }
  };

  const handleActualizarPerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");

    try {
      if (!datosUsuario?.id && !usuario?.id) {
        setMensaje("❌ No se puede actualizar sin ID de usuario");
        return;
      }

      const userId = datosUsuario?.id || usuario?.id;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";
      
      const response = await fetch(`${API_URL}/api/auth/perfil/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(datos)
      });

      if (response.ok) {
        const usuarioActualizado = await response.json();
        setDatosUsuario(usuarioActualizado);
        actualizarUsuario(usuarioActualizado);
        setMensaje("✅ Perfil actualizado exitosamente");
        setEditando(false);
      } else {
        setMensaje("❌ Error al actualizar el perfil");
      }
    } catch (err: any) {
      setMensaje(`❌ Error: ${err.message}`);
    }
  };

  const handleCambiarContrasena = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");

    if (passwordNueva !== passwordConfirmar) {
      setMensaje("❌ Las contraseñas no coinciden");
      return;
    }

    try {
      if (!datosUsuario?.id && !usuario?.id) return;

      const userId = datosUsuario?.id || usuario?.id;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";
      
      const response = await fetch(`${API_URL}/api/auth/cambiar-contrasena/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          passwordActual,
          passwordNueva
        })
      });

      if (response.ok) {
        setMensaje("✅ Contraseña actualizada exitosamente");
        setPasswordActual("");
        setPasswordNueva("");
        setPasswordConfirmar("");
      } else {
        setMensaje("❌ Error al cambiar la contraseña");
      }
    } catch (err: any) {
      setMensaje(`❌ Error: ${err.message}`);
    }
  };

  if (isLoading || cargando) {
    return (
      <main style={{ padding: "20px" }}>
        <h1>Cargando perfil...</h1>
      </main>
    );
  }

  if (!datosUsuario && !usuario) {
    return (
      <main style={{ padding: "20px" }}>
        <h1>Error</h1>
        <p>No hay sesión activa. Por favor inicia sesión.</p>
        <Link href="/iniciarsesion" className="btn-primary">
          Ir a Iniciar Sesión
        </Link>
      </main>
    );
  }

  const usuarioActual = datosUsuario || usuario;

  return (
    <main style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "30px", color: "#334155" }}>👤 Mi Perfil</h1>

      {mensaje && (
        <div
          style={{
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "4px",
            backgroundColor: mensaje.includes("✅") ? "#d1fae5" : "#fee2e2",
            color: mensaje.includes("✅") ? "#065f46" : "#991b1b"
          }}
        >
          {mensaje}
        </div>
      )}

      {usuarioActual && (
        <>
          {/* INFORMACIÓN GENERAL */}
          <div
            style={{
              backgroundColor: "#f8fafc",
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "20px",
              border: "1px solid #e2e8f0"
            }}
          >
            <h2 style={{ color: "#334155", marginBottom: "15px" }}>
              📋 Información General
            </h2>

            {editando ? (
              <form onSubmit={handleActualizarPerfil}>
                <div style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                    Email:
                  </label>
                  <input
                    type="email"
                    value={datos.email || ""}
                    disabled
                    style={{
                      width: "100%",
                      padding: "8px",
                      backgroundColor: "#e2e8f0",
                      border: "1px solid #cbd5e1",
                      borderRadius: "4px"
                    }}
                  />
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                    Nombre Completo:
                  </label>
                  <input
                    type="text"
                    value={datos.nombreCompleto || ""}
                    onChange={(e) => setDatos({ ...datos, nombreCompleto: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #cbd5e1",
                      borderRadius: "4px"
                    }}
                  />
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                    Teléfono:
                  </label>
                  <input
                    type="text"
                    value={datos.telefono || ""}
                    onChange={(e) => setDatos({ ...datos, telefono: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #cbd5e1",
                      borderRadius: "4px"
                    }}
                  />
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                    Dirección:
                  </label>
                  <input
                    type="text"
                    value={datos.direccion || ""}
                    onChange={(e) => setDatos({ ...datos, direccion: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #cbd5e1",
                      borderRadius: "4px"
                    }}
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                    Ciudad:
                  </label>
                  <input
                    type="text"
                    value={datos.ciudad || ""}
                    onChange={(e) => setDatos({ ...datos, ciudad: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #cbd5e1",
                      borderRadius: "4px"
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="submit"
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#16a34a",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    💾 Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditando(false);
                      setDatos(datosUsuario || usuario || {});
                    }}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#64748b",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    ✕ Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div style={{ marginBottom: "10px" }}>
                  <strong>Email:</strong> {usuarioActual.email}
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <strong>Nombre Completo:</strong> {usuarioActual.nombreCompleto || "No especificado"}
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <strong>Teléfono:</strong> {usuarioActual.telefono || "No especificado"}
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <strong>Dirección:</strong> {usuarioActual.direccion || "No especificado"}
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <strong>Ciudad:</strong> {usuarioActual.ciudad || "No especificado"}
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <strong>Rol:</strong> {usuarioActual.rol}
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <strong>Estado:</strong> {usuarioActual.activo ? "✅ Activo" : "❌ Inactivo"}
                </div>

                <button
                  onClick={() => setEditando(true)}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  ✏️ Editar Perfil
                </button>
              </>
            )}
          </div>

          {/* CAMBIAR CONTRASEÑA */}
          <div
            style={{
              backgroundColor: "#f8fafc",
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "20px",
              border: "1px solid #e2e8f0"
            }}
          >
            <h2 style={{ color: "#334155", marginBottom: "15px" }}>🔐 Cambiar Contraseña</h2>

            <form onSubmit={handleCambiarContrasena}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                  Contraseña Actual:
                </label>
                <input
                  type="password"
                  value={passwordActual}
                  onChange={(e) => setPasswordActual(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "4px"
                  }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                  Contraseña Nueva:
                </label>
                <input
                  type="password"
                  value={passwordNueva}
                  onChange={(e) => setPasswordNueva(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "4px"
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                  Confirmar Contraseña:
                </label>
                <input
                  type="password"
                  value={passwordConfirmar}
                  onChange={(e) => setPasswordConfirmar(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "4px"
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                🔐 Cambiar Contraseña
              </button>
            </form>
          </div>

          {/* INFORMACIÓN ADICIONAL */}
          <div
            style={{
              backgroundColor: "#f8fafc",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0"
            }}
          >
            <h2 style={{ color: "#334155", marginBottom: "15px" }}>ℹ️ Información Adicional</h2>
            <div style={{ marginBottom: "10px" }}>
              <strong>Cuenta creada:</strong>{" "}
              {usuarioActual.fechaCreacion ? new Date(usuarioActual.fechaCreacion).toLocaleDateString("es-ES") : "N/A"}
            </div>
            <div style={{ marginBottom: "10px" }}>
              <strong>Último ingreso:</strong>{" "}
              {usuarioActual.ultimoIngreso
                ? new Date(usuarioActual.ultimoIngreso).toLocaleString("es-ES")
                : "Primera vez"}
            </div>
            <div style={{ marginBottom: "10px" }}>
              <strong>Verificado:</strong> {usuarioActual.verificado ? "✅ Sí" : "❌ No"}
            </div>
          </div>
        </>
      )}
    </main>
  );
}
