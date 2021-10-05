import { useIsTestnets } from '@pooltogether/hooks'
import { NETWORK } from '@pooltogether/utilities'

/**
 * Returns the single chainId relevant for fetching chain data about the POOL token.
 */
export const usePoolTokenChainId = () => {
  const { isTestnets } = useIsTestnets()
  return isTestnets ? NETWORK.rinkeby : NETWORK.mainnet
}
