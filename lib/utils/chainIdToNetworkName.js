import { getNetworkNameAliasByChainId } from 'lib/utils/networks'

export function chainIdToNetworkName(chainId) {
  if (chainId === 137) {
    return 'polygon'
  }
  if (chainId === 43114) {
    return 'avalanche'
  }

  return getNetworkNameAliasByChainId(chainId)
}
