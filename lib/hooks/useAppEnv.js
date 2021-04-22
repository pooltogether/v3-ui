import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { COOKIE_OPTIONS } from 'lib/constants'

const APP_ENVIRONMENT_KEY = '_app_env'

export const APP_ENVIRONMENT = Object.freeze({
  production: 'production',
  development: 'development'
})

/**
 * Used to manage what pools we want to display to the user.
 * Determines the current environment based on a cookie & the users wallet.
 * Watches the wallet for any changes between test & production networks.
 * @returns string
 */
export const useAppEnv = () => {
  const [appEnv, setappEnvState] = useState(
    Cookies.get(APP_ENVIRONMENT_KEY) || APP_ENVIRONMENT.production
  )

  // On mount, if never set before, set in storage
  useEffect(() => {
    if (!Cookies.get(APP_ENVIRONMENT_KEY)) {
      Cookies.set(APP_ENVIRONMENT_KEY, appEnv, COOKIE_OPTIONS)
    }
  }, [])

  const setappEnv = (appEnv) => {
    localStorage.setItem(APP_ENVIRONMENT_KEY, appEnv)
    setappEnvState(appEnv)
  }

  return { appEnv, setappEnv }
}
