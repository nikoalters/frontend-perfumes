import { useEffect, useState } from 'react';
import Swal from 'sweetalert2'; 

// Componentes
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AboutSection from '../components/AboutSection'; 
import CommentsSection from '../components/CommentsSection';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  // --- ESTADOS ---
  const [perfumes, setPerfumes] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [user, setUser] = useState(null); 
  const [wishlist, setWishlist] = useState([]); 
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false);

  // Estados del Formulario de Pedido
  const [clienteNombre, setClienteNombre] = useState("");
  const [clienteDireccion, setClienteDireccion] = useState("");
  const [clienteComuna, setClienteComuna] = useState("");       
  
  // EFECTO: Cargar usuario
  useEffect(() => {
    if (user) {
        setClienteNombre(user.name || "");
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
            background: '#1e1e2e', color: '#fff', // Alerta oscura
            showCancelButton: true,
            confirmButtonColor: '#009970',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ir a Login'
        }).then((result) => { if (result.isConfirmed) window.location.href = '/login'; });
        return;
    }

    const existe = wishlist.some(item => item._id === prod._id);
    let nuevaWishlist;
    
    if (existe) {
      nuevaWishlist = wishlist.filter(item => item._id !== prod._id);
      Swal.fire({ title: 'Eliminado', icon: 'info', toast: true, position: 'top-end', timer: 1000, showConfirmButton: false, background: '#333', color: '#fff' });
    } else {
      nuevaWishlist = [...wishlist, prod];
      Swal.fire({ title: '¡Favorito! ❤️', icon: 'success', toast: true, position: 'top-end', timer: 1000, showConfirmButton: false, background: '#333', color: '#fff' });
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
    Swal.fire({ title: '¡Agregado!', text: p.nombre, icon: 'success', timer: 1000, showConfirmButton: false, toast: true, position: 'top-end', background: '#333', color: '#fff' });
  };

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    setWishlist([]); 
    setMostrarFavoritos(false);
    Swal.fire({title: 'Sesión cerrada', icon: 'success', timer: 1500, showConfirmButton: false, background: '#333', color: '#fff'});
  };

  const calcularTotal = () => carrito.reduce((s, i) => s + i.precio, 0);

  const finalizarCompraWhatsApp = async () => {
    if (!clienteNombre.trim() || !clienteDireccion.trim() || !clienteComuna.trim()) {
        Swal.fire({title: 'Faltan datos', text: 'Completa nombre, dirección y comuna.', icon: 'warning', background: '#333', color: '#fff'});
        return;
    }

    if (!user) {
        Swal.fire({title: 'Inicia Sesión', text: 'Debes iniciar sesión para guardar tu pedido.', icon: 'info', background: '#333', color: '#fff'});
        return;
    }

    try {
        await fetch('https://api-perfumes-chile.onrender.com/api/users/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
            body: JSON.stringify({ name: clienteNombre, direccion: clienteDireccion, comuna: clienteComuna })
        });

        const orderItems = carrito.map(item => ({ product: item._id, nombre: item.nombre, image: item.imagen, precio: item.precio, qty: 1 }));
        const precioTotal = calcularTotal();

        const orderRes = await fetch('https://api-perfumes-chile.onrender.com/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
            body: JSON.stringify({
                orderItems,
                shippingAddress: { direccion: clienteDireccion, comuna: clienteComuna },
                itemsPrice: precioTotal, shippingPrice: 0, totalPrice: precioTotal
            })
        });

        const orderData = await orderRes.json();
        if (!orderRes.ok) throw new Error(orderData.message || 'Error al crear pedido');
        
        let texto = "⚡ *NUEVO PEDIDO WEB* ⚡\n\n";
        texto += `🆔 *Pedido:* #${orderData._id.slice(-6)}\n`;
        texto += `👤 *Cliente:* ${clienteNombre}\n`;
        texto += `📍 *Dirección:* ${clienteDireccion}, ${clienteComuna}\n\n`;
        texto += "🛒 *RESUMEN:*\n";
        carrito.forEach(p => { texto += `- ${p.nombre} ($${p.precio.toLocaleString('es-CL')})\n`; });
        texto += `\n💰 *TOTAL: $${precioTotal.toLocaleString('es-CL')}*`;

        setCarrito([]); localStorage.removeItem('carrito'); setMostrarModal(false);
        window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(texto)}`, '_blank');

    } catch (error) {
        console.error("Error:", error);
        Swal.fire({title: 'Error', text: 'Hubo un problema. Intenta de nuevo.', icon: 'error', background: '#333', color: '#fff'});
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

      <div className="fade-in-up" style={{marginTop: '0px'}}>
        
        {/* --- HERO BANNER RENOVADO --- */}
        <header className="hero-banner mb-5 position-relative">
          <div className="text-center z-2 position-relative px-3">
             <span className="badge bg-transparent border border-light rounded-pill mb-3 px-3 py-2 text-uppercase letter-spacing-2">✨ Nueva Colección 2026</span>
             <h1 className="display-4 fw-bolder mb-3 text-white" style={{ textShadow: '0 0 30px rgba(0,0,0,0.5)' }}>
               LUJO EN CADA GOTA
             </h1>
             <p className="lead text-light opacity-75 mb-4 mx-auto" style={{maxWidth: '600px'}}>
               Encuentra tu firma olfativa con hasta 50% OFF en marcas seleccionadas.
             </p>
             <button onClick={() => window.scrollTo(0, 500)} className="btn btn-lg rounded-pill fw-bold px-5 text-white" 
                     style={{background: 'var(--color-principal)', boxShadow: '0 0 20px rgba(0,153,112,0.4)', border: 'none'}}>
               EXPLORAR CATÁLOGO
             </button>
          </div>
        </header>

        <div className="container-fluid px-lg-5">
          <div className="row">
            
            {/* --- SIDEBAR OSCURO --- */}
            <aside className="col-lg-3 mb-4">
              <div className="sidebar-filtros p-4 sticky-top" style={{top: '100px', zIndex: 1}}>
                <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                    <span style={{color: 'var(--color-principal)'}}>⚡</span> Filtros
                </h5>
                
                {/* Botón Favoritos */}
                <button 
                    className={`btn w-100 mb-4 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 ${mostrarFavoritos ? 'btn-danger text-white' : 'btn-outline-light'}`}
                    onClick={() => {
                        if (!user) { Swal.fire({title: 'Acceso denegado', text: 'Debes iniciar sesión.', icon: 'warning', background: '#333', color: '#fff'}); return; }
                        setMostrarFavoritos(!mostrarFavoritos);
                    }}
                    style={!mostrarFavoritos ? {color: '#ccc', borderColor: '#444'} : {}}
                >
                    {mostrarFavoritos ? '❌ Ver Todos' : '❤️ Mis Favoritos'}
                </button>

                {/* Filtros */}
                <div className="mb-4">
                    <label className="fw-bold mb-2 small text-secondary text-uppercase">Género</label>
                    <div className="form-check"><input className="form-check-input" type="checkbox" name="hombre" checked={filtrosGenero.hombre} onChange={handleGeneroChange} id="checkHombre"/><label className="form-check-label" htmlFor="checkHombre">Hombre</label></div>
                    <div className="form-check"><input className="form-check-input" type="checkbox" name="mujer" checked={filtrosGenero.mujer} onChange={handleGeneroChange} id="checkMujer"/><label className="form-check-label" htmlFor="checkMujer">Mujer</label></div>
                    <div className="form-check"><input className="form-check-input" type="checkbox" name="unisex" checked={filtrosGenero.unisex} onChange={handleGeneroChange} id="checkUnisex"/><label className="form-check-label" htmlFor="checkUnisex">Unisex</label></div>
                </div>

                <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2"><label className="fw-bold small text-secondary text-uppercase">Precio Máx</label><span className="text-success fw-bold">${precioMax.toLocaleString()}</span></div>
                    <input type="range" className="form-range" min="0" max="150000" step="5000" value={precioMax} onChange={e => setPrecioMax(Number(e.target.value))} />
                </div>

                <div className="mb-4">
                    <label className="fw-bold mb-2 small text-secondary text-uppercase">Marca</label>
                    <select className="form-select bg-dark text-white border-secondary" value={marcaSeleccionada} onChange={e => setMarcaSeleccionada(e.target.value)}>
                    <option value="todas">Todas las marcas</option>
                    {MARCAS_CONOCIDAS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>

                <button onClick={limpiarFiltros} className="btn btn-outline-secondary w-100 py-2 text-white-50 border-secondary">🗑️ Borrar Filtros</button>
              </div>
            </aside>

            {/* --- LISTA DE PRODUCTOS --- */}
            <main className="col-lg-9">
              <div className="d-flex justify-content-between align-items-center mb-4 px-2">
                  <h5 className="text-white m-0">Resultados: <strong className="text-success">{perfumesFiltrados.length}</strong> perfumes</h5>
              </div>
              
              <div className="row g-4">
                {productosVisibles.map(prod => (
                  <ProductCard key={prod._id} prod={prod} wishlist={wishlist} toggleWishlist={toggleWishlist} agregarAlCarrito={agregarAlCarrito} />
                ))}
              </div>

              {productosVisibles.length < perfumesFiltrados.length && (
                <div className="text-center mt-5 mb-5">
                    <button className="btn rounded-pill px-5 py-3 fw-bold text-white shadow" 
                            style={{background: 'var(--bg-dark-light)', border: '1px solid var(--color-principal)'}}
                            onClick={() => setLimiteProductos(prev => prev + 20)}>
                        Ver más productos 👇
                    </button>
                </div>
              )}
              
              {productosVisibles.length === 0 && (
                <div className="text-center py-5">
                    <h3 className="text-white-50">😕 No encontramos resultados</h3>
                    <button onClick={limpiarFiltros} className="btn btn-link text-success">Limpiar búsqueda</button>
                </div>
              )}
            </main>
          </div>
        </div>
        
        <AboutSection />
        <CommentsSection />
        <Footer filtrarPorGeneroRapido={filtrarPorGeneroRapido} />
      </div>

      {/* --- MODAL CARRITO (MODO OSCURO) --- */}
      {mostrarModal && (
        <div className="modal d-block fade-in" style={{background: 'rgba(0,0,0,0.8)', zIndex: 1050}}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4" style={{background: '#1e1e2e', color: 'white'}}>
              <div className="modal-header border-bottom border-secondary" style={{background: 'var(--color-principal)'}}>
                <h5 className="modal-title fw-bold text-white">🛍️ Tu Carrito</h5>
                <button className="btn-close btn-close-white" onClick={() => setMostrarModal(false)}></button>
              </div>
              
              <div className="modal-body p-4">
                <div className="row">
                    {/* LISTA PRODUCTOS */}
                    <div className="col-md-6 mb-4 mb-md-0 border-end border-secondary">
                        <h6 className="fw-bold text-secondary mb-3 text-uppercase small">Resumen</h6>
                        <div style={{maxHeight: '300px', overflowY: 'auto', paddingRight: '10px'}} className="custom-scroll">
                            {carrito.map((item, idx) => (
                            <div key={idx} className="d-flex justify-content-between align-items-center mb-3 p-2 rounded" style={{background: 'rgba(255,255,255,0.05)'}}>
                                <div className="d-flex align-items-center gap-2">
                                    <img src={item.imagen} alt="miniatura" style={{width: '45px', height: '45px', objectFit: 'contain', background: 'white', borderRadius: '8px', padding: '2px'}}/>
                                    <div>
                                        <span className="d-block fw-bold small text-truncate text-white" style={{maxWidth: '140px'}}>{item.nombre}</span>
                                        <span className="text-success small fw-bold">${item.precio.toLocaleString()}</span>
                                    </div>
                                </div>
                                <button className="btn btn-sm text-danger" onClick={() => {const n = [...carrito]; n.splice(idx, 1); setCarrito(n);}}>🗑️</button>
                            </div>
                            ))}
                            {carrito.length === 0 && <div className="text-center py-5 text-white-50">🛒 Carrito vacío</div>}
                        </div>
                        {carrito.length > 0 && (
                            <div className="mt-3 pt-3 border-top border-secondary d-flex justify-content-between align-items-center">
                                <span className="lead text-white-50">Total:</span>
                                <span className="fw-bold fs-4 text-success">${calcularTotal().toLocaleString()}</span>
                            </div>
                        )}
                    </div>

                    {/* FORMULARIO ENVÍO */}
                    <div className="col-md-6">
                        <h6 className="fw-bold text-secondary mb-3 text-uppercase small">Datos de Envío</h6>
                        {carrito.length > 0 ? (
                            <div className="p-3 rounded" style={{background: 'rgba(255,255,255,0.03)'}}>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-secondary">Nombre</label>
                                    <input type="text" className="form-control bg-dark text-white border-secondary" placeholder="Ej: Juan Pérez" value={clienteNombre} onChange={e => setClienteNombre(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-secondary">Dirección</label>
                                    <input type="text" className="form-control bg-dark text-white border-secondary" placeholder="Calle y Número" value={clienteDireccion} onChange={e => setClienteDireccion(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-secondary">Comuna</label>
                                    <input type="text" className="form-control bg-dark text-white border-secondary" placeholder="Ej: Maipú" value={clienteComuna} onChange={e => setClienteComuna(e.target.value)} />
                                </div>
                                
                                <button className="btn w-100 py-3 fw-bold shadow mt-2 text-white" 
                                        style={{background: '#25D366', border: 'none'}} 
                                        onClick={finalizarCompraWhatsApp}>
                                    📲 Pedir por WhatsApp
                                </button>
                            </div>
                        ) : (
                            <p className="text-center text-white-50 mt-5">Agrega productos para continuar.</p>
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