import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; 
import ProductListPage from './pages/ProductListPage'; // <--- 1. IMPORTAR LA NUEVA PÁGINA ADMIN
import './index.css';

function App() {
  return (
    <Routes>
       {/* Ruta Principal */}
       <Route path="/" element={<HomePage />} />
       
       {/* Ruta de Login */}
       <Route path="/login" element={<LoginPage />} />
       
       {/* Ruta de Registro */}
       <Route path="/register" element={<RegisterPage />} />

       {/* Ruta de Administrador (NUEVA) */}
       <Route path="/admin/productlist" element={<ProductListPage />} />
    </Routes>
  );
}

export default App;