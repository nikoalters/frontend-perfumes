import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('userInfo'));

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

  // --- 👇 FUNCIÓN NUEVA PARA VER LOS PERFUMES 👇 ---
  const verProductos = (items) => {
    // Creamos un texto simple con la lista
    const lista = items.map(item => `▪ ${item.qty}x ${item.nombre}`).join('\n');
    alert(`🛒 PRODUCTOS DEL PEDIDO:\n\n${lista}`);
  };
  // ------------------------------------------------

  // Estilos
  const styles = {
    container: { padding: '2rem', backgroundColor: '#121212', minHeight: '100vh', color: '#fff' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '1rem', backgroundColor: '#1e1e1e' },
    th: { backgroundColor: '#333', padding: '12px', textAlign: 'left', color: '#00d4ff' },
    td: { padding: '12px', borderBottom: '1px solid #333' },
    btnPay: { backgroundColor: '#28a745', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px', marginRight: '5px' },
    btnView: { backgroundColor: '#17a2b8', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' } // Estilo botón nuevo
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
                <th style={styles.th}>ESTADO</th>
                <th style={styles.th}>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td style={styles.td}>...{order._id.slice(-6)}</td>
                  <td style={styles.td}>{order.user ? order.user.name : 'Anónimo'}</td>
                  <td style={styles.td}>${order.totalPrice.toLocaleString('es-CL')}</td>
                  <td style={styles.td}>
                    {order.isPaid ? (
                      <span style={{color: '#00ff00', fontWeight:'bold'}}>✅ PAGADO</span>
                    ) : (
                      <span style={{color: 'red', fontWeight:'bold'}}>❌ PENDIENTE</span>
                    )}
                  </td>
                  <td style={styles.td}>
                    {/* BOTÓN 1: VER PRODUCTOS (NUEVO) */}
                    <button 
                        style={styles.btnView} 
                        onClick={() => verProductos(order.orderItems)}
                        title="Ver lista de perfumes"
                    >
                        👁️ Ver Items
                    </button>

                    {/* BOTÓN 2: APROBAR PAGO (Solo si falta pagar) */}
                    {!order.isPaid && (
                      <button 
                        style={{...styles.btnPay, marginLeft: '10px'}}
                        onClick={() => markAsPaidHandler(order._id)}
                      >
                        💰 Aprobar
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