import { getChainIdByAlias } from 'lib/utils/networks'

export function networkNameToChainId(networkName) {
  return getChainIdByAlias(networkName)
}
