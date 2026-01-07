import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; 
import ProductListPage from './pages/ProductListPage'; 
import './index.css';
import OrdersPage from './pages/OrdersPage';
import OrderListPage from './pages/OrderListPage';

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
      <Route path="/mis-pedidos" element={<OrdersPage />} />
      <Route path="/admin/orderlist" element={<OrderListPage />} />
    </Routes>
  );
}

export default App;