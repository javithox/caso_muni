
import Registrarse from "./Registrarse/page";
import IniciarSesion from "./IniciarSesion/page";
import Reportes from "./reportes/page";
import Image from "next/image";
import "./estilos/estilo-pagina.css"
import Link from "next/link";
export default function Home() {
  
  return (
    <div>
      <h1 className="titulo-pagina">Valle del Sol
        <div>
          <ul className="lista de botones">
            <button><a href="/" className="btn-nav">Home</a></button>
            <button><a href="/reportes" className="btn-nav">Reportes</a></button>
            <button><a href="/geolocalizacion" className="btn-nav">Geolocalización</a></button>
            <button><a href="/iniciarSesion" className="btn-nav">Iniciar Sesion</a></button>
            <button><a href="/registrarse" className="btn-nav">Registrarse</a></button>
          </ul>
        </div>
      </h1>
    </div>
  );
}
