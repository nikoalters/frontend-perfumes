import React from 'react';
import { Link } from 'react-router-dom'; // <--- 1. Importamos Link para navegar sin recargar

const Navbar = ({ busqueda, setBusqueda, carritoCount, user, logoutHandler, setMostrarModal, filtrarPorGeneroRapido }) => {
  return (
    <nav className="navbar navbar-expand-lg fixed-top shadow-sm bg-white py-3">
      <div className="container-fluid px-4">
        <a className="navbar-brand fw-bold d-flex align-items-center text-success" href="/">
          <img src="/vite.svg" alt="Logo" style={{height: '35px', marginRight: '10px'}} />
          Perfumes Chile
        </a>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
           <form className="d-flex me-auto ms-lg-4 my-2 my-lg-0" style={{maxWidth: '400px', width: '100%'}} onSubmit={e => e.preventDefault()}>
              <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted">🔍</span>
                  <input className="form-control bg-light border-start-0" type="search" placeholder="Buscar perfume..." value={busqueda} onChange={e => setBusqueda(e.target.value)}/>
              </div>
          </form>

          <ul className="navbar-nav align-items-center gap-3 mb-2 mb-lg-0">
              <li className="nav-item"><button onClick={() => filtrarPorGeneroRapido('hombre')} className="btn nav-link small text-secondary fw-semibold">Hombres</button></li>
              <li className="nav-item"><button onClick={() => filtrarPorGeneroRapido('mujer')} className="btn nav-link small text-secondary fw-semibold">Mujeres</button></li>
              <li className="nav-item"><button onClick={() => filtrarPorGeneroRapido('unisex')} className="btn nav-link small text-secondary fw-semibold">Unisex</button></li>
              <li className="nav-item"><button onClick={() => filtrarPorGeneroRapido('todos')} className="btn nav-link small text-secondary fw-semibold">Nosotros</button></li>
              
              <li className="nav-item position-relative">
                  <button className="btn btn-outline-secondary d-flex align-items-center gap-2 rounded-pill px-3" onClick={() => setMostrarModal(true)}>
                      🛒 Carrito
                      <span className="badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle">{carritoCount}</span>
                  </button>
              </li>

              {user ? (
              <li className="nav-item d-flex align-items-center gap-2 ms-2">
                  <span className="fw-bold text-success small me-2">Hola, {user.name.split(' ')[0]}</span>

                  {/* --- 🛡️ BOTÓN SECRETO DE ADMIN 🛡️ --- */}
                  {/* Solo se renderiza si user.isAdmin es true */}
                  {user.isAdmin && (
                    <Link to="/admin/productlist" className="btn btn-dark btn-sm rounded-pill px-3">
                        ⚙️ Panel
                    </Link>
                  )}
                  {/* ------------------------------------- */}

                  <button className="btn btn-outline-danger btn-sm rounded-pill px-3" onClick={logoutHandler}>Salir</button>
              </li>
              ) : (
              <li className="nav-item"><a href="/login" className="btn-login fw-bold small px-4 rounded-pill">Ingresar</a></li>
              )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;