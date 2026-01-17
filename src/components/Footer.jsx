import React from 'react';

const Footer = ({ filtrarPorGeneroRapido }) => {
  return (
    <footer className="text-white pt-5 position-relative" style={{ backgroundColor: '#020202' }}>
      
      {/* LÍNEA DE LUZ SUPERIOR (Sutil) */}
      <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--color-principal), transparent)',
          opacity: 0.5
      }}></div>

      <div className="container pb-4">
        <div className="row">
          
          {/* COLUMNA 1: MARCA Y REDES */}
          <div className="col-md-4 mb-4">
            <h5 className="mb-4 text-uppercase fw-bold d-flex align-items-center gap-2" style={{letterSpacing: '1px'}}>
                <img 
                  src="/vite.svg" 
                  alt="Logo" 
                  style={{height: '28px', filter: 'drop-shadow(0 0 5px rgba(0,153,112,0.6))'}} 
                />
                <span>PERFUMES <span style={{color: 'var(--color-principal)'}}>CHILE</span></span>
            </h5>
            <p className="text-secondary small" style={{lineHeight: '1.6', maxWidth: '300px'}}>
              Redefiniendo el lujo. Tu destino exclusivo para fragancias 100% originales con servicio premium en todo Chile.
            </p>
            
            {/* REDES SOCIALES ESTILIZADAS */}
            <div className="d-flex gap-3 mt-4">
                <a href="https://www.instagram.com/nico_alters?igsh=em9xb2NuN2h6NTc=" target="_blank" rel="noopener noreferrer" 
                   className="btn btn-sm border-0 d-flex align-items-center gap-2 rounded-pill px-3"
                   style={{background: 'rgba(255,255,255,0.05)', color: '#fff', transition: '0.3s'}}>
                    <i className="bi bi-instagram" style={{background: '-webkit-linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}></i> 
                    <span className="small">Instagram</span>
                </a>
                
                <a href="https://wa.me/56958547236" target="_blank" rel="noopener noreferrer" 
                   className="btn btn-sm border-0 d-flex align-items-center gap-2 rounded-pill px-3"
                   style={{background: 'rgba(255,255,255,0.05)', color: '#fff', transition: '0.3s'}}>
                    <i className="bi bi-whatsapp" style={{color: '#25D366'}}></i> 
                    <span className="small">WhatsApp</span>
                </a>
            </div>
          </div>

          {/* COLUMNA 2: NAVEGACIÓN */}
          <div className="col-md-4 mb-4">
            <h5 className="mb-4 text-uppercase fw-bold text-white-50" style={{fontSize: '0.9rem', letterSpacing: '1px'}}>Explorar</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                  <button onClick={() => filtrarPorGeneroRapido('hombre')} className="btn p-0 text-secondary text-decoration-none hover-link">
                    › Hombre
                  </button>
              </li>
              <li className="mb-2">
                  <button onClick={() => filtrarPorGeneroRapido('mujer')} className="btn p-0 text-secondary text-decoration-none hover-link">
                    › Mujer
                  </button>
              </li>
              <li className="mb-2">
                  <button onClick={() => filtrarPorGeneroRapido('unisex')} className="btn p-0 text-secondary text-decoration-none hover-link">
                    › Unisex
                  </button>
              </li>
              <li className="mb-2">
                  <button onClick={() => filtrarPorGeneroRapido('todos')} className="btn p-0 text-secondary text-decoration-none hover-link">
                    › Ver Catálogo Completo
                  </button>
              </li>
            </ul>
          </div>

          {/* COLUMNA 3: CONTACTO */}
          <div className="col-md-4 mb-4">
            <h5 className="mb-4 text-uppercase fw-bold text-white-50" style={{fontSize: '0.9rem', letterSpacing: '1px'}}>Contacto Directo</h5>
            <ul className="list-unstyled text-secondary small">
                <li className="mb-3 d-flex align-items-start gap-2">
                    <i className="bi bi-geo-alt-fill text-white" style={{marginTop: '3px'}}></i> 
                    <span>Santiago, Región Metropolitana,<br/>Chile.</span>
                </li>
                <li className="mb-3 d-flex align-items-center gap-2">
                    <i className="bi bi-whatsapp text-white"></i> 
                    <span className="text-white">+56 9 5854 7236</span>
                </li>
                <li className="mb-3 d-flex align-items-center gap-2">
                    <i className="bi bi-envelope-fill text-white"></i> 
                    <span>contacto@perfumeschile.cl</span>
                </li>
            </ul>
          </div>

        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="text-center py-4" style={{ backgroundColor: '#000', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center small text-secondary">
            <p className="m-0">&copy; 2026 <strong className="text-white">Perfumes Chile</strong>. Todos los derechos reservados.</p>
            <p className="m-0 mt-2 mt-md-0 d-flex align-items-center gap-1">
                Desarrollado con <i className="bi bi-lightning-fill text-warning"></i> por <span className="text-white fw-bold">NicoAlters</span>
            </p>
        </div>
      </div>

      {/* PEQUEÑO ESTILO EXTRA PARA HOVER */}
      <style>{`
        .hover-link:hover {
            color: var(--color-principal) !important;
            padding-left: 5px;
            transition: all 0.3s ease;
        }
      `}</style>
    </footer>
  );
};

export default Footer;