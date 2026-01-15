import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ busqueda, setBusqueda, carritoCount, user, logoutHandler, setMostrarModal, filtrarPorGeneroRapido }) => {
  return (
    <nav className="navbar navbar-expand-lg fixed-top py-3 navbar-dark">
      <div className="container-fluid px-3 px-lg-4">
        
        {/* LOGO */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img 
            src="/vite.svg" 
            alt="Logo" 
            style={{ height: '32px', marginRight: '8px', filter: 'drop-shadow(0 0 5px rgba(0,153,112,0.5))' }} 
          />
          <span className="fw-bold">Perfumes</span><span className="fw-bold" style={{color: 'var(--color-principal)'}}>Chile</span>
        </Link>
        
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
           
           {/* BUSCADOR (Texto blanco forzado) */}
           <form className="d-flex me-auto ms-lg-4 my-3 my-lg-0 position-relative w-100" style={{maxWidth: '400px'}} onSubmit={e => e.preventDefault()}>
              <div className="input-group">
                  <span className="input-group-text border-0 text-secondary" style={{backgroundColor: 'rgba(255,255,255,0.05)'}}>🔍</span>
                  <input 
                    className="form-control border-0" 
                    type="search" 
                    placeholder="Buscar fragancia..." 
                    value={busqueda} 
                    onChange={e => setBusqueda(e.target.value)}
                    style={{
                        backgroundColor: 'rgba(255,255,255,0.05)', 
                        color: 'white', // Texto blanco al escribir
                        boxShadow: 'none'
                    }}
                  />
              </div>
          </form>

          <ul className="navbar-nav align-items-center gap-2 gap-lg-3 mb-2 mb-lg-0">
              
              {/* FILTROS */}
              <div className="d-flex gap-2 justify-content-center w-100 w-lg-auto my-2 my-lg-0">
                <button onClick={() => filtrarPorGeneroRapido('hombre')} className="btn btn-sm text-secondary hover-effect">Hombre</button>
                <button onClick={() => filtrarPorGeneroRapido('mujer')} className="btn btn-sm text-secondary hover-effect">Mujer</button>
                <button onClick={() => filtrarPorGeneroRapido('unisex')} className="btn btn-sm text-secondary hover-effect">Unisex</button>
              </div>
              
              {/* CARRITO */}
              <li className="nav-item position-relative me-lg-2">
                  <button 
                    className="btn d-flex align-items-center gap-2 rounded-pill px-3 w-100 justify-content-center" 
                    onClick={() => setMostrarModal(true)}
                    style={{border: '1px solid var(--color-principal)', color: 'white', background: 'transparent'}}
                  >
                      🛒 <span>Carrito</span>
                      <span className="badge rounded-pill bg-danger position-absolute top-0 start-100 translate-middle">
                        {carritoCount}
                      </span>
                  </button>
              </li>

              <div className="vr d-none d-lg-block mx-2 bg-secondary opacity-25"></div>

              {/* ZONA DE USUARIO */}
              {user ? (
              <li className="nav-item w-100 w-lg-auto">
                <div className="d-flex flex-column flex-lg-row align-items-center gap-3 mt-3 mt-lg-0 p-3 p-lg-0 rounded bg-lg-transparent" style={{backgroundColor: 'rgba(255,255,255,0.03)'}}>
                    
                    {/* Perfil */}
                    <Link to="/profile" className="d-flex align-items-center text-decoration-none gap-2" title="Ir a Perfil">
                        <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm" 
                             style={{width: '32px', height: '32px', background: 'var(--color-principal)'}}>
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white small fw-bold">{user.name.split(' ')[0]}</span>
                    </Link>

                    {/* Botones de Gestión (CORRECCIÓN MÓVIL: Texto siempre visible) */}
                    <div className="d-flex flex-wrap gap-2 justify-content-center">
                        {!user.isAdmin && (
                            <Link to="/mis-pedidos" className="btn btn-outline-light btn-sm rounded-pill px-3">
                                📜 Pedidos
                            </Link>
                        )}

                        {user.isAdmin && (
                            <>
                                <Link to="/admin/productlist" className="btn btn-outline-info btn-sm rounded-pill px-3">
                                    📦 Productos
                                </Link>
                                <Link to="/admin/orderlist" className="btn btn-outline-warning btn-sm rounded-pill px-3">
                                    💰 Ventas
                                </Link>
                            </>
                        )}

                        <button 
                            className="btn btn-sm rounded-pill px-3 d-flex align-items-center gap-1 text-danger border-danger bg-transparent" 
                            onClick={logoutHandler}
                        >
                            🚪 Salir
                        </button>
                    </div>
                </div>
              </li>
              ) : (
              <li className="nav-item mt-3 mt-lg-0">
                <Link to="/login" className="btn fw-bold px-4 rounded-pill text-white w-100" style={{background: 'var(--color-principal)'}}>
                    Ingresar
                </Link>
              </li>
              )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;