import React from 'react';

const Footer = ({ filtrarPorGeneroRapido }) => {
  return (
    <footer className="footer-pro bg-dark text-white pt-5">
      <div className="container pb-4">
        <div className="row">
          <div className="col-md-4 mb-4">
            <h5 className="mb-3 text-uppercase fw-bold d-flex align-items-center">
                <img src="/vite.svg" alt="Logo" style={{height: '25px', marginRight: '10px'}} />PERFUMES CHILE
            </h5>
            <p className="small text-white-50">Tu tienda de confianza para fragancias 100% originales en Chile.</p>
            <div className="d-flex gap-3 mt-3">
                <a href="https://www.instagram.com/nico_alters?igsh=em9xb2NuN2h6NTc=" target="_blank" rel="noopener noreferrer" className="text-white-50 d-flex align-items-center gap-1 small text-decoration-none"><span className="text-danger">📷</span> Instagram</a>
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-white-50 d-flex align-items-center gap-1 small text-decoration-none"><span className="text-primary">👍</span> Facebook</a>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <h5 className="mb-3 text-uppercase fw-bold">NAVEGACIÓN</h5>
            <ul className="list-unstyled small">
              <li className="mb-2"><button onClick={() => filtrarPorGeneroRapido('hombre')} className="btn p-0 text-white-50 text-decoration-none">◆ Perfumes Hombre</button></li>
              <li className="mb-2"><button onClick={() => filtrarPorGeneroRapido('mujer')} className="btn p-0 text-white-50 text-decoration-none">◆ Perfumes Mujer</button></li>
              <li className="mb-2"><button onClick={() => filtrarPorGeneroRapido('unisex')} className="btn p-0 text-white-50 text-decoration-none">◆ Perfumes Unisex</button></li>
              <li className="mb-2"><button onClick={() => filtrarPorGeneroRapido('todos')} className="btn p-0 text-white-50 text-decoration-none">◆ Sobre Nosotros</button></li>
            </ul>
          </div>
          <div className="col-md-4 mb-4">
            <h5 className="mb-3 text-uppercase fw-bold">CONTÁCTANOS</h5>
            <ul className="list-unstyled small text-white-50">
                <li className="mb-2 d-flex align-items-center gap-2">📍 Santiago, Chile</li>
                <li className="mb-2 d-flex align-items-center gap-2">📱 +56 9 5854 7236</li>
                <li className="mb-2 d-flex align-items-center gap-2">📧 contacto@perfumeschile.cl</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom text-center py-3 border-top border-secondary">
        <div className="container d-flex justify-content-between small text-white-50">
            <p className="m-0">&copy; 2025 <strong>Perfumes Chile</strong>.</p>
            <p className="m-0">Desarrollado con ❤️ en Chile</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;