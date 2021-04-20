import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { COOKIE_OPTIONS } from 'lib/constants'

const APP_ENVIRONMENT_KEY = '_app_env'

export const APP_ENVIRONMENT = Object.freeze({
  production: 'production',
  development: 'development'
})

/**
 * Used to manage what pools we want to display to the user
 * @returns string
 */
export const useAppEnvironment = () => {
  const [appEnvironment, setAppEnvironmentState] = useState(
    Cookies.get(APP_ENVIRONMENT_KEY) || APP_ENVIRONMENT.production
  )

  // On mount, if never set before, set in storage
  useEffect(() => {
    if (!Cookies.get(APP_ENVIRONMENT_KEY)) {
      Cookies.set(APP_ENVIRONMENT_KEY, appEnvironment, COOKIE_OPTIONS)
    }
  }, [])

  const setAppEnvironment = (appEnvironment) => {
    localStorage.setItem(APP_ENVIRONMENT_KEY, appEnvironment)
    setAppEnvironmentState(appEnvironment)
  }

  return { appEnvironment, setAppEnvironment }
}
