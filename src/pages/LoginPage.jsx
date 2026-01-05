import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // <--- 1. AGREGAMOS 'Link' AQUÍ

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
      
      alert('¡Login Exitoso!');
      navigate('/'); 

    } catch (error) {
      setError('Correo o contraseña inválidos');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-md-center">
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <h1 className="text-center mb-4">Iniciar Sesión</h1>
            
            {error && <div className="alert alert-danger">{error}</div>}
            
            <form onSubmit={submitHandler}>
              <div className="mb-3">
                <label>Correo Electrónico</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label>Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Tu contraseña secreta"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-login w-100">
                Ingresar
              </button>
            </form>

            {/* 2. SECCIÓN NUEVA: ENLACE AL REGISTRO */}
            <div className="row py-3">
              <div className="col text-center">
                 ¿Nuevo cliente? <Link to="/register" className="text-decoration-none fw-bold">Regístrate aquí</Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;