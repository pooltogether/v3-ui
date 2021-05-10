import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { APP_ENVIRONMENT, useAppEnv } from 'lib/hooks/useAppEnv'
import { useQuery } from 'react-query'

const CHECKLY_LAMBDA_PATH = `/.netlify/functions/checklyCheckStatuses`

export const useChecklyStatus = () => {
  const { appEnv } = useAppEnv()
  return useQuery([QUERY_KEYS.checklyCheckStatuses, appEnv], () => getChecklyChecks(appEnv), {
    refetchInterval: 60000
  })
}

const getChecklyChecks = async (appEnv) => {
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
  [APP_ENVIRONMENT.mainnets]: ['Mainnet', 'Polygon', 'LootBox'],
  [APP_ENVIRONMENT.testnets]: ['Rinkeby', 'Mumbai']
})
