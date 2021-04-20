import { useAppEnvironment } from 'lib/hooks/useAppEnvironment'
import { NETWORK } from 'lib/utils/networks'

const CHAIN_IDS_BY_MODE = Object.freeze({
  production: [NETWORK.mainnet, NETWORK.polygon],
  development: [NETWORK.rinkeby]
})

/**
 * Returns the list of chainIds relevant for the current app state
 * @returns
 */
export const useEnvironmentChainIds = () => {
  const { appEnvironment } = useAppEnvironment()
  return CHAIN_IDS_BY_MODE[appEnvironment]
}
