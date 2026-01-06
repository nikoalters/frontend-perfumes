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
  const [wishlist, setWishlist] = useState([]); // Ahora esto vendrá de la BD
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false);

  // Filtros
  const [busqueda, setBusqueda] = useState("");
  const [precioMax, setPrecioMax] = useState(150000);
  const [marcaSeleccionada, setMarcaSeleccionada] = useState("todas");
  const [mlSeleccionado, setMlSeleccionado] = useState("todos");
  const [filtrosGenero, setFiltrosGenero] = useState({ hombre: false, mujer: false, unisex: false });
  const [limiteProductos, setLimiteProductos] = useState(20);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [clienteNombre, setClienteNombre] = useState("");

  const NUMERO_WHATSAPP = "56958547236"; 
  const MARCAS_CONOCIDAS = ["ADOLFO DOMINGUEZ", "AFNAN", "AL HARAMAIN", "ANTONIO BANDERAS", "ARIANA GRANDE", "ARMAF", "ARMANI", "AZZARO", "BENETTON", "BHARARA", "BURBERRY", "CACHAREL", "CALVIN KLEIN", "CAROLINA HERRERA", "CLINIQUE", "COACH", "DIESEL", "DOLCE & GABBANA", "DONNA KARAN", "GIVENCHY", "GUCCI", "GUESS", "HALLOWEEN", "HERMES", "HUGO BOSS", "ISSEY MIYAKE", "JEAN PAUL GAULTIER", "JIMMY CHOO", "KENZO", "LACOSTE", "LANCOME", "LATTAFA", "MAISON ALHAMBRA", "MONCLER", "MONTBLANC", "MOSCHINO", "MUGLER", "PACO RABANNE", "RALPH LAUREN", "RASSASI", "SALVATORE FERRAGAMO", "TOMMY HILFIGER", "TOUS", "VERSACE", "VICTOR&ROLF", "VICTORINOX", "YVES SAINT LAURENT"];

  // --- CARGAR DATOS ---
  useEffect(() => {
    // 1. Cargar Carrito (Sigue siendo local por ahora)
    const carritoGuardado = localStorage.getItem('carrito_compras');
    if (carritoGuardado) setCarrito(JSON.parse(carritoGuardado));

    // 2. Cargar Usuario
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const usuarioParseado = JSON.parse(userInfo);
      setUser(usuarioParseado);
      
      // 🚀 NUEVA LÓGICA BACKEND: Cargar Wishlist desde la Base de Datos
      fetch('https://api-perfumes-chile.onrender.com/api/users/wishlist', {
        headers: {
          'Authorization': `Bearer ${usuarioParseado.token}` // Importante: Enviamos el token
        }
      })
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) setWishlist(data); // Si responde un array, lo guardamos
      })
      .catch(err => console.error("Error cargando wishlist:", err));
    }

    // 3. Cargar Perfumes
    fetch('https://api-perfumes-chile.onrender.com/api/perfumes')
      .then(res => res.json())
      .then(data => setPerfumes(data))
      .catch(err => console.error("Error:", err));
  }, []);

  useEffect(() => { localStorage.setItem('carrito_compras', JSON.stringify(carrito)); }, [carrito]);
  // NOTA: Ya no guardamos 'wishlist' en localStorage, ahora vive en la base de datos.

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

  // --- 🚀 NUEVA LÓGICA WISHLIST (CONECTADA AL BACKEND) ---
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
        }).then((result) => {
            if (result.isConfirmed) window.location.href = '/login';
        });
        return;
    }

    // 1. Optimismo UI (Actualizamos visualmente antes de esperar al servidor para que se sienta rápido)
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

    // 2. Petición al Servidor (En segundo plano)
    try {
      const response = await fetch('https://api-perfumes-chile.onrender.com/api/users/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ productId: prod._id })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar wishlist');
      }
      // Si todo sale bien, no hacemos nada más porque ya actualizamos la UI arriba.
    } catch (error) {
      console.error(error);
      // Si falla, revertimos el cambio visual (Rollback)
      setWishlist(wishlist); 
      Swal.fire('Error', 'No se pudo guardar en el servidor', 'error');
    }
  };

  // --- CARRITO & LOGOUT ---
  const agregarAlCarrito = (p) => {
    setCarrito([...carrito, p]);
    Swal.fire({ title: '¡Agregado!', text: p.nombre, icon: 'success', timer: 1000, showConfirmButton: false, toast: true, position: 'top-end' });
  };

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    // localStorage.removeItem('wishlist_perfumes'); // YA NO ES NECESARIO BORRAR ESTO, PUES NO EXISTE
    setUser(null);
    setWishlist([]); 
    setMostrarFavoritos(false);
    Swal.fire('¡Adiós!', 'Sesión cerrada', 'success');
  };

  const calcularTotal = () => carrito.reduce((s, i) => s + i.precio, 0);

  const finalizarCompraWhatsApp = () => {
    let mensaje = `Hola! Soy *${clienteNombre}* y mi pedido es:%0A%0A`;
    carrito.forEach(p => mensaje += `▪️ ${p.nombre} - $${p.precio.toLocaleString('es-CL')}%0A`);
    mensaje += `%0A💰 *TOTAL: $${calcularTotal().toLocaleString('es-CL')}*`;
    window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${mensaje}`, '_blank');
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

  // --- RENDER ---
  return (
    <>
      {/* NAVBAR */}
      <Navbar 
        busqueda={busqueda} 
        setBusqueda={setBusqueda} 
        carritoCount={carrito.length} 
        user={user} 
        logoutHandler={logoutHandler} 
        setMostrarModal={setMostrarModal} 
        filtrarPorGeneroRapido={filtrarPorGeneroRapido}
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
                  <ProductCard 
                    key={prod._id} 
                    prod={prod} 
                    wishlist={wishlist} 
                    toggleWishlist={toggleWishlist} 
                    agregarAlCarrito={agregarAlCarrito} 
                  />
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
        
        {/* QUIENES SOMOS */}
        <section className="bg-light py-5 mt-5">
            <div className="container">
                <h2 className="text-success fw-bold mb-3">¿Quiénes Somos?</h2>
                <p className="lead text-muted mb-5">Somos una empresa dedicada a la venta de perfumes 100% originales, entregando confianza y calidad en todo Chile.</p>
                <div className="card p-4 shadow-sm border-0" style={{maxWidth: '500px'}}>
                    <div className="d-flex align-items-center gap-2 mb-3"><span style={{fontSize: '1.5rem'}}>📱</span><h4 className="mb-0">¡Hablemos!</h4></div>
                    <p className="fw-bold mb-3">WhatsApp: <span className="text-success">+56 9 5854 7236</span></p>
                    <div className="d-flex gap-2">
                        <a href="https://www.instagram.com/nico_alters?igsh=em9xb2NuN2h6NTc=" target="_blank" rel="noopener noreferrer" className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 text-decoration-none">📷 @perfumeschile</a>
                        <a href="https://www.facebook.com/perfumeschile" target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1 text-decoration-none">👍 Facebook</a>
                    </div>
                </div>
            </div>
        </section>

        {/* FOOTER */}
        <Footer filtrarPorGeneroRapido={filtrarPorGeneroRapido} />
      </div>

      {/* MODAL CARRITO */}
      {mostrarModal && (
        <div className="modal d-block" style={{background: 'rgba(0,0,0,0.5)', zIndex: 1050}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header"><h5 className="modal-title">Tu Carrito 🛍️</h5><button className="btn-close" onClick={() => setMostrarModal(false)}></button></div>
              <div className="modal-body">
                {carrito.map((item, idx) => (
                  <div key={idx} className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
                    <div><span className="d-block fw-bold small text-truncate" style={{maxWidth: '200px'}}>{item.nombre}</span><span className="text-success small">${item.precio.toLocaleString()}</span></div>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => {const n = [...carrito]; n.splice(idx, 1); setCarrito(n);}}>Eliminar</button>
                  </div>
                ))}
                {carrito.length === 0 && <p className="text-center text-muted my-3">El carrito está vacío</p>}
                {carrito.length > 0 && (<><div className="d-flex justify-content-between fw-bold mt-3 fs-5"><span>Total:</span><span>${calcularTotal().toLocaleString()}</span></div><hr /><input type="text" className="form-control mb-3" placeholder="Tu nombre (Opcional)" value={clienteNombre} onChange={e => setClienteNombre(e.target.value)} /><button className="btn btn-success w-100 py-2 fw-bold" onClick={finalizarCompraWhatsApp}>Completar Pedido por WhatsApp 📲</button></>)}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;