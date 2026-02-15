import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const StaffLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginWithEmail } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Intentamos loguear
      await loginWithEmail(email, password);
      
      // La redirección real la manejará el componente ProtectedRoute o App.jsx
      // Pero por seguridad, intentamos enviar al Admin por defecto
      // (Si es dev, el router lo redirigirá a /dev después)
      navigate('/admin'); 
    } catch (err) {
      console.error(err);
      setError('Acceso denegado. Credenciales inválidas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-nova-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Fondo técnico sutil */}
      <div className="absolute inset-0 z-0 opacity-20" 
           style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md bg-nova-card border border-white/10 rounded-2xl p-8 shadow-2xl"
      >
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-nova-primary/10 flex items-center justify-center border border-nova-primary/30">
            <ShieldCheck size={32} className="text-nova-primary" />
          </div>
        </div>

        <h2 className="text-2xl font-display font-bold text-white text-center mb-2">Acceso Restringido</h2>
        <p className="text-gray-500 text-center mb-8 text-sm font-mono uppercase tracking-widest">Solo Personal Autorizado</p>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-mono text-gray-500 mb-1 uppercase">ID de Operador (Email)</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-nova-primary transition-colors font-mono"
              placeholder="admin@nova.agency"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-500 mb-1 uppercase">Clave de Acceso</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-nova-primary transition-colors font-mono"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-white text-nova-bg font-bold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? 'Verificando...' : <><Lock size={18} /> Autenticar</>}
          </button>
        </form>

        <div className="mt-8 text-center">
          <a href="/" className="text-xs text-gray-600 hover:text-nova-cyan transition-colors">
            ← Volver al sitio público
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default StaffLogin;