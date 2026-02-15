import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    lng: 'en', // Idioma por defecto
    debug: true,

    interpolation: {
      escapeValue: false, 
    },
    
    backend: {
      // CORRECCIÓN CRÍTICA:
      // Usamos import.meta.env.BASE_URL para que sepa si está en "/" (Local) 
      // o en "/NOVA-Web-Agency/" (GitHub Pages)
      loadPath: `${import.meta.env.BASE_URL}locales/{{lng}}.json`,
    }
  });

export default i18n;