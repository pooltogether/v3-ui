import { POOLTOGETHER_SUBGRAPHS } from 'lib/constants/subgraphUris'
import { useEnvironmentChainIds } from 'lib/hooks/chainId/useEnvironmentChainIds'

/**
 * Returns the subgraph versions keyed by chain ids of the current app environment
 * @returns
 */
export const useSubgraphVersions = () => {
  const chainIds = useEnvironmentChainIds()
  return chainIds.reduce((subgraphVersions, chainId) => {
    subgraphVersions[chainId] = Object.keys(POOLTOGETHER_SUBGRAPHS[chainId])
    return subgraphVersions
  }, {})
}
