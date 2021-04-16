import { getNetworkNameAliasByChainId } from 'lib/utils/networks'

export function chainIdToNetworkName(chainId) {
  if (chainId === 1) {
    return 'ethereum mainnet'
  } else if (chainId === 137) {
    return 'polygon'
  }

  return getNetworkNameAliasByChainId(chainId)
}
