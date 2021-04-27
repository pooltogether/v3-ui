import { POOLTOGETHER_SUBGRAPHS } from 'lib/constants/subgraphUris'
import { useEnvChainIds } from 'lib/hooks/chainId/useEnvChainIds'

/**
 * Returns the subgraph versions keyed by chain ids of the current app environment
 * @returns
 */
export const useSubgraphVersions = () => {
  const chainIds = useEnvChainIds()
  return chainIds.reduce((subgraphVersions, chainId) => {
    subgraphVersions[chainId] = Object.keys(POOLTOGETHER_SUBGRAPHS[chainId])
    return subgraphVersions
  }, {})
}
