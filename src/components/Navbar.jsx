import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ busqueda, setBusqueda, carritoCount, user, logoutHandler, setMostrarModal, filtrarPorGeneroRapido }) => {
  return (
    <nav className="navbar navbar-expand-lg fixed-top py-3 navbar-dark">
      <div className="container-fluid px-3 px-lg-4">
        
        {/* 1. LOGO */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <img 
            src="/vite.svg" 
            alt="Logo" 
            style={{ height: '32px', filter: 'drop-shadow(0 0 5px rgba(0,153,112,0.8))' }} 
          />
          <div style={{lineHeight: '1'}}>
            <span className="fw-bold d-block text-white" style={{fontSize: '1.1rem', letterSpacing: '1px'}}>PERFUMES</span>
            <span className="fw-bold d-block" style={{fontSize: '0.75rem', color: 'var(--color-principal)', letterSpacing: '2px'}}>CHILE</span>
          </div>
        </Link>
        
        <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
           
           {/* 2. BUSCADOR */}
           <form className="d-flex mx-lg-4 my-3 my-lg-0 flex-grow-1" style={{maxWidth: '500px'}} onSubmit={e => e.preventDefault()}>
              <div className="input-group rounded-pill overflow-hidden border border-secondary" style={{backgroundColor: 'rgba(255,255,255,0.05)'}}>
                  <span className="input-group-text border-0 text-secondary bg-transparent ps-3">🔍</span>
                  <input 
                    className="form-control border-0 bg-transparent text-white shadow-none" 
                    type="search" 
                    placeholder="Buscar fragancia..." 
                    value={busqueda} 
                    onChange={e => setBusqueda(e.target.value)}
                  />
              </div>
          </form>

          <ul className="navbar-nav align-items-center gap-2 gap-lg-4 mb-2 mb-lg-0 ms-auto">
              
              {/* 3. FILTROS SIMPLES */}
              <div className="d-flex gap-3 justify-content-center my-2 my-lg-0">
                <button onClick={() => filtrarPorGeneroRapido('hombre')} className="btn p-0 text-secondary fw-semibold small hover-white">HOMBRE</button>
                <button onClick={() => filtrarPorGeneroRapido('mujer')} className="btn p-0 text-secondary fw-semibold small hover-white">MUJER</button>
                <button onClick={() => filtrarPorGeneroRapido('unisex')} className="btn p-0 text-secondary fw-semibold small hover-white">UNISEX</button>
              </div>
              
              {/* 4. CARRITO */}
              <li className="nav-item position-relative">
                  <button 
                    className="btn rounded-pill px-3 py-1 d-flex align-items-center gap-2" 
                    onClick={() => setMostrarModal(true)}
                    style={{border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white'}}
                  >
                      <span style={{fontSize: '1.2rem'}}>🛒</span>
                      <span className="d-none d-lg-inline small fw-bold">Carrito</span>
                      {carritoCount > 0 && (
                        <span className="badge rounded-circle d-flex align-items-center justify-content-center p-0 position-absolute top-0 start-100 translate-middle" 
                              style={{width: '20px', height: '20px', backgroundColor: 'var(--color-heart)', fontSize: '0.7rem'}}>
                          {carritoCount}
                        </span>
                      )}
                  </button>
              </li>

              <div className="vr d-none d-lg-block mx-1 bg-secondary opacity-25" style={{height: '25px'}}></div>

              {/* 5. ZONA DE USUARIO (Menú Desplegable Limpio) */}
              {user ? (
              <li className="nav-item dropdown">
                {/* BOTÓN PRINCIPAL (Solo se ve el nombre y avatar) */}
                <a className="nav-link dropdown-toggle d-flex align-items-center gap-2 user-pill p-1 pe-3 rounded-pill text-decoration-none" 
                   href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"
                   style={{background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', transition: '0.3s'}}>
                    
                    <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm" 
                         style={{width: '32px', height: '32px', background: 'linear-gradient(135deg, var(--color-principal), #00d2ff)'}}>
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white fw-bold small">{user.name.split(' ')[0]}</span>
                </a>

                {/* EL MENÚ OCULTO (Se abre al hacer clic) */}
                <ul className="dropdown-menu dropdown-menu-end p-2 border-0 shadow-lg" 
                    style={{background: '#1a1a2e', minWidth: '220px', marginTop: '10px', border: '1px solid rgba(255,255,255,0.1)'}}>
                    
                    <li><Link className="dropdown-item text-white rounded mb-1 hover-green" to="/profile">👤 Mi Perfil</Link></li>
                    
                    {!user.isAdmin && (
                        <li><Link className="dropdown-item text-white rounded mb-1 hover-green" to="/mis-pedidos">📜 Mis Pedidos</Link></li>
                    )}

                    {user.isAdmin && (
                        <>
                            <li><hr className="dropdown-divider bg-secondary opacity-25"/></li>
                            <li><small className="text-muted ms-3" style={{fontSize: '0.7rem'}}>PANEL ADMIN</small></li>
                            <li><Link className="dropdown-item text-info rounded mb-1" to="/admin/productlist">📦 Productos</Link></li>
                            <li><Link className="dropdown-item text-warning rounded mb-1" to="/admin/orderlist">💰 Ventas</Link></li>
                        </>
                    )}

                    <li><hr className="dropdown-divider bg-secondary opacity-25"/></li>
                    
                    <li>
                        <button className="dropdown-item text-danger rounded hover-red fw-bold" onClick={logoutHandler}>
                            🚪 Cerrar Sesión
                        </button>
                    </li>
                </ul>
              </li>
              ) : (
              <li className="nav-item ms-lg-2">
                <Link to="/login" className="btn btn-sm fw-bold px-4 py-2 rounded-pill text-white shadow-lg" 
                      style={{background: 'linear-gradient(90deg, var(--color-principal), #00c48f)', border: 'none'}}>
                    INGRESAR
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