import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Phone, Smartphone, Check, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Importamos el hook de traducción

const LoginModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation(); // Inicializamos la traducción
  const [method, setMethod] = useState('email'); 
  const [step, setStep] = useState('input');
  const [isSignup, setIsSignup] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { loginWithEmail, signupWithEmail, loginWithGoogle, loginWithPhone, setupRecaptcha } = useAuth();
  const navigate = useNavigate();

  // === HANDLERS ===

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await loginWithGoogle();
      onClose();
      navigate('/client');
    } catch (err) {
      console.error(err);
      setError(t('auth.errors.google'));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isSignup) {
        await signupWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
      onClose();
      navigate('/client');
    } catch (err) {
      console.error(err.code);
      let msg = t('auth.errors.generic');
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        msg = t('auth.errors.credentials');
      } else if (err.code === 'auth/email-already-in-use') {
        msg = t('auth.errors.email_exists');
      } else if (err.code === 'auth/weak-password') {
        msg = t('auth.errors.weak_password');
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const verifier = setupRecaptcha('recaptcha-container');
      const confirmation = await loginWithPhone(phoneNumber, verifier);
      setConfirmationResult(confirmation);
      setStep('verify');
    } catch (err) {
      console.error(err);
      setError(t('auth.errors.sms'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await confirmationResult.confirm(otp);
      onClose();
      navigate('/client');
    } catch (err) {
      setError(t('auth.errors.invalid_code'));
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setError('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md bg-nova-bg border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[50px] pointer-events-none transition-colors duration-500 ${isSignup ? 'bg-nova-magenta/20' : 'bg-nova-primary/20'}`} />
            <div className={`absolute bottom-0 left-0 w-32 h-32 rounded-full blur-[50px] pointer-events-none transition-colors duration-500 ${isSignup ? 'bg-nova-primary/20' : 'bg-nova-cyan/20'}`} />

            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
              <X size={24} />
            </button>

            {/* Título Dinámico Traducido */}
            <div className="mb-6">
              <h2 className="text-3xl font-display font-bold text-white mb-2">
                {isSignup ? t('auth.create_account_title') : t('auth.welcome_title')}
              </h2>
              <p className="text-gray-400 text-sm">
                {isSignup ? t('auth.create_account_subtitle') : t('auth.welcome_subtitle')}
              </p>
            </div>

            <div className="flex gap-4 mb-6 border-b border-white/10 pb-4">
              <button 
                onClick={() => setMethod('email')}
                className={`flex items-center gap-2 pb-2 text-sm font-bold transition-all ${method === 'email' ? 'text-nova-cyan border-b-2 border-nova-cyan' : 'text-gray-500 hover:text-white'}`}
              >
                <Mail size={16} /> {t('auth.method_email')}
              </button>
              <button 
                onClick={() => setMethod('phone')}
                className={`flex items-center gap-2 pb-2 text-sm font-bold transition-all ${method === 'phone' ? 'text-nova-cyan border-b-2 border-nova-cyan' : 'text-gray-500 hover:text-white'}`}
              >
                <Phone size={16} /> {t('auth.method_phone')}
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs text-center animate-pulse">
                {error}
              </div>
            )}

            {method === 'email' && (
              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-500 font-mono uppercase ml-1">{t('auth.email_label')}</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 text-gray-500" size={18} />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-nova-cyan transition-colors"
                      placeholder="cliente@nova.com"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500 font-mono uppercase ml-1">{t('auth.password_label')}</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 text-gray-500" size={18} />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-nova-cyan transition-colors"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
                
                <button 
                  disabled={loading} 
                  type="submit" 
                  className={`w-full py-3 font-bold rounded-xl transition-all flex justify-center items-center gap-2 ${
                    isSignup 
                      ? 'bg-nova-magenta text-white hover:bg-nova-magenta/90 shadow-lg shadow-nova-magenta/20' 
                      : 'bg-white text-nova-bg hover:bg-gray-200'
                  }`}
                >
                  {loading ? t('auth.processing') : (
                    isSignup ? <><UserPlus size={18} /> {t('auth.signup_btn')}</> : <><LogIn size={18} /> {t('auth.login_btn')}</>
                  )}
                </button>
              </form>
            )}

            {method === 'phone' && (
              <div className="space-y-4">
                {step === 'input' ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500 font-mono uppercase ml-1">{t('auth.phone_label')}</label>
                      <div className="relative">
                        <Smartphone className="absolute left-4 top-3.5 text-gray-500" size={18} />
                        <input 
                          type="tel" 
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-nova-cyan transition-colors"
                          placeholder={t('auth.phone_placeholder')}
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-500 ml-1">{t('auth.phone_help')}</p>
                    </div>
                    <div id="recaptcha-container"></div>
                    
                    <button 
                      disabled={loading} 
                      type="submit" 
                      className={`w-full py-3 font-bold rounded-xl transition-all flex justify-center items-center gap-2 ${
                        isSignup 
                          ? 'bg-nova-magenta text-white hover:bg-nova-magenta/90 shadow-lg shadow-nova-magenta/20' 
                          : 'bg-white text-nova-bg hover:bg-gray-200'
                      }`}
                    >
                      {loading ? t('auth.sending') : t('auth.send_code')}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="text-center mb-4">
                      <p className="text-sm text-gray-300">
                        {t('auth.code_sent_to')} {phoneNumber}
                      </p>
                      <button type="button" onClick={() => setStep('input')} className="text-xs text-nova-cyan hover:underline">
                        {t('auth.change_number')}
                      </button>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500 font-mono uppercase ml-1">{t('auth.code_label')}</label>
                      <input 
                        type="text" 
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 text-center text-2xl tracking-widest text-white focus:outline-none focus:border-nova-cyan transition-colors"
                        placeholder="000000"
                        maxLength={6}
                        required
                      />
                    </div>
                    <button disabled={loading} type="submit" className="w-full py-3 bg-nova-cyan text-white font-bold rounded-xl hover:bg-nova-cyan/90 transition-colors flex justify-center items-center gap-2">
                      {loading ? t('auth.verifying') : <><Check size={18} /> {t('auth.verify')}</>}
                    </button>
                  </form>
                )}
              </div>
            )}

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-500">
                {isSignup ? t('auth.already_account') : t('auth.no_account')}
              </span>
              <button 
                onClick={toggleMode} 
                className="ml-2 font-bold text-nova-cyan hover:underline transition-colors"
              >
                {isSignup ? t('auth.login_action') : t('auth.register_free')}
              </button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-nova-bg px-2 text-gray-500">{t('auth.or_continue')}</span></div>
            </div>

            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-3 group"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span className="group-hover:text-white transition-colors">Google</span>
            </button>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;