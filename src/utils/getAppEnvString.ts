import { APP_ENVIRONMENTS, getStoredIsTestnetsCookie } from '@pooltogether/hooks'

export const getAppEnvString = () => {
  const isTestnets = getStoredIsTestnetsCookie()
  return isTestnets ? APP_ENVIRONMENTS.testnets : APP_ENVIRONMENTS.mainnets
}
