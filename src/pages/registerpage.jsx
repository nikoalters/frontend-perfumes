import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

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
        setError("Las contraseñas no coinciden ❌");
        return;
    }

    try {
      // 2. Enviar datos al Backend (Ruta de Registro)
      const { data } = await axios.post('https://api-perfumes-chile.onrender.com/api/users', {
        name,
        email,
        password,
      });

      // 3. Login automático al registrarse
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      Swal.fire({
          title: '¡Bienvenido!',
          text: `Cuenta creada exitosamente, ${data.name}`,
          icon: 'success',
          timer: 2000
      });

      navigate('/'); // Redirigir al inicio

    } catch (error) {
      // Si el correo ya existe o hay otro error
      setError(error.response && error.response.data.message 
        ? error.response.data.message 
        : error.message);
    }
  };

  return (
    <div className="container mt-5 fade-in">
      <div className="row justify-content-md-center">
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <h2 className="text-center mb-4">Crear Cuenta 🚀</h2>
            
            {error && <div className="alert alert-danger">{error}</div>}
            
            <form onSubmit={submitHandler}>
              <div className="mb-3">
                <label className="form-label">Nombre Completo</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej: Juan Pérez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Correo Electrónico</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Confirmar Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Repite tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-success w-100 py-2 fw-bold">
                Registrarme
              </button>
            </form>

            <div className="row py-3">
              <div className="col">
                ¿Ya tienes cuenta? <Link to="/login" className="text-decoration-none fw-bold">Inicia Sesión aquí</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;