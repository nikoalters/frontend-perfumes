import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ busqueda, setBusqueda, carritoCount, user, logoutHandler, setMostrarModal, filtrarPorGeneroRapido }) => {
  return (
    <nav className="navbar navbar-expand-lg fixed-top shadow-sm bg-white py-2">
      <div className="container-fluid px-4">
        {/* 1. LOGO */}
        <a className="navbar-brand fw-bold d-flex align-items-center text-success" href="/">
          <img src="/vite.svg" alt="Logo" style={{height: '35px', marginRight: '10px'}} />
          Perfumes Chile
        </a>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
           {/* 2. BUSCADOR */}
           <form className="d-flex me-auto ms-lg-4 my-2 my-lg-0" style={{maxWidth: '400px', width: '100%'}} onSubmit={e => e.preventDefault()}>
              <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted">🔍</span>
                  <input className="form-control bg-light border-start-0" type="search" placeholder="Buscar perfume..." value={busqueda} onChange={e => setBusqueda(e.target.value)}/>
              </div>
          </form>

          <ul className="navbar-nav align-items-center gap-3 mb-2 mb-lg-0">
              {/* 3. FILTROS RÁPIDOS */}
              <li className="nav-item"><button onClick={() => filtrarPorGeneroRapido('hombre')} className="btn nav-link small text-secondary fw-semibold">Hombres</button></li>
              <li className="nav-item"><button onClick={() => filtrarPorGeneroRapido('mujer')} className="btn nav-link small text-secondary fw-semibold">Mujeres</button></li>
              <li className="nav-item"><button onClick={() => filtrarPorGeneroRapido('unisex')} className="btn nav-link small text-secondary fw-semibold">Unisex</button></li>
              
              {/* 4. CARRITO */}
              <li className="nav-item position-relative me-2">
                  <button className="btn btn-outline-secondary d-flex align-items-center gap-2 rounded-pill px-3" onClick={() => setMostrarModal(true)}>
                      🛒 <span className="d-none d-lg-inline">Carrito</span>
                      <span className="badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle">{carritoCount}</span>
                  </button>
              </li>

              <div className="vr d-none d-lg-block mx-2 text-secondary"></div>

              {/* 5. ZONA DE USUARIO (LOGUEADO) */}
              {user ? (
              <li className="nav-item d-flex align-items-center gap-3">
                
                {/* PERFIL VERTICAL (Icono y Nombre) */}
                <Link to="/profile" className="d-flex flex-column align-items-center text-decoration-none text-secondary" style={{cursor: 'pointer', lineHeight: '1'}} title="Ir a mi Perfil">
                    <i className="bi bi-person-circle text-success fs-5 mb-1"></i>
                    <span className="fw-bold text-truncate" style={{fontSize: '0.7rem', maxWidth: '70px'}}>
                        {user.name.split(' ')[0]}
                    </span>
                </Link>

                {/* BOTONES DE GESTIÓN CON TEXTO RESTAURADO */}
                <div className="d-flex gap-2 align-items-center">
                    {/* Botón Mis Pedidos (Cliente) */}
                    {!user.isAdmin && (
                        <Link to="/mis-pedidos" className="btn btn-light btn-sm rounded-pill px-3 border d-flex align-items-center gap-1">
                            📜 Pedidos
                        </Link>
                    )}

                    {/* Botones Admin (Con Texto) */}
                    {user.isAdmin && (
                        <>
                            <Link to="/admin/productlist" className="btn btn-dark btn-sm rounded-pill px-3 d-flex align-items-center gap-1">
                                📦 Productos
                            </Link>
                            <Link to="/admin/orderlist" className="btn btn-warning btn-sm rounded-pill px-3 d-flex align-items-center gap-1">
                                💰 Ventas
                            </Link>
                        </>
                    )}

                    {/* Botón Salir (Con Texto) */}
                    <button className="btn btn-outline-danger btn-sm rounded-pill px-3 d-flex align-items-center gap-1" onClick={logoutHandler}>
                        🚪 Salir
                    </button>
                </div>
              </li>
              ) : (
              // 6. NO LOGUEADO
              <li className="nav-item"><Link to="/login" className="btn-login fw-bold small px-4 rounded-pill text-decoration-none">Ingresar</Link></li>
              )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;