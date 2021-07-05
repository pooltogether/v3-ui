import React from 'react'
import classnames from 'classnames'

import { NetworkIcon } from 'lib/components/NetworkIcon'
import { getNetworkNiceNameByChainId } from 'lib/utils/networks'
import { networkTextColorClassname } from 'lib/utils/networkColorClassnames'

export const NetworkBadge = (props) => {
  const { chainId, vertical } = props
  let { style, className, sizeClasses, textClasses } = props

  const defaultClasses = `mx-auto`
  textClasses = textClasses ?? 'text-xxxs'
  sizeClasses = sizeClasses ?? 'w-3 h-3'
  className = className ?? defaultClasses

  return (
    <div
      className={classnames(className, `flex items-center ${vertical ? 'mt-2 flex-col' : ''}`)}
      style={style}
    >
      <NetworkIcon noMargin sizeClasses={sizeClasses} chainId={chainId} />

      <span
        className={classnames(
          `capitalize ${textClasses} ${vertical ? 'my-1' : 'ml-2'}`,
          `text-${networkTextColorClassname(chainId)}`
        )}
      >
        {getNetworkNiceNameByChainId(chainId)}
      </span>
    </div>
  )
}
