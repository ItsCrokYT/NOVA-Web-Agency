import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowUpRight, Github, Twitter, Linkedin, Mail, ArrowUp } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-nova-bg border-t border-white/5 overflow-hidden pt-20 pb-10">
      
      {/* Texto masivo de fondo (Efecto marca de agua) */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none z-0 select-none">
        <h1 className="text-[15vw] font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white/[0.03] to-transparent leading-none">
          NOVA
        </h1>
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        {/* === PARTE SUPERIOR: Newsletter y CTA === */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 pb-20 border-b border-white/10">
          <div>
            <h3 className="text-3xl font-display font-bold text-white mb-4">
              {t('footer.newsletter.title')}
            </h3>
            <p className="text-gray-400 max-w-md">
              {t('footer.newsletter.desc')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-start lg:justify-end">
            <div className="relative w-full sm:w-auto">
              <input 
                type="email" 
                placeholder={t('footer.newsletter.placeholder')} 
                className="w-full sm:w-80 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-nova-cyan focus:bg-white/10 transition-all duration-300"
              />
            </div>
            <button className="px-6 py-3 bg-white text-nova-bg font-bold rounded-xl hover:bg-nova-cyan hover:text-white transition-colors duration-300 w-full sm:w-auto">
              {t('footer.newsletter.button')}
            </button>
          </div>
        </div>

        {/* === PARTE CENTRAL: Enlaces y Marca === */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          
          {/* Marca */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-nova-cyan to-nova-primary"></div>
              <span className="text-xl text-white font-display font-bold tracking-widest">NOVA</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              {t('footer.brand_desc')}
            </p>
            <a href="mailto:hello@nova.agency" className="text-white hover:text-nova-cyan transition-colors flex items-center gap-2 group">
              <Mail size={16} className="text-gray-400 group-hover:text-nova-cyan transition-colors" />
              hello@nova.agency
            </a>
          </div>

          {/* Links: Empresa */}
          <div>
            <h4 className="text-white font-bold mb-6">{t('footer.links.company.title')}</h4>
            <ul className="space-y-4">
              {['home', 'about', 'portfolio', 'services'].map((item) => (
                <li key={item}>
                  <a href={`#${item}`} className="text-gray-500 hover:text-nova-cyan transition-colors text-sm flex items-center gap-1 group">
                    {t(`nav.${item}`)}
                    <ArrowUpRight size={14} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links: Legal */}
          <div>
            <h4 className="text-white font-bold mb-6">{t('footer.links.legal.title')}</h4>
            <ul className="space-y-4">
              {['privacy', 'terms', 'cookies'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">
                    {t(`footer.links.legal.${item}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Redes Sociales */}
          <div>
            <h4 className="text-white font-bold mb-6">{t('footer.links.socials.title')}</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-nova-cyan hover:text-white transition-all duration-300">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-nova-primary hover:text-white transition-all duration-300">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all duration-300">
                <Github size={18} />
              </a>
            </div>
          </div>

        </div>

        {/* === PARTE INFERIOR: Copyright y Botón Subir === */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 gap-4">
          <p className="text-gray-600 text-sm font-mono text-center md:text-left">
            © {new Date().getFullYear()} NOVA Web Agency. {t('footer.rights')}
          </p>
          
          <button 
            onClick={scrollToTop}
            className="group flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm font-mono"
          >
            {t('footer.back_to_top')}
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-nova-cyan group-hover:text-white transition-all duration-300">
              <ArrowUp size={14} />
            </div>
          </button>
        </div>

      </div>
    </footer>
  );
};

export default Footer;