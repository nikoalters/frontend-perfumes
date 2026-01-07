import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ProfilePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Datos de Envío (Si ya los guarda, aquí los mostraremos)
  const [direccion, setDireccion] = useState('');
  const [comuna, setComuna] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (!user) {
      navigate('/login');
    } else {
      // Cargar datos actuales del localStorage
      setName(user.name);
      setEmail(user.email);
      setDireccion(user.direccion || ''); // Si no tiene, sale vacío
      setComuna(user.comuna || '');
    }
  }, [navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      Swal.fire({icon: 'error', title: 'Error', text: 'Las contraseñas no coinciden'});
      return;
    }

    const user = JSON.parse(localStorage.getItem('userInfo'));

    try {
      const res = await fetch('https://api-perfumes-chile.onrender.com/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ 
            id: user._id, 
            name, 
            email, 
            password,
            direccion, 
            comuna     
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Actualizar localStorage con los nuevos datos recibidos
        localStorage.setItem('userInfo', JSON.stringify(data));
        Swal.fire({
            icon: 'success',
            title: '¡Actualizado!',
            text: 'Tus datos se guardaron correctamente.',
            timer: 2000,
            showConfirmButton: false,
            background: '#1e1e2f',
            color: '#fff'
        });
        // Limpiar campos de contraseña por seguridad
        setPassword('');
        setConfirmPassword('');
      } else {
        throw new Error(data.message || 'Error al actualizar');
      }
    } catch (error) {
      Swal.fire({icon: 'error', title: 'Error', text: error.message});
    }
  };

  return (
    <div className="container mt-5" style={{maxWidth: '700px'}}>
      <div className="card shadow p-4" style={{border: 'none', borderRadius: '15px'}}>
        <h2 className="text-center mb-4 fw-bold" style={{color: '#333'}}>👤 Mi Perfil</h2>
        
        <form onSubmit={submitHandler}>
          {/* SECCIÓN DATOS PERSONALES */}
          <h5 className="mb-3 text-success border-bottom pb-2">Datos Personales</h5>
          <div className="row">
            <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Nombre</label>
                <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Email</label>
                <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

          {/* SECCIÓN DIRECCIÓN */}
          <h5 className="mb-3 text-success border-bottom pb-2 mt-3">Dirección de Envío</h5>
          <div className="row">
            <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Comuna</label>
                <input type="text" className="form-control" placeholder="Ej: Santiago Centro" value={comuna} onChange={(e) => setComuna(e.target.value)} />
            </div>
            <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Calle y Número</label>
                <input type="text" className="form-control" placeholder="Ej: Alameda 123" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
            </div>
          </div>

          {/* SECCIÓN CONTRASEÑA */}
          <h5 className="mb-3 text-success border-bottom pb-2 mt-3">Cambiar Contraseña</h5>
          <div className="row">
             <div className="col-md-6 mb-3">
                <input type="password" placeholder="Nueva contraseña" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                <small className="text-muted">Déjalo vacío si no quieres cambiarla.</small>
             </div>
             <div className="col-md-6 mb-3">
                <input type="password" placeholder="Confirmar contraseña" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
             </div>
          </div>

          <button type="submit" className="btn btn-primary w-100 fw-bold mt-4 py-2" style={{borderRadius: '50px', fontSize: '1.1rem'}}>
            💾 Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;