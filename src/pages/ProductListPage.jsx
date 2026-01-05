import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const ProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState(null);

    // 1. Cargar Usuario y Productos al entrar
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo && userInfo.isAdmin) {
            setUser(userInfo);
            fetchProducts();
        } else {
            window.location.href = '/login'; // Si no es admin, pa' fuera
        }
    }, []);

    const fetchProducts = async () => {
        const res = await fetch('https://api-perfumes-chile.onrender.com/api/products');
        const data = await res.json();
        setProducts(data);
    };

    // 2. Función para BORRAR
    const deleteHandler = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, borrarlo'
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`https://api-perfumes-chile.onrender.com/api/products/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${user.token}` // Importante: Token de Admin
                    }
                });

                if (res.ok) {
                    Swal.fire('¡Borrado!', 'El producto ha sido eliminado.', 'success');
                    fetchProducts(); // Recargar la tabla
                } else {
                    Swal.fire('Error', 'No se pudo borrar', 'error');
                }
            } catch (error) {
                Swal.fire('Error', 'Algo salió mal', 'error');
            }
        }
    };

    // 3. Función para CREAR (Genera uno de ejemplo)
    const createProductHandler = async () => {
        try {
            const res = await fetch('https://api-perfumes-chile.onrender.com/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                Swal.fire('¡Creado!', 'Producto de ejemplo creado', 'success');
                // Aquí deberíamos redirigir a editar, pero por ahora recargamos
                fetchProducts(); 
            } else {
                Swal.fire('Error', 'No se pudo crear', 'error');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container mt-5 fade-in" style={{paddingTop: '80px'}}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>📦 Gestión de Productos</h1>
                <button className="btn btn-dark" onClick={createProductHandler}>
                    + Crear Nuevo Producto
                </button>
            </div>

            <div className="table-responsive shadow-sm rounded">
                <table className="table table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>NOMBRE</th>
                            <th>PRECIO</th>
                            <th>CATEGORÍA</th>
                            <th>MARCA</th>
                            <th>ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id}>
                                <td>{product._id.substring(20, 24)}</td>
                                <td className="fw-bold">{product.nombre}</td>
                                <td>${product.precio.toLocaleString()}</td>
                                <td>{product.categoria}</td>
                                <td>{product.marca || 'N/A'}</td>
                                <td>
                                    <button className="btn btn-sm btn-light me-2 border">
                                        ✏️ Editar
                                    </button>
                                    <button 
                                        className="btn btn-sm btn-danger"
                                        onClick={() => deleteHandler(product._id)}
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductListPage;