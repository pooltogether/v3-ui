import React from 'react'
import classnames from 'classnames'
import { useIsWalletOnSupportedNetwork } from '@pooltogether/hooks'
import { useOnboard } from '@pooltogether/bnc-onboard-hooks'
import { NetworkIcon } from '@pooltogether/react-components'

import { getNetworkNiceNameByChainId } from 'lib/utils/networks'
import { networkTextColorClassname } from 'lib/utils/networkColorClassnames'
import { SUPPORTED_NETWORKS } from 'lib/constants'

export function NetworkText (props) {
  const { openTransactions } = props

  const { network: walletChainId } = useOnboard()
  const supportedNetwork = useIsWalletOnSupportedNetwork(walletChainId, SUPPORTED_NETWORKS)

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
      <NetworkIcon sizeClassName='h-6 w-6 xs:h-4 xs:w-4' chainId={walletChainId} />
      <span className='capitalize hidden xs:block'>{networkName}</span>
    </button>
  )
}
