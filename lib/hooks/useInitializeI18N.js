import i18next from 'i18next'
import { useEffect, useState } from 'react'
import * as config from 'next-i18next.config'
import { useTranslation } from 'next-i18next'
import Cookies from 'js-cookie'

const I18N_COOKIE_KEY = 'next-i18next'
const I18N_LOCALSTORAGE_KEY = 'i18nextLng'

/**
 * Initialized the i18next instance with the config defined in next-i18next.config
 * @returns
 */
export const useInitializeI18N = () => {
  const { i18n } = useTranslation()
  const [isInitialized, setIsInitialized] = useState(false)
  useEffect(() => {
    const initializeI18N = async () => {
      const language =
        Cookies.get(I18N_COOKIE_KEY) || localStorage.getItem(I18N_LOCALSTORAGE_KEY) || 'en'
      // console.log(Cookies.get(I18N_COOKIE_KEY), localStorage.getItem(I18N_LOCALSTORAGE_KEY), language)
      await i18next.init(config)
      setIsInitialized(true)
      // console.log(i18next)
      // i18next.changeLanguage(language)
      // debugger
    }
    initializeI18N()
  }, [])
  return { isInitialized }
}
