import React from 'react'
import classnames from 'classnames'

import { NetworkIcon } from 'lib/components/NetworkIcon'
import { getNetworkNiceNameByChainId } from 'lib/utils/networks'
import { networkTextColorClassname } from 'lib/utils/networkColorClassnames'

export const NetworkBadge = (props) => {
  const { chainId, vertical } = props
  let { style, className, sizeClassName, textClassName } = props

  return (
    <div
      className={classnames(className, `flex items-center ${vertical ? 'mt-2 flex-col' : ''}`)}
      style={style}
    >
      <NetworkIcon noMargin sizeClassName={sizeClassName} chainId={chainId} />

      <span
        className={classnames(
          `capitalize ${textClassName} ${vertical ? 'my-1' : 'ml-2'}`,
          `text-${networkTextColorClassname(chainId)}`
        )}
      >
        {getNetworkNiceNameByChainId(chainId)}
      </span>
    </div>
  )
}

NetworkBadge.defaultProps = {
  className: 'mx-auto',
  textClassName: 'text-xxxs',
  sizeClassName: 'w-3 h-3'
}
