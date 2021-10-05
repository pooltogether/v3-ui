import { useIsTestnets } from '@pooltogether/hooks'
import { NETWORK } from '@pooltogether/utilities'

export const CHAIN_IDS_BY_APP_ENV = Object.freeze({
  mainnets: [NETWORK.mainnet, NETWORK.polygon, NETWORK.bsc, NETWORK.celo],
  testnets: [NETWORK.rinkeby]
})

/**
 * Returns the list of chainIds relevant for the current app state
 * @returns
 */
export const useEnvChainIds = () => {
  const { isTestnets } = useIsTestnets()
  return isTestnets ? CHAIN_IDS_BY_APP_ENV['testnets'] : CHAIN_IDS_BY_APP_ENV['mainnets']
}
