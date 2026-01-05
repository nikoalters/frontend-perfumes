import React from 'react';

const ProductCard = ({ prod, wishlist, toggleWishlist, agregarAlCarrito }) => {
  
  // Función auxiliar pequeña para extraer ML
  const extraerML = (texto) => {
    const match = (texto || "").match(/(\d+)\s*ml/i);
    return match ? parseInt(match[1]) : 0;
  };

  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 shadow-sm border-0">
        <div className="position-relative">
          {/* Badge ML */}
          <span className="badge bg-dark position-absolute top-0 end-0 m-2 opacity-75">
              {extraerML(prod.nombre) > 0 ? `${extraerML(prod.nombre)}ml` : 'Perfume'}
          </span>
          
          {/* Botón Corazón */}
          <button 
              className="position-absolute top-0 start-0 m-2 btn p-0 border-0 bg-transparent shadow-none"
              onClick={() => toggleWishlist(prod)}
              style={{fontSize: '1.5rem', zIndex: 5, transition: 'transform 0.2s'}}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
              {wishlist.some(item => item._id === prod._id) ? '❤️' : '🤍'}
          </button>

          {/* IMAGEN CLICKEABLE (Google Fragrantica) */}
          <img 
              src={prod.imagen} 
              className="card-img-top p-3" 
              alt={prod.nombre} 
              style={{height: '250px', objectFit: 'contain', cursor: 'pointer', transition: 'transform 0.2s'}}
              title="Ver ficha técnica en Google"
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onClick={() => {
                  const nombreLimpio = prod.nombre.replace(/\s*\d+ml\s*/i, "");
                  const query = `site:fragrantica.es ${nombreLimpio} perfume`;
                  window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
              }}
          />
        </div>
        <div className="card-body d-flex flex-column">
          <h6 className="card-title text-truncate fw-bold">{prod.nombre}</h6>
          <p className="card-text text-muted small mb-2">{prod.categoria}</p>
          <h5 className="text-success fw-bold mb-auto">${prod.precio.toLocaleString('es-CL')}</h5>
          <button onClick={() => agregarAlCarrito(prod)} className="btn-agregar mt-3">Añadir 🛒</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;