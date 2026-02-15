import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, ChevronDown, User } from 'lucide-react';
import logoUrl from '../../assets/nova-logo.png';
import LoginModal from '../auth/LoginModal';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { key: 'home', href: '#home' },
    { key: 'about', href: '#about' },
    { key: 'portfolio', href: '#portfolio' },
    { key: 'services', href: '#services' },
    { key: 'contact', href: '#contact' },
  ];

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'tr', label: 'Türkçe' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setIsLangMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleClientAreaClick = () => {
    if (currentUser) {
      navigate('/client');
    } else {
      setIsLoginOpen(true);
    }
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-nova-bg/70 backdrop-blur-lg border-b border-white/10 shadow-lg py-4' 
            : 'bg-transparent border-b border-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
          
          <a href="#home" className="flex items-center gap-3 z-50 group">
            <div className="relative flex items-center justify-center">
              <img 
                src={logoUrl} 
                alt="Logótipo NOVA" 
                className="h-8 md:h-7 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span className="hidden text-3xl text-white font-display font-bold tracking-widest">
                NOVA
              </span>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.key}>
                  <a 
                    href={link.href} 
                    className="text-sm font-medium text-gray-300 hover:text-nova-cyan transition-colors"
                  >
                    {t(`nav.${link.key}`)}
                  </a>
                </li>
              ))}
            </ul>

            <div className="relative">
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-full border border-white/10"
              >
                <Globe size={16} className="text-nova-cyan" />
                <span className="uppercase">{i18n.language.split('-')[0]}</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isLangMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-32 bg-nova-card border border-white/10 rounded-xl shadow-xl overflow-hidden backdrop-blur-xl"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-white/10 ${
                          i18n.language.startsWith(lang.code) ? 'text-nova-cyan bg-white/5' : 'text-gray-300'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* BOTÓN ÁREA CLIENTE / LOGIN (TRADUCIDO) */}
            <button 
              onClick={handleClientAreaClick}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/10 transition-colors"
            >
              <User size={16} className="text-nova-cyan" />
              {currentUser ? t('nav.dashboard') : t('nav.client_area')}
            </button>

          </nav>

          <button 
            className="md:hidden text-white z-50 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: '100vh' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden fixed inset-0 top-0 pt-24 bg-nova-bg/95 backdrop-blur-2xl z-40 flex flex-col items-center px-6"
            >
              <ul className="flex flex-col items-center gap-6 w-full mb-10">
                {navLinks.map((link) => (
                  <li key={link.key} className="w-full text-center border-b border-white/5 pb-4">
                    <a 
                      href={link.href} 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-2xl font-display font-medium text-white hover:text-nova-cyan transition-colors"
                    >
                      {t(`nav.${link.key}`)}
                    </a>
                  </li>
                ))}
                
                {/* Botón Login Móvil (TRADUCIDO) */}
                <li className="w-full text-center pt-4">
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleClientAreaClick();
                    }}
                    className="text-xl font-bold text-nova-cyan flex items-center justify-center gap-2 mx-auto"
                  >
                    <User size={24} />
                    {currentUser ? t('nav.go_to_dashboard') : t('nav.client_area')}
                  </button>
                </li>
              </ul>

              <div className="flex gap-4 mb-10">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`px-4 py-2 rounded-full border text-sm font-medium ${
                      i18n.language.startsWith(lang.code) 
                        ? 'border-nova-cyan text-nova-cyan bg-nova-cyan/10' 
                        : 'border-white/20 text-gray-400'
                  }`}
                  >
                    {lang.code.toUpperCase()}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};

export default Navbar;