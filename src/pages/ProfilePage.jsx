import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

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
      const updatedUser = { ...user, name, direccion, comuna, password };
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));

      Swal.fire({
        icon: 'success',
        title: '¡Perfil Actualizado!',
        text: 'Tus credenciales han sido renovadas.',
        timer: 2000,
        showConfirmButton: false,
        background: '#1e1e2e', color: '#fff'
      });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Fallo en el sistema', background: '#1e1e2e', color: '#fff' });
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5" 
         style={{ background: '#050505', paddingTop: '100px' }}>
      
      <div className="container mt-5">
        
        {/* --- TARJETA PRINCIPAL CON BORDE DE NEÓN --- */}
        <div className="row g-0 rounded-4 overflow-hidden position-relative neon-card-container">
          
          {/* COLUMNA IZQUIERDA: AVATAR HOLOGRÁFICO */}
          <div className="col-lg-5 d-none d-lg-flex flex-column align-items-center justify-content-center p-5 position-relative"
               style={{ background: 'rgba(5, 5, 10, 0.8)' }}>
            
            {/* Círculos Giratorios (El "Avatar") */}
            <div className="holo-avatar-container mb-4">
                <div className="ring-outer"></div>
                <div className="ring-inner"></div>
                {/* Ícono de Usuario Central */}
                <div className="user-icon-glow">
                    <span className="fw-bold fs-1 text-white">
                        {name ? name.charAt(0).toUpperCase() : 'U'}
                    </span>
                </div>
            </div>

            <h3 className="text-white fw-bold mb-2 text-uppercase text-center" style={{letterSpacing: '2px', textShadow: '0 0 10px rgba(0,255,113,0.5)'}}>
              {name || 'Usuario'}
            </h3>
            <p className="text-success small fw-bold mb-0">
                <span className="dot-online"></span> ESTADO: ACTIVO
            </p>
            
            <div className="mt-5 text-center px-4">
                <p className="text-white-50 small" style={{fontSize: '0.8rem'}}>
                    ID DE ACCESO: <span className="text-white font-monospace">{user?._id?.substring(0,8).toUpperCase()}</span>
                </p>
                <div className="progress mt-2" style={{height: '2px', background: '#333'}}>
                    <div className="progress-bar bg-success" style={{width: '100%', boxShadow: '0 0 10px #00ff41'}}></div>
                </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: FORMULARIO */}
          <div className="col-lg-7 p-5" style={{ background: 'rgba(20, 20, 30, 0.95)' }}>
            <h4 className="fw-bold text-white mb-4 d-flex align-items-center gap-2 border-bottom border-secondary border-opacity-25 pb-3">
               <i className="bi bi-sliders text-success"></i> CONFIGURACIÓN DE CUENTA
            </h4>

            <form onSubmit={submitHandler}>
              
              <div className="row g-4 mb-4">
                <div className="col-md-6">
                    <label className="text-secondary small fw-bold mb-2">NOMBRE DE PILOTO</label>
                    <div className="input-group-neon">
                        <i className="bi bi-person text-secondary"></i>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                </div>
                <div className="col-md-6">
                    <label className="text-secondary small fw-bold mb-2">CORREO ENCRIPTADO</label>
                    <div className="input-group-neon disabled">
                        <i className="bi bi-envelope text-secondary"></i>
                        <input type="email" value={email} disabled />
                    </div>
                </div>
              </div>

              <div className="row g-4 mb-4">
                <div className="col-md-6">
                    <label className="text-secondary small fw-bold mb-2">COMUNA / SECTOR</label>
                    <div className="input-group-neon">
                        <i className="bi bi-geo text-secondary"></i>
                        <input type="text" placeholder="Ej: Providencia" value={comuna} onChange={(e) => setComuna(e.target.value)} />
                    </div>
                </div>
                <div className="col-md-6">
                    <label className="text-secondary small fw-bold mb-2">DIRECCIÓN BASE</label>
                    <div className="input-group-neon">
                        <i className="bi bi-map text-secondary"></i>
                        <input type="text" placeholder="Ej: Calle 123" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
                    </div>
                </div>
              </div>

              <div className="row g-4 mb-5">
                <div className="col-md-6">
                    <label className="text-secondary small fw-bold mb-2">NUEVA CLAVE</label>
                    <div className="input-group-neon">
                        <i className="bi bi-key text-secondary"></i>
                        <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                </div>
                <div className="col-md-6">
                    <label className="text-secondary small fw-bold mb-2">CONFIRMAR CLAVE</label>
                    <div className="input-group-neon">
                        <i className="bi bi-check-circle text-secondary"></i>
                        <input type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                </div>
              </div>

              <button type="submit" className="btn w-100 py-3 rounded-1 fw-bold text-white shadow btn-neon-submit">
                GUARDAR DATOS
              </button>

            </form>
          </div>
        </div>
      </div>

      <style>{`
        /* --- 1. EL MARCO DE NEÓN PRINCIPAL --- */
        .neon-card-container {
            border: 1px solid rgba(0, 255, 65, 0.3); /* Borde físico sutil */
            box-shadow: 0 0 30px rgba(0, 0, 0, 0.8), 
                        inset 0 0 0 1px rgba(0, 255, 65, 0.1); /* Brillo interno */
            /* Animación de pulso en el borde */
            animation: borderPulse 4s infinite alternate;
        }

        @keyframes borderPulse {
            0% { box-shadow: 0 0 20px rgba(0, 153, 112, 0.2); border-color: rgba(0, 153, 112, 0.3); }
            100% { box-shadow: 0 0 40px rgba(0, 229, 255, 0.4); border-color: rgba(0, 229, 255, 0.6); }
        }

        /* --- 2. INPUTS ESTILO CYBERPUNK --- */
        .input-group-neon {
            display: flex;
            align-items: center;
            background: rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.1);
            padding: 10px 15px;
            transition: 0.3s;
            position: relative;
        }
        
        /* Borde de neón inferior al hacer foco */
        .input-group-neon::after {
            content: '';
            position: absolute; bottom: 0; left: 0; width: 0%; height: 2px;
            background: var(--color-principal);
            transition: 0.3s;
            box-shadow: 0 0 10px var(--color-principal);
        }

        .input-group-neon:focus-within::after {
            width: 100%;
        }

        .input-group-neon i { margin-right: 10px; font-size: 1.1rem; }
        
        .input-group-neon input {
            background: transparent;
            border: none;
            color: white;
            width: 100%;
            outline: none;
        }

        .input-group-neon.disabled {
            background: rgba(255,255,255,0.02);
            border-color: rgba(255,255,255,0.05);
            opacity: 0.6;
        }

        /* --- 3. BOTÓN NEÓN --- */
        .btn-neon-submit {
            background: transparent;
            border: 2px solid var(--color-principal);
            color: var(--color-principal);
            text-transform: uppercase;
            letter-spacing: 2px;
            transition: 0.3s;
            position: relative;
            overflow: hidden;
        }

        .btn-neon-submit:hover {
            background: var(--color-principal);
            color: black; /* Contraste alto */
            box-shadow: 0 0 30px var(--color-principal);
        }

        /* --- 4. AVATAR HOLOGRÁFICO (LOS ANILLOS) --- */
        .holo-avatar-container {
            width: 120px;
            height: 120px;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .user-icon-glow {
            width: 80px; height: 80px;
            background: #111;
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            z-index: 2;
            box-shadow: 0 0 20px rgba(0, 255, 65, 0.2);
            border: 2px solid #00ff41;
        }

        /* Anillo Exterior Giratorio */
        .ring-outer {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            border-radius: 50%;
            border: 2px dashed rgba(0, 229, 255, 0.5);
            border-top-color: transparent;
            border-bottom-color: transparent;
            animation: spin 6s linear infinite;
        }

        /* Anillo Interior Giratorio (Inverso) */
        .ring-inner {
            position: absolute;
            top: 10px; left: 10px; right: 10px; bottom: 10px;
            border-radius: 50%;
            border: 2px solid rgba(0, 255, 65, 0.4);
            border-left-color: transparent;
            border-right-color: transparent;
            animation: spin 4s linear infinite reverse;
        }

        .dot-online {
            display: inline-block;
            width: 8px; height: 8px;
            background: #00ff41;
            border-radius: 50%;
            margin-right: 5px;
            box-shadow: 0 0 5px #00ff41;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;