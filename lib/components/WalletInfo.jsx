import React, { useContext } from 'react'
import { useRouter } from 'next/router'
import classnames from 'classnames'

import { WalletContext } from 'lib/components/contextProviders/WalletContextProvider'
import { networkColorClassname } from 'lib/utils/networkColorClassname'
import { chainIdToName } from 'lib/utils/chainIdToName'

export const WalletInfo = () => {
  const router = useRouter()
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

      <button
        className='mt-16 rounded-full text-secondary border-2 border-secondary hover:text-inverse hover:bg-primary text-xxs sm:text-base py-1 sm:py-2 px-3 sm:px-6 trans tracking-wider outline-none focus:outline-none active:outline-none'
        onClick={(e) => {
          e.preventDefault()
          _onboard.walletReset()
          router.push('/?signIn=1', '/?signIn=1')
        }}
      >
        Sign out
      </button>
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
