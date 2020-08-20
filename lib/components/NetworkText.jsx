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
        'font-bold tracking-wide flex items-center capitalize trans trans-fast',
        `bg-default hover:bg-card text-${networkColorClassname(chainId)} hover:text-inverse border-2 border-accent-3`,
        'text-xxs sm:text-xs px-2 sm:px-3 py-1 rounded-full mr-2',
      )}
    >
      {networkName}
    </button>
  </>
}