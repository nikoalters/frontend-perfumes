import React from 'react';

const ProductCard = ({ prod, wishlist, toggleWishlist, agregarAlCarrito }) => {
  
  // Función auxiliar para extraer ML
  const extraerML = (texto) => {
    const match = (texto || "").match(/(\d+)\s*ml/i);
    return match ? parseInt(match[1]) : 0;
  };

  // Variables de stock
  const sinStock = prod.countInStock <= 0;
  const pocoStock = prod.countInStock > 0 && prod.countInStock <= 5;
  const isFavorite = wishlist.some(item => item._id === prod._id);

  return (
    <div className="col-12 col-md-6 col-lg-4 mb-4">
      <div className="card h-100">
        
        {/* --- ZONA DE IMAGEN Y BADGES --- */}
        <div className="position-relative overflow-hidden">
          
          {/* 1. BADGE SIN STOCK (Rojo intenso) */}
          {sinStock && (
             <span className="badge bg-danger position-absolute top-50 start-50 translate-middle shadow" 
                   style={{zIndex: 10, fontSize: '1rem', padding: '10px 20px', border: '2px solid white'}}>
                 🚫 AGOTADO
             </span>
          )}

          {/* 2. BADGE POCO STOCK (Amarillo advertencia) */}
          {pocoStock && (
             <span className="badge bg-warning text-dark position-absolute bottom-0 start-0 m-3 shadow fw-bold" style={{zIndex: 10}}>
                 ⚡ ¡Quedan {prod.countInStock}!
             </span>
          )}

          {/* 3. BADGE ML (CORREGIDO: Ahora usa la clase .badge-ml del CSS para máxima visibilidad) */}
          <span className="badge-ml shadow-sm">
              {extraerML(prod.nombre) > 0 ? `${extraerML(prod.nombre)} ml` : 'Perfume'}
          </span>
          
          {/* 4. BOTÓN FAVORITOS (Circular y Reactivo) */}
          <button 
              className={`btn-heart position-absolute top-0 start-0 m-2 ${isFavorite ? 'active' : ''}`}
              onClick={() => toggleWishlist(prod)}
              style={{zIndex: 5}}
              title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
              {/* Usamos íconos Bootstrap si están disponibles, si no, emojis */}
              <i className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'}`} style={{fontSize: '1.1rem'}}></i>
          </button>

          {/* 5. IMAGEN (Con efecto flotante) */}
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

        {/* --- ZONA DE INFORMACIÓN --- */}
        <div className="card-body d-flex flex-column text-center pt-2">
          {/* Categoría en gris claro */}
          <p className="card-text text-white-50 small mb-1 text-uppercase fw-bold letter-spacing-1">
            {prod.categoria}
          </p>
          
          {/* Nombre en blanco brillante */}
          <h6 className="card-title text-white fw-bold mb-3" style={{minHeight: '40px', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
            {prod.nombre}
          </h6>
          
          {/* Precio en Verde Neón */}
          <h4 className="fw-bold mb-4" style={{color: 'var(--color-principal)', textShadow: '0 0 10px rgba(0, 153, 112, 0.3)'}}>
            ${prod.precio.toLocaleString('es-CL')}
          </h4>
          
          {/* Botón de Acción */}
          <div className="mt-auto">
             {!sinStock ? (
                 <button onClick={() => agregarAlCarrito(prod)} className="btn-agregar d-flex align-items-center justify-content-center gap-2">
                     <span>Agregar al Carrito</span> 
                     <i className="bi bi-bag-plus-fill"></i>
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