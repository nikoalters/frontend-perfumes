import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // <--- 1. IMPORTAR LA PÁGINA
import './index.css';

function App() {
  return (
    <Routes>
       {/* Ruta Principal */}
       <Route path="/" element={<HomePage />} />
       
       {/* Ruta de Login */}
       <Route path="/login" element={<LoginPage />} />
       
       {/* Ruta de Registro (NUEVA) */}
       <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}

export default App;