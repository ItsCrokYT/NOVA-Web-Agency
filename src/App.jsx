import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Páginas Públicas
import Home from './pages/public/Home';
import StaffLogin from './pages/auth/StaffLogin';
import VerifyEmail from './pages/auth/VerifyEmail';

// Páginas Privadas
import ClientDashboard from './pages/client/ClientDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import DevDashboard from './pages/dev/DevDashboard';

// Seguridad
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      {/* CAMBIO CRÍTICO AQUÍ: 
         Agregamos 'basename' usando la variable de entorno que ya configuramos en vite.config.js.
         Esto le dice al router que la aplicación vive en una subcarpeta.
      */}
      <Router basename={import.meta.env.BASE_URL}>
        <Routes>
          {/* === RUTAS PÚBLICAS === */}
          <Route path="/" element={<Home />} />
          <Route path="/staff-login" element={<StaffLogin />} />
          
          {/* === RUTAS PROTEGIDAS === */}
          
          {/* Ruta de Verificación */}
          <Route 
            path="/verify-email" 
            element={
              <ProtectedRoute allowedRoles={['client']}>
                <VerifyEmail />
              </ProtectedRoute>
            } 
          />
          
          {/* 1. Cliente */}
          <Route 
            path="/client" 
            element={
              <ProtectedRoute allowedRoles={['client', 'admin']}>
                <ClientDashboard />
              </ProtectedRoute>
            } 
          />

          {/* 2. Admin */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* 3. Desarrollador */}
          <Route 
            path="/dev" 
            element={
              <ProtectedRoute allowedRoles={['dev', 'admin']}>
                <DevDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Ruta 404 */}
          <Route path="*" element={
            <div className="text-white text-center mt-20 bg-nova-bg h-screen flex items-center justify-center font-mono">
              404 | ACCESS_DENIED
            </div>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;