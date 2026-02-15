import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Check, Rocket, Zap, Star, ArrowRight } from 'lucide-react';

const PricingCard = ({ plan, t, index, isSelected, onSelect }) => {
  return (
    <motion.div
      onClick={onSelect}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2, duration: 0.5 }}
      // Lógica de estilos interactivos basados en el estado "isSelected"
      className={`relative p-8 rounded-3xl backdrop-blur-md flex flex-col h-full cursor-pointer transition-all duration-500 ease-out ${
        isSelected 
          ? 'bg-nova-card/80 border-2 border-nova-cyan shadow-[0_0_40px_rgba(6,182,212,0.25)] transform md:-translate-y-4 scale-105 z-10' 
          : 'bg-nova-card/20 border border-white/5 mt-0 hover:bg-nova-card/40 hover:border-white/20 opacity-50 hover:opacity-100 md:scale-95 scale-100'
      }`}
    >
      {/* Etiqueta de "Seleccionado" */}
      {isSelected && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-nova-cyan to-nova-primary text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-nova-cyan/20"
          >
            <Check size={14} className="text-white" /> {t('pricing.selected_badge', 'Seleccionado')}
          </motion.div>
        </div>
      )}

      {/* Cabecera del Plan */}
      <div className="mb-8">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors duration-500 ${
          isSelected ? 'bg-nova-primary/20 text-nova-cyan' : 'bg-white/5 text-gray-400'
        }`}>
          <plan.icon size={24} className={isSelected ? 'animate-pulse' : ''} />
        </div>
        <h3 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${isSelected ? 'text-white' : 'text-gray-400'}`}>
          {t(`pricing.plans.${plan.key}.name`)}
        </h3>
        <p className="text-gray-400 text-sm h-10">
          {t(`pricing.plans.${plan.key}.desc`)}
        </p>
      </div>

      {/* Precio (Por Cotización) */}
      <div className={`mb-8 pb-8 border-b transition-colors duration-500 ${isSelected ? 'border-nova-cyan/30' : 'border-white/10'}`}>
        <p className={`text-sm mb-2 uppercase tracking-widest font-mono transition-colors duration-300 ${isSelected ? 'text-nova-cyan' : 'text-gray-600'}`}>
          {t('pricing.investment')}
        </p>
        <div className="flex items-baseline gap-2">
          <span className={`text-3xl font-display font-bold transition-colors duration-300 ${isSelected ? 'text-white' : 'text-gray-300'}`}>
            {t('pricing.custom_quote')}
          </span>
        </div>
      </div>

      {/* Lista de Características */}
      <ul className="flex-grow space-y-4 mb-8">
        {[1, 2, 3, 4, 5].map((item) => {
          const feature = t(`pricing.plans.${plan.key}.features.${item}`);
          if (!feature || feature === `pricing.plans.${plan.key}.features.${item}`) return null;
          
          return (
            <li key={item} className="flex items-start gap-3">
              <div className={`mt-1 p-0.5 rounded-full transition-colors duration-300 ${isSelected ? 'bg-nova-cyan/20' : 'bg-white/5'}`}>
                <Check size={14} className={isSelected ? 'text-nova-cyan' : 'text-gray-600'} />
              </div>
              <span className={`text-sm leading-relaxed transition-colors duration-300 ${isSelected ? 'text-gray-200' : 'text-gray-500'}`}>
                {feature}
              </span>
            </li>
          );
        })}
      </ul>

      {/* Botón de Acción Dinámico */}
      <button 
        className={`w-full py-4 rounded-xl font-bold transition-all duration-300 flex justify-center items-center gap-2 group ${
          isSelected 
            ? 'bg-nova-primary text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:bg-nova-primary/90 hover:scale-105' 
            : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10 hover:text-white'
        }`}
        onClick={(e) => {
          if (!isSelected) {
            e.stopPropagation(); // Evita burbujeo doble
            onSelect();
          } else {
            // Acción final: Abrir modal de contacto o redirigir
            console.log("Iniciando cotización para:", plan.key);
          }
        }}
      >
        {isSelected ? t('pricing.cta') : t('pricing.select_plan', 'Seleccionar')}
        <ArrowRight size={18} className={`transition-transform duration-300 ${isSelected ? 'group-hover:translate-x-2' : ''}`} />
      </button>
    </motion.div>
  );
};

const PricingSection = () => {
  const { t } = useTranslation();
  
  // Estado para controlar qué tarjeta está seleccionada (Por defecto la central: "pro")
  const [selectedPlan, setSelectedPlan] = useState('pro');

  const plans = [
    { key: "basic", icon: Zap },
    { key: "pro", icon: Rocket },
    { key: "ecommerce", icon: Star }
  ];

  return (
    <section className="relative py-32 bg-nova-bg overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[500px] bg-nova-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Encabezado */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-nova-primary/10 border border-nova-primary/20 mb-6"
          >
            <span className="text-xs font-bold text-nova-cyan uppercase tracking-wider">
              {t('pricing.badge')}
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-bold text-white mb-6"
          >
            {t('pricing.title_line1')} <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-nova-cyan to-nova-primary">
              {t('pricing.title_highlight')}
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg"
          >
            {t('pricing.subtitle')}
          </motion.p>
        </div>

        {/* Grid Interactivo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard 
              key={plan.key} 
              plan={plan} 
              t={t} 
              index={index} 
              isSelected={selectedPlan === plan.key}
              onSelect={() => setSelectedPlan(plan.key)}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default PricingSection;