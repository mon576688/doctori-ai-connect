import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enCommon from '../locales/en/common.json';
import enHome from '../locales/en/home.json';
import bnCommon from '../locales/bn/common.json';
import bnHome from '../locales/bn/home.json';
import esCommon from '../locales/es/common.json';
import esHome from '../locales/es/home.json';
import frCommon from '../locales/fr/common.json';
import frHome from '../locales/fr/home.json';
import arCommon from '../locales/ar/common.json';
import arHome from '../locales/ar/home.json';

const resources = {
  en: {
    common: enCommon,
    home: enHome,
  },
  bn: {
    common: bnCommon,
    home: bnHome,
  },
  es: {
    common: esCommon,
    home: esHome,
  },
  fr: {
    common: frCommon,
    home: frHome,
  },
  ar: {
    common: arCommon,
    home: arHome,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'home'],
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    
    interpolation: {
      escapeValue: false, // React already escapes
    },
    
    react: {
      useSuspense: false,
    },
  });

// RTL languages
const rtlLanguages = ['ar'];

// Function to update document direction
export const updateDocumentDirection = (language: string) => {
  const dir = rtlLanguages.includes(language) ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = language;
};

// Listen for language changes
i18n.on('languageChanged', (lng) => {
  updateDocumentDirection(lng);
});

// Set initial direction
updateDocumentDirection(i18n.language || 'en');

export default i18n;
