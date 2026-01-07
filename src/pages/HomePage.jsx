import { useEffect, useState } from 'react';
import Swal from 'sweetalert2'; 

// Componentes
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  // --- ESTADOS ---
  const [perfumes, setPerfumes] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [user, setUser] = useState(null); 
  const [wishlist, setWishlist] = useState([]); 
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false);

  // Estados del Formulario de Pedido (NUEVOS)
  const [clienteNombre, setClienteNombre] = useState("");
  const [clienteDireccion, setClienteDireccion] = useState("");
  const [clienteComuna, setClienteComuna] = useState("");       
  
  // EFECTO: Si el usuario inicia sesión, cargamos sus datos guardados automáticamente
  useEffect(() => {
    if (user) {
        setClienteNombre(user.name || "");
        // Si la base de datos ya tiene dirección, la ponemos en el formulario
        if (user.direccion) setClienteDireccion(user.direccion);
        if (user.comuna) setClienteComuna(user.comuna);
    }
  }, [user]);

  // Filtros
  const [busqueda, setBusqueda] = useState("");
  const [precioMax, setPrecioMax] = useState(150000);
  const [marcaSeleccionada, setMarcaSeleccionada] = useState("todas");
  const [mlSeleccionado, setMlSeleccionado] = useState("todos");
  const [filtrosGenero, setFiltrosGenero] = useState({ hombre: false, mujer: false, unisex: false });
  const [limiteProductos, setLimiteProductos] = useState(20);
  const [mostrarModal, setMostrarModal] = useState(false);

  const NUMERO_WHATSAPP = "56958547236"; 
  const MARCAS_CONOCIDAS = ["ADOLFO DOMINGUEZ", "AFNAN", "AL HARAMAIN", "ANTONIO BANDERAS", "ARIANA GRANDE", "ARMAF", "ARMANI", "AZZARO", "BENETTON", "BHARARA", "BURBERRY", "CACHAREL", "CALVIN KLEIN", "CAROLINA HERRERA", "CLINIQUE", "COACH", "DIESEL", "DOLCE & GABBANA", "DONNA KARAN", "GIVENCHY", "GUCCI", "GUESS", "HALLOWEEN", "HERMES", "HUGO BOSS", "ISSEY MIYAKE", "JEAN PAUL GAULTIER", "JIMMY CHOO", "KENZO", "LACOSTE", "LANCOME", "LATTAFA", "MAISON ALHAMBRA", "MONCLER", "MONTBLANC", "MOSCHINO", "MUGLER", "PACO RABANNE", "RALPH LAUREN", "RASSASI", "SALVATORE FERRAGAMO", "TOMMY HILFIGER", "TOUS", "VERSACE", "VICTOR&ROLF", "VICTORINOX", "YVES SAINT LAURENT"];

  // --- CARGAR DATOS ---
  useEffect(() => {
    const carritoGuardado = localStorage.getItem('carrito_compras');
    if (carritoGuardado) setCarrito(JSON.parse(carritoGuardado));

    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const usuarioParseado = JSON.parse(userInfo);
      setUser(usuarioParseado);
      
      fetch('https://api-perfumes-chile.onrender.com/api/users/wishlist', {
        headers: { 'Authorization': `Bearer ${usuarioParseado.token}` }
      })
      .then(res => res.json())
      .then(data => { if(Array.isArray(data)) setWishlist(data); })
      .catch(err => console.error("Error cargando wishlist:", err));
    }

    fetch('https://api-perfumes-chile.onrender.com/api/perfumes')
      .then(res => res.json())
      .then(data => setPerfumes(data))
      .catch(err => console.error("Error:", err));
  }, []);

  useEffect(() => { localStorage.setItem('carrito_compras', JSON.stringify(carrito)); }, [carrito]);

  // --- HELPERS ---
  const extraerML = (texto) => {
    const match = (texto || "").match(/(\d+)\s*ml/i);
    return match ? parseInt(match[1]) : 0;
  };

  const handleGeneroChange = (e) => {
    setFiltrosGenero({ ...filtrosGenero, [e.target.name]: e.target.checked });
  };

  const filtrarPorGeneroRapido = (genero) => {
      limpiarFiltros();
      if (genero !== 'todos') {
          setFiltrosGenero({ ...{ hombre: false, mujer: false, unisex: false }, [genero]: true });
      }
      window.scrollTo(0, 400);
  };

  const limpiarFiltros = () => {
    setBusqueda(""); setPrecioMax(150000); setMarcaSeleccionada("todas"); setMlSeleccionado("todos");
    setFiltrosGenero({ hombre: false, mujer: false, unisex: false });
    setMostrarFavoritos(false);
  };

  const toggleWishlist = async (prod) => {
    if (!user) {
        Swal.fire({
            title: '🔒 Requiere acceso',
            text: 'Debes iniciar sesión para guardar tus favoritos.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#009970',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ir a Iniciar Sesión',
            cancelButtonText: 'Cancelar'
        }).then((result) => { if (result.isConfirmed) window.location.href = '/login'; });
        return;
    }

    const existe = wishlist.some(item => item._id === prod._id);
    let nuevaWishlist;
    
    if (existe) {
      nuevaWishlist = wishlist.filter(item => item._id !== prod._id);
      Swal.fire({ title: 'Eliminado de favoritos', icon: 'info', toast: true, position: 'top-end', timer: 1000, showConfirmButton: false });
    } else {
      nuevaWishlist = [...wishlist, prod];
      Swal.fire({ title: '¡Añadido a favoritos! ❤️', icon: 'success', toast: true, position: 'top-end', timer: 1000, showConfirmButton: false });
    }
    setWishlist(nuevaWishlist);

    try {
      await fetch('https://api-perfumes-chile.onrender.com/api/users/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify({ productId: prod._id })
      });
    } catch (error) {
      setWishlist(wishlist); 
      console.error(error);
    }
  };

  // --- CARRITO & CHECKOUT WHATSAPP ---
  const agregarAlCarrito = (p) => {
    setCarrito([...carrito, p]);
    Swal.fire({ title: '¡Agregado!', text: p.nombre, icon: 'success', timer: 1000, showConfirmButton: false, toast: true, position: 'top-end' });
  };

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    setWishlist([]); 
    setMostrarFavoritos(false);
    Swal.fire('¡Adiós!', 'Sesión cerrada', 'success');
  };

  const calcularTotal = () => carrito.reduce((s, i) => s + i.precio, 0);

  const finalizarCompraWhatsApp = async () => {
    // 1. VALIDACIÓN
    if (!clienteNombre.trim() || !clienteDireccion.trim() || !clienteComuna.trim()) {
        Swal.fire('Faltan datos', 'Por favor completa tu nombre, dirección y comuna.', 'warning');
        return;
    }

    if (!user) {
        Swal.fire('Inicia Sesión', 'Debes iniciar sesión para guardar tu pedido.', 'info');
        return;
    }

    try {
        // 2. ACTUALIZAR DIRECCIÓN DEL USUARIO (Si cambió)
        await fetch('https://api-perfumes-chile.onrender.com/api/users/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({
                name: clienteNombre,
                direccion: clienteDireccion,
                comuna: clienteComuna
            })
        });

        // 3. PREPARAR LOS DATOS DEL PEDIDO (Formato que pide el Backend)
        const orderItems = carrito.map(item => ({
            product: item._id,       // ID del producto
            nombre: item.nombre,
            image: item.imagen,      // Asegúrate que tu producto tiene campo 'imagen'
            precio: item.precio,
            qty: 1                   // Por defecto 1 (si tu carrito agrupa, cambia esto)
        }));

        const precioTotal = calcularTotal();

        // 4. CREAR EL PEDIDO EN LA BASE DE DATOS 💾
        const orderRes = await fetch('https://api-perfumes-chile.onrender.com/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({
                orderItems: orderItems,
                shippingAddress: {
                    direccion: clienteDireccion,
                    comuna: clienteComuna
                },
                itemsPrice: precioTotal,
                shippingPrice: 0, // Si cobras envío, ponlo aquí
                totalPrice: precioTotal
            })
        });

        const orderData = await orderRes.json(); // Aquí recibimos el ID del pedido nuevo

        if (!orderRes.ok) {
            throw new Error(orderData.message || 'Error al crear pedido');
        }
        
        // 5. ARMAR MENSAJE (Versión corregida para UTF-8)
        // Nota: Asegúrate de ver estos emojis en tu editor.
        let texto = "⚡ *NUEVO PEDIDO WEB* ⚡\n\n";
        texto += `🆔 *Pedido:* #${orderData._id.slice(-6)}\n`;
        texto += `👤 *Cliente:* ${clienteNombre}\n`;
        texto += `📍 *Dirección:* ${clienteDireccion}, ${clienteComuna}\n\n`;
        
        texto += "🛒 *RESUMEN DE COMPRA:*\n";
        texto += "-----------------------------------\n";
        
        carrito.forEach(p => {
            // Usamos un guión simple para evitar caracteres raros
            texto += `- ${p.nombre} ($${p.precio.toLocaleString('es-CL')})\n`;
        });
        
        texto += "-----------------------------------\n";
        texto += `💰 *TOTAL: $${precioTotal.toLocaleString('es-CL')}*\n\n`;
        texto += "👋 Hola, acabo de hacer este pedido. Quedo atento/a.";

        // 6. LIMPIAR Y ENVIAR
        setCarrito([]);
        localStorage.removeItem('carrito');
        setMostrarModal(false);

        // encodeURIComponent se encarga de que los emojis viajen bien
        window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(texto)}`, '_blank');

    } catch (error) {
        console.error("Error procesando compra:", error);
        Swal.fire('Error', 'Hubo un problema al guardar el pedido. Intenta de nuevo.', 'error');
    }
  };

  // --- FILTRADO ---
  const perfumesFiltrados = perfumes.filter(prod => {
    if (mostrarFavoritos && !wishlist.some(item => item._id === prod._id)) return false;
    const nombre = (prod.nombre || "").toLowerCase();
    const categoria = (prod.categoria || "").toLowerCase();
    if (!nombre.includes(busqueda.toLowerCase())) return false;
    if (prod.precio > precioMax) return false;
    if (marcaSeleccionada !== 'todas' && !nombre.toUpperCase().includes(marcaSeleccionada.toUpperCase())) return false;
    const generosSeleccionados = Object.keys(filtrosGenero).filter(key => filtrosGenero[key]);
    if (generosSeleccionados.length > 0 && !generosSeleccionados.includes(categoria)) return false;
    if (mlSeleccionado !== 'todos') {
        const ml = extraerML(prod.nombre);
        if (mlSeleccionado === "30" && ml > 35) return false;
        if (mlSeleccionado === "50" && (ml < 35 || ml > 75)) return false;
        if (mlSeleccionado === "80" && (ml < 76 || ml > 95)) return false;
        if (mlSeleccionado === "100" && (ml < 96 || ml > 125)) return false;
        if (mlSeleccionado === "200" && ml < 126) return false;
    }
    return true;
  });

  const productosVisibles = perfumesFiltrados.slice(0, limiteProductos);

  return (
    <>
      <Navbar 
        busqueda={busqueda} setBusqueda={setBusqueda} carritoCount={carrito.length} user={user} logoutHandler={logoutHandler} setMostrarModal={setMostrarModal} filtrarPorGeneroRapido={filtrarPorGeneroRapido}
      />

      <div className="fade-in" style={{marginTop: '80px'}}>
        
        {/* HERO BANNER */}
        <header className="hero-banner mb-5" style={{background: 'linear-gradient(135deg, #009970 0%, #006349 100%)', color: 'white', borderRadius: '0 0 20px 20px', padding: '4rem 1rem'}}>
          <div className="container text-center">
            <h1>✨ Oferta Especial</h1>
            <p className="lead">Descubre las fragancias más exclusivas con hasta un 50% de descuento</p>
            <button onClick={limpiarFiltros} className="btn btn-warning fw-bold px-4 py-2 mt-3 rounded-pill shadow-sm">Ver Catálogo Completo</button>
          </div>
        </header>

        <div className="container">
          <div className="row">
            
            {/* SIDEBAR FILTROS */}
            <aside className="col-lg-3 mb-4">
              <div className="sidebar-filtros bg-white p-3 rounded shadow-sm sticky-top" style={{top: '100px', zIndex: 1}}>
                <h5 className="fw-bold mb-3 text-secondary">⚡ Filtros</h5>
                <button 
                    className={`btn w-100 mb-4 fw-bold shadow-sm ${mostrarFavoritos ? 'btn-danger text-white' : 'btn-outline-danger'}`}
                    onClick={() => {
                        if (!user) { Swal.fire('🔒 Acceso denegado', 'Debes iniciar sesión para ver tus favoritos', 'warning'); return; }
                        setMostrarFavoritos(!mostrarFavoritos);
                    }}
                >
                    {mostrarFavoritos ? '❌ Ver Todos' : '❤️ Ver Mis Favoritos'}
                </button>

                {/* Filtros de Género, Precio, Marca, Tamaño... (Igual que antes) */}
                <div className="mb-4">
                    <label className="fw-bold mb-2 small text-muted">Género</label>
                    <div className="form-check"><input className="form-check-input" type="checkbox" name="hombre" checked={filtrosGenero.hombre} onChange={handleGeneroChange} id="checkHombre"/><label className="form-check-label" htmlFor="checkHombre">Hombre</label></div>
                    <div className="form-check"><input className="form-check-input" type="checkbox" name="mujer" checked={filtrosGenero.mujer} onChange={handleGeneroChange} id="checkMujer"/><label className="form-check-label" htmlFor="checkMujer">Mujer</label></div>
                    <div className="form-check"><input className="form-check-input" type="checkbox" name="unisex" checked={filtrosGenero.unisex} onChange={handleGeneroChange} id="checkUnisex"/><label className="form-check-label" htmlFor="checkUnisex">Unisex</label></div>
                </div>
                <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2"><label className="fw-bold small text-muted">Precio Máximo</label><span className="text-success fw-bold">${precioMax.toLocaleString()}</span></div>
                    <input type="range" className="form-range" min="0" max="150000" step="5000" value={precioMax} onChange={e => setPrecioMax(Number(e.target.value))} />
                </div>
                <div className="mb-4">
                    <label className="fw-bold mb-2 small text-muted">Marca</label>
                    <select className="form-select" value={marcaSeleccionada} onChange={e => setMarcaSeleccionada(e.target.value)}>
                    <option value="todas">Todas las marcas</option>
                    {MARCAS_CONOCIDAS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="fw-bold mb-2 small text-muted">Tamaño (ML)</label>
                    <select className="form-select" value={mlSeleccionado} onChange={e => setMlSeleccionado(e.target.value)}>
                        <option value="todos">Todos los tamaños</option>
                        <option value="30">30ml - 35ml</option>
                        <option value="50">50ml - 75ml</option>
                        <option value="80">80ml - 95ml</option>
                        <option value="100">100ml - 125ml</option>
                        <option value="200">200ml o más</option>
                    </select>
                </div>
                <button onClick={limpiarFiltros} className="btn btn-outline-danger w-100 py-2">🗑️ Borrar Filtros</button>
              </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="col-lg-9">
              <h5 className="text-secondary mb-3">Resultados: <strong>{perfumesFiltrados.length}</strong> perfumes</h5>
              <div className="row">
                {productosVisibles.map(prod => (
                  <ProductCard key={prod._id} prod={prod} wishlist={wishlist} toggleWishlist={toggleWishlist} agregarAlCarrito={agregarAlCarrito} />
                ))}
              </div>

              {productosVisibles.length < perfumesFiltrados.length && (
                <div className="text-center mt-4 mb-5">
                    <button className="btn-login px-5 py-2 shadow-sm" onClick={() => setLimiteProductos(prev => prev + 20)}>Ver más productos 👇</button>
                    <p className="text-muted small mt-2">Mostrando {productosVisibles.length} de {perfumesFiltrados.length}</p>
                </div>
              )}
              {productosVisibles.length === 0 && (
                <div className="text-center py-5">
                    <h3>😕 No encontramos resultados</h3>
                    <button onClick={limpiarFiltros} className="btn btn-link">Limpiar búsqueda</button>
                </div>
              )}
            </main>
          </div>
        </div>
        
        {/* SECCION QUIENES SOMOS (Igual que antes) */}
        <section className="bg-light py-5 mt-5">
            <div className="container">
                <h2 className="text-success fw-bold mb-3">¿Quiénes Somos?</h2>
                <p className="lead text-muted mb-5">Somos una empresa dedicada a la venta de perfumes 100% originales, entregando confianza y calidad en todo Chile.</p>
                <div className="card p-4 shadow-sm border-0" style={{maxWidth: '500px'}}>
                    <div className="d-flex align-items-center gap-2 mb-3"><span style={{fontSize: '1.5rem'}}>📱</span><h4 className="mb-0">¡Hablemos!</h4></div>
                    <p className="fw-bold mb-3">WhatsApp: <span className="text-success">+56 9 5854 7236</span></p>
                    <div className="d-flex gap-2">
                        <a href="https://www.instagram.com/perfumeschile" target="_blank" rel="noopener noreferrer" className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 text-decoration-none">📷 @perfumeschile</a>
                        <a href="https://www.facebook.com/perfumeschile" target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1 text-decoration-none">👍 Facebook</a>
                    </div>
                </div>
            </div>
        </section>

        <Footer filtrarPorGeneroRapido={filtrarPorGeneroRapido} />
      </div>

      {/* --- MODAL CARRITO ACTUALIZADO CON FORMULARIO --- */}
      {mostrarModal && (
        <div className="modal d-block fade-in" style={{background: 'rgba(0,0,0,0.6)', zIndex: 1050}}>
          <div className="modal-dialog modal-dialog-centered modal-lg"> {/* modal-lg para más espacio */}
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header bg-success text-white border-bottom-0">
                <h5 className="modal-title fw-bold">🛍️ Tu Carrito de Compras</h5>
                <button className="btn-close btn-close-white" onClick={() => setMostrarModal(false)}></button>
              </div>
              
              <div className="modal-body p-4">
                <div className="row">
                    {/* COLUMNA IZQUIERDA: LISTA DE PRODUCTOS */}
                    <div className="col-md-6 mb-4 mb-md-0 border-end">
                        <h6 className="fw-bold text-muted mb-3">Resumen del Pedido</h6>
                        <div style={{maxHeight: '300px', overflowY: 'auto', paddingRight: '10px'}}>
                            {carrito.map((item, idx) => (
                            <div key={idx} className="d-flex justify-content-between align-items-center mb-3 bg-light p-2 rounded">
                                <div className="d-flex align-items-center gap-2">
                                    <img src={item.imagen} alt="miniatura" style={{width: '40px', height: '40px', objectFit: 'contain'}} className="bg-white rounded p-1"/>
                                    <div>
                                        <span className="d-block fw-bold small text-truncate" style={{maxWidth: '150px'}}>{item.nombre}</span>
                                        <span className="text-success small fw-bold">${item.precio.toLocaleString()}</span>
                                    </div>
                                </div>
                                <button className="btn btn-sm text-danger" onClick={() => {const n = [...carrito]; n.splice(idx, 1); setCarrito(n);}} title="Eliminar">🗑️</button>
                            </div>
                            ))}
                            {carrito.length === 0 && <div className="text-center py-5 text-muted">🛒 Tu carrito está vacío</div>}
                        </div>
                        {carrito.length > 0 && (
                            <div className="mt-3 pt-3 border-top">
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="lead">Total a pagar:</span>
                                    <span className="fw-bold fs-4 text-success">${calcularTotal().toLocaleString()}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* COLUMNA DERECHA: FORMULARIO DE DATOS */}
                    <div className="col-md-6">
                        <h6 className="fw-bold text-muted mb-3">📦 Datos de Envío</h6>
                        {carrito.length > 0 ? (
                            <div className="bg-light p-3 rounded">
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-secondary">Nombre Completo</label>
                                    <input type="text" className="form-control" placeholder="Ej: Juan Pérez" value={clienteNombre} onChange={e => setClienteNombre(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-secondary">Dirección (Calle y Número)</label>
                                    <input type="text" className="form-control" placeholder="Ej: Av. Pajaritos 3030" value={clienteDireccion} onChange={e => setClienteDireccion(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-secondary">Comuna / Ciudad</label>
                                    <input type="text" className="form-control" placeholder="Ej: Maipú" value={clienteComuna} onChange={e => setClienteComuna(e.target.value)} />
                                </div>
                                
                                <button className="btn btn-success w-100 py-3 fw-bold shadow-sm mt-2" onClick={finalizarCompraWhatsApp}>
                                    📲 Confirmar Pedido por WhatsApp
                                </button>
                                <small className="d-block text-center text-muted mt-2" style={{fontSize: '0.75rem'}}>
                                    *Al confirmar, te redirigiremos a WhatsApp para coordinar el pago y envío.
                                </small>
                            </div>
                        ) : (
                            <p className="text-center text-muted mt-5">Agrega productos para continuar.</p>
                        )}
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;