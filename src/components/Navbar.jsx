import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ busqueda, setBusqueda, carritoCount, user, logoutHandler, setMostrarModal, filtrarPorGeneroRapido }) => {
  return (
    // 1. NAVBAR TRANSPARENTE (Las clases de vidrio están en index.css)
    <nav className="navbar navbar-expand-lg fixed-top py-3 navbar-dark">
      <div className="container-fluid px-4">
        
        {/* LOGO (El texto tiene degradado gracias al CSS) */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src="/vite.svg" alt="Logo" style={{height: '35px', marginRight: '10px', filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.5))'}} />
          Perfumes Chile
        </Link>
        
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
           
           {/* 2. BUSCADOR OSCURO */}
           <form className="d-flex me-auto ms-lg-4 my-2 my-lg-0 position-relative" style={{maxWidth: '400px', width: '100%'}} onSubmit={e => e.preventDefault()}>
              <div className="input-group">
                  <span className="input-group-text border-0 text-white" style={{backgroundColor: 'rgba(255,255,255,0.1)'}}>🔍</span>
                  <input 
                    className="form-control border-0 text-white" 
                    type="search" 
                    placeholder="Buscar fragancia..." 
                    value={busqueda} 
                    onChange={e => setBusqueda(e.target.value)}
                    style={{
                        backgroundColor: 'rgba(255,255,255,0.1)', 
                        color: 'white',
                        boxShadow: 'none'
                    }}
                  />
              </div>
          </form>

          <ul className="navbar-nav align-items-center gap-3 mb-2 mb-lg-0">
              {/* 3. FILTROS RÁPIDOS (Texto blanco) */}
              <li className="nav-item">
                <button onClick={() => filtrarPorGeneroRapido('hombre')} className="btn nav-link text-white-50 fw-semibold hover-effect">Hombres</button>
              </li>
              <li className="nav-item">
                <button onClick={() => filtrarPorGeneroRapido('mujer')} className="btn nav-link text-white-50 fw-semibold hover-effect">Mujeres</button>
              </li>
              <li className="nav-item">
                <button onClick={() => filtrarPorGeneroRapido('unisex')} className="btn nav-link text-white-50 fw-semibold hover-effect">Unisex</button>
              </li>
              
              {/* 4. CARRITO (Botón Neón) */}
              <li className="nav-item position-relative me-2">
                  <button 
                    className="btn d-flex align-items-center gap-2 rounded-pill px-3" 
                    onClick={() => setMostrarModal(true)}
                    style={{border: '1px solid var(--color-principal)', color: 'white'}}
                  >
                      🛒 <span className="d-none d-lg-inline">Carrito</span>
                      <span className="badge rounded-pill position-absolute top-0 start-100 translate-middle" style={{backgroundColor: 'var(--color-neon-pink)'}}>
                        {carritoCount}
                      </span>
                  </button>
              </li>

              <div className="vr d-none d-lg-block mx-2 bg-secondary opacity-50"></div>

              {/* 5. ZONA DE USUARIO */}
              {user ? (
              <li className="nav-item d-flex align-items-center gap-3">
                
                {/* AVATAR DE USUARIO */}
                <Link to="/profile" className="d-flex flex-column align-items-center text-decoration-none hover-scale" title="Mi Perfil">
                    <div className="rounded-circle text-white d-flex align-items-center justify-content-center mb-1 shadow" 
                         style={{
                             width: '35px', 
                             height: '35px', 
                             fontSize: '16px', 
                             fontWeight: 'bold',
                             background: 'linear-gradient(45deg, var(--color-principal), #00e5ff)' // Degradado en el avatar
                         }}>
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="fw-bold text-white-50 text-truncate" style={{fontSize: '0.7rem', maxWidth: '70px'}}>
                        {user.name.split(' ')[0]}
                    </span>
                </Link>

                {/* BOTONES DE GESTIÓN */}
                <div className="d-flex gap-2 align-items-center ms-2">
                    {!user.isAdmin && (
                        <Link to="/mis-pedidos" className="btn btn-outline-light btn-sm rounded-pill px-3 d-flex align-items-center gap-1">
                            📜 <span className="d-none d-md-inline">Pedidos</span>
                        </Link>
                    )}

                    {user.isAdmin && (
                        <>
                            <Link to="/admin/productlist" className="btn btn-sm rounded-pill px-3 d-flex align-items-center gap-1 text-white" style={{border: '1px solid #00e5ff'}}>
                                📦 <span className="d-none d-md-inline">Prod</span>
                            </Link>
                            <Link to="/admin/orderlist" className="btn btn-sm rounded-pill px-3 d-flex align-items-center gap-1 text-white" style={{border: '1px solid #ffd700'}}>
                                💰 <span className="d-none d-md-inline">Ventas</span>
                            </Link>
                        </>
                    )}

                    <button 
                        className="btn btn-sm rounded-pill px-3 d-flex align-items-center gap-1 text-white" 
                        onClick={logoutHandler}
                        style={{background: 'rgba(255, 42, 109, 0.2)', border: '1px solid var(--color-neon-pink)'}}
                    >
                        🚪
                    </button>
                </div>
              </li>
              ) : (
              // 6. NO LOGUEADO (Usa la clase btn-login definida en index.css)
              <li className="nav-item">
                <Link to="/login" className="btn-login fw-bold small px-4 rounded-pill text-decoration-none">
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