import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './LoginPage.css'; // <--- Recuerda crear este archivo

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault(); 
    setError(null);

    try {
      const { data } = await axios.post('https://api-perfumes-chile.onrender.com/api/users/login', {
        email,
        password,
      });

      localStorage.setItem('userInfo', JSON.stringify(data));
      
      // Alerta con tus colores corporativos
      Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: `Hola de nuevo, ${data.name.split(' ')[0]}`,
        confirmButtonColor: '#009970', // Tu verde corporativo
        timer: 2000,
        showConfirmButton: false
      });

      navigate('/'); 

    } catch (error) {
      const msg = 'Correo o contraseña inválidos';
      setError(msg);

      Swal.fire({
        icon: 'error',
        title: 'Error de acceso',
        text: msg,
        confirmButtonColor: '#d63031'
      });
    }
  };

  return (
    <div className="container-fluid login-container">
      <div className="row g-0 h-100">
        
        {/* LADO IZQUIERDO: IMAGEN (Se oculta en móviles) */}
        <div className="col-md-6 d-none d-md-block p-0">
          <div className="login-image">
            <div className="login-overlay">
              {/* Texto opcional sobre la imagen */}
              <div className="overlay-content">
                <h1 className="display-4 fw-bold text-white">Esencia & Estilo</h1>
                <p className="text-white-50 lead">Los mejores aromas de Chile en un solo lugar.</p>
              </div>
            </div>
          </div>
        </div>

        {/* LADO DERECHO: FORMULARIO */}
        <div className="col-md-6 bg-white d-flex align-items-center justify-content-center">
          <div className="login-form-wrapper p-5 fade-in">
            
            <div className="text-center mb-5">
              <h2 className="fw-bold" style={{ color: 'var(--color-principal)' }}>PERFUMES CHILE</h2>
              <span className="text-muted">Ingresa a tu cuenta</span>
            </div>

            {error && <div className="alert alert-danger shadow-sm border-0">{error}</div>}
            
            <form onSubmit={submitHandler}>
              <div className="mb-4 form-floating">
                <input
                  type="email"
                  className="form-control form-control-clean"
                  id="floatingInput"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="floatingInput">Correo Electrónico</label>
              </div>

              <div className="mb-4 form-floating">
                <input
                  type="password"
                  className="form-control form-control-clean"
                  id="floatingPassword"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="floatingPassword">Contraseña</label>
              </div>

              <div className="d-grid gap-2 mt-5">
                <button type="submit" className="btn btn-login-custom py-3 shadow-sm">
                  INGRESAR
                </button>
              </div>
            </form>

            <div className="text-center mt-5">
              <p className="text-muted small">
                ¿Primera vez aquí? <br />
                <Link to="/register" className="fw-bold text-decoration-none" style={{ color: 'var(--color-principal)' }}>
                  CREAR CUENTA NUEVA
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;