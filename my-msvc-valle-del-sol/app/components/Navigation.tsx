"use client";

import Link from "next/link";
import { useSession } from "@/app/hooks/useSession";
import { useRouter } from "next/navigation";

export default function Navigation() {
  const { usuario, logout } = useSession();
  const router = useRouter();

  const handleCerrarSesion = () => {
    logout();
    router.push("/");
  };

  return (
    <nav style={{ fontSize: "8px" }}>
      <ul className="lista-de-botones">
        <li>
          <Link href="/" className="btn-nav">
            Home
          </Link>
        </li>
        <li>
          <Link href="/reportes" className="btn-nav">
            Reportes
          </Link>
        </li>
        <li>
          <Link href="/geolocalizacion" className="btn-nav">
            Geolocalización
          </Link>
        </li>
        {usuario ? (
          <>
            <li>
              <Link href="/perfil" className="btn-nav">
                👤 Mi Perfil
              </Link>
            </li>
            <li>
              <button
                onClick={handleCerrarSesion}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Cerrar Sesión
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/iniciarsesion" className="btn-nav">
                Iniciar Sesión
              </Link>
            </li>
            <li>
              <Link href="/registrarse" className="btn-nav">
                Registrarse
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
