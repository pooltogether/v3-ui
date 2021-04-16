import { getChainIdByAlias } from 'lib/utils/networks'

export function networkNameToChainId(networkName) {
  if (networkName === 'ethereum mainnet') {
    return 1
  }

  return getChainIdByAlias(networkName)
}
