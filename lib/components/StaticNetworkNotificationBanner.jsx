import React, { useContext } from 'react'
import classnames from 'classnames'

import { SUPPORTED_NETWORKS } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { chainIdToName } from 'lib/utils/chainIdToName'
import { networkColorClassname } from 'lib/utils/networkColorClassname'

export const StaticNetworkNotificationBanner = (props) => {
  const authControllerContext = useContext(AuthControllerContext)
  const { usersAddress, chainId } = authControllerContext

  if (!usersAddress) {
    return null
  }

  const networkSupported = SUPPORTED_NETWORKS.includes(chainId)

  let networkName = null
  if (chainId && chainId !== 1) {
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

  return <div
    className={classnames(
      'text-sm sm:text-base lg:text-lg sm:px-6 py-4',
      {
        'block bg-red': !networkSupported,
        [unsupportedNetworkClasses]: networkSupported && chainId !== 1,
        'hidden': chainId === 1,
      }
    )}
  >
    <div
      className='text-center text-inverse'
    >
      You are connected to the {!networkSupported && 'unsupported network'} <span className='font-bold'>{networkName}</span> Testnet.
    </div>
  </div>
}