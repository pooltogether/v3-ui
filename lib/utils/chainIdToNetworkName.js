import { getNetworkNameAliasByChainId } from 'lib/utils/networks'

export function chainIdToNetworkName(chainId) {
  if (chainId === 137) {
    return 'polygon'
  }

  return getNetworkNameAliasByChainId(chainId)
}
