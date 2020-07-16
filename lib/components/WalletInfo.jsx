import React, { useContext } from 'react'
import classnames from 'classnames'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { Button } from 'lib/components/Button'
import { networkColorClassname } from 'lib/utils/networkColorClassname'
import { chainIdToName } from 'lib/utils/chainIdToName'
import { shortenAddress } from 'lib/utils/shortenAddress'

export const WalletInfo = () => {
  const authControllerContext = useContext(AuthControllerContext)
  const { usersAddress, chainId, walletName } = authControllerContext

  let content = null
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

  if (usersAddress && walletName) {
    content = <>
      <div
        className='flex flex-col sm:flex-row w-full sm:items-center justify-between'
      > 
        <div className='flex flex-col sm:flex-row text-base sm:text-lg lg:text-xl leading-snug text-default trans justify-start items-start text-left '>
          <div
            className='sm:mr-10 lg:mr-20'
          >
            <h2
              className='text-default-soft'
            >
              ETH Address
            </h2>
            <div
              className='overflow-ellipsis w-full no-underline lg:text-sm text-secondary mb-6 sm:mb-0'
            >
              <div className='block lg:hidden'>
                {shortenAddress(usersAddress)}
              </div>
              <div className='hidden lg:block'>
                {usersAddress}
              </div>
            </div>
          </div>

          <div
            className='sm:mr-10 lg:mr-20'
          >
            <h2
              className='text-default-soft'
            >
              Connected to
            </h2>
            <div
              className='rounded-lg capitalize lg:text-sm text-secondary mb-6 sm:mb-0'
            >
              {walletName}
            </div>
          </div>

          <div
            className='sm:mr-10 lg:mr-20'
          >
            <h2
              className='text-default-soft'
            >
              Network
            </h2>
            <div
              className='rounded-lg capitalize lg:text-sm text-secondary mb-6 sm:mb-0'
            >
              {networkName}
            </div>
          </div>
  {/* 
          {magic && signedIn && <>
            <div className='mt-16'>
              <Button
                outline
                onClick={authControllerContext.signOut}
              >
                Sign out
            </Button>
            </div>
          </>} */}
        </div>

        <div className='mt-16 sm:mt-0'>
          <Button 
            outline
            onClick={authControllerContext.signOut}
          >
            Sign out
          </Button>
        </div>
      </div>
    </>
  }

  return content

}
