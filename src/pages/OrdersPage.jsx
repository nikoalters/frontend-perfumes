import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const OrdersPage = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerPedidos = async () => {
      try {
        if (!user) {
          navigate('/login');
          return;
        }

        const res = await fetch('https://api-perfumes-chile.onrender.com/api/orders/myorders', {
          headers: { Authorization: `Bearer ${user.token}` }
        });

        const data = await res.json();
        
        // Ordenar: Más recientes primero
        if(Array.isArray(data)){
             setPedidos(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    obtenerPedidos();
  }, [user, navigate]);

  // Configuración visual según estado
  const getStatusConfig = (pedido) => {
    if (pedido.isCancelled) return { class: 'status-cancelado', text: 'Cancelado' };
    if (pedido.isDelivered) return { class: 'status-enviado', text: 'Enviado' };
    if (pedido.isPaid) return { class: 'status-pagado', text: 'Pagado' };
    return { class: 'status-pendiente', text: 'Pendiente' };
  };

  return (
    <div className="min-vh-100 py-5" style={{ background: '#050505', paddingTop: '120px' }}>
      <div className="container mt-5">
        
        {/* ENCABEZADO */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h2 className="fw-bold text-white mb-0" style={{ letterSpacing: '1px', textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>
              MIS PEDIDOS
            </h2>
            <p className="text-secondary small mb-0">Historial de transacciones</p>
          </div>
          <Link to="/" className="btn btn-outline-light rounded-pill px-4 d-flex align-items-center gap-2" 
                style={{borderColor: 'rgba(255,255,255,0.2)', color: 'white'}}>
            <i className="bi bi-arrow-left"></i> Volver a la Tienda
          </Link>
        </div>

        {/* CONTENEDOR HOLOGRÁFICO */}
        <div className="holo-container">
          {loading ? (
             <div className="p-5 text-center text-white">Cargando sistema...</div>
          ) : pedidos.length === 0 ? (
             <div className="p-5 text-center text-white-50">
                <h4>No hay registros.</h4>
                <p>Aún no has realizado compras.</p>
             </div>
          ) : (
            <div className="table-responsive">
              <table className="table tech-table mb-0 align-middle">
                <thead>
                  <tr>
                    <th>ID RASTREO</th>
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
                        {/* ID */}
                        <td style={{fontFamily: 'monospace', color: '#00e5ff', fontWeight: 'bold'}}>
                          #{pedido._id.slice(-6).toUpperCase()}
                        </td>
                        
                        {/* Fecha */}
                        <td className="text-light">
                            {new Date(pedido.createdAt).toLocaleDateString()}
                        </td>
                        
                        {/* Total */}
                        <td className="fw-bold text-white">
                          ${pedido.totalPrice.toLocaleString('es-CL')}
                        </td>
                        
                        {/* Estado */}
                        <td className="text-center">
                          <span className={`neon-badge ${status.class}`}>
                            {status.text}
                          </span>
                        </td>
                        
                        {/* BOTÓN OJO (Aquí está la magia) */}
                        <td className="text-center">
                          <div className="d-flex justify-content-center">
                              {/* Usamos 'button' para el SweetAlert */}
                              <button 
                                className="btn-eye" 
                                title="Ver Detalles"
                                onClick={() => {
                                    // HTML para el SweetAlert oscuro
                                    let htmlList = '<div style="text-align: left; margin-top: 10px;">';
                                    pedido.orderItems.forEach(item => {
                                        htmlList += `
                                          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #444; padding: 10px 0;">
                                            <span style="color: #fff;">${item.nombre}</span>
                                            <span style="color: #00ff41; font-weight: bold;">x${item.qty}</span>
                                          </div>`;
                                    });
                                    htmlList += '</div>';

                                    Swal.fire({
                                        title: '📦 Detalle del Pedido',
                                        html: htmlList,
                                        background: '#1e1e2e',
                                        color: '#fff',
                                        confirmButtonColor: '#009970',
                                        confirmButtonText: 'Cerrar'
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
          )}
        </div>

      </div>
    </div>
  );
};

export default OrdersPage;