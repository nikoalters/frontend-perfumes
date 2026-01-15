import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './AuthPage.css'; // Importaremos el nuevo CSS mágico

const AuthPage = () => {
  // Estado para controlar la animación: true = Login, false = Registro
  const [isLoginMode, setIsLoginMode] = useState(true);

  const navigate = useNavigate();

  // Estados para los formularios
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // --- LÓGICA DE LOGIN ---
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('https://api-perfumes-chile.onrender.com/api/users/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      Swal.fire({ icon: 'success', title: `¡Hola de nuevo, ${data.name.split(' ')[0]}!`, confirmButtonColor: '#009970', timer: 2000 });
      navigate('/');
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error de acceso', text: 'Credenciales incorrectas', confirmButtonColor: '#d63031' });
    }
  };

  // --- LÓGICA DE REGISTRO ---
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('https://api-perfumes-chile.onrender.com/api/users', { name, email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      Swal.fire({ icon: 'success', title: '¡Cuenta creada!', text: `Bienvenido, ${data.name.split(' ')[0]}`, confirmButtonColor: '#009970', timer: 2000 });
      navigate('/');
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error de registro', text: error.response?.data.message || error.message, confirmButtonColor: '#d63031' });
    }
  };

  // Función para cambiar entre modos y activar la animación
  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    // Limpiamos los campos al cambiar para que se vea prolijo
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <div className="auth-body">
      {/* El contenedor principal. Si isLoginMode es false, le agrega la clase "right-panel-active" que inicia la animación */}
      <div className={`auth-container ${!isLoginMode ? "right-panel-active" : ""}`} id="container">
        
        {/* --- FORMULARIO DE REGISTRO (Lado Izquierdo) --- */}
        <div className="form-container sign-up-container">
          <form onSubmit={handleRegister} className="auth-form">
            <h1 className="auth-title">Crear Cuenta</h1>
            <span className="auth-span">Usa tu correo para registrarte</span>
            <input type="text" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button className="auth-btn">Registrarme</button>
          </form>
        </div>

        {/* --- FORMULARIO DE LOGIN (Lado Derecho) --- */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleLogin} className="auth-form">
            <h1 className="auth-title">Iniciar Sesión</h1>
            <span className="auth-span">Ingresa con tu cuenta existente</span>
            <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button className="auth-btn">Ingresar</button>
          </form>
        </div>

        {/* --- EL PANEL DESLIZANTE VERDE (Overlay) --- */}
        <div className="overlay-container">
          <div className="overlay">
            {/* Panel izquierdo (visible cuando estás en Login) */}
            <div className="overlay-panel overlay-left">
              <h1 className="auth-title-overlay">¡Bienvenido de nuevo!</h1>
              <p className="auth-p">Para mantenerte conectado, ingresa tus datos personales.</p>
              <button className="ghost-btn" onClick={toggleMode}>Iniciar Sesión</button>
            </div>
            {/* Panel derecho (visible cuando estás en Registro) */}
            <div className="overlay-panel overlay-right">
              <h1 className="auth-title-overlay">¡Hola, Amigo!</h1>
              <p className="auth-p">Ingresa tus datos y comienza el viaje con nosotros.</p>
              <button className="ghost-btn" onClick={toggleMode}>Registrarse</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;