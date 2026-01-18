import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage'; 
import ProductListPage from './pages/ProductListPage'; 
import './index.css';
import OrdersPage from './pages/OrdersPage';
import OrderListPage from './pages/OrderListPage';
import ProfilePage from './pages/ProfilePage';
function App() {
  return (
    <Routes>
      
       <Route path="/" element={<HomePage />} />
       
       <Route path="/login" element={<AuthPage />} />
       <Route path="/register" element={<AuthPage />} /> 


      
      <Route path="/admin/productlist" element={<ProductListPage />} />
      <Route path="/mis-pedidos" element={<OrdersPage />} />
      <Route path="/admin/orderlist" element={<OrderListPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}

export default App;