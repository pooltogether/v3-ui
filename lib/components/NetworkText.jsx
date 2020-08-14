import React, { useContext } from 'react'
import classnames from 'classnames'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { chainIdToName } from 'lib/utils/chainIdToName'
import { networkColorClassname } from 'lib/utils/networkColorClassname'

export const NetworkText = (props) => {
  const { openTransactions } = props

  const authControllerContext = useContext(AuthControllerContext)
  const { supportedNetwork, chainId } = authControllerContext

  let networkName = null
  if (chainId && supportedNetwork) {
    networkName = chainIdToName(chainId)
  }

  return <>
    <button
      onClick={openTransactions}
      className={classnames(
        'tracking-wider	inline-flex items-center capitalize trans trans-fast',
        `hover:bg-green bg-${networkColorClassname(chainId)}`,
        'text-xxs sm:text-xs px-2 sm:px-4 my-1 rounded-full sm:-mr-4',
      )}
      style={{
        color: 'rgba(255, 255, 255, 0.7)',
        lineHeight: 0
      }}
    >
      {networkName}
    </button>
  </>
}