import React, { useContext } from 'react'
import classnames from 'classnames'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { NetworkIcon } from 'lib/components/NetworkIcon'
import { getNetworkNiceNameByChainId } from 'lib/utils/networks'
import { useWalletNetwork } from 'lib/hooks/useWalletNetwork'
import { networkTextColorClassname } from 'lib/utils/networkColorClassnames'
import useScreenSize, { ScreenSize } from 'lib/hooks/useScreenSize'

export function NetworkText(props) {
  const { openTransactions } = props

  const { supportedNetwork } = useContext(AuthControllerContext)
  const { walletChainId } = useWalletNetwork()
  const screenSize = useScreenSize()

  let networkName = null
  if (walletChainId && supportedNetwork) {
    networkName = getNetworkNiceNameByChainId(walletChainId)
  }

  return (
    <button
      onClick={openTransactions}
      className={classnames(
        'tracking-wide flex items-center capitalize trans trans-fast font-bold',
        `bg-default hover:bg-body text-${networkTextColorClassname(
          walletChainId
        )} hover:text-inverse border border-accent-4 hover:border-primary`,
        'text-xxs sm:text-xs px-2 xs:px-4 rounded-full h-8 mb-1 sm:mb-0'
      )}
    >
      <NetworkIcon
        noMargin={screenSize === ScreenSize.xs}
        sizeClasses='h-4 w-4'
        chainId={walletChainId}
      />
      <span className='capitalize hidden xs:block'>{networkName}</span>
    </button>
  )
}
