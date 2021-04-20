import { useEffect, useState } from 'react'

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
    localStorage.getItem(APP_ENVIRONMENT_KEY) || APP_ENVIRONMENT.production
  )

  // On mount, if never set before, set in storage
  useEffect(() => {
    if (!localStorage.getItem(APP_ENVIRONMENT_KEY)) {
      localStorage.setItem(APP_ENVIRONMENT_KEY, appEnvironment)
    }
  }, [])

  const setAppEnvironment = (appEnvironment) => {
    localStorage.setItem(APP_ENVIRONMENT_KEY, appEnvironment)
    setAppEnvironmentState(appEnvironment)
  }

  return { appEnvironment, setAppEnvironment }
}
