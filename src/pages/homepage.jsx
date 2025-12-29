import { useEffect, useState } from 'react';
import Swal from 'sweetalert2'; 
// Nota: Si te da error el CSS, asegúrate de importarlo en main.jsx

const HomePage = () => {
  // --- ESTADOS ---
  const [perfumes, setPerfumes] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [user, setUser] = useState(null); // <--- NUEVO ESTADO PARA EL USUARIO
  
  // Filtros
  const [busqueda, setBusqueda] = useState("");
  const [precioMax, setPrecioMax] = useState(150000);
  const [marcaSeleccionada, setMarcaSeleccionada] = useState("todas");
  const [mlSeleccionado, setMlSeleccionado] = useState("todos");
  const [filtrosGenero, setFiltrosGenero] = useState({ hombre: false, mujer: false, unisex: false });
  
  // Paginación
  const [limiteProductos, setLimiteProductos] = useState(20);

  // Modal Carrito
  const [mostrarModal, setMostrarModal] = useState(false);
  const [clienteNombre, setClienteNombre] = useState("");
  const [clienteDireccion, setClienteDireccion] = useState("");

  const NUMERO_WHATSAPP = "56958547236"; 

  const MARCAS_CONOCIDAS = [
    "ADOLFO DOMINGUEZ", "AFNAN", "AL HARAMAIN", "ANTONIO BANDERAS", "ARIANA GRANDE", 
    "ARMAF", "ARMANI", "AZZARO", "BENETTON", "BHARARA", "BURBERRY", "CACHAREL", 
    "CALVIN KLEIN", "CAROLINA HERRERA", "CLINIQUE", "COACH", "DIESEL", "DOLCE & GABBANA", 
    "DONNA KARAN", "GIVENCHY", "GUCCI", "GUESS", "HALLOWEEN", "HERMES", "HUGO BOSS", 
    "ISSEY MIYAKE", "JEAN PAUL GAULTIER", "JIMMY CHOO", "KENZO", "LACOSTE", "LANCOME", 
    "LATTAFA", "MAISON ALHAMBRA", "MONCLER", "MONTBLANC", "MOSCHINO", "MUGLER", 
    "PACO RABANNE", "RALPH LAUREN", "RASSASI", "SALVATORE FERRAGAMO", "TOMMY HILFIGER", 
    "TOUS", "VERSACE", "VICTOR&ROLF", "VICTORINOX", "YVES SAINT LAURENT"
  ];

  // --- CARGAR DATOS ---
  useEffect(() => {
    // 1. Cargar Carrito
    const carritoGuardado = localStorage.getItem('carrito_compras');
    if (carritoGuardado) setCarrito(JSON.parse(carritoGuardado));

    // 2. Cargar Usuario (ESTO ES NUEVO)
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        setUser(JSON.parse(userInfo));
    }

    // 3. Cargar Perfumes
    fetch('https://api-perfumes-chile.onrender.com/api/perfumes')
      .then(res => res.json())
      .then(data => setPerfumes(data))
      .catch(err => console.error("Error:", err));
  }, []);

  useEffect(() => {
    localStorage.setItem('carrito_compras', JSON.stringify(carrito));
  }, [carrito]);

  // --- LÓGICA DE FILTROS ---
  const extraerML = (texto) => {
    const match = texto.match(/(\d+)\s*ml/i);
    return match ? parseInt(match[1]) : 0;
  };

  const perfumesFiltrados = perfumes.filter(prod => {
    const nombre = (prod.nombre || "").toLowerCase();
    
    if (!nombre.includes(busqueda.toLowerCase())) return false;
    if (prod.precio > precioMax) return false;
    if (marcaSeleccionada !== 'todas' && !nombre.toUpperCase().includes(marcaSeleccionada.toUpperCase())) return false;

    const generosActivos = Object.keys(filtrosGenero).filter(k => filtrosGenero[k]);
    if (generosActivos.length > 0) {
       if (!generosActivos.includes((prod.categoria || "").toLowerCase())) return false;
    }

    if (mlSeleccionado !== 'todos') {
        const mlEnNombre = extraerML(prod.nombre);
        if (mlSeleccionado === "30" && mlEnNombre > 35) return false;
        if (mlSeleccionado === "50" && (mlEnNombre < 35 || mlEnNombre > 75)) return false;
        if (mlSeleccionado === "80" && (mlEnNombre < 76 || mlEnNombre > 95)) return false;
        if (mlSeleccionado === "100" && (mlEnNombre < 96 || mlEnNombre > 125)) return false;
        if (mlSeleccionado === "200" && mlEnNombre < 126) return false;
    }
    return true;
  });

  const productosVisibles = perfumesFiltrados.slice(0, limiteProductos);

  // --- ACCIONES ---
  const agregarAlCarrito = (producto) => {
    setCarrito([...carrito, producto]);
    Swal.fire({
        title: '¡Excelente!',
        text: `Agregaste ${producto.nombre}`,
        imageUrl: producto.imagen,
        imageWidth: 80,
        timer: 1000,
        showConfirmButton: false,
        position: 'top-end',
        toast: true
    });
  };

  const eliminarDelCarrito = (index) => {
    const nuevoCarrito = [...carrito];
    nuevoCarrito.splice(index, 1);
    setCarrito(nuevoCarrito);
  };

  // --- ACCIÓN NUEVA: CERRAR SESIÓN (Debe estar DENTRO del componente) ---
  const logoutHandler = () => {
    localStorage.removeItem('userInfo'); // Borra el carnet
    setUser(null); // Limpia el estado
    Swal.fire('¡Adiós!', 'Has cerrado sesión correctamente', 'success');
  };

  const calcularTotal = () => carrito.reduce((sum, item) => sum + item.precio, 0);

  const finalizarCompraWhatsApp = () => {
    if (carrito.length === 0) return Swal.fire('Carrito vacío', '', 'warning');
    if (!clienteNombre.trim()) return Swal.fire('Falta tu nombre', 'Escribe tu nombre para saber quién eres', 'error');

    let mensaje = `Hola! Soy *${clienteNombre}* y quiero pedir:%0A%0A`;
    if (clienteDireccion) mensaje += `📍 *Envío a:* ${clienteDireccion}%0A%0A`;

    carrito.forEach(prod => {
        mensaje += `▪️ ${prod.nombre} - $${prod.precio.toLocaleString('es-CL')}%0A`;
    });

    mensaje += `%0A💰 *TOTAL: $${calcularTotal().toLocaleString('es-CL')}*`;
    window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${mensaje}`, '_blank');
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    setPrecioMax(150000);
    setMarcaSeleccionada("todas");
    setMlSeleccionado("todos");
    setFiltrosGenero({ hombre: false, mujer: false, unisex: false });
    setLimiteProductos(20);
  };

  const handleMenuFilter = (genero) => {
    limpiarFiltros();
    setFiltrosGenero({ ...{ hombre: false, mujer: false, unisex: false }, [genero]: true });
    setTimeout(() => {
        const elemento = document.getElementById('contenedor-productos');
        if (elemento) elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  // --- RENDERIZADO ---
  return (
    <>
      {/* 1. NAVBAR (AQUÍ AGREGAMOS LA LÓGICA DEL USUARIO) */}
      <nav className="navbar navbar-expand-lg fixed-top">
        <div className="container">
            <a className="navbar-brand d-flex align-items-center" href="#">
                <img src="/assets/img/logo.jpg" width="30" height="30" className="d-inline-block align-top rounded-circle me-2" alt="" onError={(e) => e.target.style.display = 'none'} />
                Perfumes Chile
            </a>
            
            <div className="d-none d-lg-flex mx-auto">
                 <input 
                    className="form-control me-2" type="search" placeholder="🔍 Buscar perfume..." style={{ width: '300px' }}
                    value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                 />
            </div>

            <div className="d-flex align-items-center">
                <ul className="navbar-nav d-none d-lg-flex flex-row align-items-center gap-3 me-3">
                    <li className="nav-item"><a className="nav-link" href="#" onClick={() => handleMenuFilter('hombre')}>Hombres</a></li>
                    <li className="nav-item"><a className="nav-link" href="#" onClick={() => handleMenuFilter('mujer')}>Mujeres</a></li>
                    <li className="nav-item"><a className="nav-link" href="#" onClick={() => handleMenuFilter('unisex')}>Unisex</a></li>
                    
                    {/* LÓGICA DE USUARIO: Si existe 'user', mostramos saludo. Si no, botón ingresar */}
                    {user ? (
                        <li className="nav-item d-flex align-items-center gap-2">
                            <span className="fw-bold text-success">Hola, {user.name} 👋</span>
                            <button className="btn btn-sm btn-outline-danger" onClick={logoutHandler}>
                                Salir
                            </button>
                        </li>
                    ) : (
                        <li className="nav-item">
                            <a className="btn btn-sm btn-outline-primary" href="/login">👤 Ingresar</a>
                        </li>
                    )}

                </ul>

                <button className="btn btn-outline-dark position-relative" onClick={() => setMostrarModal(true)}>
                    🛒 Carrito
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {carrito.length}
                    </span>
                </button>
            </div>
        </div>
      </nav>

      {/* 2. CONTENIDO ANIMADO */}
      <div className="fade-in">
          
          {/* HERO BANNER */}
          <header className="hero-banner">
            <div className="container">
                <h1>✨ Oferta Especial</h1>
                <p>Descubre las fragancias más exclusivas con hasta un <strong>50% de descuento</strong></p>
                <button onClick={limpiarFiltros} className="btn btn-warning btn-lg rounded-pill px-5 fw-bold shadow-sm">
                    Ver Catálogo Completo
                </button>
            </div>
          </header>

          {/* CONTENIDO PRINCIPAL (GRILLA Y FILTROS) */}
          <div className="container mb-5" id="contenedor-productos">
            <div className="row">
                
                {/* SIDEBAR FILTROS */}
                <div className="col-lg-3 mb-4">
                    <div className="sidebar-filtros w-100">
                        <h4 className="mb-4">⚡ Filtros</h4>
                        
                        <div className="filtro-grupo">
                            <span className="filtro-titulo">Género</span>
                            {['hombre', 'mujer', 'unisex'].map(g => (
                                <div className="form-check" key={g}>
                                    <input className="form-check-input" type="checkbox" checked={filtrosGenero[g]}
                                        onChange={(e) => setFiltrosGenero({...filtrosGenero, [g]: e.target.checked})} />
                                    <label className="form-check-label text-capitalize"> {g} </label>
                                </div>
                            ))}
                        </div>

                        <div className="filtro-grupo">
                            <span className="filtro-titulo">Precio Máximo: <span className="text-success">${precioMax.toLocaleString('es-CL')}</span></span>
                            <input type="range" className="form-range" min="0" max="150000" step="5000" 
                                value={precioMax} onChange={(e) => setPrecioMax(Number(e.target.value))} />
                        </div>

                        <div className="filtro-grupo">
                            <span className="filtro-titulo">Marca</span>
                            <select className="form-select form-select-sm" value={marcaSeleccionada} onChange={(e) => setMarcaSeleccionada(e.target.value)}>
                                <option value="todas">Todas las marcas</option>
                                {MARCAS_CONOCIDAS.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>

                        <div className="filtro-grupo">
                            <span className="filtro-titulo">Tamaño (ML)</span>
                            <select className="form-select form-select-sm" value={mlSeleccionado} onChange={(e) => setMlSeleccionado(e.target.value)}>
                                <option value="todos">Todos los tamaños</option>
                                <option value="30">30 ml</option>
                                <option value="50">50 ml</option>
                                <option value="80">80 - 90 ml</option>
                                <option value="100">100 - 125 ml</option>
                                <option value="200">150 - 200 ml</option>
                            </select>
                        </div>

                        <button className="btn btn-outline-danger w-100 btn-sm" onClick={limpiarFiltros}>🗑️ Borrar Filtros</button>
                    </div>
                </div>

                {/* GRILLA PRODUCTOS */}
                <div className="col-lg-9">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="text-muted">Resultados: <span className="fw-bold text-dark">{perfumesFiltrados.length}</span> perfumes</h5>
                    </div>

                    <div className="row">
                        {productosVisibles.map(prod => {
                            const ml = extraerML(prod.nombre);
                            return (
                                <div className="col-md-4 col-sm-6 mb-4 fade-in" key={prod._id}>
                                    <div className="card h-100 shadow-sm position-relative">
                                        {ml > 0 && <div className="badge-ml">{ml}ml</div>}
                                        <img src={prod.imagen} className="card-img-top" alt={prod.nombre} onError={(e) => e.target.src = "/assets/img/logo.jpg"} />
                                        <div className="card-body d-flex flex-column">
                                            <small className="text-muted text-uppercase mb-1" style={{ fontSize: '0.7rem' }}>{prod.categoria}</small>
                                            <h6 className="card-title text-truncate" title={prod.nombre}>{prod.nombre}</h6>
                                            <div className="mt-auto">
                                                <p className="card-text fw-bold text-success fs-5 mb-2">${prod.precio.toLocaleString('es-CL')}</p>
                                                <button className="btn btn-agregar" onClick={() => agregarAlCarrito(prod)}>Añadir 🛒</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {productosVisibles.length === 0 && (
                            <div className="col-12 text-center py-5"><h3>😕 No hay resultados</h3></div>
                        )}
                    </div>

                    {perfumesFiltrados.length > limiteProductos && (
                        <div className="col-12 text-center py-4">
                            <p className="text-muted mb-2">Mostrando {productosVisibles.length} de {perfumesFiltrados.length} productos</p>
                            <button className="btn btn-outline-dark rounded-pill px-5 fw-bold" onClick={() => setLimiteProductos(limiteProductos + 20)}>
                                ⬇ Ver más perfumes
                            </button>
                        </div>
                    )}
                </div>
            </div>
          </div>

          {/* SECCIONES NOSOTROS, TESTIMONIOS Y FOOTER */}
          <section id="nosotros" className="container my-5 py-5 border-top">
            <div className="row align-items-center">
                <div className="col-md-6 order-md-2">
                    <h2 className="fw-bold mb-3" style={{color: 'var(--color-principal)'}}>¿Quiénes Somos?</h2>
                    <p className="lead text-muted">
                        Somos una empresa dedicada a la venta de perfumes <strong>100% originales</strong>.
                    </p>
                    <div className="mt-4 p-3 bg-light rounded border shadow-sm">
                        <h5 className="mb-3">📲 ¡Hablemos!</h5>
                        <p className="mb-1"><strong>WhatsApp:</strong> +56 9 5854 7236</p>
                        <div className="d-flex gap-2 mt-3">
                            <a href="https://instagram.com/nico_alters" target="_blank" className="btn btn-outline-danger btn-sm">📸 @perfumeschile</a>
                            <a href="https://facebook.com/Nicolas Soto" target="_blank" className="btn btn-outline-primary btn-sm">👍 Facebook</a>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 order-md-1 text-center mb-4 mb-md-0">
                    <img src="/assets/img/madre4.jpg" alt="Equipo Perfumes Chile" className="img-fluid rounded shadow-lg" style={{maxHeight: '400px', objectFit: 'cover'}} 
                        onError={(e) => e.target.src = "https://via.placeholder.com/400x300?text=Equipo+Perfumes"}/>
                </div>
            </div>
          </section>

          <footer className="footer-pro pt-5" style={{backgroundColor: '#1a1a1a', color: 'white'}}>
            <div className="container">
                <div className="row">
                    {/* COLUMNA 1: LOGO Y REDES */}
                    <div className="col-md-4 mb-4">
                        <div className="d-flex align-items-center mb-3">
                            <img src="/assets/img/logo.jpg" alt="Logo" width="40" height="40" className="rounded-circle me-2" onError={(e) => e.target.style.display = 'none'}/>
                            <h5 className="m-0 fw-bold">Perfumes Chile</h5>
                        </div>
                        <p className="text-white-50">Tu tienda de confianza para fragancias 100% originales.</p>
                        <div className="mt-3 d-flex gap-3">
                            {/* Ajusté los colores para que se vean bien en fondo oscuro */}
                            <a href="https://instagram.com/nico_alters" target="_blank" className="d-flex align-items-center text-white text-decoration-none">
                                <span style={{fontSize: '1.2rem', marginRight: '5px'}}>📸</span> Instagram
                            </a>
                            <a href="https://facebook.com/Nicolas Soto" target="_blank" className="d-flex align-items-center text-white text-decoration-none">
                                <span style={{fontSize: '1.2rem', marginRight: '5px'}}>👍</span> Facebook
                            </a>
                        </div>
                    </div>
                    
                    {/* COLUMNA 2: NAVEGACIÓN (CORREGIDO) */}
                    <div className="col-md-4 mb-4">
                        <h5 className="text-uppercase fw-bold mb-3" style={{color: '#4ade80'}}>Navegación</h5>
                        <ul className="list-unstyled">
                            {/* Aquí cambié 'text-muted' por 'text-white' para que se lea bien */}
                            <li className="mb-2"><a href="#" className="text-decoration-none text-white" onClick={(e) => { e.preventDefault(); handleMenuFilter('hombre'); }}>🔹 Perfumes Hombre</a></li>
                            <li className="mb-2"><a href="#" className="text-decoration-none text-white" onClick={(e) => { e.preventDefault(); handleMenuFilter('mujer'); }}>🔹 Perfumes Mujer</a></li>
                            <li className="mb-2"><a href="#" className="text-decoration-none text-white" onClick={(e) => { e.preventDefault(); handleMenuFilter('unisex'); }}>🔹 Perfumes Unisex</a></li>
                            <li className="mb-2"><a href="#" className="text-decoration-none text-white" onClick={(e) => { e.preventDefault(); scrollToSection('nosotros'); }}>🔹 Sobre Nosotros</a></li>
                        </ul>
                    </div>
                    
                    {/* COLUMNA 3: CONTACTO */}
                    <div className="col-md-4 mb-4">
                        <h5 className="text-uppercase fw-bold mb-3" style={{color: '#4ade80'}}>Contáctanos</h5>
                        <p className="mb-2">📍 Santiago, Chile</p>
                        <p className="mb-2">📱 +56 9 5854 7236</p>
                        <p className="mb-2">📧 contacto@perfumeschile.cl</p>
                    </div>
                </div>
            </div>
            
            {/* BARRA INFERIOR */}
            <div className="footer-bottom text-center py-3 border-top border-secondary" style={{background: '#000'}}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6 text-md-start">
                            &copy; 2025 <strong>Perfumes Chile</strong>.
                        </div>
                        <div className="col-md-6 text-md-end mt-2 mt-md-0">
                            <span className="text-white-50 small">Desarrollado con ❤️ en Chile</span>
                        </div>
                    </div>
                </div>
            </div>
          </footer>

      </div> {/* FIN DEL CONTENIDO ANIMADO */}

      {/* 3. MODAL CARRITO */}
      {mostrarModal && (
        <>
            <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Tu Carrito de Compras 🛍️</h5>
                            <button type="button" className="btn-close" onClick={() => setMostrarModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            {carrito.length === 0 ? <p className="text-center text-muted">Tu carrito está vacío.</p> : (
                                <>
                                <ul className="list-group mb-3">
                                    {carrito.map((item, idx) => (
                                        <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center">
                                                <img src={item.imagen} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '5px', marginRight: '10px' }} />
                                                <div style={{ lineHeight: '1.2' }}>
                                                    <small className="fw-bold d-block text-truncate" style={{ maxWidth: '180px' }}>{item.nombre}</small>
                                                    <small className="text-muted">${item.precio.toLocaleString('es-CL')}</small>
                                                </div>
                                            </div>
                                            <button className="btn btn-outline-danger btn-sm py-0 px-2" onClick={() => eliminarDelCarrito(idx)}>×</button>
                                        </li>
                                    ))}
                                </ul>
                                <div className="d-flex justify-content-between fw-bold border-top pt-2">
                                    <span>Total:</span><span>${calcularTotal().toLocaleString('es-CL')}</span>
                                </div>
                                </>
                            )}
                        </div>
                        <div className="modal-footer d-flex flex-column align-items-stretch">
                            <div className="mb-3 w-100">
                                <label className="form-label fw-bold">Nombre del Cliente:</label>
                                <input type="text" className="form-control" placeholder="Ej: Juan Pérez" value={clienteNombre} onChange={(e) => setClienteNombre(e.target.value)} />
                            </div>
                            <div className="mb-3 w-100">
                                <label className="form-label fw-bold">Dirección (Opcional):</label>
                                <input type="text" className="form-control" placeholder="Ej: Av. Pajaritos 1234" value={clienteDireccion} onChange={(e) => setClienteDireccion(e.target.value)} />
                            </div>
                            <div className="d-flex justify-content-between w-100 mt-2">
                                <button type="button" className="btn btn-secondary" onClick={() => setMostrarModal(false)}>Seguir mirando</button>
                                <button type="button" className="btn btn-success flex-grow-1 ms-2" onClick={finalizarCompraWhatsApp}>Finalizar Compra por WhatsApp 📲</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>
        </>
      )}
    </>
  );
}

export default HomePage;