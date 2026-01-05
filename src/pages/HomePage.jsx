import { useEffect, useState } from 'react';
import Swal from 'sweetalert2'; 

const HomePage = () => {
  // --- ESTADOS ---
  const [perfumes, setPerfumes] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [user, setUser] = useState(null); 
  
  // Filtros
  const [busqueda, setBusqueda] = useState("");
  const [precioMax, setPrecioMax] = useState(150000);
  const [marcaSeleccionada, setMarcaSeleccionada] = useState("todas");
  const [mlSeleccionado, setMlSeleccionado] = useState("todos");
  
  // Estado para los Checkboxes de Género
  const [filtrosGenero, setFiltrosGenero] = useState({ 
    hombre: false, 
    mujer: false, 
    unisex: false 
  });
  
  // Paginación (Mantenemos 20 para velocidad en móvil)
  const [limiteProductos, setLimiteProductos] = useState(20);
  
  // UI
  const [mostrarModal, setMostrarModal] = useState(false);
  const [clienteNombre, setClienteNombre] = useState("");

  const NUMERO_WHATSAPP = "56958547236"; 
  const MARCAS_CONOCIDAS = ["ADOLFO DOMINGUEZ", "AFNAN", "AL HARAMAIN", "ANTONIO BANDERAS", "ARIANA GRANDE", "ARMAF", "ARMANI", "AZZARO", "BENETTON", "BHARARA", "BURBERRY", "CACHAREL", "CALVIN KLEIN", "CAROLINA HERRERA", "CLINIQUE", "COACH", "DIESEL", "DOLCE & GABBANA", "DONNA KARAN", "GIVENCHY", "GUCCI", "GUESS", "HALLOWEEN", "HERMES", "HUGO BOSS", "ISSEY MIYAKE", "JEAN PAUL GAULTIER", "JIMMY CHOO", "KENZO", "LACOSTE", "LANCOME", "LATTAFA", "MAISON ALHAMBRA", "MONCLER", "MONTBLANC", "MOSCHINO", "MUGLER", "PACO RABANNE", "RALPH LAUREN", "RASSASI", "SALVATORE FERRAGAMO", "TOMMY HILFIGER", "TOUS", "VERSACE", "VICTOR&ROLF", "VICTORINOX", "YVES SAINT LAURENT"];

  // --- CARGAR DATOS ---
  useEffect(() => {
    const carritoGuardado = localStorage.getItem('carrito_compras');
    if (carritoGuardado) setCarrito(JSON.parse(carritoGuardado));

    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) setUser(JSON.parse(userInfo));

    fetch('https://api-perfumes-chile.onrender.com/api/perfumes')
      .then(res => res.json())
      .then(data => setPerfumes(data))
      .catch(err => console.error("Error:", err));
  }, []);

  useEffect(() => {
    localStorage.setItem('carrito_compras', JSON.stringify(carrito));
  }, [carrito]);

  // --- LÓGICA AUXILIAR ---
  const extraerML = (texto) => {
    const match = (texto || "").match(/(\d+)\s*ml/i);
    return match ? parseInt(match[1]) : 0;
  };

  const handleGeneroChange = (e) => {
    setFiltrosGenero({
        ...filtrosGenero,
        [e.target.name]: e.target.checked
    });
  };

  // Función para los enlaces rápidos del Navbar (Hombres, Mujeres...)
  const filtrarPorGeneroRapido = (genero) => {
      limpiarFiltros(); // Resetea otros filtros primero
      if (genero !== 'todos') {
          setFiltrosGenero({ ...{ hombre: false, mujer: false, unisex: false }, [genero]: true });
      }
      window.scrollTo(0, 400); // Baja un poco la pantalla hacia los productos
  };

  // --- FILTRADO PRINCIPAL ---
  const perfumesFiltrados = perfumes.filter(prod => {
    const nombre = (prod.nombre || "").toLowerCase();
    const categoria = (prod.categoria || "").toLowerCase();

    // Filtro Texto (Barra de búsqueda del navbar)
    if (!nombre.includes(busqueda.toLowerCase())) return false;
    // Filtro Precio
    if (prod.precio > precioMax) return false;
    // Filtro Marca
    if (marcaSeleccionada !== 'todas' && !nombre.toUpperCase().includes(marcaSeleccionada.toUpperCase())) return false;
    
    // Filtro Género (Checkboxes)
    const generosSeleccionados = Object.keys(filtrosGenero).filter(key => filtrosGenero[key]);
    if (generosSeleccionados.length > 0) {
        if (!generosSeleccionados.includes(categoria)) return false;
    }

    // Filtro ML (Dropdown)
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

  // --- FUNCIONES CARRITO/LOGIN ---
  const agregarAlCarrito = (p) => {
    setCarrito([...carrito, p]);
    Swal.fire({ title: '¡Agregado!', text: p.nombre, icon: 'success', timer: 1000, showConfirmButton: false, toast: true, position: 'top-end' });
  };

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    Swal.fire('¡Adiós!', 'Sesión cerrada', 'success');
  };

  const calcularTotal = () => carrito.reduce((s, i) => s + i.precio, 0);

  const finalizarCompraWhatsApp = () => {
    let mensaje = `Hola! Soy *${clienteNombre}* y mi pedido es:%0A%0A`;
    carrito.forEach(p => mensaje += `▪️ ${p.nombre} - $${p.precio.toLocaleString('es-CL')}%0A`);
    mensaje += `%0A💰 *TOTAL: $${calcularTotal().toLocaleString('es-CL')}*`;
    window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${mensaje}`, '_blank');
  };

  const limpiarFiltros = () => {
    setBusqueda(""); setPrecioMax(150000); setMarcaSeleccionada("todas"); setMlSeleccionado("todos");
    setFiltrosGenero({ hombre: false, mujer: false, unisex: false });
  };

  return (
    <>
      {/* === NAVBAR COMPLETO (Foto 10) === */}
      <nav className="navbar navbar-expand-lg fixed-top shadow-sm bg-white" style={{minHeight: '70px'}}>
        <div className="container-fluid px-4">
          {/* Logo */}
          <a className="navbar-brand fw-bold d-flex align-items-center text-success" href="/">
            <span style={{fontSize: '1.5rem', marginRight: '5px'}}>🧴</span> Perfumes Chile
          </a>
          
          {/* Toggle para móvil */}
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-between" id="navbarContent">
             {/* Barra de Búsqueda Central */}
             <form className="d-flex mx-auto my-2 my-lg-0" style={{maxWidth: '500px', width: '100%'}} onSubmit={e => e.preventDefault()}>
                <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">🔍</span>
                    <input 
                        className="form-control bg-light border-start-0" 
                        type="search" 
                        placeholder="Buscar perfume..." 
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                    />
                </div>
            </form>

            {/* Enlaces y Botones Derechos */}
            <ul className="navbar-nav align-items-center gap-3 mb-2 mb-lg-0">
                {/* Filtros Rápidos */}
                <li className="nav-item"><button onClick={() => filtrarPorGeneroRapido('hombre')} className="btn nav-link fw-bold small">Hombres</button></li>
                <li className="nav-item"><button onClick={() => filtrarPorGeneroRapido('mujer')} className="btn nav-link fw-bold small">Mujeres</button></li>
                <li className="nav-item"><button onClick={() => filtrarPorGeneroRapido('unisex')} className="btn nav-link fw-bold small">Unisex</button></li>
                <li className="nav-item"><button onClick={() => filtrarPorGeneroRapido('todos')} className="btn nav-link fw-bold small">Nosotros</button></li>
                
                {/* Carrito */}
                <li className="nav-item position-relative">
                    <button className="btn btn-outline-secondary d-flex align-items-center gap-2" onClick={() => setMostrarModal(true)}>
                        🛒 Carrito
                        <span className="badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle">{carrito.length}</span>
                    </button>
                </li>

                {/* Usuario / Login / Admin */}
                {user ? (
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle fw-bold text-success" href="#" role="button" data-bs-toggle="dropdown">
                        Hola, {user.name.split(' ')[0]}
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end">
                        <li><button className="dropdown-item text-danger" onClick={logoutHandler}>Cerrar Sesión</button></li>
                    </ul>
                </li>
                ) : (
                <li className="nav-item">
                     <a href="/login" className="btn-login fw-bold small px-3">Ingresar</a>
                </li>
                )}
                 {/* Botón Admin (Visual) */}
                 <li className="nav-item">
                    <button className="btn btn-success fw-bold small px-3">Admin</button>
                </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Contenedor principal con margen ajustado para que no quede espacio blanco grande */}
      <div className="fade-in" style={{marginTop: '85px'}}>
        
        {/* HERO BANNER */}
        <header className="hero-banner mb-5" style={{
            background: 'linear-gradient(135deg, #009970 0%, #006349 100%)',
            color: 'white',
            borderRadius: '0 0 20px 20px',
            padding: '4rem 1rem'
        }}>
          <div className="container text-center">
            <h1>✨ Oferta Especial</h1>
            <p className="lead">Descubre las fragancias más exclusivas con hasta un 50% de descuento</p>
            <button onClick={limpiarFiltros} className="btn btn-warning fw-bold px-4 py-2 mt-3 rounded-pill shadow-sm">
                Ver Catálogo Completo
            </button>
          </div>
        </header>

        <div className="container">
          <div className="row">
            
            {/* SIDEBAR DE FILTROS */}
            <aside className="col-lg-3 mb-4">
              <div className="bg-white p-3 rounded shadow-sm sticky-top" style={{top: '100px', zIndex: 1}}>
                <h5 className="fw-bold mb-3 text-secondary">⚡ Filtros</h5>
                
                {/* Checkboxes Género */}
                <div className="mb-4">
                    <label className="fw-bold mb-2 small text-muted">Género</label>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" name="hombre" checked={filtrosGenero.hombre} onChange={handleGeneroChange} id="checkHombre"/>
                        <label className="form-check-label" htmlFor="checkHombre">Hombre</label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" name="mujer" checked={filtrosGenero.mujer} onChange={handleGeneroChange} id="checkMujer"/>
                        <label className="form-check-label" htmlFor="checkMujer">Mujer</label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" name="unisex" checked={filtrosGenero.unisex} onChange={handleGeneroChange} id="checkUnisex"/>
                        <label className="form-check-label" htmlFor="checkUnisex">Unisex</label>
                    </div>
                </div>

                {/* Precio */}
                <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <label className="fw-bold small text-muted">Precio Máximo</label>
                        <span className="text-success fw-bold">${precioMax.toLocaleString()}</span>
                    </div>
                    <input type="range" className="form-range" min="0" max="150000" step="5000" value={precioMax} onChange={e => setPrecioMax(Number(e.target.value))} />
                </div>

                {/* Marca */}
                <div className="mb-4">
                    <label className="fw-bold mb-2 small text-muted">Marca</label>
                    <select className="form-select" value={marcaSeleccionada} onChange={e => setMarcaSeleccionada(e.target.value)}>
                    <option value="todas">Todas las marcas</option>
                    {MARCAS_CONOCIDAS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>

                {/* Tamaño */}
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

                {/* Botón Borrar */}
                <button onClick={limpiarFiltros} className="btn btn-outline-danger w-100 py-2">
                    🗑️ Borrar Filtros
                </button>
              </div>
            </aside>

            {/* LISTA DE PRODUCTOS */}
            <main className="col-lg-9">
              <h5 className="text-secondary mb-3">Resultados: <strong>{perfumesFiltrados.length}</strong> perfumes</h5>

              <div className="row">
                {productosVisibles.map(prod => (
                  <div className="col-md-4 mb-4" key={prod._id}>
                    <div className="card h-100 shadow-sm border-0">
                      <div className="position-relative">
                        <span className="badge bg-dark position-absolute top-0 end-0 m-2 opacity-75">
                            {extraerML(prod.nombre) > 0 ? `${extraerML(prod.nombre)}ml` : 'Perfume'}
                        </span>
                        <img src={prod.imagen} className="card-img-top p-3" alt={prod.nombre} style={{height: '250px', objectFit: 'contain'}} />
                      </div>
                      <div className="card-body d-flex flex-column">
                        <h6 className="card-title text-truncate fw-bold">{prod.nombre}</h6>
                        <p className="card-text text-muted small mb-2">{prod.categoria}</p>
                        <h5 className="text-success fw-bold mb-auto">${prod.precio.toLocaleString('es-CL')}</h5>
                        <button onClick={() => agregarAlCarrito(prod)} className="btn-agregar mt-3">Añadir 🛒</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* LÓGICA VER MÁS */}
              {productosVisibles.length < perfumesFiltrados.length && (
                <div className="text-center mt-4 mb-5">
                    <button className="btn-login px-5 py-2 shadow-sm" onClick={() => setLimiteProductos(prev => prev + 20)}>
                        Ver más productos 👇
                    </button>
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

        {/* SECCIÓN QUIÉNES SOMOS / CONTACTO */}
        <section className="bg-light py-5 mt-5">
            <div className="container">
                <h2 className="text-success fw-bold mb-3">¿Quiénes Somos?</h2>
                <p className="lead text-muted mb-5">Somos una empresa dedicada a la venta de perfumes 100% originales, entregando confianza y calidad en todo Chile.</p>
                <div className="card p-4 shadow-sm border-0" style={{maxWidth: '500px'}}>
                    <div className="d-flex align-items-center gap-2 mb-3">
                        <span style={{fontSize: '1.5rem'}}>📱</span>
                        <h4 className="mb-0">¡Hablemos!</h4>
                    </div>
                    <p className="fw-bold mb-3">WhatsApp: <span className="text-success">+56 9 5854 7236</span></p>
                    <div className="d-flex gap-2">
                        <button className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1">📷 @perfumeschile</button>
                        <button className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1">👍 Facebook</button>
                    </div>
                </div>
            </div>
        </section>

        {/* === FOOTER DETALLADO (Foto 9) === */}
        <footer className="footer-pro bg-dark text-white pt-5">
          <div className="container pb-4">
            <div className="row">
              {/* Columna 1: Marca */}
              <div className="col-md-4 mb-4">
                <h5 className="mb-3 text-uppercase fw-bold d-flex align-items-center">
                    <span style={{marginRight: '10px'}}>🧴</span> PERFUMES CHILE
                </h5>
                <p className="small text-white-50">
                  Tu tienda de confianza para fragancias 100% originales en Chile.
                </p>
                <div className="d-flex gap-3 mt-3">
                    <span className="text-white-50 d-flex align-items-center gap-1 small"><span className="text-danger">📷</span> Instagram</span>
                    <span className="text-white-50 d-flex align-items-center gap-1 small"><span className="text-primary">👍</span> Facebook</span>
                </div>
              </div>

              {/* Columna 2: Navegación */}
              <div className="col-md-4 mb-4">
                <h5 className="mb-3 text-uppercase fw-bold">NAVEGACIÓN</h5>
                <ul className="list-unstyled small">
                  <li className="mb-2"><button onClick={() => filtrarPorGeneroRapido('hombre')} className="btn p-0 text-white-50 text-decoration-none">◆ Perfumes Hombre</button></li>
                  <li className="mb-2"><button onClick={() => filtrarPorGeneroRapido('mujer')} className="btn p-0 text-white-50 text-decoration-none">◆ Perfumes Mujer</button></li>
                  <li className="mb-2"><button onClick={() => filtrarPorGeneroRapido('unisex')} className="btn p-0 text-white-50 text-decoration-none">◆ Perfumes Unisex</button></li>
                  <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none">◆ Sobre Nosotros</a></li>
                  <li className="mb-2"><a href="/login" className="text-white-50 text-decoration-none">◆ Acceso Admin</a></li>
                </ul>
              </div>

              {/* Columna 3: Contacto */}
              <div className="col-md-4 mb-4">
                <h5 className="mb-3 text-uppercase fw-bold">CONTÁCTANOS</h5>
                <ul className="list-unstyled small text-white-50">
                    <li className="mb-2 d-flex align-items-center gap-2">📍 Santiago, Chile</li>
                    <li className="mb-2 d-flex align-items-center gap-2">📱 +56 9 5854 7236</li>
                    <li className="mb-2 d-flex align-items-center gap-2">📧 contacto@perfumeschile.cl</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Barra inferior */}
          <div className="footer-bottom text-center py-3 border-top border-secondary">
            <div className="container d-flex justify-content-between small text-white-50">
              <p className="m-0">&copy; 2025 <strong>Perfumes Chile</strong>.</p>
              <p className="m-0">Desarrollado con ❤️ en Chile</p>
            </div>
          </div>
        </footer>

      </div>

      {/* MODAL CARRITO (Sin cambios mayores) */}
      {mostrarModal && (
        <div className="modal d-block" style={{background: 'rgba(0,0,0,0.5)', zIndex: 1050}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Tu Carrito 🛍️</h5>
                <button className="btn-close" onClick={() => setMostrarModal(false)}></button>
              </div>
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