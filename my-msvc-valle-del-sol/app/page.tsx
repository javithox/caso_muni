import {BrowserRouter , Routes, Route} from "react-router-dom";
import "./estilos/estilo-pagina.css"
export default function Home() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
      </Routes>
    </BrowserRouter>
  );
}
