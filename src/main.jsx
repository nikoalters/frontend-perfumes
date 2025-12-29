import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' 

// 1. AGREGA ESTA LÍNEA DE BOOTSTRAP AQUÍ:
import 'bootstrap/dist/css/bootstrap.min.css'; 

import './index.css' // Tus estilos personalizados (el color verde, etc.)
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)