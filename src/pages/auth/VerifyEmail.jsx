import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, RefreshCw, LogOut, ArrowRight } from 'lucide-react';

const VerifyEmail = () => {
  const { currentUser, logout, resendVerification } = useAuth();
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  // Verificar periódicamente si el usuario ya validó su correo
  useEffect(() => {
    const interval = setInterval(async () => {
      if (currentUser) {
        await currentUser.reload(); // Recarga los datos del usuario desde Firebase
        if (currentUser.emailVerified) {
          navigate('/client'); // Si ya verificó, mandar al dashboard
        }
      }
    }, 3000); // Chequear cada 3 segundos

    return () => clearInterval(interval);
  }, [currentUser, navigate]);

  const handleResend = async () => {
    setSending(true);
    try {
      await resendVerification();
      setMsg('¡Correo enviado! Revisa tu bandeja de entrada (y spam).');
    } catch (e) {
      console.error(e);
      setMsg('Espera unos minutos antes de intentar de nuevo.');
    } finally {
      setSending(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-nova-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-nova-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md bg-nova-card border border-white/10 rounded-3xl p-8 text-center shadow-2xl">
        <div className="w-20 h-20 bg-nova-primary/10 border border-nova-primary/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail size={40} className="text-nova-cyan" />
        </div>
        
        <h2 className="text-2xl font-display font-bold text-white mb-2">Verifica tu Correo</h2>
        <p className="text-gray-400 mb-6 text-sm leading-relaxed">
          Para proteger tu cuenta, hemos enviado un enlace de confirmación a: <br/>
          <span className="text-white font-mono bg-white/5 px-2 py-1 rounded mt-2 inline-block border border-white/10">
            {currentUser.email}
          </span>
        </p>

        {msg && (
          <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-xs animate-pulse">
            {msg}
          </div>
        )}
        
        <div className="space-y-3">
          <button 
            onClick={() => window.open('https://gmail.com', '_blank')}
            className="w-full py-3 bg-nova-primary hover:bg-nova-primary/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-nova-primary/20 flex items-center justify-center gap-2"
          >
            Ir a mi correo <ArrowRight size={18} />
          </button>

          <button 
            onClick={handleResend}
            disabled={sending}
            className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 border border-white/10"
          >
            <RefreshCw size={18} className={sending ? "animate-spin" : ""} />
            {sending ? "Enviando..." : "Reenviar Enlace"}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5">
          <p className="text-xs text-gray-500 mb-4">¿Te equivocaste de correo?</p>
          <button 
            onClick={() => { logout(); navigate('/'); }}
            className="text-gray-400 hover:text-white text-sm flex items-center justify-center gap-1 mx-auto transition-colors"
          >
            <LogOut size={14} /> Cerrar Sesión y Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;