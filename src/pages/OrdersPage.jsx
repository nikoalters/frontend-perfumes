import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const OrdersPage = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Obtener usuario
  const user = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const obtenerPedidos = async () => {
      try {
        if (!user) {
          navigate('/login');
          return;
        }

        const res = await fetch('https://api-perfumes-chile.onrender.com/api/orders/myorders', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Error al cargar los pedidos');
        }

        const data = await res.json();
        setPedidos(data.reverse()); // Más recientes primero
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    obtenerPedidos();
  }, [user, navigate]);

  // --- HELPER PARA ESTADOS (Badge Neón) ---
  const getStatusConfig = (pedido) => {
      if (pedido.isCancelled) return { className: 'status-cancelado', label: '🚫 Cancelado' };
      if (pedido.isDelivered) return { className: 'status-enviado', label: '🚚 Enviado' };
      if (pedido.isPaid) return { className: 'status-pagado', label: '✅ Pagado' };
      return { className: 'status-pendiente', label: '⏳ Pendiente' };
  };

  return (
    <div className="min-vh-100 py-5" 
         style={{ background: '#050505', paddingTop: '120px' }}> {/* Fondo Oscuro Profundo */}
      
      <div className="container mt-5">
        
        {/* --- HEADER --- */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-3">
          <div>
            <h2 className="fw-bold display-6 text-white mb-0" 
                style={{ textShadow: '0 0 10px rgba(255,255,255,0.3)' }}>
              MIS PEDIDOS
            </h2>
            <p className="text-secondary small mb-0">Historial de transacciones</p>
          </div>
          
          <Link to="/" className="btn rounded-pill px-4 fw-bold text-white d-flex align-items-center gap-2"
                style={{ 
                   background: 'rgba(255,255,255,0.05)', 
                   border: '1px solid rgba(255,255,255,0.1)',
                   transition: '0.3s'
                }}>
            <i className="bi bi-arrow-left"></i> Volver a la Tienda
          </Link>
        </div>

        {/* --- CONTENIDO PRINCIPAL --- */}
        {loading && <div className="text-center text-white py-5">Cargando datos del sistema...</div>}
        {error && <div className="text-center text-danger py-5">{error}</div>}

        {!loading && !error && pedidos.length === 0 && (
          <div className="text-center py-5 border border-secondary border-opacity-25 rounded-4" style={{background: 'rgba(255,255,255,0.02)'}}>
            <h3 className="text-white-50">No hay registros de misión.</h3>
            <p className="text-secondary">Aún no has realizado pedidos.</p>
            <Link to="/" className="btn btn-outline-success rounded-pill mt-3">Ir a comprar</Link>
          </div>
        )}

        {!loading && !error && pedidos.length > 0 && (
          <div className="holo-container">
            <div className="table-responsive">
              <table className="table tech-table mb-0">
                <thead>
                  <tr>
                    <th>ID DE RASTREO</th>
                    <th>FECHA</th>
                    <th>TOTAL</th>
                    <th className="text-center">ESTADO</th>
                    <th className="text-center">DETALLES</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((pedido) => {
                    const status = getStatusConfig(pedido);
                    
                    return (
                      <tr key={pedido._id}>
                        {/* ID Monospace Cian */}
                        <td style={{fontFamily: 'monospace', color: '#00e5ff', verticalAlign: 'middle'}}>
                          #{pedido._id.slice(-6).toUpperCase()}
                        </td>
                        
                        <td style={{verticalAlign: 'middle'}}>
                          {new Date(pedido.createdAt).toLocaleDateString()}
                        </td>
                        
                        <td className="fw-bold text-white" style={{verticalAlign: 'middle'}}>
                          ${pedido.totalPrice.toLocaleString('es-CL')}
                        </td>
                        
                        {/* Badge de Estado Neón */}
                        <td className="text-center" style={{verticalAlign: 'middle'}}>
                          <span className={`neon-badge ${status.className}`}>
                            {status.label}
                          </span>
                        </td>

                        {/* Botón Ojo Tecnológico */}
                        <td className="text-center" style={{verticalAlign: 'middle'}}>
                          <div className="d-flex justify-content-center">
                              <button 
                                className="btn-eye"
                                onClick={() => {
                                    // Construcción del HTML para el SweetAlert DARK
                                    let htmlList = '<div style="text-align: left; margin-top: 10px;">';
                                    pedido.orderItems.forEach(item => {
                                        htmlList += `
                                          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #444; padding: 10px 0;">
                                            <div style="display:flex; align-items:center; gap: 10px;">
                                                <span style="color: #fff; font-size: 0.9rem;">${item.nombre}</span>
                                            </div>
                                            <span style="color: #00ff41; font-weight: bold;">x${item.qty}</span>
                                          </div>`;
                                    });
                                    htmlList += '</div>';

                                    Swal.fire({
                                        title: '<span style="color: white">📦 Detalle del Pedido</span>',
                                        html: htmlList,
                                        background: '#1e1e2e', // Fondo oscuro alerta
                                        color: '#fff',          // Texto blanco alerta
                                        confirmButtonText: 'Cerrar',
                                        confirmButtonColor: '#009970',
                                        showCloseButton: true
                                    });
                                }}
                              >
                                <i className="bi bi-eye-fill"></i>
                              </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default OrdersPage;