import React, { useContext } from 'react'
import classnames from 'classnames'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { chainIdToName } from 'lib/utils/chainIdToName'
import { networkColorClassname } from 'lib/utils/networkColorClassname'

export const NetworkText = (props) => {
  const authControllerContext = useContext(AuthControllerContext)
  const { supportedNetwork, chainId } = authControllerContext

  let networkName = null
  if (chainId && supportedNetwork) {
    networkName = chainIdToName(chainId)
  }

  return <>
    <div
      className={classnames(
        'inline-block capitalize',
        `bg-${networkColorClassname(chainId)}`,
        'text-xxs sm:text-xs px-2 sm:px-4 py-1 rounded-full -mr-3',
      )}
      style={{
        color: 'rgba(255, 255, 255, 0.4)'
      }}
    >
      {networkName}
    </div>
  </>
}