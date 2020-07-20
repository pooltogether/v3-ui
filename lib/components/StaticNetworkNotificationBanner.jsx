import React, { useContext } from 'react'
import classnames from 'classnames'

import { SUPPORTED_CHAIN_IDS } from 'lib/constants'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { chainIdToName } from 'lib/utils/chainIdToName'
import { networkColorClassname } from 'lib/utils/networkColorClassname'

export const StaticNetworkNotificationBanner = (props) => {
  const authControllerContext = useContext(AuthControllerContext)
  const { usersAddress } = authControllerContext

  const poolDataContext = useContext(PoolDataContext)
  const { chainId, unsupportedNetwork } = poolDataContext

  if (!usersAddress) {
    return null
  }

  const networkSupported = !unsupportedNetwork

  let networkName = null
  if (chainId) {
    networkName = <span
      className={classnames(
        networkColorClassname(chainId),
        'inline-block'
      )}
    >
      {chainIdToName(chainId)}
    </span>
  }

  const unsupportedNetworkClasses = `block bg-${networkColorClassname(chainId)}`
  const supportedNetworkName = process.env.NEXT_JS_DEFAULT_ETHEREUM_NETWORK_NAME

  return <div
    className={classnames(
      'text-sm sm:text-base lg:text-lg sm:px-6 py-4',
      {
        'block bg-red': !networkSupported,
        [unsupportedNetworkClasses]: networkSupported,
      }
    )}
  >
    <div
      className='text-center text-white'
    >
      {!networkSupported ? <>
        Please connect to the supported network <span className='font-bold'>{supportedNetworkName}</span>.
      </> : <>
        You are connected to <span className='font-bold'>{networkName}</span>.
      </>}
    </div>
  </div>
}