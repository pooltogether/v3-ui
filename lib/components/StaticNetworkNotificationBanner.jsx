import React, { useContext } from 'react'
import classnames from 'classnames'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { Modal } from 'lib/components/Modal'
import { chainIdToName } from 'lib/utils/chainIdToName'
import { networkColorClassname } from 'lib/utils/networkColorClassname'

export const StaticNetworkNotificationBanner = (props) => {
  const authControllerContext = useContext(AuthControllerContext)
  const { supportedNetwork, chainId, usersAddress } = authControllerContext

  if (!usersAddress) {
    return null
  }

  let networkName = null
  if (chainId && supportedNetwork) {
    networkName = <span
      className={classnames(
        networkColorClassname(chainId),
        'inline-block'
      )}
    >
      {chainIdToName(chainId)}
    </span>
  }

  const supportedNetworkClasses = `block bg-${networkColorClassname(chainId)}`
  const supportedNetworkNames = process.env.NEXT_JS_DEFAULT_ETHEREUM_NETWORK_NAME
  
  return <>
    <Modal
      visible={!supportedNetwork}
      header={<>
        Ethereum network mismatch
      </>}
    >
      Your Ethereum wallet is connected to the wrong network. Please set your network to:
      <div
        className='font-bold text-blue text-xl'
      >
        {supportedNetworkNames}
      </div>
    </Modal>
    
    <div
      className={classnames(
        'text-sm sm:text-base lg:text-lg sm:px-6 py-2',
        {
          'block bg-red': !supportedNetwork,
          [supportedNetworkClasses]: supportedNetwork,
        }
      )}
    >
      <div
        className='text-center text-white'
      >
        {!supportedNetwork ? <>
          Please connect to the supported network <span className='font-bold'>{supportedNetworkNames}</span>.
        </> : <>
          You are connected to <span className='font-bold'>{networkName}</span>.
        </>}
      </div>
    </div>
  </>
}