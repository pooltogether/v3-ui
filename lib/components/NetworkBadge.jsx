import React from 'react'
import classnames from 'classnames'

import { NetworkIcon } from 'lib/components/NetworkIcon'
import { getNetworkNiceNameByChainId } from 'lib/utils/networks'

export const NetworkBadge = (props) => {
  const { chainId, vertical } = props
  let { className, sizeClasses, textClasses } = props

  const defaultClasses = 'mx-auto'
  textClasses = textClasses ?? 'text-xxs'
  sizeClasses = sizeClasses ?? 'w-4 h-4'
  className = className ?? defaultClasses

  return (
    <div className={classnames(className, `flex items-center ${vertical ? 'mt-2 flex-col' : ''}`)}>
      <NetworkIcon noMargin sizeClasses={sizeClasses} chainId={chainId} />

      <span className={`text-accent-1 capitalize ${textClasses} ${vertical ? 'my-1' : 'ml-1'}`}>
        {getNetworkNiceNameByChainId(chainId)}
      </span>
    </div>
  )
}
