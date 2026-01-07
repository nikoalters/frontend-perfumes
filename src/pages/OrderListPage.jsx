import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('userInfo'));

  // --- LOGICA DE CARGA Y ACTUALIZACIÓN ---
  const fetchOrders = async () => {
    try {
      const res = await fetch('https://api-perfumes-chile.onrender.com/api/orders', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (!res.ok) throw new Error('Error cargando pedidos');
      const data = await res.json();
      // Ordenamos para ver los más recientes primero
      setOrders(data.reverse());
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

  // --- ACCIONES (Pagar, Enviar, Rechazar) ---
  const handleAction = async (id, action) => {
    let url = '';
    let confirmMsg = '';

    if (action === 'pay') {
        url = `/pay`; 
        confirmMsg = '¿Confirmar PAGO recibido? 💰';
    } else if (action === 'deliver') {
        url = `/deliver`;
        confirmMsg = '¿Confirmar ENVÍO realizado? 🚚';
    } else if (action === 'cancel') {
        url = `/cancel`;
        confirmMsg = '¿Estás seguro de RECHAZAR este pedido por falta de stock? 🚫';
    }

    if (window.confirm(confirmMsg)) {
      try {
        const res = await fetch(`https://api-perfumes-chile.onrender.com/api/orders/${id}${url}`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${user.token}` }
        });
        if (res.ok) fetchOrders();
      } catch (error) { console.error(error); }
    }
  };

  const verProductos = (items) => {
    const lista = items.map(item => `▪ ${item.qty}x ${item.nombre}`).join('\n');
    alert(`🛒 PRODUCTOS:\n\n${lista}`);
  };

  // --- ESTILOS "DASHBOARD CYBERPUNK" 🎨 ---
  const s = {
    container: { padding: '40px', backgroundColor: '#0f0f1a', minHeight: '100vh', fontFamily: 'Arial, sans-serif' },
    header: { color: 'white', marginBottom: '30px', fontSize: '2rem', fontWeight: 'bold', borderLeft: '5px solid #6c5ce7', paddingLeft: '15px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
    
    // TARJETA BASE
    card: { backgroundColor: '#1e1e2f', borderRadius: '15px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', position: 'relative', border: '1px solid #2d2d44', transition: 'transform 0.2s' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid #333', paddingBottom: '10px' },
    idText: { color: '#a29bfe', fontWeight: 'bold', fontSize: '0.9rem' },
    dateText: { color: '#b2bec3', fontSize: '0.8rem' },
    
    // DETALLES
    row: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#dfe6e9', fontSize: '0.95rem' },
    price: { color: '#00cec9', fontWeight: 'bold', fontSize: '1.2rem' },
    
    // BADGES (Etiquetas de estado)
    badge: (color) => ({ backgroundColor: color, color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase' }),

    // BOTONERA
    actionContainer: { marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' },
    btn: (bg) => ({ flex: 1, backgroundColor: bg, border: 'none', color: 'white', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }),
    btnOutline: { flex: 1, background: 'transparent', border: '1px solid #6c5ce7', color: '#6c5ce7', padding: '8px', borderRadius: '8px', cursor: 'pointer' }
  };

  return (
    <div style={s.container}>
      <h1 style={s.header}>Panel de Gestión de Pedidos</h1>
      
      {loading && <p style={{color:'white'}}>Cargando sistema...</p>}
      
      <div style={s.grid}>
        {orders.map((order) => (
          <div key={order._id} style={{
              ...s.card, 
              opacity: order.isCancelled ? 0.5 : 1, // Opacar si está cancelado
              border: order.isCancelled ? '1px solid red' : s.card.border
          }}>
            
            {/* CABECERA TARJETA */}
            <div style={s.cardHeader}>
                <span style={s.idText}>#{order._id.slice(-6)}</span>
                <span style={s.dateText}>{order.createdAt.substring(0, 10)}</span>
            </div>

            {/* INFO CLIENTE */}
            <div style={s.row}>
                <span>👤 Cliente:</span>
                <span>{order.user ? order.user.name.split(' ')[0] : 'Anónimo'}</span>
            </div>
            
            {/* PRECIO */}
            <div style={{...s.row, alignItems: 'center', marginTop: '10px'}}>
                <span>Total:</span>
                <span style={s.price}>${order.totalPrice.toLocaleString('es-CL')}</span>
            </div>

            {/* ESTADOS (Píldoras de colores) */}
            <div style={{display:'flex', gap:'5px', marginTop:'10px'}}>
                {order.isCancelled ? (
                    <span style={s.badge('#d63031')}>🚫 RECHAZADO</span>
                ) : (
                    <>
                        {order.isPaid ? <span style={s.badge('#00b894')}>✅ PAGADO</span> : <span style={s.badge('#e17055')}>⏳ PENDIENTE PAGO</span>}
                        {order.isDelivered ? <span style={s.badge('#0984e3')}>🚚 ENVIADO</span> : order.isPaid && <span style={s.badge('#fdcb6e')}>📦 POR ENVIAR</span>}
                    </>
                )}
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div style={s.actionContainer}>
                {/* Botón Ver Items (Siempre visible) */}
                <button style={s.btnOutline} onClick={() => verProductos(order.orderItems)}>👁️ Ver Items</button>
                
                {/* Botones de Gestión (Solo si NO está cancelado) */}
                {!order.isCancelled && (
                    <>
                        {!order.isPaid && (
                            <button style={s.btn('#00b894')} onClick={() => handleAction(order._id, 'pay')}>💰 Aprobar</button>
                        )}

                        {order.isPaid && !order.isDelivered && (
                            <button style={s.btn('#0984e3')} onClick={() => handleAction(order._id, 'deliver')}>🚚 Enviar</button>
                        )}

                        {/* BOTÓN RECHAZAR (Solo si no está pagado aún o si quieres rechazar igual) */}
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