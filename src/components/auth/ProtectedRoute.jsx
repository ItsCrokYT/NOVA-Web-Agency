import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, userRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen bg-nova-bg flex items-center justify-center text-white font-mono animate-pulse">Verificando...</div>;
  }

  // 1. NO ESTÁ LOGUEADO
  if (!currentUser) {
    if (allowedRoles.includes('admin') || allowedRoles.includes('dev')) {
        return <Navigate to="/staff-login" state={{ from: location }} replace />;
    }
    return <Navigate to="/" replace />;
  }

  // 2. VERIFICACIÓN DE EMAIL (Solo para Clientes)
  // Si es cliente, está logueado, pero NO ha verificado su email
  if (userRole === 'client' && !currentUser.emailVerified) {
    // Si NO estamos ya en la página de verificación, redirigir
    // (Para evitar bucles infinitos)
    if (location.pathname !== '/verify-email') {
      return <Navigate to="/verify-email" replace />;
    }
    // Si ya estamos en /verify-email, dejar pasar (para renderizar la página)
    return children;
  }

  // 3. SÍ ESTÁ LOGUEADO, PERO ROL INCORRECTO
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    if (userRole === 'client') return <Navigate to="/client" replace />;
    if (userRole === 'dev') return <Navigate to="/dev" replace />;
    if (userRole === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />;
  }

  // 4. ACCESO CONCEDIDO
  return children;
};

export default ProtectedRoute;