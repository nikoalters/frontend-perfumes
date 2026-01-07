import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('userInfo'));

  // --- CÁLCULOS DE ESTADÍSTICAS (Variables de Estado) ---
  const [stats, setStats] = useState({
    ingresos: 0,
    ventasTotales: 0,
    pendientes: 0
  });

  const fetchOrders = async () => {
    try {
      const res = await fetch('https://api-perfumes-chile.onrender.com/api/orders', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (!res.ok) throw new Error('Error cargando pedidos');
      const data = await res.json();
      
      const ordenados = data.reverse();
      setOrders(ordenados);

      // --- 📊 CALCULADORA DE NEGOCIO ---
      const totalIngresos = ordenados.reduce((acc, order) => {
        // Solo sumamos si está PAGADO y NO cancelado
        return (order.isPaid && !order.isCancelled) ? acc + order.totalPrice : acc;
      }, 0);

      const totalVentas = ordenados.filter(o => o.isPaid && !o.isCancelled).length;
      const totalPendientes = ordenados.filter(o => !o.isPaid && !o.isCancelled).length;

      setStats({
        ingresos: totalIngresos,
        ventasTotales: totalVentas,
        pendientes: totalPendientes
      });
      // ---------------------------------

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

  const handleAction = (id, action) => {
    let confirmTitle = '';
    let confirmText = '';
    let confirmIcon = '';
    let confirmButtonColor = '';

    if (action === 'pay') {
        confirmTitle = '¿Aprobar Pago?';
        confirmText = 'Se marcará el pedido como PAGADO.';
        confirmIcon = 'question';
        confirmButtonColor = '#00b894';
    } else if (action === 'deliver') {
        confirmTitle = '¿Marcar como Enviado?';
        confirmText = 'El cliente verá que su pedido va en camino.';
        confirmIcon = 'info';
        confirmButtonColor = '#0984e3';
    } else if (action === 'cancel') {
        confirmTitle = '¿Rechazar Pedido?';
        confirmText = 'Esta acción no se puede deshacer.';
        confirmIcon = 'warning';
        confirmButtonColor = '#d63031';
    }

    Swal.fire({
      title: confirmTitle,
      text: confirmText,
      icon: confirmIcon,
      showCancelButton: true,
      confirmButtonColor: confirmButtonColor,
      cancelButtonColor: '#2d3436',
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar',
      background: '#1e1e2f',
      color: '#fff'
    }).then(async (result) => {
      if (result.isConfirmed) {
        let url = action === 'pay' ? '/pay' : action === 'deliver' ? '/deliver' : '/cancel';
        try {
            const res = await fetch(`https://api-perfumes-chile.onrender.com/api/orders/${id}${url}`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${user.token}` }
            });
            if (res.ok) {
                fetchOrders();
                Swal.fire({
                    title: '¡Listo!',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                    background: '#1e1e2f',
                    color: '#fff'
                });
            }
        } catch (error) { console.error(error); }
      }
    });
  };

  const verProductos = (items) => {
    let htmlList = '<div style="text-align: left; padding: 0 20px;">';
    items.forEach(item => {
        htmlList += `
          <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #444;">
            <span style="color: #fff;">${item.nombre}</span>
            <span style="color: #00cec9; font-weight: bold;">x${item.qty}</span>
          </div>`;
    });
    htmlList += '</div>';

    Swal.fire({
        title: '📦 Contenido',
        html: htmlList,
        background: '#1e1e2f',
        color: '#fff',
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#6c5ce7',
        width: '400px'
    });
  };

  // --- ESTILOS ---
  const s = {
    container: { padding: '40px', backgroundColor: '#0f0f1a', minHeight: '100vh', fontFamily: 'Arial, sans-serif' },
    headerTitle: { color: 'white', fontSize: '2rem', fontWeight: 'bold', borderLeft: '5px solid #6c5ce7', paddingLeft: '15px' },
    
    // ESTILOS DE LAS TARJETAS DE ESTADÍSTICAS
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px', marginTop: '20px' },
    statCard: { backgroundColor: '#1e1e2f', padding: '20px', borderRadius: '15px', border: '1px solid #2d2d44', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' },
    statNumber: { fontSize: '2rem', fontWeight: 'bold', color: '#fff', margin: '10px 0' },
    statLabel: { color: '#a29bfe', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' },

    // ESTILOS DE LA LISTA DE PEDIDOS
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
    card: { backgroundColor: '#1e1e2f', borderRadius: '15px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', position: 'relative', border: '1px solid #2d2d44' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid #333', paddingBottom: '10px' },
    idText: { color: '#a29bfe', fontWeight: 'bold', fontSize: '0.9rem' },
    dateText: { color: '#b2bec3', fontSize: '0.8rem' },
    row: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#dfe6e9', fontSize: '0.95rem' },
    price: { color: '#00cec9', fontWeight: 'bold', fontSize: '1.2rem' },
    badge: (color) => ({ backgroundColor: color, color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase' }),
    actionContainer: { marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' },
    btn: (bg) => ({ flex: 1, backgroundColor: bg, border: 'none', color: 'white', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }),
    btnOutline: { flex: 1, background: 'transparent', border: '1px solid #6c5ce7', color: '#6c5ce7', padding: '8px', borderRadius: '8px', cursor: 'pointer' }
  };

  return (
    <div style={s.container}>
      <h1 style={s.headerTitle}>Panel de Control</h1>
      
      {/* 📊 SECCIÓN DE ESTADÍSTICAS (NUEVA) */}
      {!loading && (
        <div style={s.statsGrid}>
            <div style={s.statCard}>
                <div style={s.statLabel}>Ingresos Totales</div>
                <div style={{...s.statNumber, color: '#00b894'}}>${stats.ingresos.toLocaleString('es-CL')}</div>
            </div>
            <div style={s.statCard}>
                <div style={s.statLabel}>Ventas Cerradas</div>
                <div style={{...s.statNumber, color: '#0984e3'}}>{stats.ventasTotales}</div>
            </div>
            <div style={s.statCard}>
                <div style={s.statLabel}>Pendientes de Pago</div>
                <div style={{...s.statNumber, color: '#fdcb6e'}}>{stats.pendientes}</div>
            </div>
        </div>
      )}
      
      {loading && <p style={{color:'white'}}>Cargando sistema...</p>}
      
      <div style={s.grid}>
        {orders.map((order) => (
          <div key={order._id} style={{
              ...s.card, 
              opacity: order.isCancelled ? 0.5 : 1, 
              border: order.isCancelled ? '1px solid #d63031' : s.card.border
          }}>
            <div style={s.cardHeader}>
                <span style={s.idText}>#{order._id.slice(-6)}</span>
                <span style={s.dateText}>{order.createdAt.substring(0, 10)}</span>
            </div>

            <div style={s.row}>
                <span>👤 Cliente:</span>
                <span>{order.user ? order.user.name.split(' ')[0] : 'Anónimo'}</span>
            </div>
            
            <div style={{...s.row, alignItems: 'center', marginTop: '10px'}}>
                <span>Total:</span>
                <span style={s.price}>${order.totalPrice.toLocaleString('es-CL')}</span>
            </div>

            <div style={{display:'flex', gap:'5px', marginTop:'10px', flexWrap: 'wrap'}}>
                {order.isCancelled ? (
                    <span style={s.badge('#d63031')}>🚫 RECHAZADO</span>
                ) : (
                    <>
                        {order.isPaid ? <span style={s.badge('#00b894')}>✅ PAGADO</span> : <span style={s.badge('#e17055')}>⏳ PENDIENTE</span>}
                        {order.isDelivered ? <span style={s.badge('#0984e3')}>🚚 ENVIADO</span> : order.isPaid && <span style={s.badge('#fdcb6e')}>📦 POR ENVIAR</span>}
                    </>
                )}
            </div>

            <div style={s.actionContainer}>
                <button style={s.btnOutline} onClick={() => verProductos(order.orderItems)}>👁️ Ver Items</button>
                
                {!order.isCancelled && (
                    <>
                        {!order.isPaid && (
                            <button style={s.btn('#00b894')} onClick={() => handleAction(order._id, 'pay')}>💰 Aprobar</button>
                        )}

                        {order.isPaid && !order.isDelivered && (
                            <button style={s.btn('#0984e3')} onClick={() => handleAction(order._id, 'deliver')}>🚚 Enviar</button>
                        )}

                        {!order.isDelivered && (
                            <button style={s.btn('#d63031')} onClick={() => handleAction(order._id, 'cancel')}>✖️ Rechazar</button>
                        )}
                    </>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderListPage;