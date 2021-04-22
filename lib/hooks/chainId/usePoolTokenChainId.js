import { APP_ENVIRONMENT, useAppEnv } from 'lib/hooks/useAppEnv'
import { NETWORK } from 'lib/utils/networks'

/**
 * Returns the single chainId relevant for fetching chain data about the POOL token.
 */
export const usePoolTokenChainId = () => {
  const { appEnv } = useAppEnv()
  return appEnv === APP_ENVIRONMENT.production ? NETWORK.mainnet : NETWORK.rinkeby
}
