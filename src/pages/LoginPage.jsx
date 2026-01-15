import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
// Asegúrate de que esta importación exista y apunte a tu archivo CSS
import './LoginPage.css'; 

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault(); 
    setError(null);

    try {
      const { data } = await axios.post('https://api-perfumes-chile.onrender.com/api/users/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      // Alerta estilo Dark/Gold
      Swal.fire({ 
        icon: 'success', 
        title: 'Acceso Concedido', 
        background: '#111', 
        color: '#d4af37', // Texto dorado
        showConfirmButton: false, 
        timer: 2000 
      });
      
      navigate('/'); 
    } catch (error) {
      setError('Credenciales incorrectas');
      Swal.fire({ icon: 'error', title: 'Error', background: '#111', color: '#fff' });
    }
  };

  return (
    // Fondo negro completo
    <div className="vip-bg">
      
      {/* Tarjeta minimalista central */}
      <div className="vip-card fade-in">
        <div className="text-center mb-5">
          <h1 className="vip-title">PERFUMES CHILE</h1>
          <div className="vip-divider"></div>
          <p className="vip-subtitle">ACCESO EXCLUSIVO</p>
        </div>
        
        {error && <div className="alert alert-danger vip-alert">{error}</div>}

        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label className="vip-label">CORREO ELECTRÓNICO</label>
            <input
              type="email"
              className="vip-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nombre@ejemplo.com"
            />
          </div>
          <div className="mb-5">
            <label className="vip-label">CONTRASEÑA</label>
            <input
              type="password"
              className="vip-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          
          <div className="d-grid">
            <button type="submit" className="vip-btn">INICIAR SESIÓN</button>
          </div>
        </form>

        <div className="text-center mt-5 pt-3">
            <p className="text-muted small mb-1">¿No eres miembro?</p>
            <Link to="/register" className="vip-link">SOLICITAR UNA CUENTA</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;