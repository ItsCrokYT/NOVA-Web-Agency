import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Code2 } from 'lucide-react';

const projects = [
  {
    id: 1,
    key: "ecommerce", 
    tags: ["React", "Stripe", "Node.js"],
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=1000&auto=format&fit=crop", 
    link: "https://brewmotioncofee.netlify.app/",
    repo: "#"
  },
  {
    id: 2,
    key: "dashboard",
    tags: ["React", "Firebase", "Tailwind"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
    link: "https://itscrokyt.github.io/JUSTICE/",
    repo: "#"
  },
  {
    id: 3,
    key: "realestate",
    tags: ["Next.js", "MongoDB", "Framer"],
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop",
    link: "https://zenith-studio-web.netlify.app/",
    repo: "#"
  },
  {
    id: 4,
    key: "saas",
    tags: ["React", "TypeScript", "Vite"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop",
    link: "#",
    repo: "#"
  },
  {
    id: 5,
    key: "healthcare",
    tags: ["React", "Redux", "Material UI"],
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1000&auto=format&fit=crop",
    link: "#",
    repo: "#"
  },
  {
    id: 6,
    key: "nft",
    tags: ["Web3", "React", "Solidity"],
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop",
    link: "#",
    repo: "#"
  }
];

const ProjectCard = ({ project, t }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative rounded-2xl overflow-hidden bg-nova-card border border-white/5 hover:border-nova-primary/50 transition-all duration-300"
    >
      {/* Imagen del Proyecto */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-nova-card to-transparent z-10 opacity-60" />
        <img 
          src={project.image} 
          alt={t(`portfolio.projects.${project.key}.title`)} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Botones Flotantes (Solo visibles en hover) */}
        <div className="absolute inset-0 z-20 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm bg-black/40">
          <a href={project.link} className="p-3 bg-nova-primary rounded-full text-white hover:bg-white hover:text-nova-primary transition-colors">
            <ExternalLink size={20} />
          </a>
          <a href={project.repo} className="p-3 bg-nova-card border border-white/20 rounded-full text-white hover:bg-white hover:text-black transition-colors">
            <Github size={20} />
          </a>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6 relative z-10">
        <div className="flex gap-2 mb-3 flex-wrap">
          {project.tags.map((tag, i) => (
            <span key={i} className="text-xs font-mono px-2 py-1 rounded bg-nova-primary/10 text-nova-cyan border border-nova-primary/20">
              {tag}
            </span>
          ))}
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-nova-primary transition-colors">
          {t(`portfolio.projects.${project.key}.title`)}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          {t(`portfolio.projects.${project.key}.desc`)}
        </p>
      </div>
    </motion.div>
  );
};

const PortfolioSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative py-24 bg-nova-bg">
      {/* Fondo Decorativo Sutil */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-nova-primary/30 to-transparent"></div>
      
      <div className="container mx-auto px-6 lg:px-12">
        {/* Encabezado de Sección */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nova-primary/10 border border-nova-primary/20 mb-4"
          >
            <Code2 size={16} className="text-nova-primary" />
            <span className="text-xs font-bold text-nova-primary uppercase tracking-wider">
              {t('portfolio.badge')}
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-bold text-white mb-4"
          >
            {t('portfolio.title')}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            {t('portfolio.subtitle')}
          </motion.p>
        </div>

        {/* Grid de Proyectos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;