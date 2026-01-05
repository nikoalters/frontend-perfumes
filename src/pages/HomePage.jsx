import { useEffect, useState } from 'react';
import Swal from 'sweetalert2'; 

const HomePage = () => {
  // --- ESTADOS ---
  const [perfumes, setPerfumes] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [user, setUser] = useState(null); 
  const [busqueda, setBusqueda] = useState("");
  const [precioMax, setPrecioMax] = useState(150000);
  const [marcaSeleccionada, setMarcaSeleccionada] = useState("todas");
  const [mlSeleccionado, setMlSeleccionado] = useState("todos");
  const [filtrosGenero, setFiltrosGenero] = useState({ hombre: false, mujer: false, unisex: false });
  
  // MANTENEMOS EL LÍMITE EN 20 PARA VELOCIDAD EN MÓVIL
  const [limiteProductos, setLimiteProductos] = useState(20);
  
  const [mostrarModal, setMostrarModal] = useState(false);
  const [clienteNombre, setClienteNombre] = useState("");
  const [clienteDireccion, setClienteDireccion] = useState(""); // Variable reservada para futuro uso

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

  // --- LÓGICA DE FILTRADO ---
  const extraerML = (texto) => {
    const match = (texto || "").match(/(\d+)\s*ml/i);
    return match ? parseInt(match[1]) : 0;
  };

  const perfumesFiltrados = perfumes.filter(prod => {
    const nombre = (prod.nombre || "").toLowerCase();
    if (!nombre.includes(busqueda.toLowerCase())) return false;
    if (prod.precio > precioMax) return false;
    if (marcaSeleccionada !== 'todas' && !nombre.toUpperCase().includes(marcaSeleccionada.toUpperCase())) return false;
    
    const generosActivos = Object.keys(filtrosGenero).filter(k => filtrosGenero[k]);
    if (generosActivos.length > 0 && !generosActivos.includes((prod.categoria || "").toLowerCase())) return false;
    
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

  // Aquí cortamos la lista según el límite actual (20, 40, 60...)
  const productosVisibles = perfumesFiltrados.slice(0, limiteProductos);

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
      <nav className="navbar navbar-expand-lg fixed-top shadow-sm">
        <div className="container">
          <a className="navbar-brand" href="/">Perfumes Chile</a>
          <div className="d-flex align-items-center gap-3">
            {user ? (
              <div className="d-flex align-items-center gap-2">
                <span className="small fw-bold">Hola, {user.name}</span>
                <button onClick={logoutHandler} className="btn btn-sm btn-outline-danger">Salir</button>
              </div>
            ) : (
              // Botón Login con estilo verde
              <a href="/login" className="btn-login">Ingresar</a>
            )}
            <button className="btn btn-dark btn-sm" onClick={() => setMostrarModal(true)}>🛒 {carrito.length}</button>
          </div>
        </div>
      </nav>

      <div className="fade-in mt-5 pt-4">
        <header className="hero-banner">
          <div>
            <h1>✨ Oferta Especial</h1>
            <p>Los mejores perfumes al mejor precio</p>
            <button onClick={limpiarFiltros} className="btn btn-light text-success fw-bold rounded-pill mt-2">Ver Catálogo</button>
          </div>
        </header>

        <div className="container">
          <div className="row">
            {/* Sidebar con clase correcta para el CSS */}
            <aside className="col-lg-3 mb-4">
              <div className="sidebar-filtros">
                <h5 className="filtro-titulo">Filtros</h5>
                
                <div className="filtro-grupo">
                    <label>Precio Máximo: ${precioMax.toLocaleString()}</label>
                    <input type="range" className="form-range" min="0" max="150000" value={precioMax} onChange={e => setPrecioMax(Number(e.target.value))} />
                </div>

                <div className="filtro-grupo">
                    <label className="mb-2">Marca</label>
                    <select className="form-select mb-2" value={marcaSeleccionada} onChange={e => setMarcaSeleccionada(e.target.value)}>
                    <option value="todas">Todas las marcas</option>
                    {MARCAS_CONOCIDAS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>

                <button onClick={limpiarFiltros} className="btn btn-sm btn-outline-secondary w-100">Limpiar Filtros</button>
              </div>
            </aside>

            <main className="col-lg-9">
              <div className="row">
                {productosVisibles.map(prod => (
                  <div className="col-md-4 mb-4" key={prod._id}>
                    <div className="card h-100 shadow-sm">
                      <img src={prod.imagen} className="card-img-top" alt={prod.nombre} />
                      {/* Badge de ML si lo quieres agregar, opcional */}
                      <div className="card-body d-flex flex-column">
                        <h6 className="card-title text-truncate">{prod.nombre}</h6>
                        <p className="fw-bold text-success mb-auto">${prod.precio.toLocaleString('es-CL')}</p>
                        
                        {/* Botón Añadir con estilo VERDE (btn-agregar) */}
                        <button onClick={() => agregarAlCarrito(prod)} className="btn-agregar mt-3">Añadir 🛒</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* LÓGICA DEL BOTÓN VER MÁS */}
              {productosVisibles.length < perfumesFiltrados.length && (
                <div className="text-center mt-4 mb-5">
                    <button 
                        className="btn-login px-5 py-2 shadow-sm" 
                        onClick={() => setLimiteProductos(prev => prev + 20)}
                    >
                        Ver más productos 👇
                    </button>
                    <p className="text-muted small mt-2">
                        Mostrando {productosVisibles.length} de {perfumesFiltrados.length}
                    </p>
                </div>
              )}

              {productosVisibles.length === 0 && <h3 className="text-center py-5">No hay resultados</h3>}
            </main>
          </div>
        </div>

        {/* Footer con clase correcta */}
        <footer className="footer-pro py-4 mt-5">
            <div className="container text-center">
                <h5>Perfumes Chile</h5>
                <p>&copy; 2025 - Calidad y Garantía 🇨🇱</p>
            </div>
        </footer>
      </div>

      {/* MODAL CARRITO */}
      {mostrarModal && (
        <div className="modal d-block" style={{background: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Tu Carrito 🛍️</h5>
                <button className="btn-close" onClick={() => setMostrarModal(false)}></button>
              </div>
              <div className="modal-body">
                {carrito.map((item, idx) => (
                  <div key={idx} className="d-flex justify-content-between mb-2 border-bottom pb-1">
                    <span className="small text-truncate" style={{maxWidth: '70%'}}>{item.nombre}</span>
                    <button className="btn btn-sm text-danger" onClick={() => {
                        const n = [...carrito]; n.splice(idx, 1); setCarrito(n);
                    }}>×</button>
                  </div>
                ))}
                
                {carrito.length === 0 && <p className="text-center text-muted">El carrito está vacío</p>}

                {carrito.length > 0 && (
                    <>
                        <div className="fw-bold mt-3 text-end">Total: ${calcularTotal().toLocaleString()}</div>
                        <input type="text" className="form-control mt-3" placeholder="Tu nombre" value={clienteNombre} onChange={e => setClienteNombre(e.target.value)} />
                        <button className="btn btn-success w-100 mt-3" onClick={finalizarCompraWhatsApp}>Pedir por WhatsApp 📲</button>
                    </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;