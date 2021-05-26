const env = process.env.NODE_ENV || 'development'
const dev = env !== 'production'

const { initReactI18next } = require('react-i18next')
const Locize = require('i18next-locize-backend/cjs')
const LanguageDetector = require('i18next-browser-languagedetector')
const XHR = require('i18next-http-backend')

const supportedLocales = ['en', 'es', 'de', 'fr', 'it', 'ko', 'pt', 'tr', 'zh']

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: supportedLocales
  },
  debug: dev,
  // partialBundledLanguages: true,
  // fallbackLng: 'en',
  // supportedLngs: supportedLocales,
  // preload: supportedLocales,
  ns: ['common'],
  // defaultNS: 'common',
  saveMissing: dev,
  serializeConfig: false,

  use: [Locize, initReactI18next],

  // modules: {
  //   languageDetector: LanguageDetector
  // },

  // React config
  react: {
    // trigger a rerender when language is changed
    bindI18n: 'languageChanged',
    // we're NOT using suspsense to detect when the translations have loaded
    useSuspense: false
  },

  // Locize config
  backend: {
    projectId: process.env.NEXT_JS_LOCIZE_PROJECT_ID,
    apiKey: process.env.NEXT_JS_LOCIZE_DEV_API_KEY, // to not add the api-key in production, used for saveMissing feature
    referenceLng: 'en'
  },

  // LanguageDetector config
  detection: {
    // check if language is cached in cookies, if not check local storage
    order: ['querystring', 'cookie', 'localStorage', 'navigator', 'path'],

    // next-i18next by default searches for the 'next-i18next' cookie on server requests
    lookupCookie: 'next-i18next',
    lookupLocalStorage: 'i18nextLng',

    // cache the language in cookies and local storage
    caches: ['cookie', 'localStorage']
  }
}
