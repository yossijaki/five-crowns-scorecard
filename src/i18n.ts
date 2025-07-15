import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Define translations inline for testing
const resources = {
  en: {
    translation: {
      homeScreen: {
        appTitle: "Five Crowns",
        newGame: "New Game",
        newGameShort: "New",
        games: "Games",
        recent: "Recent",
        all: "All"
      }
    }
  },
  es: {
    translation: {
      homeScreen: {
        appTitle: "Cinco Coronas",
        newGame: "Nueva Partida",
        newGameShort: "Nueva",
        games: "Partidas",
        recent: "Recientes",
        all: "Todas"
      }
    }
  },
  fr: {
    translation: {
      homeScreen: {
        appTitle: "Cinq Couronnes",
        newGame: "Nouvelle Partie",
        newGameShort: "Nouvelle",
        games: "Parties",
        recent: "Récentes",
        all: "Toutes"
      }
    }
  },
  de: {
    translation: {
      homeScreen: {
        appTitle: "Fünf Kronen",
        newGame: "Neues Spiel",
        newGameShort: "Neu",
        games: "Spiele",
        recent: "Kürzlich",
        all: "Alle"
      }
    }
  },
  it: {
    translation: {
      homeScreen: {
        appTitle: "Cinque Corone",
        newGame: "Nuova Partita",
        newGameShort: "Nuova",
        games: "Partite",
        recent: "Recenti",
        all: "Tutte"
      }
    }
  },
  pt: {
    translation: {
      homeScreen: {
        appTitle: "Cinco Coroas",
        newGame: "Novo Jogo",
        newGameShort: "Novo",
        games: "Jogos",
        recent: "Recentes",
        all: "Todos"
      }
    }
  },
  ja: {
    translation: {
      homeScreen: {
        appTitle: "ファイブクラウン",
        newGame: "新しいゲーム",
        newGameShort: "新規",
        games: "ゲーム",
        recent: "最近",
        all: "すべて"
      }
    }
  },
  zh: {
    translation: {
      homeScreen: {
        appTitle: "五冠王",
        newGame: "新游戏",
        newGameShort: "新建",
        games: "游戏",
        recent: "最近",
        all: "全部"
      }
    }
  },
  ru: {
    translation: {
      homeScreen: {
        appTitle: "Пять Корон",
        newGame: "Новая Игра",
        newGameShort: "Новая",
        games: "Игры",
        recent: "Недавние",
        all: "Все"
      }
    }
  },
  hi: {
    translation: {
      homeScreen: {
        appTitle: "पांच मुकुट",
        newGame: "नया खेल",
        newGameShort: "नया",
        games: "खेल",
        recent: "हाल ही में",
        all: "सभी"
      }
    }
  }
};

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

// Backend configuration for loading translation files
const backendOptions = {
  // Path to translation files (relative to public directory in Vite)
  loadPath: '/locales/{{lng}}/translation.json',

  // Allow cross origin requests
  crossDomain: false,

  // Request timeout
  requestOptions: {
    cache: 'default'
  }
};

// Initialize i18next
i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n instance to react-i18next
  .init({
    // Translation resources
    resources,

    // Supported languages
    supportedLngs: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'zh', 'ru', 'hi'],

    // Fallback language
    fallbackLng: 'es',

    // Default namespace
    defaultNS: 'translation',

    // Language detection options
    detection: languageDetectorOptions,
    
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
    missingKeyHandler: import.meta.env.DEV ? (lng, ns, key) => {
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
