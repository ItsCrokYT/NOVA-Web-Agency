import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Mail, MapPin, Send, MessageSquare, Linkedin, Twitter, Github } from 'lucide-react';

const ContactSection = () => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // Simulación de envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setTimeout(() => setIsSent(false), 3000); // Resetea después de 3 seg
    }, 1500);
  };

  return (
    <section className="relative py-32 bg-nova-bg overflow-hidden">
      {/* Luces de fondo decorativas */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-nova-magenta/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-nova-cyan/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* === COLUMNA IZQUIERDA: Textos y Datos de Contacto === */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[1px] w-12 bg-nova-cyan"></div>
              <span className="text-nova-cyan font-mono text-sm tracking-widest uppercase">
                {t('contact.badge')}
              </span>
            </div>

            <h2 className="text-5xl md:text-7xl font-display font-medium text-white leading-[1.1] mb-8">
              {t('contact.title_line1')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-nova-cyan to-nova-primary">
                {t('contact.title_highlight')}
              </span>
            </h2>

            <p className="text-gray-400 text-lg leading-relaxed mb-12 max-w-md">
              {t('contact.subtitle')}
            </p>

            {/* Tarjetas de Información Rápida */}
            <div className="space-y-6 mb-12">
              <div className="flex items-center gap-4 group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-nova-cyan/50 group-hover:bg-nova-cyan/10 transition-all duration-300">
                  <Mail className="text-nova-cyan" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-mono mb-1">EMAIL</p>
                  <p className="text-white font-medium text-lg">hello@nova.agency</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-nova-magenta/50 group-hover:bg-nova-magenta/10 transition-all duration-300">
                  <MapPin className="text-nova-magenta" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-mono mb-1">{t('contact.location_label')}</p>
                  <p className="text-white font-medium text-lg">Remote (TR, ES, US)</p>
                </div>
              </div>
            </div>

            {/* Redes Sociales */}
            <div className="flex gap-4">
              <a href="#" className="p-3 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-nova-cyan hover:bg-nova-cyan/20 transition-all duration-300">
                <Linkedin size={20} />
              </a>
              <a href="#" className="p-3 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-nova-cyan hover:bg-nova-cyan/20 transition-all duration-300">
                <Twitter size={20} />
              </a>
              <a href="#" className="p-3 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-nova-cyan hover:bg-nova-cyan/20 transition-all duration-300">
                <Github size={20} />
              </a>
            </div>
          </motion.div>

          {/* === COLUMNA DERECHA: Formulario Glassmorphism === */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-nova-card/30 border border-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 relative overflow-hidden">
              {/* Brillo interno del formulario */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-nova-cyan to-transparent opacity-50"></div>

              <div className="flex items-center gap-3 mb-8">
                <MessageSquare className="text-nova-primary" />
                <h3 className="text-2xl font-bold text-white">{t('contact.form_title')}</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Inputs de 2 columnas en Desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-gray-400 uppercase tracking-wider pl-1">{t('contact.form.name')}</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-nova-cyan focus:bg-white/10 transition-all duration-300"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-gray-400 uppercase tracking-wider pl-1">{t('contact.form.email')}</label>
                    <input 
                      type="email" 
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-nova-cyan focus:bg-white/10 transition-all duration-300"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono text-gray-400 uppercase tracking-wider pl-1">{t('contact.form.service')}</label>
                  <select 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-nova-cyan focus:bg-white/10 transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-nova-card text-gray-400">{t('contact.form.service_placeholder')}</option>
                    <option value="landing" className="bg-nova-card">Landing Page</option>
                    <option value="corporate" className="bg-nova-card">Corporate Site</option>
                    <option value="ecommerce" className="bg-nova-card">E-Commerce / Web App</option>
                    <option value="other" className="bg-nova-card">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono text-gray-400 uppercase tracking-wider pl-1">{t('contact.form.message')}</label>
                  <textarea 
                    rows="4"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-nova-cyan focus:bg-white/10 transition-all duration-300 resize-none"
                    placeholder={t('contact.form.message_placeholder')}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting || isSent}
                  className={`w-full py-4 rounded-xl font-bold transition-all duration-300 flex justify-center items-center gap-2 group overflow-hidden relative ${
                    isSent 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                      : 'bg-white text-nova-bg hover:bg-nova-cyan hover:text-white shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-nova-bg border-t-transparent rounded-full animate-spin"></div>
                      {t('contact.form.sending')}
                    </span>
                  ) : isSent ? (
                    <span className="flex items-center gap-2">
                      <Check size={18} /> {t('contact.form.sent')}
                    </span>
                  ) : (
                    <>
                      <span className="relative z-10">{t('contact.form.send')}</span>
                      <Send size={18} className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;