import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const structure = {
  dirs: [
    'public/models',
    'public/locales',
    'src/assets',
    'src/components/ui',
    'src/components/layout',
    'src/components/3d',
    'src/components/feedback',
    'src/context',
    'src/hooks',
    'src/layouts',
    'src/pages/public',
    'src/pages/admin',
    'src/pages/dev',
    'src/pages/client',
    'src/services',
    'src/utils',
  ],
  files: [
    // Locales
    { path: 'public/locales/es.json', content: '{}' },
    { path: 'public/locales/en.json', content: '{}' },
    { path: 'public/locales/tr.json', content: '{}' },
    
    // Components
    { path: 'src/components/3d/HeroScene.jsx', content: '// Componente HeroScene' },
    { path: 'src/components/3d/ProjectCard3D.jsx', content: '// Componente ProjectCard3D' },
    
    // Context
    { path: 'src/context/AuthContext.jsx', content: '// Auth Context' },
    { path: 'src/context/CartContext.jsx', content: '// Cart Context' },
    { path: 'src/context/LangContext.jsx', content: '// Language Context' },
    
    // Hooks
    { path: 'src/hooks/useAuth.js', content: '// Hook useAuth' },
    { path: 'src/hooks/useFirestore.js', content: '// Hook useFirestore' },
    { path: 'src/hooks/useCurrency.js', content: '// Hook useCurrency' },
    
    // Layouts
    { path: 'src/layouts/PublicLayout.jsx', content: '// Layout Público' },
    { path: 'src/layouts/AdminLayout.jsx', content: '// Layout Administrador' },
    { path: 'src/layouts/PanelLayout.jsx', content: '// Layout Paneles (Dev/Client)' },
    
    // Pages - Public
    { path: 'src/pages/public/Home.jsx', content: '// Página Home' },
    { path: 'src/pages/public/Portfolio.jsx', content: '// Página Portfolio' },
    { path: 'src/pages/public/Services.jsx', content: '// Página Servicios' },
    
    // Pages - Admin
    { path: 'src/pages/admin/AdminDashboard.jsx', content: '// Dashboard Admin' },
    { path: 'src/pages/admin/ProjectManager.jsx', content: '// Gestión de Proyectos' },
    { path: 'src/pages/admin/ClientList.jsx', content: '// Lista de Clientes' },
    
    // Pages - Dev
    { path: 'src/pages/dev/DevDashboard.jsx', content: '// Dashboard Developer' },
    { path: 'src/pages/dev/TaskBoard.jsx', content: '// Tablero de Tareas' },
    
    // Pages - Client
    { path: 'src/pages/client/ClientDashboard.jsx', content: '// Dashboard Cliente' },
    { path: 'src/pages/client/Checkout.jsx', content: '// Página de Pago' },
    
    // Services
    { path: 'src/services/firebase.js', content: '// Configuración Firebase' },
    { path: 'src/services/stripe.js', content: '// Configuración Stripe' },
    { path: 'src/services/github.js', content: '// API GitHub' },
    
    // Utils
    { path: 'src/utils/constants.js', content: '// Constantes Globales' },
    { path: 'src/utils/helpers.js', content: '// Funciones de Ayuda' },
  ]
};

async function createStructure() {
  console.log('🚀 Iniciando creación de estructura NOVA...');

  // 1. Crear Directorios
  for (const dir of structure.dirs) {
    const fullPath = path.join(__dirname, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`✅ Directorio creado: ${dir}`);
    }
  }

  // 2. Crear Archivos
  for (const file of structure.files) {
    const fullPath = path.join(__dirname, file.path);
    if (!fs.existsSync(fullPath)) {
      fs.writeFileSync(fullPath, file.content);
      console.log(`📄 Archivo creado: ${file.path}`);
    } else {
      console.log(`⚠️  El archivo ya existe (saltado): ${file.path}`);
    }
  }

  console.log('✨ ¡Estructura completada con éxito!');
}

createStructure().catch(console.error);