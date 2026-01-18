import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Profile3D from '../components/Profile3D'; // <--- Importamos la animación

const ProfilePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Datos de envío
  const [direccion, setDireccion] = useState('');
  const [comuna, setComuna] = useState('');

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setName(user.name);
      setEmail(user.email);
      // Cargar dirección si existe en localStorage o user
      if (user.direccion) setDireccion(user.direccion);
      if (user.comuna) setComuna(user.comuna);
    }
  }, [navigate, user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Las contraseñas no coinciden', background: '#1e1e2e', color: '#fff' });
      return;
    }

    try {
      const updatedUser = { ...user, name, direccion, comuna, password }; // Simulación de update
      
      // AQUÍ IRÍA TU FETCH REAL AL BACKEND (PUT /api/users/profile)
      // Como placeholder, actualizamos localStorage:
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));

      Swal.fire({
        icon: 'success',
        title: '¡Actualizado!',
        text: 'Tu perfil ha sido modificado con éxito.',
        timer: 2000,
        showConfirmButton: false,
        background: '#1e1e2e', color: '#fff'
      });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar', background: '#1e1e2e', color: '#fff' });
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5" 
         style={{ background: '#050505', paddingTop: '100px' }}>
      
      <div className="container mt-5">
        <div className="row g-0 rounded-4 overflow-hidden shadow-lg" 
             style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(20, 20, 30, 0.6)', backdropFilter: 'blur(10px)' }}>
          
          {/* --- COLUMNA IZQUIERDA: IDENTIDAD DIGITAL (3D) --- */}
          <div className="col-lg-5 d-none d-lg-flex flex-column align-items-center justify-content-center p-5 position-relative overflow-hidden"
               style={{ background: 'linear-gradient(135deg, rgba(0,153,112,0.1) 0%, rgba(0,0,0,0) 100%)' }}>
            
            <h3 className="text-white fw-bold mb-4 text-uppercase text-center" style={{letterSpacing: '2px', zIndex: 2}}>
              Identidad <span style={{color: '#00e5ff'}}>Digital</span>
            </h3>
            
            {/* EL ORBE LÍQUIDO */}
            <div style={{ width: '100%', height: '400px', zIndex: 1 }}>
                <Profile3D />
            </div>

            <p className="text-white-50 text-center small mt-4" style={{maxWidth: '80%', zIndex: 2}}>
              Mantén tus datos actualizados para recibir tus fragancias a la velocidad de la luz.
            </p>
          </div>

          {/* --- COLUMNA DERECHA: FORMULARIO FUTURISTA --- */}
          <div className="col-lg-7 p-5">
            <h2 className="fw-bold text-white mb-4 d-flex align-items-center gap-2">
               <i className="bi bi-person-bounding-box" style={{color: 'var(--color-principal)'}}></i> MI PERFIL
            </h2>

            <form onSubmit={submitHandler}>
              
              {/* SECCIÓN 1: DATOS PERSONALES */}
              <h5 className="text-secondary text-uppercase fs-6 mb-3 border-bottom border-secondary pb-2 border-opacity-25">
                Datos de Acceso
              </h5>
              
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                    <div className="form-floating-custom">
                        <label className="text-secondary small">Nombre de Usuario</label>
                        <input 
                            type="text" 
                            className="form-control-cyber" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-floating-custom">
                        <label className="text-secondary small">Correo Electrónico</label>
                        <input 
                            type="email" 
                            className="form-control-cyber" 
                            value={email} 
                            disabled 
                            style={{opacity: 0.5, cursor: 'not-allowed'}} 
                        />
                    </div>
                </div>
              </div>

              {/* SECCIÓN 2: ENVÍO */}
              <h5 className="text-secondary text-uppercase fs-6 mb-3 border-bottom border-secondary pb-2 border-opacity-25">
                Coordenadas de Envío
              </h5>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                    <div className="form-floating-custom">
                        <label className="text-secondary small">Comuna / Ciudad</label>
                        <input 
                            type="text" 
                            className="form-control-cyber" 
                            placeholder="Ej: Providencia"
                            value={comuna} 
                            onChange={(e) => setComuna(e.target.value)} 
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-floating-custom">
                        <label className="text-secondary small">Dirección (Calle y Número)</label>
                        <input 
                            type="text" 
                            className="form-control-cyber" 
                            placeholder="Ej: Av. Siempre Viva 742"
                            value={direccion} 
                            onChange={(e) => setDireccion(e.target.value)} 
                        />
                    </div>
                </div>
              </div>

              {/* SECCIÓN 3: SEGURIDAD */}
              <h5 className="text-secondary text-uppercase fs-6 mb-3 border-bottom border-secondary pb-2 border-opacity-25">
                Actualizar Credenciales
              </h5>
              <div className="row g-3 mb-5">
                <div className="col-md-6">
                    <div className="form-floating-custom">
                        <label className="text-secondary small">Nueva Contraseña</label>
                        <input 
                            type="password" 
                            className="form-control-cyber" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="••••••••"
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-floating-custom">
                        <label className="text-secondary small">Confirmar Contraseña</label>
                        <input 
                            type="password" 
                            className="form-control-cyber" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            placeholder="••••••••"
                        />
                    </div>
                </div>
              </div>

              {/* BOTÓN DE ACCIÓN */}
              <button type="submit" className="btn w-100 py-3 rounded-pill fw-bold text-white shadow-lg btn-glow"
                      style={{
                          background: 'linear-gradient(90deg, var(--color-principal), #00c48f)',
                          border: 'none',
                          letterSpacing: '1px'
                      }}>
                <i className="bi bi-save2 me-2"></i> GUARDAR CAMBIOS
              </button>

            </form>
          </div>
        </div>
      </div>

      {/* ESTILOS LOCALES PARA LOS INPUTS CYBERPUNK */}
      <style>{`
        .form-floating-custom {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        
        .form-control-cyber {
            background: transparent;
            border: none;
            border-bottom: 2px solid rgba(255,255,255,0.1);
            color: white;
            padding: 10px 0;
            font-size: 1rem;
            outline: none;
            transition: all 0.3s ease;
            border-radius: 0;
        }

        .form-control-cyber:focus {
            border-bottom-color: var(--color-principal);
            box-shadow: 0 10px 10px -10px rgba(0, 153, 112, 0.5);
        }

        .form-control-cyber::placeholder {
            color: rgba(255,255,255,0.2);
        }

        .btn-glow:hover {
            transform: translateY(-2px);
            box-shadow: 0 0 20px rgba(0, 153, 112, 0.6);
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;