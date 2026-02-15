import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

// Normalizamos la URL base para asegurar que siempre termine en '/'
const baseUrl = import.meta.env.BASE_URL.endsWith('/') 
  ? import.meta.env.BASE_URL 
  : `${import.meta.env.BASE_URL}/`;

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    lng: 'en', 
    debug: true,

    interpolation: {
      escapeValue: false, 
    },
    
    backend: {
      // Ahora usamos la variable 'baseUrl' que garantizamos tiene el formato correcto
      loadPath: `${baseUrl}locales/{{lng}}.json`,
    }
  });

export default i18n;