import Image from "next/image";
import "./globals.css";
export default function Home() {
  const backgroundColor = "#99d20a";
  return (
    <div>
      <h1 className="titulo-pagina" style={{backgroundColor}}>Valle del Sol
        <div>
          <ul className="lista de botones" style={{backgroundColor}}>
            <a href="#" className="btn-nav">Reportes</a>
            <a href="#" className="btn-nav">Geolocalización</a>
            <a href="#" className="btn-nav">Iniciar Sesion</a>
            <a href="#" className="btn-nav">Registrarse</a>
          </ul>
        </div>
      </h1>
    </div>
  );
}
