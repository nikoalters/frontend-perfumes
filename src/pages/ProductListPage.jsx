import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    
    // ESTADOS PARA EL MODO EDICIÓN
    const [editMode, setEditMode] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);

    const [formData, setFormData] = useState({
        nombre: '',
        ml: '',
        precio: '',
        categoria: 'hombre',
        imagen: ''
    });

    // 1. VERIFICAR SESIÓN Y CARGAR DATOS
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo && userInfo.isAdmin) {
            setUser(userInfo);
            fetchProducts();
        } else {
            navigate('/login');
        }
    }, [navigate]);

    // 2. OBTENER PRODUCTOS (CON ANTI-CACHÉ)
    const fetchProducts = async () => {
        try {
            // Agregamos un timestamp (?t=...) para obligar a traer datos frescos de Render
            const res = await fetch(`https://api-perfumes-chile.onrender.com/api/products?t=${new Date().getTime()}`);
            
            if (!res.ok) {
                console.error("Error en la respuesta del servidor:", res.status);
                return;
            }

            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error("Error crítico de conexión:", error);
        }
    };

    // 3. ESTADÍSTICAS Y FORMATO
    const totalCantidad = products.length;
    const totalDinero = products.reduce((suma, prod) => suma + (prod.precio || 0), 0);

    const formatearPeso = (valor) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(valor);
    };

    // 4. MANEJO DE INPUTS Y FORMULARIO
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        const field = id.split('-')[0]; 
        setFormData({ ...formData, [field]: value });
    };

    // Activar modo edición cargando datos en el form
    const editClickHandler = (prod) => {
        setEditMode(true);
        setCurrentProductId(prod._id);
        
        // Intentamos separar el nombre de los ML para el form
        const nombreSinML = prod.nombre.replace(/\d+ml/gi, '').trim();
        const mlDetectado = prod.nombre.match(/\d+/) ? prod.nombre.match(/\d+/)[0] : '';

        setFormData({
            nombre: nombreSinML,
            ml: mlDetectado,
            precio: prod.precio,
            categoria: prod.categoria,
            imagen: prod.imagen
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setFormData({ nombre: '', ml: '', precio: '', categoria: 'hombre', imagen: '' });
        setEditMode(false);
        setCurrentProductId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nombreFinal = `${formData.nombre} ${formData.ml}ml`;

        const url = editMode 
            ? `https://api-perfumes-chile.onrender.com/api/products/${currentProductId}`
            : 'https://api-perfumes-chile.onrender.com/api/products';
        
        const method = editMode ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    nombre: nombreFinal,
                    precio: Number(formData.precio),
                    categoria: formData.categoria,
                    imagen: formData.imagen || '/vite.svg',
                    marca: "Original",
                    countInStock: 10
                })
            });

            if (res.ok) {
                Swal.fire({ 
                    icon: 'success', 
                    title: editMode ? '¡Actualizado!' : '¡Guardado!', 
                    text: `${nombreFinal}`, 
                    timer: 1500, 
                    showConfirmButton: false 
                });
                resetForm();
                fetchProducts();
            } else {
                Swal.fire('Error', 'No se pudo procesar el perfume', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Fallo de red', 'error');
        }
    };

    // 5. FUNCIÓN BORRAR
    const deleteHandler = async (id) => {
        const result = await Swal.fire({
            title: '¿Eliminar producto?',
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Sí, borrar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`https://api-perfumes-chile.onrender.com/api/products/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                if (res.ok) {
                    Swal.fire('¡Borrado!', 'Eliminado de la base de datos', 'success');
                    fetchProducts();
                }
            } catch (error) {
                Swal.fire('Error', 'No se pudo eliminar', 'error');
            }
        }
    };

    return (
        <div className="admin-container fade-in">
            <style>{`
                :root { --color-principal: #009970; --color-hover: #00b383; --fondo-suave: #f8f9fa; }
                .admin-container { background-color: var(--fondo-suave); min-height: 100vh; padding-bottom: 50px; }
                .admin-header { background: linear-gradient(135deg, #111 0%, #333 100%); color: white; padding: 5rem 0 3rem 0; margin-bottom: 2rem; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); }
                .stat-card { transition: transform 0.3s; border: none; border-radius: 15px; overflow: hidden; }
                .stat-card:hover { transform: translateY(-5px); }
                .icon-box { font-size: 2.5rem; opacity: 0.8; }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .fade-in { animation: fadeInUp 0.6s ease-out forwards; }
                .table-responsive::-webkit-scrollbar { width: 6px; }
                .table-responsive::-webkit-scrollbar-track { background: #f1f1f1; }
                .table-responsive::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }
                .table-responsive::-webkit-scrollbar-thumb:hover { background: var(--color-principal); }
            `}</style>

            <header className="admin-header text-center">
                <div className="container">
                    <h1 className="fw-bold display-5">🚀 Panel de Control</h1>
                    <p className="text-white-50 lead">Gestión de Inventario - Perfumes Chile</p>
                    <div className="d-flex justify-content-center gap-2 mt-4">
                        <Link to="/" className="btn btn-outline-light rounded-pill px-4 shadow-sm text-decoration-none">⬅ Ir a la Tienda</Link>
                        <button onClick={() => { localStorage.removeItem('userInfo'); navigate('/login'); }} className="btn btn-danger rounded-pill px-4 shadow-sm">🚪 Cerrar Sesión</button>
                    </div>
                </div>
            </header>

            <div className="container">
                {/* TARJETAS DE ESTADÍSTICAS */}
                <div className="row mb-5">
                    <div className="col-md-4 mb-3">
                        <div className="card stat-card text-white bg-primary h-100 shadow">
                            <div className="card-body d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="card-title text-uppercase mb-0 small">Total Productos</h6>
                                    <h2 className="display-4 fw-bold my-2">{totalCantidad}</h2>
                                    <small className="text-white-50">Perfumes en catálogo</small>
                                </div>
                                <div className="icon-box">📦</div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 mb-3">
                        <div className="card stat-card text-white bg-success h-100 shadow">
                            <div className="card-body d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="card-title text-uppercase mb-0 small">Valor Inventario</h6>
                                    <h2 className="display-6 fw-bold my-2">{formatearPeso(totalDinero)}</h2>
                                    <small className="text-white-50">Suma total de precios</small>
                                </div>
                                <div className="icon-box">💰</div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 mb-3">
                        <div className="card stat-card text-white bg-dark h-100 shadow">
                            <div className="card-body d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="card-title text-uppercase mb-0 small">Categorías</h6>
                                    <h2 className="display-4 fw-bold my-2">3</h2>
                                    <small className="text-white-50">Hombre | Mujer | Unisex</small>
                                </div>
                                <div className="icon-box">🏷️</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {/* FORMULARIO DINÁMICO (CREAR/EDITAR) */}
                    <div className="col-md-4 mb-5">
                        <div className="card shadow border-0 rounded-4 sticky-top" style={{top: '100px'}}>
                            <div className="card-header bg-white border-bottom-0 pt-4 px-4">
                                <h5 className={`mb-0 fw-bold ${editMode ? 'text-warning' : 'text-primary'}`}>
                                    {editMode ? '✏️ Editando Perfume' : '➕ Nuevo Perfume'}
                                </h5>
                            </div>
                            <div className="card-body px-4 pb-4">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label text-muted small fw-bold">Nombre</label>
                                        <input type="text" id="nombre-prod" className="form-control bg-light border-0 py-2" placeholder="Ej: Dior Sauvage" value={formData.nombre} onChange={handleInputChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label text-muted small fw-bold">Contenido (ml)</label>
                                        <input type="number" id="ml-prod" className="form-control bg-light border-0 py-2" placeholder="Ej: 100" value={formData.ml} onChange={handleInputChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label text-muted small fw-bold">Precio</label>
                                        <input type="number" id="precio-prod" className="form-control bg-light border-0 py-2" placeholder="50000" value={formData.precio} onChange={handleInputChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label text-muted small fw-bold">Categoría</label>
                                        <select id="categoria-prod" className="form-select bg-light border-0 py-2" value={formData.categoria} onChange={handleInputChange}>
                                            <option value="hombre">Hombre</option>
                                            <option value="mujer">Mujer</option>
                                            <option value="unisex">Unisex</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label text-muted small fw-bold">Imagen (URL o archivo)</label>
                                        <input type="text" id="imagen-prod" className="form-control bg-light border-0 py-2" placeholder="sauvage.jpg" value={formData.imagen} onChange={handleInputChange} />
                                    </div>
                                    <button type="submit" className={`btn ${editMode ? 'btn-warning' : 'btn-primary'} w-100 rounded-pill py-2 fw-bold shadow-sm mt-3`}>
                                        {editMode ? 'Actualizar Cambios' : 'Guardar Perfume'}
                                    </button>
                                    {editMode && (
                                        <button type="button" onClick={resetForm} className="btn btn-link w-100 text-muted mt-2 small text-decoration-none">❌ Cancelar Edición</button>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* TABLA DE INVENTARIO */}
                    <div className="col-md-8">
                        <div className="card shadow border-0 rounded-4 overflow-hidden">
                            <div className="card-header bg-white border-bottom-0 pt-4 px-4">
                                <h5 className="mb-0 fw-bold text-dark">📋 Inventario Detallado</h5>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive" style={{ maxHeight: '700px', overflowY: 'auto' }}>
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light sticky-top">
                                            <tr>
                                                <th className="ps-4 py-3">Producto</th>
                                                <th className="py-3 text-center">Categoría</th>
                                                <th className="py-3">Precio</th>
                                                <th className="text-center py-3">Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[...products].reverse().map(prod => {
                                                let badgeColor = 'bg-secondary';
                                                if (prod.categoria === 'hombre') badgeColor = 'bg-primary';
                                                if (prod.categoria === 'mujer') badgeColor = 'bg-danger';
                                                if (prod.categoria === 'unisex') badgeColor = 'bg-success';

                                                return (
                                                    <tr key={prod._id}>
                                                        <td className="ps-4">
                                                            <div className="d-flex align-items-center">
                                                                <img src={prod.imagen || '/vite.svg'} width="45" height="45" className="rounded-circle border me-3 shadow-sm" style={{ objectFit: 'cover' }} alt="perfume" />
                                                                <span className="fw-bold text-dark small">{prod.nombre}</span>
                                                            </div>
                                                        </td>
                                                        <td className="text-center">
                                                            <span className={`badge ${badgeColor} rounded-pill text-uppercase`} style={{ fontSize: '0.65rem', padding: '0.5em 0.8em' }}>
                                                                {prod.categoria}
                                                            </span>
                                                        </td>
                                                        <td className="fw-bold text-success small">{formatearPeso(prod.precio)}</td>
                                                        <td className="text-center">
                                                            <div className="d-flex justify-content-center gap-2">
                                                                <button className="btn btn-outline-primary btn-sm rounded-circle shadow-sm" onClick={() => editClickHandler(prod)} title="Editar">✏️</button>
                                                                <button className="btn btn-outline-danger btn-sm rounded-circle shadow-sm" onClick={() => deleteHandler(prod._id)} title="Eliminar">🗑️</button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductListPage;