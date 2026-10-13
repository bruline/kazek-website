import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './i18n/en.json'
import fr from './i18n/fr.json'

// Remember the visitor's language choice on this browser (if allowed).
function savedLanguage() {
  try {
    return localStorage.getItem('kazek-lang') || 'en'
  } catch {
    return 'en'
  }
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
  },
  lng: savedLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

i18n.on('languageChanged', (lng) => {
  try {
    localStorage.setItem('kazek-lang', lng)
  } catch {
    // private browsing: the choice simply is not remembered
  }
})

export default i18n
