import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const OrdersPage = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Obtener usuario del almacenamiento
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
        // Ordenamos para ver el más reciente arriba
        setPedidos(data.reverse());
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    obtenerPedidos();
  }, [user, navigate]);

  // --- ESTILOS MEJORADOS ---
  const styles = {
    container: {
      padding: '2rem',
      backgroundColor: '#f8f9fa', // Fondo claro más limpio para el cliente
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    },
    header: {
      maxWidth: '1000px',
      margin: '0 auto 2rem auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: '2rem',
      color: '#333',
      borderBottom: '3px solid #28a745',
      paddingBottom: '5px'
    },
    btnVolver: {
      padding: '8px 16px',
      backgroundColor: '#333',
      color: '#fff',
      textDecoration: 'none',
      borderRadius: '20px',
      fontWeight: 'bold',
      fontSize: '0.9rem'
    },
    tableContainer: {
      maxWidth: '1000px',
      margin: '0 auto',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      backgroundColor: '#343a40',
      padding: '15px',
      textAlign: 'left',
      color: '#fff',
      fontSize: '0.9rem',
      textTransform: 'uppercase'
    },
    td: {
      padding: '15px',
      borderBottom: '1px solid #eee',
      color: '#555',
      fontSize: '0.95rem'
    },
    // ETIQUETAS DE ESTADO (Badges)
    badge: (bgColor, textColor = 'white') => ({
      backgroundColor: bgColor,
      color: textColor,
      padding: '5px 12px',
      borderRadius: '20px',
      fontWeight: 'bold',
      fontSize: '0.8rem',
      display: 'inline-block',
      textAlign: 'center',
      minWidth: '80px'
    }),
    btnVer: {
        background: '#17a2b8',
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '5px',
        cursor: 'pointer'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Mis Pedidos</h1>
        <Link to="/" style={styles.btnVolver}>← Volver a la Tienda</Link>
      </div>

      {loading && <p style={{textAlign:'center'}}>Cargando historial...</p>}
      {error && <p style={{ color: 'red', textAlign:'center' }}>{error}</p>}

      {!loading && !error && pedidos.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: '50px', color:'#777' }}>
          <h3>Aún no has realizado pedidos.</h3>
          <p>¡Vuelve a la tienda y elige tu perfume favorito!</p>
        </div>
      )}

      {!loading && !error && pedidos.length > 0 && (
        <div style={styles.tableContainer}>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>FECHA</th>
                  <th style={styles.th}>TOTAL</th>
                  <th style={styles.th}>ESTADO</th>
                  <th style={styles.th}>DETALLES</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido) => (
                  <tr key={pedido._id}>
                    <td style={styles.td}>#{pedido._id.slice(-6)}</td>
                    <td style={styles.td}>{pedido.createdAt.substring(0, 10)}</td>
                    <td style={styles.td} style={{fontWeight:'bold'}}>${pedido.totalPrice.toLocaleString('es-CL')}</td>
                    
                    {/* 👇 LÓGICA DE ESTADOS COMPLETA 👇 */}
                    <td style={styles.td}>
                      {pedido.isCancelled ? (
                        <span style={styles.badge('#dc3545')}>🚫 Cancelado</span>
                      ) : pedido.isDelivered ? (
                        <span style={styles.badge('#007bff')}>🚚 Enviado</span>
                      ) : pedido.isPaid ? (
                        <span style={styles.badge('#28a745')}>✅ Pagado</span>
                      ) : (
                        <span style={styles.badge('#ffc107', '#333')}>⏳ Pendiente</span>
                      )}
                    </td>

                    <td style={styles.td}>
  <button 
    style={styles.btnVer}
    onClick={() => {
        // Construimos la lista bonita para el cliente
        let htmlList = '<div style="text-align: left; margin-top: 10px;">';
        pedido.orderItems.forEach(item => {
            htmlList += `
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding: 8px 0;">
                <span style="color: #333;">${item.nombre}</span>
                <span style="color: #28a745; font-weight: bold;">x${item.qty}</span>
              </div>`;
        });
        htmlList += '</div>';

        Swal.fire({
            title: '🛍️ Tu Compra',
            html: htmlList,
            confirmButtonText: 'Genial',
            confirmButtonColor: '#28a745',
            background: '#fff', 
            color: '#333'
        });
    }}
  >
    👁️ Ver
  </button>
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;