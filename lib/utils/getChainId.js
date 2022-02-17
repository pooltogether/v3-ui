import { networkNameToChainId } from 'lib/utils/networkNameToChainId'

export const getChainId = (currentState) => {
  let chainId = networkNameToChainId('homestead')

  if (currentState && currentState.appNetworkId) {
    // appNetworkId may not be what we want here ...
    chainId = currentState.appNetworkId
  }

  return chainId
}
