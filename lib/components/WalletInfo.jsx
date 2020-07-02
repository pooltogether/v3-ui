import React, { useContext } from 'react'
import classnames from 'classnames'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { WalletContext } from 'lib/components/contextProviders/WalletContextProvider'
import { Button } from 'lib/components/Button'
import { networkColorClassname } from 'lib/utils/networkColorClassname'
import { chainIdToName } from 'lib/utils/chainIdToName'

export const WalletInfo = () => {
  const authControllerContext = useContext(AuthControllerContext)

  const walletContext = useContext(WalletContext)
  const { _onboard } = walletContext || {}
  const currentState = _onboard.getState()

  let address
  let walletName
  let chainId = 1

  if (currentState) {
    address = currentState.address
    walletName = currentState.wallet.name
    chainId = currentState.appNetworkId
  }

  let innerContent = null
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

  if (address && walletName) {
    innerContent = <>
      <div className='text-base sm:text-lg lg:text-xl leading-snug text-default trans'>
        <h2
          className='text-default-soft mt-10'
        >
          ETH Address:
        </h2>
        <div
          className='overflow-ellipsis w-full no-underline'
        >
          {address}
        </div>

        <h2
          className='text-default-soft mt-10'
        >
          Network info:
        </h2>
        <div
          className='rounded-lg sm:text-purple-500 capitalize'
        >
          {walletName} {networkName}
        </div>
      </div>

      <div className='mt-16'>
        <Button 
          outline
          onClick={authControllerContext.signOut}
        >
          Sign out
        </Button>
      </div>
    </>
  }

  return <>
    <div
      className='relative flex flex-col justify-center items-center'
    > 
      {innerContent}
    </div>
  </>

}
