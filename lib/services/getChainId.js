import { nameToChainId } from 'lib/utils/nameToChainId'

export const getChainId = (walletContext) => {
  let chainId = walletContext._onboard.getState().appNetworkId

  if (!chainId) {
    chainId = nameToChainId(process.env.NEXT_JS_DEFAULT_ETHEREUM_NETWORK_NAME)
  }

  return chainId
}
