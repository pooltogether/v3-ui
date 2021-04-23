import { useEffect } from 'react'
import Cookies from 'js-cookie'
import { COOKIE_OPTIONS } from 'lib/constants'
import { atom, useAtom } from 'jotai'

const APP_ENVIRONMENT_KEY = '_app_env'

export const APP_ENVIRONMENT = Object.freeze({
  mainnets: 'mainnets',
  testnets: 'testnets'
})

const appEnvAtom = atom(Cookies.get(APP_ENVIRONMENT_KEY))

/**
 * Used to manage what pools we want to display to the user.
 * Determines the current environment based on a cookie & the users wallet.
 * Controlled by a toggle in settings. Toggle was chosen over watching a users
 * wallet for simplicity around all of the edge cases.
 * ex. a user loads /pools/rinkeby but with their wallet connected to BSC.
 * @returns string
 */
export const useAppEnv = () => {
  // let cookieEnv = Cookies.get(APP_ENVIRONMENT_KEY) || APP_ENVIRONMENT.mainnets
  // Since we changed the name, some people might have 'production' in their cookies
  // if (Cookies.get(APP_ENVIRONMENT_KEY) === 'production') cookieEnv = APP_ENVIRONMENT.mainnets

  const [appEnv, setAppEnvState] = useAtom(appEnvAtom)

  const setAppEnv = (appEnv) => {
    console.log('setAppEnv', appEnv)
    Cookies.set(APP_ENVIRONMENT_KEY, appEnv, COOKIE_OPTIONS)
    setAppEnvState(appEnv)
  }

  // On mount, if never set before, set in storage
  useEffect(() => {
    if (!appEnv || appEnv === 'production') {
      setAppEnv(APP_ENVIRONMENT.mainnets)
    }
  }, [])

  return { appEnv, setAppEnv }
}
