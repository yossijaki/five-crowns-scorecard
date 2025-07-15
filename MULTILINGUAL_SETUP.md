# Multilingual Support Implementation

## Overview
This document describes the multilingual support implementation for the Five Crowns Scorecard application using react-i18next.

## Features Implemented
- ✅ Automatic device language detection
- ✅ Support for 10 languages: English, Spanish, French, German, Italian, Portuguese, Japanese, Chinese, Russian, Hindi
- ✅ Fallback to Spanish if language detection fails
- ✅ HomeScreen component fully translated
- ✅ Scalable architecture for future expansion

## Supported Languages

| Language | Code | Status |
|----------|------|--------|
| English | en | ✅ Implemented |
| Spanish | es | ✅ Implemented (Default) |
| French | fr | ✅ Implemented |
| German | de | ✅ Implemented |
| Italian | it | ✅ Implemented |
| Portuguese | pt | ✅ Implemented |
| Japanese | ja | ✅ Implemented |
| Chinese | zh | ✅ Implemented |
| Russian | ru | ✅ Implemented |
| Hindi | hi | ✅ Implemented |

## Architecture

### Files Structure
```
src/
├── i18n.ts                 # i18next configuration
├── main.tsx                # i18n initialization
└── components/
    └── HomeScreen.tsx      # Translated component
```

### Configuration
- **Language Detection**: Uses browser navigator language (system language on mobile)
- **Fallback Language**: Spanish (es)
- **Storage**: localStorage for language persistence
- **Loading**: Inline resources for optimal performance

## Usage in Components

### Basic Usage
```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('homeScreen.appTitle')}</h1>
      <button>{t('homeScreen.newGame')}</button>
    </div>
  );
}
```

### With Language Switching
```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t, i18n } = useTranslation();
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  
  return (
    <div>
      <h1>{t('homeScreen.appTitle')}</h1>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('es')}>Español</button>
    </div>
  );
}
```

## Translation Keys

### HomeScreen Keys
- `homeScreen.appTitle` - Application title
- `homeScreen.newGame` - New game button (full text)
- `homeScreen.newGameShort` - New game button (compact text)
- `homeScreen.games` - Games section title
- `homeScreen.recent` - Recent tab
- `homeScreen.all` - All tab

## Adding New Languages

1. Add translations to the `resources` object in `src/i18n.ts`
2. Add the language code to the `supportedLngs` array
3. Test the new language

Example:
```typescript
// In src/i18n.ts
const resources = {
  // ... existing languages
  nl: {
    translation: {
      homeScreen: {
        appTitle: "Vijf Kronen",
        newGame: "Nieuw Spel",
        newGameShort: "Nieuw",
        games: "Spellen",
        recent: "Recent",
        all: "Alle"
      }
    }
  }
};

// Update supportedLngs
supportedLngs: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'zh', 'ru', 'hi', 'nl'],
```

## Adding New Translation Keys

1. Add the key to all language objects in `src/i18n.ts`
2. Use the key in your component with `t('your.new.key')`

## Mobile Device Language Detection

The system automatically detects the device's system language using:
- `navigator.language` (primary)
- `localStorage` (cached preference)
- `htmlTag` (HTML lang attribute)

## Future Enhancements

### Planned Features
- [ ] Manual language selector in settings
- [ ] Additional components translation
- [ ] Pluralization support
- [ ] Date/time localization
- [ ] Number formatting

### Implementation Notes
- The current implementation uses inline resources for optimal performance
- Language detection prioritizes system language for mobile devices
- All translations are loaded at startup to avoid loading delays
- The architecture supports easy expansion to new components and languages

## Testing

To test different languages:
1. Change your browser/device language
2. Refresh the application
3. The app should automatically display in the detected language
4. If the language is not supported, it will fallback to Spanish

## Performance Considerations

- All translations are bundled with the app for instant loading
- No network requests for translation files
- Minimal bundle size impact due to small translation objects
- Language switching is instantaneous
