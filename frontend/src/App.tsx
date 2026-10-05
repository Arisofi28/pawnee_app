/**
 * App.tsx
 * -------
 * Configura las 6 rutas de React Router.
 */

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ListaCriaturas } from "./paginas/ListaCriaturas";
import { DetalleCriatura } from "./paginas/DetalleCriatura";
import { FormularioCriatura } from "./paginas/FormularioCriatura";
import { ListaAvistamientos } from "./paginas/ListaAvistamientos";
import { FormularioAvistamiento } from "./paginas/FormularioAvistamiento";
import { Link } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <div className="energy-art" aria-hidden="true">
          <span className="energy-art__ribbon energy-art__ribbon--one" />
          <span className="energy-art__ribbon energy-art__ribbon--two" />
          <span className="energy-art__ribbon energy-art__ribbon--three" />
        </div>
        <header className="topbar">
          <Link className="brand" to="/" aria-label="Pawnee, inicio">
            <span className="brand__mark" aria-hidden="true">P</span>
            <span>PAWNEE <span className="brand__muted">/ ARCHIVO</span></span>
          </Link>
          <nav className="main-nav" aria-label="Navegación principal">
            <Link to="/">Criaturas</Link>
            <Link to="/avistamientos">Avistamientos</Link>
          </nav>
          <span className="topbar__status"><span /> SISTEMA ACTIVO</span>
        </header>
        <main className="workspace">
          <Routes>
            <Route path="/" element={<ListaCriaturas />} />
            <Route path="/criaturas/nueva" element={<FormularioCriatura />} />
            <Route path="/criaturas/:id" element={<DetalleCriatura />} />
            <Route path="/criaturas/:id/editar" element={<FormularioCriatura />} />
            <Route path="/avistamientos" element={<ListaAvistamientos />} />
            <Route path="/avistamientos/nuevo" element={<FormularioAvistamiento />} />
          </Routes>
        </main>
        <footer className="site-footer"><span>DEPARTAMENTO DE PAWNEE</span><span>REGISTRO DE CAMPO · 2026</span></footer>
      </div>
    </BrowserRouter>
  );
}
