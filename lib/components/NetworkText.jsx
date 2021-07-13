import React from 'react'
import classnames from 'classnames'
import { useIsWalletOnSupportedNetwork, useOnboard } from '@pooltogether/hooks'

import { NetworkIcon } from 'lib/components/NetworkIcon'
import { getNetworkNiceNameByChainId } from 'lib/utils/networks'
import { networkTextColorClassname } from 'lib/utils/networkColorClassnames'
import useScreenSize, { ScreenSize } from 'lib/hooks/useScreenSize'
import { SUPPORTED_NETWORKS } from 'lib/constants'

export function NetworkText(props) {
  const { openTransactions } = props

  const supportedNetwork = useIsWalletOnSupportedNetwork(SUPPORTED_NETWORKS)
  const { network: walletChainId } = useOnboard()
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
        'text-xxs sm:text-xs xs:px-4 rounded-full h-8 mb-1 sm:mb-0'
      )}
    >
      <NetworkIcon
        noMargin={screenSize === ScreenSize.xs}
        sizeClassName='h-6 w-6 xs:h-4 xs:w-4'
        chainId={walletChainId}
      />
      <span className='capitalize hidden xs:block'>{networkName}</span>
    </button>
  )
}
