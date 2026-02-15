import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Navbar from '../../components/layout/Navbar'; // <--- Importamos la Navbar
import HeroScene from '../../components/3d/HeroScene';
import PortfolioSection from '../../components/public/PortfolioSection';
import AboutSection from '../../components/public/AboutSection';
import PricingSection from '../../components/public/PricingSection';
import ContactSection from '../../components/public/ContactSection';
import Footer from '../../components/layout/Footer';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="relative w-full bg-nova-bg overflow-x-hidden">
      
      {/* === NAVBAR MODERNA (SIEMPRE VISIBLE) === */}
      <Navbar />

      {/* === SECCIÓN HERO === */}
      <div id="home" className="relative w-full h-screen flex items-center pt-20"> {/* Añadido id="home" */}
        
        {/* Capa de Texto */}
        <div className="relative z-10 container mx-auto px-6 lg:px-12 pointer-events-none">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[1px] w-8 bg-nova-cyan"></div>
                <span className="text-nova-cyan font-mono text-xs tracking-widest uppercase shadow-black drop-shadow-md">
                  {t('hero.badge')}
                </span>
              </div>

              <h2 className="font-display font-bold text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-white via-nova-cyan to-nova-primary mb-2 drop-shadow-lg tracking-wide">
                NOVA Web Agency
              </h2>

              <h1 className="font-display font-medium text-5xl lg:text-7xl leading-[1.1] text-white mb-8 drop-shadow-lg">
                {t('hero.title_line1')} <br />
                <span className="text-gray-400">
                  {t('hero.title_line2')}
                </span>
              </h1>

              <p className="text-gray-300 text-lg leading-relaxed max-w-md mb-10 font-light border-l border-gray-700 pl-6 bg-nova-bg/50 backdrop-blur-sm p-2 rounded-r-lg">
                {t('hero.subtitle')}
              </p>

              <div className="flex flex-wrap gap-6">
                <a href="#contact" className="group flex items-center gap-2 text-white border-b border-white pb-1 hover:text-nova-cyan hover:border-nova-cyan transition-all duration-300 cursor-pointer pointer-events-auto">
                  <span className="text-lg font-medium">{t('hero.cta_primary')}</span>
                  <ArrowUpRight className="w-5 h-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </a>
              </div>
            </motion.div>

            <div className="hidden lg:block h-96"></div>
          </div>
        </div>

        {/* Capa 3D (Robot) */}
        <div className="absolute inset-0 z-30 pointer-events-none">
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-0 w-full px-6 lg:px-12 flex justify-between items-end text-gray-500 text-xs font-mono z-20 pointer-events-none">
          <div className="animate-bounce">
            <p>SCROLL TO EXPLORE ↓</p>
          </div>
          <div className="text-right">
            <p>BASED IN TURKEY • SPAIN • USA</p>
          </div>
        </div>
      </div>

      {/* === SECCIÓN ABOUT === */}
      <div id="about" className="relative z-20 pt-10"> {/* Añadido id="about" */}
        <AboutSection />
      </div>

      {/* === SECCIÓN PORTAFOLIO === */}
      <div id="portfolio" className="relative z-20 bg-nova-bg pt-10"> {/* Añadido id="portfolio" */}
        <PortfolioSection />
      </div>

      {/* === SECCIÓN DE SERVICIOS/PRECIOS === */}
      <div id="services" className="relative z-20 pt-10"> {/* Añadido id="services" */}
        <PricingSection />
      </div>

      {/* === SECCIÓN DE CONTACTO === */}
      <div id="contact" className="relative z-20 bg-nova-bg pt-10"> {/* Añadido id="contact" */}
        <ContactSection />
      </div>

      {/* === FOOTER === */}
      <div className="relative z-20">
        <Footer />
      </div>

    </div>
  );
};

export default Home;