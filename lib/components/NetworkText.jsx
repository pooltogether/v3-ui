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
        'text-xxs sm:text-xs pl-6 pr-2 py-3 rounded-full -ml-5',
      )}
      style={{
        height: 32
      }}
    >
      {networkName}
    </button>
  </>
}