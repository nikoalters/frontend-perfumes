import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const OrdersPage = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener usuario del almacenamiento
  const user = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const obtenerPedidos = async () => {
      try {
        if (!user) {
          setError('Debes iniciar sesión para ver tus pedidos.');
          setLoading(false);
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
        setPedidos(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    obtenerPedidos();
  }, [user]);

  // --- ESTILOS SIMPLES (Dark Mode) ---
  const styles = {
    container: {
      padding: '2rem',
      backgroundColor: '#121212',
      minHeight: '100vh',
      color: '#fff',
      fontFamily: 'Arial, sans-serif'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem'
    },
    title: {
      fontSize: '2rem',
      color: '#00d4ff' // Color Neon
    },
    btnVolver: {
      padding: '10px 20px',
      backgroundColor: '#333',
      color: '#fff',
      textDecoration: 'none',
      borderRadius: '5px',
      border: '1px solid #555'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '1rem',
      backgroundColor: '#1e1e1e',
      borderRadius: '8px',
      overflow: 'hidden'
    },
    th: {
      backgroundColor: '#333',
      padding: '15px',
      textAlign: 'left',
      color: '#00d4ff'
    },
    td: {
      padding: '15px',
      borderBottom: '1px solid #333'
    },
    status: (isPaid) => ({
      color: isPaid ? '#00ff00' : '#ff4444',
      fontWeight: 'bold',
      padding: '5px 10px',
      borderRadius: '4px',
      backgroundColor: isPaid ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 68, 68, 0.1)'
    })
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Mis Pedidos</h1>
        <Link to="/" style={styles.btnVolver}>← Volver a la Tienda</Link>
      </div>

      {loading && <p>Cargando pedidos...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && pedidos.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h3>Aún no has realizado pedidos.</h3>
          <p>¡Vuelve a la tienda y elige tu perfume favorito!</p>
        </div>
      )}

      {!loading && !error && pedidos.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID PEDIDO</th>
                <th style={styles.th}>FECHA</th>
                <th style={styles.th}>TOTAL</th>
                <th style={styles.th}>PAGO</th>
                <th style={styles.th}>ENTREGA</th>
                <th style={styles.th}>DETALLES</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido._id}>
                  <td style={styles.td}>#{pedido._id.substring(0, 10)}...</td>
                  <td style={styles.td}>{pedido.createdAt.substring(0, 10)}</td>
                  <td style={styles.td}>${pedido.totalPrice.toLocaleString('es-CL')}</td>
                  <td style={styles.td}>
                    <span style={styles.status(pedido.isPaid)}>
                      {pedido.isPaid ? 'APROBADO' : 'PENDIENTE'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {pedido.isDelivered ? '📦 ENVIADO' : '⌛ PROCESANDO'}
                  </td>
                  <td style={styles.td}>
                    <button onClick={() => alert(`Productos: ${pedido.orderItems.map(i => i.nombre).join(', ')}`)} style={{cursor:'pointer', background:'transparent', border:'1px solid #777', color:'white', padding:'5px'}}>
                      Ver Items
                    </button>
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

export default OrdersPage;