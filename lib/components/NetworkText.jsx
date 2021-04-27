import React, { useContext } from 'react'
import classnames from 'classnames'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { NetworkIcon } from 'lib/components/NetworkIcon'
import { chainIdToNetworkName } from 'lib/utils/chainIdToNetworkName'
import { useWalletNetwork } from 'lib/hooks/useWalletNetwork'
import { networkTextColorClassname } from 'lib/utils/networkColorClassnames'

export function NetworkText(props) {
  const { openTransactions } = props

  const { supportedNetwork } = useContext(AuthControllerContext)
  const { walletChainId } = useWalletNetwork()

  let networkName = null
  if (walletChainId && supportedNetwork) {
    networkName = chainIdToNetworkName(walletChainId)
  }

  return (
    <>
      <button
        onClick={openTransactions}
        className={classnames(
          'tracking-wide flex items-center capitalize trans trans-fast',
          `bg-default hover:bg-body text-${networkTextColorClassname(
            walletChainId
          )} hover:text-inverse border border-accent-4 hover:border-primary`,
          'text-xxs sm:text-xs px-2 xs:px-4 rounded-full h-8 mx-1 mb-1'
        )}
      >
        <NetworkIcon sizeClasses='h-4 w-4' chainId={walletChainId} />
        <span className='capitalize'>{networkName}</span>
      </button>
    </>
  )
}
