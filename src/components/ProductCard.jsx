import React from 'react';

const ProductCard = ({ prod, wishlist, toggleWishlist, agregarAlCarrito }) => {
  
  const extraerML = (texto) => {
    const match = (texto || "").match(/(\d+)\s*ml/i);
    return match ? parseInt(match[1]) : 0;
  };

  const sinStock = prod.countInStock <= 0;
  const pocoStock = prod.countInStock > 0 && prod.countInStock <= 5;
  const isFavorite = wishlist.some(item => item._id === prod._id);

  return (
    <div className="col-12 col-md-6 col-lg-4 mb-4">
      <div className="card h-100">
        
        <div className="position-relative overflow-hidden">
          
          {sinStock && (
             <span className="badge bg-danger position-absolute top-50 start-50 translate-middle shadow" 
                   style={{zIndex: 10, fontSize: '1rem', padding: '10px 20px', border: '2px solid white'}}>
                 🚫 AGOTADO
             </span>
          )}

          {pocoStock && (
             <span className="badge bg-warning text-dark position-absolute bottom-0 start-0 m-3 shadow fw-bold" style={{zIndex: 10}}>
                 ⚡ ¡Quedan {prod.countInStock}!
             </span>
          )}

          <span className="badge-ml shadow-sm">
              {extraerML(prod.nombre) > 0 ? `${extraerML(prod.nombre)} ml` : 'Perfume'}
          </span>
          
          {/* --- AQUÍ ESTÁ EL CAMBIO DEL CORAZÓN --- */}
          <button 
              className={`btn-heart position-absolute top-0 start-0 m-2 d-flex align-items-center justify-content-center ${isFavorite ? 'active' : ''}`}
              onClick={() => toggleWishlist(prod)}
              style={{
                  zIndex: 5, 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  background: 'rgba(0,0,0,0.4)', // Fondo oscuro para contraste
                  border: 'none',
                  cursor: 'pointer'
              }}
              title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
              {/* DIBUJO SVG DEL CORAZÓN (No falla nunca) */}
              <svg 
                className="heart-icon" 
                width="22" 
                height="22" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
          </button>

          <div className="p-4 d-flex align-items-center justify-content-center" style={{height: '280px', background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)'}}>
            <img 
                src={prod.imagen || '/vite.svg'} 
                className="card-img-top" 
                alt={prod.nombre} 
                style={{
                    maxHeight: '100%', 
                    maxWidth: '100%',
                    objectFit: 'contain', 
                    cursor: 'pointer', 
                    filter: sinStock ? 'grayscale(100%) opacity(0.5)' : 'drop-shadow(0 10px 15px rgba(0,0,0,0.5))'
                }}
                onClick={() => {
                    const nombreLimpio = prod.nombre.replace(/\s*\d+ml\s*/i, "");
                    const query = `site:fragrantica.es ${nombreLimpio} perfume`;
                    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
                }}
            />
          </div>
        </div>

        <div className="card-body d-flex flex-column text-center pt-2">
          <p className="card-text text-white-50 small mb-1 text-uppercase fw-bold letter-spacing-1">
            {prod.categoria}
          </p>
          
          <h6 className="card-title text-white fw-bold mb-3" style={{minHeight: '40px', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
            {prod.nombre}
          </h6>
          
          <h4 className="fw-bold mb-4" style={{color: 'var(--color-principal)', textShadow: '0 0 10px rgba(0, 153, 112, 0.3)'}}>
            ${prod.precio.toLocaleString('es-CL')}
          </h4>
          
          <div className="mt-auto">
             {!sinStock ? (
                 <button onClick={() => agregarAlCarrito(prod)} className="btn-agregar d-flex align-items-center justify-content-center gap-2">
                     <span>Agregar al Carrito</span> 
                     {/* Icono de bolsa SVG simple */}
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm0 17H5V8h14v12h-7z"/>
                     </svg>
                 </button>
             ) : (
                 <button className="btn btn-outline-secondary w-100 rounded-pill" disabled style={{cursor: 'not-allowed', borderColor: '#444', color: '#666'}}>
                     Sin Stock
                 </button>
             )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;