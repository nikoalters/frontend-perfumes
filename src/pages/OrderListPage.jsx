import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('userInfo'));

  // 1. Cargar todas las órdenes
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
      navigate('/login'); // Si no es admin, ¡fuera!
    }
  }, [navigate]);

  // 2. Función para marcar como PAGADO
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
        
        if (res.ok) {
          // Recargar la lista para ver el cambio verde
          fetchOrders(); 
        } else {
          alert('Error al actualizar el pago');
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  // --- ESTILOS DARK ---
  const styles = {
    container: { padding: '2rem', backgroundColor: '#121212', minHeight: '100vh', color: '#fff' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '1rem', backgroundColor: '#1e1e1e' },
    th: { backgroundColor: '#333', padding: '12px', textAlign: 'left', color: '#00d4ff' },
    td: { padding: '12px', borderBottom: '1px solid #333' },
    btnPay: { backgroundColor: '#28a745', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' },
    btnDisabled: { backgroundColor: '#555', color: '#ccc', border: 'none', padding: '5px 10px', borderRadius: '4px' }
  };

  return (
    <div style={styles.container}>
      <h1 style={{color: '#00d4ff'}}>Panel de Ventas (Admin)</h1>
      
      {loading && <p>Cargando ventas...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && (
        <div style={{overflowX: 'auto'}}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>USUARIO</th>
                <th style={styles.th}>FECHA</th>
                <th style={styles.th}>TOTAL</th>
                <th style={styles.th}>PAGADO</th>
                <th style={styles.th}>ACCIÓN</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td style={styles.td}>...{order._id.substring(18, 24)}</td>
                  <td style={styles.td}>{order.user && order.user.name}</td>
                  <td style={styles.td}>{order.createdAt.substring(0, 10)}</td>
                  <td style={styles.td}>${order.totalPrice.toLocaleString('es-CL')}</td>
                  <td style={styles.td}>
                    {order.isPaid ? (
                      <span style={{color: '#00ff00', fontWeight:'bold'}}>✅ {order.paidAt.substring(0, 10)}</span>
                    ) : (
                      <span style={{color: 'red', fontWeight:'bold'}}>❌ Pendiente</span>
                    )}
                  </td>
                  <td style={styles.td}>
                    {!order.isPaid && (
                      <button 
                        style={styles.btnPay}
                        onClick={() => markAsPaidHandler(order._id)}
                      >
                        💰 Aprobar Pago
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