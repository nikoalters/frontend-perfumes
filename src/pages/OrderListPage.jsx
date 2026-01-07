import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('userInfo'));

  // 1. Cargar Pedidos
  const fetchOrders = async () => {
    try {
      const res = await fetch('https://api-perfumes-chile.onrender.com/api/orders', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (!res.ok) throw new Error('Error cargando pedidos');
      const data = await res.json();
      setOrders(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.isAdmin) {
      fetchOrders();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // 2. Marcar como PAGADO
  const markAsPaidHandler = async (id) => {
    if (window.confirm('¿Confirmas que recibiste el pago de este pedido?')) {
      try {
        const res = await fetch(`https://api-perfumes-chile.onrender.com/api/orders/${id}/pay`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
        if (res.ok) fetchOrders(); 
      } catch (error) {
        console.error(error);
      }
    }
  };

  // 3. Marcar como ENVIADO (NUEVA FUNCIÓN) 🚚
  const markAsDeliveredHandler = async (id) => {
    if (window.confirm('¿Ya enviaste este pedido al cliente?')) {
      try {
        const res = await fetch(`https://api-perfumes-chile.onrender.com/api/orders/${id}/deliver`, {
          method: 'PUT', // Método PUT para actualizar
          headers: {
            Authorization: `Bearer ${user.token}`,
          }
        });
        if (res.ok) fetchOrders();
      } catch (error) {
        console.error(error);
      }
    }
  };

  // 4. Ver productos
  const verProductos = (items) => {
    const lista = items.map(item => `▪ ${item.qty}x ${item.nombre}`).join('\n');
    alert(`🛒 PRODUCTOS DEL PEDIDO:\n\n${lista}`);
  };

  // Estilos Dark Mode
  const styles = {
    container: { padding: '2rem', backgroundColor: '#121212', minHeight: '100vh', color: '#fff' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '1rem', backgroundColor: '#1e1e1e' },
    th: { backgroundColor: '#333', padding: '12px', textAlign: 'left', color: '#00d4ff' },
    td: { padding: '12px', borderBottom: '1px solid #333' },
    btnPay: { backgroundColor: '#28a745', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px', marginLeft: '5px' },
    btnDeliver: { backgroundColor: '#fd7e14', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px', marginLeft: '5px' }, // Botón Naranja
    btnView: { backgroundColor: '#17a2b8', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }
  };

  return (
    <div style={styles.container}>
      <h1 style={{color: '#00d4ff'}}>Panel de Ventas (Admin)</h1>
      
      {!loading && (
        <div style={{overflowX: 'auto'}}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>USUARIO</th>
                <th style={styles.th}>TOTAL</th>
                <th style={styles.th}>PAGO</th>
                <th style={styles.th}>ENTREGA</th> {/* Columna Nueva */}
                <th style={styles.th}>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td style={styles.td}>...{order._id.slice(-6)}</td>
                  <td style={styles.td}>{order.user ? order.user.name : 'Anónimo'}</td>
                  <td style={styles.td}>${order.totalPrice.toLocaleString('es-CL')}</td>
                  
                  {/* Estado de PAGO */}
                  <td style={styles.td}>
                    {order.isPaid ? (
                      <span style={{color: '#00ff00', fontWeight:'bold'}}>✅ PAGADO</span>
                    ) : (
                      <span style={{color: 'red', fontWeight:'bold'}}>❌ PENDIENTE</span>
                    )}
                  </td>

                  {/* Estado de ENTREGA (Nuevo) */}
                  <td style={styles.td}>
                    {order.isDelivered ? (
                      <span style={{color: '#00ff00', fontWeight:'bold'}}>✅ ENVIADO</span>
                    ) : (
                      <span style={{color: 'orange', fontWeight:'bold'}}>⌛ PROCESANDO</span>
                    )}
                  </td>

                  {/* Botones de Acción */}
                  <td style={styles.td}>
                    {/* 1. Ver Items */}
                    <button 
                        style={styles.btnView} 
                        onClick={() => verProductos(order.orderItems)}
                        title="Ver lista"
                    >
                        👁️
                    </button>

                    {/* 2. Aprobar Pago (Si falta pagar) */}
                    {!order.isPaid && (
                      <button 
                        style={styles.btnPay}
                        onClick={() => markAsPaidHandler(order._id)}
                        title="Aprobar Pago"
                      >
                        💰
                      </button>
                    )}

                    {/* 3. Enviar (Si ya pagó y falta enviar) */}
                    {order.isPaid && !order.isDelivered && (
                      <button 
                        style={styles.btnDeliver}
                        onClick={() => markAsDeliveredHandler(order._id)}
                        title="Marcar como Enviado"
                      >
                        🚚
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderListPage;