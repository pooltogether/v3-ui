import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { APP_ENVIRONMENTS, useIsTestnets } from '@pooltogether/hooks'
import { useQuery } from 'react-query'

const CHECKLY_LAMBDA_PATH = `/.netlify/functions/checklyCheckStatuses`

export const useChecklyStatus = () => {
  const { isTestnets } = useIsTestnets()
  return useQuery(
    [QUERY_KEYS.checklyCheckStatuses, isTestnets],
    () => getChecklyChecks(isTestnets),
    {
      refetchInterval: 60000
    }
  )
}

const getChecklyChecks = async (isTestnets) => {
  const appEnv = isTestnets ? APP_ENVIRONMENTS.testnets : APP_ENVIRONMENTS.mainnets

  try {
    const response = await fetch(CHECKLY_LAMBDA_PATH)
    const checks = await response.json()
    const hasErrors = checks
      .filter((check) => CHECKS[appEnv].includes(check.name))
      .reduce((anyErrors, check) => anyErrors || check.hasErrors, false)

    return {
      hasErrors,
      checks
    }
  } catch (e) {
    return {
      hasErrors: false,
      checks: []
    }
  }
}

const CHECKS = Object.freeze({
  [APP_ENVIRONMENTS.mainnets]: ['Mainnet', 'Polygon', 'LootBox'],
  [APP_ENVIRONMENTS.testnets]: ['Rinkeby', 'Mumbai']
})
