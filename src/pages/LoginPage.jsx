import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './LoginPage.css'; // <--- ASEGURATE QUE ESTA LINEA ESTÉ AQUÍ

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault(); 
    try {
      const { data } = await axios.post('https://api-perfumes-chile.onrender.com/api/users/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      Swal.fire({ icon: 'success', title: '¡Bienvenido!', timer: 2000, showConfirmButton: false });
      navigate('/'); 
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Credenciales inválidas' });
    }
  };

  return (
    // CONTENEDOR PRINCIPAL (FONDO DE PANTALLA)
    <div className="glass-bg">
      
      {/* TARJETA DE VIDRIO CENTRADA */}
      <div className="glass-container fade-in">
        <h2 className="text-white text-center mb-4 fw-bold">PERFUMES CHILE</h2>
        
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <input
              type="email"
              className="glass-input"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              className="glass-input"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div className="d-grid">
            <button type="submit" className="glass-btn">INGRESAR</button>
          </div>
        </form>

        <div className="text-center mt-4">
          <Link to="/register" className="text-white-50 text-decoration-none small">
            ¿No tienes cuenta? <span className="text-white fw-bold">Regístrate aquí</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;