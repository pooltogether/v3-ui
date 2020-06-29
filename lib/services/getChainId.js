import { nameToChainId } from 'lib/utils/nameToChainId'

export const getChainId = (walletContext) => {
  let chainId = walletContext._onboard.getState().appNetworkId
  console.log(walletContext._onboard.getState())

  if (!chainId) {
    console.log({ 'in': 'here' })
    chainId = nameToChainId(process.env.NEXT_JS_DEFAULT_ETHEREUM_NETWORK_NAME)
  }

  return chainId
}
