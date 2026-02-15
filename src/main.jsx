import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './i18n';
import { AuthProvider } from './context/AuthContext'; // Importar AuthProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback={<div className="text-white text-center p-10">Loading NOVA...</div>}>
      <AuthProvider> {/* Envolver la app */}
        <App />
      </AuthProvider>
    </Suspense>
  </React.StrictMode>,
);