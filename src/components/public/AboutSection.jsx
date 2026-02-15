import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Code2, Cpu, Wind, Box, ArrowRight } from 'lucide-react';

const AboutSection = () => {
  const { t } = useTranslation();
  const [hoveredService, setHoveredService] = useState(null);

  // Configuraciones de la grilla de tecnologías
  const techStack = [
    {
      key: "three",
      icon: Box,
      color: "text-orange-400",
      bgHover: "hover:bg-orange-500/10",
      borderHover: "hover:border-orange-500/30",
      span: "col-span-2 sm:col-span-2", // Destacado grande
    },
    {
      key: "react",
      icon: Code2,
      color: "text-cyan-400",
      bgHover: "hover:bg-cyan-500/10",
      borderHover: "hover:border-cyan-500/30",
      span: "col-span-2 sm:col-span-1",
    },
    {
      key: "tailwind",
      icon: Wind,
      color: "text-teal-400",
      bgHover: "hover:bg-teal-500/10",
      borderHover: "hover:border-teal-500/30",
      span: "col-span-2 sm:col-span-1",
    },
    {
      key: "node",
      icon: Cpu,
      color: "text-green-400",
      bgHover: "hover:bg-green-500/10",
      borderHover: "hover:border-green-500/30",
      span: "col-span-2", // Ancho completo abajo
    }
  ];

  return (
    <section className="relative py-32 bg-nova-bg overflow-hidden">
      {/* Luces de fondo sutiles para profundidad */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-nova-primary/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-nova-cyan/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        {/* === ENCABEZADO MINIMALISTA === */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="h-px w-12 bg-nova-cyan"></div>
            <span className="text-nova-cyan font-mono text-sm tracking-widest uppercase">
              {t('about.badge')}
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-medium text-white leading-[1.1] max-w-4xl tracking-tight"
          >
            {t('about.title_line1')} <br />
            <span className="text-gray-500 italic font-light">
              {t('about.title_highlight')}
            </span>
          </motion.h2>
        </div>

        {/* === BENTO GRID ASIMÉTRICO === */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* COLUMNA IZQUIERDA: Descripción y Servicios (Ocupa 7/12) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-7 flex flex-col gap-6"
          >
            {/* Tarjeta de Descripción */}
            <div className="p-8 md:p-10 rounded-3xl bg-nova-card/40 border border-white/5 backdrop-blur-md">
              <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed">
                {t('about.description')}
              </p>
            </div>

            {/* Tarjeta de Servicios (Interactiva) */}
            <div className="p-8 md:p-10 rounded-3xl bg-nova-card/20 border border-white/5 backdrop-blur-md flex-grow">
              <h3 className="text-sm font-mono text-nova-magenta mb-8 uppercase tracking-widest">
                {t('about.services.title')}
              </h3>
              
              <div className="flex flex-col">
                {[1, 2, 3, 4].map((item) => (
                  <div 
                    key={item}
                    onMouseEnter={() => setHoveredService(item)}
                    onMouseLeave={() => setHoveredService(null)}
                    className="group flex justify-between items-center py-6 border-b border-white/10 hover:border-nova-cyan transition-colors duration-500 cursor-pointer"
                  >
                    <span className={`text-2xl md:text-3xl font-display transition-all duration-500 ${
                      hoveredService === item 
                        ? 'text-white translate-x-4' 
                        : hoveredService === null 
                          ? 'text-gray-300' 
                          : 'text-gray-700'
                    }`}>
                      {t(`about.services.list.${item}`)}
                    </span>
                    <ArrowRight className={`text-nova-cyan transition-all duration-500 ${
                      hoveredService === item ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                    }`} />
                  </div>
                ))}
              </div>
              
              <p className="mt-8 text-gray-500 text-sm">
                {t('about.services.desc')}
              </p>
            </div>
          </motion.div>

          {/* COLUMNA DERECHA: El Stack Tecnológico (Ocupa 5/12) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-5 grid grid-cols-2 gap-4"
          >
            {techStack.map((tech, idx) => {
              const Icon = tech.icon;
              return (
                <div 
                  key={tech.key} 
                  className={`${tech.span} p-8 rounded-3xl bg-nova-card/40 border border-white/5 backdrop-blur-md transition-all duration-500 group ${tech.bgHover} ${tech.borderHover} flex flex-col justify-between min-h-[200px]`}
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className={`p-3 rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors ${tech.color}`}>
                      <Icon size={28} strokeWidth={1.5} />
                    </div>
                    <span className="text-xs font-mono text-gray-600 group-hover:text-gray-400 transition-colors">
                      0{idx + 1}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
                      {t(`about.tech.${tech.key}.title`)}
                    </h3>
                    <p className="text-sm text-gray-400 font-light leading-relaxed">
                      {t(`about.tech.${tech.key}.desc`)}
                    </p>
                  </div>
                </div>
              );
            })}
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;