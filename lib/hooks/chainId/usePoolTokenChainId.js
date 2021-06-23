import { APP_ENVIRONMENT, useAppEnv } from '@pooltogether/hooks'
import { NETWORK } from '@pooltogether/utilities'

/**
 * Returns the single chainId relevant for fetching chain data about the POOL token.
 */
export const usePoolTokenChainId = () => {
  const { appEnv } = useAppEnv()
  return appEnv === APP_ENVIRONMENT.mainnets ? NETWORK.mainnet : NETWORK.rinkeby
}
