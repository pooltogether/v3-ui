import { networkNameToChainId } from 'lib/utils/networkNameToChainId'

export const getChainId = (walletContext) => {
  const { _onboard } = walletContext

  const networkName = process.env.NEXT_JS_DEFAULT_ETHEREUM_NETWORK_NAME
  let chainId = networkNameToChainId(networkName)
  
  let currentState = _onboard && _onboard.getState()
  if (currentState) {
    // appNetworkId may not be what we want here ...
    chainId = currentState.appNetworkId
  }

  return chainId
}
