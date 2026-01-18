import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('userInfo'));

  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('https://api-perfumes-chile.onrender.com/api/orders/myorders', {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const data = await res.json();
        // Ordenar por fecha descendente
        if(Array.isArray(data)) {
            setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    if (user) fetchOrders();
  }, [user]);

  // Configuración de Badges
  const getStatusConfig = (order) => {
    if (order.isCancelled) return { class: 'status-cancelado', text: 'Cancelado' };
    if (order.isDelivered) return { class: 'status-enviado', text: 'Enviado' };
    if (order.isPaid) return { class: 'status-pagado', text: 'Pagado' };
    return { class: 'status-pendiente', text: 'Pendiente' };
  };

  return (
    <div className="min-vh-100 py-5" style={{ background: '#050505', paddingTop: '120px' }}>
      <div className="container mt-5">
        
        {/* ENCABEZADO */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h2 className="fw-bold text-white mb-0" style={{ letterSpacing: '1px' }}>MIS PEDIDOS</h2>
            <p className="text-secondary small">Historial de transacciones</p>
          </div>
          <Link to="/" className="btn btn-outline-light rounded-pill px-4 d-flex align-items-center gap-2" style={{borderColor: 'rgba(255,255,255,0.2)'}}>
            <i className="bi bi-arrow-left"></i> Tienda
          </Link>
        </div>

        {/* TABLA */}
        <div className="holo-container">
          {loading ? (
             <div className="p-5 text-center text-white">Cargando...</div>
          ) : orders.length === 0 ? (
             <div className="p-5 text-center text-white-50">No tienes pedidos aún.</div>
          ) : (
            <div className="table-responsive">
              <table className="table tech-table align-middle">
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
                  {orders.map((order) => {
                    const status = getStatusConfig(order);
                    return (
                      <tr key={order._id}>
                        {/* ID en Cian Brillante */}
                        <td style={{fontFamily: 'monospace', color: '#00e5ff', fontWeight: 'bold'}}>
                          #{order._id.slice(-6).toUpperCase()}
                        </td>
                        
                        {/* Fecha */}
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        
                        {/* Total */}
                        <td className="fw-bold text-white">
                          ${order.totalPrice.toLocaleString('es-CL')}
                        </td>
                        
                        {/* Estado */}
                        <td className="text-center">
                          <span className={`neon-badge ${status.class}`}>
                            {status.text}
                          </span>
                        </td>
                        
                        {/* BOTÓN VER (EL OJO) */}
                        <td className="text-center">
                          <div className="d-flex justify-content-center">
                              <Link to={`/order/${order._id}`} className="btn-eye" title="Ver detalle">
                                <i className="bi bi-eye-fill"></i>
                              </Link>
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