import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './LoginPage.css'; // Reutilizamos el mismo CSS elegante

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null);

    // 1. Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden");
        return;
    }

    try {
      // 2. Enviar datos al Backend
      const { data } = await axios.post('https://api-perfumes-chile.onrender.com/api/users', {
        name,
        email,
        password,
      });

      // 3. Login automático
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      // Alerta Limpia y Corporativa
      Swal.fire({
          title: '¡Cuenta creada!',
          text: `Bienvenido a Perfumes Chile, ${data.name.split(' ')[0]}`,
          icon: 'success',
          confirmButtonColor: '#009970', // Tu verde corporativo
          timer: 2000,
          showConfirmButton: false
      });

      navigate('/'); 

    } catch (error) {
      setError(error.response && error.response.data.message 
        ? error.response.data.message 
        : error.message);
        
      Swal.fire({
        icon: 'error',
        title: 'Error de registro',
        text: 'Por favor verifica tus datos e inténtalo nuevamente.',
        confirmButtonColor: '#d63031'
      });
    }
  };

  return (
    <div className="container-fluid login-container">
      <div className="row g-0 h-100">
        
        {/* LADO IZQUIERDO: IMAGEN (La misma estética del Login) */}
        <div className="col-md-6 d-none d-md-block p-0">
          <div className="login-image">
            <div className="login-overlay">
              <div className="overlay-content">
                <h1 className="display-4 fw-bold text-white">Únete a Nosotros</h1>
                <p className="text-white-50 lead">Descubre fragancias exclusivas y ofertas especiales.</p>
              </div>
            </div>
          </div>
        </div>

        {/* LADO DERECHO: FORMULARIO */}
        <div className="col-md-6 bg-white d-flex align-items-center justify-content-center">
          <div className="login-form-wrapper p-5 fade-in" style={{ width: '100%', maxWidth: '500px' }}>
            
            <div className="text-center mb-5">
              <h2 className="fw-bold" style={{ color: 'var(--color-principal)' }}>CREAR CUENTA</h2>
              <span className="text-muted">Completa tus datos para comenzar</span>
            </div>

            {error && <div className="alert alert-danger shadow-sm border-0">{error}</div>}
            
            <form onSubmit={submitHandler}>
              {/* Nombre */}
              <div className="mb-4 form-floating">
                <input
                  type="text"
                  className="form-control form-control-clean"
                  id="floatingName"
                  placeholder="Ej: Ignacio Benitez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <label htmlFor="floatingName">Nombre Completo</label>
              </div>

              {/* Email */}
              <div className="mb-4 form-floating">
                <input
                  type="email"
                  className="form-control form-control-clean"
                  id="floatingEmail"
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="floatingEmail">Correo Electrónico</label>
              </div>

              {/* Password */}
              <div className="mb-4 form-floating">
                <input
                  type="password"
                  className="form-control form-control-clean"
                  id="floatingPassword"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label htmlFor="floatingPassword">Contraseña</label>
              </div>

              {/* Confirmar Password */}
              <div className="mb-4 form-floating">
                <input
                  type="password"
                  className="form-control form-control-clean"
                  id="floatingConfirm"
                  placeholder="Confirmar Contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <label htmlFor="floatingConfirm">Confirmar Contraseña</label>
              </div>

              <div className="d-grid gap-2 mt-5">
                <button type="submit" className="btn btn-login-custom py-3 shadow-sm">
                  REGISTRARME
                </button>
              </div>
            </form>

            <div className="text-center mt-5">
              <p className="text-muted small">
                ¿Ya tienes una cuenta? <br />
                <Link to="/login" className="fw-bold text-decoration-none" style={{ color: 'var(--color-principal)' }}>
                  INICIAR SESIÓN
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;