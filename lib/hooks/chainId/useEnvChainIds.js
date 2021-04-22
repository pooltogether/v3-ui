import { useAppEnv } from 'lib/hooks/useAppEnv'
import { NETWORK } from 'lib/utils/networks'

const CHAIN_IDS_BY_MODE = Object.freeze({
  production: [NETWORK.mainnet, NETWORK.polygon],
  development: [NETWORK.rinkeby]
})

/**
 * Returns the list of chainIds relevant for the current app state
 * @returns
 */
export const useEnvChainIds = () => {
  const { appEnv } = useAppEnv()
  return CHAIN_IDS_BY_MODE[appEnv]
}
