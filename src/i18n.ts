import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Language detection configuration for mobile devices
const languageDetectorOptions = {
  // Order of language detection methods
  order: ['navigator', 'localStorage', 'htmlTag'],

  // Cache user language
  caches: ['localStorage'],

  // Don't cache on server side
  excludeCacheFor: ['cimode'],

  // Check for similar languages in supported languages
  checkForSimilarInSupportedLanguages: true,
};

// Initialize i18next
i18n
  .use(Backend) // Load translations from files
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n instance to react-i18next
  .init({
    // Supported languages
    supportedLngs: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'zh', 'ru', 'hi'],

    // Fallback language
    fallbackLng: 'es',

    // Default namespace
    defaultNS: 'translation',

    // Language detection options
    detection: languageDetectorOptions,

    // Backend configuration for loading translation files
    backend: {
      // Path to translation files (relative to public directory in Vite)
      loadPath: '/locales/{{lng}}/translation.json',

      // Allow cross origin requests
      crossDomain: false,

      // Request timeout
      requestOptions: {
        cache: 'default'
      }
    },
    
    // React i18next options
    react: {
      // Wait for translations to be loaded before rendering
      useSuspense: false,

      // Bind i18n instance to component
      bindI18n: 'languageChanged',

      // Bind store to component
      bindI18nStore: '',

      // Transform the key
      transEmptyNodeValue: '',

      // Transform the key for missing keys
      transSupportBasicHtmlNodes: true,

      // Transform the key for missing keys
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
    },
    
    // Interpolation options
    interpolation: {
      // React already escapes values
      escapeValue: false,
    },
    
    // Debug mode (enable for testing)
    debug: true,
    
    // Load translations synchronously
    initImmediate: false,
    
    // Namespace separator
    nsSeparator: ':',
    
    // Key separator
    keySeparator: '.',
    
    // Pluralization
    pluralSeparator: '_',
    
    // Context separator
    contextSeparator: '_',
    
    // Save missing translations
    saveMissing: import.meta.env.DEV,
    
    // Missing key handler
    missingKeyHandler: import.meta.env.DEV ? (lng, _ns, key) => {
      console.warn(`Missing translation key: ${key} for language: ${lng}`);
    } : undefined,
  })
  .then(() => {
    console.log('i18next initialized successfully');
    console.log('Current language:', i18n.language);
    console.log('Available languages:', i18n.languages);
  })
  .catch((error) => {
    console.error('i18next initialization failed:', error);
  });

export default i18n;
