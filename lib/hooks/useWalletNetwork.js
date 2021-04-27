import { useContext } from 'react'
import { getChain } from '@pooltogether/evm-chains-extended'

import { SUPPORTED_NETWORKS } from 'lib/constants'
import { WalletContext } from 'lib/components/contextProviders/WalletContextProvider'
import { NETWORK } from 'lib/utils/networks'

export const useWalletNetwork = (props) => {
  const walletContext = useContext(WalletContext)
  const walletChainId = walletContext.onboard?.getState().network || NETWORK.mainnet

  const walletConnected =
    Boolean(walletChainId) && Boolean(walletContext.onboard?.getState().wallet.name)
  const walletOnUnsupportedNetwork = walletConnected && !SUPPORTED_NETWORKS.includes(walletChainId)

  let walletNetworkData = {}
  try {
    walletNetworkData = getChain(walletChainId)
  } catch (error) {}

  return {
    walletChainId,
    walletOnUnsupportedNetwork,
    walletConnected,
    walletName: walletContext.onboardWallet?.name,
    walletNetworkShortName: walletNetworkData?.name || 'unknown network',
    walletNetwork: {
      ...walletNetworkData
    }
  }
}
