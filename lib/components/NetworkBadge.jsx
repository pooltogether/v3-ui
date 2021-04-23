import React from 'react'

import { NetworkIcon } from 'lib/components/NetworkIcon'
import { getNetworkNiceNameByChainId } from 'lib/utils/networks'

export const NetworkBadge = (props) => {
  const { chainId, vertical } = props
  let { sizeClasses, textClasses } = props

  textClasses = textClasses ?? 'text-xxs'
  sizeClasses = sizeClasses ?? 'w-4 h-4'

  return (
    <div className={`mx-auto flex items-center ${vertical ? 'mt-2 flex-col' : ''}`}>
      <NetworkIcon noMargin sizeClasses={sizeClasses} chainId={chainId} />

      <span className={`text-accent-1 capitalize ${textClasses} ${vertical ? 'my-1' : 'ml-1'}`}>
        {getNetworkNiceNameByChainId(chainId)}
      </span>
    </div>
  )
}
